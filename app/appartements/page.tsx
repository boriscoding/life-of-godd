"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/app/components/layout/Header";
import { SiteFooter } from "@/app/components/layout/Footer";

// Modèle de données unifié pour les Appartements et Chambres issus de la BDD
export interface Bien {
  id: string;
  title: string;
  type: "APPARTEMENT" | "CHAMBRE";
  category: string;
  pieces: string;
  superficie: number;
  price: number;
  rating: number | string;
  image: string;
  description?: string;
}

// Le backend Express est monté sous /api/v1
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Récupération de l'URL racine du serveur Express (ex: http://localhost:5000)
const SERVER_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

/**
 * Formate l'URL de l'image pour pointer correctement vers le backend Express
 */
function formatImageUrl(rawImage: any, fallback: string): string {
  let imgPath = rawImage;

  // Si l'image est stockée sous forme de tableau ou chaîne JSON
  if (Array.isArray(rawImage) && rawImage.length > 0) {
    imgPath = rawImage[0];
  } else if (typeof rawImage === "string" && rawImage.startsWith("[")) {
    try {
      const parsed = JSON.parse(rawImage);
      if (Array.isArray(parsed) && parsed.length > 0) imgPath = parsed[0];
    } catch {
      // conserver la chaîne d'origine si l'analyse échoue
    }
  }

  if (!imgPath || typeof imgPath !== "string") return fallback;

  // Si c'est déjà une URL distante complète (Unsplash, http, https, data:image)
  if (
    imgPath.startsWith("http://") ||
    imgPath.startsWith("https://") ||
    imgPath.startsWith("data:")
  ) {
    return imgPath;
  }

  // Si le chemin commence déjà par /uploads/
  if (imgPath.startsWith("/uploads")) {
    return `${SERVER_URL}${imgPath}`;
  }

  // Si c'est un chemin relatif au dossier public du frontend Next.js
  if (imgPath.startsWith("/")) {
    return imgPath;
  }

  // Par défaut : fichier uploadé stocké dans le dossier /uploads/properties/ du backend
  return `${SERVER_URL}/uploads/properties/${imgPath}`;
}

function parseNumeric(value: unknown, fallback = 0): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d.,]/g, "").replace(",", ".");
    const parsed = parseFloat(cleaned);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

function normalizeApartment(item: any): Bien {
  const rawImg = item.image || item.coverImage || item.images;
  return {
    id: String(item.id),
    title: item.title || item.name || "Appartement sans nom",
    type: "APPARTEMENT",
    category: item.category || item.pieces || "Appartement",
    pieces: item.pieces || "Non renseigné",
    superficie: parseNumeric(item.superficie, 0),
    price: parseNumeric(item.price ?? item.priceNumber, 0),
    rating: item.rating ?? "4.8",
    image: formatImageUrl(rawImg, "/placeholder-apartment.jpg"),
    description: item.description,
  };
}

function normalizeRoom(item: any): Bien {
  const rawImg = item.image || item.coverImage || item.images;
  return {
    id: String(item.id),
    title: item.title || item.name || "Chambre sans nom",
    type: "CHAMBRE",
    category: item.category || "Chambre",
    pieces: item.pieces || "Studio",
    superficie: parseNumeric(item.superficie, 0),
    price: parseNumeric(item.priceNumber ?? item.price, 0),
    rating: item.rating ?? "4.8",
    image: formatImageUrl(rawImg, "/placeholder-room.jpg"),
    description: item.description,
  };
}

