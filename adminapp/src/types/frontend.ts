/**
 * Frontend Types - Optimized for UI/UX with better naming and computed properties
 * These are transformed from database types for better developer experience
 */

import type { Database } from './database';

// Base frontend entity
export interface BaseFrontendEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export namespace Frontend {
  // User types with computed properties
  export interface User extends BaseFrontendEntity {
    email: string;
    name: string;
    avatar?: string;
    role: Database.Users['role'];
    isVerified: boolean;
    displayName: string; // Computed from name
  }

  // Merchant with UI-friendly field names
  export interface Merchant extends BaseFrontendEntity {
    userId: string;
    businessName: string;
    address?: string;
    phone?: string;
    gcashNumber?: string;
    status: Database.Merchants['status'];
    settings?: Record<string, any>;
    
    // Computed properties for UI
    displayName: string;
    statusColor: 'green' | 'yellow' | 'red' | 'gray';
    isActive: boolean;
  }

  // Menu category with UI enhancements
  export interface MenuCategory extends BaseFrontendEntity {
    merchantId: string;
    name: string;
    description?: string;
    sortOrder: number;
    isEnabled: boolean;
    
    // Computed properties
    itemCount?: number;
    displayOrder: number;
  }

  // Menu item with enhanced properties
  export interface MenuItem extends BaseFrontendEntity {
    merchantId: string;
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable: boolean;
    isFeatured: boolean;
    sortOrder: number;
    allergens?: string[];
    dietaryInfo?: string[];
    
    // Computed properties
    formattedPrice: string;
    availabilityStatus: 'available' | 'unavailable' | 'limited';
    categoryName?: string; // Populated from joins
  }

  // QR Code with user-friendly naming
  export interface QRCode extends BaseFrontendEntity {
    merchantId: string;
    tableName?: string;
    locationName?: string;
    qrCode: string;
    isActive: boolean;
    usageCount: number;
    lastUsed?: string;
    
    // Computed properties
    displayName: string;
    qrCodeUrl: string;
    statusColor: 'green' | 'gray';
    formattedLastUsed?: string;
  }

  // Order with enhanced status management
  export interface Order extends BaseFrontendEntity {
    merchantId: string;
    customerId?: string;
    qrCodeId?: string;
    customerName?: string;
    customerPhone?: string;
    status: Database.Orders['status'];
    totalAmount: number;
    taxAmount?: number;
    specialInstructions?: string;
    estimatedReadyTime?: string;
    completedAt?: string;
    
    // Computed properties
    formattedTotal: string;
    statusColor: 'blue' | 'yellow' | 'green' | 'gray' | 'red';
    statusLabel: string;
    orderNumber: string; // Formatted ID
    timeAgo: string;
    canAdvanceStatus: boolean;
    nextStatus?: Database.Orders['status'];
    
    // Related data
    items?: OrderItem[];
    customer?: User;
    qrCode?: QRCode;
  }

  // Order item with formatting
  export interface OrderItem extends BaseFrontendEntity {
    orderId: string;
    menuItemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    specialInstructions?: string;
    
    // Computed properties
    formattedUnitPrice: string;
    formattedTotalPrice: string;
    
    // Related data
    modifiers?: OrderModifier[];
  }

  // Order modifier
  export interface OrderModifier extends BaseFrontendEntity {
    orderItemId: string;
    modifierId?: string;
    modifierName: string;
    optionName: string;
    optionValue: string;
    priceAdjustment: number;
    
    // Computed properties
    formattedPriceAdjustment: string;
  }

  // Payment with status formatting
  export interface Payment extends BaseFrontendEntity {
    orderId: string;
    method: Database.Payments['method'];
    status: Database.Payments['status'];
    amount: number;
    transactionId?: string;
    metadata?: Record<string, any>;
    processedAt?: string;
    
    // Computed properties
    formattedAmount: string;
    statusColor: 'blue' | 'green' | 'red' | 'yellow';
    methodLabel: string;
  }
}

// Utility types for transformations
export type DatabaseToFrontend<T> =
  T extends Database.Users ? Frontend.User :
  T extends Database.Merchants ? Frontend.Merchant :
  T extends Database.MenuCategories ? Frontend.MenuCategory :
  T extends Database.MenuItems ? Frontend.MenuItem :
  T extends Database.QrCodes ? Frontend.QRCode :
  T extends Database.Orders ? Frontend.Order :
  T extends Database.OrderItems ? Frontend.OrderItem :
  T extends Database.OrderModifiers ? Frontend.OrderModifier :
  T extends Database.Payments ? Frontend.Payment :
  never;

// Partial types for forms and updates
export namespace Form {
  export type MerchantProfile = Partial<Pick<Frontend.Merchant, 
    'businessName' | 'address' | 'phone' | 'gcashNumber'>>;
  
  export type MenuCategory = Partial<Pick<Frontend.MenuCategory, 
    'name' | 'description' | 'sortOrder' | 'isEnabled'>>;
  
  export type MenuItem = Partial<Pick<Frontend.MenuItem, 
    'name' | 'description' | 'price' | 'isAvailable' | 'isFeatured' | 'sortOrder'>>;
  
  export type QRCode = Partial<Pick<Frontend.QRCode, 
    'tableName' | 'locationName' | 'isActive'>>;
}
