import React, { useState, useEffect } from 'react';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    empId: '',
    joinDate: '',
    password: ''
  });
  const [employees, setEmployees] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Auto-generate Employee ID starting with EMP001
    const generateEmpId = () => {
      const randomNum = Math.floor(Math.random() * 999) + 1;
      return `EMP${randomNum.toString().padStart(3, '0')}`;
    };
    
    // Set current date as join date
    const currentDate = new Date().toISOString().split('T')[0];
    
    setFormData(prev => ({
      ...prev,
      empId: generateEmpId(),
      joinDate: currentDate
    }));

    // Load existing employees from localStorage
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add new employee to the list
    const newEmployee = { ...formData, id: Date.now() };
    const updatedEmployees = [...employees, newEmployee];
    
    // Save to localStorage
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    setEmployees(updatedEmployees);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    // Reset form
    const newEmpId = `EMP${(Math.floor(Math.random() * 999) + 1).toString().padStart(3, '0')}`;
    setFormData({
      name: '',
      email: '',
      phone: '',
      empId: newEmpId,
      joinDate: new Date().toISOString().split('T')[0],
      password: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const deleteEmployee = (id) => {
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Add Employee</h2>
      
      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Employee added successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-md space-y-4 mb-8">
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          name="empId"
          placeholder="Employee ID"
          value={formData.empId}
          className="w-full p-3 border rounded-lg bg-gray-100"
          readOnly
        />
        <input
          type="date"
          name="joinDate"
          value={formData.joinDate}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          autoComplete="new-password"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
        >
          Add Employee
        </button>
      </form>

      {/* Employee List */}
      <div>
        <h3 className="text-xl font-bold mb-4">Employee List ({employees.length})</h3>
        {employees.length === 0 ? (
          <p className="text-gray-500">No employees added yet.</p>
        ) : (
          <div className="grid gap-4">
            {employees.map((employee) => (
              <div key={employee.id} className="border rounded-lg p-4 bg-white shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{employee.name}</h4>
                    <p className="text-gray-600">ID: {employee.empId}</p>
                    <p className="text-gray-600">Email: {employee.email}</p>
                    <p className="text-gray-600">Phone: {employee.phone}</p>
                    <p className="text-gray-600">Join Date: {employee.joinDate}</p>
                  </div>
                  <button
                    onClick={() => deleteEmployee(employee.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEmployee;