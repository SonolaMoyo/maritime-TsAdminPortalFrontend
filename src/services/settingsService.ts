import { apiFetch } from './apiClient';

export interface SystemSetting {
  id?: string;
  key: string;
  value: string;
  description?: string;
  category: string;
}

class SettingsService {
  async getSettings(): Promise<SystemSetting[]> {
    const response = await apiFetch<SystemSetting[]>('/settings');
    return response.data || [];
  }

  async updateSetting(key: string, value: string): Promise<SystemSetting> {
    const response = await apiFetch<SystemSetting>(`/settings/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
    return response.data;
  }
}

export const settingsService = new SettingsService();
