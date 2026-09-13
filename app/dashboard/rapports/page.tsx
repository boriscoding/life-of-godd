import Topbar from "../../components/Topbar";
import StatCard from "../../components/StatCard";
import RequirePermission from "../../components/RequirePermission";
import { RevenusBarChart, CategoriesBarChart } from "../../components/RapportsCharts";
import { biens, reservations, formatFCFA } from "../../lib/mock-data";
import { Download } from "lucide-react";

const topBiens = [
  { nom: "Suite Deido Vue Fleuve", nuitees: 21, revenus: 630000 },
  { nom: "Appartement F3 Bonapriso", nuitees: 34, revenus: 510000 },
  { nom: "Chambre Émeraude Premium", nuitees: 27, revenus: 297000 },
  { nom: "Bureau Coworking Élite", nuitees: 18, revenus: 90000 },
];

export default function RapportsPage() {
  const revenuTotal = reservations
    .filter((r) => r.statut !== "Annulé")
    .reduce((sum, r) => sum + r.montant, 0);
  const tauxOccupation = Math.round(
    (biens.filter((b) => b.statut === "Occupé").length / biens.length) * 100
  );

  return (
    <RequirePermission permission="rapports:view">
      <Topbar
        title="Rapports"
        subtitle="Analyse de la performance de la Résidence Émeraude."
      />

      <div className="space-y-5 px-5 pb-10 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {["7 jours", "30 jours", "6 mois", "12 mois"].map((p, i) => (
              <button
                key={p}
                className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                  i === 2
                    ? "border-em-sidebar bg-em-sidebar text-white"
                    : "border-em-border bg-white text-em-text-muted hover:text-em-text"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-em-border bg-white px-4 py-2.5 text-sm font-medium text-em-text hover:bg-em-bg">
            <Download size={16} />
            Exporter le rapport
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Revenus (période)" value={formatFCFA(revenuTotal)} trend="+12% de croissance" />
          <StatCard label="Taux d'occupation moyen" value={`${tauxOccupation} %`} trend="+4% vs le mois dernier" />
          <StatCard label="Nuitées vendues" value="100" trend="+9% vs le mois dernier" />
          <StatCard
            label="Panier moyen / réservation"
            value={formatFCFA(Math.round(revenuTotal / reservations.length))}
            trend="-2% vs le mois dernier"
            trendUp={false}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-em-border bg-em-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-em-text">
                  Évolution des Revenus
                </h3>
                <p className="text-xs text-em-text-muted">Performance financière (6 derniers mois)</p>
              </div>
              <span className="rounded-full border border-em-border bg-em-bg px-3 py-1 text-xs font-medium text-em-text-muted">
                FCFA (XAF)
              </span>
            </div>
            <RevenusBarChart />
          </div>

          <div className="rounded-xl border border-em-border bg-em-card p-5">
            <h3 className="mb-4 font-display text-base font-semibold text-em-text">
              Revenus par catégorie
            </h3>
            <CategoriesBarChart />
          </div>
        </div>

        <div className="rounded-xl border border-em-border bg-em-card">
          <div className="border-b border-em-border px-5 py-4">
            <h3 className="font-display text-base font-semibold text-em-text">
              Biens les plus performants
            </h3>
            <p className="text-xs text-em-text-muted">
              Classement par revenus générés sur la période sélectionnée.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="text-xs text-em-text-muted">
                  <th className="px-5 py-4 font-medium">Bien</th>
                  <th className="px-2 py-4 font-medium">Nuitées vendues</th>
                  <th className="px-5 py-4 font-medium">Revenus générés</th>
                </tr>
              </thead>
              <tbody>
                {topBiens.map((b) => (
                  <tr key={b.nom} className="border-t border-em-border">
                    <td className="px-5 py-4 font-medium text-em-text">{b.nom}</td>
                    <td className="px-2 py-4 text-em-text-muted">{b.nuitees} nuits</td>
                    <td className="px-5 py-4 font-medium text-em-text">{formatFCFA(b.revenus)}</td>
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
