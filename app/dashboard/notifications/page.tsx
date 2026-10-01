"use client";

import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import Badge from "../../components/Badge";
import RequirePermission from "../../components/RequirePermission";
import {
  fetchNotifications,
  markNotificationAsRead,
  type NotificationItem,
} from "@/app/lib/notifications";
import { Bell, Mail, MessageSquare, Smartphone, CheckCheck, Loader2 } from "lucide-react";

const typeIcon: Record<string, any> = {
  email: Mail,
  sms: Smartphone,
  whatsapp: MessageSquare,
  push: Bell,
};

const typeLabel: Record<string, string> = {
  email: "E-mail",
  sms: "SMS",
  whatsapp: "WhatsApp",
  push: "Push",
};

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH} h`;
  const diffJ = Math.round(diffH / 24);
  if (diffJ < 7) return `Il y a ${diffJ} j`;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const load = async (targetPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchNotifications(targetPage, 20);
      setItems(res.data);
      setTotalPages(res.meta.totalPages || 1);
      setPage(res.meta.page || targetPage);
    } catch (err: any) {
      setError(err.response?.data?.message || "Impossible de charger les notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAsRead = async (id: string) => {
    setMarkingId(id);
    try {
      await markNotificationAsRead(id);
      setItems((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: "read", readAt: new Date().toISOString() } : n
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Impossible de marquer cette notification comme lue.");
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = items.filter((n) => n.status !== "read");
    if (unread.length === 0) return;
    await Promise.all(unread.map((n) => markNotificationAsRead(n.id).catch(() => null)));
    setItems((prev) =>
      prev.map((n) => ({ ...n, status: "read", readAt: n.readAt ?? new Date().toISOString() }))
    );
  };

  const visibleItems = onlyUnread ? items.filter((n) => n.status !== "read") : items;
  const unreadCount = items.filter((n) => n.status !== "read").length;

  return (
    <RequirePermission permission="notifications:view">
      <Topbar title="Notifications" />

      <div className="space-y-5 px-5 pb-10 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-em-text">Centre de notifications</h2>
            <p className="text-sm text-em-text-muted">
              {unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : "Vous êtes à jour."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-em-text-muted">
              <input
                type="checkbox"
                checked={onlyUnread}
                onChange={(e) => setOnlyUnread(e.target.checked)}
                className="h-4 w-4 rounded border-em-border accent-em-accent"
              />
              Non lues uniquement
            </label>
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 rounded-lg border border-em-border bg-white px-3.5 py-2 text-sm font-medium text-em-text hover:bg-em-bg disabled:opacity-50"
            >
              <CheckCheck size={16} />
              Tout marquer comme lu
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="divide-y divide-em-border rounded-xl border border-em-border bg-em-card">
          {loading && (
            <div className="flex items-center justify-center gap-2 px-5 py-10 text-em-text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement des notifications...
            </div>
          )}

          {!loading && visibleItems.length === 0 && (
            <div className="px-5 py-10 text-center text-em-text-muted">
              {onlyUnread ? "Aucune notification non lue." : "Aucune notification pour l'instant."}
            </div>
          )}

          {!loading &&
            visibleItems.map((n) => {
              const Icon = typeIcon[n.type] || Bell;
              const isUnread = n.status !== "read";
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 px-5 py-4 ${isUnread ? "bg-em-accent/5" : ""}`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isUnread ? "bg-em-accent text-white" : "bg-em-bg text-em-text-muted"
                    }`}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {n.subject && (
                        <p className="truncate text-sm font-medium text-em-text">{n.subject}</p>
                      )}
                      <Badge tone={n.status === "failed" ? "red" : n.status === "read" ? "gray" : "green"}>
                        {typeLabel[n.type] || n.type}
                      </Badge>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-sm text-em-text-muted">{n.content}</p>
                    <p className="mt-1 text-xs text-em-text-muted">{formatRelativeDate(n.createdAt)}</p>
                  </div>

                  {isUnread && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      disabled={markingId === n.id}
                      className="shrink-0 whitespace-nowrap rounded-lg border border-em-border bg-white px-3 py-1.5 text-xs font-medium text-em-text hover:bg-em-bg disabled:opacity-50"
                    >
                      {markingId === n.id ? "..." : "Marquer comme lu"}
                    </button>
                  )}
                </div>
              );
            })}
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => load(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-em-border bg-white px-3 py-1.5 text-sm text-em-text disabled:opacity-40"
            >
              Précédent
            </button>
            <span className="text-sm text-em-text-muted">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => load(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-em-border bg-white px-3 py-1.5 text-sm text-em-text disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </RequirePermission>
  );
}