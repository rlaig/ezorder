import { Head } from '@/components/seo';

const AdminSettings = () => {
  return (
    <>
      <Head title="Platform Settings" />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600">Configure platform-wide settings and policies.</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-500">Platform settings will be implemented here.</p>
        </div>
      </div>
    </>
  );
};

export const Component = AdminSettings;
export default AdminSettings;
