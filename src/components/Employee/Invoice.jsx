import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Invoice = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  
  // ✅ Dynamic State for Backend Data
  const [approvedQuotations, setApprovedQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Get Employee ID
  const currentEmpId = localStorage.getItem("empId") || "EMP-001";
  const [currentEmpName, setCurrentEmpName] = useState("");

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toLocaleDateString('en-IN'),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
    quotationId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    projectName: '',
    totalAmount: '',
    taxRate: '18',
    taxAmount: '',
    finalAmount: '',
    paymentTerms: '30 days from invoice date',
    bankDetails: {
      bankName: 'HDFC Bank',
      accountNumber: '1234567890',
      ifscCode: 'HDFC0001234',
      accountHolder: 'Smartmatrix Digital Services'
    }
  });

  // ✅ 1. Fetch Approved Quotations for this Employee
useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true); // Start loading spinner
    try {
      // ✅ STEP 1: Fetch Employee Name
      const empResponse = await fetch(`http://localhost:8080/api/admin/employees/id/${currentEmpId}`);
      if (empResponse.ok) {
        const empData = await empResponse.json();
        if (empData.name) {
          setCurrentEmpName(empData.name);
          localStorage.setItem("empName", empData.name);
        }
      }

      // ✅ STEP 2: Fetch Approved Quotations (Crucial for showing the list!)
      const quotResponse = await fetch(`http://localhost:8080/api/quotations/employee/id/${currentEmpId}`);
      if (quotResponse.ok) {
        const quotData = await quotResponse.json();
        // Filter only 'Approved' ones so they are ready for invoice
        const approved = quotData.filter(q => q.status === 'Approved');
        setApprovedQuotations(approved);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  if (currentEmpId) {
    fetchData();
  }
}, [currentEmpId]);
   
  // ✅ 2. Save Invoice to Backend
  const handleSaveInvoice = async () => {
    try {
      // Get the freshest name from localStorage or state
      const savedName = localStorage.getItem("empName") || currentEmpName;

      // Ensure we are sending the correct name, NOT the ID
      const payload = {
        ...invoiceData,
        employeeId: currentEmpId,
        employeeName: savedName, // Use the variable we just checked
        status: 'Sent',
        date: new Date().toLocaleDateString('en-IN')
      };

      console.log("Saving Payload:", payload); // Debug to check before sending

      const response = await fetch(`http://localhost:8080/api/invoices/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Invoice generated and saved successfully! ✅");
        navigate('./MyInvoice'); // Or wherever your dashboard is
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Server connection error ❌");
    }
  };
  

  const handlePrintInvoice = () => {
    window.print();
  };

  const generateInvoice = (quotation) => {
  const rawAmount = typeof quotation.totalCost === 'string' 
    ? parseFloat(quotation.totalCost.replace(/[₹,]/g, '')) 
    : quotation.totalCost;

  const taxAmount = (rawAmount * parseFloat(invoiceData.taxRate)) / 100;
  const finalTotal = rawAmount + taxAmount;
  
  setInvoiceData({
    ...invoiceData,
    quotationId: quotation.quotationNumber || quotation.id,
    clientName: quotation.client,
    clientEmail: quotation.clientEmail || '', 
    clientPhone: quotation.clientPhone || '',
    clientAddress: quotation.clientAddress || '',
    projectName: quotation.project,
    totalAmount: rawAmount, // Store as number for better DB handling
    taxAmount: taxAmount,
    finalAmount: finalTotal
  });
  setSelectedQuotation(quotation);
  setShowForm(true);
};

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Invoice Management
          </h2>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">Generate invoices from approved quotations</p>
        </div>
      </div>

      {!showForm ? (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
              <span className="mr-2">✅</span>
              <span className="hidden sm:inline">Approved Quotations Ready for Invoice</span>
              <span className="sm:hidden">Ready for Invoice</span>
            </h3>
          </div>
          
          <div className="p-4 sm:p-6">
            {isLoading ? (
               <div className="text-center py-6 text-gray-500">Loading approved projects...</div>
            ) : approvedQuotations.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {approvedQuotations.map((quotation) => (
                  <div key={quotation.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-3 sm:gap-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm sm:text-base">{quotation.quotationNumber || quotation.id}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{quotation.client} - {quotation.project}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-green-600 text-sm sm:text-base">
                            ₹{quotation.totalCost?.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-gray-500">Approved: {quotation.date}</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => generateInvoice(quotation)}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200 font-medium text-sm whitespace-nowrap ml-4"
                    >
                      Generate Invoice
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl sm:text-4xl">📋</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Approved Quotations</h3>
                <p className="text-gray-600 text-sm sm:text-base">No quotations are ready for invoice generation.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-6 py-3 sm:py-4">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
              <span className="mr-2">🧾</span>
              <span className="hidden sm:inline">Generate Invoice - {invoiceData.quotationId}</span>
              <span className="sm:hidden">Generate Invoice</span>
            </h3>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Invoice Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Number:</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm sm:text-base"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Date:</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm sm:text-base"
                  value={invoiceData.invoiceDate}
                  onChange={(e) => setInvoiceData({...invoiceData, invoiceDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date:</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm sm:text-base"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                />
              </div>
            </div>

            {/* Client Information */}
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Client Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Client Name:</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
                    value={invoiceData.clientName}
                    onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email:</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
                    value={invoiceData.clientEmail}
                    onChange={(e) => setInvoiceData({...invoiceData, clientEmail: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone:</label>
                  <input 
                    type="tel" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
                    value={invoiceData.clientPhone}
                    onChange={(e) => setInvoiceData({...invoiceData, clientPhone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Project Name:</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
                    value={invoiceData.projectName}
                    onChange={(e) => setInvoiceData({...invoiceData, projectName: e.target.value})}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Address:</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm sm:text-base"
                    rows="2"
                    value={invoiceData.clientAddress}
                    onChange={(e) => setInvoiceData({...invoiceData, clientAddress: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Amount Details */}
            <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Amount Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Total Amount:</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-semibold text-sm sm:text-base"
                    value={invoiceData.totalAmount}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Tax Rate (%):</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm sm:text-base"
                    value={invoiceData.taxRate}
                    onChange={(e) => setInvoiceData({...invoiceData, taxRate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Final Amount:</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-bold text-green-700 text-sm sm:text-base"
                    value={invoiceData.finalAmount}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Terms:</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm sm:text-base"
                rows="2"
                value={invoiceData.paymentTerms}
                onChange={(e) => setInvoiceData({...invoiceData, paymentTerms: e.target.value})}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button 
                onClick={handleSaveInvoice}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base">
                Generate Invoice
              </button>
              <button 
                onClick={handlePrintInvoice}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base">
                Preview Invoice
              </button>
              <button 
                onClick={() => setShowForm(false)}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;