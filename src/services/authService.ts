import { apiFetch } from './apiClient';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  token?: string;
  status?: string;
}

class AuthService {
  private currentUser: UserSession | null = null;

  constructor() {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('maritime_user') : null;
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch {
        this.currentUser = null;
      }
    }
  }

  async login(email: string, password: string): Promise<UserSession> {
    const response = await apiFetch<{
      token: string;
      refreshToken?: string;
      user: { id: string; email: string; name: string; role: string; status?: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response.data || !response.data.token) {
      throw new Error(response.message || 'Authentication failed: Invalid response from server');
    }

    const { token, user } = response.data;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('maritama_token', token);

    const session: UserSession = {
      ...user,
      token,
    };

    this.currentUser = session;
    localStorage.setItem('maritime_user', JSON.stringify(session));
    return session;
  }

  async getProfile(): Promise<UserSession | null> {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('maritama_token');
    if (!token) return null;

    try {
      const response = await apiFetch<UserSession>('/auth/me');
      if (response.data) {
        const session: UserSession = {
          ...response.data,
          token,
        };
        this.currentUser = session;
        localStorage.setItem('maritime_user', JSON.stringify(session));
        return session;
      }
    } catch {
      // If /auth/me fails, fallback to stored session or invalidate
    }
    return this.currentUser;
  }

  logout() {
    try {
      apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
    } catch {
      // ignore
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('maritama_token');
    localStorage.removeItem('maritime_user');
    this.currentUser = null;
  }

  getCurrentUser(): UserSession | null {
    if (!this.currentUser && typeof window !== 'undefined') {
      const saved = localStorage.getItem('maritime_user');
      if (saved) {
        try {
          this.currentUser = JSON.parse(saved);
        } catch {
          this.currentUser = null;
        }
      }
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('auth_token') || localStorage.getItem('maritama_token')) : null;
    const user = this.getCurrentUser();
    return Boolean(token && user);
  }
}

export const authService = new AuthService();
