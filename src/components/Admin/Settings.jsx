import React, { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'quotation', label: 'Quotation Settings' },
    { id: 'email', label: 'Email Templates' },
    { id: 'security', label: 'Security' }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Settings</h2>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <input type="text" defaultValue="Your Company Name" className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company Address</label>
                <textarea defaultValue="123 Business St, City, State 12345" className="w-full border p-2 rounded" rows="3"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input type="tel" defaultValue="+1-555-0123" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" defaultValue="info@company.com" className="w-full border p-2 rounded" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quotation' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Default Tax Rate (%)</label>
                <input type="number" defaultValue="10" className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quotation Validity (Days)</label>
                <input type="number" defaultValue="30" className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Auto-numbering Format</label>
                <select className="w-full border p-2 rounded">
                  <option>Q-YYYY-NNN</option>
                  <option>QUOTE-YYYY-NNN</option>
                  <option>QT-YYYYMM-NNN</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Quotation Email Subject</label>
                <input type="text" defaultValue="Your Quotation - {QUOTE_ID}" className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Template</label>
                <textarea 
                  defaultValue="Dear {CLIENT_NAME},&#10;&#10;Please find attached your quotation {QUOTE_ID}.&#10;&#10;Best regards,&#10;{COMPANY_NAME}"
                  className="w-full border p-2 rounded" 
                  rows="6"
                ></textarea>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Require password change every 90 days</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Enable two-factor authentication</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                <input type="number" defaultValue="60" className="w-full border p-2 rounded" />
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-6 pt-6 border-t">
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
              Save Changes
            </button>
            <button className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;