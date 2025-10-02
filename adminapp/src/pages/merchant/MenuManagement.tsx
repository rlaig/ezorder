import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMerchantByUserId } from '../../hooks/useMerchants';
import { 
  useMenuCategories, 
  useMenuItems, 
  useCreateMenuCategory, 
  useCreateMenuItem, 
  useUpdateMenuCategory, 
  useUpdateMenuItem, 
  useDeleteMenuCategory, 
  useDeleteMenuItem
} from '../../hooks/useMenu';
import { ModifierManagement } from '../../components/ModifierManagement';
import type { Database } from '../../types/database';

export const MenuManagement: React.FC = () => {
  const { user } = useAuth();
  const { data: merchant, isLoading: merchantLoading } = useMerchantByUserId(user?.id || '');
  const merchantId = merchant?.id || '';
  
  const { data: categories = [], isLoading: categoriesLoading } = useMenuCategories(merchantId);
  const { data: menuItems = [], isLoading: itemsLoading } = useMenuItems(merchantId);
  const createCategory = useCreateMenuCategory();
  const createItem = useCreateMenuItem();
  const updateCategory = useUpdateMenuCategory();
  const updateItem = useUpdateMenuItem();
  const deleteCategory = useDeleteMenuCategory();
  const deleteItem = useDeleteMenuItem();

  const [activeTab, setActiveTab] = useState<'categories' | 'items'>('categories');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Database.MenuCategories | null>(null);
  const [editingItem, setEditingItem] = useState<Database.MenuItems | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'item' | 'modifier'; id: string; name: string; itemId?: string } | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [viewingCategoryItems, setViewingCategoryItems] = useState<string | null>(null);
  const [modifierManagementItem, setModifierManagementItem] = useState<{ id: string; name: string } | null>(null);
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  });
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
  });

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;

    try {
      if (editingCategory) {
        // Update existing category
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: {
            name: newCategory.name,
            description: newCategory.description,
          },
        });
      } else {
        // Create new category
        await createCategory.mutateAsync({
          merchant_id: merchantId,
          name: newCategory.name,
          description: newCategory.description,
          sort_order: categories.length,
          enabled: true,
        });
      }
      
      setNewCategory({ name: '', description: '' });
      setShowCategoryForm(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId || !newItem.categoryId) return;

    try {
      if (editingItem) {
        // Update existing item
        await updateItem.mutateAsync({
          id: editingItem.id,
          data: {
            name: newItem.name,
            description: newItem.description,
            price: parseFloat(newItem.price),
            category_id: newItem.categoryId,
          },
        });
      } else {
        // Create new item
        await createItem.mutateAsync({
          merchant_id: merchantId,
          category_id: newItem.categoryId,
          name: newItem.name,
          description: newItem.description,
          price: parseFloat(newItem.price),
          available: true,
          featured: false,
          sort_order: menuItems.length,
        });
      }
      
      setNewItem({ name: '', description: '', price: '', categoryId: '' });
      setShowItemForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const handleEditCategory = (category: Database.MenuCategories) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description || '',
    });
    setShowCategoryForm(true);
    setOpenDropdown(null);
  };

  const handleEditItem = (item: Database.MenuItems) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      categoryId: item.category_id,
    });
    setShowItemForm(true);
    setOpenDropdown(null);
  };

  const handleDeleteCategory = (category: Database.MenuCategories) => {
    const categoryItems = menuItems.filter(item => item.category_id === category.id);
    
    if (categoryItems.length > 0) {
      // Don't allow deletion if there are items in the category
      return;
    }
    
    setDeleteTarget({ type: 'category', id: category.id, name: category.name });
    setShowDeleteDialog(true);
    setOpenDropdown(null);
  };

  const handleDeleteItem = (item: Database.MenuItems) => {
    setDeleteTarget({ type: 'item', id: item.id, name: item.name });
    setShowDeleteDialog(true);
    setOpenDropdown(null);
  };

  const handleViewCategoryItems = (categoryId: string) => {
    setViewingCategoryItems(viewingCategoryItems === categoryId ? null : categoryId);
    setOpenDropdown(null);
  };

  const handleViewItemModifiers = (itemId: string) => {
    const item = menuItems.find(item => item.id === itemId);
    if (item) {
      setModifierManagementItem({ id: item.id, name: item.name });
    }
    setOpenDropdown(null);
  };

  const getCategoryItemCount = (categoryId: string): number => {
    return menuItems.filter(item => item.category_id === categoryId).length;
  };

  const canDeleteCategory = (categoryId: string): boolean => {
    return getCategoryItemCount(categoryId) === 0;
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !merchantId) return;

    try {
      if (deleteTarget.type === 'category') {
        await deleteCategory.mutateAsync({ id: deleteTarget.id, merchantId });
      } else if (deleteTarget.type === 'item') {
        await deleteItem.mutateAsync({ id: deleteTarget.id, merchantId });
      }
      
      setShowDeleteDialog(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const cancelForm = () => {
    setShowCategoryForm(false);
    setShowItemForm(false);
    setEditingCategory(null);
    setEditingItem(null);
    setNewCategory({ name: '', description: '' });
    setNewItem({ name: '', description: '', price: '', categoryId: '' });
    setViewingCategoryItems(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-sm text-gray-600">
            Organize your menu categories and items
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'items'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Menu Items ({menuItems.length})
          </button>
        </nav>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Menu Categories</h2>
            <button
              onClick={() => setShowCategoryForm(true)}
              className="btn-primary"
            >
              Add Category
            </button>
          </div>

          {/* Add Category Form */}
          {showCategoryForm && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    required
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Appetizers, Main Dishes"
                  />
                </div>
                
                <div>
                  <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="categoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Optional description for this category"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createCategory.isPending || updateCategory.isPending}
                    className="btn-primary"
                  >
                    {(createCategory.isPending || updateCategory.isPending) 
                      ? (editingCategory ? 'Updating...' : 'Creating...')
                      : (editingCategory ? 'Update Category' : 'Create Category')
                    }
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Categories List */}
          {categoriesLoading || merchantLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Yet</h3>
              <p className="text-gray-600 mb-4">Start by creating your first menu category</p>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="btn-primary"
              >
                Add First Category
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        )}
                        <div className="flex items-center mt-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            category.enabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {category.enabled ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-xs text-gray-500 ml-3">
                            {menuItems.filter(item => item.category_id === category.id).length} items
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <button 
                          onClick={() => setOpenDropdown(openDropdown === category.id ? null : category.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        
                        {openDropdown === category.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Category
                              </button>
                              
                              {getCategoryItemCount(category.id) > 0 && (
                                <button
                                  onClick={() => handleViewCategoryItems(category.id)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View Items ({getCategoryItemCount(category.id)})
                                </button>
                              )}
                              
                              {canDeleteCategory(category.id) ? (
                                <button
                                  onClick={() => handleDeleteCategory(category)}
                                  className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete Category
                                </button>
                              ) : (
                                <div className="px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.860-.833-2.630 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    Cannot delete - has {getCategoryItemCount(category.id)} item{getCategoryItemCount(category.id) !== 1 ? 's' : ''}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Expanded category items view */}
              {categories.map((category) => (
                viewingCategoryItems === category.id && getCategoryItemCount(category.id) > 0 && (
                  <div key={`expanded-${category.id}`} className="border border-gray-200 rounded-lg bg-gray-50">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-100 rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          Items in "{category.name}"
                        </h4>
                        <button
                          onClick={() => setViewingCategoryItems(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {menuItems
                          .filter(item => item.category_id === category.id)
                          .map((item) => (
                            <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 text-sm">{item.name}</h5>
                                  {item.description && (
                                    <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                                  )}
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm font-semibold text-primary-600">
                                      ₱{item.price.toFixed(2)}
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                      item.available 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {item.available ? 'Available' : 'Out of Stock'}
                                    </span>
                                  </div>
                                </div>
                                <div className="relative ml-2">
                                  <button 
                                    onClick={() => setOpenDropdown(openDropdown === `item-${item.id}` ? null : `item-${item.id}`)}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                  </button>
                                  
                                  {openDropdown === `item-${item.id}` && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                                      <div className="py-1">
                                        <button
                                          onClick={() => handleEditItem(item)}
                                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                          <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                          </svg>
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteItem(item)}
                                          className="flex items-center px-3 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                                        >
                                          <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      )}

      {/* Menu Items Tab */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Menu Items</h2>
            <button
              onClick={() => setShowItemForm(true)}
              className="btn-primary"
              disabled={categories.length === 0}
            >
              Add Item
            </button>
          </div>

          {categories.length === 0 && (
            <div className="card">
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You need to create at least one category before adding menu items.</p>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="btn-primary"
                >
                  Create Categories First
                </button>
              </div>
            </div>
          )}

          {/* Add Item Form */}
          {showItemForm && categories.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <form onSubmit={handleCreateItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      id="itemName"
                      required
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Chicken Adobo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₱) *
                    </label>
                    <input
                      type="number"
                      id="itemPrice"
                      required
                      min="0"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="itemCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="itemCategory"
                    required
                    value={newItem.categoryId}
                    onChange={(e) => setNewItem(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="itemDescription"
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Describe your menu item..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createItem.isPending || updateItem.isPending}
                    className="btn-primary"
                  >
                    {(createItem.isPending || updateItem.isPending) 
                      ? (editingItem ? 'Updating...' : 'Creating...')
                      : (editingItem ? 'Update Item' : 'Create Item')
                    }
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Menu Items List */}
          {itemsLoading || merchantLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Menu Items Yet</h3>
              <p className="text-gray-600 mb-4">Add your first menu item to get started</p>
              {categories.length > 0 && (
                <button
                  onClick={() => setShowItemForm(true)}
                  className="btn-primary"
                >
                  Add First Item
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => {
                const categoryItems = menuItems.filter(item => item.category_id === category.id);
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category.id} className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryItems.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              )}
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-lg font-semibold text-primary-600">
                                  ₱{item.price.toFixed(2)}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.available 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.available ? 'Available' : 'Out of Stock'}
                                </span>
                              </div>
                            </div>
                            <div className="relative">
                              <button 
                                onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                                className="text-gray-400 hover:text-gray-600 ml-2"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </button>
                              
                              {openDropdown === item.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleEditItem(item)}
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Edit Item
                                    </button>
                                    <button
                                      onClick={() => handleViewItemModifiers(item.id)}
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                      </svg>
                                      View Modifiers
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem(item)}
                                      className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                                    >
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Delete Item
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && deleteTarget && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.860-.833-2.630 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">
                Delete {deleteTarget.type === 'category' ? 'Category' : 'Menu Item'}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{deleteTarget.name}"?
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setDeleteTarget(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={(deleteCategory.isPending || deleteItem.isPending)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {(deleteCategory.isPending || deleteItem.isPending) ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* Modifier Management Modal */}
      {modifierManagementItem && (
        <ModifierManagement
          itemId={modifierManagementItem.id}
          itemName={modifierManagementItem.name}
          merchantId={merchantId}
          onClose={() => setModifierManagementItem(null)}
        />
      )}
    </div>
  );
};
