"use client";

import { Search, Bell, MapPin, Menu } from "lucide-react";
import { useMobileNav } from "../lib/mobile-nav-context";

export default function Topbar({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { toggle } = useMobileNav();

  return (
    <header className="flex flex-col gap-4 border-b border-em-border bg-em-bg px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-start gap-3">
        <button
          onClick={toggle}
          aria-label="Ouvrir le menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-em-border bg-white text-em-text md:hidden"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-semibold text-em-text">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-em-text-muted">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-em-text-muted"
          />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-56 rounded-lg border border-em-border bg-white py-2 pl-9 pr-3 text-sm text-em-text placeholder:text-em-text-muted focus:outline-none focus:ring-2 focus:ring-em-accent/30"
          />
        </div>

        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-em-border bg-white text-em-text"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-em-accent" />
        </button>

        <div className="hidden items-center gap-1.5 text-sm text-em-text-muted md:flex">
          <MapPin size={15} className="text-em-accent" />
          Douala, Cameroun
        </div>
      </div>
    </header>
  );
}
