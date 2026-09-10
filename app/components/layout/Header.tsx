"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogoMarkIcon } from "@/app/components/icons/misc-icons";

export function SiteHeader() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileHebergementOpen, setIsMobileHebergementOpen] = useState(false);

  // Vérifie si on se trouve dans une section liée aux hébergements
  const isHebergementActive = pathname.startsWith("/chambres") || pathname.startsWith("/appartements");

  // Vérifie si on se trouve dans l'espace client
  const isCompteActive = pathname.startsWith("/compte");

  // Ferme le menu mobile à chaque changement de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileHebergementOpen(false);
  }, [pathname]);

  // Empêche le scroll du fond quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const mobileLinkClass = (active: boolean) =>
    `block rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${
      active ? "bg-emerald-50 text-emerald-900" : "text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 lg:px-10">

        {/* Logo & Nom */}
        <Link href="/" className="flex items-center gap-2.5 group min-w-0 sm:gap-3">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} className="shrink-0">
            <LogoMarkIcon className="h-8 w-8 text-emerald-900 sm:h-10 sm:w-10" />
          </motion.div>
          <span className="truncate font-[family-name:var(--font-display)] text-base font-bold text-emerald-950 tracking-tight sm:text-lg">
            Résidence Émeraude
          </span>
        </Link>

        {/* Navigation centrale (desktop) */}
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

        {/* Actions de droite (desktop) */}
        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href="/connexion"
            className={`text-[15px] font-medium transition-colors ${
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

        {/* Bouton hamburger (mobile / tablette) */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMobileMenuOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-emerald-950 hover:bg-gray-100 transition-colors lg:hidden"
        >
          <span className="relative block h-4 w-5">
            <motion.span
              className="absolute left-0 top-0 h-0.5 w-5 bg-current rounded-full"
              animate={isMobileMenuOpen ? { rotate: 45, top: "7px" } : { rotate: 0, top: "0px" }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-0 top-[7px] h-0.5 w-5 bg-current rounded-full"
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="absolute left-0 bottom-0 h-0.5 w-5 bg-current rounded-full"
              animate={isMobileMenuOpen ? { rotate: -45, top: "7px" } : { rotate: 0, top: "14px" }}
              transition={{ duration: 0.2 }}
            />
          </span>
        </button>
      </div>

      {/* Menu mobile (drawer plein écran) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-[57px] z-30 bg-black/30 lg:hidden sm:top-[65px]"
            />

            {/* Panneau */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 top-[57px] z-30 max-h-[calc(100vh-57px)] overflow-y-auto border-b border-gray-100 bg-white shadow-lg lg:hidden sm:top-[65px]"
            >
              <nav className="flex flex-col gap-1 px-4 py-4">
                <Link href="/" className={mobileLinkClass(pathname === "/")}>
                  Accueil
                </Link>

                {/* Sous-menu Nos Hébergements (accordéon) */}
                <button
                  type="button"
                  onClick={() => setIsMobileHebergementOpen((v) => !v)}
                  aria-expanded={isMobileHebergementOpen}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${
                    isHebergementActive ? "bg-emerald-50 text-emerald-900" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Nos Hébergements
                  <motion.span
                    animate={{ rotate: isMobileHebergementOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs"
                  >
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {isMobileHebergementOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-3"
                    >
                      <Link href="/chambres" className={mobileLinkClass(pathname.startsWith("/chambres"))}>
                        Chambres
                      </Link>
                      <Link href="/appartements" className={mobileLinkClass(pathname.startsWith("/appartements"))}>
                        Appartements
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link href="/bureaux" className={mobileLinkClass(pathname.startsWith("/bureaux"))}>
                  Bureaux
                </Link>
                <Link href="/reservation" className={mobileLinkClass(pathname.startsWith("/reservation"))}>
                  Réserver
                </Link>
                <Link href="/contact" className={mobileLinkClass(pathname.startsWith("/contact"))}>
                  Contact
                </Link>

                <div className="my-2 border-t border-gray-100" />

                <Link href="/connexion" className={mobileLinkClass(pathname === "/connexion")}>
                  Connexion
                </Link>
                <Link
                  href="/compte/dashboard"
                  className={`mt-1 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-medium shadow-md transition-all ${
                    isCompteActive ? "bg-emerald-950 text-white" : "bg-orange-700 text-white hover:bg-orange-800"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Espace client
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}