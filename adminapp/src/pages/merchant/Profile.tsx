import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMerchant, useUpdateMerchant } from '../../hooks/useMerchants';
import type { Database } from '../../types/database';

export const MerchantProfile: React.FC = () => {
  const { user } = useAuth();
  const { data: merchant, isLoading, error } = useMerchant(user?.id || '');
  const updateMerchant = useUpdateMerchant();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Database.Merchants>>({
    business_name: '',
    phone: '',
    address: '',
    gcash_number: '',
  });

  React.useEffect(() => {
    if (merchant) {
      setFormData({
        business_name: merchant.business_name || '',
        phone: merchant.phone || '',
        address: merchant.address || '',
        gcash_number: merchant.gcash_number || '',
      });
    }
  }, [merchant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await updateMerchant.mutateAsync({
        id: user.id,
        data: formData,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<Database.Merchants>) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center text-red-600">
          <p>Failed to load profile information</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
          <p className="text-sm text-gray-600">
            Manage your restaurant information and settings
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      id="business_name"
                      name="business_name"
                      required
                      disabled={!isEditing}
                      value={formData.business_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Your restaurant name"
                    />
                  </div>

                  <div>
                    <label htmlFor="gcash_number" className="block text-sm font-medium text-gray-700 mb-1">
                      GCash Number
                    </label>
                    <input
                      type="text"
                      id="gcash_number"
                      name="gcash_number"
                      disabled={!isEditing}
                      value={formData.gcash_number}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="09XX XXX XXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="+63 9XX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <input
                      type="text"
                      value={merchant?.status || 'Unknown'}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 capitalize"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    disabled={!isEditing}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Complete business address"
                  />
                </div>


                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form data
                        if (merchant) {
                          setFormData({
                            business_name: merchant.business_name || '',
                            phone: merchant.phone || '',
                            address: merchant.address || '',
                            gcash_number: merchant.gcash_number || '',
                          });
                        }
                      }}
                      className="btn-secondary"
                      disabled={updateMerchant.isPending}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={updateMerchant.isPending}
                    >
                      {updateMerchant.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Profile Summary & Actions */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account Type</span>
                <span className="text-sm font-medium text-gray-900">Merchant</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  merchant?.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {merchant?.status || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium text-gray-900">
                  {merchant?.created ? new Date(merchant.created).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-secondary text-left">
                Change Password
              </button>
              <button className="w-full btn-secondary text-left">
                Upload Logo
              </button>
              <button className="w-full btn-secondary text-left">
                Business Hours
              </button>
              <button className="w-full btn-secondary text-left">
                Payment Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
