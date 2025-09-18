import { Head } from '@/components/seo';
import { useState } from 'react';

const QRCodes = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for QR codes
  const qrCodes = [
    {
      id: '1',
      name: 'Table 1',
      customerUrl: 'https://ezorder.app/menu/merchant123/table1',
      qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO...',
      isActive: true,
      createdAt: new Date('2024-01-15'),
      scanCount: 24,
    },
    {
      id: '2', 
      name: 'Table 2',
      customerUrl: 'https://ezorder.app/menu/merchant123/table2',
      qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO...',
      isActive: true,
      createdAt: new Date('2024-01-15'),
      scanCount: 18,
    },
    {
      id: '3',
      name: 'Counter',
      customerUrl: 'https://ezorder.app/menu/merchant123/counter',
      qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO...',
      isActive: false,
      createdAt: new Date('2024-01-12'),
      scanCount: 5,
    },
  ];

  const handleDownloadQR = (qrCode: typeof qrCodes[0]) => {
    // This will be implemented with actual QR code generation
    console.log(`Downloading QR code for ${qrCode.name}`);
  };

  const handleToggleActive = (id: string) => {
    console.log(`Toggling active status for QR code ${id}`);
  };

  const handleDeleteQR = (id: string) => {
    console.log(`Deleting QR code ${id}`);
  };

  return (
    <>
      <Head title="QR Code Management" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QR Code Management</h1>
            <p className="text-gray-600">
              Create and manage QR codes for your tables and ordering zones.
            </p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Create QR Code
          </button>
        </div>

        {/* QR Code Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Total QR Codes</p>
                <p className="text-2xl font-semibold text-gray-900">{qrCodes.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Active QR Codes</p>
                <p className="text-2xl font-semibold text-green-600">
                  {qrCodes.filter(qr => qr.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Total Scans</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* QR Codes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qrCode) => (
            <div key={qrCode.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* QR Code Preview */}
              <div className="p-6 bg-gray-50 text-center">
                <div className="w-32 h-32 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-3">
                  {/* Placeholder for QR code image */}
                  <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{qrCode.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Created {qrCode.createdAt.toLocaleDateString()}
                </p>
              </div>

              {/* QR Code Details */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    qrCode.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {qrCode.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-sm text-gray-500">{qrCode.scanCount} scans</span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Customer URL:</p>
                  <p className="text-xs text-gray-700 break-all bg-gray-50 p-2 rounded">
                    {qrCode.customerUrl}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleDownloadQR(qrCode)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 font-medium text-sm"
                  >
                    Download
                  </button>
                  <button 
                    onClick={() => handleToggleActive(qrCode.id)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm ${
                      qrCode.isActive 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {qrCode.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button 
                    onClick={() => handleDeleteQR(qrCode.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {qrCodes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes yet</h3>
            <p className="text-gray-500 mb-4">Create your first QR code to start accepting orders.</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Create QR Code
            </button>
          </div>
        )}

        {/* Create QR Code Modal (placeholder) */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New QR Code</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    QR Code Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Table 1, Counter, Zone A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium">
                    Create QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const Component = QRCodes;
export default QRCodes;
