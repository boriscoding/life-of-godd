"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/app/components/layout/Header";
import { SiteFooter } from "@/app/components/layout/Footer";

export default function ChambresPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  
  const chambres = [
    {
      id: 1,
      title: "Chambre Standard Hibiscus",
      category: "Standard",
      price: "20 000 FCFA / nuit",
      capacity: "1-2 pers.",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Chambre Premium Émeraude",
      category: "Premium",
      price: "30 000 FCFA / nuit",
      capacity: "2 pers.",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Suite VIP Akwa",
      category: "VIP",
      price: "50 000 FCFA / nuit",
      capacity: "2-3 pers.",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Appartement Meublé Bonapriso",
      category: "Appartements",
      price: "75 000 FCFA / nuit",
      capacity: "4 pers.",
      rating: "5.0",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const filteredChambres = selectedCategory === "Tous" 
    ? chambres 
    : chambres.filter(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <SiteHeader />

      <main className="flex-grow mx-auto max-w-7xl w-full px-6 py-8 lg:px-10">
        {/* Fil d'Ariane */}
        <div className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:underline">Accueil</Link> &gt; <span className="text-gray-900 font-medium">Chambres</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filtres */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-72 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit space-y-6"
          >
            <h2 className="font-bold text-gray-900 text-lg">Filtres</h2>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">Catégorie</p>
              <div className="flex flex-wrap gap-2">
                {["Tous", "Standard", "Premium", "VIP"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat 
                        ? "bg-emerald-950 text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">Budget (FCFA / nuit)</p>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span>15 000</span>
                <span>80 000</span>
              </div>
              <input type="range" min="15000" max="80000" defaultValue="80000" className="w-full accent-emerald-950 cursor-pointer" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">Équipements</p>
              <div className="space-y-2.5 text-xs text-gray-600">
                {["Wi-Fi Haute Vitesse", "Climatisation", "Télévision Smart", "Petit-déjeuner inclus"].map((eq) => (
                  <label key={eq} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-950 focus:ring-emerald-950" />
                    <span>{eq}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* Grille de Chambres */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-emerald-950">Nos Chambres d&apos;Hôtel</h1>
              <p className="text-xs text-gray-500">{filteredChambres.length} hébergements disponibles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredChambres.map((chambre) => (
                <motion.div
                  key={chambre.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img 
                      src={chambre.image} 
                      alt={chambre.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-gray-800 shadow-sm">
                      {chambre.capacity}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-sm flex items-center gap-1">
                      ⭐ {chambre.rating}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{chambre.title}</h3>
                      <p className="text-sm font-semibold text-emerald-900 mt-1">{chambre.price}</p>
                    </div>

                    {/* Liaison dynamique vers la page détail avec l'ID */}
                    <Link
                      href={`/chambres/${chambre.id}`}
                      className="mt-5 w-full rounded-xl bg-emerald-950 py-3 text-center text-xs font-medium text-white shadow-sm hover:bg-emerald-900 transition-colors"
                    >
                      Voir détails
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}