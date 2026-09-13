"use client";

import { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { Permission } from "../lib/auth";
import { useAuth } from "../lib/auth-context";

export default function RequirePermission({
  permission,
  children,
}: {
  permission: Permission;
  children: ReactNode;
}) {
  const { can, user } = useAuth();

  if (user && can(permission)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-5 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fbe7e4] text-em-red">
        <ShieldAlert size={26} />
      </div>
      <h1 className="font-display text-xl font-semibold text-em-text">Accès restreint</h1>
      <p className="max-w-sm text-sm text-em-text-muted">
        Votre rôle ne permet pas d&apos;accéder à cette section. Contactez un
        administrateur si vous pensez que c&apos;est une erreur.
      </p>
    </div>
  );
}
