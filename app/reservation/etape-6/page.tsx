"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StepProgressBar } from "@/app/reservation/StepProgressBar";
import { getBienSelection, getDatesSelection, getStoredReference } from "@/app/lib/reservation";
import { useAuth } from "@/app/contexte/AuthContext";

export default function ReservationEtape6() {
  const { user } = useAuth();

  const [reference, setReference] = useState("—");
  const [bienTitre, setBienTitre] = useState("");
  const [datesTexte, setDatesTexte] = useState("");
  const [nuits, setNuits] = useState(1);
  const [voyageurs, setVoyageurs] = useState("");
  const [montantTotal, setMontantTotal] = useState(0);
  const [reglementInfo, setReglementInfo] = useState("");
  const [soldeRestant, setSoldeRestant] = useState(0);
  const [emailClient, setEmailClient] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // La référence provient désormais de l'API (créée à l'étape 5), pas d'un
    // identifiant généré aléatoirement côté client.
    const storedRef = getStoredReference();
    if (storedRef) setReference(storedRef);

    const bien = getBienSelection();
    const dates = getDatesSelection();
    if (bien) setBienTitre(bien.nom);

    if (dates) {
      const nbNuits = Math.max(1, dates.fin - dates.debut);
      setNuits(nbNuits);
      setDatesTexte(`Du ${dates.debut} Nov au ${dates.fin} Nov 2025`);
    }

    if (bien && dates) {
      const nbNuits = Math.max(1, dates.fin - dates.debut);
      const fraisService = 25000;
      const caution = 50000;
      const storedPromo = localStorage.getItem("reservation_promo");
      let sousTotal = bien.prixNuite * nbNuits;
      if (storedPromo) {
        const promo = JSON.parse(storedPromo);
        sousTotal -= promo.reduction || 0;
      }
      const total = sousTotal + fraisService + caution;
      setMontantTotal(total);

      // La formule (acompte/intégral) choisie à l'étape 5 n'est pour l'instant
      // pas repersistée après paiement : on affiche un acompte de 30% par
      // défaut. Idéalement, l'API de création de réservation (étape 5)
      // devrait renvoyer directement montantPaye / soldeRestant, à consommer
      // ici plutôt que recalculés côté client.
      const acompte = Math.round(total * 0.3);
      setSoldeRestant(total - acompte);
      setReglementInfo(`${acompte.toLocaleString()} FCFA versés (Acompte 30%)`);
    }

    const storedInfos = localStorage.getItem("reservation_form");
    if (storedInfos) {
      const infos = JSON.parse(storedInfos);
      if (infos.email) setEmailClient(infos.email);
    }
    if (user?.email) setEmailClient(user.email);
    setVoyageurs(user?.name || user?.email || "Voyageur");
  }, [user]);

  const handleDownloadPDF = () => {
    window.print();
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
              <span className="font-bold">{reference}</span>
            </div>
          </div>

          {/* Bloc Détails du séjour */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-6 text-xs max-w-4xl mx-auto relative sm:p-8">

            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide">Détails de votre séjour</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Hébergement</span>
                  <span className="font-bold text-gray-900 text-sm">{bienTitre}</span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Dates de séjour</span>
                  <span className="font-bold text-gray-900">{datesTexte} ({nuits} Nuits)</span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Voyageur</span>
                  <span className="font-bold text-gray-900">{voyageurs}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Montant Total</span>
                  <span className="font-bold text-gray-900 text-sm">{montantTotal.toLocaleString()} FCFA</span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-medium">Règlement effectué</span>
                  <span className="font-bold text-orange-700">{reglementInfo || "Paiement en cours de traitement"}</span>
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
              href="/compte/dashboard"
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