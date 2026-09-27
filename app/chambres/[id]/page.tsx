"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SiteHeader } from "@/app/components/layout/Header";
import { SiteFooter } from "@/app/components/layout/Footer";
import { saveBienSelection } from "@/app/lib/reservation";

interface Chambre {
  id: string;
  title: string;
  category: string;
  price: string | number;
  capacity: string;
  rating: string | number;
  description: string;
  images: string[];
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";

const mockChambres: Record<string, Chambre> = {
  "1": {
    id: "1",
    title: "Chambre Standard Hibiscus",
    category: "Standard",
    price: "20 000 FCFA",
    capacity: "1-2 pers.",
    rating: "4.8",
    description:
      "La Chambre Standard offre un cadre chaleureux et tout le confort nécessaire pour un séjour agréable à un prix abordable.",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "2": {
    id: "2",
    title: "Chambre Premium Émeraude",
    category: "Premium",
    price: "30 000 FCFA",
    capacity: "2 pers.",
    rating: "4.8",
    description:
      "La Suite Émeraude offre une expérience d'hébergement supérieure, spacieuse et décorée avec élégance pour les voyageurs exigeants.",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "3": {
    id: "3",
    title: "Suite VIP Akwa",
    category: "VIP",
    price: "50 000 FCFA",
    capacity: "2-3 pers.",
    rating: "4.9",
    description:
      "Une suite somptueuse avec des prestations haut de gamme, un salon privé et une vue imprenable.",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    ],
  },
};

// Le backend Express est monté sous /api/v1 — l'entité s'appelle "rooms" côté serveur
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Récupération de l'URL racine du serveur Express (ex: http://localhost:5000)
const SERVER_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

/**
 * Formate l'URL de l'image pour pointer systématiquement vers le serveur backend Express
 */
function formatImageUrl(rawImage: any, fallback: string = FALLBACK_IMAGE): string {
  let imgPath = rawImage;

  if (Array.isArray(rawImage) && rawImage.length > 0) {
    imgPath = rawImage[0];
  } else if (typeof rawImage === "string" && rawImage.startsWith("[")) {
    try {
      const parsed = JSON.parse(rawImage);
      if (Array.isArray(parsed) && parsed.length > 0) imgPath = parsed[0];
    } catch {
      // conserver la chaîne brute si le parse échoue
    }
  }

  if (!imgPath || typeof imgPath !== "string") return fallback;

  // Si c'est déjà une URL distante complète
  if (
    imgPath.startsWith("http://") ||
    imgPath.startsWith("https://") ||
    imgPath.startsWith("data:")
  ) {
    return imgPath;
  }

  // Nettoyage des slashes initiaux
  const cleanPath = imgPath.replace(/^\/+/, "");

  // Si le chemin contient déjà le dossier uploads
  if (cleanPath.startsWith("uploads/")) {
    return `${SERVER_URL}/${cleanPath}`;
  }

  // Par défaut : fichier uploadé dans le dossier /uploads/properties/ du backend
  return `${SERVER_URL}/uploads/properties/${cleanPath}`;
}

export default function DetailChambrePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const chambreId = resolvedParams.id;
  const router = useRouter();

  const [chambre, setChambre] = useState<Chambre | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChambre = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/${chambreId}`);
        if (res.ok) {
          const data = await res.json();

          // Extraction et formatage des images
          let rawImagesList: any[] = [];
          if (Array.isArray(data.images) && data.images.length > 0) {
            rawImagesList = data.images;
          } else if (data.image || data.coverImage) {
            rawImagesList = [data.image || data.coverImage];
          }

          let parsedImages: string[] = rawImagesList
            .map((img: any) => {
              const raw = typeof img === "string" ? img : img?.url || img?.src || "";
              return formatImageUrl(raw, FALLBACK_IMAGE);
            })
            .filter(Boolean);

          if (parsedImages.length === 0) {
            parsedImages = [FALLBACK_IMAGE];
          }

          // Normalisation des données venant de la BDD
          const normalizedData: Chambre = {
            id: String(data.id || chambreId),
            title: data.title || data.nom || "Chambre sans titre",
            category: data.category || data.type || "Chambre",
            price: data.price ?? data.priceNumber ?? data.prixNuite ?? "0 FCFA",
            capacity: data.capacity || data.capacite || "1-2 pers.",
            rating: data.rating || "4.8",
            description: data.description || "Aucune description disponible.",
            images: parsedImages,
          };

          setChambre(normalizedData);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.warn("Échec de chargement API, bascule sur le mock local :", error);
      }

      const localData = mockChambres[chambreId] || mockChambres["1"];
      setChambre(localData);
      setIsLoading(false);
    };

    loadChambre();
  }, [chambreId]);

  const handleReserve = () => {
    if (!chambre) return;

    const rawPrice =
      typeof chambre.price === "number"
        ? chambre.price
        : Number(String(chambre.price).replace(/[^\d]/g, ""));

    saveBienSelection({
      id: chambre.id || chambreId,
      type: "room",
      nom: chambre.title,
      description: chambre.description,
      capacite: chambre.capacity,
      superficie: "",
      litOuEquipement: "",
      prixNuite: rawPrice,
      image: chambre.images[0] || "",
    });

    router.push("/reservation/etape-2");
  };

  const equipments = [
    { label: "Wi-Fi Haut Débit" },
    { label: "Climatisation" },
    { label: "Téléviseur 4K" },
    { label: "Coffre-fort privé" },
    { label: "Mini-bar gratuit" },
    { label: "Room service 24/7" },
  ];

  if (isLoading || !chambre) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50/50">
        <SiteHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-emerald-950 border-t-transparent rounded-full animate-spin" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const formattedPrice =
    typeof chambre.price === "number"
      ? `${chambre.price.toLocaleString("fr-FR")} FCFA`
      : chambre.price;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <SiteHeader />

      <main className="flex-grow mx-auto max-w-7xl w-full px-6 py-8 lg:px-10">
        {/* Fil d'Ariane */}
        <div className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:underline">Accueil</Link>
          <span>&gt;</span>
          <Link href="/chambres" className="hover:underline">Chambres</Link>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">{chambre.title}</span>
        </div>

        {/* Galerie photos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          <div className="lg:col-span-2 h-[350px] sm:h-[420px] rounded-3xl overflow-hidden shadow-sm bg-gray-100">
            <img
              src={chambre.images[activeImageIndex] || chambre.images[0]}
              alt={chambre.title}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
            {chambre.images.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`h-[100px] lg:h-[130px] rounded-2xl overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx
                    ? "border-emerald-900 ring-2 ring-emerald-900/20"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Aperçu ${idx + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">{chambre.category}</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{chambre.capacity}</span>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">⭐ {chambre.rating}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-emerald-950">{chambre.title}</h1>
              <p className="text-2xl font-bold text-orange-700 mt-2">
                {formattedPrice} <span className="text-sm font-normal text-gray-500">/ nuit</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h2 className="font-bold text-gray-900 text-base">Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{chambre.description}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-900 text-base">Équipements inclus</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {equipments.map((eq, index) => (
                  <div key={index} className="text-xs font-medium text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {eq.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full lg:w-[380px] bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-24 space-y-6"
          >
            <h2 className="font-bold text-gray-900 text-lg">Réserver votre séjour</h2>
            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>TARIF PAR NUIT</span>
              <span className="font-semibold text-gray-900">{formattedPrice}</span>
            </div>
            <button
              type="button"
              onClick={handleReserve}
              className="block w-full rounded-xl bg-orange-700 py-3.5 text-center text-sm font-semibold text-white shadow-md hover:bg-orange-800 transition-colors"
            >
              Réserver maintenant
            </button>
          </motion.div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}