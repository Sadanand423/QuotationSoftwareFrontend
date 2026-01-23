import React, { useState } from 'react';

const ClientManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [clients] = useState([
    { id: 1, name: 'ABC Corp', email: 'contact@abccorp.com', phone: '+1-555-0123', quotations: 5 },
    { id: 2, name: 'XYZ Ltd', email: 'info@xyzltd.com', phone: '+1-555-0124', quotations: 3 },
    { id: 3, name: 'Tech Solutions', email: 'hello@techsol.com', phone: '+1-555-0125', quotations: 8 }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Client Management
        </h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
        >
          + Add Client
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Add New Client</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Company Name" 
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
            <input 
              type="text" 
              placeholder="Contact Person" 
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
            <textarea 
              placeholder="Address" 
              className="border border-gray-300 p-3 rounded-xl sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              rows="2"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">{client.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{client.name}</h3>
                <p className="text-xs sm:text-sm text-blue-600 font-medium">{client.quotations} Quotations</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-gray-600 text-sm flex items-center">
                <span className="mr-2">📧</span>
                <span className="break-all">{client.email}</span>
              </p>
              <p className="text-gray-600 text-sm flex items-center">
                <span className="mr-2">📞</span>
                <span>{client.phone}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 font-medium">
                Edit
              </button>
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg text-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 font-medium">
                View
              </button>
              <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg text-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 font-medium">
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