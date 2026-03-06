import React, { useState, useEffect } from 'react';

const InvoiceGenerator = () => {
  const [invoices, setInvoices] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
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
        body: JSON.stringify({ status: newStatus })
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
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <input 
          type="text" 
          placeholder="Search everything..."
          className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
              {filteredInvoices.map((invoice) => (
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
                      <button onClick={() => { setSelectedInvoice(invoice); setIsEditMode(false); }} className="text-green-600">View</button>
                      <button onClick={() => { setSelectedInvoice(invoice); setIsEditMode(true); setNewStatus(invoice.status); }} className="text-blue-600">Edit</button>
                      {/* ✅ Set state for Delete Modal */}
                      <button onClick={() => setInvoiceToDelete(invoice)} className="text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View/Edit Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{isEditMode ? 'Update Status' : 'Invoice Details'}</h3>
            <div className="space-y-3 text-sm">
              <p><strong>Client:</strong> {selectedInvoice.clientName}</p>
              <p><strong>Amount:</strong> ₹{selectedInvoice.finalAmount}</p>
              {isEditMode ? (
                <select className="w-full p-2 border rounded-lg" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {statusFilters.filter(f => f !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : <p><strong>Status:</strong> {selectedInvoice.status}</p>}
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