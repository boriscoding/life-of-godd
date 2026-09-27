"use client";

import { ShieldAlert } from "lucide-react";
import { Permission } from "../lib/auth";
// ❌ Supprimé l'espace superflue dans le chemin
// ✅ Utilisé l'alias d'import Next.js pour éviter les erreurs de chemin relatif
import { useAuth } from "@/app/contexte/AuthContext";

interface RequirePermissionProps {
  permission?: Permission;
  children: React.ReactNode;
}

export default function RequirePermission({ permission, children }: RequirePermissionProps) {
  const { can } = useAuth();

  if (permission && !can(permission)) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 text-red-700 rounded-lg border border-red-200">
        <ShieldAlert className="w-12 h-12 mb-3 text-red-500" />
        <h3 className="text-lg font-bold">Accès non autorisé</h3>
        <p className="text-sm text-red-600 mt-1">
          Vous n'avez pas la permission nécessaire pour accéder à cette section.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}