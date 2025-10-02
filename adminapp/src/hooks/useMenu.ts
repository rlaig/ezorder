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

export const useUpdateMenuCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Database.MenuCategories> }) => 
      MerchantService.updateMenuCategory(id, data),
    onSuccess: (updatedCategory) => {
      // Invalidate menu categories for this merchant
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuCategories(updatedCategory.merchant_id),
      });
    },
  });
};

export const useDeleteMenuCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id }: { id: string; merchantId: string }) => 
      MerchantService.deleteMenuCategory(id),
    onSuccess: (_, variables) => {
      // Invalidate menu categories for this merchant
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuCategories(variables.merchantId),
      });
      // Also invalidate menu items since category deletion affects them
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuItems(variables.merchantId),
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

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id }: { id: string; merchantId: string }) => 
      MerchantService.deleteMenuItem(id),
    onSuccess: (_, variables) => {
      // Invalidate menu items for this merchant
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuItems(variables.merchantId),
      });
    },
  });
};

// Menu Modifiers hooks
export const useMenuModifiers = (itemId: string) => {
  return useQuery({
    queryKey: queryKeys.menuModifiers(itemId),
    queryFn: (): Promise<Database.MenuModifiers[]> => 
      MerchantService.getMenuModifiers(itemId),
    enabled: !!itemId,
  });
};

export const useCreateMenuModifier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Database.MenuModifiers>) => 
      MerchantService.createMenuModifier(data),
    onSuccess: (newModifier) => {
      // Invalidate menu modifiers for this item
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuModifiers(newModifier.item_id),
      });
    },
  });
};

export const useUpdateMenuModifier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Database.MenuModifiers> }) => 
      MerchantService.updateMenuModifier(id, data),
    onSuccess: (updatedModifier) => {
      // Invalidate menu modifiers for this item
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuModifiers(updatedModifier.item_id),
      });
    },
  });
};

export const useDeleteMenuModifier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id }: { id: string; itemId: string }) => 
      MerchantService.deleteMenuModifier(id),
    onSuccess: (_, variables) => {
      // Invalidate menu modifiers for this item
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuModifiers(variables.itemId),
      });
    },
  });
};

// Menu Modifier Copy hooks
export const useCopyModifiers = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ fromItemId, toItemId, modifierIds }: { 
      fromItemId: string; 
      toItemId: string; 
      modifierIds: string[] 
    }) => 
      MerchantService.copyModifiers(fromItemId, toItemId, modifierIds),
    onSuccess: (_, variables) => {
      // Invalidate menu modifiers for the target item
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuModifiers(variables.toItemId),
      });
    },
  });
};

export const useBatchCopyModifiers = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ fromItemId, toItemId, modifiersToCopy }: { 
      fromItemId: string; 
      toItemId: string; 
      modifiersToCopy: Array<{ id: string; name?: string }> 
    }) => 
      MerchantService.batchCopyModifiers(fromItemId, toItemId, modifiersToCopy),
    onSuccess: (_, variables) => {
      // Invalidate menu modifiers for the target item
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuModifiers(variables.toItemId),
      });
    },
  });
};
