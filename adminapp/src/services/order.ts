import pb, { COLLECTIONS } from './pocketbase';
import { castRecord, castRecords } from '../utils/pocketbase';
import type { Database, OrderStats, PaginatedResponse } from '../types';

export class OrderService {
  /**
   * Get orders for a merchant
   */
  static async getOrders(
    merchantId: string,
    page = 1,
    perPage = 20,
    status?: Database.Orders['status']
  ): Promise<PaginatedResponse<Database.Orders>> {
    try {
      let filter = `merchantId = "${merchantId}"`;
      if (status) {
        filter += ` && status = "${status}"`;
      }

      const result = await pb.collection(COLLECTIONS.ORDERS).getList(page, perPage, {
        filter,
        sort: '-created',
        expand: 'orderItems',
      });

      return {
        items: castRecords<Database.Orders>(result.items),
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      };
    } catch (error) {
      console.error('Get orders error:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  /**
   * Get single order by ID
   */
  static async getOrder(id: string): Promise<Database.Orders> {
    try {
      const record = await pb.collection(COLLECTIONS.ORDERS).getOne(id, {
        expand: 'orderItems',
      });
      return castRecord<Database.Orders>(record);
    } catch (error) {
      console.error('Get order error:', error);
      throw new Error('Failed to fetch order');
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(id: string, status: Database.Orders['status']): Promise<Database.Orders> {
    try {
      const record = await pb.collection(COLLECTIONS.ORDERS).update(id, { status });
      return castRecord<Database.Orders>(record);
    } catch (error) {
      console.error('Update order status error:', error);
      throw new Error('Failed to update order status');
    }
  }

  /**
   * Get order items for an order
   */
  static async getOrderItems(orderId: string): Promise<Database.OrderItems[]> {
    try {
      const records = await pb.collection(COLLECTIONS.ORDER_ITEMS).getFullList({
        filter: `orderId = "${orderId}"`,
        sort: 'created',
      });
      return castRecords<Database.OrderItems>(records);
    } catch (error) {
      console.error('Get order items error:', error);
      throw new Error('Failed to fetch order items');
    }
  }

  /**
   * Get order statistics for a merchant
   */
  static async getOrderStats(
    merchantId: string,
    startDate?: string,
    endDate?: string
  ): Promise<OrderStats> {
    try {
      let filter = `merchantId = "${merchantId}"`;
      if (startDate && endDate) {
        filter += ` && created >= "${startDate}" && created <= "${endDate}"`;
      }

      const orders = await pb.collection(COLLECTIONS.ORDERS).getFullList({
        filter,
      });
      
      const typedOrders = castRecords<Database.Orders>(orders);

      const totalOrders = typedOrders.length;
      const totalRevenue = typedOrders.reduce((sum, order) => sum + order.total_amount, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const ordersByStatus = typedOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<Database.Orders['status'], number>);

      return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        ordersByStatus,
      };
    } catch (error) {
      console.error('Get order stats error:', error);
      throw new Error('Failed to fetch order statistics');
    }
  }

  /**
   * Subscribe to real-time order updates
   */
  static subscribeToOrders(merchantId: string, callback: (order: Database.Orders) => void) {
    try {
    pb.collection(COLLECTIONS.ORDERS).subscribe('*', (data) => {
      const order = castRecord<Database.Orders>(data.record);
      if (order.merchant_id === merchantId) {
        callback(order);
      }
    });
    } catch (error) {
      console.error('Subscribe to orders error:', error);
    }
  }

  /**
   * Unsubscribe from order updates
   */
  static unsubscribeFromOrders() {
    pb.collection(COLLECTIONS.ORDERS).unsubscribe('*');
  }
}
