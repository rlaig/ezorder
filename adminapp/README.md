# EZOrder Admin App

This is the admin application for the EZOrder platform, providing interfaces for both system administrators and merchant owners.

## Features

- **Admin Portal**: Platform management for super-users
- **Merchant Dashboard**: Restaurant management for venue owners
- **Authentication**: Role-based access control
- **Real-time Updates**: Live order tracking and notifications
- **Mobile-First Design**: Responsive interface optimized for mobile devices

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: PocketBase integration
- **State Management**: React Context API
- **Routing**: React Router v6

## Development Setup

1. **Install dependencies**:
   ```bash
   yarn install
   ```

2. **Environment Configuration**:
   - Copy `.env.example` to `.env`
   - Update `VITE_POCKETBASE_URL` with your PocketBase server URL

3. **Start development server**:
   ```bash
   yarn dev
   ```

4. **Build for production**:
   ```bash
   yarn build
   ```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
│   ├── admin/         # Admin portal pages
│   └── merchant/      # Merchant dashboard pages
├── layouts/           # Layout components
├── hooks/             # Custom React hooks
├── services/          # API services and utilities
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
```

## Phase 1 Features (Completed)

✅ Authentication system with role-based access  
✅ Basic admin and merchant dashboard layouts  
✅ PocketBase integration for backend services  
✅ Responsive design foundation  
✅ TypeScript configuration  
✅ Component and service architecture  

## Next Steps (Phase 1 Continuation)

- Implement merchant profile management
- Build basic menu management functionality
- Create order queue interface
- Add QR code generation features
- Set up real-time order updates

## Contributing

This project follows the MVP development plan outlined in `docs/admin-mvp.md`. Please refer to that document for detailed feature requirements and development phases.