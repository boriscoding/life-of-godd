"use client";

import Topbar from "../../components/Topbar";
import Badge from "../../components/Badge";
import RequirePermission from "../../components/RequirePermission";
import { useAuth } from "../../lib/auth-context";
import { clients, formatFCFA } from "../../lib/mock-data";
import { Plus, Mail, Phone } from "lucide-react";

export default function ClientsPage() {
  const { can } = useAuth();
  const peutModifier = can("clients:edit");

  return (
    <RequirePermission permission="clients:view">
      <Topbar title="Clients" />

      <div className="space-y-5 px-5 pb-10 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-em-text">
              Répertoire des clients
            </h2>
            <p className="text-sm text-em-text-muted">
              L&apos;historique et les coordonnées de tous les clients de la Résidence Émeraude.
            </p>
          </div>
          {peutModifier && (
            <button className="flex items-center justify-center gap-2 rounded-lg bg-em-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-em-accent-dark">
              <Plus size={16} />
              Ajouter un client
            </button>
          )}
        </div>

        <div className="rounded-xl border border-em-border bg-em-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="text-xs text-em-text-muted">
                  <th className="px-5 py-4 font-medium">Client</th>
                  <th className="px-2 py-4 font-medium">Contact</th>
                  <th className="px-2 py-4 font-medium">Réservations</th>
                  <th className="px-2 py-4 font-medium">Total dépensé</th>
                  <th className="px-2 py-4 font-medium">Statut</th>
                  <th className="px-5 py-4 font-medium">Client depuis</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-t border-em-border">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-em-sidebar text-xs font-semibold text-white">
                          {c.initiales}
                        </span>
                        <span className="font-medium text-em-text">{c.nom}</span>
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <div className="space-y-1 text-xs text-em-text-muted">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} />
                          {c.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} />
                          {c.telephone}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4 text-em-text">{c.reservations}</td>
                    <td className="px-2 py-4 font-medium text-em-text">
                      {formatFCFA(c.totalDepense)}
                    </td>
                    <td className="px-2 py-4">
                      <Badge>{c.statut}</Badge>
                    </td>
                    <td className="px-5 py-4 text-em-text-muted">{c.depuis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RequirePermission>
  );
}
