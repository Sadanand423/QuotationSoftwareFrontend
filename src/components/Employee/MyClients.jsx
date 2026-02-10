import React, { useState, useEffect } from 'react';

const MyClients = ({ onCreateQuotation }) => {
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active'
  });

  // ✅ Fetch ALL clients added by Admin
  useEffect(() => {
    fetch("http://localhost:8080/api/clients")
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error(err));
  }, []);

  // ✅ Add client (Employee can also add)
  const handleAddClient = async () => {
    const response = await fetch("http://localhost:8080/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClient)
    });

    const savedClient = await response.json();
    setClients([...clients, savedClient]);

    setNewClient({
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'Active'
    });

    setShowForm(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My Clients</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            All clients added by Admin & Employee
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm sm:text-base"
        >
          + Add Client
        </button>
      </div>

      {/* Add Client Form */}
      {showForm && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Add New Client</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Client Name"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              className="border p-2 rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              className="border p-2 rounded-lg"
            />
            <input
              type="tel"
              placeholder="Phone No"
              value={newClient.phone}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              className="border p-2 rounded-lg"
            />
            <textarea
              placeholder="Address"
              value={newClient.address}
              onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
              className="border p-2 rounded-lg md:col-span-2"
              rows="2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddClient}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Clients List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between mb-3">
              <h3 className="text-lg font-semibold">{client.name}</h3>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {client.clientId}
              </span>
            </div>
            <p className="text-sm text-gray-600">📧 {client.email}</p>
            <p className="text-sm text-gray-600">📞 {client.phone}</p>

            <button
              onClick={() => onCreateQuotation?.(client)}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Create Quote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyClients;
