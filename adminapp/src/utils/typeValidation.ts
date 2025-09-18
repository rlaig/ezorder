/**
 * Runtime type validation utilities
 * Helps catch field mismatches at development time
 */

import type { Database } from '../types/database';
import type { Frontend } from '../types/frontend';

// Field validation schemas
export const validationSchemas = {
  merchant: {
    database: {
      required: ['user_id', 'business_name', 'status'] as (keyof Database.Merchants)[],
      optional: ['address', 'phone', 'gcash_number', 'settings'] as (keyof Database.Merchants)[],
    },
    frontend: {
      required: ['userId', 'businessName', 'status'] as (keyof Frontend.Merchant)[],
      optional: ['address', 'phone', 'gcashNumber', 'settings'] as (keyof Frontend.Merchant)[],
    },
  },

  menuItem: {
    database: {
      required: ['merchant_id', 'category_id', 'name', 'price', 'available', 'featured', 'sort_order'] as (keyof Database.MenuItems)[],
      optional: ['description', 'image', 'allergens', 'dietary_info'] as (keyof Database.MenuItems)[],
    },
    frontend: {
      required: ['merchantId', 'categoryId', 'name', 'price', 'isAvailable', 'isFeatured', 'sortOrder'] as (keyof Frontend.MenuItem)[],
      optional: ['description', 'imageUrl', 'allergens', 'dietaryInfo'] as (keyof Frontend.MenuItem)[],
    },
  },

  order: {
    database: {
      required: ['merchant_id', 'status', 'total_amount'] as (keyof Database.Orders)[],
      optional: ['customer_id', 'qr_code_id', 'customer_name', 'customer_phone', 'tax_amount', 'special_instructions'] as (keyof Database.Orders)[],
    },
    frontend: {
      required: ['merchantId', 'status', 'totalAmount'] as (keyof Frontend.Order)[],
      optional: ['customerId', 'qrCodeId', 'customerName', 'customerPhone', 'taxAmount', 'specialInstructions'] as (keyof Frontend.Order)[],
    },
  },
} as const;

// Validation errors
export class TypeValidationError extends Error {
  public field?: string;
  public expectedType?: string;
  
  constructor(message: string, field?: string, expectedType?: string) {
    super(message);
    this.name = 'TypeValidationError';
    this.field = field;
    this.expectedType = expectedType;
  }
}

// Generic field validator
export function validateFields<T extends Record<string, any>>(
  data: T,
  schema: { required: string[], optional: string[] },
  typeName: string
): void {
  // Check required fields
  for (const field of schema.required) {
    if (!(field in data) || data[field] === undefined || data[field] === null) {
      throw new TypeValidationError(
        `Missing required field '${field}' in ${typeName}`,
        field,
        typeName
      );
    }
  }

  // Check for unexpected fields (helps catch typos)
  const allowedFields = new Set([...schema.required, ...schema.optional, 'id', 'created', 'updated']);
  const unexpectedFields = Object.keys(data).filter(field => !allowedFields.has(field));
  
  if (unexpectedFields.length > 0) {
    console.warn(`Unexpected fields in ${typeName}:`, unexpectedFields);
    console.warn('Expected fields:', [...allowedFields]);
  }
}

// Specific validators
export const validators = {
  merchantDatabase: (data: Partial<Database.Merchants>) => 
    validateFields(data, validationSchemas.merchant.database, 'Database.Merchants'),
  
  merchantFrontend: (data: Partial<Frontend.Merchant>) => 
    validateFields(data, validationSchemas.merchant.frontend, 'Frontend.Merchant'),
    
  menuItemDatabase: (data: Partial<Database.MenuItems>) => 
    validateFields(data, validationSchemas.menuItem.database, 'Database.MenuItems'),
    
  menuItemFrontend: (data: Partial<Frontend.MenuItem>) => 
    validateFields(data, validationSchemas.menuItem.frontend, 'Frontend.MenuItem'),
    
  orderDatabase: (data: Partial<Database.Orders>) => 
    validateFields(data, validationSchemas.order.database, 'Database.Orders'),
    
  orderFrontend: (data: Partial<Frontend.Order>) => 
    validateFields(data, validationSchemas.order.frontend, 'Frontend.Order'),
};

// Development-only runtime validation wrapper
export function validateInDevelopment<T>(validator: (data: T) => void, data: T): T {
  if (import.meta.env.DEV) {
    try {
      validator(data);
    } catch (error) {
      console.error('🚨 Type Validation Error:', error);
      // In development, we want to see these errors but not break the app
      // In production, validation is skipped for performance
    }
  }
  return data;
}

// Helper for creating type-safe API calls
export function createTypeSafeApiCall<TInput, TOutput>(
  apiCall: (input: TInput) => Promise<TOutput>,
  inputValidator?: (data: TInput) => void,
  outputValidator?: (data: TOutput) => void
) {
  return async (input: TInput): Promise<TOutput> => {
    // Validate input in development
    if (inputValidator && import.meta.env.DEV) {
      validateInDevelopment(inputValidator, input);
    }
    
    const result = await apiCall(input);
    
    // Validate output in development
    if (outputValidator && import.meta.env.DEV) {
      validateInDevelopment(outputValidator, result);
    }
    
    return result;
  };
}
