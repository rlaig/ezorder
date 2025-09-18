import { Head } from '@/components/seo';

const AdminAnalytics = () => {
  return (
    <>
      <Head title="Platform Analytics" />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600">Monitor platform performance and merchant activity.</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-500">Analytics dashboard will be implemented here.</p>
        </div>
      </div>
    </>
  );
};

export const Component = AdminAnalytics;
export default AdminAnalytics;
