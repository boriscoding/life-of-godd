"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BedIcon, BriefcaseIcon, HomeIcon } from "@/app/components/icons/offer-icons";
import { CalendarIcon, DoorIcon, SearchIcon, UsersIcon } from "@/app/components/icons/misc-icons";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/app/components/icons/social-icons";
import { StarRating } from "@/app/components/ui/star-rating";

const reseaux = [FacebookIcon, InstagramIcon, LinkedinIcon];

const offres = [
  {
    titre: "Chambres d'hôtel",
    texte: "Profitez du raffinement absolu, de literies d'exception et d'un room service disponible 24h/24.",
    Icone: BedIcon,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    href: "/chambres",
  },
  {
    titre: "Appartements meublés",
    texte: "Le confort de la maison avec la flexibilité d'un hôtel haut de gamme. Parfait pour les moyens et longs séjours.",
    Icone: HomeIcon,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    href: "/appartements",
  },
  {
    titre: "Bureaux professionnels",
    texte: "Des espaces de travail et salles de réunion modernes dotés d'une connexion internet ultra-rapide.",
    Icone: BriefcaseIcon,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    href: "/bureaux",
  },
];

const avis = [
  {
    note: 5,
    texte:
      "Un endroit d'un calme exceptionnel en plein Bonapriso. La sécurité est au top et l'internet par fibre optique m'a permis de travailler sans aucune interruption.",
    nom: "Jean-Paul N.",
    role: "CEO, AfriTech Douala",
  },
  {
    note: 4.8,
    texte:
      "J'ai loué l'appartement F3 pour ma famille pendant deux semaines. Le standing et la propreté sont excellents. Nous reviendrons sans hésiter.",
    nom: "Marie-Noëlle K.",
    role: "Voyageuse régulière",
  },
];

export default function AccueilPage() {
  return (
    <div className="bg-white text-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[700px] text-white">
        {/* Image de fond en ligne avec effet zoom lent */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1920&q=80"
            alt="Résidence Émeraude Bonapriso"
            className="h-full w-full object-cover"
          />
          {/* Overlay teinté aux couleurs de la charte */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-900/85 to-emerald-950/60" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-24 lg:px-10">
          {/* Réseaux sociaux animés */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex gap-3"
          >
            {reseaux.map((Icone, i) => (
              <span
                key={i}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-orange-700 hover:scale-110"
              >
                <Icone className="h-4 w-4" />
              </span>
            ))}
          </motion.div>

          {/* Titre & Description animés */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 max-w-2xl text-4xl font-bold tracking-tight leading-[1.1] sm:text-5xl lg:text-6xl text-white"
          >
            Votre séjour d&apos;exception au cœur du Cameroun
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 max-w-xl text-base text-gray-200 sm:text-lg leading-relaxed"
          >
            Découvrez nos chambres d&apos;hôtel raffinées, nos appartements meublés grand standing et nos
            espaces de bureaux équipés à Bonapriso, Douala.
          </motion.p>
        </div>

        {/* Barre de recherche flottante avec apparition en fondu */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative mx-auto max-w-7xl px-6 pb-16 lg:px-10"
        >
          <form className="grid gap-4 rounded-2xl bg-white p-6 text-gray-900 shadow-2xl sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end border border-gray-200">
            <label className="text-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Type de bien
              </span>
              <div className="mt-1.5 flex items-center gap-2 border-b border-gray-300 pb-1.5">
                <DoorIcon className="h-4 w-4 shrink-0 text-emerald-700" />
                <select className="w-full border-0 bg-transparent font-medium text-gray-900 focus:outline-none cursor-pointer">
                  <option className="text-gray-900">Chambre Premium</option>
                  <option className="text-gray-900">Chambre Standard</option>
                  <option className="text-gray-900">Appartement meublé</option>
                  <option className="text-gray-900">Bureau</option>
                </select>
              </div>
            </label>

            <label className="text-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Arrivée</span>
              <div className="mt-1.5 flex items-center gap-2 border-b border-gray-300 pb-1.5">
                <CalendarIcon className="h-4 w-4 shrink-0 text-emerald-700" />
                <input
                  type="date"
                  defaultValue="2025-11-12"
                  className="w-full border-0 bg-transparent font-medium text-gray-900 focus:outline-none cursor-pointer"
                />
              </div>
            </label>

            <label className="text-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Départ</span>
              <div className="mt-1.5 flex items-center gap-2 border-b border-gray-300 pb-1.5">
                <CalendarIcon className="h-4 w-4 shrink-0 text-emerald-700" />
                <input
                  type="date"
                  defaultValue="2025-11-19"
                  className="w-full border-0 bg-transparent font-medium text-gray-900 focus:outline-none cursor-pointer"
                />
              </div>
            </label>

            <label className="text-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Personnes
              </span>
              <div className="mt-1.5 flex items-center gap-2 border-b border-gray-300 pb-1.5">
                <UsersIcon className="h-4 w-4 shrink-0 text-emerald-700" />
                <select className="w-full border-0 bg-transparent font-medium text-gray-900 focus:outline-none cursor-pointer">
                  <option className="text-gray-900">2 Adultes</option>
                  <option className="text-gray-900">1 Adulte</option>
                  <option className="text-gray-900">Famille (4)</option>
                </select>
              </div>
            </label>

            <Link
              href="/reservation"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-95"
            >
              <SearchIcon className="h-4 w-4" />
              Rechercher
            </Link>
          </form>
        </motion.div>
      </section>

      {/* Section Nos Offres avec animations au défilement */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-orange-700">Nos offres</p>
          <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Conçu pour répondre à toutes vos exigences
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {offres.map((offre, index) => (
            <motion.div
              key={offre.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Link
                href={offre.href}
                className="group flex flex-col h-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="h-60 w-full overflow-hidden bg-gray-100">
                  <img
                    src={offre.image}
                    alt={offre.titre}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-7 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-emerald-800">
                      <offre.Icone className="h-6 w-6" />
                      <h3 className="text-xl font-bold text-gray-900">
                        {offre.titre}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{offre.texte}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700 group-hover:underline">
                    Découvrir l'espace &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="bg-emerald-50/50 py-28 relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">Témoignages</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ce que disent nos clients
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-8 text-left sm:grid-cols-2">
            {avis.map((item, index) => (
              <motion.div
                key={item.nom}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <StarRating note={item.note} />
                <p className="mt-4 text-sm leading-relaxed text-gray-700 italic">&ldquo;{item.texte}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3.5 border-t border-gray-100 pt-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
                    {item.nom.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.nom}</p>
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}