import React, { useState, useEffect } from 'react';

const QuotationManagement = () => {
  const [quotations, setQuotations] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [modalType, setModalType] = useState(''); // 'view', 'edit', 'delete'

  const statusFilters = ['All', 'Draft', 'Pending', 'Approved', 'Rejected'];

  useEffect(() => {
    // Load quotations from localStorage (created by employees)
    const savedQuotations = localStorage.getItem('quotations');
    if (savedQuotations) {
      setQuotations(JSON.parse(savedQuotations));
    } else {
      // Sample data with employee association
      const sampleQuotations = [
        { id: 'Q-2024-045', clientName: 'ABC Corp', amount: 15000, status: 'Pending', date: '2024-01-15', employeeId: 'EMP001', employeeName: 'John Doe' },
        { id: 'Q-2024-044', clientName: 'XYZ Ltd', amount: 8500, status: 'Approved', date: '2024-01-14', employeeId: 'EMP002', employeeName: 'Jane Smith' },
        { id: 'Q-2024-043', clientName: 'Tech Solutions', amount: 22000, status: 'Draft', date: '2024-01-13', employeeId: 'EMP001', employeeName: 'John Doe' },
        { id: 'Q-2024-042', clientName: 'StartupCo', amount: 5000, status: 'Rejected', date: '2024-01-12', employeeId: 'EMP003', employeeName: 'Mike Johnson' }
      ];
      setQuotations(sampleQuotations);
      localStorage.setItem('quotations', JSON.stringify(sampleQuotations));
    }
  }, []);

  const filteredQuotations = quotations.filter(quote => {
    const matchesFilter = activeFilter === 'All' || quote.status === activeFilter;
    const matchesSearch = quote.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotations = filteredQuotations.slice(startIndex, startIndex + itemsPerPage);

  const handleAction = (quote, action) => {
    setSelectedQuote(quote);
    setModalType(action);
    setShowModal(true);
  };

  const handleStatusUpdate = (quoteId, newStatus) => {
    const updatedQuotations = quotations.map(q => 
      q.id === quoteId ? { ...q, status: newStatus } : q
    );
    setQuotations(updatedQuotations);
    localStorage.setItem('quotations', JSON.stringify(updatedQuotations));
    setShowModal(false);
  };

  const handleDelete = (quoteId) => {
    const updatedQuotations = quotations.filter(q => q.id !== quoteId);
    setQuotations(updatedQuotations);
    localStorage.setItem('quotations', JSON.stringify(updatedQuotations));
    setShowModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Draft': return 'bg-gray-500';
      case 'Rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Quotation Management
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search quotations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                activeFilter === filter
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLIENT</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">AMOUNT</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">DATE</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedQuotations.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 sm:mr-3 ${getStatusDot(quote.status)}`}></div>
                      <span className="font-medium text-gray-900">{quote.id}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{quote.clientName}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-900 hidden sm:table-cell">${quote.amount?.toLocaleString() || '0'}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                    <span className={`px-2 sm:px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">{quote.date}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                      <button 
                        onClick={() => handleAction(quote, 'view')}
                        className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200 text-xs sm:text-sm"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleAction(quote, 'edit')}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleAction(quote, 'delete')}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200 text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-3 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredQuotations.length)} of {filteredQuotations.length} results
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-2 sm:px-3 py-1 border rounded-md text-xs sm:text-sm ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4">
                {modalType === 'view' && 'View Quotation'}
                {modalType === 'edit' && 'Edit Quotation'}
                {modalType === 'delete' && 'Delete Quotation'}
              </h3>
              
              {modalType === 'view' && selectedQuote && (
                <div className="space-y-3 text-sm">
                  <p><strong>ID:</strong> {selectedQuote.id}</p>
                  <p><strong>Client:</strong> {selectedQuote.clientName}</p>
                  <p><strong>Amount:</strong> ${selectedQuote.amount?.toLocaleString()}</p>
                  <p><strong>Status:</strong> {selectedQuote.status}</p>
                  <p><strong>Date:</strong> {selectedQuote.date}</p>
                  <p><strong>Employee:</strong> {selectedQuote.employeeName}</p>
                </div>
              )}
              
              {modalType === 'edit' && selectedQuote && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      defaultValue={selectedQuote.status}
                      onChange={(e) => handleStatusUpdate(selectedQuote.id, e.target.value)}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              )}
              
              {modalType === 'delete' && selectedQuote && (
                <div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Are you sure you want to delete quotation {selectedQuote.id}? This action cannot be undone.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleDelete(selectedQuote.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {modalType !== 'delete' && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationManagement;