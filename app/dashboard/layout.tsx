"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../lib/auth-context";
import { MobileNavProvider } from "../lib/mobile-nav-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-em-bg" />;
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