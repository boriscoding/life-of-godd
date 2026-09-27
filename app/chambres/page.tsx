"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/app/components/layout/Header";
import { SiteFooter } from "@/app/components/layout/Footer";

interface Room {
  id: string;
  title: string;
  category: string;
  priceNumber: number;
  price: string;
  capacity: string;
  image: string;
}

// Le backend Express est monté sous /api/v1
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";

// Meme logique que sur la page Bureaux : le backend peut renvoyer un chemin
// local (ex: "properties/16191013-....jpeg" ou un chemin Windows avec
// antislashs) au lieu d'une URL complete. On reconstruit l'URL absolue
// vers le serveur Express qui sert les fichiers statiques (/uploads/...).
const formatImageUrl = (path?: string): string => {
  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // Extraction de l'origine du backend (http://localhost:5000)
  const serverOrigin = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

  // Nettoyage des antislashs Windows
  let cleanPath = path.replace(/\\/g, "/");
  if (!cleanPath.startsWith("/")) cleanPath = `/${cleanPath}`;

  // Gestion des sous-dossiers uploads/properties
  if (!cleanPath.startsWith("/uploads/")) {
    if (cleanPath.startsWith("/properties/")) {
      cleanPath = `/uploads${cleanPath}`;
    } else {
      cleanPath = `/uploads/properties${cleanPath}`;
    }
  }

  return `${serverOrigin}${cleanPath}`;
};

// Extraction robuste du chemin brut d'image (gestion JSON string, tableaux,
// objets, cles alternatives) — meme logique que normalizeOffice/extractRawImage
// sur la page Bureaux, adaptee au champ unique `image` renvoye par
// room.service.ts (getFormattedActiveRooms).
function extractRawImage(item: any): string {
  let img = item.image ?? item.images ?? item.photos ?? item.media;

  // 1. Si la valeur est une chaine JSON (ex: '["16191013-....jpeg"]')
  if (typeof img === "string") {
    const trimmed = img.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        img = parsed;
      } catch {
        return trimmed;
      }
    } else {
      return trimmed;
    }
  }

  // 2. Si c'est un tableau d'images
  if (Array.isArray(img) && img.length > 0) {
    const first = img[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      return first.url || first.src || first.path || first.filename || "";
    }
    return "";
  }

  // 3. Objet simple { url }
  if (img && typeof img === "object") {
    return img.url || img.src || img.path || "";
  }

  return "";
}

function normalizeRoom(item: any): Room {
  return {
    id: String(item.id),
    title: item.title || item.nom || "Chambre sans nom",
    category: item.category || item.type || "Standard",
    priceNumber: Number(item.priceNumber ?? item.price ?? 0) || 0,
    price: item.price ?? "—",
    capacity: item.capacity || item.capacite || "—",
    image: formatImageUrl(extractRawImage(item)),
  };
}

export default function ChambresPage() {
  const [chambres, setChambres] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialises APRES le chargement, a partir des vraies donnees recues :
  // toutes les categories reellement presentes sont selectionnees, et le
  // budget max correspond au prix le plus eleve trouve.
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [maxBudget, setMaxBudget] = useState<number>(0);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/rooms`);
      if (!res.ok) {
        throw new Error(`Erreur serveur (${res.status})`);
      }

      const json = await res.json();
      const rawList = Array.isArray(json) ? json : json.data || [];
      const list: Room[] = rawList.map(normalizeRoom);
      setChambres(list);

      const maxPrice = list.reduce((m, c) => Math.max(m, c.priceNumber || 0), 0);
      setMaxBudget(maxPrice > 0 ? maxPrice : 150000);
    } catch (error) {
      console.error("Erreur lors du chargement des chambres:", error);
      setErrorMsg("Impossible de charger les chambres depuis le serveur.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Bornes du curseur de budget, derivees des vraies donnees (jamais figees)
  const prixMaxDisponible = useMemo(
    () => Math.max(chambres.reduce((m, c) => Math.max(m, c.priceNumber || 0), 0), 1000),
    [chambres]
  );

  const filteredChambres = chambres.filter((chambre) => {
    const categoryMatch =
      selectedCategory === "Tous" ||
      chambre.category.toUpperCase() === selectedCategory.toUpperCase();
    const priceMatch = maxBudget === 0 || chambre.priceNumber <= maxBudget;
    return categoryMatch && priceMatch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <SiteHeader />

      <main className="flex-grow mx-auto max-w-7xl w-full px-6 py-8 lg:px-10">
        {/* Fil d'Ariane */}
        <div className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:underline">Accueil</Link> &gt;{" "}
          <span className="text-gray-900 font-medium">Chambres</span>
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
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                Catégorie
              </p>
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
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                Budget Max ({maxBudget.toLocaleString("fr-FR")} FCFA)
              </p>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span>0</span>
                <span>{prixMaxDisponible.toLocaleString("fr-FR")}</span>
              </div>
              <input
                type="range"
                min="0"
                max={prixMaxDisponible}
                step="1000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-emerald-950 cursor-pointer"
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                Équipements
              </p>
              <div className="space-y-2.5 text-xs text-gray-600">
                {[
                  "Wi-Fi Haute Vitesse",
                  "Climatisation",
                  "Télévision Smart",
                  "Petit-déjeuner inclus",
                ].map((eq) => (
                  <label key={eq} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 text-emerald-950 focus:ring-emerald-950"
                    />
                    <span>{eq}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* Grille de Chambres */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-emerald-950">
                Nos Chambres d&apos;Hôtel
              </h1>
              <p className="text-xs text-gray-500">
                {filteredChambres.length} hébergements disponibles
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : errorMsg ? (
              <div className="bg-red-50 text-red-700 rounded-2xl p-8 text-center border border-red-100 space-y-3">
                <p className="text-sm font-semibold">{errorMsg}</p>
                <button
                  onClick={fetchRooms}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-xl hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : filteredChambres.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-500 border border-gray-100">
                Aucune chambre disponible selon vos critères.
              </div>
            ) : (
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
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-gray-800 shadow-sm">
                        {chambre.capacity}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{chambre.title}</h3>
                        <p className="text-sm font-semibold text-emerald-900 mt-1">
                          {chambre.price}
                        </p>
                      </div>

                      <Link
                        href={`/chambres/${chambre.id}`}
                        className="mt-5 w-full rounded-xl bg-emerald-950 py-3 text-center text-xs font-medium text-white shadow-sm hover:bg-emerald-900 transition-colors block"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}