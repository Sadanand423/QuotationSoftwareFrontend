import React from 'react';

const Sidebar = ({ activeModule, setActiveModule, sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', gradient: 'from-blue-500 to-blue-600' },
    { id: 'workflow', label: 'Project Workflow', icon: '🔄', gradient: 'from-cyan-500 to-cyan-600' },
    { id: 'quotations', label: 'Quotations', icon: '📋', gradient: 'from-green-500 to-green-600' },
    { id: 'payments', label: 'Payments', icon: '💳', gradient: 'from-emerald-500 to-emerald-600' },
    { id: 'invoices', label: 'Invoices', icon: '📄', gradient: 'from-indigo-500 to-indigo-600' },
    { id: 'clients', label: 'Clients', icon: '👥', gradient: 'from-purple-500 to-purple-600' },
    { id: 'products', label: 'Products', icon: '📦', gradient: 'from-orange-500 to-orange-600' },
    { id: 'users', label: 'Users', icon: '👤', gradient: 'from-pink-500 to-pink-600' },
    { id: 'reports', label: 'Reports', icon: '📈', gradient: 'from-indigo-500 to-indigo-600' },
    { id: 'settings', label: 'Settings', icon: '⚙️', gradient: 'from-gray-500 to-gray-600' }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl transition-transform duration-300 ease-in-out`}>
        <div className="p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">Q</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  QuoteAdmin
                </h2>
                <p className="text-xs text-gray-400 hidden sm:block">Management Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <nav className="mt-6 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id);
                setSidebarOpen(false); // Close sidebar on mobile after selection
              }}
              className={`w-full flex items-center px-3 sm:px-4 py-3 mb-2 rounded-xl text-left transition-all duration-300 group ${
                activeModule === item.id
                  ? `bg-gradient-to-r ${item.gradient} shadow-lg transform scale-105`
                  : 'hover:bg-gray-700/50 hover:transform hover:scale-105'
              }`}
            >
              <span className="text-xl sm:text-2xl mr-3 sm:mr-4 group-hover:animate-pulse">{item.icon}</span>
              <span className="font-medium text-sm sm:text-base">{item.label}</span>
              {activeModule === item.id && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>

      </div>
    </>
  );
};

export default Sidebar;