export default function AppartementsPage() {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filtres
  const [filterType, setFilterType] = useState<"TOUS" | "APPARTEMENT" | "CHAMBRE">("TOUS");
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);
  const [formule, setFormule] = useState("Nuitée");
  const [superficieMin, setSuperficieMin] = useState(0);

  const loadBiensFromDB = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const [apartmentsRes, roomsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/apartments`),
        fetch(`${API_BASE_URL}/rooms`),
      ]);

      if (!apartmentsRes.ok && !roomsRes.ok) {
        throw new Error(
          `Erreur serveur (${apartmentsRes.status}/${roomsRes.status}) : Impossible de charger les hébergements`
        );
      }

      const apartmentsData = apartmentsRes.ok ? await apartmentsRes.json() : [];
      const roomsData = roomsRes.ok ? await roomsRes.json() : [];

      const merged: Bien[] = [
        ...(Array.isArray(apartmentsData) ? apartmentsData.map(normalizeApartment) : []),
        ...(Array.isArray(roomsData) ? roomsData.map(normalizeRoom) : []),
      ];

      setBiens(merged);

      const piecesTrouvees = Array.from(new Set(merged.map((b) => b.pieces)));
      setSelectedPieces(piecesTrouvees);

      setSuperficieMin(0);
    } catch (err: any) {
      console.error("Erreur de connexion à la base de données :", err);
      setErrorMsg("Impossible de charger les données depuis le serveur.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBiensFromDB();
  }, [loadBiensFromDB]);

  const piecesDisponibles = useMemo(
    () => Array.from(new Set(biens.map((b) => b.pieces))),
    [biens]
  );

  const superficieMaxDisponible = useMemo(
    () => Math.max(biens.reduce((m, b) => Math.max(m, b.superficie), 0), 20),
    [biens]
  );

  const togglePiece = (piece: string) => {
    setSelectedPieces((prev) =>
      prev.includes(piece) ? prev.filter((p) => p !== piece) : [...prev, piece]
    );
  };

  const filteredBiens = biens.filter((item) => {
    if (filterType !== "TOUS" && item.type !== filterType) return false;
    if (item.superficie < superficieMin) return false;
    if (selectedPieces.length > 0 && !selectedPieces.includes(item.pieces)) {
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
          <span className="text-gray-800 font-medium">Hébergements</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar - Filtres */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-72 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-7 shrink-0"
          >
            <h2 className="font-bold text-gray-900 text-base">Filtres de recherche</h2>

            {/* Onglet Type de bien */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Type de logement</p>
              <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-medium">
                {(["TOUS", "APPARTEMENT", "CHAMBRE"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilterType(type)}
                    className={`flex-1 py-1.5 rounded-lg transition-all capitalize ${
                      filterType === type
                        ? "bg-emerald-950 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {type === "TOUS" ? "Tous" : type.toLowerCase() + "s"}
                  </button>
                ))}
              </div>
            </div>

            {/* Nombre de pièces */}
            {piecesDisponibles.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Type / Pièces</p>
                <div className="space-y-2.5 text-xs text-gray-600">
                  {piecesDisponibles.map((piece) => (
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
            )}

            {/* Formule de tarification */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Tarification</p>
              <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-medium">
                {["Nuitée", "Semaine", "Mois"].map((item) => (
                  <button
                    key={item}
                    type="button"
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
                <span>{superficieMin} m²</span>
                <span className="text-gray-400">à {superficieMaxDisponible} m²</span>
              </div>
              <input
                type="range"
                min="0"
                max={superficieMaxDisponible}
                value={superficieMin}
                onChange={(e) => setSuperficieMin(Number(e.target.value))}
                className="w-full accent-emerald-950 cursor-pointer"
              />
            </div>
          </motion.aside>

          {/* Grille Principale des Biens */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-emerald-950">
                Nos Hébergements Disponibles
              </h1>
              <p className="text-xs text-gray-500">
                {filteredBiens.length} logement(s) trouvé(s)
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : errorMsg ? (
              <div className="bg-red-50 text-red-700 rounded-3xl p-8 text-center border border-red-100 space-y-3">
                <p className="text-sm font-semibold">{errorMsg}</p>
                <button
                  onClick={loadBiensFromDB}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-xl hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : filteredBiens.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-gray-500 border border-gray-100">
                Aucun appartement ou chambre ne correspond à vos critères.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBiens.map((item) => {
                  const detailPath =
                    item.type === "CHAMBRE"
                      ? `/chambres/${item.id}`
                      : `/appartements/${item.id}`;

                  const fallbackImg =
                    item.type === "CHAMBRE"
                      ? "/placeholder-room.jpg"
                      : "/placeholder-apartment.jpg";

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          onError={(e) => {
                            e.currentTarget.src = fallbackImg;
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          {item.type}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl text-xs font-semibold text-gray-800 shadow-sm">
                          <span className="bg-gray-100 px-2.5 py-1 rounded-lg text-gray-700">
                            {item.pieces}
                          </span>
                          <span className="text-emerald-900">{item.superficie} m²</span>
                          <div className="flex items-center gap-1 text-gray-900">
                            <span>⭐</span>
                            <span>{item.rating || "4.8"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                          <p className="text-sm font-bold text-emerald-900 mt-1">
                            {Number(item.price).toLocaleString("fr-FR")} FCFA / {formule.toLowerCase()}
                          </p>
                        </div>

                        <Link
                          href={detailPath}
                          className="block w-full rounded-xl bg-emerald-950 py-2.5 text-center text-xs font-medium text-white shadow-sm hover:bg-emerald-900 transition-colors"
                        >
                          Voir détails
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}