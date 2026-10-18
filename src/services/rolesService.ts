import { apiFetch } from './apiClient';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

class RolesService {
  async getRoles(): Promise<Role[]> {
    try {
      const response = await apiFetch<Role[]>('/roles');
      return response.data;
    } catch (err) {
      console.warn('[RolesService] Fallback to default roles:', err);
      return [
        {
          id: 'role-1',
          name: 'Super Admin',
          description: 'Full system control, administrative oversight, and configuration access.',
          permissions: ['all'],
          userCount: 2,
        },
        {
          id: 'role-2',
          name: 'Sales Manager',
          description: 'Manage quotes, orders, discounts, and customer billing communication.',
          permissions: ['orders.read', 'orders.write', 'requests.write', 'catalog.read'],
          userCount: 4,
        },
        {
          id: 'role-3',
          name: 'Warehouse Operator',
          description: 'Inventory adjustment, batch tracking, dispatch confirmation.',
          permissions: ['inventory.read', 'inventory.write', 'orders.read'],
          userCount: 6,
        },
      ];
    }
  }

  async getUsers(): Promise<UserAccount[]> {
    try {
      const response = await apiFetch<UserAccount[]>('/roles/users');
      return response.data;
    } catch (err) {
      console.warn('[RolesService] Fallback to default users:', err);
      return [
        { id: 'usr-1', name: 'Alhaji Musa Danjuma', email: 'admin@maritamatrading.com', role: 'Super Admin', status: 'Active' },
        { id: 'usr-2', name: 'Ngozi Okafor', email: 'sales.head@maritamatrading.com', role: 'Sales Manager', status: 'Active' },
      ];
    }
  }
}

export const rolesService = new RolesService();
