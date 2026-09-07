"use client";

import Link from "next/link";

export default function ReservationEtape4() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-6 text-xs font-semibold text-gray-500">
        <span className="text-emerald-900">✓ Sélection</span>
        <span className="text-emerald-900">✓ Dates & Durée</span>
        <span className="text-emerald-900">✓ Informations</span>
        <span className="text-emerald-950 font-bold flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-emerald-950 text-white flex items-center justify-center text-[10px]">4</span> Récapitulatif</span>
        <span>5 Paiement</span>
        <span>6 Confirmation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs">
            <h2 className="text-sm font-bold text-gray-900">Détail de votre facture avant paiement</h2>
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl">
              <div><span className="text-[10px] text-gray-400 block uppercase">Hébergement</span><span className="font-bold text-gray-900">Chambre VIP Émeraude</span></div>
              <div><span className="text-[10px] text-gray-400 block uppercase">Durée</span><span className="font-bold text-gray-900">3 Nuits</span></div>
              <div><span className="text-[10px] text-gray-400 block uppercase">Dates</span><span className="font-bold text-gray-900">12 Nov — 15 Nov</span></div>
            </div>

            <div className="space-y-3 pt-2 text-gray-600">
              <div className="flex justify-between"><span>Prix de la chambre (VIP Émeraude)</span><span className="font-bold text-gray-900">35 000 FCFA / nuit</span></div>
              <div className="flex justify-between"><span>Nombre de nuits réservées</span><span className="font-bold text-gray-900">x 3 nuits</span></div>
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-3"><span>Sous-total hébergement</span><span>105 000 FCFA</span></div>
              <div className="flex justify-between"><span>Frais de service & maintenance <span className="text-[10px] block text-gray-400">(Assistance 24/7, ménage quotidien)</span></span><span className="font-bold text-gray-900">5 250 FCFA</span></div>
              <div className="flex justify-between"><span>Caution remboursable <span className="text-[10px] block text-gray-400">(Restituée intégralement le jour du départ)</span></span><span className="font-bold text-gray-900">50 000 FCFA</span></div>
            </div>

            <div className="flex justify-between items-center bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 font-bold text-emerald-950 text-sm">
              <span>Montant Total Garanti</span>
              <span className="text-orange-700 text-base">160 250 FCFA</span>
            </div>
          </div>

          {/* Code promo */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3 text-xs">
            <label className="block font-bold text-gray-700">AVEZ-VOUS UN CODE DE RÉDUCTION ?</label>
            <div className="flex gap-3">
              <input type="text" placeholder="Ex: EMERAUDE2025" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none uppercase" />
              <button className="bg-emerald-950 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-900 transition-colors">Appliquer</button>
            </div>
          </div>
        </div>

        {/* Action suivante & Annulation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-emerald-950 text-white p-6 rounded-3xl space-y-4 shadow-md text-xs">
            <h3 className="font-bold text-sm">Prêt pour la prochaine étape ?</h3>
            <p className="text-gray-300 leading-relaxed">En confirmant ce récapitulatif, vous serez redirigé vers l'interface sécurisée de paiement (cartes bancaires ou paiement mobile camerounais).</p>
            <Link href="/reservation/etape-5" className="block text-center w-full bg-orange-700 hover:bg-orange-800 text-white py-3 rounded-xl font-medium shadow-md transition-colors">
              Procéder au paiement →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-gray-900">Conditions d'annulation</h4>
            <ul className="space-y-2 text-gray-500 list-disc pl-4 leading-relaxed">
              <li><strong className="text-gray-800">Annulation gratuite</strong> jusqu'à 48 heures avant l'heure d'arrivée prévue (12 Nov 2025).</li>
              <li>Au-delà de ce délai, des frais équivalents à une nuit de séjour seront retenus.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}