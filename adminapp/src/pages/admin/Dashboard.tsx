import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, trend }) => (
  <Card variant="elevated" className="relative overflow-hidden">
    <CardContent>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-xs ${
              trend.isPositive ? 'text-success-600' : 'text-error-600'
            }`}>
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                {trend.isPositive ? (
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                )}
              </svg>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className="flex-shrink-0 p-3 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface RecentActivity {
  id: string;
  type: 'merchant_registered' | 'order_peak' | 'system_update';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'success' | 'warning' | 'info';
}

const mockActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'order_peak',
    title: 'Order processing peak',
    description: 'High order volume detected',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    status: 'warning'
  },
  {
    id: '2', 
    type: 'merchant_registered',
    title: 'New merchant registration',
    description: 'Cafe Luna joined the platform',
    timestamp: new Date(Date.now() - 105 * 60 * 1000),
    status: 'success'
  }
];

interface MerchantListItem {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  registeredAt: Date;
  todayOrders: number;
  revenue: number;
}

const mockMerchants: MerchantListItem[] = [
  {
    id: '1',
    name: 'Cafe Luna',
    status: 'active',
    registeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    todayOrders: 23,
    revenue: 3420
  },
  {
    id: '2',
    name: 'Pizza Palace', 
    status: 'pending',
    registeredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    todayOrders: 0,
    revenue: 0
  }
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Overview of platform metrics and merchant management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Merchants"
          value="12"
          description="2 pending approval"
          trend={{ value: 8.2, isPositive: true }}
          icon={
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />

        <StatCard
          title="Active Orders"
          value="247"
          description="Across all merchants"
          trend={{ value: 12.1, isPositive: true }}
          icon={
            <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Today's Revenue"
          value={formatCurrency(15430)}
          description="₱2,100 vs yesterday"
          trend={{ value: 15.3, isPositive: true }}
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
        />

        <StatCard
          title="System Status"
          value="Online"
          description="All services operational"
          icon={
            <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Merchants */}
        <div className="lg:col-span-2">
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Merchants</CardTitle>
                  <CardDescription>Latest merchant registrations and activity</CardDescription>
                </div>
                <button className="btn-primary text-sm">View All</button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMerchants.map((merchant) => (
                  <div key={merchant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-medium">
                        {merchant.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{merchant.name}</p>
                        <p className="text-sm text-gray-500">
                          Registered {formatRelativeTime(merchant.registeredAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-gray-600">{merchant.todayOrders} orders today</p>
                        <p className="text-xs text-gray-500">{formatCurrency(merchant.revenue)} revenue</p>
                      </div>
                      <Badge 
                        variant={merchant.status === 'active' ? 'success' : merchant.status === 'pending' ? 'warning' : 'default'}
                        size="sm"
                      >
                        {merchant.status.charAt(0).toUpperCase() + merchant.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Activity */}
        <div>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>Real-time platform events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-success-500' :
                      activity.status === 'warning' ? 'bg-warning-500' :
                      'bg-primary-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 mb-1">{activity.description}</p>
                      <p className="text-xs text-gray-400">{formatRelativeTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card variant="elevated" className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full btn-primary text-sm">
                  Approve Pending Merchants
                </button>
                <button className="w-full btn-secondary text-sm">
                  Generate Report
                </button>
                <button className="w-full btn-secondary text-sm">
                  System Settings
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
