export interface Order {
  id: string;
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
  created: string;
  updated: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  created: string;
  updated: string;
}

export interface OrderItemModifier {
  id: string;
  name: string;
  price: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<Order['status'], number>;
}
