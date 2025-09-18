import { Head } from '@/components/seo';

const Orders = () => {
  // Mock data for orders
  const orders = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      tableNumber: '5',
      customerName: 'Walk-in Customer',
      items: [
        { name: 'Chicken Adobo Rice Bowl', quantity: 1, price: 195 },
        { name: 'Iced Coffee', quantity: 1, price: 85 },
      ],
      total: 280,
      status: 'PLACED' as const,
      paymentMethod: 'CASH' as const,
      paymentStatus: 'PENDING' as const,
      placedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      specialInstructions: 'Extra rice please',
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      tableNumber: '3',
      customerName: 'Walk-in Customer',
      items: [
        { name: 'Pork Sisig Rice Bowl', quantity: 1, price: 215 },
        { name: 'Hot Coffee', quantity: 2, price: 150 },
      ],
      total: 365,
      status: 'PREPARING' as const,
      paymentMethod: 'GCASH' as const,
      paymentStatus: 'PAID' as const,
      placedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      specialInstructions: null,
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      tableNumber: '1',
      customerName: 'Walk-in Customer',
      items: [
        { name: 'Caesar Salad', quantity: 1, price: 165 },
        { name: 'Iced Tea', quantity: 1, price: 65 },
      ],
      total: 230,
      status: 'READY' as const,
      paymentMethod: 'CASH' as const,
      paymentStatus: 'PAID' as const,
      placedAt: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      specialInstructions: null,
    },
  ];

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex px-2 py-1 text-xs font-medium rounded-full';
    
    switch (status) {
      case 'PLACED':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'PREPARING':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'READY':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'COMPLETED':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'CANCELLED':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex px-2 py-1 text-xs font-medium rounded-full';
    
    switch (status) {
      case 'PAID':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'REFUNDED':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to status ${newStatus}`);
    // This will be implemented with actual API calls
  };

  return (
    <>
      <Head title="Order Management" />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Order Queue</h1>
          <p className="text-gray-600">
            Manage incoming orders and track their progress from placement to completion.
          </p>
        </div>

        {/* Order Status Filters */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap">
              All Orders
            </button>
            <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 whitespace-nowrap">
              New Orders (3)
            </button>
            <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 whitespace-nowrap">
              Preparing (1)
            </button>
            <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 whitespace-nowrap">
              Ready (1)
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">Table {order.tableNumber} • {getTimeAgo(order.placedAt)}</p>
                  </div>
                  <span className={getStatusBadge(order.status)}>{order.status}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-gray-900">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-sm font-medium text-gray-900">₱{item.price}</span>
                    </div>
                  ))}
                </div>

                {order.specialInstructions && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Special Instructions:</p>
                    <p className="text-sm text-yellow-700">{order.specialInstructions}</p>
                  </div>
                )}

                {/* Payment Info */}
                <div className="flex justify-between items-center mb-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{order.paymentMethod}</span>
                    <span className={getPaymentStatusBadge(order.paymentStatus)}>{order.paymentStatus}</span>
                  </div>
                  <span className="font-semibold text-gray-900">₱{order.total}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {order.status === 'PLACED' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, 'PREPARING')}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'PREPARING' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, 'READY')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'READY' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 font-medium"
                    >
                      Mark Completed
                    </button>
                  )}
                  <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (when no orders) */}
        {orders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500">Orders will appear here when customers place them.</p>
          </div>
        )}
      </div>
    </>
  );
};

export const Component = Orders;
export default Orders;
