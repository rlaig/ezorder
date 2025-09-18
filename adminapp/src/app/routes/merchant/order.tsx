import { useParams } from 'react-router';
import { Head } from '@/components/seo';

const OrderDetail = () => {
  const { orderId } = useParams();

  return (
    <>
      <Head title="Order Details" />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600">Viewing details for order ID: {orderId}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-500">Order detail view will be implemented here.</p>
        </div>
      </div>
    </>
  );
};

export const Component = OrderDetail;
export default OrderDetail;
