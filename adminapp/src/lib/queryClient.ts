import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error && typeof error === 'object' && 'status' in error) {
          return ![401, 403, 404].includes(error.status as number) && failureCount < 3;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

// Query Keys
export const queryKeys = {
  // Auth
  currentUser: ['auth', 'currentUser'] as const,
  
  // Merchants
  merchants: (page?: number) => ['merchants', { page }] as const,
  merchant: (id: string) => ['merchants', id] as const,
  
  // Menu
  menuCategories: (merchantId: string) => ['menu', 'categories', merchantId] as const,
  menuItems: (merchantId: string, categoryId?: string) => 
    ['menu', 'items', merchantId, { categoryId }] as const,
  
  // Orders
  orders: (merchantId: string, status?: string, page?: number) => 
    ['orders', merchantId, { status, page }] as const,
  order: (id: string) => ['orders', id] as const,
  orderStats: (merchantId: string, startDate?: string, endDate?: string) => 
    ['orders', 'stats', merchantId, { startDate, endDate }] as const,
  
  // QR Codes
  qrCodes: (merchantId: string) => ['qrCodes', merchantId] as const,
} as const;
