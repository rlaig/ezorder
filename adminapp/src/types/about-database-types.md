# Type System Migration Guide

## Overview

This new type system prevents database-frontend field misalignment issues by:

1. **Separating Database and Frontend types**
2. **Automatic field transformations**
3. **Runtime validation in development**
4. **Computed properties for UI**
5. **Type-safe API layer**

## Benefits

### ✅ Prevents Field Misalignment
```typescript
// OLD: Error-prone manual field mapping
const merchant = {
  name: data.name,           // ❌ Wrong! Database uses 'business_name'
  merchantId: data.merchantId // ❌ Wrong! Database uses 'merchant_id'
};

// NEW: Automatic transformation
const merchant = await collections.merchants().create(data, 'merchant');
// ✅ Automatically maps businessName → business_name
```

### ✅ Compile-Time Type Safety
```typescript
// OLD: No type checking on field names
order.total;        // ❌ Runtime error - field doesn't exist
order.paymentMethod; // ❌ Runtime error - field doesn't exist

// NEW: Compile-time checking
order.totalAmount;   // ✅ Correct frontend field name
order.formattedTotal; // ✅ Computed property available
```

### ✅ Development-Time Validation
```typescript
// Catches field name mistakes in development
const merchant = {
  business_name: 'Test',  // ❌ Development warning: Use 'businessName'
  user_id: '123'          // ❌ Development warning: Use 'userId'
};
```

## Migration Strategy

### Phase 1: Install New Type System (✅ Complete)
- Added `types/database.ts` - Exact database schema
- Added `types/frontend.ts` - UI-optimized types
- Added `types/transformers.ts` - Automatic field mapping
- Added `services/typedPocketbase.ts` - Type-safe PocketBase wrapper
- Added `utils/typeValidation.ts` - Runtime validation

### Phase 2: Gradual Service Migration
Replace existing services one-by-one:

```typescript
// OLD SERVICE
export class MerchantService {
  static async getMerchant(id: string): Promise<Merchant> {
    const record = await pb.collection('merchants').getOne(id);
    return record as Merchant; // ❌ Manual casting, no validation
  }
}

// NEW SERVICE  
export class TypedMerchantService {
  static getMerchant = createTypeSafeApiCall(
    async (id: string): Promise<Frontend.Merchant> => {
      return await collections.merchants().getOne(id, {}, 'merchant');
      // ✅ Automatic transformation + validation
    },
    (id) => { /* input validation */ },
    (result) => validators.merchantFrontend(result)
  );
}
```

### Phase 3: Update Components
Use frontend-friendly field names:

```typescript
// OLD COMPONENT
const MerchantProfile = () => {
  const [name, setName] = useState(merchant?.name || ''); // ❌ Wrong field

  return (
    <input 
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
};

// NEW COMPONENT
const MerchantProfile = () => {
  const [businessName, setBusinessName] = useState(merchant?.businessName || ''); // ✅ Correct

  return (
    <input 
      value={businessName}
      onChange={(e) => setBusinessName(e.target.value)}
    />
  );
};
```

## Type Definitions

### Database Types
```typescript
namespace Database {
  interface Merchants {
    user_id: string;        // Database field names
    business_name: string;  
    gcash_number?: string;
  }
}
```

### Frontend Types  
```typescript
namespace Frontend {
  interface Merchant {
    userId: string;         // Frontend field names
    businessName: string;
    gcashNumber?: string;
    
    // Computed properties
    displayName: string;
    statusColor: 'green' | 'red' | 'yellow';
    isActive: boolean;
  }
}
```

### Transformers
```typescript
const transformers = {
  merchant: {
    toFrontend: (db: Database.Merchants): Frontend.Merchant => ({
      userId: db.user_id,              // ✅ Automatic field mapping
      businessName: db.business_name,  
      gcashNumber: db.gcash_number,
      displayName: db.business_name,   // ✅ Computed property
      isActive: db.status === 'active' // ✅ Computed boolean
    }),
    toDatabase: (frontend: Partial<Frontend.Merchant>) => ({
      user_id: frontend.userId,            // ✅ Reverse mapping
      business_name: frontend.businessName,
      gcash_number: frontend.gcashNumber
    })
  }
};
```

## Best Practices

### 1. Always Use Frontend Types in Components
```typescript
// ✅ GOOD
interface Props {
  merchant: Frontend.Merchant;
}

// ❌ BAD  
interface Props {
  merchant: Database.Merchants;
}
```

### 2. Use TypedPocketBase Service
```typescript
// ✅ GOOD
const merchant = await collections.merchants().getOne(id, {}, 'merchant');
// Returns Frontend.Merchant with computed properties

// ❌ BAD
const record = await pb.collection('merchants').getOne(id);
const merchant = record as Merchant; // No validation, no computed properties
```

### 3. Leverage Computed Properties
```typescript
// ✅ GOOD
<Badge color={merchant.statusColor}>
  {merchant.statusLabel}
</Badge>
<Text>{merchant.formattedPrice}</Text>

// ❌ BAD - Manual computation in component
<Badge color={merchant.status === 'active' ? 'green' : 'red'}>
  {merchant.status.toUpperCase()}
</Badge>
```

### 4. Use Form Types for Inputs
```typescript
// ✅ GOOD
const updateMerchant = (data: Frontend.Form.MerchantProfile) => {
  // Only includes editable fields
};

// ❌ BAD
const updateMerchant = (data: Partial<Frontend.Merchant>) => {
  // Includes read-only computed properties
};
```

## Development Workflow

1. **Define Database Schema** in `types/database.ts`
2. **Create Frontend Types** in `types/frontend.ts` 
3. **Add Transformer** in `types/transformers.ts`
4. **Use TypedPocketBase** in services
5. **Components use Frontend types** only
6. **Validation catches errors** in development

This system ensures field misalignments are caught at compile-time (TypeScript) and runtime (development validation), preventing the issues we just fixed from happening again.
