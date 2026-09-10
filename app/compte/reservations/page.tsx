"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div className="p-4 space-y-6 sm:p-8 sm:space-y-8 lg:p-12 max-w-7xl mx-auto">

      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-emerald-950 sm:text-2xl">Tableau de bord</h1>
          <p className="text-xs text-gray-500 mt-1">Suivez votre activité et gérez vos réservations en temps réel.</p>
        </div>

        {/* Badge utilisateur connecté */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 self-start sm:self-auto">
          <div className="w-9 h-9 shrink-0 rounded-full bg-emerald-950 text-white flex items-center justify-center font-bold text-xs">
            JP
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-900">Jean-Pierre Ngassa</p>
            <p className="text-[10px] text-emerald-800 font-medium">Membre Privilège</p>
          </div>
        </div>
      </div>

      {/* Bannière de bienvenue */}
      <div className="relative rounded-3xl overflow-hidden bg-emerald-950 text-white p-6 shadow-md sm:p-8">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80')` }} />
        <div className="relative z-10 max-w-xl space-y-2">
          <h2 className="text-lg font-bold sm:text-xl">Bienvenue, Jean-Pierre !</h2>
          <p className="text-xs text-gray-200 leading-relaxed">
            Votre séjour d&apos;exception à Douala vous attend. Tout est prêt pour vous offrir un confort absolu et des services de premier ordre.
          </p>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2 sm:p-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Réservations actives</p>
          <p className="text-2xl font-extrabold text-emerald-950 sm:text-3xl">2</p>
          <p className="text-[11px] text-gray-500">Prochain séjour : 12 Nov 2025</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2 sm:p-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total dépensé</p>
          <p className="text-2xl font-extrabold text-emerald-950 sm:text-3xl">450 000 FCFA</p>
          <p className="text-[11px] text-gray-500">3 factures réglées</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2 sm:p-6 sm:col-span-2 lg:col-span-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Points Fidélité</p>
          <p className="text-2xl font-extrabold text-orange-700 sm:text-3xl">120 pts</p>
          <p className="text-[11px] text-gray-500">Statut Émeraude Club active</p>
        </div>
      </div>

      {/* Grille inférieure (Prochain séjour & Actions rapides) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">

        {/* Votre Prochain Séjour */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900">Votre Prochain Séjour</h3>
            <span className="bg-emerald-50 text-emerald-900 text-[10px] font-bold px-3 py-1 rounded-full">Confirmée</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 bg-gray-50/60 p-4 rounded-2xl border border-gray-100 sm:items-center">
            <img
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80"
              alt="Appartement"
              className="w-full h-40 object-cover rounded-xl sm:w-32 sm:h-24"
            />
            <div className="space-y-1 w-full text-xs">
              <h4 className="font-bold text-gray-900">Appartement F3 Grand Standing</h4>
              <p className="text-gray-500">Bonapriso, Douala - Cameroun</p>
              <p className="text-emerald-950 font-medium">Du 12 Nov au 19 Nov 2025 (7 Nuits)</p>
              <p className="text-orange-700 font-bold pt-1">Total : 350 000 FCFA</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link href="/compte/reservations" className="flex-1 bg-emerald-950 text-white text-center py-2.5 rounded-xl text-xs font-medium hover:bg-emerald-900 transition-colors">
              Voir les détails
            </Link>
            <button className="flex-1 bg-gray-100 text-gray-700 text-center py-2.5 rounded-xl text-xs font-medium hover:bg-gray-200 transition-colors">
              Télécharger le reçu
            </button>
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4 sm:p-6">
          <h3 className="font-bold text-sm text-gray-900">Actions Rapides</h3>

          <div className="space-y-2 text-xs">
            <Link href="/reservation" className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-950 transition-colors font-medium text-gray-700">
              <span>Réserver un nouveau séjour</span>
              <span>›</span>
            </Link>
            <Link href="/bureaux" className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-950 transition-colors font-medium text-gray-700">
              <span>Louer un espace de bureau</span>
              <span>›</span>
            </Link>
            <Link href="/contact" className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-950 transition-colors font-medium text-gray-700">
              <span>Demander une navette aéroport</span>
              <span>›</span>
            </Link>
            <Link href="/contact" className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-950 transition-colors font-medium text-gray-700">
              <span>Contacter l&apos;assistance VIP</span>
              <span>›</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}