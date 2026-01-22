import React from 'react';

const Reports = () => {
  const reportTypes = [
    { title: 'Quotation Summary', description: 'Overview of all quotations by status', icon: '📊' },
    { title: 'Revenue Report', description: 'Monthly and yearly revenue analysis', icon: '💰' },
    { title: 'Client Report', description: 'Client activity and engagement metrics', icon: '👥' },
    { title: 'Product Performance', description: 'Most requested products and services', icon: '📦' }
  ];

  const quickStats = [
    { label: 'This Month Revenue', value: '$125,000', change: '+15%' },
    { label: 'Quotations Sent', value: '89', change: '+8%' },
    { label: 'Conversion Rate', value: '68%', change: '+5%' },
    { label: 'Avg. Quote Value', value: '$12,500', change: '+12%' }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Reports & Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-500 mb-1">{stat.label}</h3>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{stat.value}</p>
              <span className="text-sm text-green-600">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {reportTypes.map((report, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-4">{report.icon}</span>
              <div>
                <h3 className="text-xl font-semibold">{report.title}</h3>
                <p className="text-gray-600">{report.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Generate
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Monthly Revenue Report - January 2024</p>
              <p className="text-sm text-gray-600">Generated on Jan 31, 2024</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800">Download</button>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Client Activity Report - Q4 2023</p>
              <p className="text-sm text-gray-600">Generated on Dec 31, 2023</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;