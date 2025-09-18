import { useParams } from 'react-router';
import { Head } from '@/components/seo';

const MerchantDetail = () => {
  const { merchantId } = useParams();

  return (
    <>
      <Head title="Merchant Details" />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Merchant Details</h1>
          <p className="text-gray-600">Viewing details for merchant ID: {merchantId}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-500">Merchant detail view will be implemented here.</p>
        </div>
      </div>
    </>
  );
};

export const Component = MerchantDetail;
export default MerchantDetail;
