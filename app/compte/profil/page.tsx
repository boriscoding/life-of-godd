"use client";

import { useState } from "react";

export default function ProfilPage() {
  const [profile, setProfile] = useState({
    nom: "Ngassa",
    prenom: "Jean-Pierre",
    email: "jean-pierre.ngassa@domain.com",
    telephone: "+237 677 889 900",
    nationalite: "Camerounaise",
    adresse: "Bonapriso, Douala",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profil mis à jour avec succès !");
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mot de passe modifié avec succès !");
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-8">
      
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-emerald-950">Mon profil</h1>
        <p className="text-xs text-gray-500 mt-1">Gérez vos informations personnelles et configurez la sécurité de votre compte.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Informations personnelles */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-gray-900">Informations personnelles</h2>

          {/* Avatar upload */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-950 flex items-center justify-center font-bold text-lg shadow-sm">
              JP
            </div>
            <div>
              <button className="px-4 py-2 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs font-medium transition-colors shadow-sm">
                Télécharger une photo
              </button>
              <p className="text-[10px] text-gray-400 mt-1.5">PNG, JPG ou JPEG. Maximum 2MB.</p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">Nom</label>
                <input 
                  type="text" 
                  value={profile.nom} 
                  onChange={(e) => setProfile({...profile, nom: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 outline-none focus:border-emerald-900"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">Prénom</label>
                <input 
                  type="text" 
                  value={profile.prenom} 
                  onChange={(e) => setProfile({...profile, prenom: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 outline-none focus:border-emerald-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">Email</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 outline-none focus:border-emerald-900"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">Téléphone</label>
                <input 
                  type="text" 
                  value={profile.telephone} 
                  onChange={(e) => setProfile({...profile, telephone: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 outline-none focus:border-emerald-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">Nationalité</label>
                <input 
                  type="text" 
                  value={profile.nationalite} 
                  onChange={(e) => setProfile({...profile, nationalite: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 outline-none focus:border-emerald-900"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">Adresse de résidence</label>
                <input 
                  type="text" 
                  value={profile.adresse} 
                  onChange={(e) => setProfile({...profile, adresse: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 outline-none focus:border-emerald-900"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="bg-emerald-950 hover:bg-emerald-900 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-colors">
                Sauvegarder les modifications
              </button>
            </div>
          </form>
        </div>

        {/* Changer de mot de passe */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-gray-900">Changer de mot de passe</h2>

          <form onSubmit={handlePasswordSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">Mot de passe actuel</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Saisissez votre mot de passe"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-16 text-gray-800 outline-none focus:border-emerald-900"
                />
                <span className="absolute right-3 top-3 text-[10px] font-bold text-gray-400 cursor-pointer">AFFICHER</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">Nouveau mot de passe</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Créer un nouveau mot de passe"
                  value={passwords.newPass}
                  onChange={(e) => setPasswords({...passwords, newPass: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-16 text-gray-800 outline-none focus:border-emerald-900"
                />
                <span className="absolute right-3 top-3 text-[10px] font-bold text-gray-400 cursor-pointer">AFFICHER</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">Confirmer le nouveau mot de passe</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Confirmez à nouveau"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-16 text-gray-800 outline-none focus:border-emerald-900"
                />
                <span className="absolute right-3 top-3 text-[10px] font-bold text-gray-400 cursor-pointer">AFFICHER</span>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 py-3 rounded-xl font-medium transition-colors shadow-sm">
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}