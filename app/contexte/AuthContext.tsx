"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/app/lib/api";

export interface UserSession {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  nom?: string;
  prenom?: string;
  initiales?: string;
  phone?: string;
  role?: string;
  nationalite?: string;
  adresse?: string;
}

interface AuthContextType {
  user: UserSession | null;
  login: (token: string, userData: Partial<UserSession>) => void;
  loginSession: (userData: UserSession) => void;
  logoutSession: () => void;
  logout: () => void; // Alias requis par le Sidebar
  updateUser: (data: Partial<UserSession>) => void;
  can: (permission: string) => boolean; // Fonction de vérification des droits
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Extrait un slug de role exploitable, que la source soit :
// - l'API reelle (/users/me), qui renvoie role comme un OBJET { id, name, slug }
//   via l'include Prisma ;
// - le flux de connexion "mock" (PREDEFINED_USERS), qui passe role comme une
//   simple STRING ("ADMIN", "HOST", "CLIENT").
// Ne JAMAIS defaulter sur "ADMIN" en l'absence de role : ca donnerait les
// droits admin a n'importe quel utilisateur dont le role est manquant/mal
// forme. Le defaut le plus sur est le role le moins privilegie.
function extractRoleSlug(rawRole: unknown): string {
  if (!rawRole) return "client";

  if (typeof rawRole === "string") {
    return rawRole.toLowerCase();
  }

  if (typeof rawRole === "object" && rawRole !== null) {
    const slug = (rawRole as { slug?: string; name?: string }).slug
      ?? (rawRole as { slug?: string; name?: string }).name;
    return slug ? slug.toLowerCase() : "client";
  }

  return "client";
}

// Mappe et sécurise les données utilisateur (y compris nom et initiales pour la Sidebar)
function mapApiUserToSession(apiUser: any): UserSession {
  const firstName = apiUser.firstName || apiUser.prenom || "";
  const lastName = apiUser.lastName || apiUser.nom || "";
  const fullName = apiUser.name || `${firstName} ${lastName}`.trim() || apiUser.email || "Utilisateur";

  const initiales = apiUser.initiales ||
    (firstName && lastName
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : fullName.substring(0, 2).toUpperCase());

  return {
    id: String(apiUser.id || "1"),
    email: apiUser.email || "",
    firstName,
    lastName,
    name: fullName,
    nom: lastName || fullName,
    prenom: firstName,
    initiales,
    phone: apiUser.phone || apiUser.telephone || "",
    role: extractRoleSlug(apiUser.role),
    nationalite: apiUser.nationalite,
    adresse: apiUser.adresse,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restauration automatique de la session (F5 / Refresh)
  useEffect(() => {
    const restoreSession = async () => {
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      const accessToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/users/me");
        const apiUser = response.data?.data || response.data;

        if (apiUser?.id) {
          setUser(mapApiUserToSession(apiUser));
        }
      } catch (error) {
        if (storedUser) {
          try {
            setUser(mapApiUserToSession(JSON.parse(storedUser)));
          } catch {
            setUser(null);
          }
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (token: string, userData: Partial<UserSession>) => {
    const formattedUser = mapApiUserToSession(userData);
    setUser(formattedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(formattedUser));
    }
  };

  const loginSession = (userData: UserSession) => {
    setUser(mapApiUserToSession(userData));
  };

  const logoutSession = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  };

  const updateUser = (data: Partial<UserSession>) => {
    setUser((prev) => {
      const updated = prev ? { ...prev, ...data } : (data as UserSession);
      const formatted = mapApiUserToSession(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(formatted));
      }
      return formatted;
    });
  };

  // RBAC PROVISOIRE : le schema Prisma actuel n'a pas de table de jointure
  // Role<->Permission, donc on ne peut pas verifier un vrai `permission.slug`
  // cote backend pour l'instant. Cette fonction approxime a partir du seul
  // role de l'utilisateur.
  //
  // Regles explicites (priment sur tout le reste, y compris pour un role par
  // ailleurs "eleve" comme host) :
  // - host   : pas d'acces a l'onglet Parametres NI a l'onglet Rapports
  // - client : pas d'acces a l'onglet Parametres (mais garde Rapports)
  //
  // Le premier segment de la permission (avant les ":") represente l'onglet/
  // la section : "parametres:view" -> section "parametres".
  const can = (permission: string): boolean => {
    if (!user?.role) return false;

    const role = user.role;
    const [section] = permission.split(":");

    const deniedSectionsByRole: Record<string, string[]> = {
      host: ["parametres", "rapports"],
      client: ["parametres"],
    };

    if (deniedSectionsByRole[role]?.includes(section)) {
      return false;
    }

    // Roles a acces total (une fois les restrictions ci-dessus ecartees) :
    // admin/super_admin/manager/staff/reception ont tout, et host a tout
    // SAUF parametres/rapports (deja filtre plus haut).
    const elevatedRoles = ["admin", "super_admin", "superadmin", "manager", "staff", "reception", "host"];
    if (elevatedRoles.includes(role)) return true;

    // Role non eleve (typiquement client) : uniquement les permissions de
    // lecture. "rapports:view" passe donc ici (client y a droit), mais
    // "parametres:view" a deja ete bloque ci-dessus.
    return permission.endsWith(":view");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginSession,
        logoutSession,
        logout: logoutSession, // Alias vers logoutSession
        updateUser,
        can,
        isAuthenticated: !!user,
        isLoading,
        loading: isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};