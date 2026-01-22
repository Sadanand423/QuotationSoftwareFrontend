import React, { useState } from 'react';

const ClientManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [clients] = useState([
    { id: 1, name: 'ABC Corp', email: 'contact@abccorp.com', phone: '+1-555-0123', quotations: 5 },
    { id: 2, name: 'XYZ Ltd', email: 'info@xyzltd.com', phone: '+1-555-0124', quotations: 3 },
    { id: 3, name: 'Tech Solutions', email: 'hello@techsol.com', phone: '+1-555-0125', quotations: 8 }
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Client Management</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Client
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Add New Client</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Company Name" className="border p-2 rounded" />
            <input type="email" placeholder="Email Address" className="border p-2 rounded" />
            <input type="tel" placeholder="Phone Number" className="border p-2 rounded" />
            <input type="text" placeholder="Contact Person" className="border p-2 rounded" />
            <textarea placeholder="Address" className="border p-2 rounded md:col-span-2" rows="2"></textarea>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{client.name}</h3>
            <p className="text-gray-600 mb-1">📧 {client.email}</p>
            <p className="text-gray-600 mb-3">📞 {client.phone}</p>
            <p className="text-sm text-blue-600 mb-4">{client.quotations} Quotations</p>
            <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                Edit
              </button>
              <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                View
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientManagement;