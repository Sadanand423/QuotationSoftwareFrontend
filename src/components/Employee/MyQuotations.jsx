import React, { useState } from 'react';

const MyQuotations = () => {
  const [filter, setFilter] = useState('all');
  const [quotations] = useState([
    { id: 'Q-2024-045', client: 'ABC Corp', amount: 15000, status: 'Pending', date: '2024-01-15', priority: 'high' },
    { id: 'Q-2024-044', client: 'XYZ Ltd', amount: 8500, status: 'Approved', date: '2024-01-14', priority: 'medium' },
    { id: 'Q-2024-043', client: 'Tech Solutions', amount: 22000, status: 'Draft', date: '2024-01-13', priority: 'low' },
    { id: 'Q-2024-042', client: 'StartupCo', amount: 5000, status: 'Rejected', date: '2024-01-12', priority: 'medium' }
  ]);

  const filteredQuotations = quotations.filter(quote => 
    filter === 'all' || quote.status.toLowerCase() === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Quotations</h2>
          <p className="text-gray-600 mt-1">Manage your assigned quotations</p>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          + New Quotation
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex space-x-4">
            {['all', 'draft', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                  filter === status
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
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
              {filteredQuotations.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      quote.priority === 'high' ? 'bg-red-400' :
                      quote.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></div>
                    {quote.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{quote.client}</td>
                  <td className="px-6 py-4 text-sm font-semibold">${quote.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      quote.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      quote.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      quote.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{quote.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-800">View</button>
                      {quote.status === 'Draft' && (
                        <button className="text-green-600 hover:text-green-800">Edit</button>
                      )}
                      <button className="text-purple-600 hover:text-purple-800">Duplicate</button>
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

export default MyQuotations;