import Link from "next/link";

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="bg-white min-h-screen text-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        
        {/* En-tête */}
        <div className="space-y-3 border-b border-gray-100 pb-6">
          <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            Conformité & Sécurité
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
            Politique de Confidentialité
          </h1>
          <p className="text-xs text-gray-500">
            Dernière mise à jour : Août 2026 | Résidence Émeraude (Cameroun)
          </p>
        </div>

        {/* Corps du texte */}
        <div className="space-y-6 text-xs leading-relaxed text-gray-600">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">1. Introduction</h2>
            <p>
              La présente Politique de Confidentialité décrit la manière dont notre complexe immobilier collecte, utilise, protège et traite vos données à caractère personnel dans le cadre de l'utilisation de notre plateforme web de réservation de chambres, d'appartements meublés et de bureaux professionnels.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">2. Données collectées</h2>
            <p>
              Dans le cadre de votre navigation et de votre parcours de réservation en 6 étapes, nous sommes amenés à collecter les informations suivantes :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Données d'identification :</strong> Nom, prénom, adresse e-mail, numéro de téléphone (utilisé notamment pour les paiements via MTN Mobile Money ou Orange Money).</li>
              <li><strong>Données de séjour :</strong> Dates d'arrivée et de départ, type de bien sélectionné, préférences et demandes particulières.</li>
              <li><strong>Données de transaction :</strong> Historique des paiements, acomptes versés, soldes et gestion des cautions.</li>
              <li><strong>Documents officiels :</strong> Copie de pièce d'identité exigée dans certains cas pour les formalités d'enregistrement à l'arrivée (Check-in).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">3. Finalités du traitement des données</h2>
            <p>Vos données sont collectées et traitées pour des objectifs précis :</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Garantir l'unicité des réservations et éviter les conflits d'agenda (double booking).</li>
              <li>Traiter de manière sécurisée vos règlements (en ligne ou via passerelles de paiement locales).</li>
              <li>Générer automatiquement vos documents administratifs (confirmations, factures acquittées, reçus et contrats de bail).</li>
              <li>Assurer le suivi opérationnel des arrivées et des départs par le personnel de réception.</li>
              <li>Vous envoyer des notifications de suivi par e-mail, SMS ou WhatsApp.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">4. Sécurité et protection des données</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles rigoureuses (chiffrement SSL, protocoles sécurisés HTTPS, contrôle d'accès strict par profil RBAC et journalisation des actions critiques) pour protéger vos informations contre tout accès non autorisé, modification, divulgation ou destruction.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">5. Conservation des données</h2>
            <p>
              Vos données personnelles sont conservées uniquement pour la durée nécessaire aux finalités pour lesquelles elles ont été collectées, en respectant les obligations légales et comptables en vigueur au Cameroun (notamment la traçabilité des transactions financières et des journaux d'audit de sécurité).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-900">6. Vos droits</h2>
            <p>
              Conformément à la réglementation applicable, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Vous pouvez exercer ces droits en contactant notre service client directement via les coordonnées indiquées sur notre site web.
            </p>
          </section>
        </div>

        {/* Pied de page */}
        <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
          <Link href="/" className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors">
            &larr; Retour à l'accueil
          </Link>
          <Link href="/cgu" className="text-emerald-900 font-bold hover:underline">
            Consulter les CGU &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}