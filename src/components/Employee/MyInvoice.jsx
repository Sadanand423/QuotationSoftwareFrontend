import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyInvoice = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const currentEmpId = localStorage.getItem("empId") || "EMP-001";

  const fetchMyInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/invoices/employee/id/${currentEmpId}`);
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInvoices();
  }, [currentEmpId]);

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My Invoices</h2>
          <p className="text-gray-500 mt-1 text-sm">Employee ID: {currentEmpId}</p>
        </div>
        <button 
          onClick={() => navigate('/generate-invoice')}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-md"
        >
          + New Invoice
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">No invoices found.</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-teal-700">{inv.invoiceNumber}</td>
                    {/* Fixed mapping: clientName instead of client */}
                    <td className="px-6 py-4 text-sm text-gray-800">{inv.clientName}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                       {/* Fixed mapping: finalAmount instead of totalAmount */}
                      ₹{Number(inv.finalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {inv.status || 'Sent'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{inv.invoiceDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <button 
                        onClick={() => setSelectedInvoice(inv)}
                        className="text-teal-600 hover:text-teal-800 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ENHANCED VIEW MODAL --- */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-bold text-gray-800">Invoice Details</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 text-xs uppercase font-bold">Client Information</p>
                <p className="text-gray-900 font-bold text-base">{selectedInvoice.clientName}</p>
                <p className="text-gray-600">{selectedInvoice.clientEmail}</p>
                <p className="text-gray-600">{selectedInvoice.clientPhone}</p>
                <p className="text-gray-600 text-xs italic">{selectedInvoice.clientAddress}</p>
              </div>

              <div>
                <span className="text-gray-500 block">Invoice Number</span>
                <span className="text-gray-900 font-bold">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Project</span>
                <span className="text-gray-900 font-medium">{selectedInvoice.projectName}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Billing Date</span>
                <span className="text-gray-900">{selectedInvoice.invoiceDate}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Due Date</span>
                <span className="text-red-500 font-medium">{selectedInvoice.dueDate}</span>
              </div>
              <div className="col-span-2 border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Total Payable</span>
                  <span className="text-teal-600">₹{Number(selectedInvoice.finalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-200"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700"
              >
                Print PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInvoice;