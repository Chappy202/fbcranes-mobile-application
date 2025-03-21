import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AUTH_STORAGE_KEY } from '../config';
import { authService, User } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to store/retrieve auth data from localStorage
function getStoredAuth(): { token: string | null; user: User | null } {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }
  
  try {
    const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedData) {
      const { token, user } = JSON.parse(storedData);
      return { token, user };
    }
  } catch (err) {
    console.error('Error retrieving stored auth data:', err);
  }
  
  return { token: null, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(getStoredAuth().user);
  const [token, setToken] = useState<string | null>(getStoredAuth().token);

  // Derive isAuthenticated from the token
  const isAuthenticated = !!token;

  // Store auth data in localStorage when it changes
  useEffect(() => {
    if (token && user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [token, user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.login(username, password);
      
      setToken(data.access_token);
      setUser(data.user);
      setLoading(false);
      return true;
    } catch (err) {
      // Enhanced error handling to capture more details
      let errorMessage = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        // Get the full error message and append any additional details
        errorMessage = err.message;
        
        // Include stack trace in development mode if available
        if (err.stack) {
          console.error('Full error stack:', err.stack);
        }
        
        // If error has additional response details from our API
        const anyErr = err as any;
        if (anyErr.response) {
          errorMessage += ` (Status: ${anyErr.response.status})`;
        }
      } else {
        // For non-Error objects, stringify them for display
        try {
          errorMessage = `Unknown error: ${JSON.stringify(err)}`;
        } catch {
          errorMessage = `Unknown error type: ${typeof err}`;
        }
      }
      
      console.error('Login error details:', errorMessage, err);
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        token, 
        login, 
        logout, 
        loading,
        error 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 