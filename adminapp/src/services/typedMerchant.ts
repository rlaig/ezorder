/**
 * Example: Type-safe Merchant Service using the new type system
 * This demonstrates how the new type system prevents field misalignment issues
 */

import { collections } from './typedPocketbase';
import { validators, createTypeSafeApiCall } from '../utils/typeValidation';
import type { Frontend, Form } from '../types/frontend';
import type { PaginatedResponse } from '../types';

export class TypedMerchantService {
  /**
   * Get all merchants with automatic type transformation and validation
   */
  static getAllMerchants = createTypeSafeApiCall(
    async (params: { page?: number; perPage?: number }): Promise<PaginatedResponse<Frontend.Merchant>> => {
      const { page = 1, perPage = 20 } = params;
      
      const result = await collections.merchants().getList(page, perPage, {
        sort: '-created',
      }, 'merchant'); // Automatically transforms to Frontend.Merchant[]
      
      return {
        items: result.items,
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      };
    },
    // Input validation (optional)
    undefined,
    // Output validation (runs in development only)
    (result) => {
      result.items.forEach(merchant => validators.merchantFrontend(merchant));
    }
  );

  /**
   * Get single merchant by ID
   */
  static getMerchant = createTypeSafeApiCall(
    async (id: string): Promise<Frontend.Merchant> => {
      return await collections.merchants().getOne(id, {}, 'merchant');
    },
    // Input validation
    (id: string) => {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid merchant ID');
      }
    },
    // Output validation
    (result) => validators.merchantFrontend(result)
  );

  /**
   * Create new merchant - uses frontend-friendly field names
   */
  static createMerchant = createTypeSafeApiCall(
    async (data: Form.MerchantProfile & { userId: string; status: Frontend.Merchant['status'] }): Promise<Frontend.Merchant> => {
      // The typedPocketbase service automatically transforms frontend fields to database fields
      return await collections.merchants().create(data, 'merchant');
    },
    // Input validation - ensures we're using the right field names
    (data) => {
      if (!data.businessName) {
        throw new Error('businessName is required (not business_name)');
      }
      if (!data.userId) {
        throw new Error('userId is required (not user_id)');
      }
      // This will warn if we accidentally use database field names
      validators.merchantFrontend(data);
    },
    // Output validation
    (result) => validators.merchantFrontend(result)
  );

  /**
   * Update merchant profile
   */
  static updateMerchant = createTypeSafeApiCall(
    async (params: { id: string; data: Form.MerchantProfile }): Promise<Frontend.Merchant> => {
      const { id, data } = params;
      
      // Automatic field transformation and type safety
      return await collections.merchants().update(id, data, 'merchant');
    },
    // Input validation
    (params) => {
      if (!params.id) throw new Error('Merchant ID is required');
      validators.merchantFrontend(params.data);
    },
    // Output validation
    (result) => validators.merchantFrontend(result)
  );
}

// Usage Examples (these would be in your React components):

/*
// ✅ GOOD: Uses frontend-friendly field names
const merchant = await TypedMerchantService.createMerchant({
  userId: 'user123',
  businessName: 'Pizza Palace',  // Frontend field name
  phone: '09123456789',
  gcashNumber: '09123456789',    // Frontend field name
  status: 'active'
});

// ❌ BAD: This would throw a validation error in development
const merchant = await TypedMerchantService.createMerchant({
  user_id: 'user123',           // ❌ Database field name - validation error!
  business_name: 'Pizza Palace', // ❌ Database field name - validation error!
  phone: '09123456789',
  gcash_number: '09123456789',  // ❌ Database field name - validation error!
  status: 'active'
});

// ✅ GOOD: Type-safe access to transformed data
const merchants = await TypedMerchantService.getAllMerchants({ page: 1 });
merchants.items.forEach(merchant => {
  console.log(merchant.businessName); // ✅ Frontend field name
  console.log(merchant.displayName);  // ✅ Computed property
  console.log(merchant.statusColor);  // ✅ Computed property
  console.log(merchant.isActive);     // ✅ Computed boolean
});

// ❌ TypeScript Error: These properties don't exist on Frontend.Merchant
// console.log(merchant.business_name); // ❌ Compile error!
// console.log(merchant.user_id);       // ❌ Compile error!
*/
