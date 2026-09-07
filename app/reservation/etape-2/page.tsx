"use client";

import Link from "next/link";

export default function ReservationEtape2() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-6 text-xs font-semibold text-gray-500">
        <span className="text-emerald-900">✓ Sélection</span>
        <span className="text-emerald-950 font-bold flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-emerald-950 text-white flex items-center justify-center text-[10px]">2</span> Dates & Durée</span>
        <span>3 Informations</span>
        <span>4 Récapitulatif</span>
        <span>5 Paiement</span>
        <span>6 Confirmation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calendrier interactif (Simulation) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-emerald-950">Sélectionnez vos dates de séjour</h2>
          <div className="text-center font-bold text-sm text-gray-800">Novembre 2025</div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 font-medium">
            <span>Dim</span><span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span>
            {Array.from({ length: 30 }).map((_, i) => {
              const jour = i + 1;
              const isSelected = jour >= 12 && jour <= 19;
              const isStartOrEnd = jour === 12 || jour === 19;
              return (
                <div 
                  key={i} 
                  className={`py-3 rounded-xl text-xs font-bold transition-all ${
                    isStartOrEnd ? 'bg-emerald-900 text-white' : isSelected ? 'bg-emerald-50 text-emerald-950' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {jour}
                </div>
              );
            })}
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
          <div className="space-y-2 border-t border-b border-gray-100 py-4 text-gray-600">
            <div className="flex justify-between"><span>Arrivée</span><span className="font-bold text-gray-900">Mercredi, 12 Nov 2025</span></div>
            <div className="flex justify-between"><span>Départ</span><span className="font-bold text-gray-900">Mercredi, 19 Nov 2025</span></div>
            <div className="flex justify-between"><span>Durée totale</span><span className="font-bold text-orange-700">7 Nuits</span></div>
          </div>
          <div className="space-y-1 text-gray-500">
            <div className="flex justify-between"><span>Tarif de base (7 x 85k)</span><span>595 000 FCFA</span></div>
            <div className="flex justify-between"><span>Taxes & Frais de service</span><span>25 000 FCFA</span></div>
          </div>
          <div className="flex justify-between font-bold text-sm text-emerald-950 pt-2 border-t border-gray-100">
            <span>Total estimé</span>
            <span className="text-orange-700">620 000 FCFA</span>
          </div>
          <Link href="/reservation/etape-3" className="block text-center w-full bg-orange-700 hover:bg-orange-800 text-white py-3 rounded-xl font-medium shadow-md transition-colors">
            Continuer vers l'étape suivante
          </Link>
        </div>
      </div>
    </div>
  );
}