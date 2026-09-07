"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { LogoMarkIcon } from "@/app/components/icons/misc-icons";

export default function InscriptionForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10"
    >
      
      {/* En-tête de la carte */}
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950 text-white shadow-md mb-4"
        >
          <LogoMarkIcon className="h-7 w-7 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold tracking-tight text-emerald-950">
          Résidence Émeraude
        </h2>
        <h1 className="text-xl font-bold text-gray-900 mt-1">Créer votre compte</h1>
        <p className="text-xs text-gray-500 mt-1.5 max-w-xs">
          Rejoignez Résidence Émeraude pour simplifier votre expérience
        </p>
      </div>

      {/* Formulaire */}
      <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Nom complet
          </label>
          <input
            type="text"
            placeholder="Ex: Jean-Paul Ngassa"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Adresse Email
          </label>
          <input
            type="email"
            placeholder="votre.email@domain.com"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Téléphone (Cameroun)
          </label>
          <input
            type="tel"
            placeholder="+237 6XX XX XX XX"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Créer un mot de passe fort"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 transition-all pr-20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-emerald-950 transition-colors"
            >
              {showPassword ? "MASQUER" : "AFFICHER"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Saisissez à nouveau"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 transition-all pr-20"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-emerald-950 transition-colors"
            >
              {showConfirmPassword ? "MASQUER" : "AFFICHER"}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-900 focus:ring-emerald-800 cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-gray-600 leading-normal">
            J&apos;accepte les{" "}
            <Link href="/cgu" target="_blank" className="font-medium text-emerald-900 underline hover:text-emerald-950">
              Conditions Générales d&apos;Utilisation
            </Link>{" "}
            et la{" "}
            <Link href="/confidentialite" target="_blank" className="font-medium text-emerald-900 underline hover:text-emerald-950">
              politique de confidentialité
            </Link>.
          </label>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full rounded-xl bg-orange-700 py-3.5 text-sm font-medium text-white shadow-md transition-all hover:bg-orange-800 hover:shadow-lg mt-2"
        >
          Créer mon compte
        </motion.button>
      </form>

      {/* Lien Connexion */}
      <p className="mt-6 text-center text-xs text-gray-600">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-semibold text-orange-700 hover:underline">
          Se connecter
        </Link>
      </p>

    </motion.div>
  );
}