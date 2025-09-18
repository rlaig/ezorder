import { Head } from '@/components/seo';

const Menu = () => {
  // Mock data for menu management
  const menuCategories = [
    {
      id: '1',
      name: 'Main Dishes',
      description: 'Hearty meals and rice bowls',
      itemCount: 8,
      isActive: true,
    },
    {
      id: '2',
      name: 'Beverages',
      description: 'Hot and cold drinks',
      itemCount: 6,
      isActive: true,
    },
    {
      id: '3',
      name: 'Appetizers',
      description: 'Starters and sides',
      itemCount: 4,
      isActive: true,
    },
  ];

  const menuItems = [
    {
      id: '1',
      name: 'Chicken Adobo Rice Bowl',
      description: 'Traditional Filipino chicken adobo served over steamed rice',
      price: 195,
      categoryId: '1',
      category: 'Main Dishes',
      imageUrl: null,
      isAvailable: true,
    },
    {
      id: '2',
      name: 'Pork Sisig Rice Bowl',
      description: 'Sizzling pork sisig served with rice and topped with egg',
      price: 215,
      categoryId: '1',
      category: 'Main Dishes',
      imageUrl: null,
      isAvailable: true,
    },
    {
      id: '3',
      name: 'Iced Coffee',
      description: 'Freshly brewed coffee served over ice',
      price: 85,
      categoryId: '2',
      category: 'Beverages',
      imageUrl: null,
      isAvailable: false,
    },
  ];

  return (
    <>
      <Head title="Menu Management" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-600">Organize your menu categories and items.</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium">
              Add Category
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
              Add Menu Item
            </button>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <div className="flex space-x-1">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{category.itemCount} items</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    category.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₱{item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          Edit
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          {item.isAvailable ? 'Hide' : 'Show'}
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
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

export const Component = Menu;
export default Menu;
