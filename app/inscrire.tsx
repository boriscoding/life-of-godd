"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/contexte/AuthContext";
import { api } from "@/app/lib/api";

export default function InscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginSession } = useAuth();

  // Même logique que connexion.tsx : on ramène l'utilisateur exactement là
  // où il voulait aller (ex: reprendre le tunnel de réservation).
  const redirectTo = searchParams.get("redirect") || "/compte/dashboard";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError("Vous devez accepter les conditions générales.");
      setLoading(false);
      return;
    }

    const nameParts = formData.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || nameParts[0] || "";

    const payload: Record<string, any> = {
      firstName,
      lastName,
      email: formData.email.trim(),
      password: formData.password,
    };

    if (formData.phone.trim() !== "") {
      payload.phone = formData.phone.trim();
    }

    try {
      const response = await api.post("/auth/register", payload);

      const resData = response.data?.data || response.data;
      const accessToken = resData?.accessToken || response.data?.accessToken;
      const refreshToken = resData?.refreshToken || response.data?.refreshToken;
      const userObj = resData?.user || resData;

      // 1. Sauvegarder les tokens s'ils sont retournés lors de l'inscription (auto-connexion)
      if (typeof window !== "undefined") {
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
      }

      // 2. Mise à jour de la session et redirection
      if (accessToken) {
        if (userObj && (userObj.id || userObj._id)) {
          loginSession({
            id: String(userObj.id || userObj._id),
            email: userObj.email || formData.email.trim(),
            firstName: userObj.firstName || firstName,
            lastName: userObj.lastName || lastName,
            phone: userObj.phone || userObj.telephone || formData.phone.trim(),
            nationalite: userObj.nationalite || "",
            adresse: userObj.adresse || "",
          });
        }
        router.push(redirectTo);
      } else {
        router.push(`/connexion?registered=true&redirect=${encodeURIComponent(redirectTo)}`);
      }
    } catch (err: any) {
      const backendData = err.response?.data;

      if (backendData?.data?.errors && Array.isArray(backendData.data.errors)) {
        const errorMessages = backendData.data.errors
          .map((e: { field: string; message: string }) => e.message)
          .join(" — ");
        setError(errorMessages);
      } else {
        setError(
          backendData?.message ||
            "Une erreur est survenue lors de l'inscription."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6f8] text-gray-800 font-sans">
      <main className="flex-1 flex justify-center items-center py-12 px-4">
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-3">
              <span className="bg-[#0b3c2d] text-white font-bold text-xs px-2 py-1 rounded">
                RE
              </span>
              <span className="font-bold text-lg text-[#0b3c2d]">
                Résidence Émeraude
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
              Créer votre compte
            </h1>
            <p className="text-sm text-gray-500">
              Rejoignez Résidence Émeraude pour simplifier votre expérience
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Ex: Jean-Paul Ngassa"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c2d]/20 focus:border-[#0b3c2d] transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Adresse Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="votre.email@domain.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c2d]/20 focus:border-[#0b3c2d] transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Téléphone (Cameroun)
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+237 6XX XX XX XX"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c2d]/20 focus:border-[#0b3c2d] transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Créer un mot de passe fort"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c2d]/20 focus:border-[#0b3c2d] transition-all placeholder:text-gray-400 pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 hover:text-black tracking-wider uppercase"
                >
                  {showPassword ? "MASQUER" : "AFFICHER"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Saisissez à nouveau"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b3c2d]/20 focus:border-[#0b3c2d] transition-all placeholder:text-gray-400 pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 hover:text-black tracking-wider uppercase"
                >
                  {showConfirmPassword ? "MASQUER" : "AFFICHER"}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-3 pt-1">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0b3c2d] focus:ring-[#0b3c2d]"
              />
              <label htmlFor="acceptTerms" className="text-xs text-gray-500 leading-snug">
                J'accepte les Conditions Générales d'Utilisation et la politique de confidentialité.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#c85838] hover:bg-[#b04b2e] text-white text-sm font-semibold rounded-lg shadow transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Création du compte..." : "S'inscrire"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-600">
            Déjà inscrit ?{" "}
            <Link
              href={`/connexion?redirect=${encodeURIComponent(redirectTo)}`}
              className="font-semibold text-orange-700 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}