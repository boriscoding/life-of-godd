"use client";

import { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/Topbar";
import RequirePermission from "../../components/RequirePermission";
import { formatFCFA } from "../../lib/mock-data";
import { api } from "@/app/lib/api";
import { Download, Calendar } from "lucide-react";

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalProperties: number;
  occupancyRate: number;
}

interface BookingApi {
  startDate: string;
  endDate: string;
  status: string;
}

function extractArray<T>(payload: any): T[] {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function RapportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<BookingApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      api.get("/dashboard/stats"),
      api.get("/bookings", { params: { limit: 200 } }),
    ])
      .then(([statsRes, bookingsRes]) => {
        if (cancelled) return;
        const statsData = statsRes.data?.data || statsRes.data;
        setStats(statsData);
        setBookings(extractArray<BookingApi>(bookingsRes.data));
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Impossible de charger les statistiques.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Le backend n'expose pas encore de duree moyenne de sejour (statisticsService
  // est un stub sur ce point) : on la calcule ici a partir des reservations
  // non annulees deja chargees.
  const dureeMoyenne = useMemo(() => {
    const valides = bookings.filter((b) => b.status !== "cancelled");
    if (valides.length === 0) return 0;

    const totalNuits = valides.reduce((sum, b) => {
      const nights = (new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24);
      return sum + Math.max(0, nights);
    }, 0);

    return totalNuits / valides.length;
  }, [bookings]);

  return (
    <RequirePermission permission="rapports:view">
      <Topbar title="Rapports &amp; Statistiques" subtitle="Analyse des performances financières et taux d'occupation." />

      <div className="space-y-6 px-5 pb-10 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-lg border border-em-border bg-white px-3.5 py-2 text-sm text-em-text">
            <Calendar size={16} className="text-em-text-muted" />
            <span>Période : Toutes les réservations</span>
          </div>
          <button
            disabled
            title="Export pas encore disponible côté API"
            className="flex items-center justify-center gap-2 rounded-lg bg-em-accent px-4 py-2 text-sm font-medium text-white opacity-50"
          >
            <Download size={16} />
            Exporter le rapport (PDF/Excel)
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-sm text-em-text-muted">Chargement des statistiques...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-em-border bg-em-card p-5">
              <p className="text-xs text-em-text-muted">Revenu Total</p>
              <p className="mt-2 text-2xl font-semibold text-em-text">
                {formatFCFA(stats?.totalRevenue ?? 0)}
              </p>
              <p className="mt-2 text-xs text-em-text-muted">
                Somme des paiements au statut "completed"
              </p>
            </div>

            <div className="rounded-xl border border-em-border bg-em-card p-5">
              <p className="text-xs text-em-text-muted">Taux d'occupation moyen</p>
              <p className="mt-2 text-2xl font-semibold text-em-text">
                {stats?.occupancyRate ?? 0} %
              </p>
              <p className="mt-2 text-xs text-em-text-muted">
                Calcul pas encore implémenté côté backend — valeur non fiable pour l'instant
              </p>
            </div>

            <div className="rounded-xl border border-em-border bg-em-card p-5">
              <p className="text-xs text-em-text-muted">Réservations effectuées</p>
              <p className="mt-2 text-2xl font-semibold text-em-text">{stats?.totalBookings ?? 0}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-em-text-muted">
                <span>
                  Durée moyenne : {dureeMoyenne > 0 ? `${dureeMoyenne.toFixed(1)} nuits` : "—"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequirePermission>
  );
}