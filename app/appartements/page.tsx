"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/app/components/layout/Header";
import { SiteFooter } from "@/app/components/layout/Footer";

// Le nom de la fonction commence par une MAJUSCULE (AppartementsPage)
export default function AppartementsPage() {
  const [selectedPieces, setSelectedPieces] = useState<string[]>(["2 Pièces (F2)", "3 Pièces (F3)", "4 Pièces et plus"]);
  const [formule, setFormule] = useState("Nuitée");
  const [superficie, setSuperficie] = useState(50);

  const appartements = [
    {
      id: "f2-kribi",
      title: "Appartement F2 Kribi",
      pieces: "2 pièces",
      superficie: "65 m²",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "duplex-wouri",
      title: "Duplex F4 Wouri",
      pieces: "4 pièces",
      superficie: "150 m²",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const togglePiece = (piece: string) => {
    if (selectedPieces.includes(piece)) {
      setSelectedPieces(selectedPieces.filter(p => p !== piece));
    } else {
      setSelectedPieces([...selectedPieces, piece]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <SiteHeader />

      <main className="flex-grow mx-auto max-w-7xl w-full px-6 py-6 lg:px-10">
        
        {/* Fil d'Ariane */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:underline">Accueil</Link> 
          <span>›</span> 
          <span className="text-gray-800 font-medium">Appartements</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar - Filtres Appartements */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-72 bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 space-y-7 shrink-0"
          >
            <h2 className="font-bold text-gray-900 text-base">Filtres Appartements</h2>

            {/* Nombre de pièces */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Nombre de pièces</p>
              <div className="space-y-2.5 text-xs text-gray-600">
                {["2 Pièces (F2)", "3 Pièces (F3)", "4 Pièces et plus"].map((piece) => (
                  <label key={piece} className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={selectedPieces.includes(piece)}
                      onChange={() => togglePiece(piece)}
                      className="rounded border-gray-300 text-emerald-950 focus:ring-emerald-950 w-4 h-4 accent-emerald-950" 
                    />
                    <span>{piece}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Formule de tarification */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Formule de tarification</p>
              <div className="flex bg-gray-100/80 p-1 rounded-xl text-xs font-medium">
                {["Nuitée", "Semaine", "Mois"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFormule(item)}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      formule === item 
                        ? "bg-emerald-950 text-white shadow-sm" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Superficie minimum */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Superficie minimum</p>
              <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                <span>{superficie} m²</span>
                <span className="text-gray-400">à 250 m²</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="250" 
                value={superficie}
                onChange={(e) => setSuperficie(Number(e.target.value))}
                className="w-full accent-emerald-950 cursor-pointer" 
              />
            </div>
          </motion.aside>

          {/* Grille Principale */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-emerald-950">Nos Appartements Meublés</h1>
              <p className="text-xs text-gray-500">2 prestigieux appartements disponibles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {appartements.map((appart) => (
                <motion.div
                  key={appart.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-shadow"
                >
                  <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                    <img 
                      src={appart.image} 
                      alt={appart.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl text-xs font-semibold text-gray-800 shadow-sm">
                      <span className="bg-gray-100 px-2.5 py-1 rounded-lg text-gray-700">{appart.pieces}</span>
                      <span className="text-emerald-900">{appart.superficie}</span>
                      <div className="flex items-center gap-1 text-gray-900">
                        <span>⭐</span>
                        <span>{appart.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-base">{appart.title}</h3>
                    
                    <Link
                      href={`/appartements/${appart.id}`}
                      className="mt-4 block w-full rounded-xl bg-emerald-950 py-2.5 text-center text-xs font-medium text-white shadow-sm hover:bg-emerald-900 transition-colors"
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