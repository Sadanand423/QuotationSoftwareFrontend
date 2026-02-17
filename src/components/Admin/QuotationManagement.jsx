import React, { useState, useEffect } from "react";

const QuotationManagement = () => {
  const [quotations, setQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 1. Added Loading State
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [modalType, setModalType] = useState(""); 

  const statusFilters = ["All", "Draft", "Pending", "Approved", "Rejected"];

  const fetchQuotations = async () => {
    setIsLoading(true); // 2. Start loading before fetch
    try {
      const response = await fetch("http://localhost:8080/api/quotations");
      if (!response.ok) throw new Error("Failed to fetch quotations");
      const data = await response.json();
      setQuotations(data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    } finally {
      setIsLoading(false); // 3. Stop loading regardless of success/fail
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // REPLACE your existing filteredQuotations logic with this:
const filteredQuotations = quotations.filter((quote) => {
  // 1. Fallback for status: if it's missing, treat as "Draft"
  const currentStatus = quote.status || "Draft";
  const matchesFilter = activeFilter === "All" || currentStatus === activeFilter;

  // 2. Safe Search: use optional chaining and fallbacks for strings
  const search = searchTerm.toLowerCase();
  const matchesSearch =
    (quote.client?.toLowerCase() || "").includes(search) ||
    (quote.quotationNumber?.toLowerCase() || "").includes(search) ||
    (quote.preparedBy?.toLowerCase() || "").includes(search);

  return matchesFilter && matchesSearch;
});

  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotations = filteredQuotations.slice(startIndex, startIndex + itemsPerPage);

  const handleAction = async (quote, action) => {
    if (action === 'view') {
      try {
        const response = await fetch(`http://localhost:8080/api/quotations/${quote.id}`);
        const fullData = await response.json();
        setSelectedQuote(fullData);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    } else {
      setSelectedQuote(quote);
    }
    setModalType(action);
    setShowModal(true);
  };

const updateQuotationStatus = async (quotationId, newStatus) => {
  try {
    const response = await fetch(`http://localhost:8080/api/quotations/${quotationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }) // Sending only the status field
    });

    if (response.ok) {
      // DYNAMIC UPDATE: This updates the local state immediately
      setQuotations(prev => 
        prev.map(q => q.id === quotationId ? { ...q, status: newStatus } : q)
      );
      
      // Update the modal view if it's open
      setSelectedQuote(prev => ({ ...prev, status: newStatus }));
      
      console.log("Status synced with database!");
    }
  } catch (error) {
    console.error("CORS or Network Error:", error);
  }
};


 // REPLACE your handleDelete with this:
const handleDelete = async (quoteId) => {
  if (!window.confirm("Are you sure you want to delete this quotation?")) return;

  try {
    const response = await fetch(`http://localhost:8080/api/quotations/${quoteId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove from local state immediately
      setQuotations(prev => prev.filter((q) => q.id !== quoteId));
      setShowModal(false);
    } else {
      alert("Delete failed on server ❌");
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("Failed to delete ❌");
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "Approved": return "bg-green-500";
      case "Pending": return "bg-yellow-500";
      case "Draft": return "bg-gray-500";
      case "Rejected": return "bg-red-500";
      default: return "bg-gray-500";
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
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">QUOTATION NO</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CLIENT</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">AMOUNT</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">STATUS</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">DATE</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* 4. LOADING & EMPTY STATE LOGIC ADDED HERE */}
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mb-3"></div>
                      <p className="text-gray-500 font-medium">Loading quotations...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedQuotations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No quotations found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedQuotations.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(quote.status)}`}></div>
                        {quote.quotationNumber}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{quote.client}</td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-semibold hidden sm:table-cell">
                      {quote.currency || '$'}{quote.totalCost?.toLocaleString() || '0'}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(quote.status)}`}>
                        {quote.status || 'Draft'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">{quote.date}</td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <div className="flex gap-3">
                        <button onClick={() => handleAction(quote, 'view')} className="text-green-600 hover:text-green-800 font-medium">View</button>
                        <button onClick={() => handleAction(quote, 'edit')} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button onClick={() => handleAction(quote, 'delete')} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination logic */}
        {!isLoading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredQuotations.length)} of {filteredQuotations.length}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(p-1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <button onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal logic remains same as your provided code */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4 capitalize">{modalType} Quotation</h3>
            {modalType === 'view' && selectedQuote && (
              <div className="space-y-2 text-sm">
                <p><strong>No:</strong> {selectedQuote.quotationNumber}</p>
                <p><strong>Client:</strong> {selectedQuote.client}</p>
                <p><strong>Amount:</strong> {selectedQuote.currency} {selectedQuote.totalCost?.toLocaleString()}</p>
                <p><strong>Date:</strong> {selectedQuote.date}</p>
              </div>
            )}
            {/* 1. Add this inside the Modal, above the Close button */}

{modalType === 'edit' && selectedQuote && (
  <div className="space-y-4">
    <p className="text-sm text-gray-500">Update status for {selectedQuote.quotationNumber}</p>
    <div className="grid grid-cols-2 gap-2">
      {["Draft", "Pending", "Approved", "Rejected"].map(status => (
        <button 
          key={status}
          onClick={() => updateQuotationStatus(selectedQuote.id, status)}
          className={`px-4 py-2 rounded-lg border text-sm transition-all ${selectedQuote.status === status ? 'bg-blue-50 border-blue-500 text-blue-600' : 'hover:bg-gray-50'}`}
        >
          {status}
        </button>
      ))}
    </div>
  </div>
)}

{modalType === 'delete' && selectedQuote && (
  <div className="text-center">
    <p className="mb-6 text-gray-600">Are you sure you want to delete <strong>{selectedQuote.quotationNumber}</strong>?</p>
    <div className="flex justify-center gap-4">
      <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
      <button onClick={() => handleDelete(selectedQuote.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg">Confirm Delete</button>
    </div>
  </div>
)}
            {/* ... other modal contents ... */}
            <div className="flex justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="bg-gray-200 px-4 py-2 rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationManagement;