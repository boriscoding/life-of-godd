"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { USERS, User, Permission, hasPermission } from "../lib/auth";

const STORAGE_KEY = "emeraude-admin-user-id";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (userId: string) => void;
  logout: () => void;
  can: (permission: Permission) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedId = window.localStorage.getItem(STORAGE_KEY);
    const found = USERS.find((u) => u.id === savedId) ?? null;
    setUser(found);
    setLoading(false);
  }, []);

  const login = useCallback((userId: string) => {
    const found = USERS.find((u) => u.id === userId) ?? null;
    setUser(found);
    if (found) {
      window.localStorage.setItem(STORAGE_KEY, found.id);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const can = useCallback(
    (permission: Permission) => (user ? hasPermission(user.role, permission) : false),
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}
