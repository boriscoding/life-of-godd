"use client";

import { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/Topbar";
import RequirePermission from "../../components/RequirePermission";
import { useAuth } from "@/app/contexte/AuthContext";
import { api } from "@/app/lib/api";
import { Lock, ChevronLeft, ChevronRight, ChevronDown, X, Trash2 } from "lucide-react";

export type { UserSession } from "@/app/contexte/AuthContext";

const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const moisNoms = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const statutStyle: Record<string, string> = {
  libre: "border-em-border bg-white",
  occupe: "bg-[#fbe7e4] text-[#c0392b] border-[#f4cdc8]",
  maintenance: "bg-[#eeece4] text-[#6b6b60] border-[#ddd8ca]",
};

interface PropertyApi {
  id: string;
  name: string;
}

interface BookingApi {
  id: string;
  reference: string;
  propertyId: string;
  guestName: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface CalendarBlockApi {
  id: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  type: "maintenance" | "private" | "other";
}

function extractArray<T>(payload: any): T[] {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

// true si `day` (dans le mois/annee affiches) tombe dans l'intervalle [start, end)
function dayInRange(year: number, month: number, day: number, start: string, end: string): boolean {
  const d = new Date(year, month, day);
  const s = new Date(start);
  const e = new Date(end);
  return d >= new Date(s.getFullYear(), s.getMonth(), s.getDate()) && d < new Date(e.getFullYear(), e.getMonth(), e.getDate());
}

// Grille du mois : cases vides pour completer la premiere semaine (Lundi = index 0)
function buildGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = dimanche
  const offset = (firstDay + 6) % 7; // decale pour que Lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (number | null)[] = Array.from({ length: offset }, () => null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  return grid;
}

export default function CalendrierPage() {
  const { can } = useAuth();
  const peutModifier = can("calendrier:edit");

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexe

  const [properties, setProperties] = useState<PropertyApi[]>([]);
  const [propertyId, setPropertyId] = useState<string>("");
  const [bookings, setBookings] = useState<BookingApi[]>([]);
  const [blocks, setBlocks] = useState<CalendarBlockApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockForm, setBlockForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    type: "maintenance" as CalendarBlockApi["type"],
  });
  const [blockSubmitting, setBlockSubmitting] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);

  // Chargement initial des biens
  useEffect(() => {
    let cancelled = false;
    api
      .get("/properties", { params: { limit: 200 } })
      .then((res) => {
        if (cancelled) return;
        const list = extractArray<PropertyApi>(res.data);
        setProperties(list);
        if (list.length > 0) setPropertyId(list[0].id);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Impossible de charger les biens.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Chargement des reservations + blocages pour le bien selectionne
  useEffect(() => {
    if (!propertyId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      api.get("/bookings", { params: { propertyId, limit: 200 } }),
      api.get("/calendar/blocks", { params: { propertyId } }),
    ])
      .then(([bookingsRes, blocksRes]) => {
        if (cancelled) return;
        setBookings(extractArray<BookingApi>(bookingsRes.data));
        setBlocks(extractArray<CalendarBlockApi>(blocksRes.data));
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Impossible de charger le calendrier.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const grille = useMemo(() => buildGrid(year, month), [year, month]);

  const infosParJour = useMemo(() => {
    const map: Record<number, { statut: "occupe" | "maintenance"; label: string }> = {};

    grille.forEach((jour) => {
      if (jour === null) return;

      const booking = bookings.find(
        (b) => b.status !== "cancelled" && dayInRange(year, month, jour, b.startDate, b.endDate),
      );
      if (booking) {
        map[jour] = { statut: "occupe", label: booking.guestName };
        return;
      }

      const block = blocks.find((b) => dayInRange(year, month, jour, b.startDate, b.endDate));
      if (block) {
        map[jour] = { statut: "maintenance", label: block.reason || block.type };
      }
    });

    return map;
  }, [grille, bookings, blocks, year, month]);

  const changerMois = (delta: number) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleBlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlockError(null);

    if (!blockForm.startDate || !blockForm.endDate || blockForm.reason.trim().length < 3) {
      setBlockError("Renseignez une période et un motif d'au moins 3 caractères.");
      return;
    }

    setBlockSubmitting(true);
    try {
      await api.post("/calendar/block", {
        propertyId,
        startDate: new Date(blockForm.startDate).toISOString(),
        endDate: new Date(blockForm.endDate).toISOString(),
        reason: blockForm.reason.trim(),
        type: blockForm.type,
      });

      const blocksRes = await api.get("/calendar/blocks", { params: { propertyId } });
      setBlocks(extractArray<CalendarBlockApi>(blocksRes.data));

      setShowBlockModal(false);
      setBlockForm({ startDate: "", endDate: "", reason: "", type: "maintenance" });
    } catch (err: any) {
      setBlockError(err.response?.data?.message || "Impossible de bloquer cette période.");
    } finally {
      setBlockSubmitting(false);
    }
  };

  const handleUnblock = async (blockId: string) => {
    try {
      await api.delete(`/calendar/block/${blockId}`);
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Impossible de débloquer cette période.");
    }
  };

  return (
    <RequirePermission permission="calendrier:view">
      <Topbar title="Calendrier d'Occupation" />

      <div className="space-y-5 px-5 pb-10 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full appearance-none rounded-lg border border-em-border bg-white px-4 py-2.5 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-em-text-muted"
            />
          </div>

          <div className="flex items-center gap-3">
            {peutModifier && (
              <button
                onClick={() => setShowBlockModal(true)}
                disabled={!propertyId}
                className="flex items-center gap-2 rounded-lg border border-em-accent px-4 py-2.5 text-sm font-medium text-em-accent hover:bg-em-accent/5 disabled:opacity-50"
              >
                <Lock size={15} />
                Bloquer des dates
              </button>
            )}

            <div className="hidden items-center gap-4 text-xs text-em-text-muted md:flex">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-em-green" /> Disponible
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-em-red" /> Occupé
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-em-text-muted" /> Maintenance
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-em-border bg-em-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => changerMois(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-em-border text-em-text hover:bg-em-bg"
            >
              <ChevronLeft size={16} />
            </button>
            <h2 className="font-display text-lg font-semibold text-em-text">
              {moisNoms[month]} {year}
            </h2>
            <button
              onClick={() => changerMois(1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-em-border text-em-text hover:bg-em-bg"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-em-text-muted">Chargement du calendrier...</div>
          ) : (
            <div className="grid grid-cols-7 gap-2 text-xs text-em-text-muted">
              {joursSemaine.map((j) => (
                <div key={j} className="pb-2 text-center font-medium">
                  {j}
                </div>
              ))}

              {grille.map((jour, i) => {
                if (jour === null) return <div key={`empty-${i}`} />;
                const info = infosParJour[jour];
                return (
                  <div
                    key={i}
                    className={`min-h-[64px] rounded-lg border p-2 text-left ${
                      info ? statutStyle[info.statut] : statutStyle.libre
                    }`}
                  >
                    <p className="text-sm font-medium">{jour}</p>
                    {info && <p className="mt-1 truncate text-[11px] leading-tight">{info.label}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {peutModifier && blocks.length > 0 && (
          <div className="rounded-xl border border-em-border bg-em-card p-5">
            <h3 className="mb-3 font-display text-sm font-semibold text-em-text">
              Périodes bloquées pour ce bien
            </h3>
            <div className="space-y-2">
              {blocks.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-lg border border-em-border px-4 py-2.5 text-sm"
                >
                  <div>
                    <span className="font-medium text-em-text">
                      {new Date(b.startDate).toLocaleDateString("fr-FR")} → {new Date(b.endDate).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="ml-2 text-em-text-muted">{b.reason}</span>
                  </div>
                  <button
                    onClick={() => handleUnblock(b.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-em-text-muted hover:bg-red-50 hover:text-red-600"
                    aria-label="Débloquer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-em-text">Bloquer des dates</h3>
              <button onClick={() => setShowBlockModal(false)} className="text-em-text-muted hover:text-em-text">
                <X size={18} />
              </button>
            </div>

            {blockError && (
              <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                {blockError}
              </div>
            )}

            <form onSubmit={handleBlockSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-em-text-muted">Du</label>
                  <input
                    type="date"
                    required
                    value={blockForm.startDate}
                    onChange={(e) => setBlockForm({ ...blockForm, startDate: e.target.value })}
                    className="w-full rounded-lg border border-em-border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-em-text-muted">Au</label>
                  <input
                    type="date"
                    required
                    value={blockForm.endDate}
                    onChange={(e) => setBlockForm({ ...blockForm, endDate: e.target.value })}
                    className="w-full rounded-lg border border-em-border px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-em-text-muted">Type</label>
                <select
                  value={blockForm.type}
                  onChange={(e) => setBlockForm({ ...blockForm, type: e.target.value as CalendarBlockApi["type"] })}
                  className="w-full rounded-lg border border-em-border px-3 py-2 text-sm"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="private">Usage privé</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-em-text-muted">Motif</label>
                <input
                  type="text"
                  required
                  minLength={3}
                  placeholder="Ex: Travaux de peinture"
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  className="w-full rounded-lg border border-em-border px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={blockSubmitting}
                className="w-full rounded-lg bg-em-accent py-2.5 text-sm font-medium text-white hover:bg-em-accent-dark disabled:opacity-50"
              >
                {blockSubmitting ? "Blocage..." : "Bloquer cette période"}
              </button>
            </form>
          </div>
        </div>
      )}
    </RequirePermission>
  );
}