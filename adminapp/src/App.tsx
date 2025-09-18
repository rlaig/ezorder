import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { MerchantLayout } from './layouts/MerchantLayout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { MerchantDashboard } from './pages/merchant/Dashboard';
import './App.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="merchants" element={<div>Merchants Page (Coming Soon)</div>} />
            <Route path="analytics" element={<div>Analytics Page (Coming Soon)</div>} />
            <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
          </Route>

          {/* Merchant Routes */}
          <Route path="/merchant" element={
            <ProtectedRoute allowedRoles={['merchant']}>
              <MerchantLayout />
            </ProtectedRoute>
          }>
            <Route index element={<MerchantDashboard />} />
            <Route path="orders" element={<div>Orders Page (Coming Soon)</div>} />
            <Route path="menu" element={<div>Menu Management Page (Coming Soon)</div>} />
            <Route path="qr-codes" element={<div>QR Codes Page (Coming Soon)</div>} />
            <Route path="analytics" element={<div>Analytics Page (Coming Soon)</div>} />
            <Route path="profile" element={<div>Profile Page (Coming Soon)</div>} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
                <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
              </div>
            </div>
          } />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">404 - Page Not Found</h1>
                <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
              </div>
            </div>
          } />
        </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;