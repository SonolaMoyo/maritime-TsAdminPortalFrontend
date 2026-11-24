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
  status: 'Active' | 'Inactive' | string;
  lastActive?: string;
  created?: string;
  createdAt?: string;
}

class RolesService {
  async getRoles(): Promise<Role[]> {
    const response = await apiFetch<Role[]>('/roles');
    return response.data || [];
  }

  async getUsers(params?: { search?: string; role?: string; status?: string }): Promise<UserAccount[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.role) searchParams.set('role', params.role);
    if (params?.status) searchParams.set('status', params.status);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const response = await apiFetch<UserAccount[]>(`/users${query}`);
    return response.data || [];
  }

  async createUser(user: Partial<UserAccount> & { password?: string }): Promise<UserAccount> {
    const response = await apiFetch<UserAccount>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return response.data;
  }

  async updateUser(id: string, updates: Partial<UserAccount>): Promise<UserAccount> {
    const response = await apiFetch<UserAccount>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await apiFetch(`/users/${id}`, { method: 'DELETE' });
  }

  async createRole(role: Partial<Role>): Promise<Role> {
    const response = await apiFetch<Role>('/roles', {
      method: 'POST',
      body: JSON.stringify(role),
    });
    return response.data;
  }

  async updateRole(id: string, updates: Partial<Role>): Promise<Role> {
    const response = await apiFetch<Role>(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async deleteRole(id: string): Promise<void> {
    await apiFetch(`/roles/${id}`, { method: 'DELETE' });
  }
}

export const rolesService = new RolesService();
