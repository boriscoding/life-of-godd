"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { StepProgressBar } from "@/app/reservation/StepProgressBar";
import { useAuth } from "@/app/contexte/AuthContext";
import { getBienSelection, type BienSelection } from "@/app/lib/reservation";

export default function ReservationEtape3() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Le layout app/reservation/layout.tsx garantit qu'on arrive ici connecté.
  const { user } = useAuth();

  // État pour les données du formulaire. On ne met plus de valeurs "mock"
  // en dur : elles sont pré-remplies depuis le compte du client connecté
  // (voir useEffect ci-dessous), et restent modifiables par l'utilisateur.
  const [formData, setFormData] = useState({
    nomComplet: "",
    email: "",
    telephone: "",
    nationalite: "",
    adresse: "",
    nombreVoyageurs: "2",
    notes: "",
  });

  // État pour stocker le nom du fichier CNI importé
  const [cniFileName, setCniFileName] = useState<string | null>(null);

  // État pour le résumé du bien sélectionné (le vrai bien choisi sur la
  // fiche détail, avec son id réel — plus de valeurs statiques ici).
  const [bien, setBien] = useState<BienSelection | null>(null);

  useEffect(() => {
    // 1. Récupérer le bien choisi précédemment (fiche détail)
    setBien(getBienSelection());

    // 2. Pré-remplissage : priorité aux données déjà saisies par
    //    l'utilisateur s'il revient en arrière, sinon on utilise son profil
    //    client (nom, email, téléphone) récupéré via useAuth().
    const storedForm = localStorage.getItem("reservation_form");
    if (storedForm) {
      setFormData(JSON.parse(storedForm));
      return;
    }

    if (user) {
      const nomComplet =
        user.name ||
        [user.firstName ?? user.prenom, user.lastName ?? user.nom]
          .filter(Boolean)
          .join(" ") ||
        "";

      setFormData((prev) => ({
        ...prev,
        nomComplet,
        email: user.email || "",
        telephone: user.phone || "",
        nationalite: user.nationalite || "",
        adresse: user.adresse || "",
      }));
    }

    // 3. Récupérer l'information du fichier CNI si déjà sélectionné
    const storedCni = localStorage.getItem("reservation_cni_name");
    if (storedCni) {
      setCniFileName(storedCni);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    localStorage.setItem("reservation_form", JSON.stringify(updatedForm));
  };

  // Gestion de la sélection du fichier CNI
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCniFileName(file.name);
      localStorage.setItem("reservation_cni_name", file.name);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/reservation/etape-4");
  };

  const nuits = 7;
  const fraisService = 25000;
  const prixNuite = bien?.prixNuite || 0;
  const totalTarif = prixNuite * nuits + fraisService;

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 bg-white sm:px-6 sm:py-8 sm:space-y-8">

        <StepProgressBar current={3} />

        <form onSubmit={handleNext} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start bg-white">
          {/* Formulaire éditable */}
          <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs sm:p-8">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Vos informations personnelles</h2>
              <p className="text-[11px] text-gray-400 mt-1">
                Pré-remplies depuis votre compte, vous pouvez les corriger si besoin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Nom Complet *</label>
                <input
                  type="text"
                  name="nomComplet"
                  value={formData.nomComplet}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-900 font-medium text-gray-800"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Adresse Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-900 font-medium text-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Numéro de Téléphone *</label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-900 font-medium text-gray-800"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Nationalité *</label>
                <input
                  type="text"
                  name="nationalite"
                  value={formData.nationalite}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-900 font-medium text-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Nombre de voyageurs *</label>
                <input
                  type="number"
                  name="nombreVoyageurs"
                  value={formData.nombreVoyageurs}
                  onChange={handleChange}
                  min={1}
                  max={20}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-900 font-medium text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Adresse</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                placeholder="Quartier, ville, pays"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-900 font-medium text-gray-800"
              />
            </div>

            {/* Section Upload CNI Fonctionnelle */}
            <div>
              <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Pièce d'identité (CNI ou Passeport) *</label>

              {/* Input file caché */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf, .jpg, .jpeg, .png"
                className="hidden"
              />

              {/* Zone cliquable connectée à l'input */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer sm:p-8 ${
                  cniFileName ? 'border-emerald-600 bg-emerald-50/40' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl block mb-1">{cniFileName ? '✅' : '📤'}</span>
                <p className="font-medium text-gray-700 break-words">
                  {cniFileName ? `Fichier sélectionné : ${cniFileName}` : "Cliquez pour télécharger ou glissez-déposez"}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {cniFileName ? "Cliquez de nouveau pour changer de fichier" : "PDF, JPG, PNG (Max. 5 Mo)"}
                </p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-600 mb-1 uppercase tracking-wider text-[10px]">Demandes spéciales / Notes de voyage</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optionnel: Veuillez spécifier si vous avez besoin d'un transfert aéroport..."
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-900 font-medium text-gray-800 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Résumé latéral dynamique */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs sm:p-6">
            <h3 className="font-bold text-sm text-gray-900">Votre sélection</h3>
            {bien ? (
              <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-2xl">
                <img src={bien.image} alt={bien.nom} className="w-16 h-16 shrink-0 object-cover rounded-xl" />
                <div>
                  <p className="font-bold text-gray-900">{bien.nom}</p>
                  <p className="text-[10px] text-gray-500">Douala</p>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-gray-400">
                Aucun bien sélectionné. Retournez à une fiche pour en choisir un.
              </p>
            )}
            <div className="flex justify-between text-gray-600 border-t border-b border-gray-100 py-3 gap-2">
              <span>Dates</span>
              <span className="font-bold text-gray-900 text-right">12 Nov - 19 Nov (7 Nuits)</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-emerald-950">
              <span>Total estimé</span>
              <span className="text-orange-700">{totalTarif.toLocaleString()} FCFA</span>
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <Link href="/reservation/etape-2" className="sm:w-1/3 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors flex items-center justify-center">
                Retour
              </Link>
              <button type="submit" className="sm:w-2/3 bg-orange-700 hover:bg-orange-800 text-white py-3 rounded-xl font-medium shadow-md transition-colors cursor-pointer">
                Continuer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}