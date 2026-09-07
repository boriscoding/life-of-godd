"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReservationEtape2() {
  const [bien, setBien] = useState({
    titre: "Chambre VIP Émeraude",
    prixNuite: 85000,
    prix: "85 000 FCFA",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=200&q=80"
  });

  // États pour rendre les dates éditables et interactives
  const [dateDebut, setDateDebut] = useState<number>(12);
  const [dateFin, setDateFin] = useState<number>(19);

  useEffect(() => {
    // 1. Récupération automatique du bien choisi à l'étape 1
    const storedBien = localStorage.getItem("reservation_bien");
    if (storedBien) {
      setBien(JSON.parse(storedBien));
    }

    // 2. Récupérer les dates si l'utilisateur les avait déjà modifiées
    const storedDates = localStorage.getItem("reservation_dates");
    if (storedDates) {
      const parsed = JSON.parse(storedDates);
      setDateDebut(parsed.debut);
      setDateFin(parsed.fin);
    }
  }, []);

  // Gestion du clic sur un jour du calendrier
  const handleDayClick = (jour: number) => {
    if (jour < dateDebut || dateDebut !== dateFin) {
      // Si on clique sur une nouvelle date de début (ou réinitialisation)
      setDateDebut(jour);
      setDateFin(jour);
      saveDates(jour, jour);
    } else {
      // Si la date de début est déjà fixée, on définit la date de fin
      if (jour > dateDebut) {
        setDateFin(jour);
        saveDates(dateDebut, jour);
      } else {
        setDateDebut(jour);
        setDateFin(jour);
        saveDates(jour, jour);
      }
    }
  };

  const saveDates = (debut: number, fin: number) => {
    localStorage.setItem("reservation_dates", JSON.stringify({ debut, fin }));
  };

  // Calcul dynamique des nuits et des prix
  const nuits = Math.max(1, dateFin - dateDebut);
  const fraisService = 25000;
  const totalTarif = (bien.prixNuite * nuits) + fraisService;

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 bg-white">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-6 text-xs font-semibold text-gray-500 bg-white">
          <span className="text-emerald-900">✓ Sélection</span>
          <span className="text-emerald-950 font-bold flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-950 text-white flex items-center justify-center text-[10px]">2</span> Dates & Durée
          </span>
          <span>3 Informations</span>
          <span>4 Récapitulatif</span>
          <span>5 Paiement</span>
          <span>6 Confirmation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white">
          {/* Calendrier interactif et éditable */}
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-emerald-950">Sélectionnez vos dates de séjour</h2>
              <span className="text-[11px] text-gray-400 bg-gray-50 px-3 py-1 rounded-xl">Cliquez sur une date de début puis de fin</span>
            </div>
            <div className="text-center font-bold text-sm text-gray-800">Novembre 2025</div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 font-medium">
              <span>Dim</span><span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span>
              {Array.from({ length: 30 }).map((_, i) => {
                const jour = i + 1;
                const isSelected = jour >= dateDebut && jour <= dateFin;
                const isStartOrEnd = jour === dateDebut || jour === dateFin;

                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => handleDayClick(jour)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isStartOrEnd 
                        ? 'bg-emerald-900 text-white shadow-sm' 
                        : isSelected 
                        ? 'bg-emerald-50 text-emerald-950' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {jour}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Résumé latéral dynamique & mis à jour en temps réel */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-gray-900">Votre sélection</h3>
            <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-2xl">
              <img src={bien.image} alt={bien.titre} className="w-16 h-16 object-cover rounded-xl" />
              <div>
                <p className="font-bold text-gray-900">{bien.titre}</p>
                <p className="text-[10px] text-gray-500">Bonapriso, Douala</p>
              </div>
            </div>
            <div className="space-y-2 border-t border-b border-gray-100 py-4 text-gray-600">
              <div className="flex justify-between"><span>Arrivée</span><span className="font-bold text-gray-900">{dateDebut} Nov 2025</span></div>
              <div className="flex justify-between"><span>Départ</span><span className="font-bold text-gray-900">{dateFin} Nov 2025</span></div>
              <div className="flex justify-between"><span>Durée totale</span><span className="font-bold text-orange-700">{nuits} Nuit{nuits > 1 ? 's' : ''}</span></div>
            </div>
            <div className="space-y-1 text-gray-500">
              <div className="flex justify-between"><span>Tarif de base</span><span>{(bien.prixNuite * nuits).toLocaleString()} FCFA</span></div>
              <div className="flex justify-between"><span>Taxes & Frais</span><span>{fraisService.toLocaleString()} FCFA</span></div>
            </div>
            <div className="flex justify-between font-bold text-sm text-emerald-950 pt-2 border-t border-gray-100">
              <span>Total estimé</span>
              <span className="text-orange-700">{totalTarif.toLocaleString()} FCFA</span>
            </div>
            <div className="flex gap-2 pt-2">
              <Link href="/reservation" className="w-1/3 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors flex items-center justify-center">
                Retour
              </Link>
              <Link href="/reservation/etape-3" className="w-2/3 text-center bg-orange-700 hover:bg-orange-800 text-white py-3 rounded-xl font-medium shadow-md transition-colors flex items-center justify-center">
                Continuer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}