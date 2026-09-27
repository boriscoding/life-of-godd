'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/app/contexte/AuthContext';
import { api } from '@/app/lib/api';
import {
  Search,
  Calendar,
  Users,
  MapPin,
  Download,
  ArrowRight,
  Filter,
  X,
  Building2,
} from 'lucide-react';

type ReservationStatus = 'a_venir' | 'en_cours' | 'terminee' | 'annulee';

interface Reservation {
  id: string;
  reference: string;
  title: string;
  type: string;
  location: string;
  startDate: string;
  endDate: string;
  guests: string;
  price: string;
  nights: number;
  status: ReservationStatus;
}

interface BookingApi {
  id: string;
  reference: string;
  propertyId: string;
  propertyType: string;
  startDate: string;
  endDate: string;
  numberOfGuests: number;
  totalAmount: number | string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
}

interface PropertyApi {
  id: string;
  name: string;
  city?: string | null;
  type: string;
}

const propertyTypeLabel: Record<string, string> = {
  room: "Chambre d'hôtel",
  apartment: 'Appartement meublé',
  office: 'Bureau professionnel',
};

const bookingStatusToReservationStatus: Record<BookingApi['status'], ReservationStatus> = {
  pending: 'a_venir',
  confirmed: 'a_venir',
  checked_in: 'en_cours',
  checked_out: 'terminee',
  cancelled: 'annulee',
};

function extractArray<T>(payload: any): T[] {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function formatDateFr(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(
      new Date(iso),
    );
  } catch {
    return '-';
  }
}

function mapBookingToReservation(b: BookingApi, properties: Record<string, PropertyApi>): Reservation {
  const property = properties[b.propertyId];
  const nights = Math.max(
    1,
    Math.round((new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24)),
  );

  return {
    id: b.id,
    reference: b.reference,
    title: property?.name ?? 'Bien',
    type: propertyTypeLabel[b.propertyType] ?? b.propertyType,
    location: property?.city ? `Résidence Émeraude, ${property.city}` : 'Résidence Émeraude',
    startDate: formatDateFr(b.startDate),
    endDate: formatDateFr(b.endDate),
    guests: `${b.numberOfGuests} personne${b.numberOfGuests > 1 ? 's' : ''}`,
    price: `${Number(b.totalAmount).toLocaleString('fr-FR')} FCFA`,
    nights,
    status: bookingStatusToReservationStatus[b.status],
  };
}

