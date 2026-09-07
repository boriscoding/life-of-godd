"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/app/components/layout/Header";
import { SiteFooter } from "@/app/components/layout/Footer";

export default function BureauxPage() {
  const bureaux = [
    {
      id: 1,
      title: "Bureau Privé Kribi",
      capacity: "4 postes",
      surface: "25 m²",
      hourlyRate: "5 000 FCFA",
      dailyRate: "30 000 FCFA",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Espace Coworking Émeraude",
      capacity: "Espace partagé",
      surface: "120 m²",
      hourlyRate: "1 500 FCFA",
      dailyRate: "10 000 FCFA",
      image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <SiteHeader />

      <main className="flex-grow mx-auto max-w-7xl w-full px-6 py-8 lg:px-10">
        {/* Fil d'Ariane */}
        <div className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:underline">Accueil</Link> &gt; <span className="text-gray-900 font-medium">Espaces Bureaux</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filtres */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-72 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit space-y-6"
          >
            <h2 className="font-bold text-gray-900 text-lg">Filtres Bureaux</h2>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">Formule de réservation</p>
              <div className="space-y-2.5 text-xs text-gray-600">
                {["À l'heure", "À la journée", "À la semaine", "Au mois", "Long terme"].map((formule) => (
                  <label key={formule} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-950 focus:ring-emerald-950" />
                    <span>{formule}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">Équipements Pro</p>
              <div className="space-y-2.5 text-xs text-gray-600">
                {["Fibre optique", "Écran de projection", "Tableau blanc", "Café à volonté"].map((eq) => (
                  <label key={eq} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-950 focus:ring-emerald-950" />
                    <span>{eq}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* Grille de Bureaux */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-emerald-950">Espaces de Travail & Réunions</h1>
              <p className="text-xs text-gray-500">2 espaces configurés disponibles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bureaux.map((bureau) => (
                <motion.div
                  key={bureau.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img 
                      src={bureau.image} 
                      alt={bureau.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-gray-800 shadow-sm">
                        {bureau.capacity}
                      </span>
                      <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-gray-800 shadow-sm">
                        {bureau.surface}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{bureau.title}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-gray-400">Taux horaire</p>
                        <p className="text-xs font-bold text-gray-900 mt-0.5">{bureau.hourlyRate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-gray-400">Taux journalier</p>
                        <p className="text-xs font-bold text-gray-900 mt-0.5">{bureau.dailyRate}</p>
                      </div>
                    </div>

                    <Link
                      href="/reservation"
                      className="w-full rounded-xl bg-emerald-950 py-3 text-center text-xs font-medium text-white shadow-sm hover:bg-emerald-900 transition-colors"
                    >
                      Réserver cet espace
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