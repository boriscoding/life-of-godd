"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexte/AuthContext";
import { api } from "@/app/lib/api";

export default function ProfilPage() {
  const { user, updateUser } = useAuth(); // Récupération de l'utilisateur connecté depuis le contexte

  // États du formulaire de profil
  const [profile, setProfile] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    nationalite: "Camerounaise",
    adresse: "",
  });

  // États de la gestion du mot de passe
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  // Masquer / Afficher les mots de passe
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // États de chargement et retours d'information
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Pré-remplissage immédiat à partir de ce que le contexte a déjà
  // (evite un flash de champs vides pendant le chargement de /users/me).
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        nom: user.lastName || user.nom || prev.nom,
        prenom: user.firstName || user.prenom || prev.prenom,
        email: user.email || prev.email,
        telephone: user.phone || user.telephone || prev.telephone,
        nationalite: user.nationalite || prev.nationalite,
        adresse: user.adresse || prev.adresse,
      }));
    }
  }, [user]);

  // Recuperation du profil COMPLET depuis l'API au chargement de la page.
  // Necessaire car les donnees stockees en contexte apres le login sont
  // partielles (id/email/firstName/lastName uniquement) : le telephone,
  // la nationalite et l'adresse ne sont fiables qu'en les relisant ici.
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me");
        const fullUser = response.data?.data || response.data;

        if (cancelled || !fullUser) return;

        setProfile({
          nom: fullUser.lastName || "",
          prenom: fullUser.firstName || "",
          email: fullUser.email || "",
          telephone: fullUser.phone || "",
          nationalite: fullUser.nationalite || "Camerounaise",
          adresse: fullUser.adresse || "",
        });

        // Garde le contexte global synchronise (utile pour l'avatar/nav, etc.)
        if (updateUser) {
          updateUser(fullUser);
        }
      } catch (err) {
        // Silencieux : si /users/me echoue (ex: session expiree), le
        // formulaire reste pre-rempli avec ce qu'avait deja le contexte.
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calcul des initiales pour l'avatar
  const getInitials = () => {
    const firstInitial = profile.prenom ? profile.prenom.trim()[0] : "";
    const lastInitial = profile.nom ? profile.nom.trim()[0] : "";
    return (firstInitial + lastInitial).toUpperCase() || "U";
  };

  // Enregistrement des informations personnelles
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMessage(null);

    const payload = {
      firstName: profile.prenom,
      lastName: profile.nom,
      email: profile.email,
      phone: profile.telephone,
      nationalite: profile.nationalite,
      adresse: profile.adresse,
    };

    try {
      // Endpoint reel : PATCH /api/v1/users/me
      const response = await api.patch("/users/me", payload);
      const updatedUser = response.data?.data || response.data;

      // Mise à jour locale dans le contexte si la méthode existe
      if (updateUser) {
        updateUser(updatedUser);
      }

      setProfileMessage({
        type: "success",
        text: "Profil mis à jour avec succès !",
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Erreur lors de la mise à jour du profil.";
      setProfileMessage({ type: "error", text: errorMsg });
    } finally {
      setLoadingProfile(false);
    }
  };

  // Enregistrement du nouveau mot de passe
  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (passwords.newPass !== passwords.confirm) {
      setPasswordMessage({
        type: "error",
        text: "Les nouveaux mots de passe ne correspondent pas.",
      });
      return;
    }

    if (passwords.newPass.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "Le mot de passe doit contenir au moins 8 caractères.",
      });
      return;
    }

    if (passwords.newPass === passwords.current) {
      setPasswordMessage({
        type: "error",
        text: "Le nouveau mot de passe doit être différent de l'ancien.",
      });
      return;
    }

    setLoadingPassword(true);

    try {
      // Endpoint reel : POST /api/v1/auth/change-password (pas PUT)
      await api.post("/auth/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });

      setPasswordMessage({
        type: "success",
        text: "Mot de passe modifié avec succès !",
      });

      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Erreur lors de la modification du mot de passe.";
      setPasswordMessage({ type: "error", text: errorMsg });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="p-4 space-y-6 sm:p-8 sm:space-y-8 lg:p-12 max-w-7xl mx-auto">
      {/* En-tête */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-emerald-950 sm:text-2xl">
          Mon profil
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Gérez vos informations personnelles et configurez la sécurité de votre compte.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 lg:items-start">
        {/* Informations personnelles */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-6 sm:p-8">
          <h2 className="text-sm font-bold text-gray-900">
            Informations personnelles
          </h2>

          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-4 pb-4 border-b border-gray-100 text-center sm:flex-row sm:text-left">
            <div className="w-16 h-16 shrink-0 rounded-full bg-emerald-100 text-emerald-950 flex items-center justify-center font-bold text-lg shadow-sm">
              {getInitials()}
            </div>
            <div>
              <button
                type="button"
                className="px-4 py-2 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-xs font-medium transition-colors shadow-sm"
              >
                Télécharger une photo
              </button>
              <p className="text-[10px] text-gray-400 mt-1.5">
                PNG, JPG ou JPEG. Maximum 2MB.
              </p>
            </div>
          </div>

          {/* Message de notification du profil */}
          {profileMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-medium border ${
                profileMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                  : "bg-red-50 border-red-100 text-red-600"
              }`}
            >
              {profileMessage.text}
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">
                  Nom
                </label>
                <input
                  type="text"
                  required
                  value={profile.nom}
                  onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 outline-none focus:border-emerald-900"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">
                  Prénom
                </label>
                <input
                  type="text"
                  required
                  value={profile.prenom}
                  onChange={(e) => setProfile({ ...profile, prenom: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 outline-none focus:border-emerald-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 outline-none focus:border-emerald-900"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">
                  Téléphone
                </label>
                <input
                  type="text"
                  value={profile.telephone}
                  onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
                  placeholder="+237 6XX XX XX XX"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 outline-none focus:border-emerald-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">
                  Nationalité
                </label>
                <input
                  type="text"
                  value={profile.nationalite}
                  onChange={(e) => setProfile({ ...profile, nationalite: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 outline-none focus:border-emerald-900"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">
                  Adresse de résidence
                </label>
                <input
                  type="text"
                  value={profile.adresse}
                  onChange={(e) => setProfile({ ...profile, adresse: e.target.value })}
                  placeholder="Ex: Akwa, Douala"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 outline-none focus:border-emerald-900"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-center sm:justify-end">
              <button
                type="submit"
                disabled={loadingProfile}
                className="w-full bg-emerald-950 hover:bg-emerald-900 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-colors disabled:opacity-50 sm:w-auto"
              >
                {loadingProfile ? "Sauvegarde..." : "Sauvegarder les modifications"}
              </button>
            </div>
          </form>
        </div>

        {/* Changer de mot de passe */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-6 sm:p-8">
          <h2 className="text-sm font-bold text-gray-900">
            Changer de mot de passe
          </h2>

          {/* Message de notification du mot de passe */}
          {passwordMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-medium border ${
                passwordMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                  : "bg-red-50 border-red-100 text-red-600"
              }`}
            >
              {passwordMessage.text}
            </div>
          )}

          <form onSubmit={handlePasswordSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">
                Mot de passe actuel
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  placeholder="Saisissez votre mot de passe"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-20 text-gray-800 outline-none focus:border-emerald-900"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 hover:text-emerald-950 uppercase"
                >
                  {showCurrentPassword ? "MASQUER" : "AFFICHER"}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  placeholder="Créer un nouveau mot de passe"
                  value={passwords.newPass}
                  onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-20 text-gray-800 outline-none focus:border-emerald-900"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 hover:text-emerald-950 uppercase"
                >
                  {showNewPassword ? "MASQUER" : "AFFICHER"}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-600 mb-1.5 uppercase tracking-wider text-[10px]">
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirmez à nouveau"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-20 text-gray-800 outline-none focus:border-emerald-900"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 hover:text-emerald-950 uppercase"
                >
                  {showConfirmPassword ? "MASQUER" : "AFFICHER"}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loadingPassword}
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 py-3 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50"
              >
                {loadingPassword ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}