export default function ReservationsPage() {
  const { user, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'toutes' | ReservationStatus>('toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const [reservations, setReservations] = useState<Reservation[]>([]);
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
      api.get('/bookings', { params: { userId: user.id, limit: 100 } }),
      api.get('/properties', { params: { limit: 200 } }),
    ])
      .then(([bookingsRes, propertiesRes]) => {
        if (cancelled) return;

        const bookingList = extractArray<BookingApi>(bookingsRes.data);
        const propertyList = extractArray<PropertyApi>(propertiesRes.data);

        const propertyMap: Record<string, PropertyApi> = {};
        propertyList.forEach((p) => {
          propertyMap[p.id] = p;
        });

        setReservations(bookingList.map((b) => mapBookingToReservation(b, propertyMap)));
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Impossible de charger vos réservations.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user?.id]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      const matchesTab = activeTab === 'toutes' || res.status === activeTab;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        res.title.toLowerCase().includes(q) ||
        res.type.toLowerCase().includes(q) ||
        res.reference.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [reservations, activeTab, searchQuery]);

  const handleDownloadConfirmation = (res: Reservation) => {
    const content = `================================================
RÉSIDENCE ÉMERAUDE - CONFIRMATION DE RÉSERVATION
================================================
Référence : ${res.reference}
Hébergement : ${res.title} (${res.type})
Adresse : ${res.location}
Dates : Du ${res.startDate} au ${res.endDate} (${res.nights} nuits)
Occupants : ${res.guests}
Montant Total : ${res.price}
Statut : ${res.status.toUpperCase()}
================================================
Merci pour votre confiance !`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reservation_${res.reference}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'a_venir':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            À venir
          </span>
        );
      case 'en_cours':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            En cours
          </span>
        );
      case 'terminee':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            Terminée
          </span>
        );
      case 'annulee':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Annulée
          </span>
        );
    }
  };

  const tabCount = (status: 'toutes' | ReservationStatus) =>
    status === 'toutes' ? reservations.length : reservations.filter((r) => r.status === status).length;

  return (
    <div className="p-6 lg:p-8 text-slate-800 relative min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#0F2F28]">Mes réservations</h1>
        <p className="text-slate-500 text-sm mt-1">Retrouvez ici toutes vos réservations à la Résidence Émeraude.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Barre de filtres et recherche */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl w-fit overflow-x-auto">
          {(['toutes', 'a_venir', 'en_cours', 'terminee', 'annulee'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-[#0F2F28] text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'toutes'
                ? 'Toutes'
                : tab === 'a_venir'
                ? 'À venir'
                : tab === 'en_cours'
                ? 'En cours'
                : tab === 'terminee'
                ? 'Terminées'
                : 'Annulées'}{' '}
              {tab === 'toutes' && (
                <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-white/20">{tabCount(tab)}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une réservation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F2F28]"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="w-4 h-4 text-slate-500" />
            <span>Plus récente</span>
          </button>
        </div>
      </div>

      {/* Liste des réservations */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">Chargement de vos réservations...</div>
      ) : filteredReservations.length === 0 ? (
        <div className="py-20 text-center text-sm text-slate-500">
          {reservations.length === 0 ? "Vous n'avez pas encore de réservation." : 'Aucune réservation dans cette catégorie.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative w-28 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-slate-300" />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {item.reference}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.type}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.location}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 gap-2 text-xs text-slate-600 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Arrivée : <strong className="text-slate-800">{item.startDate}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Départ : <strong className="text-slate-800">{item.endDate}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.guests}</span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 gap-2">
                <div>
                  <div className="text-lg font-bold text-[#0F2F28]">{item.price}</div>
                  <div className="text-xs text-slate-400 text-right">({item.nights} nuits)</div>
                </div>
                <div>{getStatusBadge(item.status)}</div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                <button
                  onClick={() => setSelectedReservation(item)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0F2F28] text-white px-4 py-2.5 rounded-xl text-xs font-medium hover:bg-[#153e35] transition-colors"
                >
                  <span>Voir détails</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDownloadConfirmation(item)}
                  className="p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                  title="Télécharger la confirmation"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale de Détails de la Réservation */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="relative h-48 bg-[#0F2F28] flex items-center justify-center">
              <Building2 className="w-16 h-16 text-white/30" />
              <button
                onClick={() => setSelectedReservation(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/20 w-fit mb-1">
                  {selectedReservation.reference}
                </div>
                <h2 className="text-2xl font-serif font-bold">{selectedReservation.title}</h2>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center border-b pb-4 border-slate-100">
                <span className="text-sm text-slate-500">Statut de la réservation</span>
                {getStatusBadge(selectedReservation.status)}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <MapPin className="w-4 h-4 text-[#0F2F28]" />
                  <span>{selectedReservation.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <Calendar className="w-4 h-4 text-[#0F2F28]" />
                  <span>
                    Du {selectedReservation.startDate} au {selectedReservation.endDate} ({selectedReservation.nights}{' '}
                    nuits)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <Users className="w-4 h-4 text-[#0F2F28]" />
                  <span>{selectedReservation.guests}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Prix par nuit :</span>
                  <span className="font-semibold text-slate-800">
                    {Math.round(
                      parseInt(selectedReservation.price.replace(/\D/g, ''), 10) / selectedReservation.nights,
                    ).toLocaleString()}{' '}
                    FCFA
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm text-slate-900">
                  <span>Total Réglé :</span>
                  <span className="text-[#0F2F28]">{selectedReservation.price}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleDownloadConfirmation(selectedReservation)}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#0F2F28] text-[#0F2F28] py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger Reçu</span>
                </button>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="flex-1 bg-[#0F2F28] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#153e35] transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}