import { Head } from '@/components/seo';

const Dashboard = () => {
  // Mock data for merchant dashboard
  const todaysOrders = 12;
  const pendingOrders = 3;
  const completedOrders = 9;
  const todaysRevenue = 2450;

  const recentOrders = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      tableNumber: '5',
      items: ['Adobo Rice Bowl', 'Iced Coffee'],
      total: 285,
      status: 'PREPARING' as const,
      time: '10 mins ago',
    },
    {
      id: '2',
      orderNumber: 'ORD-002', 
      tableNumber: '3',
      items: ['Chicken Sandwich', 'Fries'],
      total: 195,
      status: 'PLACED' as const,
      time: '5 mins ago',
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      tableNumber: '1',
      items: ['Caesar Salad', 'Iced Tea'],
      total: 225,
      status: 'READY' as const,
      time: '2 mins ago',
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
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <>
      <Head title="Merchant Dashboard" />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening at your restaurant today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Today's Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{todaysOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                <p className="text-2xl font-semibold text-orange-600">{pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Completed Orders</p>
                <p className="text-2xl font-semibold text-green-600">{completedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">₱{todaysRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Orders
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <span className={getStatusBadge(order.status)}>{order.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Table {order.tableNumber} • {order.items.join(', ')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₱{order.total}</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm mt-1">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const Component = Dashboard;
export default Dashboard;
