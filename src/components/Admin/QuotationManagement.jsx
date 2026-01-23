import React, { useState } from 'react';

const QuotationManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [quotations] = useState([
    { id: 'Q-2024-001', client: 'ABC Corp', amount: 15000, status: 'Pending', date: '2024-01-15' },
    { id: 'Q-2024-002', client: 'XYZ Ltd', amount: 8500, status: 'Approved', date: '2024-01-14' },
    { id: 'Q-2024-003', client: 'Tech Solutions', amount: 22000, status: 'Draft', date: '2024-01-13' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Quotation Management
        </h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
        >
          + New Quotation
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Create New Quotation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Client Name" 
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
            <input 
              type="email" 
              placeholder="Client Email" 
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
            <input 
              type="text" 
              placeholder="Project Title" 
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
            <input 
              type="number" 
              placeholder="Amount" 
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
            <textarea 
              placeholder="Description" 
              className="border border-gray-300 p-3 rounded-xl sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              rows="3"
            ></textarea>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium">
              Save
            </button>
            <button 
              onClick={() => setShowForm(false)}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {quotations.map((quote) => (
          <div key={quote.id} className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-lg">{quote.id}</h3>
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                quote.status === 'Approved' ? 'bg-green-100 text-green-800' :
                quote.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {quote.status}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Client:</span> {quote.client}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Amount:</span> ${quote.amount.toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Date:</span> {quote.date}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:shadow-md transition-all duration-300 font-medium">
                Edit
              </button>
              <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-3 rounded-lg text-sm hover:shadow-md transition-all duration-300 font-medium">
                View
              </button>
              <button className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-3 rounded-lg text-sm hover:shadow-md transition-all duration-300 font-medium">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quotations.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{quote.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{quote.client}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">${quote.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      quote.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      quote.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{quote.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                        Edit
                      </button>
                      <button className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200">
                        View
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