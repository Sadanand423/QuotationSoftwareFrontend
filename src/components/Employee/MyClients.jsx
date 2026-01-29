import React, { useState } from 'react';

const MyClients = ({ onCreateQuotation }) => {
  const [showForm, setShowForm] = useState(false);
  const [clients] = useState([
    { id: 1, name: 'ABC Corp', email: 'contact@abccorp.com', phone: '+1-555-0123', quotations: 3, lastContact: '2024-01-15' },
    { id: 2, name: 'XYZ Ltd', email: 'info@xyzltd.com', phone: '+1-555-0124', quotations: 2, lastContact: '2024-01-14' },
    { id: 3, name: 'Tech Solutions', email: 'hello@techsol.com', phone: '+1-555-0125', quotations: 4, lastContact: '2024-01-13' },
    { id: 4, name: 'StartupCo', email: 'team@startup.com', phone: '+1-555-0126', quotations: 1, lastContact: '2024-01-12' }
  ]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My Clients</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your assigned clients</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm sm:text-base self-start sm:self-auto"
        >
          + Add Client
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Add New Client</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Client Name" className="border p-2 sm:p-3 rounded-lg text-sm sm:text-base" />
            <input type="text" placeholder="Project Name" className="border p-2 sm:p-3 rounded-lg text-sm sm:text-base" />
            <input type="email" placeholder="Email" className="border p-2 sm:p-3 rounded-lg text-sm sm:text-base" />
            <input type="tel" placeholder="Phone No" className="border p-2 sm:p-3 rounded-lg text-sm sm:text-base" />
            <textarea placeholder="Address" className="border p-2 sm:p-3 rounded-lg md:col-span-2 text-sm sm:text-base" rows="2"></textarea>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm sm:text-base">Save</button>
            <button 
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{client.name}</h3>
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full self-start">
                {client.quotations} Quotes
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-gray-600 text-xs sm:text-sm break-all">📧 {client.email}</p>
              <p className="text-gray-600 text-xs sm:text-sm">📞 {client.phone}</p>
              <p className="text-gray-600 text-xs sm:text-sm">📅 Last Contact: {client.lastContact}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button 
                onClick={() => onCreateQuotation && onCreateQuotation(client)}
                className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-xs sm:text-sm hover:bg-green-600"
              >
                Create Quote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyClients;