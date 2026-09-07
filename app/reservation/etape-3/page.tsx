"use client";

import Link from "next/link";

export default function ReservationEtape3() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-6 text-xs font-semibold text-gray-500">
        <span className="text-emerald-900">✓ Sélection</span>
        <span className="text-emerald-900">✓ Dates & Durée</span>
        <span className="text-emerald-950 font-bold flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-emerald-950 text-white flex items-center justify-center text-[10px]">3</span> Informations</span>
        <span>4 Récapitulatif</span>
        <span>5 Paiement</span>
        <span>6 Confirmation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs">
          <h2 className="text-sm font-bold text-gray-900">Vos informations personnelles</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Nom Complet *</label>
              <input type="text" defaultValue="Jean-Paul Ndi" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none" />
            </div>
            <div>
              <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Adresse Email *</label>
              <input type="email" defaultValue="jp.ndi@afritech.cm" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Numéro de Téléphone *</label>
              <input type="text" defaultValue="+237 677 889 900" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none" />
            </div>
            <div>
              <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Nationalité *</label>
              <input type="text" defaultValue="Camerounaise" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Pièce d'identité (CNI ou Passeport) *</label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
              <span className="text-xl block mb-1">📤</span>
              <p className="font-medium text-gray-700">Cliquez pour télécharger ou glissez-déposez</p>
              <p className="text-[10px] text-gray-400 mt-1">PDF, JPG, PNG (Max. 5 Mo)</p>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Demandes spéciales / Notes de voyage</label>
            <textarea placeholder="Optionnel: Veuillez spécifier si vous avez besoin d'un transfert aéroport..." rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none resize-none"></textarea>
          </div>
        </div>

        {/* Résumé latéral */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-gray-900">Votre sélection</h3>
          <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-2xl">
            <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=200&q=80" alt="Chambre" className="w-16 h-16 object-cover rounded-xl" />
            <div>
              <p className="font-bold text-gray-900">Chambre VIP Émeraude</p>
              <p className="text-[10px] text-gray-500">Bonapriso, Douala</p>
            </div>
          </div>
          <div className="flex justify-between text-gray-600 border-t border-b border-gray-100 py-3">
            <span>Dates</span>
            <span className="font-bold text-gray-900">12 Nov - 19 Nov (7 Nuits)</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-emerald-950">
            <span>Total estimé</span>
            <span className="text-orange-700">620 000 FCFA</span>
          </div>
          <Link href="/reservation/etape-4" className="block text-center w-full bg-orange-700 hover:bg-orange-800 text-white py-3 rounded-xl font-medium shadow-md transition-colors">
            Continuer la réservation
          </Link>
        </div>
      </div>
    </div>
  );
}