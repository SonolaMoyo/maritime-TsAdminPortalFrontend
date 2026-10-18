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
    try {
      const response = await apiFetch<SystemSetting[]>('/settings');
      return response.data;
    } catch (err) {
      console.warn('[SettingsService] Fallback to default settings:', err);
      return [
        { key: 'company_name', value: 'Maritama Trading Co.', category: 'general', description: 'Business display title' },
        { key: 'contact_email', value: 'operations@maritamatrading.com', category: 'general', description: 'Support email' },
        { key: 'currency', value: 'USD', category: 'financial', description: 'Base operations currency' },
        { key: 'vat_percentage', value: '7.5', category: 'financial', description: 'Standard tax rate' },
      ];
    }
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
