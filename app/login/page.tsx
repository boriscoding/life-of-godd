"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexte/AuthContext";

const PREDEFINED_USERS = [
  { id: "1", name: "Administrateur", email: "admin@liifeisgood.cm", role: "ADMIN" },
  { id: "2", name: "Hôte (Propriétaire)", email: "host@liifeisgood.cm", role: "HOST" },
  { id: "3", name: "Client (Voyageur)", email: "client@liifeisgood.cm", role: "CLIENT" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleSelect = (userId: string) => {
    const selectedUser = PREDEFINED_USERS.find((u) => u.id === userId);
    if (!selectedUser) return;

    // Enregistrement unifié dans le contexte unique
    login("mock-token-dev-123", selectedUser);

    // Redirection vers le dashboard
    router.push("/dashboard");
  };

  // ... Reste du composant JSX identique ...

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">Connexion Rapide</h1>
          <p className="text-xs text-gray-500 text-center mt-1">
            Sélectionnez un profil prédéfini pour continuer
          </p>
        </div>

        <div className="space-y-3">
          {PREDEFINED_USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelect(user.id)}
              className="w-full text-left p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all group flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-bold text-gray-800 group-hover:text-emerald-950">
                  {user.name}
                </p>
                <p className="text-[11px] text-gray-400">{user.email}</p>
              </div>
              <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 group-hover:border-emerald-300 group-hover:text-emerald-800">
                {user.role}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}