"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function ReservationEtape3() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    nomComplet: "Jean-Paul Ndi",
    email: "jp.ndi@afritech.cm",
    telephone: "+237 677 889 900",
    nationalite: "Camerounaise",
    notes: "",
  });

  // État pour stocker le nom du fichier CNI importé
  const [cniFileName, setCniFileName] = useState<string | null>(null);

  // État pour le résumé du bien sélectionné
  const [bien, setBien] = useState({
    titre: "Chambre VIP Émeraude",
    prixNuite: 85000,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=200&q=80"
  });

  useEffect(() => {
    // 1. Récupérer le bien choisi à l'étape 1
    const storedBien = localStorage.getItem("reservation_bien");
    if (storedBien) {
      setBien(JSON.parse(storedBien));
    }

    // 2. Récupérer les données du formulaire si l'utilisateur revient en arrière
    const storedForm = localStorage.getItem("reservation_form");
    if (storedForm) {
      setFormData(JSON.parse(storedForm));
    }

    // 3. Récupérer l'information du fichier CNI si déjà sélectionné
    const storedCni = localStorage.getItem("reservation_cni_name");
    if (storedCni) {
      setCniFileName(storedCni);
    }
  }, []);

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
  const totalTarif = (bien.prixNuite * nuits) + fraisService;

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 bg-white">
        
        {/* Barre de progression */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-6 text-xs font-semibold text-gray-500 bg-white">
          <span className="text-emerald-900">✓ Sélection</span>
          <span className="text-emerald-900">✓ Dates & Durée</span>
          <span className="text-emerald-950 font-bold flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-950 text-white flex items-center justify-center text-[10px]">3</span> Informations
          </span>
          <span>4 Récapitulatif</span>
          <span>5 Paiement</span>
          <span>6 Confirmation</span>
        </div>

        <form onSubmit={handleNext} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white">
          {/* Formulaire éditable */}
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs">
            <h2 className="text-sm font-bold text-gray-900">Vos informations personnelles</h2>

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
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
                  cniFileName ? 'border-emerald-600 bg-emerald-50/40' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl block mb-1">{cniFileName ? '✅' : '📤'}</span>
                <p className="font-medium text-gray-700">
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
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-gray-900">Votre sélection</h3>
            <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-2xl">
              <img src={bien.image} alt={bien.titre} className="w-16 h-16 object-cover rounded-xl" />
              <div>
                <p className="font-bold text-gray-900">{bien.titre}</p>
                <p className="text-[10px] text-gray-500">Bonapriso, Douala</p>
              </div>
            </div>
            <div className="flex justify-between text-gray-600 border-t border-b border-gray-100 py-3">
              <span>Dates</span>
              <span className="font-bold text-gray-900">12 Nov - 19 Nov (7 Nuits)</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-emerald-950">
              <span>Total estimé</span>
              <span className="text-orange-700">{totalTarif.toLocaleString()} FCFA</span>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Link href="/reservation/etape-2" className="w-1/3 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors flex items-center justify-center">
                Retour
              </Link>
              <button type="submit" className="w-2/3 bg-orange-700 hover:bg-orange-800 text-white py-3 rounded-xl font-medium shadow-md transition-colors cursor-pointer">
                Continuer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}