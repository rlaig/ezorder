import PocketBase from 'pocketbase';

// Initialize PocketBase instance
const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090');

// Enable auto cancellation for duplicate requests
pb.autoCancellation(false);

export default pb;

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  MERCHANTS: 'merchants',
  MENU_CATEGORIES: 'menu_categories',
  MENU_ITEMS: 'menu_items',
  MENU_MODIFIERS: 'menu_modifiers',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  QR_CODES: 'qr_codes',
  PAYMENTS: 'payments',
} as const;
