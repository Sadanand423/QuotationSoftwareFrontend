import React, { useState } from 'react';

const QuotationManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [quotations] = useState([
    { id: 'Q-2024-001', client: 'ABC Corp', amount: 15000, status: 'Pending', date: '2024-01-15' },
    { id: 'Q-2024-002', client: 'XYZ Ltd', amount: 8500, status: 'Approved', date: '2024-01-14' },
    { id: 'Q-2024-003', client: 'Tech Solutions', amount: 22000, status: 'Draft', date: '2024-01-13' }
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Quotation Management</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + New Quotation
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Create New Quotation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Client Name" className="border p-2 rounded" />
            <input type="email" placeholder="Client Email" className="border p-2 rounded" />
            <input type="text" placeholder="Project Title" className="border p-2 rounded" />
            <input type="number" placeholder="Amount" className="border p-2 rounded" />
            <textarea placeholder="Description" className="border p-2 rounded md:col-span-2" rows="3"></textarea>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
            <button 
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quotations.map((quote) => (
              <tr key={quote.id}>
                <td className="px-6 py-4 text-sm font-medium">{quote.id}</td>
                <td className="px-6 py-4 text-sm">{quote.client}</td>
                <td className="px-6 py-4 text-sm">${quote.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    quote.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    quote.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {quote.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{quote.date}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-green-600 hover:text-green-800">View</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationManagement;