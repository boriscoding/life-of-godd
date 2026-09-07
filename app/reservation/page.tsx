"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Hebergement {
  id: string;
  nom: string;
  type: string;
  description: string;
  capacite: string;
  superficie: string;
  litOuEquipement: string;
  prixNuite: number;
  image: string;
}

const HEBERGEMENTS: Hebergement[] = [
  {
    id: "chambre-vip",
    nom: "Chambre VIP Émeraude",
    type: "Chambre Premium",
    description: "Profitez du raffinement absolu, d'une literie d'exception de taille King et d'un room service disponible 24h/24 dans le quartier chic de Bonapriso.",
    capacite: "2 Adultes",
    superficie: "38 m²",
    litOuEquipement: "Lit King",
    prixNuite: 85000,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "appartement-f3",
    nom: "Appartement Grand Standing F3",
    type: "Appartement Meublé",
    description: "Le confort de votre maison associé aux services prestigieux de notre résidence hôtelière. Salon spacieux, cuisine équipée moderne.",
    capacite: "4 Personnes",
    superficie: "110 m²",
    litOuEquipement: "2 Chambres",
    prixNuite: 150000,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "bureau-prive",
    nom: "Bureau Privatif Équipé",
    type: "Professionnel / Coworking",
    description: "Espaces de travail et salles de réunion modernes dotés d'une connexion internet fibre optique ultra-rapide et d'une sécurité haut de gamme.",
    capacite: "6 Collaborateurs",
    superficie: "45 m²",
    litOuEquipement: "Équipé bureau",
    prixNuite: 45000,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  },
];

export default function ReservationEtape1() {
  const router = useRouter();
  const [selectedBienId, setSelectedBienId] = useState<string>(HEBERGEMENTS[0].id);

  const handleSelect = (bien: Hebergement) => {
    setSelectedBienId(bien.id);
    localStorage.setItem("reservation_bien", JSON.stringify(bien));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    // Sauvegarde par défaut du premier choix si rien n'a été cliqué explicitement
    const currentSelected = HEBERGEMENTS.find((h) => h.id === selectedBienId) || HEBERGEMENTS[0];
    localStorage.setItem("reservation_bien", JSON.stringify(currentSelected));
    
    // Redirection vers l'étape suivante (Dates & Durée)
    router.push("/reservation/etape-2");
  };

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 bg-white">
        
        {/* Barre de progression */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-6 text-xs font-semibold text-gray-500 bg-white">
          <span className="text-emerald-950 font-bold flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-950 text-white flex items-center justify-center text-[10px]">1</span> Sélection
          </span>
          <span>2 Dates & Durée</span>
          <span>3 Informations</span>
          <span>4 Récapitulatif</span>
          <span>5 Paiement</span>
          <span>6 Confirmation</span>
        </div>

        {/* En-tête de page */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            Hébergements disponibles
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
            Trouvez l'espace idéal pour votre séjour à Douala
          </h1>
        </div>

        <form onSubmit={handleNextStep} className="space-y-8">
          {/* Grille des cartes de sélection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HEBERGEMENTS.map((bien) => {
              const isSelected = selectedBienId === bien.id;
              return (
                <div
                  key={bien.id}
                  onClick={() => handleSelect(bien)}
                  className={`bg-white rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                    isSelected ? "border-emerald-900 ring-2 ring-emerald-900/20 bg-emerald-50/10" : "border-gray-200"
                  }`}
                >
                  <div>
                    {/* Image du bien */}
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <img
                        src={bien.image}
                        alt={bien.nom}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                        {bien.type}
                      </span>
                    </div>

                    {/* Contenu textuel */}
                    <div className="p-6 space-y-4">
                      <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${isSelected ? "bg-emerald-900" : "bg-gray-300"}`}></span>
                        {bien.nom}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                        {bien.description}
                      </p>

                      {/* Badges caractéristiques */}
                      <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-gray-600 font-medium">
                        <span className="bg-gray-100 px-2.5 py-1 rounded-lg">👤 {bien.capacite}</span>
                        <span className="bg-gray-100 px-2.5 py-1 rounded-lg">📐 {bien.superficie}</span>
                        <span className="bg-gray-100 px-2.5 py-1 rounded-lg">🛏️ {bien.litOuEquipement}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pied de carte : Prix et bouton de sélection */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-100 mt-4">
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase font-semibold">À partir de</span>
                      <span className="text-sm font-extrabold text-emerald-950">
                        {bien.prixNuite.toLocaleString()} FCFA <span className="text-xs font-normal text-gray-500">/ nuit</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isSelected
                          ? "bg-emerald-950 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {isSelected ? "Sélectionné ✓" : "Sélectionner"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Boutons de navigation bas de page */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <Link
              href="/"
              className="px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs transition-colors flex items-center gap-2"
            >
              &larr; Retour à l'accueil
            </Link>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              Continuer vers l'étape suivante &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}