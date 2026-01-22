import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import QuotationManagement from './QuotationManagement';
import ClientManagement from './ClientManagement';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import Reports from './Reports';
import Settings from './Settings';

const AdminPanel = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard />;
      case 'quotations': return <QuotationManagement />;
      case 'clients': return <ClientManagement />;
      case 'products': return <ProductManagement />;
      case 'users': return <UserManagement />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-1 overflow-auto">
        <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Quotation Management System
              </h1>
              <p className="text-sm text-gray-500 mt-1">Professional Business Solutions</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                👤 Admin Panel
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;