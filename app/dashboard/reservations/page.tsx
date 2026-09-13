"use client";

import { useState } from "react";
import Topbar from "../../components/Topbar";
import Badge from "../../components/Badge";
import RequirePermission from "../../components/RequirePermission";
import { useAuth } from "../../lib/auth-context";
import { reservations, formatFCFA, StatutReservation } from "../../lib/mock-data";
import { Plus, Eye } from "lucide-react";

const filtres: (StatutReservation | "Toutes")[] = [
  "Toutes",
  "Confirmé",
  "En attente",
  "Terminé",
  "Annulé",
];

export default function ReservationsPage() {
  const [filtre, setFiltre] = useState<(typeof filtres)[number]>("Toutes");
  const { can } = useAuth();
  const peutModifier = can("reservations:edit");

  const data =
    filtre === "Toutes" ? reservations : reservations.filter((r) => r.statut === filtre);

  const compteurs = {
    Confirmé: reservations.filter((r) => r.statut === "Confirmé").length,
    "En attente": reservations.filter((r) => r.statut === "En attente").length,
    Terminé: reservations.filter((r) => r.statut === "Terminé").length,
    Annulé: reservations.filter((r) => r.statut === "Annulé").length,
  };

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

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
                {data.map((r) => (
                  <tr key={r.ref} className="border-t border-em-border">
                    <td className="px-5 py-4 text-em-text-muted">{r.ref}</td>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-em-sidebar text-[10px] font-semibold text-white">
                          {r.clientInitiales}
                        </span>
                        <span className="text-em-text">{r.client}</span>
                      </div>
                    </td>
                    <td className="px-2 py-4 text-em-text">{r.bien}</td>
                    <td className="px-2 py-4 text-em-text-muted">{r.dates}</td>
                    <td className="px-2 py-4 font-medium text-em-text">
                      {formatFCFA(r.montant)}
                    </td>
                    <td className="px-2 py-4">
                      <Badge>{r.statut}</Badge>
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
                {data.length === 0 && (
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
