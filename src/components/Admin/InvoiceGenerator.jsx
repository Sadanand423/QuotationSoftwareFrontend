import React, { useState, useEffect } from 'react';

const InvoiceGenerator = () => {
  const [invoices, setInvoices] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const statusFilters = ['All'];

  useEffect(() => {
    // Load invoices from localStorage
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    } else {
      // Sample invoices with employee association
      const sampleInvoices = [
        { id: 'INV-2024-001', clientName: 'ABC Corp', amount: 15000, status: 'Paid', date: '2024-01-15', employeeName: 'John Doe' },
        { id: 'INV-2024-002', clientName: 'XYZ Ltd', amount: 8500, status: 'Pending', date: '2024-01-14', employeeName: 'Jane Smith' },
        { id: 'INV-2024-003', clientName: 'Tech Solutions', amount: 22000, status: 'Overdue', date: '2024-01-10', employeeName: 'John Doe' }
      ];
      setInvoices(sampleInvoices);
      localStorage.setItem('invoices', JSON.stringify(sampleInvoices));
    }
  }, []);

  const filteredInvoices = invoices.filter(invoice => 
    activeFilter === 'All' || invoice.status === activeFilter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Invoice Management
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
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${getStatusDot(invoice.status)}`}></div>
                      <span className="font-medium text-gray-900">{invoice.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.clientName}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">${invoice.amount?.toLocaleString() || '0'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
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

export default InvoiceGenerator;