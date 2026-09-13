"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Users,
  CreditCard,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Repeat,
  X,
} from "lucide-react";
import { Permission, ROLE_LABELS } from "../lib/auth";
import { useAuth } from "../lib/auth-context";
import { useMobileNav } from "../lib/mobile-nav-context";

const nav: { href: string; label: string; icon: typeof LayoutDashboard; permission: Permission }[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, permission: "dashboard:view" },
  { href: "/dashboard/biens", label: "Gestion des Biens", icon: Building2, permission: "biens:view" },
  { href: "/dashboard/reservations", label: "Réservations", icon: CalendarCheck, permission: "reservations:view" },
  { href: "/dashboard/clients", label: "Clients", icon: Users, permission: "clients:view" },
  { href: "/dashboard/paiements", label: "Paiements", icon: CreditCard, permission: "paiements:view" },
  { href: "/dashboard/calendrier", label: "Calendrier d'occ.", icon: CalendarDays, permission: "calendrier:view" },
  { href: "/dashboard/rapports", label: "Rapports", icon: BarChart3, permission: "rapports:view" },
  { href: "/dashboard/parametres", label: "Paramètres", icon: Settings, permission: "parametres:view" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, can, logout } = useAuth();
  const { open, close } = useMobileNav();
  const router = useRouter();

  if (!user) return null;

  const visibleNav = nav.filter((item) => can(item.permission));

  function handleLogout() {
    logout();
    close();
    router.push("/login");
  }

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 px-5 pt-6 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-em-accent font-display text-lg font-semibold text-white">
          RÉ
        </div>
        <div className="flex-1">
          <p className="font-display text-lg leading-tight text-white">Émeraude</p>
          <p className="text-[11px] tracking-wide text-em-accent">ESPACE ADMIN</p>
        </div>
        <button
          onClick={close}
          aria-label="Fermer le menu"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white md:hidden"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {visibleNav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-em-accent text-white font-medium"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-em-accent text-sm font-semibold text-white">
            {user.initiales}
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm text-white">{user.nom}</p>
            <p className="truncate text-xs text-em-accent">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Link
            href="/login"
            onClick={close}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 px-2 py-1.5 text-xs text-white/75 hover:bg-white/10 hover:text-white"
          >
            <Repeat size={13} />
            Changer
          </Link>
          <button
            onClick={handleLogout}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 px-2 py-1.5 text-xs text-white/75 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={13} />
            Quitter
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: fixed sidebar, always visible */}
      <aside className="hidden md:flex md:w-64 shrink-0 flex-col bg-em-sidebar text-white/85 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile: overlay + slide-in drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-em-sidebar text-white/85 transition-transform duration-200 ease-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
}