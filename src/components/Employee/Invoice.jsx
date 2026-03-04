import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mainlogo from "../../assets/mainlogo.webp";


const Invoice = () => {
  
  const navigate = useNavigate();
  const [signature, setSignature] = useState(null);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef();
  // Create a policy to "trust" the HTML we generate for printing
const printPolicy = window.trustedTypes?.createPolicy("printPolicy", {
  createHTML: (string) => string,
});

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


const handleInvoicePrint = () => {
  const printContent = printRef.current.innerHTML;

  // Collect all styles to ensure the preview isn't blank
  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        if (sheet.href) return `<link rel="stylesheet" href="${sheet.href}">`;
        if (sheet.ownerNode) return `<style>${sheet.ownerNode.innerHTML}</style>`;
      } catch (e) { return ""; }
      return "";
    }).join("");

  const fullHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${invoiceData.invoiceNumber}</title>
        ${styles}
        <style>
          /* Set the page size to A4 and remove default browser margins */
          @page { 
            size: A4; 
            margin: 10mm; /* Gives the printer some breathing room */
          }
          
          body { 
            margin: 0; 
            padding: 0; 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
          }

          /* This mimics your 'border-2 border-black' look from the preview */
          .print-container { 
            border: 2px solid black !important; 
            padding: 20px;
            min-height: 270mm; /* Ensures the border stretches down the A4 page */
            box-sizing: border-box;
          }
          
          /* Ensures images like the logo and signature load before printing */
          img { max-width: 100%; display: block; }
        </style>
      </head>
      <body>
        <div class="print-container">${printContent}</div>
        <script>
          window.onload = () => {
            // Give extra time for the signature blob and logo to render
            setTimeout(() => { 
              window.print(); 
              window.onafterprint = () => window.close();
            }, 800);
          };
        </script>
      </body>
    </html>`;

  const blob = new Blob([fullHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">GST (%):</label>
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

            {/* Signature Upload */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Upload Signature:
  </label>

  <input
    type="file"
    accept="image/*"
    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        setSignature(URL.createObjectURL(file));
      }
    }}
  />

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
  onClick={() => setShowPreview(true)}
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
    
{showPreview && (
<div className="fixed inset-0 bg-black/40 overflow-y-auto z-50 p-10 flex flex-col items-center">

{/* A4 PAGE */}
<div className="bg-white w-[794px] min-h-[900px] p-8 shadow-xl">

{/* SINGLE BORDER */}
<div ref={printRef} className="border-2 border-black h-full p-6 text-[14px] flex flex-col justify-between">


{/* HEADER */}
<div>

<div className="flex justify-between items-start border-b-2 border-black pb-4">

<div className="flex gap-4">

<img src={mainlogo} className="w-20 border p-1"/>

<div>

<h2 className="text-lg font-bold tracking-wide">
SMARTMATRIX Digital Services
</h2>

<p className="text-xs">
First Floor, Survey No. 21, Ganesham Commercial-A, Office No 102-A,<br />
Aundh-Ravet BRTS Rd, Pimple Saudagar, Pune 411027
</p>

<p className="text-xs mt-1">
Phone: 9112108484
</p>

</div>

</div>

<h1 className="text-2xl font-bold tracking-widest">
INVOICE
</h1>

</div>


{/* TAX TITLE */}
<div className="text-center text-gray-500 font-bold text-base py-3 border-b">
TAX INVOICE
</div>


{/* BILL + DETAILS */}
<div className="grid grid-cols-2 border-b">

<div className="p-3 border-r">

<h3 className="font-bold mb-2">BILL TO:</h3>

<p><b>Client Name:</b> {invoiceData.clientName}</p>
<p><b>Phone:</b> {invoiceData.clientPhone}</p>
<p><b>Email:</b> {invoiceData.clientEmail}</p>
<p><b>Address:</b> {invoiceData.clientAddress}</p>

</div>


<div className="p-3 text-sm">

<div className="flex justify-between border-b py-1">
<span>Invoice No:</span>
<span>{invoiceData.invoiceNumber}</span>
</div>

<div className="flex justify-between border-b py-1">
<span>Invoice Date:</span>
<span>{invoiceData.invoiceDate}</span>
</div>

<div className="flex justify-between border-b py-1">
<span>Salesperson:</span>
<span>{currentEmpName}</span>
</div>

<div className="flex justify-between border-b py-1">
<span>Payment Method:</span>
<span className="text-green-600 font-semibold">Cash</span>
</div>

<div className="flex justify-between py-1">
<span>Payment Status:</span>
<span className="text-red-600 font-semibold">Paid</span>
</div>

</div>

</div>


{/* PRODUCT TABLE */}
<table className="w-full border text-sm mt-4">

<thead className="bg-gray-200 font-semibold">

<tr>
<th className="border p-2">Sr No.</th>
<th className="border p-2">Name of Project/Service</th>

<th className="border p-2">Price</th>

<th className="border p-2">Total</th>
</tr>

</thead>

<tbody>

<tr>

<td className="border text-center">1</td>

<td className="border p-2">
{invoiceData.projectName}
</td>



<td className="border text-center">
₹{Number(invoiceData.totalAmount).toLocaleString("en-IN")}
</td>



<td className="border text-right pr-2">
₹{Number(invoiceData.finalAmount).toLocaleString("en-IN")}
</td>

</tr>

</tbody>

</table>


{/* TOTAL SECTION */}
<div className="grid grid-cols-2 border mt-6">

<div className="p-3 border-r">

<p className="font-semibold">
Total in words:
</p>

<p className="font-bold mt-2 uppercase">
{Number(invoiceData.finalAmount).toLocaleString("en-IN")} RUPEES ONLY
</p>

</div>


<div className="p-3">

<div className="flex justify-between py-1">
<span>Taxable Amount:</span>
<span>₹{invoiceData.totalAmount}</span>
</div>

<div className="flex justify-between py-1">
<span>GST :</span>
<span>₹0.00</span>
</div>

<div className="flex justify-between font-bold py-2 border-t">
<span>Total Amount:</span>
<span>₹{invoiceData.finalAmount}</span>
</div>

<div className="flex justify-between py-1">
<span>Paid Amount:</span>
<span>₹{invoiceData.finalAmount}</span>
</div>

<div className="flex justify-between border-t pt-2 font-bold text-orange-600">
<span>Balance Amount:</span>
<span>₹0.00</span>
</div>

</div>

</div>

</div>


{/* SIGNATURE */}

<div className="flex justify-end mt-10">

  <div className="text-center">

    {signature ? (
      <img
        src={signature}
        alt="Signature"
        className="h-16 mx-auto mb-2"
      />
    ) : (
      <div className="w-44 border-t border-black"></div>
    )}

    <p className="mt-1 text-sm font-semibold">
      Authorized Signature
    </p>

  </div>

</div>

</div>

</div>

{/* BUTTONS BELOW PAGE */}

<div className="flex gap-6">

<button
onClick={handleInvoicePrint}
className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
>
Print
</button>

<button
onClick={() => setShowPreview(false)}
className="bg-gray-600 text-white px-6 py-2 rounded shadow hover:bg-gray-700"
>
Close
</button>

</div>

</div>



)}


    </div> 
    
    
  );
};

export default Invoice;