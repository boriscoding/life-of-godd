"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { StepProgressBar } from "@/app/reservation/StepProgressBar";

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
    id: "f2-kribi",
    nom: "Appartement F2 Kribi",
    type: "Appartement Meublé",
    description: "Cadre de vie moderne et chaleureux à Bonapriso avec salon lumineux et cuisine équipée.",
    capacite: "2-3 Personnes",
    superficie: "65 m²",
    litOuEquipement: "Cuisine équipée",
    prixNuite: 45000,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "duplex-wouri",
    nom: "Duplex F4 Wouri",
    type: "Duplex de Standing",
    description: "Résidence spacieuse et luxueuse sur deux niveaux avec vue imprenable.",
    capacite: "4 Personnes",
    superficie: "150 m²",
    litOuEquipement: "4 pièces",
    prixNuite: 95000,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "chambre-vip",
    nom: "Chambre VIP Émeraude",
    type: "Chambre Premium",
    description: "Profitez du raffinement absolu, d'une literie d'exception de taille King et d'un room service 24h/24.",
    capacite: "2 Adultes",
    superficie: "38 m²",
    litOuEquipement: "Lit King",
    prixNuite: 85000,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
  },
];

export default function ReservationEtape1() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bienParamId = searchParams.get("bien");

  const [selectedBienId, setSelectedBienId] = useState<string>(HEBERGEMENTS[0].id);

  // Synchronisation avec le paramètre d'URL ou le localStorage au chargement
  useEffect(() => {
    const saved = localStorage.getItem("reservation_bien");
    if (bienParamId) {
      setSelectedBienId(bienParamId);
    } else if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id) setSelectedBienId(parsed.id);
      } catch (e) {
        console.error("Erreur de lecture du localStorage", e);
      }
    }
  }, [bienParamId]);

  const handleSelect = (bien: Hebergement) => {
    setSelectedBienId(bien.id);
    localStorage.setItem("reservation_bien", JSON.stringify(bien));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const currentSelected = HEBERGEMENTS.find((h) => h.id === selectedBienId) || HEBERGEMENTS[0];
    localStorage.setItem("reservation_bien", JSON.stringify(currentSelected));
    router.push("/reservation/etape-2");
  };

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 bg-white sm:px-6 sm:py-8 sm:space-y-8">
        <StepProgressBar current={1} />

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            Hébergements disponibles
          </span>
          <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl lg:text-3xl">
            Trouvez l'espace idéal pour votre séjour à Douala
          </h1>
        </div>

        <form onSubmit={handleNextStep} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100 sm:h-48">
                      <img src={bien.image} alt={bien.nom} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                        {bien.type}
                      </span>
                    </div>

                    <div className="p-5 space-y-4 sm:p-6">
                      <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                        <span className={`w-3 h-3 shrink-0 rounded-full ${isSelected ? "bg-emerald-900" : "bg-gray-300"}`}></span>
                        {bien.nom}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{bien.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-gray-600 font-medium">
                        <span className="bg-gray-100 px-2.5 py-1 rounded-lg">👤 {bien.capacite}</span>
                        <span className="bg-gray-100 px-2.5 py-1 rounded-lg">📐 {bien.superficie}</span>
                        <span className="bg-gray-100 px-2.5 py-1 rounded-lg">🛏️ {bien.litOuEquipement}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-gray-100 mt-4 sm:p-6 sm:pt-0">
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase font-semibold">À partir de</span>
                      <span className="text-sm font-extrabold text-emerald-950">
                        {bien.prixNuite.toLocaleString()} FCFA <span className="text-xs font-normal text-gray-500">/ nuit</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isSelected ? "bg-emerald-950 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {isSelected ? "Sélectionné ✓" : "Sélectionner"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-6 border-t border-gray-100 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs transition-colors flex items-center justify-center gap-2">
              &larr; Retour à l'accueil
            </Link>
            <button type="submit" className="px-8 py-3.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2">
              Continuer vers l'étape suivante &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}