import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderService } from '../services';
import { queryKeys } from '../lib/queryClient';
import type { Database, OrderStats, PaginatedResponse } from '../types';

export const useOrders = (
  merchantId: string,
  page = 1,
  perPage = 20,
  status?: Database.Orders['status']
) => {
  return useQuery({
    queryKey: queryKeys.orders(merchantId, status, page),
    queryFn: (): Promise<PaginatedResponse<Database.Orders>> => 
      OrderService.getOrders(merchantId, page, perPage, status),
    enabled: !!merchantId,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: (): Promise<Database.Orders> => OrderService.getOrder(id),
    enabled: !!id,
  });
};

export const useOrderStats = (
  merchantId: string,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: queryKeys.orderStats(merchantId, startDate, endDate),
    queryFn: (): Promise<OrderStats> => 
      OrderService.getOrderStats(merchantId, startDate, endDate),
    enabled: !!merchantId,
    staleTime: 2 * 60 * 1000, // 2 minutes for stats
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Database.Orders['status'] }) => 
      OrderService.updateOrderStatus(id, status),
    onSuccess: (updatedOrder, { id }) => {
      // Update specific order in cache
      queryClient.setQueryData(queryKeys.order(id), updatedOrder);
      
      // Invalidate orders list for this merchant
      queryClient.invalidateQueries({
        queryKey: ['orders', updatedOrder.merchant_id],
      });
      
      // Invalidate order stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.orderStats(updatedOrder.merchant_id),
      });
    },
  });
};
