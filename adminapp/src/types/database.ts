/**
 * Database Schema Types - These match exactly with PocketBase collections
 * Generated from database-reference.md schema
 */

// Base database record structure
export interface BaseRecord {
  id: string;
  created: string;
  updated: string;
}

// Database collections - exact field names from PocketBase
export namespace Database {
  export interface Users extends BaseRecord {
    email: string;
    password: string; // Handled by PocketBase
    name: string;
    avatar?: string;
    role: 'customer' | 'merchant' | 'admin' | 'super_admin';
    verified: boolean;
  }

  export interface Merchants extends BaseRecord {
    user_id: string;
    business_name: string;
    address?: string;
    phone?: string;
    gcash_number?: string;
    status: 'pending' | 'active' | 'inactive' | 'suspended';
    settings?: Record<string, any>;
  }

  export interface MenuCategories extends BaseRecord {
    merchant_id: string;
    name: string;
    description?: string;
    sort_order: number;
    enabled: boolean;
  }

  export interface MenuItems extends BaseRecord {
    merchant_id: string;
    category_id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    available: boolean;
    featured: boolean;
    sort_order: number;
    allergens?: Record<string, any>;
    dietary_info?: Record<string, any>;
  }

  export interface MenuModifiers extends BaseRecord {
    item_id: string;
    name: string;
    type: 'single_choice' | 'multiple_choice' | 'text_input';
    options: Record<string, any>;
    required: boolean;
    min_selections?: number;
    max_selections?: number;
  }

  export interface QrCodes extends BaseRecord {
    merchant_id: string;
    table_identifier?: string;
    location_identifier?: string;
    code: string;
    active: boolean;
    usage_count: number;
    last_used?: string;
  }

  export interface Customers extends BaseRecord {
    name: string;
    phone?: string;
    preferences?: Record<string, any>;
  }

  export interface Orders extends BaseRecord {
    merchant_id: string;
    customer_id?: string;
    qr_code_id?: string;
    customer_name?: string;
    customer_phone?: string;
    status: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    total_amount: number;
    tax_amount?: number;
    special_instructions?: string;
    estimated_ready_time?: string;
    completed_at?: string;
  }

  export interface OrderItems extends BaseRecord {
    order_id: string;
    menu_item_id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    special_instructions?: string;
  }

  export interface OrderModifiers extends BaseRecord {
    order_item_id: string;
    modifier_id?: string;
    modifier_name: string;
    option_name: string;
    option_value: string;
    price_adjustment: number;
  }

  export interface Payments extends BaseRecord {
    order_id: string;
    method: 'cash' | 'gcash' | 'card';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    amount: number;
    transaction_id?: string;
    metadata?: Record<string, any>;
    processed_at?: string;
  }

  export interface Reviews extends BaseRecord {
    order_id: string;
    merchant_id: string;
    customer_id?: string;
    rating: number;
    comment?: string;
    food_rating?: number;
    service_rating?: number;
    photos?: string[];
  }

  export interface LoyaltyPoints extends BaseRecord {
    customer_id: string;
    merchant_id: string;
    order_id?: string;
    type: 'earned' | 'redeemed' | 'expired';
    points: number;
    description: string;
    expires_at?: string;
  }

  export interface SupportTickets extends BaseRecord {
    created_by: string;
    order_id?: string;
    category: 'order_issue' | 'payment_issue' | 'technical_issue' | 'feedback' | 'other';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
    subject: string;
    description: string;
    assigned_to?: string;
    resolved_at?: string;
  }

  export interface AnalyticsEvents extends BaseRecord {
    merchant_id?: string;
    customer_id?: string;
    event_type: 'qr_scan' | 'menu_view' | 'item_view' | 'add_to_cart' | 'checkout_start' | 'order_placed' | 'payment_completed' | 'order_completed';
    session_id: string;
    metadata?: Record<string, any>;
    user_agent?: string;
    ip_address?: string;
  }
}

// Collection name mapping for type safety
export const COLLECTION_NAMES = {
  USERS: 'users',
  MERCHANTS: 'merchants',
  MENU_CATEGORIES: 'menu_categories',
  MENU_ITEMS: 'menu_items',
  MENU_MODIFIERS: 'menu_modifiers',
  QR_CODES: 'qr_codes',
  CUSTOMERS: 'customers',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  ORDER_MODIFIERS: 'order_modifiers',
  PAYMENTS: 'payments',
  REVIEWS: 'reviews',
  LOYALTY_POINTS: 'loyalty_points',
  SUPPORT_TICKETS: 'support_tickets',
  ANALYTICS_EVENTS: 'analytics_events',
} as const;

// Type-safe collection name type
export type CollectionName = typeof COLLECTION_NAMES[keyof typeof COLLECTION_NAMES];

// Generic database record type
export type DatabaseRecord<T extends CollectionName> = 
  T extends 'users' ? Database.Users :
  T extends 'merchants' ? Database.Merchants :
  T extends 'menu_categories' ? Database.MenuCategories :
  T extends 'menu_items' ? Database.MenuItems :
  T extends 'menu_modifiers' ? Database.MenuModifiers :
  T extends 'qr_codes' ? Database.QrCodes :
  T extends 'customers' ? Database.Customers :
  T extends 'orders' ? Database.Orders :
  T extends 'order_items' ? Database.OrderItems :
  T extends 'order_modifiers' ? Database.OrderModifiers :
  T extends 'payments' ? Database.Payments :
  T extends 'reviews' ? Database.Reviews :
  T extends 'loyalty_points' ? Database.LoyaltyPoints :
  T extends 'support_tickets' ? Database.SupportTickets :
  T extends 'analytics_events' ? Database.AnalyticsEvents :
  never;
