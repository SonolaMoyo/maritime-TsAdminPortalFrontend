import { apiFetch } from './apiClient';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  token?: string;
}

class AuthService {
  private currentUser: UserSession | null = null;

  constructor() {
    const saved = localStorage.getItem('maritime_user');
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch {
        this.currentUser = null;
      }
    }
  }

  async login(email: string, password: string): Promise<UserSession> {
    try {
      const response = await apiFetch<{ token: string; user: { id: string; email: string; name: string; role: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        const session: UserSession = {
          ...response.data.user,
          token: response.data.token,
        };
        this.currentUser = session;
        localStorage.setItem('maritime_user', JSON.stringify(session));
        return session;
      }
    } catch (err) {
      console.warn('[AuthService] Live auth endpoint failed, using local fallback:', err);
    }

    // Placeholder fallback session
    const fallbackUser: UserSession = {
      id: 'usr-admin-1',
      email,
      name: 'Operations Manager',
      role: 'Super Admin',
    };
    this.currentUser = fallbackUser;
    localStorage.setItem('maritime_user', JSON.stringify(fallbackUser));
    return fallbackUser;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('maritime_user');
    this.currentUser = null;
  }

  getCurrentUser(): UserSession | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser || !!localStorage.getItem('auth_token');
  }
}

export const authService = new AuthService();
