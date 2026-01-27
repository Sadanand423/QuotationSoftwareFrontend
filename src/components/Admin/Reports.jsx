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
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'quotations', label: 'Quotations', icon: '📋' },
    { id: 'revenue', label: 'Revenue', icon: '💰' },
    { id: 'employees', label: 'Employees', icon: '👨💼' },
    { id: 'clients', label: 'Clients', icon: '👥' }
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
          {activeReport === 'overview' && (
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Revenue Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Quote Value:</span>
                      <span className="font-semibold">${stats.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approved Value:</span>
                      <span className="font-semibold text-green-600">${stats.approvedValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg. Quote Value:</span>
                      <span className="font-semibold">${stats.total > 0 ? (stats.totalValue / stats.total).toLocaleString() : 0}</span>
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeReport === 'quotations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Quotation Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2 sm:p-3 font-medium text-gray-600 text-xs sm:text-sm">ID</th>
                      <th className="text-left p-2 sm:p-3 font-medium text-gray-600 text-xs sm:text-sm">Client</th>
                      <th className="text-left p-2 sm:p-3 font-medium text-gray-600 text-xs sm:text-sm">Amount</th>
                      <th className="text-left p-2 sm:p-3 font-medium text-gray-600 text-xs sm:text-sm">Status</th>
                      <th className="text-left p-2 sm:p-3 font-medium text-gray-600 text-xs sm:text-sm hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotations.map((quote, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-2 sm:p-3 font-medium text-xs sm:text-sm">{quote.id}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm">{quote.client}</td>
                        <td className="p-2 sm:p-3 font-semibold text-xs sm:text-sm">{quote.amount}</td>
                        <td className="p-2 sm:p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            quote.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            quote.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            quote.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {quote.status}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">{quote.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeReport === 'revenue' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Revenue Analysis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-200">
                  <h4 className="text-green-600 font-medium mb-2 text-sm sm:text-base">Total Revenue</h4>
                  <p className="text-2xl sm:text-3xl font-bold text-green-800">${stats.approvedValue.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-green-600 mt-1">From approved quotations</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-blue-200">
                  <h4 className="text-blue-600 font-medium mb-2 text-sm sm:text-base">Potential Revenue</h4>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-800">${(stats.totalValue - stats.approvedValue).toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-blue-600 mt-1">From pending quotations</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-purple-200">
                  <h4 className="text-purple-600 font-medium mb-2 text-sm sm:text-base">Avg Deal Size</h4>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-800">${stats.approved > 0 ? (stats.approvedValue / stats.approved).toLocaleString() : 0}</p>
                  <p className="text-xs sm:text-sm text-purple-600 mt-1">Per approved quote</p>
                </div>
              </div>
            </div>
          )}

          {activeReport === 'employees' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Employee Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-600">Employee ID</th>
                      <th className="text-left p-3 font-medium text-gray-600">Name</th>
                      <th className="text-left p-3 font-medium text-gray-600">Department</th>
                      <th className="text-left p-3 font-medium text-gray-600">Quotations</th>
                      <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-medium">{employee.employeeId}</td>
                        <td className="p-3">{employee.name}</td>
                        <td className="p-3">{employee.department}</td>
                        <td className="p-3">{quotations.filter(q => q.employeeId === employee.employeeId).length}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeReport === 'clients' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Client Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-600">Client Name</th>
                      <th className="text-left p-3 font-medium text-gray-600">Email</th>
                      <th className="text-left p-3 font-medium text-gray-600">Quotations</th>
                      <th className="text-left p-3 font-medium text-gray-600">Total Value</th>
                      <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client, index) => {
                      const clientQuotes = quotations.filter(q => q.client === client.name);
                      const clientValue = clientQuotes.reduce((sum, q) => {
                        const amount = q.amount ? String(q.amount).replace('$', '').replace(',', '') : '0';
                        return sum + parseFloat(amount) || 0;
                      }, 0);
                      return (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-medium">{client.name}</td>
                          <td className="p-3">{client.email}</td>
                          <td className="p-3">{clientQuotes.length}</td>
                          <td className="p-3 font-semibold">${clientValue.toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {client.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;