import React from 'react';

const MyInvoice = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            My Invoices
          </h2>
          <p className="text-gray-500 mt-2">View and manage your invoices</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-4xl">📄</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">My Invoice Module</h3>
          <p className="text-gray-600">Your personal invoice management functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

export default MyInvoice;