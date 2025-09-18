import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useOrders, useUpdateOrderStatus } from '../../hooks/useOrders';
import type { Database } from '../../types';

export const OrderQueue: React.FC = () => {
  const { user } = useAuth();
  const merchantId = user?.id || '';
  
  const [statusFilter, setStatusFilter] = useState<Database.Orders['status'] | 'all'>('all');
  const { data: ordersData, isLoading } = useOrders(
    merchantId,
    1,
    50,
    statusFilter === 'all' ? undefined : statusFilter
  );
  const updateOrderStatus = useUpdateOrderStatus();
  
  const [selectedOrder, setSelectedOrder] = useState<Database.Orders | null>(null);

  const orders = ordersData?.items || [];

  const handleStatusChange = async (orderId: string, newStatus: Database.Orders['status']) => {
    try {
      await updateOrderStatus.mutateAsync({ id: orderId, status: newStatus });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status: Database.Orders['status']) => {
    switch (status) {
      case 'placed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: Database.Orders['status']): Database.Orders['status'] | null => {
    switch (currentStatus) {
      case 'placed': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'completed';
      default: return null;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<Database.Orders['status'], number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Queue</h1>
          <p className="text-sm text-gray-600">
            Real-time order management and tracking
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Auto-refresh:</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['all', 'placed', 'preparing', 'ready', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                statusFilter === status
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status} {status !== 'all' && statusCounts[status] ? `(${statusCounts[status]})` : ''}
            </button>
          ))}
        </nav>
      </div>

      {/* Orders Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders</h3>
          <p className="text-gray-600">
            {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Order #{order.id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Takeout Order
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">₱{order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ordered:</span>
                  <span>{formatTimeAgo(order.created)}</span>
                </div>
              </div>

              {order.special_instructions && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Special Instructions:</span>
                    <br />
                    {order.special_instructions}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Details
                </button>
                
                {getNextStatus(order.status) && (
                  <button
                    onClick={() => handleStatusChange(order.id, getNextStatus(order.status)!)}
                    disabled={updateOrderStatus.isPending}
                    className="btn-primary text-sm py-1 px-3"
                  >
                    {updateOrderStatus.isPending ? 'Updating...' : 
                      `Mark ${getNextStatus(order.status)?.charAt(0).toUpperCase()}${getNextStatus(order.status)?.slice(1)}`
                    }
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{selectedOrder.id.slice(-6).toUpperCase()}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">₱{selectedOrder.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ordered:</span>
                      <span>{new Date(selectedOrder.created).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.customer_name && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Name: {selectedOrder.customer_name}</div>
                      {selectedOrder.customer_phone && (
                        <div>Phone: {selectedOrder.customer_phone}</div>
                      )}
                    </div>
                  </div>
                )}

                {selectedOrder.special_instructions && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Special Instructions</h4>
                    <p className="text-sm text-gray-600 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      {selectedOrder.special_instructions}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                  {getNextStatus(selectedOrder.status) && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, getNextStatus(selectedOrder.status)!);
                        setSelectedOrder(null);
                      }}
                      disabled={updateOrderStatus.isPending}
                      className="btn-primary"
                    >
                      Update Status
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
