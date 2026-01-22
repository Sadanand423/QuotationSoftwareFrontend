import React from 'react';

const EmployeeDashboard = () => {
  const stats = [
    { title: 'My Quotations', value: '24', color: 'from-blue-500 to-blue-600', icon: '📋', change: '+8%' },
    { title: 'Pending Approval', value: '5', color: 'from-yellow-500 to-orange-500', icon: '⏳', change: '+2%' },
    { title: 'Approved This Month', value: '18', color: 'from-green-500 to-emerald-500', icon: '✅', change: '+15%' },
    { title: 'My Clients', value: '12', color: 'from-purple-500 to-pink-500', icon: '👥', change: '+10%' }
  ];

  const recentQuotations = [
    { id: 'Q-2024-045', client: 'ABC Corp', amount: '$15,000', status: 'Pending', priority: 'high' },
    { id: 'Q-2024-044', client: 'XYZ Ltd', amount: '$8,500', status: 'Approved', priority: 'medium' },
    { id: 'Q-2024-043', client: 'Tech Solutions', amount: '$22,000', status: 'Draft', priority: 'low' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-gray-500 mt-2">Welcome back! Here's what's happening with your work today.</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
          <span className="font-semibold">📅 {new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"></div>
            <div className="relative bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-2xl">{stat.icon}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="mr-2">📈</span>
              Recent Quotations
            </h3>
            <p className="text-blue-100 text-sm mt-1">Latest quotation activities</p>
          </div>
          <div className="p-6 space-y-4">
            {recentQuotations.map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    quote.priority === 'high' ? 'bg-red-400' :
                    quote.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></div>
                  <div>
                    <p className="font-semibold text-gray-800">{quote.id}</p>
                    <p className="text-sm text-gray-500">{quote.client}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{quote.amount}</p>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    quote.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    quote.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="mr-2">⚡</span>
              Quick Actions
            </h3>
            <p className="text-green-100 text-sm mt-1">Streamline your workflow</p>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>📋</span>
              <span>Create New Quotation</span>
            </button>
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>👥</span>
              <span>Add New Client</span>
            </button>
            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>📈</span>
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;