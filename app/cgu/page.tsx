import Link from "next/link";

export default function CGUPage() {
  return (
    <div className="bg-white min-h-screen text-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        
        {/* En-tête */}
        <div className="space-y-3 border-b border-gray-100 pb-6">
          <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            Conditions Contractuelles
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
            Conditions Générales d'Utilisation (CGU)
          </h1>
          <p className="text-xs text-gray-500">
            Dernière mise à jour : Août 2026 | Complexe Immobilier - Cameroun
          </p>
        </div>

        {/* Corps du texte */}
        <div className="space-y-6 text-xs leading-relaxed text-gray-600">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">1. Objet</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation régissent l'accès et l'utilisation de la plateforme web de présentation, de réservation en ligne et de gestion administrative de notre complexe immobilier au Cameroun (proposant chambres, appartements meublés et bureaux professionnels).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">2. Acceptation des conditions</h2>
            <p>
              L'utilisation de la plateforme, la création d'un compte client ou la réalisation d'une réservation impliquent l'acceptation pleine, entière et sans réserve des présentes CGU. Si vous refusez ces conditions, vous êtes invité à ne pas utiliser nos services en ligne.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">3. Réservations et tunnel de commande</h2>
            <p>
              Le processus de réservation en ligne s'effectue à travers un parcours structuré en 6 étapes (Sélection du bien, Choix des dates et de la durée, Saisie des informations, Récapitulatif financier, Paiement et Confirmation).
            </p>
            <p>
              Toute réservation validée est confirmée par l'attribution d'un numéro de réservation unique (ex: RES-2026-XXXXXX) et l'envoi d'un récépissé officiel.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">4. Modalités de paiement et cautions</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Moyens acceptés :</strong> Les paiements peuvent s'effectuer via les passerelles locales (MTN Mobile Money, Orange Money), par carte bancaire ou en espèces sur place (sous réserve des conditions en vigueur).</li>
              <li><strong>Formules de règlement :</strong> Le client peut opter pour le versement d'un acompte exigible (généralement 30% du montant global) ou le paiement intégral (100%). Le solde restant en cas d'acompte doit être réglé directement à la résidence lors du Check-in.</li>
              <li><strong>Cautions :</strong> Une caution forfaitaire ou une empreinte de garantie peut être exigée selon le type d'hébergement (notamment pour les appartements meublés et bureaux). Elle est restituée ou libérée après l'état des lieux de sortie.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">5. Obligations de l'utilisateur</h2>
            <p>
              L'utilisateur s'engage à fournir des informations exactes, sincères et à jour lors de son inscription et de ses réservations. Il s'engage également à respecter le règlement intérieur de la résidence ainsi que l'intégrité des équipements mis à sa disposition (chambres, appartements ou espaces de travail).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">6. Responsabilité</h2>
            <p>
              Le gestionnaire de la plateforme s'efforce d'assurer l'exactitude des disponibilités en temps réel grâce à un moteur performant. Toutefois, sa responsabilité ne saurait être engagée en cas de dysfonctionnement technique majeur indépendant de sa volonté ou de force majeure perturbant l'accès aux services.
            </p>
          </section>
        </div>

        {/* Pied de page */}
        <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
          <Link href="/" className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors">
            &larr; Retour à l'accueil
          </Link>
          <Link href="/confidentialite" className="text-emerald-900 font-bold hover:underline">
            Politique de Confidentialité &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}