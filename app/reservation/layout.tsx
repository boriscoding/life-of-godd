"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/contexte/AuthContext";

/**
 * Garde d'authentification pour tout le tunnel /reservation/*.
 * Dès qu'un visiteur non connecté atterrit ici (ex: clic sur
 * "Réserver maintenant" depuis une fiche appartement/bureau/chambre),
 * il est immédiatement renvoyé vers /connexion avec un paramètre
 * `redirect` qui le ramènera exactement où il voulait aller une fois
 * connecté (le bien déjà choisi reste dans le localStorage entre-temps).
 */
export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/connexion?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Tant qu'on ne sait pas encore si l'utilisateur est connecté (restauration
  // de session au F5), on affiche un loader plutôt que de flasher le contenu.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="h-10 w-10 border-4 border-emerald-950 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirection en cours : on n'affiche rien pour éviter le flash de contenu protégé.
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}