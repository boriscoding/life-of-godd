"use client";

import { useState } from "react";
import Topbar from "../../components/Topbar";
import Badge from "../../components/Badge";
import RequirePermission from "../../components/RequirePermission";
import { Plus, Trash2 } from "lucide-react";

const utilisateurs = [
  { initiales: "AG", nom: "Admin Gestionnaire", email: "admin@emeraude.cm", role: "Super Administrateur" },
  { initiales: "MK", nom: "Marlène Kotto", email: "m.kotto@emeraude.cm", role: "Réceptionniste" },
  { initiales: "TE", nom: "Théo Essomba", email: "t.essomba@emeraude.cm", role: "Comptable" },
];

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => setOn(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? "bg-em-accent" : "bg-em-border"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-em-border bg-em-card p-5">
      <h3 className="font-display text-base font-semibold text-em-text">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-em-text-muted">{subtitle}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-em-text-muted">{label}</span>
      <input
        type="text"
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-em-border bg-white px-3.5 py-2.5 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30"
      />
    </label>
  );
}

export default function ParametresPage() {
  return (
    <RequirePermission permission="parametres:view">
      <Topbar title="Paramètres" subtitle="Gérez les informations et préférences de la Résidence Émeraude." />

      <div className="grid grid-cols-1 gap-5 px-5 pb-10 sm:px-8 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Section title="Informations de la résidence" subtitle="Ces informations apparaissent sur les factures et confirmations de réservation.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nom de la résidence" defaultValue="Résidence Émeraude" />
              <Field label="Ville" defaultValue="Douala, Cameroun" />
              <Field label="Téléphone de contact" defaultValue="+237 233 42 10 88" />
              <Field label="E-mail de contact" defaultValue="contact@emeraude.cm" />
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-em-text-muted">Adresse complète</span>
              <textarea
                rows={2}
                defaultValue="Rue de la Résidence, Bonapriso, Douala, Cameroun"
                className="w-full resize-none rounded-lg border border-em-border bg-white px-3.5 py-2.5 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30"
              />
            </label>
            <div className="flex justify-end">
              <button className="rounded-lg bg-em-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-em-accent-dark">
                Enregistrer les modifications
              </button>
            </div>
          </Section>

          <Section title="Préférences de facturation" subtitle="Devise et règles appliquées aux réservations.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Devise" defaultValue="FCFA (XAF)" />
              <Field label="Taxe de séjour (par nuit)" defaultValue="1 000 FCFA" />
              <Field label="Acompte minimum à la réservation" defaultValue="30 %" />
              <Field label="Délai d'annulation gratuite" defaultValue="48 heures avant l'arrivée" />
            </div>
          </Section>

          <Section title="Gestion des utilisateurs" subtitle="Les comptes ayant accès à l'espace admin.">
            <div className="overflow-x-auto rounded-lg border border-em-border">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="bg-em-bg text-xs text-em-text-muted">
                    <th className="px-4 py-3 font-medium">Utilisateur</th>
                    <th className="px-2 py-3 font-medium">Rôle</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {utilisateurs.map((u) => (
                    <tr key={u.email} className="border-t border-em-border">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-em-sidebar text-xs font-semibold text-white">
                            {u.initiales}
                          </span>
                          <div>
                            <p className="font-medium text-em-text">{u.nom}</p>
                            <p className="text-xs text-em-text-muted">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <Badge tone={u.role === "Super Administrateur" ? "orange" : "gray"}>{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-em-text-muted hover:text-em-red" aria-label="Supprimer l'utilisateur">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="flex items-center gap-2 text-sm font-medium text-em-accent hover:text-em-accent-dark">
              <Plus size={16} />
              Inviter un utilisateur
            </button>
          </Section>
        </div>

        <div className="space-y-5">
          <Section title="Notifications">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-em-text">Nouvelle réservation</p>
                <p className="text-xs text-em-text-muted">Alerte par e-mail et notification.</p>
              </div>
              <Toggle defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-em-text">Paiement reçu</p>
                <p className="text-xs text-em-text-muted">Alerte quand un paiement est confirmé.</p>
              </div>
              <Toggle defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-em-text">Rappels de maintenance</p>
                <p className="text-xs text-em-text-muted">Suivi des biens en travaux.</p>
              </div>
              <Toggle />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-em-text">Rapport hebdomadaire</p>
                <p className="text-xs text-em-text-muted">Résumé envoyé chaque lundi.</p>
              </div>
              <Toggle defaultChecked />
            </div>
          </Section>

          <Section title="Sécurité">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-em-text-muted">Mot de passe actuel</span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-em-border bg-white px-3.5 py-2.5 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-em-text-muted">Nouveau mot de passe</span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-em-border bg-white px-3.5 py-2.5 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30"
              />
            </label>
            <div className="flex items-center justify-between gap-3 pt-1">
              <div>
                <p className="text-sm font-medium text-em-text">Authentification à deux facteurs</p>
                <p className="text-xs text-em-text-muted">Recommandé pour les administrateurs.</p>
              </div>
              <Toggle />
            </div>
            <button className="w-full rounded-lg border border-em-border bg-white py-2.5 text-sm font-medium text-em-text hover:bg-em-bg">
              Mettre à jour le mot de passe
            </button>
          </Section>
        </div>
      </div>
    </RequirePermission>
  );
}
