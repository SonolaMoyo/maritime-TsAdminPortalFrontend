import { apiFetch } from './apiClient';

export interface AppNotification {
  id: string;
  userId?: string | null;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'request' | 'system' | string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

class NotificationService {
  async getNotifications(unreadOnly = false, limit = 20): Promise<AppNotification[]> {
    const q = new URLSearchParams();
    if (unreadOnly) q.append('unreadOnly', 'true');
    if (limit) q.append('limit', limit.toString());
    const query = q.toString() ? `?${q.toString()}` : '';
    const response = await apiFetch<AppNotification[]>(`/notifications${query}`);
    return response.data || [];
  }

  async getUnreadCount(): Promise<number> {
    const response = await apiFetch<{ unreadCount: number }>('/notifications/unread-count');
    return response.data?.unreadCount ?? 0;
  }

  async markAsRead(id: string): Promise<boolean> {
    await apiFetch<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('notification-updated'));
    }
    return true;
  }

  async markAllAsRead(): Promise<boolean> {
    await apiFetch<{ success: boolean }>('/notifications/mark-all-read', {
      method: 'POST',
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('notification-updated'));
    }
    return true;
  }

  async createNotification(notif: {
    title: string;
    message: string;
    type?: string;
    link?: string;
  }): Promise<AppNotification | null> {
    const response = await apiFetch<AppNotification>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notif),
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('notification-updated'));
    }
    return response.data;
  }
}

export const notificationService = new NotificationService();
