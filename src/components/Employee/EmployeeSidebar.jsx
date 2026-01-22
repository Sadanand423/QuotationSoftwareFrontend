import React from 'react';

const EmployeeSidebar = ({ activeModule, setActiveModule }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', gradient: 'from-blue-500 to-blue-600' },
    { id: 'quotations', label: 'My Quotations', icon: '📋', gradient: 'from-green-500 to-green-600' },
    { id: 'clients', label: 'My Clients', icon: '👥', gradient: 'from-purple-500 to-purple-600' },
    { id: 'create', label: 'Create Quote', icon: '➕', gradient: 'from-orange-500 to-orange-600' },
    { id: 'profile', label: 'My Profile', icon: '👤', gradient: 'from-pink-500 to-pink-600' }
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              QuoteEmployee
            </h2>
            <p className="text-xs text-gray-400">Employee Portal</p>
          </div>
        </div>
      </div>
      <nav className="mt-6 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`w-full flex items-center px-4 py-3 mb-2 rounded-xl text-left transition-all duration-300 group ${
              activeModule === item.id
                ? `bg-gradient-to-r ${item.gradient} shadow-lg transform scale-105`
                : 'hover:bg-gray-700/50 hover:transform hover:scale-105'
            }`}
          >
            <span className="text-2xl mr-4 group-hover:animate-pulse">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            {activeModule === item.id && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </nav>
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-gray-700">
          <p className="text-xs text-gray-300 mb-1">Employee Access</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Limited Access Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSidebar;