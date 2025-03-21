import { API_URL } from '../config';

// User type
export interface User {
  id: number;
  username: string;
  email: string | null;
  userLevel: number;
  clientId: number | null;
  siteId: number | null;
  sectionId: number | null;
}

// Auth response type
export interface AuthResponse {
  access_token: string;
  user: User;
}

// Equipment type
export interface Equipment {
  id: number;
  serialNumber: string;
  name: string;
  status: string;
  lastInspection: string;
  nextInspection: string;
  location: string;
}

/**
 * Creates headers with authorization token if available
 */
export function createHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Base API request function
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  try {
    const headers = createHeaders(token);
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * Authentication service
 */
export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};

/**
 * Equipment service
 */
export const equipmentService = {
  search: async (query: string, token: string): Promise<Equipment[]> => {
    return apiRequest<Equipment[]>(
      `/equipment/search?query=${encodeURIComponent(query)}`, 
      { method: 'GET' }, 
      token
    );
  },
  
  getBySerial: async (serialNumber: string, token: string): Promise<Equipment> => {
    return apiRequest<Equipment>(
      `/equipment/serial/${encodeURIComponent(serialNumber)}`, 
      { method: 'GET' }, 
      token
    );
  },
  
  getByNfcTag: async (tagId: string, token: string): Promise<Equipment> => {
    return apiRequest<Equipment>(
      `/equipment/nfc/${encodeURIComponent(tagId)}`, 
      { method: 'GET' }, 
      token
    );
  },
};