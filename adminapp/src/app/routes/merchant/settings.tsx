import { Head } from '@/components/seo';

const MerchantSettings = () => {
  return (
    <>
      <Head title="Merchant Settings" />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Settings</h1>
          <p className="text-gray-600">Manage your restaurant profile and preferences.</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-500">Merchant settings will be implemented here.</p>
        </div>
      </div>
    </>
  );
};

export const Component = MerchantSettings;
export default MerchantSettings;
