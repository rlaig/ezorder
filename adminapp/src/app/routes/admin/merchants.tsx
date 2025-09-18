import { Head } from '@/components/seo';

const Merchants = () => {
  // Mock data for merchants
  const merchants = [
    {
      id: '1',
      name: 'Café Manila',
      email: 'admin@cafemanila.com',
      phone: '+63 917 123 4567',
      address: 'Makati City, Manila',
      status: 'ACTIVE' as const,
      createdAt: '2024-01-15',
    },
    {
      id: '2', 
      name: 'Bistro Greenhills',
      email: 'owner@bistrogreenhills.com',
      phone: '+63 917 765 4321',
      address: 'San Juan City, Manila',
      status: 'ACTIVE' as const,
      createdAt: '2024-01-12',
    },
    {
      id: '3',
      name: 'Pizza Corner',
      email: 'hello@pizzacorner.ph',
      phone: '+63 917 555 0123',
      address: 'Quezon City, Manila',
      status: 'INACTIVE' as const,
      createdAt: '2024-01-08',
    },
  ];

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex px-2 py-1 text-xs font-medium rounded-full';
    
    switch (status) {
      case 'ACTIVE':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'INACTIVE':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'SUSPENDED':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <>
      <Head title="Merchant Management" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Merchant Management</h1>
            <p className="text-gray-600">Manage merchant accounts and monitor their status.</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
            Add New Merchant
          </button>
        </div>

        {/* Merchants Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Merchants</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {merchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{merchant.name}</p>
                        <p className="text-sm text-gray-500">{merchant.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {merchant.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {merchant.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(merchant.status)}>
                        {merchant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(merchant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Edit
                        </button>
                        {merchant.status === 'ACTIVE' ? (
                          <button className="text-red-600 hover:text-red-900">
                            Suspend
                          </button>
                        ) : (
                          <button className="text-green-600 hover:text-green-900">
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export const Component = Merchants;
export default Merchants;
