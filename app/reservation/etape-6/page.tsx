"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StepProgressBar } from "@/app/reservation/StepProgressBar";

export default function ReservationEtape6() {
  // États dynamiques pour la confirmation
  const [reference, setReference] = useState("RES-2026-000125");
  const [bienTitre, setBienTitre] = useState("Chambre VIP Émeraude");
  const [datesTexte, setDatesTexte] = useState("Du 12 Nov au 19 Nov 2025");
  const [nuits, setNuits] = useState(7);
  const [voyageurs, setVoyageurs] = useState("2 Adultes");
  const [montantTotal, setMontantTotal] = useState(160250);
  const [reglementInfo, setReglementInfo] = useState("48 075 FCFA via MTN MoMo (Acompte 30%)");
  const [soldeRestant, setSoldeRestant] = useState(112175);
  const [emailClient, setEmailClient] = useState("client@example.com");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Génération ou récupération de la référence unique
    const storedRef = localStorage.getItem("reservation_reference");
    if (storedRef) {
      setReference(storedRef);
    } else {
      const newRef = "RES-" + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem("reservation_reference", newRef);
      setReference(newRef);
    }

    // Récupération des données des étapes 1, 2 et 3
    const storedBien = localStorage.getItem("reservation_bien");
    if (storedBien) {
      const bien = JSON.parse(storedBien);
      setBienTitre(bien.titre);
    }

    const storedDates = localStorage.getItem("reservation_dates");
    if (storedDates) {
      const dates = JSON.parse(storedDates);
      const nbNuits = Math.max(1, dates.fin - dates.debut);
      setNuits(nbNuits);
      setDatesTexte(`Du ${dates.debut} Nov au ${dates.fin} Nov 2025`);
    }

    const storedInfos = localStorage.getItem("reservation_infos");
    if (storedInfos) {
      const infos = JSON.parse(storedInfos);
      if (infos.email) setEmailClient(infos.email);
      if (infos.voyageurs) setVoyageurs(infos.voyageurs);
    }
  }, []);

  const handleDownloadPDF = () => {
    window.print(); // Déclenche l'impression / sauvegarde en PDF du reçu
  };

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 bg-white sm:px-6 sm:py-8 sm:space-y-8">

        <StepProgressBar current={6} />

        <div className="space-y-6 bg-white py-2 sm:space-y-8 sm:py-4">

          {/* En-tête de confirmation */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-950 text-white rounded-full flex items-center justify-center mx-auto shadow-sm text-xl">
              ✓
            </div>
            <h2 className="text-xl font-bold text-emerald-950 sm:text-2xl">Réservation confirmée !</h2>
            <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-900">
              <span>Référence de réservation :</span>
              {isEditing ? (
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="bg-white border border-emerald-300 px-2 py-0.5 rounded outline-none text-emerald-950 font-bold"
                />
              ) : (
                <span className="font-bold">{reference}</span>
              )}
            </div>
          </div>

          {/* Bloc Détails du séjour (Éditable et Dynamique) */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-6 text-xs max-w-4xl mx-auto relative sm:p-8">

            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide">Détails de votre séjour</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="self-start text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer sm:self-auto"
              >
                {isEditing ? "Enregistrer les modifications" : "✏️ Modifier les détails"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Hébergement</span>
                  {isEditing ? (
                    <input type="text" value={bienTitre} onChange={(e) => setBienTitre(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-bold text-gray-900 mt-1" />
                  ) : (
                    <span className="font-bold text-gray-900 text-sm">{bienTitre}</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Dates de séjour</span>
                  {isEditing ? (
                    <input type="text" value={datesTexte} onChange={(e) => setDatesTexte(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-bold text-gray-900 mt-1" />
                  ) : (
                    <span className="font-bold text-gray-900">{datesTexte} ({nuits} Nuits)</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Voyageurs</span>
                  {isEditing ? (
                    <input type="text" value={voyageurs} onChange={(e) => setVoyageurs(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-bold text-gray-900 mt-1" />
                  ) : (
                    <span className="font-bold text-gray-900">{voyageurs}</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Montant Total</span>
                  <span className="font-bold text-gray-900 text-sm">{montantTotal.toLocaleString()} FCFA</span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Règlement effectué</span>
                  {isEditing ? (
                    <input type="text" value={reglementInfo} onChange={(e) => setReglementInfo(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-bold text-orange-700 mt-1" />
                  ) : (
                    <span className="font-bold text-orange-700">{reglementInfo}</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Solde à payer sur place</span>
                  <span className="font-bold text-gray-900">{soldeRestant.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notification email */}
          <div className="max-w-4xl mx-auto bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3 text-xs text-gray-600 sm:items-center">
            <span className="text-base shrink-0">🔔</span>
            <p>
              Un e-mail de confirmation contenant votre reçu détaillé et votre contrat de location a été envoyé à l'adresse <strong className="text-gray-800 break-all">{emailClient}</strong>.
            </p>
          </div>

          {/* Boutons d'action finale */}
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={handleDownloadPDF}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-6 py-3.5 rounded-xl font-medium shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📥</span> Télécharger le reçu PDF
            </button>
            <Link
              href="/"
              className="bg-emerald-950 hover:bg-emerald-900 text-white px-8 py-3.5 rounded-xl font-medium shadow-md transition-colors flex items-center justify-center gap-2 text-center"
            >
              Accéder à mon espace client →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}