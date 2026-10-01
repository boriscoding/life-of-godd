"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StepProgressBar } from "@/app/reservation/StepProgressBar";
import { getBienSelection, getDatesSelection, getGuestInfo, getStoredReference } from "@/app/lib/reservation";
import { useAuth } from "@/app/contexte/AuthContext";

// Numéro WhatsApp de la Résidence (voir app/contact/page.tsx)
const WHATSAPP_NUMBER = "237655443322";

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
  const [telephoneClient, setTelephoneClient] = useState("");
  const [qrPayload, setQrPayload] = useState("");

  useEffect(() => {
    // La référence provient désormais de l'API (créée à l'étape 5), pas d'un
    // identifiant généré aléatoirement côté client.
    const storedRef = getStoredReference();
    if (storedRef) setReference(storedRef);

    const bien = getBienSelection();
    const dates = getDatesSelection();
    const guest = getGuestInfo();
    if (bien) setBienTitre(bien.nom);
    if (guest?.telephone) setTelephoneClient(guest.telephone);

    let nbNuits = 1;
    let total = 0;
    let acompte = 0;

    if (dates) {
      nbNuits = Math.max(1, dates.fin - dates.debut);
      setNuits(nbNuits);
      setDatesTexte(`Du ${dates.debut} Nov au ${dates.fin} Nov 2025`);
    }

    if (bien && dates) {
      const fraisService = 25000;
      const caution = 50000;
      const storedPromo = localStorage.getItem("reservation_promo");
      let sousTotal = bien.prixNuite * nbNuits;
      if (storedPromo) {
        const promo = JSON.parse(storedPromo);
        sousTotal -= promo.reduction || 0;
      }
      total = sousTotal + fraisService + caution;
      setMontantTotal(total);

      // La formule (acompte/intégral) choisie à l'étape 5 n'est pour l'instant
      // pas repersistée après paiement : on affiche un acompte de 30% par
      // défaut. Idéalement, l'API de création de réservation (étape 5)
      // devrait renvoyer directement montantPaye / soldeRestant, à consommer
      // ici plutôt que recalculés côté client.
      acompte = Math.round(total * 0.3);
      setSoldeRestant(total - acompte);
      setReglementInfo(`${acompte.toLocaleString()} FCFA versés (Acompte 30%)`);
    }

    const storedInfos = localStorage.getItem("reservation_form");
    let nomClient = user?.name || user?.email || "Voyageur";
    let mailClient = user?.email || "";
    if (storedInfos) {
      const infos = JSON.parse(storedInfos);
      if (infos.email) mailClient = infos.email;
      if (infos.nomComplet) nomClient = infos.nomComplet;
    }
    if (user?.email) mailClient = user.email;
    setEmailClient(mailClient);
    setVoyageurs(nomClient);

    // QR code : encode toutes les infos de la transaction (référence,
    // client, bien, dates, montants) — à scanner par la réception ou à
    // conserver comme preuve de réservation.
    const transactionPayload = {
      reference: storedRef || reference,
      userId: user?.id || null,
      client: {
        nom: nomClient,
        email: mailClient,
        telephone: guest?.telephone || "",
      },
      bien: bienTitre || bien?.nom || "",
      dates: dates ? { debut: dates.debut, fin: dates.fin, nuits: nbNuits } : null,
      montantTotal: total,
      acompteVerse: acompte,
      soldeRestant: total - acompte,
    };
    setQrPayload(JSON.stringify(transactionPayload));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDownloadPDF = () => {
    window.print();
  };

  const qrCodeUrl = qrPayload
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrPayload)}`
    : "";

  const handleSendWhatsApp = () => {
    const message = [
      `*Confirmation de réservation - Résidence Émeraude*`,
      ``,
      `Référence : ${reference}`,
      `Client : ${voyageurs}`,
      `Email : ${emailClient}`,
      telephoneClient ? `Téléphone : ${telephoneClient}` : null,
      ``,
      `Hébergement : ${bienTitre}`,
      `Dates : ${datesTexte} (${nuits} nuits)`,
      `Montant total : ${montantTotal.toLocaleString()} FCFA`,
      `Réglement : ${reglementInfo}`,
      `Solde à payer sur place : ${soldeRestant.toLocaleString()} FCFA`,
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
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

          {/* Bloc Détails du séjour + QR code */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-6 text-xs max-w-4xl mx-auto relative sm:p-8">

            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide">Détails de votre séjour</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-start">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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

              {/* QR code de la transaction */}
              {qrCodeUrl && (
                <div className="flex flex-col items-center gap-2 pt-4 sm:pt-0 sm:pl-6 sm:border-l sm:border-gray-100">
                  <img
                    src={qrCodeUrl}
                    alt="QR code de la transaction"
                    className="w-32 h-32 rounded-xl border border-gray-100"
                  />
                  <span className="text-[10px] text-gray-400 text-center max-w-[130px]">
                    À présenter à la réception
                  </span>
                </div>
              )}
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
            <button
              onClick={handleSendWhatsApp}
              className="bg-[#25D366] hover:bg-[#1fb855] text-white px-6 py-3.5 rounded-xl font-medium shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📱</span> Envoyer via WhatsApp
            </button>
            <Link
              href="/compte/reservations"
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