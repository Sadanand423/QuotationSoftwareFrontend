import React, { useState, useEffect } from 'react';

const MyInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [groupedClients, setGroupedClients] = useState({});
  const [expandedClient, setExpandedClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  useEffect(() => {
    const grouped = invoices.reduce((acc, invoice) => {
      const name = invoice.clientName || "Unknown Client";
      if (!acc[name]) {
        acc[name] = {
          clientName: name,
          invoices: [],
          totalInvoices: 0,
          latestInvoiceDate: invoice.invoiceDate || "-",
        };
      }
      acc[name].invoices.push(invoice);
      acc[name].totalInvoices = acc[name].invoices.length;

      const existing = new Date(acc[name].latestInvoiceDate);
      const current = new Date(invoice.invoiceDate);
      if (!Number.isNaN(current.getTime()) && (Number.isNaN(existing.getTime()) || current > existing)) {
        acc[name].latestInvoiceDate = invoice.invoiceDate;
      }
      return acc;
    }, {});
    setGroupedClients(grouped);
  }, [invoices]);

  const handleClientExpand = (clientName) => {
    setExpandedClient((prev) => (prev === clientName ? null : clientName));
  };

  const handlePrint = (invoice) => {
    const printContent = `
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body{font-family:Arial;padding:30px;}
            h1{margin-bottom:10px;}
            table{width:100%;border-collapse:collapse;margin-top:20px;}
            th,td{border:1px solid #ccc;padding:8px;text-align:left;}
          </style>
        </head>
        <body>
          <h1>SMARTMATRIX Digital Services</h1>
          <h2>Invoice: ${invoice.invoiceNumber}</h2>
          <p><b>Client:</b> ${invoice.clientName}</p>
          <p><b>Project:</b> ${invoice.projectName}</p>
          <p><b>Date:</b> ${invoice.invoiceDate}</p>
          <table>
            <tr><th>Service</th><th>Amount</th></tr>
            <tr><td>${invoice.projectName}</td><td>₹${invoice.finalAmount}</td></tr>
          </table>
        </body>
      </html>
    `;
    const newWindow = window.open("", "", "width=900,height=700");
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.onload = function () {
      newWindow.print();
    };
  };

  const getStatusClasses = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'cancelled': case 'canceled': return 'bg-gray-100 text-gray-600';
      case 'draft': return 'bg-slate-100 text-slate-600';
      case 'partially paid': return 'bg-purple-100 text-purple-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My Invoices</h2>
          <p className="text-gray-500 mt-1 text-sm">Employee ID: {currentEmpId}</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Invoices</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Latest Invoice Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">Loading...</td></tr>
              ) : (() => {
                const search = searchTerm.toLowerCase();
                const filteredClients = Object.values(groupedClients).filter((cg) =>
                  cg.clientName.toLowerCase().includes(search) ||
                  cg.invoices.some((inv) => (inv.invoiceNumber || '').toLowerCase().includes(search))
                );
                const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;
                const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

                if (filteredClients.length === 0) return (
                  <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">No invoices found.</td></tr>
                );

                return (
                  <>
                    {paginatedClients.map((clientGroup) => (
                  <React.Fragment key={clientGroup.clientName}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-teal-700">{clientGroup.clientName}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{clientGroup.totalInvoices}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{clientGroup.latestInvoiceDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleClientExpand(clientGroup.clientName)}
                          className="text-teal-600 hover:text-teal-800 font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>

                    {expandedClient === clientGroup.clientName && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 bg-gray-50">
                          <table className="min-w-full bg-white rounded-lg border overflow-hidden">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {clientGroup.invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 text-sm font-bold text-teal-700">{inv.invoiceNumber}</td>
                                  <td className="px-6 py-4 text-sm text-gray-500">{inv.invoiceDate}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusClasses(inv.status)}`}>
                                      {inv.status || 'Sent'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                    ₹{Number(inv.finalAmount || 0).toLocaleString('en-IN')}
                                  </td>
                                  <td className="px-6 py-4 text-sm">
                                    <button
                                      onClick={() => setSelectedInvoice(inv)}
                                      className="text-teal-600 hover:text-teal-800 font-medium"
                                    >
                                      View
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredClients.length)} of {filteredClients.length}
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- INVOICE DETAIL MODAL --- */}
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
                onClick={() => handlePrint(selectedInvoice)}
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