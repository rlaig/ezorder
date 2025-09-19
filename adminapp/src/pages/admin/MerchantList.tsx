import React, { useState } from 'react';
import { useMerchants, useCreateMerchant } from '../../hooks/useMerchants';

export const MerchantList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: merchantsData, isLoading } = useMerchants(currentPage, 20);
  const createMerchant = useCreateMerchant();

  const [newMerchant, setNewMerchant] = useState({
    business_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    gcash_number: '',
    verifyImmediately: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const merchants = merchantsData?.items || [];
  const totalPages = merchantsData?.totalPages || 1;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!newMerchant.business_name.trim()) {
      errors.business_name = 'Business name is required';
    }

    if (!newMerchant.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMerchant.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!newMerchant.password) {
      errors.password = 'Password is required';
    } else if (newMerchant.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (newMerchant.password !== newMerchant.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await createMerchant.mutateAsync({
        business_name: newMerchant.business_name,
        email: newMerchant.email,
        password: newMerchant.password,
        phone: newMerchant.phone || undefined,
        address: newMerchant.address || undefined,
        gcash_number: newMerchant.gcash_number || undefined,
        verifyImmediately: newMerchant.verifyImmediately,
      } as any);
      
      // Show success message with verification note if applicable
      if (newMerchant.verifyImmediately) {
        alert('Merchant account created successfully!\n\nNote: Automatic email verification is not available due to PocketBase constraints. You can manually verify the user through the PocketBase admin dashboard if needed.');
      }
      
      setNewMerchant({
        business_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        gcash_number: '',
        verifyImmediately: false,
      });
      setFormErrors({});
      setShowCreateForm(false);
    } catch (error: any) {
      setFormErrors({ submit: error.message || 'Failed to create merchant account' });
      console.error('Failed to create merchant:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Merchant Management</h1>
          <p className="text-sm text-gray-600">
            Manage restaurant partners and their accounts
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          Add Merchant
        </button>
      </div>

      {/* Create Merchant Form */}
      {showCreateForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Merchant</h3>
          <form onSubmit={handleCreateMerchant} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="merchantName" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="merchantName"
                  required
                  value={newMerchant.business_name}
                  onChange={(e) => {
                    setNewMerchant(prev => ({ ...prev, business_name: e.target.value }));
                    if (formErrors.business_name) setFormErrors(prev => ({ ...prev, business_name: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    formErrors.business_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Restaurant name"
                />
                {formErrors.business_name && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.business_name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="merchantEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="merchantEmail"
                  required
                  value={newMerchant.email}
                  onChange={(e) => {
                    setNewMerchant(prev => ({ ...prev, email: e.target.value }));
                    if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="merchant@restaurant.com"
                />
                {formErrors.email && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">This will be the login email</p>
              </div>
            </div>

            {/* Account Security */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Account Security</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="merchantPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="merchantPassword"
                    required
                    value={newMerchant.password}
                    onChange={(e) => {
                      setNewMerchant(prev => ({ ...prev, password: e.target.value }));
                      if (formErrors.password) setFormErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      formErrors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter password"
                  />
                  {formErrors.password && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    required
                    value={newMerchant.confirmPassword}
                    onChange={(e) => {
                      setNewMerchant(prev => ({ ...prev, confirmPassword: e.target.value }));
                      if (formErrors.confirmPassword) setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm password"
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
              
              {/* Verification Toggle */}
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="verifyImmediately"
                  checked={newMerchant.verifyImmediately}
                  onChange={(e) => setNewMerchant(prev => ({ ...prev, verifyImmediately: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="verifyImmediately" className="ml-2 text-sm text-gray-700">
                  Verify account immediately (skip email verification)
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                If unchecked, merchant will need to verify email before logging in
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="merchantPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="merchantPhone"
                  value={newMerchant.phone}
                  onChange={(e) => setNewMerchant(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+63 9XX XXX XXXX"
                />
              </div>
              
              <div>
                <label htmlFor="merchantAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="merchantAddress"
                  value={newMerchant.address}
                  onChange={(e) => setNewMerchant(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Business address"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewMerchant({
                    business_name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    phone: '',
                    address: '',
                    gcash_number: '',
                    verifyImmediately: false,
                  });
                  setFormErrors({});
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMerchant.isPending}
                className="btn-primary"
              >
                {createMerchant.isPending ? 'Creating Account...' : 'Create Merchant Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Merchants List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : merchants.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Merchants Yet</h3>
          <p className="text-gray-600 mb-4">Add your first merchant to get started</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Add First Merchant
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
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
                        <div className="text-sm font-medium text-gray-900">
                          {merchant.business_name}
                        </div>
                        {merchant.address && (
                          <div className="text-sm text-gray-500">
                            {merchant.address}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{merchant.phone || 'N/A'}</div>
                      <div className="text-sm text-gray-500">
                        {merchant.gcash_number ? `GCash: ${merchant.gcash_number}` : 'No GCash'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(merchant.status)}`}>
                        {merchant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(merchant.created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-4">
                        View
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
