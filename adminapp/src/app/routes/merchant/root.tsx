import { Outlet } from 'react-router';
import { MerchantLayout } from '@/components/layouts/merchant-layout';

export default function MerchantRoot() {
  return (
    <MerchantLayout>
      <Outlet />
    </MerchantLayout>
  );
}

export function ErrorBoundary() {
  return (
    <MerchantLayout>
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-lg font-semibold text-red-900 mb-2">Something went wrong</h1>
          <p className="text-red-700">An unexpected error occurred in the merchant dashboard.</p>
        </div>
      </div>
    </MerchantLayout>
  );
}
