"use client";

import Link from "next/link";
import { useState } from "react";

export default function ReservationEtape5() {
  const [methode, setMethode] = useState("momo");

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-6 text-xs font-semibold text-gray-500">
        <span className="text-emerald-900">✓ Sélection</span>
        <span className="text-emerald-900">✓ Dates & Durée</span>
        <span className="text-emerald-900">✓ Informations</span>
        <span className="text-emerald-900">✓ Récapitulatif</span>
        <span className="text-emerald-950 font-bold flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-emerald-950 text-white flex items-center justify-center text-[10px]">5</span> Paiement</span>
        <span>6 Confirmation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs">
          <h2 className="text-sm font-bold text-gray-900">Choisissez votre méthode de paiement sécurisé</h2>

          <div className="space-y-4">
            {/* MTN MoMo */}
            <div className={`p-5 rounded-2xl border transition-all cursor-pointer ${methode === 'momo' ? 'border-orange-600 bg-orange-50/20' : 'border-gray-200'}`} onClick={() => setMethode('momo')}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-700 inline-block"></span> MTN Mobile Money
                </span>
                <span className="bg-yellow-100 text-yellow-800 font-bold px-2.5 py-1 rounded-lg text-[10px]">MTN MoMo</span>
              </div>
              <div className="flex gap-2">
                <span className="bg-gray-100 px-3 py-2.5 rounded-xl font-bold text-gray-600">+237</span>
                <input type="text" defaultValue="677 889 900" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 outline-none" />
              </div>
            </div>

            {/* Orange Money */}
            <div className={`p-5 rounded-2xl border transition-all cursor-pointer ${methode === 'om' ? 'border-orange-600 bg-orange-50/20' : 'border-gray-200'}`} onClick={() => setMethode('om')}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span> Orange Money
                </span>
                <span className="bg-orange-100 text-orange-800 font-bold px-2.5 py-1 rounded-lg text-[10px]">Orange</span>
              </div>
            </div>

            {/* Carte Bancaire */}
            <div className={`p-5 rounded-2xl border transition-all cursor-pointer ${methode === 'card' ? 'border-orange-600 bg-orange-50/20' : 'border-gray-200'}`} onClick={() => setMethode('card')}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span> Carte bancaire (Visa / MasterCard)
                </span>
                <span className="text-gray-400 font-bold text-sm">💳</span>
              </div>
            </div>

            {/* Espèces */}
            <div className={`p-5 rounded-2xl border transition-all cursor-pointer ${methode === 'cash' ? 'border-orange-600 bg-orange-50/20' : 'border-gray-200'}`} onClick={() => setMethode('cash')}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span> Paiement en espèces lors de l'arrivée
                </span>
                <span className="text-[10px] text-gray-400">Sous conditions d'empreinte bancaire</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formule de règlement & Validation */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-gray-900">Formule de règlement</h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-900 bg-emerald-50/40 cursor-pointer">
              <input type="radio" name="reglement" defaultChecked className="accent-emerald-900" />
              <div>
                <span className="font-bold text-gray-900 block">Payer l'acompte de 30%</span>
                <span className="text-[10px] text-gray-500">Le solde (70%) sera réglé à la résidence</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 cursor-pointer">
              <input type="radio" name="reglement" className="accent-emerald-900" />
              <div>
                <span className="font-bold text-gray-900 block">Payer l'intégralité (100%)</span>
                <span className="text-[10px] text-gray-500">Pas de transaction nécessaire à l'arrivée</span>
              </div>
            </label>
          </div>

          <div className="space-y-1 pt-2 border-t border-gray-100 text-gray-500">
            <div className="flex justify-between"><span>Total du séjour</span><span>160 250 FCFA</span></div>
            <div className="flex justify-between font-bold text-gray-900"><span>Acompte exigible (30%)</span><span className="text-orange-700">48 075 FCFA</span></div>
            <div className="flex justify-between"><span>Solde à payer sur place</span><span>112 175 FCFA</span></div>
          </div>

          <Link href="/reservation/etape-6" className="block text-center w-full bg-emerald-950 hover:bg-emerald-900 text-white py-3.5 rounded-xl font-bold shadow-md transition-colors mt-4">
            Payer maintenant (48 075 FCFA) ✓
          </Link>
          <p className="text-[10px] text-center text-gray-400">Paiement 100% sécurisé et crypté SSL</p>
        </div>
      </div>
    </div>
  );
}