export interface Order {
  id: string;
  merchantId: string;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  status: 'placed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total: number;
  paymentMethod: 'cash' | 'gcash' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  specialInstructions?: string;
  created: string;
  updated: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  subtotal: number;
  modifiers?: OrderItemModifier[];
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
