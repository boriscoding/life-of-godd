"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/app/components/layout/Header";
import { SiteFooter } from "@/app/components/layout/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'envoi du formulaire
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <SiteHeader />

      <main className="flex-grow mx-auto max-w-7xl w-full px-6 py-8 lg:px-10">
        
        {/* Fil d'Ariane */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:underline">Accueil</Link> 
          <span>›</span> 
          <span className="text-gray-800 font-medium">Contact</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Colonne de gauche : Formulaire de contact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-emerald-950">Envoyez-nous un message</h1>
              <p className="text-xs text-gray-500 mt-1">Nous répondons généralement sous un délai de 2 heures ouvrées.</p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl text-center space-y-2">
                <h3 className="font-bold text-base">Message envoyé avec succès !</h3>
                <p className="text-xs text-emerald-700">Merci de nous avoir contactés. Notre équipe vous répondra très rapidement.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Nom complet</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Samuel Eto'o" 
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Adresse Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="Ex: samuel@email.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Téléphone</label>
                  <input 
                    type="text" 
                    placeholder="Ex: +237 6xx xxx xxx" 
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Comment pouvons-nous vous aider ?" 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-200 p-4 text-gray-900 focus:outline-none focus:border-emerald-950 transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full rounded-xl bg-emerald-950 py-3.5 text-center text-xs font-medium text-white shadow-md hover:bg-emerald-900 transition-colors"
                >
                  Envoyer le message
                </button>
              </form>
            )}
          </motion.div>

          {/* Colonne de droite : Coordonnées, Horaires & Carte */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Boîte Coordonnées & Horaires */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6 text-xs"
            >
              <h2 className="font-bold text-gray-900 text-sm">Nos Coordonnées</h2>
              
              <div className="space-y-4 text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-900 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">+237 677 889 900</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-900 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">+237 655 443 322 (WhatsApp)</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-900 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">contact@residence-emeraude.cm</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <p className="font-bold uppercase tracking-wider text-gray-700">HEURES D'OUVERTURE</p>
                <p className="font-medium text-gray-900">Lundi - Dimanche : 24h / 24</p>
                <p className="text-gray-500">Réception ouverte en continu pour l'accès aux hébergements.</p>
              </div>
            </motion.div>

            {/* Boîte Carte / Localisation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80" 
                  alt="Carte Bonapriso Douala" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="bg-white/95 px-4 py-2 rounded-xl shadow-lg border border-gray-100 text-center">
                    <p className="font-bold text-gray-900 text-xs">BONAPRISO, DOUALA</p>
                    <p className="text-[10px] text-emerald-800 font-medium">Cameroun</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>

      </main>

      <SiteFooter />
    </div>
  );
}