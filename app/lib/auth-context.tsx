"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  loginSession: (userData: User) => void;
  logoutSession: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const loginSession = (userData: User) => setUser(userData);
  const logoutSession = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loginSession,
        logoutSession,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return ctx;
}