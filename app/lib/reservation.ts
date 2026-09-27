import { api } from "@/app/lib/api";

/**
 * Type de bien réservable, côté front. Correspond aux 3 routes backend
 * utilisées pour le détail : /apartments/:id, /offices/:id, /rooms/:id.
 *
 * Le backend attend un `propertyType` correspondant à l'enum Prisma
 * `PropertyType` (voir schema.prisma : `enum PropertyType { room apartment
 * office }`) — CONFIRMÉ en minuscules par un test réel (POST /bookings 201).
 */
export type BienType = "apartment" | "office" | "room";

const PROPERTY_TYPE_MAP: Record<BienType, string> = {
  apartment: "apartment",
  office: "office",
  room: "room",
};

/**
 * Méthode de paiement choisie à l'étape 5, côté UI.
 * Le backend attend l'enum Prisma `PaymentMethodCode` (voir
 * payment.validation.ts : mtn_mobile_money | orange_money | credit_card |
 * cash | paydunya | cinetpay | opay) — CONFIRMÉ par le schéma de validation
 * Zod fourni. "cash" n'a pas besoin de mapping : createReservationAndPay
 * n'appelle jamais /payments/initiate pour ce cas (paiement à l'arrivée).
 */
type MethodePaiementUI = "momo" | "om" | "card" | "cash";

const PAYMENT_METHOD_MAP: Record<Exclude<MethodePaiementUI, "cash">, string> = {
  momo: "mtn_mobile_money",
  om: "orange_money",
  card: "credit_card",
};

export interface BienSelection {
  id: string;
  type: BienType;
  nom: string;
  description?: string;
  capacite?: string;
  superficie?: string;
  litOuEquipement?: string;
  prixNuite: number;
  image: string;
}

/**
 * Dates de séjour telles que capturées par le calendrier de l'étape 2.
 * ⚠️ Limitation existante : le calendrier de l'étape 2 est actuellement figé
 * sur "Novembre 2025" et ne stocke que le jour du mois (1-30), pas une vraie
 * date. BOOKING_MONTH/BOOKING_YEAR ci-dessous reproduisent cette même
 * hypothèse pour construire des dates ISO valides côté API. Le jour où
 * l'étape 2 gère un vrai sélecteur mois/année, il suffira de faire porter
 * l'année et le mois réels par `DatesSelection` et de supprimer ces constantes.
 */
export interface DatesSelection {
  debut: number;
  fin: number;
}

const BOOKING_YEAR = 2025;
const BOOKING_MONTH_INDEX = 10; // Novembre (0 = janvier)

function dayToIsoDate(day: number): string {
  return new Date(Date.UTC(BOOKING_YEAR, BOOKING_MONTH_INDEX, day)).toISOString();
}

/** Infos voyageur nécessaires par le backend (guestName/guestEmail/guestPhone). */
export interface GuestInfo {
  nomComplet: string;
  email: string;
  telephone: string;
  nombreVoyageurs: number;
  notes?: string;
}

const BIEN_KEY = "reservation_bien";
const DATES_KEY = "reservation_dates";
const FORM_KEY = "reservation_form";
const REFERENCE_KEY = "reservation_reference";

export function saveBienSelection(bien: BienSelection) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BIEN_KEY, JSON.stringify(bien));
}

/**
 * Lit le bien sélectionné. Compatible avec les anciennes pages qui
 * sauvegardaient le titre sous la clé "titre" au lieu de "nom".
 */
export function getBienSelection(): BienSelection | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(BIEN_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.nom && parsed.titre) parsed.nom = parsed.titre;
    return parsed;
  } catch {
    return null;
  }
}

export function getDatesSelection(): DatesSelection | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(DATES_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Lit les infos voyageur saisies/pré-remplies à l'étape 3. */
export function getGuestInfo(): GuestInfo | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(FORM_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return {
      nomComplet: parsed.nomComplet || "",
      email: parsed.email || "",
      telephone: parsed.telephone || "",
      nombreVoyageurs: Number(parsed.nombreVoyageurs) || 1,
      notes: parsed.notes || "",
    };
  } catch {
    return null;
  }
}

export function getStoredReference(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFERENCE_KEY);
}

