"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SiteHeader } from "@/app/components/layout/Header";
import { SiteFooter } from "@/app/components/layout/Footer";
import { saveBienSelection } from "@/app/lib/reservation";

interface EquipmentItem {
  label: string;
}

interface Bureau {
  id: string;
  title: string;
  category: string;
  superficie: string;
  capacity: string;
  price: string | number;
  rating: string | number;
  description: string;
  images: string[];
  equipments: EquipmentItem[];
}

const DEFAULT_EQUIPMENTS: EquipmentItem[] = [
  { label: "Fibre Optique 200 Mbps" },
  { label: "Mobilier Ergonomique" },
  { label: "Écran de présentation 4K" },
  { label: "Accès Salles de Réunion" },
  { label: "Espace Pause & Café" },
  { label: "Service Impression & Scan" },
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";

const mockBureaux: Record<string, Bureau> = {
  "b-01": {
    id: "b-01",
    title: "Bureau Exécutif Akwa",
    category: "Bureau Privé",
    superficie: "25 m²",
    capacity: "1-4 personnes",
    price: 35000,
    rating: "4.9",
    description:
      "Un bureau privé haut de gamme entièrement meublé, situé au cœur d'Akwa. Idéal pour les entreprises, consultants et équipes restreintes cherchant un cadre professionnel complet.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    ],
    equipments: DEFAULT_EQUIPMENTS,
  },
  "b-02": {
    id: "b-02",
    title: "Salle de Conférence Wouri",
    category: "Salle de Réunion",
    superficie: "50 m²",
    capacity: "12-20 personnes",
    price: 60000,
    rating: "5.0",
    description:
      "Salle de réunion moderne équipée d'un vidéoprojecteur 4K, système d'imprimante réseau et tableau blanc interactif pour vos séminaires et présentations d'affaires.",
    images: [
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    ],
    equipments: DEFAULT_EQUIPMENTS,
  },
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Helper pour normaliser et formater les URLs d'images (chemins locaux vs backend Express)
const formatImageUrl = (path?: string): string => {
  if (!path) return DEFAULT_IMAGE;
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

export default function DetailBureauPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const bureauId = resolvedParams.id;
  const router = useRouter();

  const [bureau, setBureau] = useState<Bureau | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchBureauData = async (signal?: AbortSignal) => {
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/offices/${bureauId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      });

      if (response.ok) {
        const data = await response.json();

        // Normalisation des images
        let rawImages: string[] = [];
        if (Array.isArray(data.images) && data.images.length > 0) {
          rawImages = data.images.map((img: any) =>
            typeof img === "string" ? img : img.url || img.src || ""
          );
        } else if (data.image) {
          rawImages = [
            typeof data.image === "string" ? data.image : data.image.url || "",
          ];
        }

        const parsedImages =
          rawImages.length > 0
            ? rawImages.map(formatImageUrl)
            : [DEFAULT_IMAGE];

        // Normalisation des équipements
        const rawEquipments =
          data.equipments || data.equipements || data.services || data.amenities;
        let parsedEquipments: EquipmentItem[] = DEFAULT_EQUIPMENTS;

        if (Array.isArray(rawEquipments) && rawEquipments.length > 0) {
          parsedEquipments = rawEquipments.map((item: any) =>
            typeof item === "string"
              ? { label: item }
              : { label: item.label || item.nom || item.name || "Équipement" }
          );
        }

        const normalizedBureau: Bureau = {
          id: String(data.id || bureauId),
          title: data.title || data.nom || data.libelle || "Bureau sans nom",
          category: data.category || data.type || "Bureau",
          superficie: data.superficie
            ? String(data.superficie).includes("m²")
              ? data.superficie
              : `${data.superficie} m²`
            : "20 m²",
          capacity: data.capacity || data.capacite || "1-4 personnes",
          price: data.price ?? data.prixJour ?? data.prixNuite ?? 30000,
          rating: data.rating || data.note || "4.8",
          description:
            data.description || "Aucune description disponible pour cet espace.",
          images: parsedImages,
          equipments: parsedEquipments,
        };

        setBureau(normalizedBureau);
        setIsLoading(false);
        return;
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.warn("Échec API backend bureaux, tentative sur données locales :", err);
    }

    if (mockBureaux[bureauId]) {
      setBureau(mockBureaux[bureauId]);
      setHasError(false);
    } else {
      setBureau(mockBureaux["b-01"]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchBureauData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [bureauId]);

  const handleReserve = () => {
    if (!bureau) return;

    const numericPrice =
      typeof bureau.price === "number"
        ? bureau.price
        : Number(String(bureau.price).replace(/[^\d]/g, "")) || 0;

    saveBienSelection({
      id: bureau.id,
      type: "office",
      nom: bureau.title,
      description: bureau.description,
      capacite: bureau.capacity,
      superficie: bureau.superficie,
      litOuEquipement: "Espace de travail équipé",
      prixNuite: numericPrice,
      image: bureau.images[0] || "",
    });

    router.push("/reservation/etape-2");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50/50">
        <SiteHeader />
        <main className="flex-grow flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 border-4 border-emerald-950 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-medium">Chargement des détails...</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (hasError || !bureau) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50/50">
        <SiteHeader />
        <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Impossible de charger le bureau</h2>
          <p className="text-sm text-gray-500 mb-6">Une erreur est survenue lors de la récupération des données.</p>
          <button
            onClick={() => fetchBureauData()}
            className="px-5 py-2.5 bg-emerald-950 text-white text-xs font-semibold rounded-xl hover:bg-emerald-900 transition-colors"
          >
            Réessayer
          </button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const formattedPrice =
    typeof bureau.price === "number"
      ? `${bureau.price.toLocaleString("fr-FR")} FCFA`
      : String(bureau.price).includes("FCFA")
      ? bureau.price
      : `${bureau.price} FCFA`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <SiteHeader />

      <main className="flex-grow mx-auto max-w-7xl w-full px-6 py-8 lg:px-10">
        {/* Fil d'Ariane */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Accueil</Link>
          <span>&gt;</span>
          <Link href="/bureaux" className="hover:underline">Bureaux</Link>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium truncate">{bureau.title}</span>
        </nav>

        {/* Galerie photos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          <div className="lg:col-span-2 h-[350px] sm:h-[420px] rounded-3xl overflow-hidden shadow-sm bg-gray-100">
            <img
              src={bureau.images[activeImageIndex] || bureau.images[0]}
              alt={bureau.title}
              onError={(e) => {
                e.currentTarget.src = DEFAULT_IMAGE;
              }}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
            {bureau.images.map((imgUrl, idx) => (
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
                    e.currentTarget.src = DEFAULT_IMAGE;
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
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                  {bureau.category}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                  {bureau.capacity}
                </span>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                  {bureau.superficie}
                </span>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                  ⭐ {bureau.rating}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-emerald-950">{bureau.title}</h1>
              <p className="text-2xl font-bold text-orange-700 mt-2">
                {formattedPrice} <span className="text-sm font-normal text-gray-500">/ jour</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h2 className="font-bold text-gray-900 text-base">Présentation de l'espace</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{bureau.description}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-900 text-base">Services & Équipements inclus</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {bureau.equipments.map((eq, index) => (
                  <div
                    key={index}
                    className="text-xs font-medium text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100"
                  >
                    {eq.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module de Réservation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full lg:w-[380px] bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-24 space-y-6"
          >
            <h2 className="font-bold text-gray-900 text-lg">Réserver cet espace</h2>
            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>TARIF JOURNALIER</span>
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