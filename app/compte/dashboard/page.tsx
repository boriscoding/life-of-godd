"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/contexte/AuthContext";
import { api } from "@/app/lib/api";

interface BookingApi {
  id: string;
  reference: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  totalAmount: number | string;
  status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";
}

interface InvoiceApi {
  id: string;
  status: "draft" | "issued" | "paid" | "cancelled";
  totalAmount: number | string;
}

interface PropertyApi {
  id: string;
  name: string;
  city?: string | null;
}

function extractArray<T>(payload: any): T[] {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function formatDateFr(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(
      new Date(iso),
    );
  } catch {
    return "-";
  }
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();

  const [bookings, setBookings] = useState<BookingApi[]>([]);
  const [invoices, setInvoices] = useState<InvoiceApi[]>([]);
  const [properties, setProperties] = useState<Record<string, PropertyApi>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    Promise.all([
      api.get("/bookings", { params: { userId: user.id, limit: 100 } }),
      api.get("/invoices", { params: { limit: 100 } }),
      api.get("/properties", { params: { limit: 200 } }),
    ])
      .then(([bookingsRes, invoicesRes, propertiesRes]) => {
        if (cancelled) return;

        setBookings(extractArray<BookingApi>(bookingsRes.data));
        setInvoices(extractArray<InvoiceApi>(invoicesRes.data));

        const propertyList = extractArray<PropertyApi>(propertiesRes.data);
        const map: Record<string, PropertyApi> = {};
        propertyList.forEach((p) => {
          map[p.id] = p;
        });
        setProperties(map);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || "Impossible de charger votre tableau de bord.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user?.id]);

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    : "Invité";
  const firstName = user?.firstName || user?.email?.split("@")[0] || "Cher client";
  const initials = user
    ? `${(user.firstName || user.email || "U")[0]}${(user.lastName || "")[0] || ""}`.toUpperCase()
    : "U";

  const activeBookings = useMemo(
    () => bookings.filter((b) => b.status === "pending" || b.status === "confirmed" || b.status === "checked_in"),
    [bookings],
  );

  const nextBooking = useMemo(() => {
    const now = new Date();
    return activeBookings
      .filter((b) => new Date(b.startDate) >= now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
  }, [activeBookings]);

  const paidInvoices = useMemo(() => invoices.filter((i) => i.status === "paid"), [invoices]);
  const totalSpent = useMemo(
    () => paidInvoices.reduce((sum, i) => sum + Number(i.totalAmount), 0),
    [paidInvoices],
  );

  const handleDownloadReceipt = () => {
    if (!nextBooking) return;
    const property = properties[nextBooking.propertyId];
    const content = `================================================
RÉSIDENCE ÉMERAUDE - CONFIRMATION DE RÉSERVATION
================================================
Référence : ${nextBooking.reference}
Hébergement : ${property?.name ?? "Bien"}
Adresse : ${property?.city ? `Résidence Émeraude, ${property.city}` : "Résidence Émeraude"}
Dates : Du ${formatDateFr(nextBooking.startDate)} au ${formatDateFr(nextBooking.endDate)}
Montant Total : ${Number(nextBooking.totalAmount).toLocaleString("fr-FR")} FCFA
================================================
Merci pour votre confiance !`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Reservation_${nextBooking.reference}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const nextBookingProperty = nextBooking ? properties[nextBooking.propertyId] : undefined;

  return (
    <div className="p-4 space-y-6 sm:p-8 sm:space-y-8 lg:p-12 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-emerald-950 sm:text-2xl">Tableau de bord</h1>
          <p className="text-xs text-gray-500 mt-1">Suivez votre activité et gérez vos réservations en temps réel.</p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 self-start sm:self-auto">
          <div className="w-9 h-9 shrink-0 rounded-full bg-emerald-950 text-white flex items-center justify-center font-bold text-xs">
            {initials}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-900">{fullName}</p>
            <p className="text-[10px] text-emerald-800 font-medium">ID: {user?.id || "Non identifié"}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600">{error}</div>
      )}

      {/* Bannière de bienvenue */}
      <div className="relative rounded-3xl overflow-hidden bg-emerald-950 text-white p-6 shadow-md sm:p-8">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80')`,
          }}
        />
        <div className="relative z-10 max-w-xl space-y-2">
          <h2 className="text-lg font-bold sm:text-xl">Bienvenue, {firstName} !</h2>
          <p className="text-xs text-gray-200 leading-relaxed">
            Votre séjour d&apos;exception à Douala vous attend. Tout est prêt pour vous offrir un confort absolu et
            des services de premier ordre.
          </p>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2 sm:p-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Réservations actives</p>
          <p className="text-2xl font-extrabold text-emerald-950 sm:text-3xl">
            {loading ? "—" : activeBookings.length}
          </p>
          <p className="text-[11px] text-gray-500">
            {loading
              ? "Chargement..."
              : nextBooking
              ? `Prochain séjour : ${formatDateFr(nextBooking.startDate)}`
              : "Aucun séjour à venir"}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2 sm:p-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total dépensé</p>
          <p className="text-2xl font-extrabold text-emerald-950 sm:text-3xl">
            {loading ? "—" : `${totalSpent.toLocaleString("fr-FR")} FCFA`}
          </p>
          <p className="text-[11px] text-gray-500">
            {loading ? "Chargement..." : `${paidInvoices.length} facture${paidInvoices.length > 1 ? "s" : ""} réglée${paidInvoices.length > 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2 sm:p-6 sm:col-span-2 lg:col-span-1 opacity-60">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Points Fidélité</p>
          <p className="text-2xl font-extrabold text-orange-700 sm:text-3xl">—</p>
          <p className="text-[11px] text-gray-500">Bientôt disponible</p>
        </div>
      </div>

      {/* Grille inférieure */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Votre Prochain Séjour */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900">Votre Prochain Séjour</h3>
            {nextBooking && (
              <span className="bg-emerald-50 text-emerald-900 text-[10px] font-bold px-3 py-1 rounded-full">
                {nextBooking.status === "confirmed" ? "Confirmée" : "En attente"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-10 text-center text-xs text-gray-400">Chargement...</div>
          ) : !nextBooking ? (
            <div className="py-10 text-center text-xs text-gray-400">
              Vous n&apos;avez pas de séjour à venir pour le moment.
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 bg-gray-50/60 p-4 rounded-2xl border border-gray-100 sm:items-center">
                <div className="w-full h-40 sm:w-32 sm:h-24 rounded-xl bg-emerald-950/5 flex items-center justify-center text-emerald-900/40 text-xs font-medium">
                  {nextBookingProperty?.name ?? "Bien"}
                </div>
                <div className="space-y-1 w-full text-xs">
                  <h4 className="font-bold text-gray-900">{nextBookingProperty?.name ?? "Bien"}</h4>
                  <p className="text-gray-500">
                    {nextBookingProperty?.city ? `${nextBookingProperty.city}, Cameroun` : "Résidence Émeraude"}
                  </p>
                  <p className="text-emerald-950 font-medium">
                    Du {formatDateFr(nextBooking.startDate)} au {formatDateFr(nextBooking.endDate)}
                  </p>
                  <p className="text-orange-700 font-bold pt-1">
                    Total : {Number(nextBooking.totalAmount).toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Link
                  href="/compte/reservations"
                  className="flex-1 bg-emerald-950 text-white text-center py-2.5 rounded-xl text-xs font-medium hover:bg-emerald-900 transition-colors"
                >
                  Voir les détails
                </Link>
                <button
                  onClick={handleDownloadReceipt}
                  className="flex-1 bg-gray-100 text-gray-700 text-center py-2.5 rounded-xl text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  Télécharger le reçu
                </button>
              </div>
            </>
          )}
        </div>

        {/* Actions Rapides */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4 sm:p-6">
          <h3 className="font-bold text-sm text-gray-900">Actions Rapides</h3>

          <div className="space-y-2 text-xs">
            <Link
              href="/reservation"
              className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-950 transition-colors font-medium text-gray-700"
            >
              <span>Réserver un nouveau séjour</span>
              <span>›</span>
            </Link>
            <Link
              href="/bureaux"
              className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-950 transition-colors font-medium text-gray-700"
            >
              <span>Louer un espace de bureau</span>
              <span>›</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-950 transition-colors font-medium text-gray-700"
            >
              <span>Demander une navette aéroport</span>
              <span>›</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-950 transition-colors font-medium text-gray-700"
            >
              <span>Contacter l&apos;assistance VIP</span>
              <span>›</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}