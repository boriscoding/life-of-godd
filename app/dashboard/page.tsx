"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "../components/Topbar";
import { api } from "@/app/lib/api";
import { formatFCFA } from "../lib/mock-data";
import { TrendingUp, Home, Calendar, Wallet } from "lucide-react";

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalProperties: number;
  occupancyRate: number;
}

export default function DashboardHomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/dashboard/stats")
      .then((res) => {
        if (cancelled) return;
        setStats(res.data?.data || res.data);
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

  const cards = [
    {
      label: "Revenu total",
      value: stats ? formatFCFA(stats.totalRevenue) : "—",
      icon: Wallet,
      href: "/dashboard/rapports",
    },
    {
      label: "Réservations",
      value: stats ? String(stats.totalBookings) : "—",
      icon: Calendar,
      href: "/dashboard/reservations",
    },
    {
      label: "Biens actifs",
      value: stats ? String(stats.totalProperties) : "—",
      icon: Home,
      href: "/dashboard/biens",
    },
    {
      label: "Taux d'occupation",
      value: stats ? `${stats.occupancyRate} %` : "—",
      icon: TrendingUp,
      href: "/dashboard/rapports",
    },
  ];

  return (
    <>
      <Topbar title="Tableau de bord" subtitle="Vue d'ensemble de la Résidence Émeraude." />

      <div className="space-y-6 px-5 pb-10 sm:px-8">
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-sm text-em-text-muted">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="rounded-xl border border-em-border bg-em-card p-5 transition-colors hover:border-em-accent/40"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-em-text-muted">{c.label}</p>
                  <c.icon size={16} className="text-em-text-muted" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-em-text">{c.value}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-em-border bg-em-card p-5">
          <h2 className="font-display text-base font-semibold text-em-text">Accès rapide</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/dashboard/reservations"
              className="rounded-lg border border-em-border px-4 py-2 text-sm text-em-text hover:bg-em-bg"
            >
              Voir les réservations
            </Link>
            <Link
              href="/dashboard/paiements"
              className="rounded-lg border border-em-border px-4 py-2 text-sm text-em-text hover:bg-em-bg"
            >
              Voir les paiements
            </Link>
            <Link
              href="/dashboard/biens"
              className="rounded-lg border border-em-border px-4 py-2 text-sm text-em-text hover:bg-em-bg"
            >
              Gérer les biens
            </Link>
            <Link
              href="/dashboard/calendrier"
              className="rounded-lg border border-em-border px-4 py-2 text-sm text-em-text hover:bg-em-bg"
            >
              Calendrier d'occupation
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}