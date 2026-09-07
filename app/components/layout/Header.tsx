"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogoMarkIcon } from "@/app/components/icons/misc-icons";

export function SiteHeader() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Vérifie si on se trouve dans une section liée aux hébergements
  const isHebergementActive = pathname.startsWith("/chambres") || pathname.startsWith("/appartements");

  // Vérifie si on se trouve dans l'espace client
  const isCompteActive = pathname.startsWith("/compte");

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        
        {/* Logo & Nom */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <LogoMarkIcon className="h-10 w-10 text-emerald-900" />
          </motion.div>
          <span className="font-[family-name:var(--font-display)] text-lg font-bold text-emerald-950 tracking-tight">
            Résidence Émeraude
          </span>
        </Link>

        {/* Navigation centrale */}
        <nav className="hidden items-center gap-9 text-[15px] text-gray-600 lg:flex">
          {/* Accueil */}
          <Link
            href="/"
            className={
              pathname === "/"
                ? "font-semibold text-emerald-800 underline decoration-2 underline-offset-8"
                : "hover:text-emerald-950 transition-colors"
            }
          >
            Accueil
          </Link>

          {/* Menu déroulant Nos Hébergements */}
          <div 
            className="relative py-2"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Link
              href="/chambres"
              className={`flex items-center gap-1.5 transition-colors ${
                isHebergementActive
                  ? "font-semibold text-emerald-800 underline decoration-2 underline-offset-8"
                  : "hover:text-emerald-950"
              }`}
            >
              Nos Hébergements
              <span className="text-xs">▼</span>
            </Link>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2.5 z-50"
                >
                  <Link
                    href="/chambres"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors font-medium"
                  >
                    Chambres 
                  </Link>
                  <Link
                    href="/appartements"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors font-medium"
                  >
                    Appartements 
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bureaux */}
          <Link
            href="/bureaux"
            className={
              pathname.startsWith("/bureaux")
                ? "font-semibold text-emerald-800 underline decoration-2 underline-offset-8"
                : "hover:text-emerald-950 transition-colors"
            }
          >
            Bureaux
          </Link>

          {/* Réserver */}
          <Link
            href="/reservation"
            className={
              pathname.startsWith("/reservation")
                ? "font-semibold text-emerald-800 underline decoration-2 underline-offset-8"
                : "hover:text-emerald-950 transition-colors"
            }
          >
            Réserver
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            className={
              pathname.startsWith("/contact")
                ? "font-semibold text-emerald-800 underline decoration-2 underline-offset-8"
                : "hover:text-emerald-950 transition-colors"
            }
          >
            Contact
          </Link>
        </nav>

        {/* Actions de droite */}
        <div className="flex items-center gap-6">
          <Link
            href="/connexion"
            className={`hidden text-[15px] font-medium sm:inline transition-colors ${
              pathname === "/connexion"
                ? "text-emerald-800 font-semibold underline decoration-2 underline-offset-8"
                : "text-gray-700 hover:text-emerald-950"
            }`}
          >
            Connexion
          </Link>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/compte/dashboard"
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-[15px] font-medium shadow-md transition-all ${
                isCompteActive
                  ? "bg-emerald-950 text-white shadow-lg"
                  : "bg-orange-700 text-white hover:bg-orange-800 hover:shadow-lg"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Espace client
            </Link>
          </motion.div>
        </div>

      </div>
    </motion.header>
  );
}