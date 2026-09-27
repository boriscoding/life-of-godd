"use client";

import { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/Topbar";
import Badge from "../../components/Badge";
import RequirePermission from "../../components/RequirePermission";
import { useAuth } from "@/app/contexte/AuthContext";
import { api } from "@/app/lib/api";
import { formatFCFA } from "../../lib/mock-data";
import { Plus, Eye } from "lucide-react";

export type { UserSession } from "@/app/contexte/AuthContext";

// Statuts reels du backend (enum BookingStatus dans schema.prisma)
type BookingApiStatus = "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";

interface BookingApi {
  id: string;
  reference: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  startDate: string;
  endDate: string;
  totalAmount: number | string;
  status: BookingApiStatus;
}

interface PropertyApi {
  id: string;
  name: string;
}

// Correspondance statut backend -> libelle affiche (garde la coherence
// avec les couleurs deja definies dans le composant Badge).
const STATUS_LABELS: Record<BookingApiStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  checked_in: "En cours",
  checked_out: "Terminé",
  cancelled: "Annulé",
};

const filtres = ["Toutes", "Confirmé", "En attente", "En cours", "Terminé", "Annulé"] as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

function formatDateRange(start: string, end: string): string {
  try {
    const s = new Date(start);
    const e = new Date(end);
    const fmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
    const fmtEnd = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    return `${fmt.format(s)} → ${fmtEnd.format(e)}`;
  } catch {
    return "-";
  }
}

// Le backend renvoie parfois une liste paginee { data, meta } et parfois
// un tableau simple selon l'endpoint : on gere les deux formes sans
// supposer laquelle sera utilisee.
function extractArray<T>(payload: any): T[] {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function ReservationsPage() {
  const [filtre, setFiltre] = useState<(typeof filtres)[number]>("Toutes");
  const { can } = useAuth();
  const peutModifier = can("reservations:edit");

  const [bookings, setBookings] = useState<BookingApi[]>([]);
  const [properties, setProperties] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [bookingsRes, propertiesRes] = await Promise.all([
          api.get("/bookings", { params: { limit: 100 } }),
          api.get("/properties", { params: { limit: 200 } }),
        ]);

        if (cancelled) return;

        const bookingList = extractArray<BookingApi>(bookingsRes.data);
        const propertyList = extractArray<PropertyApi>(propertiesRes.data);

        const propertyMap: Record<string, string> = {};
        propertyList.forEach((p) => {
          propertyMap[p.id] = p.name;
        });

        setBookings(bookingList);
        setProperties(propertyMap);
      } catch (err: any) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Impossible de charger les réservations.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const data = useMemo(() => {
    if (filtre === "Toutes") return bookings;
    return bookings.filter((b) => STATUS_LABELS[b.status] === filtre);
  }, [bookings, filtre]);

  const compteurs = useMemo(() => {
    const base: Record<string, number> = {
      Confirmé: 0,
      "En attente": 0,
      "En cours": 0,
      Terminé: 0,
      Annulé: 0,
    };
    bookings.forEach((b) => {
      const label = STATUS_LABELS[b.status];
      if (label in base) base[label] += 1;
    });
    return base;
  }, [bookings]);

  return (
    <RequirePermission permission="reservations:view">
      <Topbar title="Réservations" />

      <div className="space-y-5 px-5 pb-10 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-em-text">
              Suivi des séjours
            </h2>
            <p className="text-sm text-em-text-muted">
              Consultez et gérez toutes les réservations de la Résidence Émeraude.
            </p>
          </div>
          {peutModifier && (
            <button className="flex items-center justify-center gap-2 rounded-lg bg-em-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-em-accent-dark">
              <Plus size={16} />
              Nouvelle réservation
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {(Object.keys(compteurs) as (keyof typeof compteurs)[]).map((key) => (
            <div key={key} className="rounded-xl border border-em-border bg-em-card p-4">
              <p className="text-xs text-em-text-muted">{key}</p>
              <p className="mt-1 font-display text-2xl font-semibold text-em-text">
                {compteurs[key]}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {filtres.map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filtre === f
                  ? "bg-em-sidebar text-white"
                  : "border border-em-border bg-white text-em-text-muted hover:text-em-text"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-em-border bg-em-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="text-xs text-em-text-muted">
                  <th className="px-5 py-4 font-medium">Réf</th>
                  <th className="px-2 py-4 font-medium">Client</th>
                  <th className="px-2 py-4 font-medium">Bien</th>
                  <th className="px-2 py-4 font-medium">Dates</th>
                  <th className="px-2 py-4 font-medium">Montant</th>
                  <th className="px-2 py-4 font-medium">Statut</th>
                  {peutModifier && (
                    <th className="px-5 py-4 font-medium text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-em-text-muted">
                      Chargement des réservations...
                    </td>
                  </tr>
                )}

                {!loading &&
                  data.map((r) => (
                    <tr key={r.id} className="border-t border-em-border">
                      <td className="px-5 py-4 text-em-text-muted">{r.reference}</td>
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-em-sidebar text-[10px] font-semibold text-white">
                            {getInitials(r.guestName)}
                          </span>
                          <span className="text-em-text">{r.guestName}</span>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-em-text">
                        {properties[r.propertyId] ?? "—"}
                      </td>
                      <td className="px-2 py-4 text-em-text-muted">
                        {formatDateRange(r.startDate, r.endDate)}
                      </td>
                      <td className="px-2 py-4 font-medium text-em-text">
                        {formatFCFA(Number(r.totalAmount))}
                      </td>
                      <td className="px-2 py-4">
                        <Badge>{STATUS_LABELS[r.status]}</Badge>
                      </td>
                      {peutModifier && (
                        <td className="px-5 py-4 text-right">
                          <button
                            aria-label="Voir le détail"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-em-border text-em-text hover:bg-em-bg"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}

                {!loading && data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-em-text-muted">
                      Aucune réservation dans cette catégorie.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RequirePermission>
  );
}