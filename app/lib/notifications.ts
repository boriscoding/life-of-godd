import { api } from "@/app/lib/api";

export type NotificationType = "email" | "sms" | "whatsapp" | "push";
export type NotificationStatus = "pending" | "sent" | "failed" | "read";

export interface NotificationItem {
  id: string;
  userId?: string | null;
  bookingId?: string | null;
  type: NotificationType;
  channel: string;
  subject?: string | null;
  content: string;
  status: NotificationStatus;
  sentAt?: string | null;
  readAt?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsPage {
  data: NotificationItem[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

/**
 * notification.controller.ts renvoie { success, message, data: { data, meta } }
 * (notificationService.list() renvoie déjà { data, meta }, empaqueté une
 * fois de plus par le controller dans son propre champ `data`). D'où le
 * double niveau ici.
 */
export async function fetchNotifications(page = 1, limit = 20): Promise<NotificationsPage> {
  const res = await api.get("/notifications", { params: { page, limit } });
  const body = res.data?.data ?? res.data;
  return {
    data: Array.isArray(body?.data) ? body.data : [],
    meta: body?.meta ?? { page, limit, total: 0, totalPages: 0 },
  };
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}