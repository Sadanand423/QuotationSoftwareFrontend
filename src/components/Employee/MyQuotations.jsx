import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyQuotations = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [quotations, setQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const currentEmpId = localStorage.getItem("empId") || "EMP-001"; 

  const fetchMyQuotations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/quotations/employee/id/${currentEmpId}`);
      if (response.ok) {
        const data = await response.json();
        setQuotations(data);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyQuotations();
  }, [currentEmpId]);

  const search = searchTerm.toLowerCase();
  const filteredQuotations = quotations.filter(quote => {
    const matchesFilter = filter === 'all' || (quote.status && quote.status.toLowerCase() === filter.toLowerCase());
    const matchesSearch =
      (quote.client?.toLowerCase() || '').includes(search) ||
      (quote.quotationNumber?.toLowerCase() || '').includes(search) ||
      (quote.preparedBy?.toLowerCase() || '').includes(search);
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotations = filteredQuotations.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My Quotations</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage assigned quotations (ID: {currentEmpId})</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search quotations..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {/* Status Filter Tabs */}
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all ${
                  filter === status ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quotation No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                {/* ✅ Added Date Header */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Loading...</td></tr>
              ) : paginatedQuotations.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">No quotations found.</td></tr>
              ) : (
                paginatedQuotations.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{quote.quotationNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{quote.client}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {quote.currency} {(quote.finalAmount || quote.totalCost + (quote.gstAmount || 0))?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        quote.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {quote.status || 'Pending'}
                      </span>
                    </td>
                    {/* ✅ Added Date Column */}
                    <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                      {quote.date || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-3">
                      <button 
                        onClick={() => setSelectedQuote(quote)} 
                        className="text-green-600 hover:text-green-800 font-medium"
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

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredQuotations.length)} of {filteredQuotations.length}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* --- VIEW QUOTATION MODAL --- */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-bold text-gray-800">Quotation Summary</h3>
              <button onClick={() => setSelectedQuote(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Quotation Number</span>
                <span className="text-gray-900 font-bold">{selectedQuote.quotationNumber}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Client Name</span>
                <span className="text-gray-900 font-medium">{selectedQuote.client}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Project Name</span>
                <span className="text-gray-900">{selectedQuote.project || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Total Amount</span>
                <span className="text-green-600 font-bold">{selectedQuote.currency} {selectedQuote.totalCost?.toLocaleString()}</span>
              </div>
              {/* ✅ Date Row in Modal */}
              <div className="flex justify-between">
                <span className="text-gray-500">Created Date</span>
                <span className="text-gray-900">{selectedQuote.date || 'N/A'}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedQuote(null)}
              className="mt-8 w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyQuotations;