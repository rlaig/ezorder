import { useState, useEffect, createContext, useContext } from 'react';
import { AuthService } from '../services';
import type { AuthState } from '../types';

// Auth Context
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth hook with state management
export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Initialize auth state on mount
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      if (AuthService.isAuthenticated()) {
        const user = await AuthService.refreshAuth();
        setAuthState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const user = await AuthService.login({ email, password });
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state even if logout fails
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const user = await AuthService.refreshAuth();
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    } catch (error) {
      console.error('Auth refresh error:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  return {
    ...authState,
    login,
    logout,
    refreshAuth,
  };
};
