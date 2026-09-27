"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { useAuth } from "@/app/contexte/AuthContext"; // Import unifié
import { MobileNavProvider } from "../lib/mobile-nav-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen bg-em-bg flex items-center justify-center">Chargement...</div>;
  }

  return (
    <MobileNavProvider>
      <div className="flex min-h-screen bg-em-bg">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </MobileNavProvider>
  );
}