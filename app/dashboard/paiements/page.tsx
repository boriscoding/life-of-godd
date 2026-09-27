"use client";

import { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/Topbar";
import Badge from "../../components/Badge";
import StatCard from "../../components/StatCard";
import RequirePermission from "../../components/RequirePermission";
import { api } from "@/app/lib/api";
import { formatFCFA } from "../../lib/mock-data";
import { Download } from "lucide-react";

type PaymentApiStatus = "pending" | "processing" | "completed" | "failed" | "refunded";
type PaymentApiMethod =
  | "mtn_mobile_money"
  | "orange_money"
  | "credit_card"
  | "cash"
  | "paydunya"
  | "cinetpay"
  | "opay";

interface PaymentApi {
  id: string;
  reference: string;
  amount: number | string;
  method: PaymentApiMethod;
  status: PaymentApiStatus;
  createdAt: string;
  booking?: {
    reference: string;
    guestName: string;
    guestEmail: string;
  } | null;
}

const STATUS_LABELS: Record<PaymentApiStatus, string> = {
  pending: "En attente",
  processing: "En cours",
  completed: "Payé",
  failed: "Échoué",
  refunded: "Remboursé",
};

const METHOD_LABELS: Record<PaymentApiMethod, string> = {
  mtn_mobile_money: "MTN Mobile Money",
  orange_money: "Orange Money",
  credit_card: "Carte bancaire",
  cash: "Espèces",
  paydunya: "PayDunya",
  cinetpay: "CinetPay",
  opay: "OPay",
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
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

export default function PaiementsPage() {
  const [paiements, setPaiements] = useState<PaymentApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/payments", { params: { limit: 100 } });
        if (cancelled) return;
        setPaiements(extractArray<PaymentApi>(res.data));
      } catch (err: any) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Impossible de charger les paiements.");
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

  const totalPaye = useMemo(
    () =>
      paiements
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + Number(p.amount), 0),
    [paiements],
  );

  const totalAttente = useMemo(
    () =>
      paiements
        .filter((p) => p.status === "pending" || p.status === "processing")
        .reduce((sum, p) => sum + Number(p.amount), 0),
    [paiements],
  );

  return (
    <RequirePermission permission="paiements:view">
      <Topbar title="Paiements" />

      <div className="space-y-5 px-5 pb-10 sm:px-8">
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

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
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-em-text-muted">
                      Chargement des paiements...
                    </td>
                  </tr>
                )}

                {!loading &&
                  paiements.map((p) => (
                    <tr key={p.id} className="border-t border-em-border">
                      <td className="px-5 py-4 text-em-text-muted">{p.reference}</td>
                      <td className="px-2 py-4 text-em-text">
                        {p.booking?.guestName ?? "—"}
                      </td>
                      <td className="px-2 py-4 text-em-text-muted">
                        {p.booking?.reference ?? "—"}
                      </td>
                      <td className="px-2 py-4 text-em-text-muted">
                        {METHOD_LABELS[p.method] ?? p.method}
                      </td>
                      <td className="px-2 py-4 text-em-text-muted">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="px-2 py-4 font-medium text-em-text">
                        {formatFCFA(Number(p.amount))}
                      </td>
                      <td className="px-5 py-4">
                        <Badge>{STATUS_LABELS[p.status] ?? p.status}</Badge>
                      </td>
                    </tr>
                  ))}

                {!loading && paiements.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-em-text-muted">
                      Aucune transaction pour le moment.
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