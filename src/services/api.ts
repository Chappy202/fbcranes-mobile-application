import { API_URL } from '../config';
import { fetch } from '@tauri-apps/plugin-http';

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

// Inspection type based on the API response
export interface Inspection {
  testId: number;
  testType: number;
  certNumber: string;
  serialNo: string;
  testDate: string;
  validDate: string;
  comments: string;
  wwl: number;
  heightLength: number;
  status: string;
  tagNumber: string;
  equipDescription: string;
  inspectType: string | null;
  client: string;
  site: string;
  section: string;
  responsible: string;
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
    console.log(`Making request to: ${API_URL}${endpoint}`);
    
    // For debugging: Log platform info
    console.log('Platform:', navigator.userAgent);
    
    // Create a fetch request with Tauri's HTTP plugin
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      }
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Request failed with status ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
        console.error('API Error Response:', errorData);
      } catch (e) {
        console.error('API Error Response (raw):', errorText);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    // More detailed error logging
    console.error('API Request Error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Check if it's a TLS/SSL error
      if (error.message.includes('sending request for url') || 
          error.message.includes('certificate') ||
          error.message.includes('TLS') ||
          error.message.includes('SSL')) {
        console.error('SSL/TLS Certificate Error - Check server certificate or configure app to accept it');
        // You might need to add your server's certificate to the trusted store
        // This is a common issue with self-signed certificates on Android
      }
    }
    throw error;
  }
}

// Add a test connection function
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log(`Testing connection to: ${API_URL}`);
    const response = await fetch(`${API_URL}/health`, { method: 'GET' });
    console.log(`Test connection result: ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

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
 * Inspections service
 */
export const inspectionsService = {
  getLatestBySerialNumber: async (serialNumber: string, token: string): Promise<Inspection> => {
    return apiRequest<Inspection>(
      `/inspections/serial/${encodeURIComponent(serialNumber)}/latest`, 
      { method: 'GET' }, 
      token
    );
  },
  
  getLatestByTagNumber: async (tagNumber: string, token: string): Promise<Inspection> => {
    return apiRequest<Inspection>(
      `/inspections/tag/${encodeURIComponent(tagNumber)}/latest`, 
      { method: 'GET' }, 
      token
    );
  },
};