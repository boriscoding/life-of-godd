"use client";

import { use } from "react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/app/components/layout/Header";
import { SiteFooter } from "@/app/components/layout/Footer";

// Simulation d'une base de données de chambres (à placer idéalement dans un fichier séparé)
const chambresData: Record<string, any> = {
  "1": {
    title: "Chambre Standard Hibiscus",
    category: "Standard",
    price: "20 000 FCFA",
    capacity: "1-2 pers.",
    rating: "4.8",
    description: "La Chambre Standard offre un cadre chaleureux et tout le confort nécessaire pour un séjour agréable à un prix abordable.",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "2": {
    title: "Chambre Premium Émeraude",
    category: "Premium",
    price: "30 000 FCFA",
    capacity: "2 pers.",
    rating: "4.8",
    description: "La Suite Émeraude offre une expérience d'hébergement supérieure, spacieuse et décorée avec élégance pour les voyageurs exigeants.",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "3": {
    title: "Suite VIP Akwa",
    category: "VIP",
    price: "50 000 FCFA",
    capacity: "2-3 pers.",
    rating: "4.9",
    description: "Une suite somptueuse avec des prestations haut de gamme, un salon privé et une vue imprenable.",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "4": {
    title: "Appartement Meublé Bonapriso",
    category: "Appartements",
    price: "75 000 FCFA",
    capacity: "4 pers.",
    rating: "5.0",
    description: "Appartement entièrement meublé et équipé, idéal pour les familles ou les longs séjours à Bonapriso.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    ],
  },
};

export default function DetailChambrePage({ params }: { params: Promise<{ id: string }> }) {
  // Résolution des params (requis dans les dernières versions de Next.js pour les Client/Server components selon l'archi)
  const resolvedParams = use(params);
  const chambreId = resolvedParams.id;

  // Récupération de la chambre correspondante ou fallback sur la première
  const chambre = chambresData[chambreId] || chambresData["1"];

  const [selectedDates] = useState({ total: "105 000 FCFA" });

  const equipments = [
    {
      label: "Wi-Fi 100 Mbps",
      icon: (
        <svg className="w-5 h-5 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
        </svg>
      ),
    },
    {
      label: "Climatisation active",
      icon: (
        <svg className="w-5 h-5 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      label: "Téléviseur 4K 55\"",
      icon: (
        <svg className="w-5 h-5 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Coffre-fort privé",
      icon: (
        <svg className="w-5 h-5 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      label: "Mini-bar gratuit",
      icon: (
        <svg className="w-5 h-5 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h6m-3 18v-7m0 0l-3-3m3 3l3-3" />
        </svg>
      ),
    },
    {
      label: "Room service 24/7",
      icon: (
        <svg className="w-5 h-5 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <SiteHeader />

      <main className="flex-grow mx-auto max-w-7xl w-full px-6 py-8 lg:px-10">
        
        {/* Fil d'Ariane */}
        <div className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:underline">Accueil</Link> &gt;{" "}
          <Link href="/chambres" className="hover:underline">Chambres</Link> &gt;{" "}
          <span className="text-gray-900 font-medium">{chambre.title}</span>
        </div>

        {/* Galerie Photos Dynamique */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          <div className="lg:col-span-2 h-[350px] sm:h-[420px] rounded-3xl overflow-hidden shadow-sm">
            <img src={chambre.images[0]} alt="Chambre principale" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-[200px] rounded-3xl overflow-hidden shadow-sm">
              <img src={chambre.images[1]} alt="Vue secondaire" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="h-[200px] rounded-3xl overflow-hidden shadow-sm">
              <img src={chambre.images[2]} alt="Détails" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>

        {/* Contenu Principal */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">{chambre.category}</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{chambre.capacity}</span>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">Wi-Fi</span>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">Climatisation</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-emerald-950">{chambre.title}</h1>
              <p className="text-xl font-bold text-orange-700 mt-2">{chambre.price} <span className="text-sm font-normal text-gray-500">/ nuit</span></p>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h2 className="font-bold text-gray-900 text-base">Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {chambre.description}
              </p>
            </div>

            {/* Équipements inclus */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-900 text-base">Équipements inclus</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
            <h2 className="font-bold text-gray-900 text-lg">Réserver votre séjour</h2>
            
            <div className="space-y-3 pt-2 border-t border-gray-100 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>TARIF PAR NUIT</span>
                <span className="font-semibold text-gray-900">{chambre.price}</span>
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