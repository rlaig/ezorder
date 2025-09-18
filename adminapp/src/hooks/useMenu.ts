import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MerchantService } from '../services';
import { queryKeys } from '../lib/queryClient';
import type { MenuCategory, MenuItem } from '../types';

export const useMenuCategories = (merchantId: string) => {
  return useQuery({
    queryKey: queryKeys.menuCategories(merchantId),
    queryFn: (): Promise<MenuCategory[]> => 
      MerchantService.getMenuCategories(merchantId),
    enabled: !!merchantId,
  });
};

export const useMenuItems = (merchantId: string, categoryId?: string) => {
  return useQuery({
    queryKey: queryKeys.menuItems(merchantId, categoryId),
    queryFn: (): Promise<MenuItem[]> => 
      MerchantService.getMenuItems(merchantId, categoryId),
    enabled: !!merchantId,
  });
};

export const useCreateMenuCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<MenuCategory>) => 
      MerchantService.createMenuCategory(data),
    onSuccess: (newCategory) => {
      // Invalidate menu categories for this merchant
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuCategories(newCategory.merchantId),
      });
    },
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<MenuItem>) => 
      MerchantService.createMenuItem(data),
    onSuccess: (newItem) => {
      // Invalidate menu items for this merchant
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuItems(newItem.merchantId),
      });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MenuItem> }) => 
      MerchantService.updateMenuItem(id, data),
    onSuccess: (updatedItem) => {
      // Invalidate menu items for this merchant
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuItems(updatedItem.merchantId),
      });
    },
  });
};
