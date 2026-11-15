const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
export const API_BASE_URL = (envUrl && !envUrl.includes('localhost'))
  ? envUrl
  : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
    ? `${window.location.protocol}//api.${window.location.hostname.replace(/^(admin|www)\./, '')}/api/v1`
    : (envUrl || 'http://localhost:5050/api/v1');

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats?: Record<string, any>;
  message?: string;
  error?: {
    code?: string;
    message: string;
    details?: any[];
  };
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Token retrieval if stored
  const token = localStorage.getItem('auth_token') || localStorage.getItem('maritama_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('maritama_token');
    localStorage.removeItem('maritime_user');
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  let json: ApiResponse<T>;
  try {
    json = await response.json();
  } catch {
    throw new Error(`Request failed with status ${response.status}: ${response.statusText || 'Unable to parse server response'}`);
  }

  if (!response.ok || json.success === false) {
    const errorMsg = json.error?.message || json.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return json;
}
