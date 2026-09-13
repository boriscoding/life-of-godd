"use client";

import { useRouter } from "next/navigation";
import { USERS, ROLE_LABELS } from "../lib/auth";
import { useAuth } from "../lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  function handleSelect(userId: string) {
    login(userId);
    // Redirige vers le tableau de bord après connexion
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-em-bg px-5">
      <div className="w-full max-w-md rounded-xl border border-em-border bg-em-card p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-em-accent font-display text-lg font-semibold text-white">
            RÉ
          </div>
          <div>
            <p className="font-display text-lg leading-tight text-em-text">Émeraude</p>
            <p className="text-[11px] tracking-wide text-em-accent">ESPACE ADMIN</p>
          </div>
        </div>

        <h1 className="font-display text-xl font-semibold text-em-text">Connexion</h1>
        <p className="mt-1 text-sm text-em-text-muted">
          Sélectionnez un compte pour accéder à l&apos;espace admin. Cet écran simule la
          connexion en attendant le vrai système d&apos;authentification du backend.
        </p>

        <div className="mt-6 space-y-2.5">
          {USERS.map((u) => (
            <button
              key={u.id}
              onClick={() => handleSelect(u.id)}
              className="flex w-full items-center gap-3 rounded-lg border border-em-border bg-white px-4 py-3 text-left transition-colors hover:border-em-accent hover:bg-em-accent/5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-em-sidebar text-sm font-semibold text-white">
                {u.initiales}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-em-text">{u.nom}</span>
                <span className="block truncate text-xs text-em-text-muted">
                  {ROLE_LABELS[u.role]} · {u.email}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}