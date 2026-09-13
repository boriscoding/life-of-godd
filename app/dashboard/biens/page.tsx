"use client";

import { useState } from "react";
import Topbar from "../../components/Topbar";
import Badge from "../../components/Badge";
import RequirePermission from "../../components/RequirePermission";
import { useAuth } from "../../lib/auth-context";
import { biens, formatFCFA } from "../../lib/mock-data";
import { Plus, Pencil, Trash2 } from "lucide-react";

const tabs = ["Tous les biens", "Appartements", "Chambres", "Bureaux"] as const;
const tabToCategorie: Record<(typeof tabs)[number], string | null> = {
  "Tous les biens": null,
  Appartements: "Appartement",
  Chambres: "Chambre",
  Bureaux: "Bureau d'Affaires",
};

export default function BiensPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Tous les biens");
  const categorie = tabToCategorie[tab];
  const filtres = categorie ? biens.filter((b) => b.categorie === categorie) : biens;
  const { can } = useAuth();
  const peutModifier = can("biens:edit");

  return (
    <RequirePermission permission="biens:view">
      <Topbar title="Gestion des Biens" />

      <div className="space-y-5 px-5 pb-10 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-em-text">
              Catalogue des Hébergements &amp; Bureaux
            </h2>
            <p className="text-sm text-em-text-muted">
              {peutModifier
                ? "Ajoutez, modifiez ou organisez les différents espaces de la Résidence Émeraude."
                : "Consultation des différents espaces de la Résidence Émeraude (lecture seule)."}
            </p>
          </div>
          {peutModifier && (
            <button className="flex items-center justify-center gap-2 rounded-lg bg-em-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-em-accent-dark">
              <Plus size={16} />
              Ajouter un bien
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-em-sidebar text-white"
                  : "border border-em-border bg-white text-em-text-muted hover:text-em-text"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-em-border bg-em-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="text-xs text-em-text-muted">
                  <th className="px-5 py-4 font-medium">Aperçu</th>
                  <th className="px-2 py-4 font-medium">Nom du bien</th>
                  <th className="px-2 py-4 font-medium">Catégorie</th>
                  <th className="px-2 py-4 font-medium">Prix / Nuit</th>
                  <th className="px-2 py-4 font-medium">Capacité</th>
                  <th className="px-2 py-4 font-medium">Statut</th>
                  {peutModifier && (
                    <th className="px-5 py-4 font-medium text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtres.map((b) => (
                  <tr key={b.id} className="border-t border-em-border">
                    <td className="px-5 py-4">
                      <div
                        className="h-12 w-16 rounded-lg"
                        style={{ background: b.image }}
                      />
                    </td>
                    <td className="px-2 py-4 font-medium text-em-text">{b.nom}</td>
                    <td className="px-2 py-4 text-em-text-muted">{b.categorie}</td>
                    <td className="px-2 py-4 text-em-text">{formatFCFA(b.prix)}</td>
                    <td className="px-2 py-4 text-em-text-muted">{b.capacite}</td>
                    <td className="px-2 py-4">
                      <Badge>{b.statut}</Badge>
                    </td>
                    {peutModifier && (
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            aria-label="Modifier"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-em-border text-em-text hover:bg-em-bg"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            aria-label="Supprimer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-em-border text-em-red hover:bg-em-bg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-4 text-sm text-em-text-muted">
            <span>Affichage de 1 à {filtres.length} sur 15 biens</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs ${
                    n === 1
                      ? "bg-em-sidebar text-white"
                      : "border border-em-border text-em-text-muted hover:text-em-text"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RequirePermission>
  );
}
