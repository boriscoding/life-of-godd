"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReservationEtape5() {
  const [methode, setMethode] = useState("momo");
  const [formule, setFormule] = useState<"acompte" | "integral">("acompte");
  
  // États pour les champs éditables de paiement
  const [telephone, setTelephone] = useState("677 889 900");
  const [numeroCarte, setNumeroCarte] = useState("");
  const [expirationCarte, setExpirationCarte] = useState("");
  const [cvvCarte, setCvvCarte] = useState("");

  // Montant global récupéré des étapes précédentes (par défaut 160 250 FCFA)
  const [totalGlobal, setTotalGlobal] = useState(160250);

  useEffect(() => {
    // Récupération dynamique du bien et des dates pour recalculer le montant si nécessaire, 
    // ou lecture d'un montant global stocké.
    const storedBien = localStorage.getItem("reservation_bien");
    const storedDates = localStorage.getItem("reservation_dates");
    const storedPromo = localStorage.getItem("reservation_promo");

    if (storedBien && storedDates) {
      const bien = JSON.parse(storedBien);
      const dates = JSON.parse(storedDates);
      const nuits = Math.max(1, dates.fin - dates.debut);
      const fraisService = 25000;
      const caution = 50000;
      let sousTotal = bien.prixNuite * nuits;

      if (storedPromo) {
        const promo = JSON.parse(storedPromo);
        sousTotal -= promo.duction || promo.reduction || 0;
      }

      setTotalGlobal(sousTotal + fraisService + caution);
    }
  }, []);

  // Calculs dynamiques selon la formule de règlement
  const montantAcompte = Math.round(totalGlobal * 0.3);
  const montantSoldeSurPlace = totalGlobal - montantAcompte;
  const montantFinalAPayer = formule === "acompte" ? montantAcompte : totalGlobal;

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 bg-white">
        
        {/* Barre de progression */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-6 text-xs font-semibold text-gray-500 bg-white">
          <span className="text-emerald-900">✓ Sélection</span>
          <span className="text-emerald-900">✓ Dates & Durée</span>
          <span className="text-emerald-900">✓ Informations</span>
          <span className="text-emerald-900">✓ Récapitulatif</span>
          <span className="text-emerald-950 font-bold flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-950 text-white flex items-center justify-center text-[10px]">5</span> Paiement
          </span>
          <span>6 Confirmation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white">
          {/* Méthodes de paiement interactives */}
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs">
            <h2 className="text-sm font-bold text-gray-900">Choisissez votre méthode de paiement sécurisé</h2>

            <div className="space-y-4">
              {/* MTN MoMo */}
              <div 
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${methode === 'momo' ? 'border-orange-600 bg-orange-50/20 shadow-sm' : 'border-gray-200'}`} 
                onClick={() => setMethode('momo')}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${methode === 'momo' ? 'bg-orange-600' : 'bg-gray-300'} inline-block`}></span> MTN Mobile Money
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 font-bold px-2.5 py-1 rounded-lg text-[10px]">MTN MoMo</span>
                </div>
                {methode === 'momo' && (
                  <div className="flex gap-2 pt-2 animate-fadeIn">
                    <span className="bg-gray-100 px-3 py-2.5 rounded-xl font-bold text-gray-600 flex items-center">+237</span>
                    <input 
                      type="text" 
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="677 889 900" 
                      className="flex-1 bg-white border border-gray-200 rounded-xl p-2.5 outline-none font-medium text-gray-800" 
                    />
                  </div>
                )}
              </div>

              {/* Orange Money */}
              <div 
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${methode === 'om' ? 'border-orange-600 bg-orange-50/20 shadow-sm' : 'border-gray-200'}`} 
                onClick={() => setMethode('om')}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${methode === 'om' ? 'bg-orange-600' : 'bg-gray-300'} inline-block`}></span> Orange Money
                  </span>
                  <span className="bg-orange-100 text-orange-800 font-bold px-2.5 py-1 rounded-lg text-[10px]">Orange</span>
                </div>
                {methode === 'om' && (
                  <div className="flex gap-2 pt-2 animate-fadeIn">
                    <span className="bg-gray-100 px-3 py-2.5 rounded-xl font-bold text-gray-600 flex items-center">+237</span>
                    <input 
                      type="text" 
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="699 000 000" 
                      className="flex-1 bg-white border border-gray-200 rounded-xl p-2.5 outline-none font-medium text-gray-800" 
                    />
                  </div>
                )}
              </div>

              {/* Carte Bancaire */}
              <div 
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${methode === 'card' ? 'border-orange-600 bg-orange-50/20 shadow-sm' : 'border-gray-200'}`} 
                onClick={() => setMethode('card')}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${methode === 'card' ? 'bg-orange-600' : 'bg-gray-300'} inline-block`}></span> Carte bancaire (Visa / MasterCard)
                  </span>
                  <span className="text-gray-400 font-bold text-sm">💳</span>
                </div>
                {methode === 'card' && (
                  <div className="grid grid-cols-3 gap-2 pt-4 animate-fadeIn">
                    <input 
                      type="text" 
                      placeholder="Numéro de carte (4242...)" 
                      value={numeroCarte}
                      onChange={(e) => setNumeroCarte(e.target.value)}
                      className="col-span-3 bg-white border border-gray-200 rounded-xl p-2.5 outline-none font-medium text-gray-800" 
                    />
                    <input 
                      type="text" 
                      placeholder="MM/AA" 
                      value={expirationCarte}
                      onChange={(e) => setExpirationCarte(e.target.value)}
                      className="col-span-2 bg-white border border-gray-200 rounded-xl p-2.5 outline-none font-medium text-gray-800" 
                    />
                    <input 
                      type="password" 
                      placeholder="CVV" 
                      value={cvvCarte}
                      onChange={(e) => setCvvCarte(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl p-2.5 outline-none font-medium text-gray-800" 
                    />
                  </div>
                )}
              </div>

              {/* Espèces */}
              <div 
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${methode === 'cash' ? 'border-orange-600 bg-orange-50/20 shadow-sm' : 'border-gray-200'}`} 
                onClick={() => setMethode('cash')}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${methode === 'cash' ? 'bg-orange-600' : 'bg-gray-300'} inline-block`}></span> Paiement en espèces lors de l'arrivée
                  </span>
                  <span className="text-[10px] text-gray-400">Sous conditions d'empreinte bancaire</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formule de règlement & Validation dynamique */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-gray-900">Formule de règlement</h3>

            <div className="space-y-3">
              <label 
                onClick={() => setFormule("acompte")}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${formule === 'acompte' ? 'border-emerald-900 bg-emerald-50/40' : 'border-gray-200'}`}
              >
                <input type="radio" name="reglement" checked={formule === 'acompte'} onChange={() => setFormule("acompte")} className="accent-emerald-900" />
                <div>
                  <span className="font-bold text-gray-900 block">Payer l'acompte de 30%</span>
                  <span className="text-[10px] text-gray-500">Le solde (70%) sera réglé à la résidence</span>
                </div>
              </label>

              <label 
                onClick={() => setFormule("integral")}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${formule === 'integral' ? 'border-emerald-900 bg-emerald-50/40' : 'border-gray-200'}`}
              >
                <input type="radio" name="reglement" checked={formule === 'integral'} onChange={() => setFormule("integral")} className="accent-emerald-900" />
                <div>
                  <span className="font-bold text-gray-900 block">Payer l'intégralité (100%)</span>
                  <span className="text-[10px] text-gray-500">Pas de transaction nécessaire à l'arrivée</span>
                </div>
              </label>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-gray-100 text-gray-500">
              <div className="flex justify-between"><span>Total du séjour</span><span className="font-medium text-gray-800">{totalGlobal.toLocaleString()} FCFA</span></div>
              <div className="flex justify-between font-bold text-gray-900">
                <span>{formule === 'acompte' ? 'Acompte exigible (30%)' : 'Total intégral (100%)'}</span>
                <span className="text-orange-700">{montantFinalAPayer.toLocaleString()} FCFA</span>
              </div>
              {formule === 'acompte' && (
                <div className="flex justify-between text-[11px] text-gray-400"><span>Solde à payer sur place</span><span>{montantSoldeSurPlace.toLocaleString()} FCFA</span></div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Link href="/reservation/etape-4" className="w-1/3 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center">
                Retour
              </Link>
              <Link href="/reservation/etape-6" className="w-2/3 text-center bg-emerald-950 hover:bg-emerald-900 text-white py-3.5 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center">
                Payer ({montantFinalAPayer.toLocaleString()} F) ✓
              </Link>
            </div>
            <p className="text-[10px] text-center text-gray-400">Paiement 100% sécurisé et crypté SSL</p>
          </div>
        </div>
      </div>
    </div>
  );
}