import React, { useState } from 'react';

const UserManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [users] = useState([
    { id: 1, name: 'John Admin', email: 'john@company.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Manager', email: 'jane@company.com', role: 'Manager', status: 'Active' },
    { id: 3, name: 'Bob User', email: 'bob@company.com', role: 'User', status: 'Inactive' }
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">User Management</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add User
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Add New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" className="border p-2 rounded" />
            <input type="email" placeholder="Email Address" className="border p-2 rounded" />
            <input type="password" placeholder="Password" className="border p-2 rounded" />
            <select className="border p-2 rounded">
              <option>Select Role</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>User</option>
            </select>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                <td className="px-6 py-4 text-sm">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-yellow-600 hover:text-yellow-800">
                      {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
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

export default UserManagement;