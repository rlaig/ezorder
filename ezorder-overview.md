# EZOrder System Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Application Components](#3-application-components)
4. [User Workflows](#4-user-workflows)
5. [Technical Stack](#5-technical-stack)
6. [Implementation Guidelines](#6-implementation-guidelines)

---

## 1. Project Overview

### 1.1 Product Description
**EZOrder** is a contactless QR code-based ordering system that enables restaurants and retail shops to provide digital menu experiences for their customers.

### 1.2 Core Value Proposition
- **For Customers**: Scan QR code → Browse menu → Customize orders → Pay → Track status
- **For Merchants**: Manage menus → Process orders → Track performance → Analyze insights
- **For Admins**: Onboard merchants → Monitor platform → Manage settings → View analytics

### 1.3 Target Users
- **Primary**: Restaurants, cafes, retail shops
- **Secondary**: Fast food chains, food courts, pop-up stores
- **End Users**: Customers visiting venues

---

## 2. System Architecture

### 2.1 Application Structure
```
EZOrder Platform
├── Admin App (Mobile-optimized Web App)
│   ├── Admin Portal (Super-user interface)
│   └── Merchant Dashboard (Venue management)
└── User App (Mobile-optimized Web App)
    └── Customer Interface (QR code access)
```

### 2.2 Data Flow Overview
```
QR Code Scan → Menu Display → Order Creation → Payment → Order Processing → Status Updates → Completion
```

---

## 3. Application Components

### 3.1 Admin Portal Features

#### 3.1.1 Merchant Management
- **Registration System**
  - New merchant onboarding workflow
  - Account verification process
  - Business information collection
- **Account Status Control**
  - Active/Inactive/Suspended states
  - Account feature toggles
  - Subscription management
- **Business Metrics Dashboard**
  - Revenue tracking per merchant
  - Order volume statistics
  - Performance indicators
- **Menu & Settings Override**
  - Global menu item restrictions
  - Merchant configuration management
  - Bulk setting updates

#### 3.1.2 Global Settings
- **System Configuration**
  - Toggle support for loyalty program
  - Toggle review system

#### 3.1.3 Analytics & Reporting
- **Platform Metrics**
  - Total orders across all merchants
  - Revenue by region/time period
  - Active merchant count
- **Performance Reports**
  - System uptime statistics
  - Response time analytics
  - Error rate monitoring

#### 3.1.4 Support & Notifications
- **Ticketing System**
  - Merchant inquiry management
  - Issue categorization and routing
  - Response tracking and SLA monitoring
- **Alert Management**
  - System health monitoring
  - Critical issue notifications
  - Maintenance announcements
- **Communication Hub**
  - Broadcast messaging to merchants
  - Platform update notifications
  - Best practice sharing

### 3.2 Merchant Dashboard Features

#### 3.2.1 Menu Builder
- **Content Management**
  - Drag-and-drop category organization
  - Item creation with descriptions and images
  - Pricing and modifier configuration
- **Inventory Control**
  - Real-time out-of-stock toggles
  - Low inventory alerts
  - Automatic item disabling
- **Schedule Management**
  - Configurable lapsed time when Buzz or call staff will be allowable
  - Time-based menu availability (breakfast, lunch, dinner)
  - Special event menus
  - Seasonal item scheduling

#### 3.2.2 QR Code Generator
- **Code Creation**
  - Table-specific QR code generation
  - Zone-based codes (bar, patio, dining room)
  - Bulk generation tools
- **Code Management**
  - Downloadable PDF formats
  - QR code text display
  - Code regeneration capabilities
- **Tracking Integration**
  - Location-based order attribution
  - Table performance analytics
  - Code usage statistics

#### 3.2.3 Order Management
- **Order Queue Interface**
  - Real-time order display
  - Priority sorting algorithms
  - Batch processing capabilities
- **Status Workflow**
  - **Order Placed**: Initial order reception
  - **Paid**: Payment confirmation
  - **Preparing**: Active preparation phase
  - **Ready for Pickup**: Completion notification
  - **Completed**: Final confirmation
  - **Cancelled**: Cancellation with reason codes
- **Order Details View**
  - Complete item breakdown
  - Customer customizations
  - Special instructions highlighting
  - Payment method confirmation

#### 3.2.4 Payments & Invoicing
- **Payment Method Management**
  - Cash handling (default option)
  - GCash QR code integration
  - Custom payment QR code upload
  - Payment method availability toggles
- **Financial Reporting**
  - Daily/weekly/monthly order reports
  - Revenue breakdowns by payment method
  - Refund and cancellation tracking
- **Invoice Generation**
  - Automatic receipt creation
  - Tax calculation and reporting
  - Export capabilities (PDF, CSV)

#### 3.2.5 Insights & Analytics
- **Sales Analytics**
  - Item-level performance tracking
  - Category popularity analysis
  - Revenue trend identification
- **Operational Metrics**
  - Peak ordering time identification
  - Average preparation times
  - Order completion rates
- **Customer Analytics**
  - Guest device type analysis
  - Return customer identification
  - Ordering pattern analysis

### 3.3 User App Features

#### 3.3.1 Menu Explorer
- **Navigation System**
  - Category-based browsing
  - Search functionality with filters
  - Featured item highlights
- **Item Display**
  - High-quality image galleries
  - Detailed descriptions
  - Allergen warnings

#### 3.3.2 Item Customization
- **Modifier Selection**
  - Multiple choice options (size, spice level, etc)
  - Add-on selections with pricing
  - Replacement options
- **Quantity Controls**
  - Increment/decrement buttons
  - Bulk quantity input
  - Item limit enforcement
- **Special Instructions**
  - Free-text notes field
  - Predefined instruction templates
  - Character limit controls

#### 3.3.3 Cart & Checkout
- **Order Summary**
  - Itemized list with modifications
  - Price breakdown with taxes/fees
  - Order total calculation
- **Payment Processing**
  - Payment method selection
  - GCash QR code display and scanning
  - Cash order confirmation
  - Payment verification workflow

#### 3.3.4 Order Tracking
- **Status Display**
  - Real-time progress bar
  - Stage-specific messaging
- **Notification System**
  - Order status change alerts
  - Pickup ready notifications

#### 3.3.5 Feedback & Loyalty
- **Review System**
  - Post-order rating prompts
  - Comment submission
- **Loyalty Program**
  - Point earning system
  - Guest profile creation (optional)
  - Reward redemption interface
  - Anonymous order tracking


---

## 4. User Workflows

### 4.1 Customer Order Journey

#### Step 1: QR Code Access
- **Action**: Customer scans table/location QR code
- **Process**: 
  - QR code contains venue ID and table/location identifier
  - System generates session URL with embedded parameters
  - Mobile browser opens User App interface
- **Requirements**: No mandatory login (guest checkout available)
- **Optional**: Customer profile login for loyalty tracking

#### Step 2: Menu Browsing
- **Action**: Digital menu loads automatically
- **Features Available**:
  - Category navigation
  - Item search and filtering
  - Image viewing and descriptions
  - Price and availability checking
- **Performance**: Instant loading with cached content

#### Step 3: Order Customization
- **Action**: Customer selects items and modifies as needed
- **Capabilities**:
  - Modifier selection (size, spice level, add-ons)
  - Quantity adjustment
  - Real-time price calculation
- **Validation**: Item availability and modification limits

#### Step 4: Cart Review & Payment
- **Cart Review**:
  - Order summary with itemized breakdown
  - Total calculation including taxes/fees
  - Final modification opportunities
- **Payment Selection**:
  - Cash order (pay on pickup)
  - GCash QR code scanning
  - Payment method validation
- **Confirmation**: Order submission with payment verification

#### Step 5: Order Tracking
- **Status Monitoring**:
  - Track Order transaction ID
  - Real-time status bar updates (15-second intervals)
  - When order is being prepared show elapsed time
  - Stage-specific messaging
- **Communication Options**:
  - Order status notifications
  - Buzz or notify staff when certain elapsed time is reached
- **Completion**: Pickup notification and feedback prompt

### 4.2 Merchant Order Processing Workflow

#### Phase 1: Order Reception
- **Trigger**: Customer payment confirmation
- **Notifications**:
  - Audible alert in merchant dashboard
  - Visual notification on screen
- **Order Display**:
  - Complete order details
  - Customer information (if account logged in)
  - Table/location identifier
  - Payment method confirmation
- **Initial Actions**:
  - Order acceptance/rejection options
  - Special instruction review

#### Phase 2: Order Processing
- **Status Management**:
  - Manual status updates through dashboard
  - Kitchen display integration
- **Workflow States**:
  1. **Order Placed**: Order queued for review
  2. **Paid**: Payment confirmed, moved to preparation queue
  3. **Preparing**: Active preparation with elapsed time showing
  4. **Ready for Pickup**: Completion with customer notification
  5. **Completed**: Customer pickup confirmation
  6. **Cancelled**: Cancellation with reason (available at any time)
- **Kitchen Integration**:
  - Priority queue display
  - Item-level completion tracking
  - Special instruction highlighting
  - Elapsed time monitoring

#### Phase 3: Exception Handling
- **Cancellation Process**:
  - Refund processing (if applicable)
  - Customer notification
  - Reason code documentation
- **Inventory Management**:
  - Real-time out-of-stock updates

#### Phase 4: Communication & Updates
- **Customer Notifications**:
  - Automatic status change alerts
  - Web app real-time updates
- **Performance Tracking**:
  - Order completion time monitoring
  - Customer satisfaction correlation

#### Phase 5: Order Completion
- **Completion Process**:
  - Customer pickup confirmation
  - Order archival
  - Feedback request initiation (if system enabled)
- **Analytics Update**:
  - Performance metric calculation
  - Trend analysis data collection
  - Report generation preparation

---

## 5. Technical Stack

### 5.1 Frontend Technologies
- **Framework**: TypeScript React.js
- **Design Approach**: Mobile-first responsive design
- **UI Components**: Reusable component library
- **State Management**: React hooks and context
- **Styling**: CSS-in-JS or Tailwind CSS

### 5.2 Backend Infrastructure
- **Primary Backend**: Pocketbase
  - Database management
  - User authentication
  - API endpoints
  - File storage
- **Real-time Communication**: 
  - WebSockets for live updates
  - Node.js + Express API
  - Socket.io server implementation
- **Payment Integration**:
  - GCash API integration
  - QR code generation libraries
  - Payment verification systems

### 5.3 Database Architecture
- **Database System**: Pocketbase (SQLite-based)
- **Key Collections**:
  - Users (admins, merchants, customers)
  - Merchants (business information, settings)
  - Menus (items, categories, modifiers)
  - Orders (order details, status tracking)
  - Payments (transaction records)
  - QR Codes (code mapping, analytics)

### 5.4 Hosting & Deployment
- **Hosting**: Self-hosted VPS
- **SSL**: Certificate management
- **CDN**: Static asset delivery
- **Backup**: Automated database backups
- **Monitoring**: Uptime and performance tracking

---

## 6. Implementation Guidelines

### 6.1 Development Phases
1. **Phase 1**: Core user app and basic merchant dashboard
2. **Phase 2**: Advanced merchant features and admin portal
3. **Phase 3**: Analytics, insights, and optimization features
4. **Phase 4**: Loyalty programs and advanced integrations

### 6.2 Security Requirements
- **Data Protection**: HTTPS enforcement, data encryption
- **Authentication**: Secure login systems, session management
- **Payment Security**: PCI compliance considerations
- **Access Control**: Role-based permissions

### 6.3 Performance Targets
- **Page Load Time**: < 3 seconds on mobile networks
- **Order Processing**: < 30 seconds from payment to merchant notification
- **Real-time Updates**: < 5 second delay for status changes
- **System Availability**: 99.9% uptime target

### 6.4 Mobile Optimization
- **Responsive Design**: Optimized for mobile screens
- **Touch Interface**: Large buttons, easy navigation
- **Offline Capability**: Basic functionality without internet
- **Progressive Web App**: App-like experience in browsers

---

This comprehensive documentation provides a structured reference for development teams, product managers, and AI agents to understand and implement the EZOrder system effectively. The system balances rapid MVP delivery with scalable architecture to transform in-venue ordering experiences.

