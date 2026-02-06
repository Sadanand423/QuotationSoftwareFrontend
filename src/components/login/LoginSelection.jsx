import React, { useState, useEffect } from 'react';

const LoginModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('employee');
  const [formData, setFormData] = useState({
    username: '',
    employeeId: '',
    password: ''
  });

  useEffect(() => {
    if (isOpen) {
      setActiveTab('employee');
      setFormData({ username: '', employeeId: '', password: '' });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔐 ADMIN LOGIN (BACKEND)
    if (activeTab === 'admin') {
      try {
        const res = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        });

        const data = await res.json();

        if (res.ok && data.token) {
          localStorage.setItem("token", data.token);
          window.location.href = "/admin";
        } else {
          alert("Invalid admin credentials");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }

      onClose();
      return;
    }

    // 👨‍💼 EMPLOYEE LOGIN (UNCHANGED)
    try {
      const res = await fetch("http://localhost:8080/api/employee/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          employeeId: formData.employeeId,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/employee";
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl relative z-10">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">✕</button>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('employee')}
            className={`flex-1 py-2 rounded-md ${
              activeTab === 'employee'
                ? 'bg-green-600 text-white'
                : 'text-gray-600'
            }`}
          >
            Employee
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2 rounded-md ${
              activeTab === 'admin'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              {activeTab === 'admin' ? 'Username' : 'Employee ID'}
            </label>
            <input
              type="text"
              value={activeTab === 'admin' ? formData.username : formData.employeeId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [activeTab === 'admin' ? 'username' : 'employeeId']: e.target.value
                })
              }
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg ${
              activeTab === 'admin'
                ? 'bg-blue-600 text-white'
                : 'bg-green-600 text-white'
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
