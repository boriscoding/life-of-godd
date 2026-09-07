"use client";

import { use } from "react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/app/components/layout/Header";
import { SiteFooter } from "@/app/components/layout/Footer";

// Base de données des appartements
const appartementsData: Record<string, any> = {
  "f2-kribi": {
    title: "Appartement F2 Kribi",
    category: "Appartement Meublé",
    pieces: "2 pièces",
    superficie: "65 m²",
    price: "45 000 FCFA",
    rating: "4.8",
    description: "L'appartement F2 Kribi offre un cadre de vie moderne et chaleureux à Bonapriso. Parfait pour un séjour de courte ou moyenne durée, il dispose d'un salon lumineux, d'une cuisine entièrement équipée et d'une chambre confortable.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "duplex-wouri": {
    title: "Duplex F4 Wouri",
    category: "Duplex de Standing",
    pieces: "4 pièces",
    superficie: "150 m²",
    price: "95 000 FCFA",
    rating: "4.8",
    description: "Le Duplex F4 Wouri est un chef-d'œuvre d'architecture intérieure. Spacieuse et luxueuse, cette résidence sur deux niveaux propose un grand salon ouvert, une salle à manger élégante, des finitions haut de gamme et une vue imprenable.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    ],
  },
};

export default function DetailAppartementPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const appartId = resolvedParams.id;

  // Récupération de l'appartement ou fallback sur le premier
  const appart = appartementsData[appartId] || appartementsData["f2-kribi"];

  const [selectedDates] = useState({ total: "135 000 FCFA" });

  const equipments = [
    {
      label: "Wi-Fi Très Haut Débit",
      icon: (
        <svg className="w-5 h-5 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
        </svg>
      ),
    },
    {
      label: "Cuisine équipée",
      icon: (
        <svg className="w-5 h-5 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      label: "Climatisation intégrale",
      icon: (
        <svg className="w-5 h-5 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      label: "Sécurité 24/7",
      icon: (
        <svg className="w-5 h-5 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <SiteHeader />

      <main className="flex-grow mx-auto max-w-7xl w-full px-6 py-8 lg:px-10">
        
        {/* Fil d'Ariane */}
        <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:underline">Accueil</Link> &gt;{" "}
          <Link href="/appartements" className="hover:underline">Appartements</Link> &gt;{" "}
          <span className="text-gray-900 font-medium">{appart.title}</span>
        </div>

        {/* Galerie Photos Dynamique */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          <div className="lg:col-span-2 h-[350px] sm:h-[420px] rounded-3xl overflow-hidden shadow-sm">
            <img src={appart.images[0]} alt="Vue principale" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-[200px] rounded-3xl overflow-hidden shadow-sm">
              <img src={appart.images[1]} alt="Vue secondaire" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="h-[200px] rounded-3xl overflow-hidden shadow-sm">
              <img src={appart.images[2]} alt="Détails" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>

        {/* Contenu Principal */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">{appart.category}</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{appart.pieces}</span>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">{appart.superficie}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-emerald-950">{appart.title}</h1>
              <p className="text-xl font-bold text-orange-700 mt-2">{appart.price} <span className="text-sm font-normal text-gray-500">/ nuit</span></p>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h2 className="font-bold text-gray-900 text-base">Description de l&apos;appartement</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {appart.description}
              </p>
            </div>

            {/* Équipements */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-900 text-base">Équipements et confort</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {equipments.map((eq, index) => (
                  <div key={index} className="flex items-center gap-3 text-xs font-medium text-gray-700 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm">
                      {eq.icon}
                    </div>
                    <span>{eq.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module de Réservation (Sidebar) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full lg:w-[380px] bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-24 space-y-6"
          >
            <h2 className="font-bold text-gray-900 text-lg">Réserver cet appartement</h2>
            
            <div className="space-y-3 pt-2 border-t border-gray-100 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>TARIF PAR NUIT</span>
                <span className="font-semibold text-gray-900">{appart.price}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-gray-500">Total estimé (3 nuits)</span>
                <span className="text-base font-bold text-emerald-950">{selectedDates.total}</span>
              </div>
            </div>

            <Link
              href="/reservation"
              className="block w-full rounded-xl bg-orange-700 py-3.5 text-center text-sm font-medium text-white shadow-md transition-all hover:bg-orange-800 hover:shadow-lg"
            >
              Réserver maintenant
            </Link>
          </motion.div>

        </div>

      </main>

      <SiteFooter />
    </div>
  );
}