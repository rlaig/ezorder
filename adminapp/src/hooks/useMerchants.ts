import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MerchantService } from '../services';
import { queryKeys } from '../lib/queryClient';
import type { Database } from '../types/database';
import type { PaginatedResponse } from '../types';

export const useMerchants = (page = 1, perPage = 20) => {
  return useQuery({
    queryKey: queryKeys.merchants(page),
    queryFn: (): Promise<PaginatedResponse<Database.Merchants>> => 
      MerchantService.getAllMerchants(page, perPage),
  });
};

export const useMerchant = (id: string) => {
  return useQuery({
    queryKey: queryKeys.merchant(id),
    queryFn: (): Promise<Database.Merchants> => MerchantService.getMerchant(id),
    enabled: !!id,
  });
};

// Type for merchant creation that includes user account data
type MerchantCreationData = {
  business_name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  gcash_number?: string;
  verifyImmediately?: boolean;
};

export const useCreateMerchant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: MerchantCreationData) => MerchantService.createMerchant(data),
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
    mutationFn: ({ id, data }: { id: string; data: Partial<Database.Merchants> }) =>
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
