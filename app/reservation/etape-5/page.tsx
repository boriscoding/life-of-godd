"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StepProgressBar } from "@/app/reservation/StepProgressBar";
import { useAuth } from "@/app/contexte/AuthContext";
import {
  getBienSelection,
  getDatesSelection,
  getGuestInfo,
  createReservationAndPay,
  type BienSelection,
  type DatesSelection,
} from "@/app/lib/reservation";

export default function ReservationEtape5() {
  const router = useRouter();
  const { user } = useAuth();

  const [methode, setMethode] = useState<"momo" | "om" | "card" | "cash">("momo");
  const [formule, setFormule] = useState<"acompte" | "integral">("acompte");

  const [telephone, setTelephone] = useState("677 889 900");
  const [numeroCarte, setNumeroCarte] = useState("");
  const [expirationCarte, setExpirationCarte] = useState("");
  const [cvvCarte, setCvvCarte] = useState("");

  const [bien, setBien] = useState<BienSelection | null>(null);
  const [dates, setDates] = useState<DatesSelection | null>(null);
  const [totalGlobal, setTotalGlobal] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const bienSelectionne = getBienSelection();
    const datesSelectionnees = getDatesSelection();
    setBien(bienSelectionne);
    setDates(datesSelectionnees);

    if (bienSelectionne && datesSelectionnees) {
      const storedPromo = localStorage.getItem("reservation_promo");
      const nuits = Math.max(1, datesSelectionnees.fin - datesSelectionnees.debut);
      const fraisService = 25000;
      const caution = 50000;
      let sousTotal = bienSelectionne.prixNuite * nuits;

      if (storedPromo) {
        try {
          const promo = JSON.parse(storedPromo);
          sousTotal -= promo.reduction || 0;
        } catch {
          // Ignorer si le format JSON est invalide
        }
      }

      setTotalGlobal(sousTotal + fraisService + caution);
    }
  }, []);

  const montantAcompte = Math.round(totalGlobal * 0.3);
  const montantSoldeSurPlace = totalGlobal - montantAcompte;
  const montantFinalAPayer = formule === "acompte" ? montantAcompte : totalGlobal;

  // Validation préalable des formulaires selon le mode de paiement choisi
  const validerChampsPaiement = (): boolean => {
    const phoneClean = telephone.replace(/\s+/g, "");

    if (methode === "momo" || methode === "om") {
      if (!phoneClean || phoneClean.length < 8) {
        setError("Veuillez saisir un numéro de téléphone valide pour le paiement mobile.");
        return false;
      }
    }

    if (methode === "card") {
      const cleanCard = numeroCarte.replace(/\s+/g, "");
      if (!cleanCard || cleanCard.length < 12) {
        setError("Veuillez saisir un numéro de carte bancaire valide.");
        return false;
      }
      if (!expirationCarte || !expirationCarte.includes("/")) {
        setError("Veuillez saisir une date d'expiration valide au format MM/AA.");
        return false;
      }
      if (!cvvCarte || cvvCarte.length < 3) {
        setError("Veuillez saisir un code CVV valide.");
        return false;
      }
    }

    return true;
  };

  const handlePayer = async () => {
    setError(null);

    if (!bien || !dates) {
      setError("Aucun bien ou aucune date sélectionnée. Merci de reprendre depuis le début.");
      return;
    }

    if (!user?.id) {
      setError("Votre session a expiré. Merci de vous reconnecter.");
      return;
    }

    const guest = getGuestInfo();
    if (!guest || !guest.nomComplet || !guest.email || !guest.telephone) {
      setError("Vos informations personnelles (étape 3) sont incomplètes. Merci de les compléter.");
      return;
    }

    if (!validerChampsPaiement()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response: any = await createReservationAndPay({
        bien,
        dates,
        guest,
        montantTotal: totalGlobal,
        montantAPayer: montantFinalAPayer,
        formule,
        methodePaiement: methode,
        telephonePaiement:
          methode === "momo" || methode === "om"
            ? telephone.replace(/\s+/g, "")
            : undefined,
        carte:
          methode === "card"
            ? { numero: numeroCarte, expiration: expirationCarte, cvv: cvvCarte }
            : undefined,
        promotionCode: localStorage.getItem("reservation_promo")
          ? JSON.parse(localStorage.getItem("reservation_promo") as string).code
          : undefined,
        clientId: user.id,
      });

      // Vérification du statut de paiement retourné par le backend
      if (response && (response.success === false || response.status === "FAILED" || response.status === "REJECTED")) {
        throw new Error(
          response.message || "Le paiement a été refusé par l'opérateur. Veuillez recontrôler vos informations."
        );
      }

      // Redirection vers l'agrégateur externe si requis
      if (response?.paymentUrl || response?.redirectUrl) {
        window.location.href = response.paymentUrl || response.redirectUrl;
        return;
      }

      // Enregistrement de l'identifiant pour récapitulatif à l'étape 6
      if (response?.reservationId || response?.id) {
        localStorage.setItem("last_reservation_id", String(response.reservationId || response.id));
      }

      // Redirection vers l'étape 6
      router.push("/reservation/etape-6");
    } catch (err: any) {
      const backendData = err.response?.data;
      const errorMessage =
        backendData?.message ||
        backendData?.error ||
        err.message ||
        "Une erreur est survenue lors de la validation du paiement. Merci de réessayer.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 bg-white sm:px-6 sm:py-8 sm:space-y-8">

        <StepProgressBar current={5} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start bg-white">
          {/* Méthodes de paiement interactives */}
          <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs sm:p-8">
            <h2 className="text-sm font-bold text-gray-900">Choisissez votre méthode de paiement sécurisé</h2>

            <div className="space-y-4">
              {/* MTN MoMo */}
              <div
                className={`p-4 rounded-2xl border transition-all cursor-pointer sm:p-5 ${
                  methode === "momo" ? "border-orange-600 bg-orange-50/20 shadow-sm" : "border-gray-200"
                }`}
                onClick={() => setMethode("momo")}
              >
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        methode === "momo" ? "bg-orange-600" : "bg-gray-300"
                      } inline-block`}
                    ></span>{" "}
                    MTN Mobile Money
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 font-bold px-2.5 py-1 rounded-lg text-[10px]">
                    MTN MoMo
                  </span>
                </div>
                {methode === "momo" && (
                  <div className="flex gap-2 pt-2 animate-fadeIn">
                    <span className="bg-gray-100 px-3 py-2.5 rounded-xl font-bold text-gray-600 flex items-center shrink-0">
                      +237
                    </span>
                    <input
                      type="text"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="677 889 900"
                      className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl p-2.5 outline-none font-medium text-gray-800"
                    />
                  </div>
                )}
              </div>

              {/* Orange Money */}
              <div
                className={`p-4 rounded-2xl border transition-all cursor-pointer sm:p-5 ${
                  methode === "om" ? "border-orange-600 bg-orange-50/20 shadow-sm" : "border-gray-200"
                }`}
                onClick={() => setMethode("om")}
              >
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        methode === "om" ? "bg-orange-600" : "bg-gray-300"
                      } inline-block`}
                    ></span>{" "}
                    Orange Money
                  </span>
                  <span className="bg-orange-100 text-orange-800 font-bold px-2.5 py-1 rounded-lg text-[10px]">
                    Orange
                  </span>
                </div>
                {methode === "om" && (
                  <div className="flex gap-2 pt-2 animate-fadeIn">
                    <span className="bg-gray-100 px-3 py-2.5 rounded-xl font-bold text-gray-600 flex items-center shrink-0">
                      +237
                    </span>
                    <input
                      type="text"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="699 000 000"
                      className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl p-2.5 outline-none font-medium text-gray-800"
                    />
                  </div>
                )}
              </div>

              {/* Carte Bancaire */}
              <div
                className={`p-4 rounded-2xl border transition-all cursor-pointer sm:p-5 ${
                  methode === "card" ? "border-orange-600 bg-orange-50/20 shadow-sm" : "border-gray-200"
                }`}
                onClick={() => setMethode("card")}
              >
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        methode === "card" ? "bg-orange-600" : "bg-gray-300"
                      } inline-block`}
                    ></span>{" "}
                    Carte bancaire (Visa / MasterCard)
                  </span>
                  <span className="text-gray-400 font-bold text-sm">💳</span>
                </div>
                {methode === "card" && (
                  <div className="grid grid-cols-1 gap-2 pt-4 animate-fadeIn sm:grid-cols-3">
                    <input
                      type="text"
                      placeholder="Numéro de carte (4242...)"
                      value={numeroCarte}
                      onChange={(e) => setNumeroCarte(e.target.value)}
                      className="sm:col-span-3 bg-white border border-gray-200 rounded-xl p-2.5 outline-none font-medium text-gray-800"
                    />
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={expirationCarte}
                      onChange={(e) => setExpirationCarte(e.target.value)}
                      className="sm:col-span-2 bg-white border border-gray-200 rounded-xl p-2.5 outline-none font-medium text-gray-800"
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
                className={`p-4 rounded-2xl border transition-all cursor-pointer sm:p-5 ${
                  methode === "cash" ? "border-orange-600 bg-orange-50/20 shadow-sm" : "border-gray-200"
                }`}
                onClick={() => setMethode("cash")}
              >
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        methode === "cash" ? "bg-orange-600" : "bg-gray-300"
                      } inline-block`}
                    ></span>{" "}
                    Paiement en espèces lors de l'arrivée
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Sous conditions d'empreinte bancaire
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-semibold flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Formule de règlement & Validation dynamique */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs sm:p-6">
            <h3 className="font-bold text-sm text-gray-900">Formule de règlement</h3>

            <div className="space-y-3">
              <label
                onClick={() => setFormule("acompte")}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formule === "acompte" ? "border-emerald-900 bg-emerald-50/40" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="reglement"
                  checked={formule === "acompte"}
                  onChange={() => setFormule("acompte")}
                  className="accent-emerald-900 shrink-0"
                />
                <div>
                  <span className="font-bold text-gray-900 block">Payer l'acompte de 30%</span>
                  <span className="text-[10px] text-gray-500">Le solde (70%) sera réglé à la résidence</span>
                </div>
              </label>

              <label
                onClick={() => setFormule("integral")}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formule === "integral" ? "border-emerald-900 bg-emerald-50/40" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="reglement"
                  checked={formule === "integral"}
                  onChange={() => setFormule("integral")}
                  className="accent-emerald-900 shrink-0"
                />
                <div>
                  <span className="font-bold text-gray-900 block">Payer l'intégralité (100%)</span>
                  <span className="text-[10px] text-gray-500">Pas de transaction nécessaire à l'arrivée</span>
                </div>
              </label>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-gray-100 text-gray-500">
              <div className="flex justify-between">
                <span>Total du séjour</span>
                <span className="font-medium text-gray-800">{totalGlobal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900">
                <span>{formule === "acompte" ? "Acompte exigible (30%)" : "Total intégral (100%)"}</span>
                <span className="text-orange-700">{montantFinalAPayer.toLocaleString()} FCFA</span>
              </div>
              {formule === "acompte" && (
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Solde à payer sur place</span>
                  <span>{montantSoldeSurPlace.toLocaleString()} FCFA</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <Link
                href="/reservation/etape-4"
                className="sm:w-1/3 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                Retour
              </Link>
              <button
                type="button"
                onClick={handlePayer}
                disabled={isSubmitting || !bien || !dates || !user?.id}
                className="sm:w-2/3 text-center bg-emerald-950 hover:bg-emerald-900 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Traitement...
                  </>
                ) : (
                  `Payer (${montantFinalAPayer.toLocaleString()} F) ✓`
                )}
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400">Paiement 100% sécurisé et crypté SSL</p>
          </div>
        </div>
      </div>
    </div>
  );
}