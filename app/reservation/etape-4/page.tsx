"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReservationEtape4() {
  // 1. États pour récupérer les données dynamiques des étapes précédentes
  const [bien, setBien] = useState({
    titre: "Chambre VIP Émeraude",
    prixNuite: 85000,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=200&q=80"
  });

  const [dates, setDates] = useState({
    debut: 12,
    fin: 19
  });

  // 2. États pour la gestion du code promo et de la remise
  const [codePromoInput, setCodePromoInput] = useState("");
  const [codeApplique, setCodeApplique] = useState<{ code: string; reduction: number } | null>(null);
  const [messagePromo, setMessagePromo] = useState("");

  useEffect(() => {
    // Récupération du bien choisi à l'étape 1
    const storedBien = localStorage.getItem("reservation_bien");
    if (storedBien) {
      setBien(JSON.parse(storedBien));
    }

    // Récupération des dates choisies à l'étape 2
    const storedDates = localStorage.getItem("reservation_dates");
    if (storedDates) {
      setDates(JSON.parse(storedDates));
    }

    // Récupération d'un éventuel code promo déjà validé
    const storedPromo = localStorage.getItem("reservation_promo");
    if (storedPromo) {
      setCodeApplique(JSON.parse(storedPromo));
    }
  }, []);

  // Calculs dynamiques
  const nuits = Math.max(1, dates.fin - dates.debut);
  const sousTotalHebergement = bien.prixNuite * nuits;
  const fraisService = 25000;
  const caution = 50000;

  // Gestion de l'application d'un code promo
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const codeNettoye = codePromoInput.trim().toUpperCase();

    // Exemple de codes promo valides
    if (codeNettoye === "EMERAUDE2025" || codeNettoye === "VIP10") {
      const promoData = { code: codeNettoye, reduction: 10000 }; // 10 000 FCFA de réduction par exemple
      setCodeApplique(promoData);
      localStorage.setItem("reservation_promo", JSON.stringify(promoData));
      setMessagePromo("Code promo appliqué avec succès ! (-10 000 FCFA)");
    } else {
      setMessagePromo("Code promo invalide ou expiré.");
    }
  };

  const montantRemise = codeApplique ? codeApplique.reduction : 0;
  const totalGlobal = sousTotalHebergement + fraisService + caution - montantRemise;

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 bg-white">
        
        {/* Barre de progression */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-6 text-xs font-semibold text-gray-500 bg-white">
          <span className="text-emerald-900">✓ Sélection</span>
          <span className="text-emerald-900">✓ Dates & Durée</span>
          <span className="text-emerald-900">✓ Informations</span>
          <span className="text-emerald-950 font-bold flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-950 text-white flex items-center justify-center text-[10px]">4</span> Récapitulatif
          </span>
          <span>5 Paiement</span>
          <span>6 Confirmation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white">
          <div className="lg:col-span-8 space-y-6 bg-white">
            {/* Détail de la facture dynamique */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs">
              <h2 className="text-sm font-bold text-gray-900">Détail de votre facture avant paiement</h2>
              
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Hébergement</span>
                  <span className="font-bold text-gray-900">{bien.titre}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Durée</span>
                  <span className="font-bold text-gray-900">{nuits} Nuit{nuits > 1 ? 's' : ''}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Dates</span>
                  <span className="font-bold text-gray-900">{dates.debut} Nov — {dates.fin} Nov 2025</span>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Prix de la chambre ({bien.titre})</span>
                  <span className="font-bold text-gray-900">{bien.prixNuite.toLocaleString()} FCFA / nuit</span>
                </div>
                <div className="flex justify-between">
                  <span>Nombre de nuits réservées</span>
                  <span className="font-bold text-gray-900">x {nuits} nuit{nuits > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-3">
                  <span>Sous-total hébergement</span>
                  <span>{sousTotalHebergement.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de service & maintenance <span className="text-[10px] block text-gray-400">(Assistance 24/7, ménage quotidien)</span></span>
                  <span className="font-bold text-gray-900">{fraisService.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Caution remboursable <span className="text-[10px] block text-gray-400">(Restituée intégralement le jour du départ)</span></span>
                  <span className="font-bold text-gray-900">{caution.toLocaleString()} FCFA</span>
                </div>

                {/* Affichage de la réduction si un code promo est actif */}
                {codeApplique && (
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-xl">
                    <span>Réduction appliquée ({codeApplique.code})</span>
                    <span>- {codeApplique.reduction.toLocaleString()} FCFA</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 font-bold text-emerald-950 text-sm">
                <span>Montant Total Garanti</span>
                <span className="text-orange-700 text-base">{totalGlobal.toLocaleString()} FCFA</span>
              </div>
            </div>

            {/* Code promo éditable */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3 text-xs">
              <label className="block font-bold text-gray-700">AVEZ-VOUS UN CODE DE RÉDUCTION ?</label>
              <form onSubmit={handleApplyPromo} className="flex gap-3">
                <input 
                  type="text" 
                  value={codePromoInput}
                  onChange={(e) => setCodePromoInput(e.target.value)}
                  placeholder="Ex: EMERAUDE2025" 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none uppercase font-medium text-gray-800" 
                />
                <button type="submit" className="bg-emerald-950 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-900 transition-colors cursor-pointer">
                  Appliquer
                </button>
              </form>
              {messagePromo && <p className={`text-[11px] font-medium ${codeApplique ? 'text-emerald-700' : 'text-red-500'}`}>{messagePromo}</p>}
            </div>
          </div>

          {/* Action suivante & Annulation */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-emerald-950 text-white p-6 rounded-3xl space-y-4 shadow-md text-xs">
              <h3 className="font-bold text-sm">Prêt pour la prochaine étape ?</h3>
              <p className="text-gray-300 leading-relaxed">En confirmant ce récapitulatif, vous serez redirigé vers l'interface sécurisée de paiement (cartes bancaires ou paiement mobile camerounais).</p>
              
              <div className="flex gap-2 pt-2">
                <Link href="/reservation/etape-3" className="w-1/3 text-center bg-emerald-900 hover:bg-emerald-800 text-gray-200 py-3 rounded-xl font-medium transition-colors flex items-center justify-center">
                  Retour
                </Link>
                <Link href="/reservation/etape-5" className="w-2/3 text-center bg-orange-700 hover:bg-orange-800 text-white py-3 rounded-xl font-medium shadow-md transition-colors flex items-center justify-center">
                  Procéder au paiement →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3 text-xs">
              <h4 className="font-bold text-gray-900">Conditions d'annulation</h4>
              <ul className="space-y-2 text-gray-500 list-disc pl-4 leading-relaxed">
                <li><strong className="text-gray-800">Annulation gratuite</strong> jusqu'à 48 heures avant l'heure d'arrivée prévue ({dates.debut} Nov 2025).</li>
                <li>Au-delà de ce délai, des frais équivalents à une nuit de séjour seront retenus.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}