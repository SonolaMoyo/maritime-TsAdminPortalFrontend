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
    const response = await apiFetch<Role[]>('/roles');
    return response.data || [];
  }

  async getUsers(): Promise<UserAccount[]> {
    const response = await apiFetch<UserAccount[]>('/users');
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
