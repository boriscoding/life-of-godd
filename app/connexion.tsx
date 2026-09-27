"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LogoMarkIcon } from "@/app/components/icons/misc-icons";
import { useAuth } from "@/app/contexte/AuthContext";
import { api } from "@/app/lib/api";

export default function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginSession } = useAuth();

  // Page vers laquelle renvoyer l'utilisateur une fois connecté. Posée par
  // app/reservation/layout.tsx (?redirect=/reservation/etape-2, etc.) quand
  // un visiteur non connecté clique sur "Réserver maintenant". Par défaut,
  // on garde le comportement existant (tableau de bord).
  const redirectTo = searchParams.get("redirect") || "/compte/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      // Extraire les données de façon flexible (ex: { data: {...} } ou racine)
      const resData = response.data?.data || response.data;
      const accessToken = resData?.accessToken || response.data?.accessToken;
      const refreshToken = resData?.refreshToken || response.data?.refreshToken;
      const userObj = resData?.user || resData;

      // 1. Sauvegarder impérativement les jetons s'ils sont présents
      if (typeof window !== "undefined") {
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
      }

      // 2. Mettre à jour le contexte React si l'utilisateur existe.
      //    On transmet TOUT ce que l'API renvoie (téléphone, nationalité,
      //    adresse, rôle...) — pas seulement id/email/nom — sinon ces
      //    champs restent vides plus loin dans le tunnel (ex: étape 3 du
      //    formulaire de réservation qui les pré-remplit).
      if (userObj && (userObj.id || userObj._id)) {
        const userId = String(userObj.id || userObj._id);
        loginSession({
          id: userId,
          email: userObj.email || email.trim(),
          firstName: userObj.firstName || "",
          lastName: userObj.lastName || "",
          phone: userObj.phone || userObj.telephone || "",
          nationalite: userObj.nationalite || "",
          adresse: userObj.adresse || "",
        });
      }

      // 3. Redirection vers la page demandée avant la connexion
      //    (ex: retour direct sur l'étape de réservation en cours)
      router.push(redirectTo);
    } catch (err: any) {
      const backendData = err.response?.data;
      setError(
        backendData?.message ||
          backendData?.error ||
          "Email ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950 text-white shadow-md mb-4">
          <LogoMarkIcon className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-emerald-950">
          Résidence Émeraude
        </h2>
        <h1 className="text-xl font-bold text-gray-900 mt-1">Connexion</h1>
      </div>

      {error && (
        <div className="mt-6 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 text-center font-medium">
          {error}
        </div>
      )}

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Adresse Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre.email@domain.com"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 pr-20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-emerald-950"
            >
              {showPassword ? "MASQUER" : "AFFICHER"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <Link
            href="/mot-de-passe-oublie"
            className="text-orange-700 font-medium hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-950 py-3.5 text-sm font-medium text-white shadow-md hover:bg-emerald-900 disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </motion.button>
      </form>

      <p className="mt-8 text-center text-xs text-gray-600">
        Nouveau sur la plateforme ?{" "}
        <Link
          href={`/inscription?redirect=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-orange-700 hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </motion.div>
  );
}