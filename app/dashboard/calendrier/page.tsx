"use client";

import { useState } from "react";
import Topbar from "../../components/Topbar";
import RequirePermission from "../../components/RequirePermission";
import { useAuth } from "../../lib/auth-context";
import { biens, joursCalendrier } from "../../lib/mock-data";
import { Lock, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
// Novembre 2025 starts on a Saturday; grid begins with trailing Oct days.
const grille: (number | null)[] = [27, 28, 29, 30, 31, 1, 2].map((n, i) => (i < 5 ? null : n));
for (let d = 3; d <= 30; d++) grille.push(d);

const statutStyle: Record<string, string> = {
  libre: "bg-[#e4f0e7] text-[#1e7145] border-[#cfe6d6]",
  occupe: "bg-[#fbe7e4] text-[#c0392b] border-[#f4cdc8]",
  maintenance: "bg-[#eeece4] text-[#6b6b60] border-[#ddd8ca]",
};

export default function CalendrierPage() {
  const [bienSelectionne, setBienSelectionne] = useState(biens[0].nom);
  const { can } = useAuth();
  const peutModifier = can("calendrier:edit");

  return (
    <RequirePermission permission="calendrier:view">
      <Topbar title="Calendrier d'Occupation" />

      <div className="space-y-5 px-5 pb-10 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <select
              value={bienSelectionne}
              onChange={(e) => setBienSelectionne(e.target.value)}
              className="w-full appearance-none rounded-lg border border-em-border bg-white px-4 py-2.5 text-sm text-em-text focus:outline-none focus:ring-2 focus:ring-em-accent/30"
            >
              {biens.map((b) => (
                <option key={b.id} value={b.nom}>
                  {b.nom}
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
              <button className="flex items-center gap-2 rounded-lg border border-em-accent px-4 py-2.5 text-sm font-medium text-em-accent hover:bg-em-accent/5">
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

        <div className="rounded-xl border border-em-border bg-em-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-em-border text-em-text hover:bg-em-bg">
              <ChevronLeft size={16} />
            </button>
            <h2 className="font-display text-lg font-semibold text-em-text">Novembre 2025</h2>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-em-border text-em-text hover:bg-em-bg">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs text-em-text-muted">
            {joursSemaine.map((j) => (
              <div key={j} className="pb-2 text-center font-medium">
                {j}
              </div>
            ))}

            {grille.map((jour, i) => {
              if (jour === null) return <div key={`empty-${i}`} />;
              const isOctobre = i < 5;
              const info = !isOctobre ? joursCalendrier[jour] : undefined;
              return (
                <div
                  key={i}
                  className={`min-h-[64px] rounded-lg border p-2 text-left ${
                    isOctobre
                      ? "border-em-border bg-em-bg/50 text-em-text-muted/50"
                      : info
                      ? statutStyle[info.statut]
                      : "border-em-border bg-white"
                  }`}
                >
                  <p className="text-sm font-medium">{jour}</p>
                  {info && <p className="mt-1 text-[11px] leading-tight">{info.label}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </RequirePermission>
  );
}
