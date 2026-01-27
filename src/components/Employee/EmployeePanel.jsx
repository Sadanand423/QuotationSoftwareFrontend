import React, { useState } from 'react';
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

  const handleCreateQuotation = (client = null) => {
    setSelectedClient(client);
    setActiveModule('create');
  };

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
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl z-50">
            <EmployeeSidebar activeModule={activeModule} setActiveModule={setActiveModule} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Desktop Sidebar */}
      <div className="hidden sm:block">
        <EmployeeSidebar activeModule={activeModule} setActiveModule={setActiveModule} />
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
                <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">Professional Business Solutions</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
              <span className="sm:hidden">👤</span>
              <span className="hidden sm:inline">👤 Employee Panel</span>
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