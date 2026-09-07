"use client";

import { motion } from "framer-motion";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/app/components/icons/social-icons";

const hebergements = ["Chambres VIP", "Suites Premium", "Appartements Meublés"];
const professionnel = ["Bureaux Partagés", "Salles de Réunion", "Coworking"];
const reseaux = [FacebookIcon, InstagramIcon, LinkedinIcon];

export function SiteFooter() {
  return (
   <footer className="mt-auto bg-gray-950 text-white/85">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-[family-name:var(--font-display)] text-2xl text-white font-bold">
              Résidence Émeraude
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Votre oasis d&apos;exception au Cameroun. Des séjours sur-mesure combinant élégance moderne,
              confort optimal et services professionnels de premier ordre.
            </p>
            <div className="mt-6 flex gap-3">
              {reseaux.map((Icone, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, backgroundColor: "var(--color-terracotta)" }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors"
                >
                  <Icone className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-(--color-terracotta) uppercase tracking-wider">Hébergements</p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {hebergements.map((item) => (
                <li key={item} className="hover:text-white transition-colors cursor-pointer">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-(--color-terracotta) uppercase tracking-wider">Professionnel</p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {professionnel.map((item) => (
                <li key={item} className="hover:text-white transition-colors cursor-pointer">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-(--color-terracotta) uppercase tracking-wider">Contact &amp; Douala</p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>Bonapriso, Douala</li>
              <li>+237 677 889 900</li>
              <li>contact@residence-emeraude.cm</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-sm font-semibold text-white">Newsletter</p>
          <p className="mt-2 max-w-md text-sm text-white/70">
            Inscrivez-vous pour recevoir nos offres privées et exclusivités.
          </p>
          <form className="mt-4 flex max-w-sm gap-2">
            <input
              type="email"
              placeholder="Votre email..."
              className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-(--color-terracotta) focus:outline-none"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="shrink-0 rounded-xl bg-(--color-forest-light) px-6 py-3 text-sm font-medium text-white hover:bg-(--color-forest) transition-colors"
            >
              Ok
            </motion.button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-(--color-sand)/50 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} Résidence Émeraude Cameroun. Tous droits réservés.</p>
          <p>Mentions Légales · CGV</p>
        </div>
      </div>
    </footer>
  );
}