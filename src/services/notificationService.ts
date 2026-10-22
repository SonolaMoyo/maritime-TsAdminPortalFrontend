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
    try {
      const q = new URLSearchParams();
      if (unreadOnly) q.append('unreadOnly', 'true');
      if (limit) q.append('limit', limit.toString());
      const query = q.toString() ? `?${q.toString()}` : '';
      const response = await apiFetch<AppNotification[]>(`/notifications${query}`);
      return response.data || [];
    } catch (err) {
      console.warn('[NotificationService] Fallback notifications:', err);
      return [
        {
          id: 'notif-demo-1',
          title: 'Low Stock Alert',
          message: 'PowerWall 15kWh Lithium Battery is below the reorder threshold (6 remaining)',
          type: 'inventory',
          isRead: false,
          link: '/inventory',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: 'notif-demo-2',
          title: 'New Order Received',
          message: 'Order ORD-004456 submitted with total ₦15,000,000',
          type: 'order',
          isRead: false,
          link: '/orders',
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        },
      ];
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiFetch<{ unreadCount: number }>('/notifications/unread-count');
      return response.data.unreadCount ?? 0;
    } catch (err) {
      console.warn('[NotificationService] Fallback unread count:', err);
      return 2;
    }
  }

  async markAsRead(id: string): Promise<boolean> {
    try {
      await apiFetch<{ success: boolean }>(`/notifications/${id}/read`, {
        method: 'PATCH',
      });
      window.dispatchEvent(new CustomEvent('notification-updated'));
      return true;
    } catch (err) {
      console.warn('[NotificationService] Failed to mark as read:', err);
      return false;
    }
  }

  async markAllAsRead(): Promise<boolean> {
    try {
      await apiFetch<{ success: boolean }>('/notifications/mark-all-read', {
        method: 'POST',
      });
      window.dispatchEvent(new CustomEvent('notification-updated'));
      return true;
    } catch (err) {
      console.warn('[NotificationService] Failed to mark all as read:', err);
      return false;
    }
  }

  async createNotification(notif: {
    title: string;
    message: string;
    type?: string;
    link?: string;
  }): Promise<AppNotification | null> {
    try {
      const response = await apiFetch<AppNotification>('/notifications', {
        method: 'POST',
        body: JSON.stringify(notif),
      });
      window.dispatchEvent(new CustomEvent('notification-updated'));
      return response.data;
    } catch (err) {
      console.warn('[NotificationService] Failed to create notification:', err);
      return null;
    }
  }
}

export const notificationService = new NotificationService();
