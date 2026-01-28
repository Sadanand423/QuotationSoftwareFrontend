import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import QuotationManagement from './QuotationManagement';
import InvoiceGenerator from './InvoiceGenerator';
import ClientManagement from './ClientManagement';
import EmployeeManagement from './EmployeeManagement';
import Reports from './Reports';
import EditProfile from './EditProfile';

const AdminPanel = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard />;
      case 'quotations': return <QuotationManagement />;
      case 'invoices': return <InvoiceGenerator />;
      case 'clients': return <ClientManagement />;
      case 'employees': return <EmployeeManagement />;
      case 'reports': return <Reports />;
      case 'profile': return <EditProfile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 overflow-auto">
        <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 px-3 sm:px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-3 p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Quotation Management System</span>
                  <span className="sm:hidden">QMS</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">Professional Business Solutions</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                <span className="hidden sm:inline">👤 Admin Panel</span>
                <span className="sm:hidden">👤</span>
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

export default AdminPanel;