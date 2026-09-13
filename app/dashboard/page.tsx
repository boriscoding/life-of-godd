import Topbar from "../components/Topbar";
import Badge from "../components/Badge";
import StatCard from "../components/StatCard";
import RequirePermission from "../components/RequirePermission";
import { paiements, formatFCFA } from "../lib/mock-data";
import { Download } from "lucide-react";

export default function PaiementsPage() {
  const totalPaye = paiements
    .filter((p) => p.statut === "Payé")
    .reduce((sum, p) => sum + p.montant, 0);
  const totalAttente = paiements
    .filter((p) => p.statut === "En attente")
    .reduce((sum, p) => sum + p.montant, 0);

  return (
    <RequirePermission permission="paiements:view">
      <Topbar title="Paiements" />

      <div className="space-y-5 px-5 pb-10 sm:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total encaissé" value={formatFCFA(totalPaye)} />
          <StatCard label="En attente d'encaissement" value={formatFCFA(totalAttente)} />
          <StatCard label="Transactions ce mois" value={`${paiements.length}`} />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-em-text">
            Historique des transactions
          </h2>
          <button className="flex items-center gap-2 rounded-lg border border-em-border bg-white px-4 py-2 text-sm font-medium text-em-text hover:bg-em-bg">
            <Download size={15} />
            Exporter
          </button>
        </div>

        <div className="rounded-xl border border-em-border bg-em-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="text-xs text-em-text-muted">
                  <th className="px-5 py-4 font-medium">Réf</th>
                  <th className="px-2 py-4 font-medium">Client</th>
                  <th className="px-2 py-4 font-medium">Réservation</th>
                  <th className="px-2 py-4 font-medium">Méthode</th>
                  <th className="px-2 py-4 font-medium">Date</th>
                  <th className="px-2 py-4 font-medium">Montant</th>
                  <th className="px-5 py-4 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {paiements.map((p) => (
                  <tr key={p.ref} className="border-t border-em-border">
                    <td className="px-5 py-4 text-em-text-muted">{p.ref}</td>
                    <td className="px-2 py-4 text-em-text">{p.client}</td>
                    <td className="px-2 py-4 text-em-text-muted">{p.reservation}</td>
                    <td className="px-2 py-4 text-em-text-muted">{p.methode}</td>
                    <td className="px-2 py-4 text-em-text-muted">{p.date}</td>
                    <td className="px-2 py-4 font-medium text-em-text">
                      {formatFCFA(p.montant)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge>{p.statut}</Badge>
                    </td>
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
