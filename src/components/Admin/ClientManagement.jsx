import React, { useState, useEffect } from 'react';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const statusFilters = ['All', 'Active', 'Inactive'];

  useEffect(() => {
    // Load clients from localStorage
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      // Sample clients data
      const sampleClients = [
        { id: 'CLI-001', name: 'ABC Corp', email: 'contact@abccorp.com', phone: '+1-555-0123', status: 'Active', joinDate: '2024-01-15' },
        { id: 'CLI-002', name: 'XYZ Ltd', email: 'info@xyzltd.com', phone: '+1-555-0124', status: 'Active', joinDate: '2024-01-14' },
        { id: 'CLI-003', name: 'Tech Solutions', email: 'hello@techsol.com', phone: '+1-555-0125', status: 'Inactive', joinDate: '2024-01-13' }
      ];
      setClients(sampleClients);
      localStorage.setItem('clients', JSON.stringify(sampleClients));
    }
  }, []);

  const filteredClients = clients.filter(client => 
    activeFilter === 'All' || client.status === activeFilter
  );

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
                      <span className="font-medium text-gray-900">{client.id}</span>
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
                      <button className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200">
                        View
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                        Edit
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

export default ClientManagement;