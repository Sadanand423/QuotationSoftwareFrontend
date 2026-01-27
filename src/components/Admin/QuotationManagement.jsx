import React, { useState, useEffect } from 'react';

const QuotationManagement = () => {
  const [quotations, setQuotations] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const statusFilters = ['All', 'Draft', 'Pending', 'Approved', 'Rejected'];

  useEffect(() => {
    // Load quotations from localStorage (created by employees)
    const savedQuotations = localStorage.getItem('quotations');
    if (savedQuotations) {
      setQuotations(JSON.parse(savedQuotations));
    } else {
      // Sample data with employee association
      const sampleQuotations = [
        { id: 'Q-2024-045', clientName: 'ABC Corp', amount: 15000, status: 'Pending', date: '2024-01-15', employeeId: 'EMP001', employeeName: 'John Doe' },
        { id: 'Q-2024-044', clientName: 'XYZ Ltd', amount: 8500, status: 'Approved', date: '2024-01-14', employeeId: 'EMP002', employeeName: 'Jane Smith' },
        { id: 'Q-2024-043', clientName: 'Tech Solutions', amount: 22000, status: 'Draft', date: '2024-01-13', employeeId: 'EMP001', employeeName: 'John Doe' },
        { id: 'Q-2024-042', clientName: 'StartupCo', amount: 5000, status: 'Rejected', date: '2024-01-12', employeeId: 'EMP003', employeeName: 'Mike Johnson' }
      ];
      setQuotations(sampleQuotations);
      localStorage.setItem('quotations', JSON.stringify(sampleQuotations));
    }
  }, []);

  const filteredQuotations = quotations.filter(quote => 
    activeFilter === 'All' || quote.status === activeFilter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Draft': return 'bg-gray-500';
      case 'Rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Quotation Management
        </h2>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                activeFilter === filter
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLIENT</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuotations.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${getStatusDot(quote.status)}`}></div>
                      <span className="font-medium text-gray-900">{quote.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{quote.clientName}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">${quote.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{quote.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      <button className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200">
                        View
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
};

export default QuotationManagement;