export interface CreateReservationParams {
  bien: BienSelection;
  dates: DatesSelection;
  guest: GuestInfo;
  montantTotal: number;
  montantAPayer: number;
  formule: "acompte" | "integral";
  methodePaiement: MethodePaiementUI;
  telephonePaiement?: string;
  carte?: { numero: string; expiration: string; cvv: string };
  promotionCode?: string;
  /** Id du client connecté (user.id venant de useAuth()). */
  clientId: string;
}

export interface ReservationResult {
  bookingId: string;
  reference: string;
  paymentStatus: "pending" | "paid" | "requires_action";
}

/**
 * Crée la réservation (POST /api/v1/bookings), puis déclenche le paiement
 * (POST /api/v1/payments/initiate) — sauf paiement cash à l'arrivée.
 *
 * ⚠️ Le backend n'accepte AUCUN détail de carte bancaire sur cet endpoint
 * (payment.validation.ts n'a pas de champ pour ça — un vrai traitement de
 * carte passerait normalement par /payment-aggregators, pas encore branché
 * ici). Les champs `carte` saisis à l'étape 5 sont donc conservés dans le
 * payload d'entrée de cette fonction pour rester compatibles avec l'appelant,
 * mais ne sont PAS transmis au backend.
 */
export async function createReservationAndPay(
  params: CreateReservationParams
): Promise<ReservationResult> {
  const {
    bien,
    dates,
    guest,
    montantTotal,
    formule,
    methodePaiement,
    telephonePaiement,
    promotionCode,
    clientId,
  } = params;

  // 1. Création de la réservation (booking). Le controller ne lit PAS
  //    req.user.id automatiquement : on doit donc envoyer `userId`
  //    nous-mêmes. Le token JWT est ajouté par ailleurs par l'intercepteur
  //    d'`api` pour satisfaire le middleware `authenticate`.
  const bookingPayload: Record<string, any> = {
    userId: clientId,
    propertyId: bien.id,
    propertyType: PROPERTY_TYPE_MAP[bien.type],
    startDate: dayToIsoDate(dates.debut),
    endDate: dayToIsoDate(dates.fin),
    numberOfGuests: guest.nombreVoyageurs,
    guestName: guest.nomComplet,
    guestEmail: guest.email,
    guestPhone: guest.telephone,
    totalAmount: montantTotal,
    specialRequests: guest.notes || undefined,
  };
  if (promotionCode) {
    bookingPayload.promotionCode = promotionCode;
  }

  const resBooking = await api.post("/bookings", bookingPayload);
  const bookingData = resBooking.data?.data || resBooking.data;
  const bookingId = String(bookingData.id || bookingData._id);
  const reference = String(bookingData.reference || bookingId);

  // 2. Déclenchement du paiement (sauf paiement cash à l'arrivée).
  //    NB: le booking est créé avec un depositAmount fixé à 30% côté
  //    backend (calculateDepositAmount(totalAmount, 30)), quelle que soit la
  //    formule choisie ici. Le montant réellement encaissé dépend de ce que
  //    fait /payments/initiate avec `amount`.
  let paymentStatus: ReservationResult["paymentStatus"] = "pending";

  if (methodePaiement !== "cash") {
    const montantAPayer = formule === "acompte" ? bookingData.depositAmount ?? params.montantAPayer : montantTotal;

    // Format CONFIRMÉ par payment.validation.ts (initiatePaymentSchema) :
    // bookingId (uuid), amount (positif), method (enum PaymentMethodCode),
    // type (enum PaymentType), phoneNumber (optionnel).
    const paymentPayload: Record<string, any> = {
      bookingId,
      amount: montantAPayer,
      method: PAYMENT_METHOD_MAP[methodePaiement],
      type: formule === "acompte" ? "deposit" : "full",
    };
    if (methodePaiement === "momo" || methodePaiement === "om") {
      paymentPayload.phoneNumber = telephonePaiement;
    }
    // NB: aucun champ carte n'est envoyé (voir commentaire de fonction).

    const resPayment = await api.post("/payments/initiate", paymentPayload);
    const paymentData = resPayment.data?.data || resPayment.data;
    paymentStatus = paymentData.status || "pending";
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(REFERENCE_KEY, reference);
  }

  return { bookingId, reference, paymentStatus };
}