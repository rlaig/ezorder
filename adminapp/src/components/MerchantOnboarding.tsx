/**
 * Merchant Onboarding Component
 * Handles the complete merchant registration process with user account creation
 */

import React, { useState } from 'react';
import { useCreateMerchant } from '../hooks/useMerchants';

interface MerchantOnboardingProps {
  onSuccess?: (merchant: any) => void;
  onCancel?: () => void;
}

export const MerchantOnboarding: React.FC<MerchantOnboardingProps> = ({
  onSuccess,
  onCancel,
}) => {
  const createMerchant = useCreateMerchant();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Business Information
    business_name: '',
    address: '',
    phone: '',
    gcash_number: '',
    
    // Account Information
    email: '',
    
    // Terms acceptance
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.business_name.trim()) {
      newErrors.business_name = 'Business name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    try {
      const merchant = await createMerchant.mutateAsync({
        business_name: formData.business_name,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        gcash_number: formData.gcash_number || undefined,
      });
      
      onSuccess?.(merchant);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create merchant account' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Merchant Onboarding
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Create a new merchant account to get started with {import.meta.env.VITE_BRAND_NAME || 'EZOrder'}
        </p>
        
        {/* Progress indicator */}
        <div className="mt-4 flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Business Info</span>
          <span>Review & Submit</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Business Information
            </h3>
            
            {/* Business Name */}
            <div>
              <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                id="business_name"
                name="business_name"
                required
                value={formData.business_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.business_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Your restaurant name"
              />
              {errors.business_name && (
                <p className="text-sm text-red-600 mt-1">{errors.business_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="merchant@restaurant.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                This will be used for login and communication
              </p>
            </div>

            {/* Phone and GCash */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="09XX XXX XXXX"
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
                  value={formData.gcash_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="09XX XXX XXXX"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Business Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Complete business address"
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Review & Confirm
            </h3>
            
            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Business Name:</span>
                  <p className="text-sm text-gray-900">{formData.business_name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-sm text-gray-900">{formData.email}</p>
                </div>
                {formData.phone && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phone:</span>
                    <p className="text-sm text-gray-900">{formData.phone}</p>
                  </div>
                )}
                {formData.gcash_number && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">GCash:</span>
                    <p className="text-sm text-gray-900">{formData.gcash_number}</p>
                  </div>
                )}
              </div>
              
              {formData.address && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Address:</span>
                  <p className="text-sm text-gray-900">{formData.address}</p>
                </div>
              )}
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Important Information:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• A user account will be created with email: <strong>{formData.email}</strong></li>
                <li>• A temporary password will be generated (merchant will need to reset)</li>
                <li>• The merchant account will start with <strong>"Pending"</strong> status</li>
                <li>• Admin approval may be required before activation</li>
              </ul>
            </div>

            {/* Terms acceptance */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
                I accept the Terms of Service and Privacy Policy
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-600">{errors.acceptTerms}</p>
            )}

            {/* Submit error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary"
                disabled={createMerchant.isPending}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={createMerchant.isPending || !formData.acceptTerms}
              >
                {createMerchant.isPending ? 'Creating Account...' : 'Create Merchant Account'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
