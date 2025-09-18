import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { paths } from '@/config/paths';
import { ProtectedRoute, RoleBasedRoute } from '@/lib/auth';

import {
  default as AppRoot,
  ErrorBoundary as AppRootErrorBoundary,
} from './routes/app/root';

import {
  default as AdminRoot,
  ErrorBoundary as AdminRootErrorBoundary,
} from './routes/admin/root';

import {
  default as MerchantRoot,
  ErrorBoundary as MerchantRootErrorBoundary,
} from './routes/merchant/root';

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./routes/landing').then(convert(queryClient)),
    },
    {
      path: paths.auth.register.path,
      lazy: () => import('./routes/auth/register').then(convert(queryClient)),
    },
    {
      path: paths.auth.login.path,
      lazy: () => import('./routes/auth/login').then(convert(queryClient)),
    },
    // Legacy app routes (redirect based on role)
    {
      path: paths.app.root.path,
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          path: paths.app.dashboard.path,
          lazy: () =>
            import('./routes/app/dashboard').then(convert(queryClient)),
        },
        {
          path: paths.app.profile.path,
          lazy: () => import('./routes/app/profile').then(convert(queryClient)),
        },
      ],
    },

    // Admin Portal Routes
    {
      path: paths.admin.root.path,
      element: (
        <RoleBasedRoute allowedRoles={['ADMIN']}>
          <AdminRoot />
        </RoleBasedRoute>
      ),
      ErrorBoundary: AdminRootErrorBoundary,
      children: [
        {
          path: paths.admin.dashboard.path,
          lazy: () =>
            import('./routes/admin/dashboard').then(convert(queryClient)),
        },
        {
          path: paths.admin.merchants.path,
          lazy: () =>
            import('./routes/admin/merchants').then(convert(queryClient)),
        },
        {
          path: paths.admin.merchant.path,
          lazy: () =>
            import('./routes/admin/merchant').then(convert(queryClient)),
        },
        {
          path: paths.admin.analytics.path,
          lazy: () =>
            import('./routes/admin/analytics').then(convert(queryClient)),
        },
        {
          path: paths.admin.settings.path,
          lazy: () =>
            import('./routes/admin/settings').then(convert(queryClient)),
        },
      ],
    },

    // Merchant Dashboard Routes
    {
      path: paths.merchant.root.path,
      element: (
        <RoleBasedRoute allowedRoles={['MERCHANT']}>
          <MerchantRoot />
        </RoleBasedRoute>
      ),
      ErrorBoundary: MerchantRootErrorBoundary,
      children: [
        {
          path: paths.merchant.dashboard.path,
          lazy: () =>
            import('./routes/merchant/dashboard').then(convert(queryClient)),
        },
        {
          path: paths.merchant.menu.path,
          lazy: () =>
            import('./routes/merchant/menu').then(convert(queryClient)),
        },
        {
          path: paths.merchant.orders.path,
          lazy: () =>
            import('./routes/merchant/orders').then(convert(queryClient)),
        },
        {
          path: paths.merchant.order.path,
          lazy: () =>
            import('./routes/merchant/order').then(convert(queryClient)),
        },
        {
          path: paths.merchant.qrCodes.path,
          lazy: () =>
            import('./routes/merchant/qr-codes').then(convert(queryClient)),
        },
        {
          path: paths.merchant.analytics.path,
          lazy: () =>
            import('./routes/merchant/analytics').then(convert(queryClient)),
        },
        {
          path: paths.merchant.settings.path,
          lazy: () =>
            import('./routes/merchant/settings').then(convert(queryClient)),
        },
      ],
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
