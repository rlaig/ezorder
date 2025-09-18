export interface Payment {
  id: string;
  order_id: string;
  method: 'cash' | 'gcash' | 'card';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  transaction_id?: string;
  metadata?: any;
  processed_at?: string;
  created: string;
  updated: string;
}
