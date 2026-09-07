"use client";

import Link from "next/link";

export default function ReservationEtape1() {
  const biens = [
    {
      titre: "Chambre VIP Émeraude",
      description: "Profitez du raffinement absolu, d'une literie d'exception de taille King et d'un room service disponible 24h/24 dans le quartier chic de Bonapriso.",
      capacite: "2 Adultes",
      surface: "38 m² • Lit King",
      prix: "85 000 FCFA",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
    },
    {
      titre: "Appartement Grand Standing F3",
      description: "Le confort de votre maison associé aux services prestigieux de notre résidence hôtelière. Salon spacieux, cuisine équipée moderne.",
      capacite: "4 Personnes",
      surface: "110 m² • 2 Chambres",
      prix: "150 000 FCFA",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
    },
    {
      titre: "Bureau Privatif Équipé",
      description: "Espaces de travail et salles de réunion modernes dotés d'une connexion internet fibre optique ultra-rapide et d'une sécurité haut de gamme.",
      capacite: "6 Collaborateurs",
      surface: "45 m² • Équipé",
      prix: "45 000 FCFA",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Barre de progression */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-6 text-xs font-semibold text-gray-500">
        <span className="text-emerald-950 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-emerald-950 text-white flex items-center justify-center text-[10px]">1</span> Sélection</span>
        <span>2 Dates & Durée</span>
        <span>3 Informations</span>
        <span>4 Récapitulatif</span>
        <span>5 Paiement</span>
        <span>6 Confirmation</span>
      </div>

      <h1 className="text-2xl font-bold text-emerald-950">Trouvez l'espace idéal pour votre séjour à Douala</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {biens.map((bien, i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <img src={bien.image} alt={bien.titre} className="w-full h-48 object-cover" />
              <div className="p-6 space-y-3">
                <h3 className="font-bold text-sm text-gray-900">{bien.titre}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{bien.description}</p>
                <div className="flex gap-3 text-[11px] text-gray-400 font-medium pt-2">
                  <span>👤 {bien.capacite}</span>
                  <span>📐 {bien.surface}</span>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-50 mt-4">
              <div>
                <span className="text-[10px] text-gray-400 block">À partir de</span>
                <span className="text-xs font-bold text-emerald-950">{bien.prix} <span className="text-[10px] font-normal">/ nuit</span></span>
              </div>
              <Link href="/reservation/etape-2" className="bg-emerald-950 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-colors">
                Sélectionner
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}