import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeDashboard from './EmployeeDashboard';
import MyQuotations from './MyQuotations';
import MyClients from './MyClients';
import CreateQuotation from './CreateQuotation';
import Invoice from './Invoice';
import MyInvoice from './MyInvoice';
import MyProfile from './MyProfile';


const EmployeePanel = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleCreateQuotation = (client = null) => {
    setSelectedClient(client);
    setActiveModule('create');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfile = () => {
    setActiveModule('profile');
    setShowDropdown(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const empId = localStorage.getItem("empId");
      const res = await fetch(
        `http://localhost:8080/api/notifications/employee/${empId}`
      );
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error("Notification fetch error", e);
    }
  };

  // initial load
  fetchNotifications();

  // 🔄 auto refresh every 5 sec
  const interval = setInterval(fetchNotifications, 5000);

  return () => clearInterval(interval);
}, []);

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard': return <EmployeeDashboard onCreateQuotation={() => setActiveModule('create')} />;
      case 'clients': return <MyClients onCreateQuotation={handleCreateQuotation} />;
      case 'create': return <CreateQuotation selectedClient={selectedClient} />;
      case 'quotations': return <MyQuotations />;
      case 'invoice': return <Invoice />;
      case 'myinvoice': return <MyInvoice />;
      case 'profile': return <MyProfile />;
      default: return <EmployeeDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl z-50">
            <EmployeeSidebar
              activeModule={activeModule}
              setActiveModule={setActiveModule}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden sm:block">
        <EmployeeSidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
        />
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="sm:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div>
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  <span className="sm:hidden">QuoteApp</span>
                  <span className="hidden sm:inline">Quotation Management System</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">
                  Professional Business Solutions
                </p>
              </div>
            </div>

            {/* 🔔 NOTIFICATION + EMPLOYEE */}
<div className="flex items-center gap-3">

  {/* 🔔 PREMIUM BELL */}
  <div className="relative">
    <button
      onClick={() => setShowNotifications(!showNotifications)}
      className="w-10 h-10 flex items-center justify-center rounded-full 
                 bg-gradient-to-r from-indigo-500 to-purple-600
                 text-white shadow-lg hover:scale-105 transition-transform"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2a7 7 0 00-7 7v4.586l-.707.707A1 1 0 005 17h14a1 1 0 00.707-1.707L19 13.586V9a7 7 0 00-7-7zm0 20a3 3 0 003-3H9a3 3 0 003 3z"/>
      </svg>

      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow">
          {notifications.length}
        </span>
      )}
    </button>

    {showNotifications && (
      <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border z-50 max-h-96 overflow-auto">
        <div className="p-3 border-b font-semibold text-gray-700">
          Notifications
        </div>

        {notifications.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.slice(0, 8).map((n) => (
            <div
              key={n.id}
              className="px-4 py-3 border-b hover:bg-gray-50 text-sm"
            >
              {n.message}
            </div>
          ))
        )}
      </div>
    )}
  </div>

      {/* 👤 EMPLOYEE BUTTON + DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg cursor-pointer"
        >
          <span className="sm:hidden">👤</span>
          <span className="hidden sm:inline">👤 Employee Panel</span>
        </div>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border z-50">
            <button
              onClick={handleProfile}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              👤 Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>

    </div>

          </div>
        </header>

        <main className="p-3 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeePanel;
