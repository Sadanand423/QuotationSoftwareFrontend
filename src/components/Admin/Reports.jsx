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
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        Reports & Analytics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <h3 className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">{stat.label}</h3>
            <div className="flex items-center justify-between">
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</p>
              <span className="text-xs sm:text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {reportTypes.map((report, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl sm:text-3xl">{report.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{report.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{report.description}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium">
                Generate
              </button>
              <button className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium">
                Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <span className="mr-2">📄</span>
          Recent Reports
        </h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 gap-2">
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm sm:text-base">Monthly Revenue Report - January 2024</p>
              <p className="text-xs sm:text-sm text-gray-600">Generated on Jan 31, 2024</p>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105 font-medium text-sm">
              Download
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 gap-2">
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm sm:text-base">Client Activity Report - Q4 2023</p>
              <p className="text-xs sm:text-sm text-gray-600">Generated on Dec 31, 2023</p>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105 font-medium text-sm">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;