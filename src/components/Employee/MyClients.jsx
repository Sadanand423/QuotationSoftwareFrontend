import React, { useState } from 'react';

const MyClients = () => {
  const [showForm, setShowForm] = useState(false);
  const [clients] = useState([
    { id: 1, name: 'ABC Corp', email: 'contact@abccorp.com', phone: '+1-555-0123', quotations: 3, lastContact: '2024-01-15' },
    { id: 2, name: 'XYZ Ltd', email: 'info@xyzltd.com', phone: '+1-555-0124', quotations: 2, lastContact: '2024-01-14' },
    { id: 3, name: 'Tech Solutions', email: 'hello@techsol.com', phone: '+1-555-0125', quotations: 4, lastContact: '2024-01-13' },
    { id: 4, name: 'StartupCo', email: 'team@startup.com', phone: '+1-555-0126', quotations: 1, lastContact: '2024-01-12' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Clients</h2>
          <p className="text-gray-600 mt-1">Manage your assigned clients</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          + Add Client
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Add New Client</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Company Name" className="border p-3 rounded-lg" />
            <input type="email" placeholder="Email Address" className="border p-3 rounded-lg" />
            <input type="tel" placeholder="Phone Number" className="border p-3 rounded-lg" />
            <input type="text" placeholder="Contact Person" className="border p-3 rounded-lg" />
            <textarea placeholder="Address" className="border p-3 rounded-lg md:col-span-2" rows="2"></textarea>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Save</button>
            <button 
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{client.name}</h3>
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                {client.quotations} Quotes
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-gray-600 text-sm">📧 {client.email}</p>
              <p className="text-gray-600 text-sm">📞 {client.phone}</p>
              <p className="text-gray-600 text-sm">📅 Last Contact: {client.lastContact}</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-600">
                Create Quote
              </button>
              <button className="flex-1 bg-gray-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-600">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyClients;