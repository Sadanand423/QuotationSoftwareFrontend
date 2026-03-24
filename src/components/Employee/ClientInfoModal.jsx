import React, { useState, useEffect } from 'react';

const ClientInfoModal = ({ client, onClose }) => {
  const [clientQuotations, setClientQuotations] = useState([]);
  const [clientInvoices, setClientInvoices] = useState([]);
  const [uniqueProjects, setUniqueProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'projects', 'quotations', 'invoices'

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentEmpId = localStorage.getItem("empId") || "EMP-001";
        
        // Fetch ALL quotations for employee and filter by client
        const quotationsResponse = await fetch(`http://localhost:8080/api/quotations/employee/id/${currentEmpId}`);
        if (quotationsResponse.ok) {
          const allQuotations = await quotationsResponse.json();
          // Filter quotations by matching client name or clientId
          const filteredQuotations = allQuotations.filter(q => 
            q.client === client.name || q.clientId === client.clientId || q.clientId === client.id
          );
          setClientQuotations(filteredQuotations);

          // Extract unique projects from filtered quotations
          const projects = [...new Set(filteredQuotations.map(q => q.projectName).filter(Boolean))];
          setUniqueProjects(projects);
        }

        // Fetch ALL invoices for employee and filter by client
        const invoicesResponse = await fetch(`http://localhost:8080/api/invoices/employee/id/${currentEmpId}`);
        if (invoicesResponse.ok) {
          const allInvoices = await invoicesResponse.json();
          // Filter invoices by matching client name
          const filteredInvoices = allInvoices.filter(inv => 
            inv.clientName === client.name
          );
          setClientInvoices(filteredInvoices);
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [client.id, client.name, client.clientId]);

  // Calculate summary statistics
  const totalQuotations = clientQuotations.length;
  const totalInvoices = clientInvoices.length;
  const totalAmount = clientQuotations.reduce((sum, q) => sum + (Number(q.finalAmount) || 0), 0);

  const getStatusClasses = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      case 'partially paid':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getDisplayStatus = (inv) => {
    if (inv.status === 'Paid' || inv.status === 'Cancelled') {
      return inv.status;
    }
    if (inv.balanceAmount <= 0) {
      return 'Paid';
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = inv.dueDate ? new Date(inv.dueDate) : null;
    if (inv.balanceAmount > 0 && dueDate && today > dueDate) {
      return 'Overdue';
    }
    if (inv.totalPaidAmount > 0 && inv.balanceAmount > 0) {
      return 'Partially Paid';
    }
    return inv.status || 'Sent';
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading client information...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-6 my-8">
        {/* Header with close button */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Client Information</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none">
            &times;
          </button>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{totalQuotations}</div>
            <div className="text-sm text-blue-600">Total Quotations</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-2xl font-bold text-purple-700">{totalInvoices}</div>
            <div className="text-sm text-purple-600">Total Invoices</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-700">₹{totalAmount.toLocaleString('en-IN')}</div>
            <div className="text-sm text-green-600">Total Amount</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6 gap-1">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'info'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Client Info
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'projects'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Projects ({uniqueProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('quotations')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'quotations'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Quotations ({totalQuotations})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'invoices'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Invoices ({totalInvoices})
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto max-h-96">
          {/* Client Information Tab */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wide">Client Name</p>
                    <p className="text-gray-900 font-bold text-lg mt-1">{client.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wide">Client ID</p>
                    <p className="text-gray-900 font-mono text-lg mt-1 bg-blue-100 p-2 rounded">{client.clientId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wide">Email</p>
                    <p className="text-gray-700 mt-1">{client.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wide">Phone</p>
                    <p className="text-gray-700 mt-1">{client.phone || 'N/A'}</p>
                  </div>
                  {client.organization && (
                    <div className="sm:col-span-2">
                      <p className="text-gray-500 text-xs uppercase font-bold tracking-wide">Organization</p>
                      <p className="text-gray-700 mt-1">{client.organization}</p>
                    </div>
                  )}
                  {client.address && (
                    <div className="sm:col-span-2">
                      <p className="text-gray-500 text-xs uppercase font-bold tracking-wide">Address</p>
                      <p className="text-gray-700 mt-1">{client.address}</p>
                    </div>
                  )}
                  {client.status && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase font-bold tracking-wide">Status</p>
                      <p className="text-gray-700 mt-1">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          {client.status}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-3">
              {uniqueProjects.length === 0 ? (
                <p className="text-gray-500 py-4">No projects associated with this client.</p>
              ) : (
                uniqueProjects.map((project, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors">
                    <p className="font-semibold text-gray-800">{project}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Quotations Tab */}
          {activeTab === 'quotations' && (
            <div>
              {clientQuotations.length === 0 ? (
                <p className="text-gray-500 py-4">No quotations for this client.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Quotation No</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Project</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Amount</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {clientQuotations.map((quote) => (
                        <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-800">{quote.quotationNumber}</td>
                          <td className="px-4 py-3 text-gray-700">{quote.projectName || 'N/A'}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900">
                            ₹{Number(quote.finalAmount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusClasses(quote.status)}`}>
                              {quote.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{quote.date || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div>
              {clientInvoices.length === 0 ? (
                <p className="text-gray-500 py-4">No invoices for this client.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Invoice No</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Amount</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {clientInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-800">{invoice.invoiceNumber}</td>
                          <td className="px-4 py-3 text-gray-600">{invoice.invoiceDate || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusClasses(getDisplayStatus(invoice))}`}>
                              {getDisplayStatus(invoice)}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900">
                            ₹{Number(invoice.finalAmount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 font-semibold text-red-600">
                            ₹{Number(invoice.balanceAmount || 0).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientInfoModal;
