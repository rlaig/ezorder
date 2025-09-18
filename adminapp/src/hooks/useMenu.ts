import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MerchantService } from '../services';
import { queryKeys } from '../lib/queryClient';
import type { Database } from '../types/database';

export const useMenuCategories = (merchantId: string) => {
  return useQuery({
    queryKey: queryKeys.menuCategories(merchantId),
    queryFn: (): Promise<Database.MenuCategories[]> => 
      MerchantService.getMenuCategories(merchantId),
    enabled: !!merchantId,
  });
};

export const useMenuItems = (merchantId: string, categoryId?: string) => {
  return useQuery({
    queryKey: queryKeys.menuItems(merchantId, categoryId),
    queryFn: (): Promise<Database.MenuItems[]> => 
      MerchantService.getMenuItems(merchantId, categoryId),
    enabled: !!merchantId,
  });
};

export const useCreateMenuCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Database.MenuCategories>) => 
      MerchantService.createMenuCategory(data),
    onSuccess: (newCategory) => {
      // Invalidate menu categories for this merchant
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuCategories(newCategory.merchant_id),
      });
    },
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Database.MenuItems>) => 
      MerchantService.createMenuItem(data),
    onSuccess: (newItem) => {
      // Invalidate menu items for this merchant
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuItems(newItem.merchant_id),
      });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Database.MenuItems> }) => 
      MerchantService.updateMenuItem(id, data),
    onSuccess: (updatedItem) => {
      // Invalidate menu items for this merchant
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuItems(updatedItem.merchant_id),
      });
    },
  });
};
