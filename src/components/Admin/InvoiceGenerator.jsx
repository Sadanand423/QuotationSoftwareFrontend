import React, { useState } from 'react';

const InvoiceGenerator = () => {
  const [selectedQuotation, setSelectedQuotation] = useState('');
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    dueDate: '',
    terms: '30',
    notes: ''
  });

  const quotations = [
    { id: 'Q-2024-001', client: 'ABC Corp', amount: '$15,000', status: 'Approved' },
    { id: 'Q-2024-002', client: 'XYZ Ltd', amount: '$8,500', status: 'Approved' },
    { id: 'Q-2024-003', client: 'Tech Solutions', amount: '$22,000', status: 'Approved' }
  ];

  const recentInvoices = [
    { id: 'INV-2024-001', client: 'ABC Corp', amount: '$15,000', status: 'Paid', date: '2024-01-15' },
    { id: 'INV-2024-002', client: 'XYZ Ltd', amount: '$8,500', status: 'Pending', date: '2024-01-14' },
    { id: 'INV-2024-003', client: 'Tech Solutions', amount: '$22,000', status: 'Overdue', date: '2024-01-10' }
  ];

  const handleGenerateInvoice = () => {
    if (!selectedQuotation) {
      alert('Please select a quotation first');
      return;
    }
    // Invoice generation logic would go here
    alert('Invoice generated successfully!');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Invoice Generator
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Convert approved quotations into professional invoices</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
          <span className="font-semibold text-sm sm:text-base">🧾 Invoice Management</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Invoice Generation Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
              <span className="mr-2">📝</span>
              Generate New Invoice
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">Create invoice from approved quotation</p>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Quotation</label>
              <select 
                value={selectedQuotation}
                onChange={(e) => setSelectedQuotation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a quotation...</option>
                {quotations.map((quote) => (
                  <option key={quote.id} value={quote.id}>
                    {quote.id} - {quote.client} ({quote.amount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
              <input
                type="text"
                value={invoiceData.invoiceNumber}
                onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                placeholder="INV-2024-001"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms (Days)</label>
              <select
                value={invoiceData.terms}
                onChange={(e) => setInvoiceData({...invoiceData, terms: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="15">15 Days</option>
                <option value="30">30 Days</option>
                <option value="45">45 Days</option>
                <option value="60">60 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                placeholder="Additional notes or terms..."
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button 
              onClick={handleGenerateInvoice}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>🧾</span>
              <span>Generate Invoice</span>
            </button>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
              <span className="mr-2">📋</span>
              Recent Invoices
            </h3>
            <p className="text-green-100 text-xs sm:text-sm mt-1">Latest invoice activities</p>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 gap-2 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    invoice.status === 'Paid' ? 'bg-green-400' :
                    invoice.status === 'Pending' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{invoice.id}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{invoice.client}</p>
                    <p className="text-xs text-gray-400">{invoice.date}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right ml-6 sm:ml-0">
                  <p className="font-bold text-gray-800 text-sm sm:text-base">{invoice.amount}</p>
                  <span className={`text-xs px-2 sm:px-3 py-1 rounded-full font-medium ${
                    invoice.status === 'Paid' ? 'bg-green-100 text-green-700' :
                    invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white p-4 sm:p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl sm:text-2xl">🧾</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+15%</span>
            </div>
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Total Invoices</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">847</p>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white p-4 sm:p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl sm:text-2xl">✅</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+22%</span>
            </div>
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Paid Invoices</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">756</p>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white p-4 sm:p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl sm:text-2xl">⏳</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">+8%</span>
            </div>
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Pending</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">67</p>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"></div>
          <div className="relative bg-white p-4 sm:p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl sm:text-2xl">⚠️</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">-3%</span>
            </div>
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Overdue</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">24</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;