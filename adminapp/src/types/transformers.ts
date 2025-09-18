/**
 * Type-safe transformers between Database and Frontend types
 * These functions handle field mapping and computed properties
 */

import type { Database } from './database';
import type { Frontend } from './frontend';

// Currency formatter
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};

// Time formatter
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  return date.toLocaleDateString();
};

// Database to Frontend transformers
export const transformers = {
  // User transformer
  user: {
    toFrontend: (dbUser: Database.Users): Frontend.User => ({
      id: dbUser.id,
      createdAt: dbUser.created,
      updatedAt: dbUser.updated,
      email: dbUser.email,
      name: dbUser.name,
      avatar: dbUser.avatar,
      role: dbUser.role,
      isVerified: dbUser.verified,
      displayName: dbUser.name || dbUser.email.split('@')[0],
    }),

    toDatabase: (frontendUser: Partial<Frontend.User>): Partial<Database.Users> => ({
      ...(frontendUser.name && { name: frontendUser.name }),
      ...(frontendUser.avatar && { avatar: frontendUser.avatar }),
      ...(frontendUser.role && { role: frontendUser.role }),
      ...(typeof frontendUser.isVerified === 'boolean' && { verified: frontendUser.isVerified }),
    }),
  },

  // Merchant transformer
  merchant: {
    toFrontend: (dbMerchant: Database.Merchants): Frontend.Merchant => ({
      id: dbMerchant.id,
      createdAt: dbMerchant.created,
      updatedAt: dbMerchant.updated,
      userId: dbMerchant.user_id,
      businessName: dbMerchant.business_name,
      address: dbMerchant.address,
      phone: dbMerchant.phone,
      gcashNumber: dbMerchant.gcash_number,
      status: dbMerchant.status,
      settings: dbMerchant.settings,
      displayName: dbMerchant.business_name,
      statusColor: dbMerchant.status === 'active' ? 'green' : 
                   dbMerchant.status === 'pending' ? 'yellow' : 
                   dbMerchant.status === 'suspended' ? 'red' : 'gray',
      isActive: dbMerchant.status === 'active',
    }),

    toDatabase: (frontendMerchant: Partial<Frontend.Merchant>): Partial<Database.Merchants> => ({
      ...(frontendMerchant.userId && { user_id: frontendMerchant.userId }),
      ...(frontendMerchant.businessName && { business_name: frontendMerchant.businessName }),
      ...(frontendMerchant.address && { address: frontendMerchant.address }),
      ...(frontendMerchant.phone && { phone: frontendMerchant.phone }),
      ...(frontendMerchant.gcashNumber && { gcash_number: frontendMerchant.gcashNumber }),
      ...(frontendMerchant.status && { status: frontendMerchant.status }),
      ...(frontendMerchant.settings && { settings: frontendMerchant.settings }),
    }),
  },

  // Menu Category transformer
  menuCategory: {
    toFrontend: (dbCategory: Database.MenuCategories): Frontend.MenuCategory => ({
      id: dbCategory.id,
      createdAt: dbCategory.created,
      updatedAt: dbCategory.updated,
      merchantId: dbCategory.merchant_id,
      name: dbCategory.name,
      description: dbCategory.description,
      sortOrder: dbCategory.sort_order,
      isEnabled: dbCategory.enabled,
      displayOrder: dbCategory.sort_order,
    }),

    toDatabase: (frontendCategory: Partial<Frontend.MenuCategory>): Partial<Database.MenuCategories> => ({
      ...(frontendCategory.merchantId && { merchant_id: frontendCategory.merchantId }),
      ...(frontendCategory.name && { name: frontendCategory.name }),
      ...(frontendCategory.description && { description: frontendCategory.description }),
      ...(typeof frontendCategory.sortOrder === 'number' && { sort_order: frontendCategory.sortOrder }),
      ...(typeof frontendCategory.isEnabled === 'boolean' && { enabled: frontendCategory.isEnabled }),
    }),
  },

  // Menu Item transformer
  menuItem: {
    toFrontend: (dbItem: Database.MenuItems): Frontend.MenuItem => ({
      id: dbItem.id,
      createdAt: dbItem.created,
      updatedAt: dbItem.updated,
      merchantId: dbItem.merchant_id,
      categoryId: dbItem.category_id,
      name: dbItem.name,
      description: dbItem.description,
      price: dbItem.price,
      imageUrl: dbItem.image,
      isAvailable: dbItem.available,
      isFeatured: dbItem.featured,
      sortOrder: dbItem.sort_order,
      allergens: dbItem.allergens ? Object.keys(dbItem.allergens) : [],
      dietaryInfo: dbItem.dietary_info ? Object.keys(dbItem.dietary_info) : [],
      formattedPrice: formatCurrency(dbItem.price),
      availabilityStatus: dbItem.available ? 'available' : 'unavailable',
    }),

    toDatabase: (frontendItem: Partial<Frontend.MenuItem>): Partial<Database.MenuItems> => ({
      ...(frontendItem.merchantId && { merchant_id: frontendItem.merchantId }),
      ...(frontendItem.categoryId && { category_id: frontendItem.categoryId }),
      ...(frontendItem.name && { name: frontendItem.name }),
      ...(frontendItem.description && { description: frontendItem.description }),
      ...(typeof frontendItem.price === 'number' && { price: frontendItem.price }),
      ...(frontendItem.imageUrl && { image: frontendItem.imageUrl }),
      ...(typeof frontendItem.isAvailable === 'boolean' && { available: frontendItem.isAvailable }),
      ...(typeof frontendItem.isFeatured === 'boolean' && { featured: frontendItem.isFeatured }),
      ...(typeof frontendItem.sortOrder === 'number' && { sort_order: frontendItem.sortOrder }),
      ...(frontendItem.allergens && { allergens: frontendItem.allergens.reduce((acc, allergen) => ({ ...acc, [allergen]: true }), {}) }),
      ...(frontendItem.dietaryInfo && { dietary_info: frontendItem.dietaryInfo.reduce((acc, info) => ({ ...acc, [info]: true }), {}) }),
    }),
  },

  // QR Code transformer
  qrCode: {
    toFrontend: (dbQR: Database.QrCodes): Frontend.QRCode => ({
      id: dbQR.id,
      createdAt: dbQR.created,
      updatedAt: dbQR.updated,
      merchantId: dbQR.merchant_id,
      tableName: dbQR.table_identifier,
      locationName: dbQR.location_identifier,
      qrCode: dbQR.code,
      isActive: dbQR.active,
      usageCount: dbQR.usage_count,
      lastUsed: dbQR.last_used,
      displayName: dbQR.table_identifier || dbQR.location_identifier || 'QR Code',
      qrCodeUrl: `${window.location.origin.replace(':3001', ':3000')}/menu/${dbQR.merchant_id}?qr=${dbQR.code}`,
      statusColor: dbQR.active ? 'green' : 'gray',
      formattedLastUsed: dbQR.last_used ? formatTimeAgo(dbQR.last_used) : undefined,
    }),

    toDatabase: (frontendQR: Partial<Frontend.QRCode>): Partial<Database.QrCodes> => ({
      ...(frontendQR.merchantId && { merchant_id: frontendQR.merchantId }),
      ...(frontendQR.tableName && { table_identifier: frontendQR.tableName }),
      ...(frontendQR.locationName && { location_identifier: frontendQR.locationName }),
      ...(frontendQR.qrCode && { code: frontendQR.qrCode }),
      ...(typeof frontendQR.isActive === 'boolean' && { active: frontendQR.isActive }),
      ...(typeof frontendQR.usageCount === 'number' && { usage_count: frontendQR.usageCount }),
      ...(frontendQR.lastUsed && { last_used: frontendQR.lastUsed }),
    }),
  },

  // Order transformer
  order: {
    toFrontend: (dbOrder: Database.Orders): Frontend.Order => {
      const getStatusColor = (status: Database.Orders['status']) => {
        switch (status) {
          case 'placed': return 'blue';
          case 'confirmed': return 'blue';
          case 'preparing': return 'yellow';
          case 'ready': return 'green';
          case 'completed': return 'gray';
          case 'cancelled': return 'red';
          default: return 'gray';
        }
      };

      const getNextStatus = (status: Database.Orders['status']): Database.Orders['status'] | undefined => {
        switch (status) {
          case 'placed': return 'confirmed';
          case 'confirmed': return 'preparing';
          case 'preparing': return 'ready';
          case 'ready': return 'completed';
          default: return undefined;
        }
      };

      return {
        id: dbOrder.id,
        createdAt: dbOrder.created,
        updatedAt: dbOrder.updated,
        merchantId: dbOrder.merchant_id,
        customerId: dbOrder.customer_id,
        qrCodeId: dbOrder.qr_code_id,
        customerName: dbOrder.customer_name,
        customerPhone: dbOrder.customer_phone,
        status: dbOrder.status,
        totalAmount: dbOrder.total_amount,
        taxAmount: dbOrder.tax_amount,
        specialInstructions: dbOrder.special_instructions,
        estimatedReadyTime: dbOrder.estimated_ready_time,
        completedAt: dbOrder.completed_at,
        formattedTotal: formatCurrency(dbOrder.total_amount),
        statusColor: getStatusColor(dbOrder.status),
        statusLabel: dbOrder.status.charAt(0).toUpperCase() + dbOrder.status.slice(1),
        orderNumber: `#${dbOrder.id.slice(-6).toUpperCase()}`,
        timeAgo: formatTimeAgo(dbOrder.created),
        canAdvanceStatus: getNextStatus(dbOrder.status) !== undefined,
        nextStatus: getNextStatus(dbOrder.status),
      };
    },

    toDatabase: (frontendOrder: Partial<Frontend.Order>): Partial<Database.Orders> => ({
      ...(frontendOrder.merchantId && { merchant_id: frontendOrder.merchantId }),
      ...(frontendOrder.customerId && { customer_id: frontendOrder.customerId }),
      ...(frontendOrder.qrCodeId && { qr_code_id: frontendOrder.qrCodeId }),
      ...(frontendOrder.customerName && { customer_name: frontendOrder.customerName }),
      ...(frontendOrder.customerPhone && { customer_phone: frontendOrder.customerPhone }),
      ...(frontendOrder.status && { status: frontendOrder.status }),
      ...(typeof frontendOrder.totalAmount === 'number' && { total_amount: frontendOrder.totalAmount }),
      ...(typeof frontendOrder.taxAmount === 'number' && { tax_amount: frontendOrder.taxAmount }),
      ...(frontendOrder.specialInstructions && { special_instructions: frontendOrder.specialInstructions }),
      ...(frontendOrder.estimatedReadyTime && { estimated_ready_time: frontendOrder.estimatedReadyTime }),
      ...(frontendOrder.completedAt && { completed_at: frontendOrder.completedAt }),
    }),
  },

  // Order Item transformer
  orderItem: {
    toFrontend: (dbOrderItem: Database.OrderItems): Frontend.OrderItem => ({
      id: dbOrderItem.id,
      createdAt: dbOrderItem.created,
      updatedAt: dbOrderItem.updated,
      orderId: dbOrderItem.order_id,
      menuItemId: dbOrderItem.menu_item_id,
      itemName: dbOrderItem.item_name,
      quantity: dbOrderItem.quantity,
      unitPrice: dbOrderItem.unit_price,
      totalPrice: dbOrderItem.total_price,
      specialInstructions: dbOrderItem.special_instructions,
      formattedUnitPrice: formatCurrency(dbOrderItem.unit_price),
      formattedTotalPrice: formatCurrency(dbOrderItem.total_price),
    }),

    toDatabase: (frontendOrderItem: Partial<Frontend.OrderItem>): Partial<Database.OrderItems> => ({
      ...(frontendOrderItem.orderId && { order_id: frontendOrderItem.orderId }),
      ...(frontendOrderItem.menuItemId && { menu_item_id: frontendOrderItem.menuItemId }),
      ...(frontendOrderItem.itemName && { item_name: frontendOrderItem.itemName }),
      ...(typeof frontendOrderItem.quantity === 'number' && { quantity: frontendOrderItem.quantity }),
      ...(typeof frontendOrderItem.unitPrice === 'number' && { unit_price: frontendOrderItem.unitPrice }),
      ...(typeof frontendOrderItem.totalPrice === 'number' && { total_price: frontendOrderItem.totalPrice }),
      ...(frontendOrderItem.specialInstructions && { special_instructions: frontendOrderItem.specialInstructions }),
    }),
  },

  // Order Modifier transformer
  orderModifier: {
    toFrontend: (dbOrderModifier: Database.OrderModifiers): Frontend.OrderModifier => ({
      id: dbOrderModifier.id,
      createdAt: dbOrderModifier.created,
      updatedAt: dbOrderModifier.updated,
      orderItemId: dbOrderModifier.order_item_id,
      modifierId: dbOrderModifier.modifier_id,
      modifierName: dbOrderModifier.modifier_name,
      optionName: dbOrderModifier.option_name,
      optionValue: dbOrderModifier.option_value,
      priceAdjustment: dbOrderModifier.price_adjustment,
      formattedPriceAdjustment: formatCurrency(dbOrderModifier.price_adjustment),
    }),

    toDatabase: (frontendOrderModifier: Partial<Frontend.OrderModifier>): Partial<Database.OrderModifiers> => ({
      ...(frontendOrderModifier.orderItemId && { order_item_id: frontendOrderModifier.orderItemId }),
      ...(frontendOrderModifier.modifierId && { modifier_id: frontendOrderModifier.modifierId }),
      ...(frontendOrderModifier.modifierName && { modifier_name: frontendOrderModifier.modifierName }),
      ...(frontendOrderModifier.optionName && { option_name: frontendOrderModifier.optionName }),
      ...(frontendOrderModifier.optionValue && { option_value: frontendOrderModifier.optionValue }),
      ...(typeof frontendOrderModifier.priceAdjustment === 'number' && { price_adjustment: frontendOrderModifier.priceAdjustment }),
    }),
  },

  // Payment transformer
  payment: {
    toFrontend: (dbPayment: Database.Payments): Frontend.Payment => {
      const getStatusColor = (status: Database.Payments['status']) => {
        switch (status) {
          case 'pending': return 'yellow';
          case 'completed': return 'green';
          case 'failed': return 'red';
          case 'refunded': return 'blue';
          default: return 'yellow';
        }
      };

      const getMethodLabel = (method: Database.Payments['method']) => {
        switch (method) {
          case 'cash': return 'Cash';
          case 'gcash': return 'GCash';
          case 'card': return 'Card';
          default: return method;
        }
      };

      return {
        id: dbPayment.id,
        createdAt: dbPayment.created,
        updatedAt: dbPayment.updated,
        orderId: dbPayment.order_id,
        method: dbPayment.method,
        status: dbPayment.status,
        amount: dbPayment.amount,
        transactionId: dbPayment.transaction_id,
        metadata: dbPayment.metadata,
        processedAt: dbPayment.processed_at,
        formattedAmount: formatCurrency(dbPayment.amount),
        statusColor: getStatusColor(dbPayment.status),
        methodLabel: getMethodLabel(dbPayment.method),
      };
    },

    toDatabase: (frontendPayment: Partial<Frontend.Payment>): Partial<Database.Payments> => ({
      ...(frontendPayment.orderId && { order_id: frontendPayment.orderId }),
      ...(frontendPayment.method && { method: frontendPayment.method }),
      ...(frontendPayment.status && { status: frontendPayment.status }),
      ...(typeof frontendPayment.amount === 'number' && { amount: frontendPayment.amount }),
      ...(frontendPayment.transactionId && { transaction_id: frontendPayment.transactionId }),
      ...(frontendPayment.metadata && { metadata: frontendPayment.metadata }),
      ...(frontendPayment.processedAt && { processed_at: frontendPayment.processedAt }),
    }),
  },
} as const;

// Generic transformer utility
export type TransformerKey = keyof typeof transformers;

export function transformToFrontend<K extends TransformerKey>(
  key: K,
  dbRecord: Parameters<typeof transformers[K]['toFrontend']>[0]
): ReturnType<typeof transformers[K]['toFrontend']> {
  return transformers[key].toFrontend(dbRecord as any) as any;
}

export function transformToDatabase<K extends TransformerKey>(
  key: K,
  frontendRecord: Parameters<typeof transformers[K]['toDatabase']>[0]
): ReturnType<typeof transformers[K]['toDatabase']> {
  return transformers[key].toDatabase(frontendRecord as any) as any;
}
