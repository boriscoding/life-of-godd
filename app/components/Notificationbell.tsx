"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import {
  fetchNotifications,
  markNotificationAsRead,
  type NotificationItem,
} from "@/app/lib/notifications";

/**
 * Cloche de notifications à insérer dans Topbar.tsx, par exemple :
 *   import NotificationBell from "@/app/components/NotificationBell";
 *   ...
 *   <NotificationBell />
 *
 * Composant autonome : ne dépend d'aucun composant interne non fourni,
 * uniquement de app/lib/notifications.ts.
 */
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = items.filter((n) => n.status !== "read").length;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchNotifications(1, 10);
      setItems(res.data);
    } catch {
      // silencieux : la cloche ne doit pas casser le reste du header
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Rafraîchissement léger toutes les 60s, sans dépendance à un système
    // de websocket / push temps réel (non disponible côté backend).
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, status: "read" } : n)));
    try {
      await markNotificationAsRead(id);
    } catch {
      load(); // resynchronise si l'appel a échoué
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-em-border bg-white text-em-text-muted hover:bg-em-bg"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-em-red px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-em-border bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-em-border px-4 py-3">
            <span className="text-sm font-semibold text-em-text">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs text-em-text-muted">{unreadCount} non lue(s)</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && items.length === 0 && (
              <div className="px-4 py-6 text-center text-xs text-em-text-muted">Chargement...</div>
            )}

            {!loading && items.length === 0 && (
              <div className="px-4 py-6 text-center text-xs text-em-text-muted">
                Aucune notification.
              </div>
            )}

            {items.map((n) => {
              const isUnread = n.status !== "read";
              return (
                <button
                  key={n.id}
                  onClick={() => isUnread && handleMarkAsRead(n.id)}
                  className={`block w-full border-b border-em-border px-4 py-3 text-left last:border-b-0 hover:bg-em-bg ${
                    isUnread ? "bg-em-accent/5" : ""
                  }`}
                >
                  {n.subject && <p className="text-xs font-semibold text-em-text">{n.subject}</p>}
                  <p className="mt-0.5 line-clamp-2 text-xs text-em-text-muted">{n.content}</p>
                </button>
              );
            })}
          </div>

          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="block border-t border-em-border px-4 py-2.5 text-center text-xs font-medium text-em-accent hover:bg-em-bg"
          >
            Voir toutes les notifications
          </Link>
        </div>
      )}
    </div>
  );
}