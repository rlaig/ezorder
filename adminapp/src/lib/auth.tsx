import { configureAuth } from 'react-query-auth';
import { Navigate, useLocation } from 'react-router';
import { z } from 'zod';

import { paths } from '@/config/paths';
import { AuthResponse, User } from '@/types/api';

import { api } from './api-client';

// api call definitions for auth (types, schemas, requests):
// these are not part of features as this is a module shared across features

const getUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');

  return response.data;
};

const logout = (): Promise<void> => {
  return api.post('/auth/logout');
};

export const loginInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(5, 'Required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithEmailAndPassword = (data: LoginInput): Promise<AuthResponse> => {
  return api.post('/auth/login', data);
};

export const registerInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'MERCHANT']),
  // Merchant-specific fields (optional, only when role is MERCHANT)
  merchantName: z.string().optional(),
  merchantAddress: z.string().optional(),
  merchantPhone: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

const registerWithEmailAndPassword = (
  data: RegisterInput,
): Promise<AuthResponse> => {
  return api.post('/auth/register', data);
};

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => {
    const response = await loginWithEmailAndPassword(data);
    return response.user;
  },
  registerFn: async (data: RegisterInput) => {
    const response = await registerWithEmailAndPassword(data);
    return response.user;
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};

// Role-based route protection
export const RoleBasedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: ('ADMIN' | 'MERCHANT')[];
}) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  if (!allowedRoles.includes(user.data.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.data.role === 'ADMIN' 
      ? paths.admin.dashboard.getHref()
      : paths.merchant.dashboard.getHref();
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Hook to get user role and check permissions
export const useAuth = () => {
  const user = useUser();
  
  return {
    user: user.data,
    isAdmin: user.data?.role === 'ADMIN',
    isMerchant: user.data?.role === 'MERCHANT',
    isAuthenticated: !!user.data,
  };
};
