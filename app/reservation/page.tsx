"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReservationPage() {
  const router = useRouter();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirige vers l'étape suivante (par exemple l'étape 2) ou l'étape 6 de confirmation
    router.push("/reservation/etape-6");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:p-12">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h1 className="text-xl font-bold text-emerald-950">Étape 1 : Sélection de l'hébergement</h1>
          <span className="text-xs bg-emerald-50 text-emerald-900 font-bold px-3 py-1 rounded-full">1 / 6</span>
        </div>

        <form onSubmit={handleNextStep} className="space-y-6 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-2 uppercase tracking-wider text-[10px]">
              Choisissez votre type de bien
            </label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-800 outline-none focus:border-emerald-900">
              <option>Chambre VIP Émeraude</option>
              <option>Appartement F3 Grand Standing</option>
              <option>Bureau Privé - 4 Postes</option>
            </select>
          </div>

          <div className="flex justify-between pt-4">
            <Link href="/" className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium">
              Retour à l'accueil
            </Link>
            <button type="submit" className="px-6 py-3 rounded-xl bg-emerald-950 text-white font-bold hover:bg-emerald-900 transition-colors">
              Continuer vers l'étape suivante &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}