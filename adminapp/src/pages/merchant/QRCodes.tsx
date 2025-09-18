import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MerchantService } from '../../services';
import type { Database } from '../../types/database';

export const QRCodes: React.FC = () => {
  const { user } = useAuth();
  const merchantId = user?.id || '';
  
  const [qrCodes, setQrCodes] = useState<Database.QrCodes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [newQrCode, setNewQrCode] = useState({
    name: '',
    tableNumber: '',
    zone: '',
  });

  React.useEffect(() => {
    if (merchantId) {
      loadQRCodes();
    }
  }, [merchantId]);

  const loadQRCodes = async () => {
    try {
      setIsLoading(true);
      const codes = await MerchantService.getQRCodes(merchantId);
      setQrCodes(codes);
    } catch (error) {
      console.error('Failed to load QR codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCodeUrl = (code: string) => {
    const baseUrl = window.location.origin.replace(':3001', ':3000'); // Assuming user app on port 3000
    return `${baseUrl}/menu/${merchantId}?qr=${code}`;
  };

  const handleCreateQRCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;

    try {
      const code = `${merchantId}-${Date.now()}`;
      const qrCode = await MerchantService.createQRCode({
        merchant_id: merchantId,
        table_identifier: newQrCode.tableNumber || undefined,
        location_identifier: newQrCode.zone || undefined,
        code,
        active: true,
        usage_count: 0,
      });
      
      setQrCodes(prev => [qrCode, ...prev]);
      setNewQrCode({ name: '', tableNumber: '', zone: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create QR code:', error);
    }
  };

  const downloadQRCode = (qrCode: Database.QrCodes) => {
    // Generate QR code using a simple library-free approach
    // In production, you'd use a proper QR code library
    const url = generateQRCodeUrl(qrCode.code);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    
    const link = document.createElement('a');
    link.href = qrUrl;
    const filename = qrCode.table_identifier || qrCode.location_identifier || qrCode.code;
    link.download = `${filename.replace(/[^a-z0-9]/gi, '_')}_QR.png`;
    link.target = '_blank';
    link.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to show a toast notification here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Code Management</h1>
          <p className="text-sm text-gray-600">
            Generate and manage QR codes for tables and zones
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          Generate QR Code
        </button>
      </div>

      {/* Create QR Code Form */}
      {showCreateForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New QR Code</h3>
          <form onSubmit={handleCreateQRCode} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="qrName" className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code Name *
                </label>
                <input
                  type="text"
                  id="qrName"
                  required
                  value={newQrCode.name}
                  onChange={(e) => setNewQrCode(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Table 1, Main Dining"
                />
              </div>
              
              <div>
                <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Table Number
                </label>
                <input
                  type="text"
                  id="tableNumber"
                  value={newQrCode.tableNumber}
                  onChange={(e) => setNewQrCode(prev => ({ ...prev, tableNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 1, A1"
                />
              </div>
              
              <div>
                <label htmlFor="zone" className="block text-sm font-medium text-gray-700 mb-1">
                  Zone/Area
                </label>
                <input
                  type="text"
                  id="zone"
                  value={newQrCode.zone}
                  onChange={(e) => setNewQrCode(prev => ({ ...prev, zone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Patio, VIP"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewQrCode({ name: '', tableNumber: '', zone: '' });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Generate QR Code
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QR Codes List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : qrCodes.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 8h4.01" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No QR Codes Yet</h3>
          <p className="text-gray-600 mb-4">Generate your first QR code to get started</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Generate First QR Code
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qrCode) => (
            <div key={qrCode.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {qrCode.table_identifier || qrCode.location_identifier || 'QR Code'}
                  </h3>
                  <div className="mt-2 space-y-1">
                    {qrCode.table_identifier && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Table:</span> {qrCode.table_identifier}
                      </p>
                    )}
                    {qrCode.location_identifier && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Zone:</span> {qrCode.location_identifier}
                      </p>
                    )}
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  qrCode.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {qrCode.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* QR Code Preview */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg text-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(generateQRCodeUrl(qrCode.code))}`}
                  alt={`QR Code for ${qrCode.table_identifier || qrCode.location_identifier || 'QR Code'}`}
                  className="mx-auto"
                />
              </div>

              {/* URL Display */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Menu URL:
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={generateQRCodeUrl(qrCode.code)}
                    readOnly
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l-lg bg-gray-50 text-gray-600"
                  />
                  <button
                    onClick={() => copyToClipboard(generateQRCodeUrl(qrCode.code))}
                    className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 border border-l-0 border-gray-300 rounded-r-lg"
                    title="Copy URL"
                  >
                    📋
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Created: {new Date(qrCode.created).toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadQRCode(qrCode)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    title="Download QR Code"
                  >
                    Download
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              How to use QR Codes
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Print the downloaded QR codes and place them on your tables</li>
                <li>Customers scan the QR code to access your menu directly on their phones</li>
                <li>Orders placed through QR codes will appear in your Order Queue</li>
                <li>Each QR code includes table information for easy order tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
