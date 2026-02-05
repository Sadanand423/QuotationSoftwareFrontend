import React, { useState, useEffect } from 'react';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    empId: '',
    joinDate: '',
    password: '',
    status: 'Active',
    department: 'Sales'
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  }, []);

  const generateEmpId = () => {
    const randomNum = Math.floor(Math.random() * 999) + 1;
    return `EMP${randomNum.toString().padStart(3, '0')}`;
  };

  const handleAddEmployee = () => {
    setCurrentView('add');
    setFormData({
      name: '',
      email: '',
      phone: '',
      empId: generateEmpId(),
      joinDate: new Date().toISOString().split('T')[0],
      password: ''
    });
  };

  const handleEditEmployee = (employee) => {
    setCurrentView('edit');
    setSelectedEmployee(employee);
    setFormData({ ...employee });
  };

  const handleViewEmployee = (employee) => {
    setCurrentView('view');
    setSelectedEmployee(employee);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let updatedEmployees;
    if (currentView === 'add') {
      const newEmployee = { ...formData, id: Date.now() };
      updatedEmployees = [...employees, newEmployee];
    } else {
      updatedEmployees = employees.map(emp => 
        emp.id === selectedEmployee.id ? { ...formData, id: selectedEmployee.id } : emp
      );
    }
    
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    setEmployees(updatedEmployees);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    setCurrentView('list');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const deleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const updatedEmployees = employees.filter(emp => emp.id !== id);
      setEmployees(updatedEmployees);
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    }
  };

  const backToList = () => {
    setCurrentView('list');
    setSelectedEmployee(null);
  };

  // Add/Edit Form View
  if (currentView === 'add' || currentView === 'edit') {
    return (
      <div className="p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              {currentView === 'add' ? '✨ Add Employee' : '✏️ Edit Employee'}
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">Fill in the details below</p>
          </div>
          <button
            onClick={backToList}
            className="bg-gray-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          {showSuccess && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-green-500 text-white rounded-lg text-xs sm:text-sm">
              🎉 Employee {currentView === 'add' ? 'added' : 'updated'} successfully!
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">👤 Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">📧 Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                placeholder="employee@company.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">📱 Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

             <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">🏢 Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                required
              >
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">Human Resources</option>
                <option value="IT">Information Technology</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">🆔 Employee ID</label>
              <input
                type="text"
                name="empId"
                value={formData.empId}
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-xs sm:text-sm"
                readOnly
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">🔐 Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                placeholder="Enter password"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">📅 Join Date</label>
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                required
              />
            </div>
            

            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">✅ Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div className="col-span-1 sm:col-span-2 pt-3 sm:pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 sm:p-3 rounded-lg font-semibold hover:bg-blue-700 text-sm"
              >
                {currentView === 'add' ? '✨ Add Employee' : '💾 Update Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // View Employee Details
  if (currentView === 'view') {
    return (
      <div className="p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">👤 Employee Profile</h2>
            <p className="text-gray-600 text-xs sm:text-sm">Detailed information</p>
          </div>
          <button
            onClick={backToList}
            className="bg-gray-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-blue-50 p-2 sm:p-3 rounded-lg border border-blue-100">
                <label className="text-xs font-semibold text-gray-600 uppercase">Full Name</label>
                <p className="text-sm sm:text-lg font-bold text-gray-800 mt-1">{selectedEmployee.name}</p>
              </div>
              
              <div className="bg-purple-50 p-2 sm:p-3 rounded-lg border border-purple-100">
                <label className="text-xs font-semibold text-gray-600 uppercase">Employee ID</label>
                <p className="text-sm sm:text-lg font-bold text-gray-800 mt-1">{selectedEmployee.empId}</p>
              </div>
              
              <div className="bg-green-50 p-2 sm:p-3 rounded-lg border border-green-100">
                <label className="text-xs font-semibold text-gray-600 uppercase">Join Date</label>
                <p className="text-sm sm:text-lg font-bold text-gray-800 mt-1">{selectedEmployee.joinDate}</p>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-orange-50 p-2 sm:p-3 rounded-lg border border-orange-100">
                <label className="text-xs font-semibold text-gray-600 uppercase">Email Address</label>
                <p className="text-xs sm:text-sm font-semibold text-gray-800 mt-1 break-all">{selectedEmployee.email}</p>
              </div>
              
              <div className="bg-teal-50 p-2 sm:p-3 rounded-lg border border-teal-100">
                <label className="text-xs font-semibold text-gray-600 uppercase">Phone Number</label>
                <p className="text-xs sm:text-sm font-semibold text-gray-800 mt-1">{selectedEmployee.phone}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
            <button
              onClick={() => handleEditEmployee(selectedEmployee)}
              className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm"
            >
              ✏️ Edit Employee
            </button>
            <button
              onClick={() => deleteEmployee(selectedEmployee.id)}
              className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm"
            >
              🗑️ Delete Employee
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Employee List View
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">👥 Employee Management</h2>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={handleAddEmployee}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700"
          >
            ✨ Add Employee
          </button>
        </div>
      </div>

      {employees.filter(emp => 
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.empId?.toLowerCase().includes(searchTerm.toLowerCase())
      ).length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-white rounded-lg">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">👥</div>
          <h3 className="text-base sm:text-lg font-bold text-gray-600 mb-2">No Employees Found</h3>
          <p className="text-gray-500 mb-3 sm:mb-4 text-sm">{searchTerm ? 'Try adjusting your search' : 'Start building your team'}</p>
          {!searchTerm && (
            <button
              onClick={handleAddEmployee}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium text-sm"
            >
              ✨ Add First Employee
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {employees.filter(emp => 
            emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.empId?.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((employee, index) => (
            <div key={employee.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r ${
                  index % 4 === 0 ? 'from-blue-400 to-blue-600' :
                  index % 4 === 1 ? 'from-green-400 to-green-600' :
                  index % 4 === 2 ? 'from-purple-400 to-purple-600' :
                  'from-orange-400 to-orange-600'
                } flex items-center justify-center text-white font-bold text-xs sm:text-sm md:text-lg`}>
                  {employee.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg truncate">{employee.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-500">{employee.empId}</p>
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm">
                <div className="flex items-center text-gray-600">
                  <span>📧</span>
                  <span className="ml-2 truncate flex-1">{employee.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span>📱</span>
                  <span className="ml-2">{employee.phone}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewEmployee(employee)}
                  className="flex-1 bg-green-500 text-white py-2 px-2 sm:px-3 rounded text-xs sm:text-sm font-medium hover:bg-green-600"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => handleEditEmployee(employee)}
                  className="flex-1 bg-blue-500 text-white py-2 px-2 sm:px-3 rounded text-xs sm:text-sm font-medium hover:bg-blue-600"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteEmployee(employee.id)}
                  className="flex-1 bg-red-500 text-white py-2 px-2 sm:px-3 rounded text-xs sm:text-sm font-medium hover:bg-red-600"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;