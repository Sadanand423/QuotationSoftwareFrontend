import React, { useState, useEffect } from 'react';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('overview');
  const [dateRange, setDateRange] = useState('thisMonth');
  const [quotations, setQuotations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    setQuotations(JSON.parse(localStorage.getItem('quotations') || '[]'));
    setEmployees(JSON.parse(localStorage.getItem('employees') || '[]'));
    setClients(JSON.parse(localStorage.getItem('clients') || '[]'));
  }, []);

  const reportTabs = [
    { id: 'overview', label: 'Overview', icon: '📊' }
  ];

  const getQuotationStats = () => {
    const total = quotations.length;
    const approved = quotations.filter(q => q.status === 'Approved').length;
    const pending = quotations.filter(q => q.status === 'Pending').length;
    const draft = quotations.filter(q => q.status === 'Draft').length;
    const rejected = quotations.filter(q => q.status === 'Rejected').length;
    const totalValue = quotations.reduce((sum, q) => {
      const amount = q.amount ? String(q.amount).replace('$', '').replace(',', '') : '0';
      return sum + parseFloat(amount) || 0;
    }, 0);
    const approvedValue = quotations.filter(q => q.status === 'Approved').reduce((sum, q) => {
      const amount = q.amount ? String(q.amount).replace('$', '').replace(',', '') : '0';
      return sum + parseFloat(amount) || 0;
    }, 0);
    
    return { total, approved, pending, draft, rejected, totalValue, approvedValue, conversionRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0 };
  };

  const stats = getQuotationStats();

  const exportToCSV = (data, filename) => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      data.map(row => Object.values(row).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Reports & Analytics
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisQuarter">This Quarter</option>
            <option value="thisYear">This Year</option>
          </select>
          <button 
            onClick={() => exportToCSV(quotations, 'quotations-report.csv')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-2 sm:space-x-4 px-3 sm:px-6 overflow-x-auto">
            {reportTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id)}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 flex items-center space-x-1 sm:space-x-2 ${
                  activeReport === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-200">
                <h3 className="text-xs sm:text-sm text-blue-600 mb-1 font-medium">Total Quotations</h3>
                <p className="text-lg sm:text-2xl font-bold text-blue-800">{stats.total}</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200">
                <h3 className="text-xs sm:text-sm text-green-600 mb-1 font-medium">Approved</h3>
                <p className="text-lg sm:text-2xl font-bold text-green-800">{stats.approved}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-yellow-200">
                <h3 className="text-xs sm:text-sm text-yellow-600 mb-1 font-medium">Pending</h3>
                <p className="text-lg sm:text-2xl font-bold text-yellow-800">{stats.pending}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-purple-200">
                <h3 className="text-xs sm:text-sm text-purple-600 mb-1 font-medium">Conversion Rate</h3>
                <p className="text-lg sm:text-2xl font-bold text-purple-800">{stats.conversionRate}%</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Pie Chart - Quotation Status */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                    <span className="mr-2">📊</span>
                    Status Distribution
                  </h3>
                  <p className="text-indigo-100 text-xs sm:text-sm mt-1">Quotation breakdown</p>
                </div>
                <div className="p-6 flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8" 
                        strokeDasharray={`${(stats.approved / (stats.total || 1)) * 251.2} 251.2`} 
                        strokeLinecap="round" className="transition-all duration-1000"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="8" 
                        strokeDasharray={`${(stats.pending / (stats.total || 1)) * 251.2} 251.2`} 
                        strokeDashoffset={`-${(stats.approved / (stats.total || 1)) * 251.2}`}
                        strokeLinecap="round" className="transition-all duration-1000"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#6b7280" strokeWidth="8" 
                        strokeDasharray={`${(stats.draft / (stats.total || 1)) * 251.2} 251.2`} 
                        strokeDashoffset={`-${((stats.approved + stats.pending) / (stats.total || 1)) * 251.2}`}
                        strokeLinecap="round" className="transition-all duration-1000"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="text-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                      <span className="text-xs text-gray-600">Approved</span>
                      <p className="font-bold text-sm">{stats.approved}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                      <span className="text-xs text-gray-600">Pending</span>
                      <p className="font-bold text-sm">{stats.pending}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-3 h-3 bg-gray-500 rounded-full mx-auto mb-1"></div>
                      <span className="text-xs text-gray-600">Draft</span>
                      <p className="font-bold text-sm">{stats.draft}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Chart - Revenue Trend */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                    <span className="mr-2">📈</span>
                    Revenue Analytics
                  </h3>
                  <p className="text-blue-100 text-xs sm:text-sm mt-1">6-month trend</p>
                </div>
                <div className="p-6">
                  <div className="h-48 relative">
                    <svg className="w-full h-full" viewBox="0 0 300 120">
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map(i => (
                        <line key={i} x1="30" y1={20 + i * 20} x2="270" y2={20 + i * 20} 
                          stroke="#f3f4f6" strokeWidth="1"/>
                      ))}
                      {/* Data line */}
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points="50,80 90,65 130,55 170,45 210,35 250,25"
                        className="animate-pulse"
                      />
                      {/* Area fill */}
                      <polygon
                        fill="url(#gradient)"
                        points="50,80 90,65 130,55 170,45 210,35 250,25 250,100 50,100"
                      />
                      {/* Data points */}
                      {[50, 90, 130, 170, 210, 250].map((x, i) => {
                        const y = [80, 65, 55, 45, 35, 25][i];
                        return (
                          <circle key={i} cx={x} cy={y} r="4" fill="#3b82f6" 
                            className="hover:r-6 transition-all cursor-pointer">
                            <title>${[12, 15, 18, 22, 25, 28][i]}k</title>
                          </circle>
                        );
                      })}
                    </svg>
                    <div className="flex justify-between mt-2 px-4 text-xs text-gray-500">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => (
                        <span key={month}>{month}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">System Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Employees:</span>
                    <span className="font-semibold">{employees.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Clients:</span>
                    <span className="font-semibold">{clients.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Clients:</span>
                    <span className="font-semibold text-green-600">{clients.filter(c => c.status === 'Active').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Quote Value:</span>
                    <span className="font-semibold">${stats.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approved Value:</span>
                    <span className="font-semibold text-green-600">${stats.approvedValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;