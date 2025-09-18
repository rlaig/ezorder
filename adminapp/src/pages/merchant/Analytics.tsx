import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useOrderStats } from '../../hooks/useOrders';

export const MerchantAnalytics: React.FC = () => {
  const { user } = useAuth();
  const merchantId = user?.id || '';
  
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('week');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const getDateRange = () => {
    const now = new Date();
    let startDate: string;
    let endDate = now.toISOString().split('T')[0];

    switch (dateRange) {
      case 'today':
        startDate = endDate;
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDate = weekAgo.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate = monthAgo.toISOString().split('T')[0];
        break;
      case 'custom':
        startDate = customStartDate;
        endDate = customEndDate;
        break;
      default:
        startDate = endDate;
    }

    return { startDate, endDate };
  };

  const { startDate, endDate } = getDateRange();
  const { data: stats, isLoading } = useOrderStats(merchantId, startDate, endDate);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'today': return 'Today';
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case 'custom': return customStartDate && customEndDate 
        ? `${customStartDate} to ${customEndDate}` 
        : 'Custom Range';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-600">
            Track your business performance and insights
          </p>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          
          {dateRange === 'custom' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Period Display */}
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-900">
          Performance for {getDateRangeLabel()}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.totalOrders || 0}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Average Order</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(stats?.averageOrderValue || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Completed Orders</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.ordersByStatus?.completed || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Breakdown</h3>
              {stats?.ordersByStatus ? (
                <div className="space-y-3">
                  {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          status === 'completed' ? 'bg-green-400' :
                          status === 'preparing' ? 'bg-yellow-400' :
                          status === 'ready' ? 'bg-blue-400' :
                          status === 'placed' ? 'bg-purple-400' :
                          'bg-red-400'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-900">
                        {count} orders
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
              <div className="space-y-4">
                {stats && stats.totalOrders > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="text-sm font-medium text-green-600">
                        {Math.round(((stats.ordersByStatus?.completed || 0) / stats.totalOrders) * 100)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Orders</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {(stats.ordersByStatus?.placed || 0) + (stats.ordersByStatus?.preparing || 0) + (stats.ordersByStatus?.ready || 0)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Revenue per Day</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(stats.totalRevenue / (dateRange === 'today' ? 1 : dateRange === 'week' ? 7 : 30))}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No orders in this period
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Analytics Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performance Times</h3>
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Coming Soon</p>
                <p className="text-xs text-gray-400">Peak hours analysis</p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Items</h3>
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Coming Soon</p>
                <p className="text-xs text-gray-400">Best-selling menu items</p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Coming Soon</p>
                <p className="text-xs text-gray-400">Customer behavior patterns</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
