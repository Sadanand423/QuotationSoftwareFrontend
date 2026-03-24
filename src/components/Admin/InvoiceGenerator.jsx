import React, { useState, useEffect } from 'react';

const InvoiceGenerator = () => {
  const [invoices, setInvoices] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // ✅ NEW: State for Delete Confirmation Modal
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const statusFilters = ['All', 'Paid', 'Sent', 'Pending', 'Overdue'];

  const fetchAllInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/invoices/all-invoices`);
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error("Connection Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  // ✅ UPDATED: Delete Handler (Called from Modal)
  const confirmDelete = async () => {
  if (!invoiceToDelete) return;

  // IMPORTANT: Check for both _id (MongoDB default) and id
  const targetId = invoiceToDelete.id || invoiceToDelete._id;

  if (!targetId) {
    alert("Error: Invoice ID is missing.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/invoices/delete/${targetId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setInvoiceToDelete(null); // Close the modal
      fetchAllInvoices(); // Refresh the table list
      alert("Invoice deleted successfully!");
    } else {
      const errorText = await response.text();
      console.error("Delete failed:", errorText);
      alert(`Server says: ${errorText}`);
    }
  } catch (error) {
    console.error("Network Error:", error);
    alert("Could not reach the server. Please check if the backend is running.");
  }
};

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/invoices/update-status/${selectedInvoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setSelectedInvoice(null);
        fetchAllInvoices();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = activeFilter === 'All' || invoice.status === activeFilter;
    const lowerSearch = searchTerm.toLowerCase();
    return matchesStatus && (
      invoice.clientName?.toLowerCase().includes(lowerSearch) ||
      invoice.invoiceNumber?.toLowerCase().includes(lowerSearch) ||
      invoice.employeeId?.toLowerCase().includes(lowerSearch) ||
      invoice.employeeName?.toLowerCase().includes(lowerSearch)
    );
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Invoice Management
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors ${
                activeFilter === filter ? 'bg-green-50 text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Emp ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Emp Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mb-3"></div>
                      <p className="text-gray-500 font-medium">Loading invoices...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No invoices found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">{invoice.employeeId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{invoice.employeeName || "Not Set"}</td>
                  <td className="px-6 py-4 text-sm">{invoice.clientName}</td>
                  <td className="px-6 py-4 text-sm font-semibold">₹{Number(invoice.finalAmount).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      <button onClick={() => { setSelectedInvoice(invoice); setIsEditMode(false); }} className="text-green-600 hover:text-green-800 font-medium">View</button>
                      {/* ✅ Set state for Delete Modal */}
                      <button onClick={() => setInvoiceToDelete(invoice)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* View/Edit Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{isEditMode ? 'Update Status' : 'Invoice Details'}</h3>
            <div className="space-y-3 text-sm">
              <p><strong>Client:</strong> {selectedInvoice.clientName}</p>
              <p><strong>Amount:</strong> ₹{selectedInvoice.finalAmount}</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setSelectedInvoice(null)} className="flex-1 bg-gray-100 py-2 rounded-lg">Close</button>
              {isEditMode && <button onClick={handleStatusUpdate} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Save Change</button>}
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW: Delete Confirmation Modal */}
      {invoiceToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
            <h3 className="text-xl font-bold mb-2">Confirm Delete</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Are you sure you want to delete invoice <strong>{invoiceToDelete.invoiceNumber}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setInvoiceToDelete(null)} className="flex-1 bg-gray-100 py-2 rounded-lg font-medium">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium">Delete Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;