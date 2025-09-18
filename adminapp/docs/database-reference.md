# EZOrder Database Reference Guide

## Overview

This document provides a comprehensive reference for the EZOrder application database structure, relationships, and data flows. The system uses PocketBase as the backend database with 15 main collections supporting a restaurant ordering platform with multiple user roles and complex business logic.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [User Roles & Authentication](#user-roles--authentication)
3. [Collection Overview](#collection-overview)
4. [Entity Relationships](#entity-relationships)
5. [Data Flow Diagrams](#data-flow-diagrams)
6. [Access Control Rules](#access-control-rules)
7. [Business Logic Flows](#business-logic-flows)
8. [Collection Details](#collection-details)
9. [Data Validation Rules](#data-validation-rules)
10. [Integration Points](#integration-points)

---

## System Architecture

### Database Type: PocketBase
- **Collections**: 15 main collections
- **Auth System**: Built-in PocketBase authentication with custom roles
- **Real-time**: WebSocket support for live updates
- **File Storage**: Built-in file handling for images and documents

### Core Entities Hierarchy
```
Users (Auth Collection)
├── Merchants (Business entities)
│   ├── Menu Categories
│   ├── Menu Items
│   │   └── Menu Modifiers
│   ├── QR Codes
│   └── Analytics Events
├── Customers (End users)
└── Orders (Transaction records)
    ├── Order Items
    ├── Order Modifiers
    ├── Payments
    ├── Reviews
    └── Loyalty Points
```

---

## User Roles & Authentication

### Role Hierarchy
1. **super_admin** - Platform owner, full system access
2. **admin** - Platform administrators, limited system access
3. **merchant** - Business owners, restaurant management
4. **customer** - End users, ordering and reviews

### Authentication Flow
```
Login Request → PocketBase Auth → Role Verification → Access Control → Application Access
```

---

## Collection Overview

| Collection | Purpose | Key Relations | Access Level |
|------------|---------|---------------|--------------|
| `users` | Authentication & user profiles | → merchants, customers | Role-based |
| `merchants` | Restaurant business data | ← users, → orders | Owner + Admin |
| `menu_categories` | Menu organization | ← merchants, → menu_items | Public read |
| `menu_items` | Individual menu products | ← categories, → modifiers | Public read |
| `menu_modifiers` | Item customizations | ← menu_items | Public read |
| `qr_codes` | Table/location identifiers | ← merchants | Admin only |
| `customers` | Customer profiles | ← users, → orders | Owner only |
| `orders` | Transaction records | ← merchants, customers | Multi-role |
| `order_items` | Order line items | ← orders, menu_items | Order-based |
| `order_modifiers` | Item customizations in orders | ← order_items | Order-based |
| `payments` | Payment transactions | ← orders | Financial |
| `reviews` | Customer feedback | ← orders, customers | Public/Owner |
| `loyalty_points` | Reward system | ← customers, merchants | Owner only |
| `support_tickets` | Customer service | ← users, orders | Creator + Admin |
| `analytics_events` | Usage tracking | ← merchants, customers | Admin only |

---

## Entity Relationships

### Primary Relationships

#### 1. User → Business Entity
```
users (role: merchant) → merchants (1:1)
users (role: customer) → customers (1:1 optional)
```

#### 2. Merchant → Menu Structure
```
merchants → menu_categories (1:many)
menu_categories → menu_items (1:many)
menu_items → menu_modifiers (1:many)
```

#### 3. Order Processing Chain
```
customers + merchants + qr_codes → orders (many:1 each)
orders → order_items (1:many)
order_items → order_modifiers (1:many)
orders → payments (1:many)
```

#### 4. Post-Order Relations
```
orders → reviews (1:1 optional)
orders → loyalty_points (1:many)
orders → support_tickets (1:many optional)
```

### Foreign Key Mapping
- **merchants.user_id** → users.id (UNIQUE)
- **menu_categories.merchant_id** → merchants.id
- **menu_items.merchant_id** → merchants.id
- **menu_items.category_id** → menu_categories.id
- **menu_modifiers.item_id** → menu_items.id
- **qr_codes.merchant_id** → merchants.id
- **orders.merchant_id** → merchants.id
- **orders.customer_id** → customers.id (NULLABLE)
- **orders.qr_code_id** → qr_codes.id (NULLABLE)
- **order_items.order_id** → orders.id (CASCADE DELETE)
- **order_items.menu_item_id** → menu_items.id
- **order_modifiers.order_item_id** → order_items.id (CASCADE DELETE)
- **payments.order_id** → orders.id
- **reviews.order_id** → orders.id
- **support_tickets.created_by** → users.id

---

## Data Flow Diagrams

### 1. Customer Order Flow
```
QR Code Scan → Menu Browse → Item Selection → Customization → Cart → Checkout
     ↓              ↓            ↓             ↓           ↓        ↓
qr_codes → menu_items → menu_modifiers → cart (frontend) → orders → payments
                                                          ↓
                                                    order_items
                                                          ↓
                                                   order_modifiers
```

### 2. Merchant Order Management
```
Order Received → Status Update → Preparation → Ready → Completed
      ↓              ↓             ↓           ↓         ↓
   orders.status  → preparing  → ready → completed → reviews
                                                   → loyalty_points
```

### 3. Admin Oversight Flow
```
Merchant Registration → Approval → Menu Setup → QR Generation → Operations → Analytics
        ↓                 ↓           ↓            ↓             ↓            ↓
    users (merchant) → merchants → menu_items → qr_codes → orders → analytics_events
```

### 4. Support & Feedback Flow
```
Issue/Feedback → Ticket Creation → Assignment → Resolution
     ↓               ↓               ↓            ↓
Customer/Merchant → support_tickets → admin → resolved_at
                                       ↓
                               assigned_to (users)
```

---

## Access Control Rules

### Rule Categories

#### 1. Owner-Only Access
- **merchants**: `user_id = @request.auth.id`
- **customers**: `id = @request.auth.id`
- **loyalty_points**: `customer_id = @request.auth.id`

#### 2. Merchant Business Access
- **orders**: `merchant_id.user_id = @request.auth.id`
- **menu_items**: Can create/update if merchant role
- **qr_codes**: Merchant can manage their own codes

#### 3. Public Read Access
- **menu_categories**: Public read, merchant write
- **menu_items**: Public read, merchant write
- **menu_modifiers**: Public read, merchant write

#### 4. Admin-Only Access
- **analytics_events**: Admin/super_admin only
- **support_tickets**: Creator + admin access
- **merchants**: Admin can manage status

#### 5. Complex Multi-Role Access
```sql
-- Orders: Customer OR Merchant OR Admin
"customer_id = @request.auth.id || merchant_id.user_id = @request.auth.id || @request.auth.role = 'admin'"

-- Order Items: Through order relationship
"order_id.customer_id = @request.auth.id || order_id.merchant_id.user_id = @request.auth.id"
```

---

## Business Logic Flows

### 1. Merchant Onboarding Process
1. **User Registration** → `users` (role: merchant)
2. **Merchant Profile Creation** → `merchants` (status: pending)
3. **Admin Approval** → `merchants.status` = active
4. **Menu Setup** → `menu_categories` + `menu_items`
5. **QR Code Generation** → `qr_codes`

### 2. Order Processing Workflow
1. **Order Placement** → `orders` (status: placed)
2. **Order Confirmation** → Update status to confirmed
3. **Preparation** → Status: preparing
4. **Ready for Pickup** → Status: ready
5. **Order Completion** → Status: completed, set completed_at
6. **Optional Review** → `reviews` creation
7. **Loyalty Points** → `loyalty_points` calculation

### 3. Payment Processing
1. **Payment Initiation** → `payments` (status: pending)
2. **Payment Method Selection** → cash/gcash/card
3. **Transaction Processing** → External payment gateway
4. **Confirmation** → Update payment status to completed
5. **Order Status Update** → Trigger order confirmation

### 4. Analytics Event Tracking
```javascript
// Key events tracked
const trackingEvents = [
  'qr_scan',           // QR code access
  'menu_view',         // Menu browsing
  'item_view',         // Item details
  'add_to_cart',       // Cart additions
  'checkout_start',    // Checkout initiation
  'order_placed',      // Order completion
  'payment_completed', // Payment success
  'order_completed'    // Order fulfillment
];
```

---

## Collection Details

### users (Authentication Collection)
**Purpose**: Core authentication and user management
```javascript
{
  id: "text(15)",           // Auto-generated
  email: "email",           // Unique identifier
  password: "password(8+)", // Hashed
  name: "text(255)",        // Display name
  avatar: "file",           // Profile image
  role: "select",           // customer|merchant|admin|super_admin
  verified: "bool",         // Email verification
  created: "autodate",
  updated: "autodate"
}
```

### merchants (Business Profiles)
**Purpose**: Restaurant/business information and settings
```javascript
{
  id: "text(15)",
  user_id: "relation(users)", // 1:1 unique relationship
  business_name: "text(255)", // Required
  address: "text(500)",
  phone: "text(50)",
  gcash_number: "text(50)",   // Payment integration
  status: "select",           // pending|active|inactive|suspended
  settings: "json",           // Business configuration
  created: "autodate",
  updated: "autodate"
}
```

### menu_categories (Menu Organization)
**Purpose**: Organizing menu items into logical groups
```javascript
{
  id: "text(15)",
  merchant_id: "relation(merchants)",
  name: "text(100)",          // Required
  description: "text(500)",
  sort_order: "number",       // Display ordering
  enabled: "bool",            // Visibility control
  created: "autodate",
  updated: "autodate"
}
```

### menu_items (Products/Dishes)
**Purpose**: Individual menu items with pricing and details
```javascript
{
  id: "text(15)",
  merchant_id: "relation(merchants)",
  category_id: "relation(menu_categories)",
  name: "text(200)",          // Required
  description: "text(1000)",
  price: "number",            // Required, decimal
  image: "file",              // Product photo (5MB max)
  available: "bool",          // Stock status
  featured: "bool",           // Promotional flag
  sort_order: "number",
  allergens: "json",          // Allergy information
  dietary_info: "json",       // Vegan, gluten-free, etc.
  created: "autodate",
  updated: "autodate"
}
```

### menu_modifiers (Customization Options)
**Purpose**: Item customization and add-ons
```javascript
{
  id: "text(15)",
  item_id: "relation(menu_items)",
  name: "text(100)",           // "Size", "Extras", etc.
  type: "select",              // single_choice|multiple_choice|text_input
  options: "json",             // Available choices with prices
  required: "bool",            // Must be selected
  min_selections: "number",    // Minimum choices
  max_selections: "number",    // Maximum choices
  created: "autodate",
  updated: "autodate"
}
```

### qr_codes (Access Points)
**Purpose**: Table/location-specific access codes
```javascript
{
  id: "text(15)",
  merchant_id: "relation(merchants)",
  table_identifier: "text(100)",    // "Table 1", "Counter", etc.
  location_identifier: "text(100)", // Zone/area information
  code: "text(32)",                 // Unique access code
  active: "bool",                   // Enable/disable
  usage_count: "number",            // Tracking
  last_used: "datetime",            // Last access
  created: "autodate",
  updated: "autodate"
}
```

### customers (Customer Profiles)
**Purpose**: Customer information and preferences
```javascript
{
  id: "text(15)",
  name: "text(255)",
  phone: "text(50)",
  preferences: "json",        // Dietary, favorites, etc.
  created: "autodate",
  updated: "autodate"
}
```

### orders (Transaction Records)
**Purpose**: Order management and tracking
```javascript
{
  id: "text(15)",
  merchant_id: "relation(merchants)",     // Required
  customer_id: "relation(customers)",     // Optional (guest orders)
  qr_code_id: "relation(qr_codes)",      // Optional (tracking source)
  customer_name: "text(255)",            // Guest name
  customer_phone: "text(50)",            // Contact info
  status: "select",                      // placed|confirmed|preparing|ready|completed|cancelled
  total_amount: "number",                // Required, calculated total
  tax_amount: "number",                  // Tax calculation
  special_instructions: "text(1000)",    // Customer notes
  estimated_ready_time: "datetime",      // Preparation estimate
  completed_at: "datetime",              // Fulfillment time
  created: "autodate",
  updated: "autodate"
}
```

### order_items (Order Line Items)
**Purpose**: Individual items within orders
```javascript
{
  id: "text(15)",
  order_id: "relation(orders)",          // CASCADE DELETE
  menu_item_id: "relation(menu_items)",  // Product reference
  item_name: "text(200)",                // Snapshot of item name
  quantity: "number",                    // Required, min: 1
  unit_price: "number",                  // Price at time of order
  total_price: "number",                 // quantity × unit_price + modifiers
  special_instructions: "text(500)",     // Item-specific notes
  created: "autodate",
  updated: "autodate"
}
```

### order_modifiers (Order Customizations)
**Purpose**: Applied customizations to order items
```javascript
{
  id: "text(15)",
  order_item_id: "relation(order_items)", // CASCADE DELETE
  modifier_id: "relation(menu_modifiers)", // Optional reference
  modifier_name: "text(100)",              // Snapshot
  option_name: "text(100)",                // Selected option
  option_value: "text(500)",               // Custom input or choice
  price_adjustment: "number",              // Additional cost/discount
  created: "autodate",
  updated: "autodate"
}
```

### payments (Financial Transactions)
**Purpose**: Payment processing and tracking
```javascript
{
  id: "text(15)",
  order_id: "relation(orders)",
  method: "select",              // cash|gcash|card
  status: "select",              // pending|completed|failed|refunded
  amount: "number",              // Transaction amount
  transaction_id: "text(255)",   // External payment ID
  metadata: "json",              // Payment gateway data
  processed_at: "datetime",      // Completion time
  created: "autodate",
  updated: "autodate"
}
```

### reviews (Customer Feedback)
**Purpose**: Rating and review system
```javascript
{
  id: "text(15)",
  order_id: "relation(orders)",
  merchant_id: "relation(merchants)",
  customer_id: "relation(customers)",   // Optional
  rating: "number",                     // 1-5, required
  comment: "text(1000)",
  food_rating: "number",                // 1-5, optional
  service_rating: "number",             // 1-5, optional
  photos: "file[]",                     // Up to 5 images
  created: "autodate",
  updated: "autodate"
}
```

### loyalty_points (Reward System)
**Purpose**: Customer loyalty and rewards tracking
```javascript
{
  id: "text(15)",
  customer_id: "relation(customers)",
  merchant_id: "relation(merchants)",
  order_id: "relation(orders)",        // Optional link
  type: "select",                      // earned|redeemed|expired
  points: "number",                    // Point value (can be negative)
  description: "text(255)",           // Transaction description
  expires_at: "datetime",             // Expiration date
  created: "autodate",
  updated: "autodate"
}
```

### support_tickets (Customer Service)
**Purpose**: Issue tracking and customer support
```javascript
{
  id: "text(15)",
  created_by: "relation(users)",        // Ticket creator
  order_id: "relation(orders)",         // Optional order reference
  category: "select",                   // order_issue|payment_issue|technical_issue|feedback|other
  priority: "select",                   // low|medium|high|urgent
  status: "select",                     // open|in_progress|waiting_response|resolved|closed
  subject: "text(255)",                 // Required
  description: "text(2000)",            // Required, detailed issue
  assigned_to: "relation(users)",       // Admin assignment
  resolved_at: "datetime",              // Resolution time
  created: "autodate",
  updated: "autodate"
}
```

### analytics_events (Usage Tracking)
**Purpose**: User behavior and system analytics
```javascript
{
  id: "text(15)",
  merchant_id: "relation(merchants)",   // Optional
  customer_id: "relation(customers)",   // Optional
  event_type: "select",                 // qr_scan|menu_view|item_view|add_to_cart|checkout_start|order_placed|payment_completed|order_completed
  session_id: "text(255)",              // Session tracking
  metadata: "json",                     // Event-specific data
  user_agent: "text(500)",              // Browser/device info
  ip_address: "text(45)",               // IPv4/IPv6 address
  created: "autodate",
  updated: "autodate"
}
```

---

## Data Validation Rules

### Field Validation Patterns

#### Text Fields
- **IDs**: `^[a-z0-9]{15}$` (auto-generated)
- **Names**: 1-255 characters, required for core entities
- **Descriptions**: 0-1000+ characters, optional
- **Phone**: 0-50 characters, flexible format

#### Numeric Fields
- **Prices**: Non-negative decimals, required for menu items
- **Quantities**: Positive integers, min: 1
- **Ratings**: Integers 1-5, required for reviews
- **Points**: Can be negative (for redemptions)

#### Select Fields
- **Roles**: Strict enum validation
- **Status**: Workflow-appropriate values
- **Payment Methods**: Platform-supported options

#### File Uploads
- **Images**: JPEG, PNG, WebP only
- **Max Size**: 5MB per file
- **Thumbnails**: Auto-generated (100x100, 300x300)

### Business Logic Validation

#### Order Validation
1. **Total Calculation**: `sum(order_items.total_price) + tax_amount = total_amount`
2. **Status Progression**: Cannot skip workflow steps
3. **Merchant Match**: All order items must belong to same merchant
4. **Stock Availability**: Items must be available when ordered

#### Payment Validation
1. **Amount Match**: Payment amount must equal order total
2. **Method Availability**: Payment method must be enabled for merchant
3. **Transaction Uniqueness**: External transaction IDs must be unique

#### Menu Validation
1. **Price Consistency**: Menu item prices must be positive
2. **Category Association**: Items must belong to merchant's categories
3. **Modifier Logic**: Required modifiers must be present in orders

---

## Integration Points

### External System Connections

#### 1. Payment Gateways
- **GCash API**: QR code generation and verification
- **Card Processors**: Credit/debit card handling
- **Webhook Endpoints**: Payment status updates

#### 2. Notification Services
- **Email**: Order confirmations, status updates
- **SMS**: Critical order notifications
- **Push Notifications**: Real-time merchant alerts

#### 3. Analytics Platforms
- **Event Streaming**: Real-time analytics data
- **Reporting APIs**: Business intelligence integration
- **Performance Monitoring**: System health tracking

### Internal API Endpoints

#### Authentication
- `POST /auth/login` - User authentication
- `POST /auth/logout` - Session termination
- `POST /auth/refresh` - Token renewal

#### Merchant Management
- `GET /merchants/{id}` - Business profile
- `PUT /merchants/{id}` - Profile updates
- `POST /merchants/{id}/qr-codes` - QR generation

#### Menu Management
- `GET /merchants/{id}/menu` - Full menu structure
- `PUT /menu-items/{id}` - Item updates
- `POST /menu-categories` - Category creation

#### Order Processing
- `POST /orders` - Order creation
- `PUT /orders/{id}/status` - Status updates
- `GET /orders/{id}/items` - Order details

#### Analytics & Reporting
- `GET /analytics/merchants/{id}` - Business metrics
- `GET /reports/sales` - Revenue reports
- `POST /events` - Analytics event tracking

---

## Performance Considerations

### Database Optimization

#### Indexes
- **Primary Keys**: All collections have optimized text IDs
- **Foreign Keys**: Indexed for join performance
- **Search Fields**: Status, timestamps, merchant_id indexed
- **Unique Constraints**: Email, QR codes, transaction IDs

#### Query Patterns
- **Real-time Orders**: Efficient status filtering
- **Menu Loading**: Optimized category/item joins
- **Analytics**: Time-based aggregations
- **Search**: Full-text search on names/descriptions

### Scaling Strategies

#### Data Growth Management
- **Order Archival**: Move completed orders to archive tables
- **Event Retention**: Rotate analytics events (90-day retention)
- **File Cleanup**: Remove orphaned images
- **Log Management**: Separate operational logs

#### Performance Monitoring
- **Query Performance**: Track slow queries
- **Connection Pooling**: Optimize database connections
- **Caching**: Redis for frequently accessed data
- **CDN**: Static asset delivery

---

## Security & Privacy

### Data Protection

#### Sensitive Information
- **Payment Data**: PCI compliance requirements
- **Personal Information**: GDPR/privacy law compliance
- **Business Data**: Merchant competitive information
- **Analytics**: User behavior privacy

#### Access Controls
- **Role-Based Permissions**: Strict role enforcement
- **Data Isolation**: Merchant data segregation
- **API Security**: Rate limiting and authentication
- **Audit Logging**: Track all data modifications

### Backup & Recovery

#### Data Backup Strategy
- **Automated Backups**: Daily full backups
- **Point-in-Time Recovery**: Transaction log backups
- **Cross-Region Replication**: Disaster recovery
- **Backup Verification**: Regular restore testing

#### Business Continuity
- **High Availability**: Multi-node database setup
- **Failover Procedures**: Automated failover
- **Data Integrity**: Consistency checks
- **Recovery Testing**: Regular DR drills

---

## Development Guidelines

### Best Practices

#### Data Modeling
1. **Normalization**: Avoid data duplication
2. **Referential Integrity**: Proper foreign keys
3. **Versioning**: Track schema changes
4. **Documentation**: Keep this reference updated

#### API Development
1. **Consistent Naming**: Follow REST conventions
2. **Error Handling**: Standard error responses
3. **Validation**: Server-side validation always
4. **Testing**: Unit and integration tests

#### Security
1. **Input Sanitization**: Prevent injection attacks
2. **Authentication**: Verify all requests
3. **Authorization**: Check permissions before data access
4. **Logging**: Track security events

### Common Patterns

#### CRUD Operations
```javascript
// Standard CRUD with role checking
const createOrder = async (orderData, authUser) => {
  // 1. Validate input data
  // 2. Check user permissions
  // 3. Validate business rules
  // 4. Create order record
  // 5. Create related records (items, modifiers)
  // 6. Update analytics
  // 7. Send notifications
};
```

#### Real-time Updates
```javascript
// WebSocket event handling
const handleOrderStatusChange = (orderId, newStatus) => {
  // 1. Update database
  // 2. Broadcast to merchant dashboard
  // 3. Notify customer (if applicable)
  // 4. Trigger analytics event
  // 5. Update related systems
};
```

---

## Troubleshooting Guide

### Common Issues

#### Data Consistency Problems
- **Orphaned Records**: Regular cleanup jobs
- **Total Calculations**: Validation triggers
- **Status Conflicts**: State machine validation
- **Duplicate Prevention**: Unique constraints

#### Performance Issues
- **Slow Queries**: Index optimization
- **High Load**: Connection pooling
- **Memory Usage**: Query optimization
- **Disk Space**: Data archival

#### Integration Failures
- **Payment Gateway**: Retry mechanisms
- **Notification Services**: Fallback options
- **External APIs**: Circuit breakers
- **File Uploads**: Error handling

### Monitoring & Alerts

#### Key Metrics
- **Order Processing Time**: Average completion time
- **Payment Success Rate**: Transaction reliability
- **Error Rates**: System stability
- **User Activity**: Business health

#### Alert Thresholds
- **High Error Rate**: >5% in 5 minutes
- **Slow Response**: >2 seconds average
- **Failed Payments**: >10% failure rate
- **Database Locks**: Long-running queries

---

This document serves as the single source of truth for database structure and relationships within the EZOrder application. Keep it updated as the schema evolves and reference it for all development decisions involving data structure or business logic implementation.

**Last Updated**: [Current Date]  
**Schema Version**: 0.3.0  
**Document Version**: 1.0.0