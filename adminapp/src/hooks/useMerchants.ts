import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MerchantService } from '../services';
import { queryKeys } from '../lib/queryClient';
import type { Merchant, PaginatedResponse } from '../types';

export const useMerchants = (page = 1, perPage = 20) => {
  return useQuery({
    queryKey: queryKeys.merchants(page),
    queryFn: (): Promise<PaginatedResponse<Merchant>> => 
      MerchantService.getAllMerchants(page, perPage),
  });
};

export const useMerchant = (id: string) => {
  return useQuery({
    queryKey: queryKeys.merchant(id),
    queryFn: (): Promise<Merchant> => MerchantService.getMerchant(id),
    enabled: !!id,
  });
};

export const useCreateMerchant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Merchant>) => MerchantService.createMerchant(data),
    onSuccess: () => {
      // Invalidate merchants list
      queryClient.invalidateQueries({
        queryKey: ['merchants'],
      });
    },
  });
};

export const useUpdateMerchant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Merchant> }) => 
      MerchantService.updateMerchant(id, data),
    onSuccess: (updatedMerchant, { id }) => {
      // Update specific merchant in cache
      queryClient.setQueryData(queryKeys.merchant(id), updatedMerchant);
      // Invalidate merchants list
      queryClient.invalidateQueries({
        queryKey: ['merchants'],
      });
    },
  });
};
