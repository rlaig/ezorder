export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'merchant';
  avatar?: string;
  created: string;
  updated: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  role: 'admin' | 'merchant';
}
