import { Head } from '@/components/seo';

const MerchantAnalytics = () => {
  return (
    <>
      <Head title="Merchant Analytics" />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your restaurant's performance and customer insights.</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-500">Merchant analytics dashboard will be implemented here.</p>
        </div>
      </div>
    </>
  );
};

export const Component = MerchantAnalytics;
export default MerchantAnalytics;
