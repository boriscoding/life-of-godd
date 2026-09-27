"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/app/components/layout/Header";
import { SiteFooter } from "@/app/components/layout/Footer";

interface Bureau {
  id: string;
  title: string;
  category: string;
  superficie: string;
  capacity: string;
  price: number;
  rating: string | number;
  image: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";

// Helper pour normaliser et formater les URLs d'images (chemins locaux vs backend Express)
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

function parseNumeric(value: unknown, fallback = 0): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d.,]/g, "").replace(",", ".");
    const parsed = parseFloat(cleaned);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

// Extraction robuste du chemin brut d'image (gestion JSON string, tableaux, clés alternatives)
function extractRawImage(item: any): string {
  let imgs = item.images || item.photos || item.media;

  // 1. Si la propriété est une chaîne JSON (ex: '["16191013-1ecb-41c2-ae7c-034ab0bf49cc.jpeg"]')
  if (typeof imgs === "string") {
    try {
      const parsed = JSON.parse(imgs);
      if (Array.isArray(parsed)) imgs = parsed;
    } catch {
      if (imgs.trim().length > 0) return imgs;
    }
  }

  // 2. Si c'est un tableau d'images
  if (Array.isArray(imgs) && imgs.length > 0) {
    const first = imgs[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      return first.url || first.src || first.path || first.filename || "";
    }
  }

  // 3. Propriétés simples alternatives
  const single =
    item.image ||
    item.imageUrl ||
    item.coverImage ||
    item.photo ||
    item.filePath;

  if (typeof single === "string") return single;
  if (single && typeof single === "object") {
    return single.url || single.src || single.path || "";
  }

  return "";
}

function normalizeOffice(item: any): Bureau {
  const rawImage = extractRawImage(item);

  return {
    id: String(item.id),
    title: item.title || item.nom || item.libelle || "Bureau sans nom",
    category: item.category || item.type || "Bureau",
    superficie: item.superficie
      ? String(item.superficie).includes("m²")
        ? String(item.superficie)
        : `${item.superficie} m²`
      : "—",
    capacity: item.capacity || item.capacite || "—",
    price: parseNumeric(item.price ?? item.prixJour ?? item.prixNuite, 0),
    rating: item.rating || item.note || "4.8",
    image: formatImageUrl(rawImage),
  };
}

export default function BureauxPage() {
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [budgetMax, setBudgetMax] = useState<number>(0);

  const loadBureaux = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/offices`);
      if (!res.ok) {
        throw new Error(`Erreur serveur (${res.status})`);
      }

      const json = await res.json();
      const list = Array.isArray(json) ? json : json.data || [];
      const normalized: Bureau[] = list.map(normalizeOffice);

      setBureaux(normalized);

      const categories = Array.from(new Set(normalized.map((b) => b.category)));
      setSelectedCategories(categories);

      const maxPrice = normalized.reduce((m, b) => Math.max(m, b.price), 0);
      setBudgetMax(maxPrice > 0 ? maxPrice : 100000);
    } catch (err: any) {
      console.error("Erreur de chargement des bureaux :", err);
      setErrorMsg("Impossible de charger les bureaux depuis le serveur.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBureaux();
  }, [loadBureaux]);

  const categoriesDisponibles = useMemo(
    () => Array.from(new Set(bureaux.map((b) => b.category))),
    [bureaux]
  );

  const prixMaxDisponible = useMemo(
    () => Math.max(bureaux.reduce((m, b) => Math.max(m, b.price), 0), 1000),
    [bureaux]
  );

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredBureaux = bureaux.filter((b) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(b.category)) {
      return false;
    }
    if (budgetMax > 0 && b.price > budgetMax) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <SiteHeader />

      <main className="flex-grow mx-auto max-w-7xl w-full px-6 py-6 lg:px-10">
        {/* Fil d'Ariane */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:underline">Accueil</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">Bureaux</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar - Filtres */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-72 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-7 shrink-0"
          >
            <h2 className="font-bold text-gray-900 text-base">Filtres Bureaux</h2>

            {categoriesDisponibles.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Catégorie</p>
                <div className="space-y-2.5 text-xs text-gray-600">
                  {categoriesDisponibles.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="rounded border-gray-300 text-emerald-950 focus:ring-emerald-950 w-4 h-4 accent-emerald-950"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Budget maximum</p>
              <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                <span>{budgetMax.toLocaleString("fr-FR")} FCFA</span>
                <span className="text-gray-400">à {prixMaxDisponible.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <input
                type="range"
                min="0"
                max={prixMaxDisponible}
                step="1000"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full accent-emerald-950 cursor-pointer"
              />
            </div>
          </motion.aside>

          {/* Grille Principale */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-emerald-950">
                Nos Bureaux & Espaces de Travail
              </h1>
              <p className="text-xs text-gray-500">
                {filteredBureaux.length} espace(s) trouvé(s)
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : errorMsg ? (
              <div className="bg-red-50 text-red-700 rounded-3xl p-8 text-center border border-red-100 space-y-3">
                <p className="text-sm font-semibold">{errorMsg}</p>
                <button
                  onClick={loadBureaux}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-xl hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : filteredBureaux.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-gray-500 border border-gray-100">
                Aucun bureau ne correspond à vos critères.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBureaux.map((bureau) => (
                  <motion.div
                    key={bureau.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-shadow"
                  >
                    {/* Image & Badges */}
                    <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                      <img
                        src={bureau.image}
                        alt={bureau.title}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        {bureau.category}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl text-xs font-semibold text-gray-800 shadow-sm">
                        <span className="bg-gray-100 px-2.5 py-1 rounded-lg text-gray-700">
                          {bureau.capacity}
                        </span>
                        <span className="text-emerald-900">{bureau.superficie}</span>
                        <div className="flex items-center gap-1 text-gray-900">
                          <span>⭐</span>
                          <span>{bureau.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Info & Prix */}
                    <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{bureau.title}</h3>
                        <p className="text-sm font-bold text-emerald-900 mt-1">
                          {bureau.price.toLocaleString("fr-FR")} FCFA / jour
                        </p>
                      </div>

                      <Link
                        href={`/bureaux/${bureau.id}`}
                        className="block w-full rounded-xl bg-emerald-950 py-2.5 text-center text-xs font-medium text-white shadow-sm hover:bg-emerald-900 transition-colors"
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