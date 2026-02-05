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
      // Admin credentials: username: admin, password: admin123
      if (formData.username === 'admin' && formData.password === 'admin123') {
        console.log('Admin Login Successful');
        window.location.href = '/admin';
      } else {
        alert('Invalid admin credentials');
      }
    }else {
  // 🔥 CALL BACKEND LOGIN API
  fetch("http://localhost:8080/api/employee/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      employeeId: formData.employeeId,
      password: formData.password
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      console.log("Login success");

      // save JWT token
      localStorage.setItem("token", data.token);

      window.location.href = "/employee";
    } else {
      alert("Invalid credentials");
    }
  })
  .catch(err => {
    console.error(err);
    alert("Server error");
  });
}

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center z-50">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl transform transition-all relative z-10">
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
