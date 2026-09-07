"use client";

import Link from "next/link";

export default function ReservationsPage() {
  const reservations = [
    {
      ref: "RE-1049",
      bien: "Appartement F3 Grand Standing",
      lieu: "Bonapriso, Douala",
      dates: "12 - 19 Nov 2025",
      montant: "350 000 FCFA",
      statut: "Confirmée",
      statutColor: "bg-emerald-50 text-emerald-900",
    },
    {
      ref: "RE-0943",
      bien: "Chambre VIP Emeraude",
      lieu: "Hôtel Bonapriso",
      dates: "01 - 04 Nov 2025",
      montant: "100 000 FCFA",
      statut: "En cours",
      statutColor: "bg-blue-50 text-blue-900",
    },
    {
      ref: "RE-0892",
      bien: "Bureau Privé - 4 Postes",
      lieu: "Espace Coworking",
      dates: "15 - 19 Oct 2025",
      montant: "150 000 FCFA",
      statut: "Terminée",
      statutColor: "bg-gray-100 text-gray-700",
    },
    {
      ref: "RE-0742",
      bien: "Suite Royale Terracotta",
      lieu: "Hôtel Bonapriso",
      dates: "12 - 14 Sep 2025",
      montant: "220 000 FCFA",
      statut: "Annulée",
      statutColor: "bg-orange-50 text-orange-800",
    },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-8">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-emerald-950">Mes réservations</h1>
          <p className="text-xs text-gray-500 mt-1">Retrouvez l&apos;historique complet de vos séjours et locations de bureaux.</p>
        </div>
        <Link
          href="/reservation"
          className="rounded-xl bg-emerald-950 px-5 py-3 text-xs font-medium text-white shadow-md hover:bg-emerald-900 transition-colors text-center"
        >
          Nouvelle réservation
        </Link>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 text-xs items-center">
        <div>
          <span className="block font-bold text-[10px] text-gray-400 uppercase mb-1">STATUT</span>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-700 outline-none">
            <option>Toutes les réservations</option>
            <option>Confirmées</option>
            <option>Terminées</option>
          </select>
        </div>
        <div>
          <span className="block font-bold text-[10px] text-gray-400 uppercase mb-1">PÉRIODE</span>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-700 outline-none">
            <option>Novembre 2025</option>
            <option>Octobre 2025</option>
            <option>Toute l&apos;année</option>
          </select>
        </div>
        <div>
          <span className="block font-bold text-[10px] text-gray-400 uppercase mb-1">TYPE DE BIEN</span>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-700 outline-none">
            <option>Tous les biens</option>
            <option>Chambres & Suites</option>
            <option>Appartements</option>
            <option>Bureaux</option>
          </select>
        </div>
        <div className="flex items-end h-full pt-4 md:pt-0">
          <button className="w-full bg-gray-100 text-gray-800 font-medium py-2.5 rounded-xl hover:bg-gray-200 transition-colors">
            Filtrer
          </button>
        </div>
      </div>

      {/* Tableau des réservations */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-100">
                <th className="p-4 font-bold">Référence</th>
                <th className="p-4 font-bold">Bien / Catégorie</th>
                <th className="p-4 font-bold">Dates</th>
                <th className="p-4 font-bold">Montant</th>
                <th className="p-4 font-bold">Statut</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {reservations.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-emerald-950">{item.ref}</td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">{item.bien}</p>
                    <p className="text-[11px] text-gray-400">{item.lieu}</p>
                  </td>
                  <td className="p-4 font-medium text-gray-600">{item.dates}</td>
                  <td className="p-4 font-bold text-gray-900">{item.montant}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${item.statutColor}`}>
                      {item.statut}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors">
                      Voir
                    </button>
                    <button className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg font-medium transition-colors">
                      Reçu
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}