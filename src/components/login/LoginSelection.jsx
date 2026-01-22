import React, { useState, useEffect } from 'react';

const LoginModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('employee');
  const [formData, setFormData] = useState({ username: '', employeeId: '', password: '' });

  useEffect(() => {
    if (isOpen) {
      setActiveTab('employee');
      setFormData({ username: '', employeeId: '', password: '' });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'admin') {
      console.log('Admin Login:', { username: formData.username, password: formData.password });
      // Navigate to admin dashboard
      window.location.href = '/admin-dashboard';
    } else {
      console.log('Employee Login:', { employeeId: formData.employeeId, password: formData.password });
      // Navigate to employee dashboard
      window.location.href = '/employee-dashboard';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>
        
        {/* Toggle Buttons */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('employee')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'employee'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'admin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {activeTab === 'admin' ? 'Username' : 'Employee ID'}
            </label>
            <input
              type="text"
              value={activeTab === 'admin' ? formData.username : formData.employeeId}
              onChange={(e) => setFormData({
                ...formData,
                [activeTab === 'admin' ? 'username' : 'employeeId']: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={activeTab === 'admin' ? 'Enter username' : 'Enter employee ID'}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
              activeTab === 'admin'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Login as {activeTab === 'admin' ? 'Admin' : 'Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;