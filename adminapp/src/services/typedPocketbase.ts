/**
 * Type-safe PocketBase service layer
 * Automatically handles transformations between Database and Frontend types
 */

import PocketBase from 'pocketbase';
import type { CollectionName, DatabaseRecord } from '../types/database';
import { transformers, type TransformerKey } from '../types/transformers';

// Initialize PocketBase with types
class TypedPocketBase extends PocketBase {
  /**
   * Type-safe collection getter with automatic transformations
   */
  typedCollection<T extends CollectionName>(name: T) {
    const baseCollection = super.collection(name);
    
    return {
      ...baseCollection,
      
      // Override getOne with type safety and transformation
      async getOne<K extends TransformerKey>(
        id: string,
        options?: any,
        transformerKey?: K
      ): Promise<K extends TransformerKey ? ReturnType<typeof transformers[K]['toFrontend']> : DatabaseRecord<T>> {
        const record = await baseCollection.getOne(id, options);
        
        if (transformerKey && transformerKey in transformers) {
          return transformers[transformerKey].toFrontend(record as any) as any;
        }
        
        return record as any;
      },

      // Override getList with type safety and transformation
      async getList<K extends TransformerKey>(
        page: number = 1,
        perPage: number = 30,
        options?: any,
        transformerKey?: K
      ) {
        const result = await baseCollection.getList(page, perPage, options);
        
        if (transformerKey && transformerKey in transformers) {
          const transformedItems = result.items.map(item => 
            transformers[transformerKey].toFrontend(item as any)
          );
          
          return {
            ...result,
            items: transformedItems as any[],
          };
        }
        
        return result;
      },

      // Override create with transformation support
      async create<K extends TransformerKey>(
        bodyParams: any,
        transformerKey?: K,
        options?: any
      ): Promise<K extends TransformerKey ? ReturnType<typeof transformers[K]['toFrontend']> : DatabaseRecord<T>> {
        // If we have a transformer and the body contains frontend data, transform it first
        let transformedBody = bodyParams;
        if (transformerKey && transformerKey in transformers && bodyParams) {
          transformedBody = transformers[transformerKey].toDatabase(bodyParams);
        }
        
        const record = await baseCollection.create(transformedBody, options);
        
        if (transformerKey && transformerKey in transformers) {
          return transformers[transformerKey].toFrontend(record as any) as any;
        }
        
        return record as any;
      },

      // Override update with transformation support
      async update<K extends TransformerKey>(
        id: string,
        bodyParams: any,
        transformerKey?: K,
        options?: any
      ): Promise<K extends TransformerKey ? ReturnType<typeof transformers[K]['toFrontend']> : DatabaseRecord<T>> {
        // Transform frontend data to database format if transformer provided
        let transformedBody = bodyParams;
        if (transformerKey && transformerKey in transformers && bodyParams) {
          transformedBody = transformers[transformerKey].toDatabase(bodyParams);
        }
        
        const record = await baseCollection.update(id, transformedBody, options);
        
        if (transformerKey && transformerKey in transformers) {
          return transformers[transformerKey].toFrontend(record as any) as any;
        }
        
        return record as any;
      },

      // Override getFullList with transformation support
      async getFullList<K extends TransformerKey>(
        options?: any,
        transformerKey?: K
      ) {
        const records = await baseCollection.getFullList(options);
        
        if (transformerKey && transformerKey in transformers) {
          return records.map(record => 
            transformers[transformerKey].toFrontend(record as any)
          ) as any[];
        }
        
        return records;
      },
    };
  }
}

// Create typed instance
export const typedPb = new TypedPocketBase(
  import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090'
);

// Disable auto cancellation
typedPb.autoCancellation(false);

// Export collection names for type safety
export { COLLECTION_NAMES as Collections } from '../types/database';

// Type-safe collection access with transformers
export const collections = {
  merchants: () => typedPb.typedCollection('merchants'),
  menuCategories: () => typedPb.typedCollection('menu_categories'),
  menuItems: () => typedPb.typedCollection('menu_items'),
  orders: () => typedPb.typedCollection('orders'),
  orderItems: () => typedPb.typedCollection('order_items'),
  qrCodes: () => typedPb.typedCollection('qr_codes'),
  payments: () => typedPb.typedCollection('payments'),
  users: () => typedPb.typedCollection('users'),
} as const;

// Example usage with automatic transformations:
/*
// Get merchant with automatic transformation to frontend type
const merchant = await collections.merchants().getOne('merchant_id', {}, 'merchant');
// merchant is now typed as Frontend.Merchant with computed properties

// Create menu item with frontend data
const newItem = await collections.menuItems().create({
  name: 'Chicken Adobo',
  price: 150,
  isAvailable: true, // Frontend field name
  // ... other frontend fields
}, 'menuItem');
// Automatically transforms to database fields and back to frontend type

// Get orders with transformation
const orders = await collections.orders().getList(1, 20, {
  filter: 'merchant_id = "some_id"'
}, 'order');
// orders.items are typed as Frontend.Order[] with computed properties
*/
