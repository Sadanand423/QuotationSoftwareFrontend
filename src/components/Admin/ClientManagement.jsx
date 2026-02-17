import React, { useState, useEffect } from 'react';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalType, setModalType] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', status: 'Active' });

  const statusFilters = ['All', 'Active', 'Inactive'];

useEffect(() => {
  fetch("http://localhost:8080/api/clients")
    .then(res => res.json())
    .then(data => setClients(data))
    .catch(err => console.error(err));
}, []);


  const filteredClients = clients.filter(client => {
    const matchesFilter = activeFilter === 'All' || client.status === activeFilter;
    const matchesSearch = client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.clientId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAction = (client, action) => {
    setSelectedClient(client);
    setModalType(action);
    setShowModal(true);
  };

const handleAddClient = async () => {
  const response = await fetch("http://localhost:8080/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newClient)
  });

  const savedClient = await response.json();
  setClients([...clients, savedClient]);

  setNewClient({ name: '', email: '', phone: '', status: 'Active' });
  setShowAddForm(false);
};


const handleStatusUpdate = async (clientId, newStatus) => {
  await fetch(`http://localhost:8080/api/clients/${clientId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus })
  });

  setClients(
    clients.map(c =>
      c.id === clientId ? { ...c, status: newStatus } : c
    )
  );

  setShowModal(false);
};

const handleDelete = async (clientId) => {
  await fetch(`http://localhost:8080/api/clients/${clientId}`, {
    method: "DELETE"
  });

  setClients(clients.filter(c => c.id !== clientId));
  setShowModal(false);
};


  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Client Management
        </h2>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
          >
            + Add Client
          </button>
        </div>
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLIENT NAME</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PHONE</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JOIN DATE</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${getStatusDot(client.status)}`}></div>
                      <span className="font-medium text-gray-900">{client.clientId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.joinDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleAction(client, 'view')}
                        className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleAction(client, 'edit')}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleAction(client, 'delete')}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                      >
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

      {/* Add Client Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Client</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={newClient.status}
                    onChange={(e) => setNewClient({...newClient, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddClient}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Client
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ACTION MODAL (VIEW / EDIT / DELETE) --- */}
{showModal && selectedClient && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-in fade-in zoom-in duration-200">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {modalType === 'view' && 'Client Summary'}
          {modalType === 'edit' && 'Edit Client Status'}
          {modalType === 'delete' && 'Delete Client'}
        </h3>
        <button
          onClick={() => setShowModal(false)}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>
      </div>

      {/* VIEW */}
      {modalType === 'view' && (
        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-500">Client ID</span>
            <span className="text-gray-900 font-bold">{selectedClient.clientId}</span>
          </div>

          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-500">Name</span>
            <span className="text-gray-900 font-medium">{selectedClient.name}</span>
          </div>

          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-500">Email</span>
            <span className="text-gray-900">{selectedClient.email}</span>
          </div>

          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-500">Phone</span>
            <span className="text-gray-900">{selectedClient.phone}</span>
          </div>

          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-500">Status</span>
            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
              selectedClient.status === 'Active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {selectedClient.status}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Join Date</span>
            <span className="text-gray-900">{selectedClient.joinDate || 'N/A'}</span>
          </div>

          <button
            onClick={() => setShowModal(false)}
            className="mt-8 w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
          >
            Close Details
          </button>
        </div>
      )}

      {/* EDIT */}
      {modalType === 'edit' && (
        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-500">Client</span>
            <span className="text-gray-900 font-medium">{selectedClient.name}</span>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">Status</label>
            <select
              defaultValue={selectedClient.status}
              onChange={(e) => handleStatusUpdate(selectedClient.id, e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            onClick={() => setShowModal(false)}
            className="mt-6 w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
          >
            Done
          </button>
        </div>
      )}

      {/* DELETE */}
      {modalType === 'delete' && (
        <div className="space-y-5">
          <p className="text-gray-600 text-sm leading-relaxed">
            Are you sure you want to delete client{' '}
            <span className="font-semibold text-gray-900">
              {selectedClient.name}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => handleDelete(selectedClient.id)}
              className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Delete
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  </div>
)}

         

    </div>
  );
};

export default ClientManagement;