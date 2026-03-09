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

  // ✅ Dynamic State for Backend Data
  const [approvedQuotations, setApprovedQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Get Employee ID
  const currentEmpId = localStorage.getItem("empId") || "EMP-001";
  const [currentEmpName, setCurrentEmpName] = useState("");

  const numberToWords = (num) => {
  const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if ((num = num.toString()).length > 9) return 'overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return ''; 
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim().toUpperCase();
};

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
    totalAmount: 0,
    taxRate: '18',
    taxAmount: 0,
    finalAmount: 0,
    paymentTerms: '30 days from invoice date',
    advancePercentage: '0%',
    advancePaid: 0,
    midwayPercentage: '0%',
    midwayPaid: 0,
    finalPaymentPaid: 0,
    totalPaidAmount: 0,
    balanceAmount: 0,
    paymentStatus: 'Pending',
    paymentMethod: 'UPI/Online',
    bankDetails: {
      bankName: 'HDFC Bank',
      accountNumber: '1234567890',
      ifscCode: 'HDFC0001234',
      accountHolder: 'Smartmatrix Digital Services'
    }
  });

  // ✅ Auto-calculate totals whenever payment fields change
 useEffect(() => {
  const final = parseFloat(invoiceData.finalAmount) || 0;
  const adv = parseFloat(invoiceData.advancePaid) || 0;
  const mid = parseFloat(invoiceData.midwayPaid) || 0;
  
  // Total money received so far
  const totalPaid = adv + mid;
  const balance = final - totalPaid;

  let status = "Pending";
  if (totalPaid >= final && final > 0) {
    status = "Paid";
  } else if (totalPaid > 0) {
    status = "Partially Paid";
  }

  setInvoiceData(prev => ({
    ...prev,
    totalPaidAmount: totalPaid.toFixed(2),
    balanceAmount: balance.toFixed(2),
    paymentStatus: status
  }));
}, [invoiceData.advancePaid, invoiceData.midwayPaid, invoiceData.finalAmount]);

  // ✅ Fetch Approved Quotations
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const empResponse = await fetch(`http://localhost:8080/api/admin/employees/id/${currentEmpId}`);
        if (empResponse.ok) {
          const empData = await empResponse.json();
          if (empData.name) {
            setCurrentEmpName(empData.name);
            localStorage.setItem("empName", empData.name);
          }
        }

        const quotResponse = await fetch(`http://localhost:8080/api/quotations/employee/id/${currentEmpId}`);
        if (quotResponse.ok) {
          const quotData = await quotResponse.json();
          const approved = quotData.filter(q => q.status === 'Approved');
          setApprovedQuotations(approved);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentEmpId) fetchData();
  }, [currentEmpId]);

 const generateInvoice = (quotation) => {

  const rawAmount =
    typeof quotation.totalCost === "string"
      ? parseFloat(quotation.totalCost.replace(/[₹,]/g, ""))
      : quotation.totalCost || 0;

  const gstPercent = quotation.gstPercent || 0;
  const gstAmount = quotation.gstAmount || 0;

  // If finalAmount exists use it, otherwise calculate
  const finalTotal =
    quotation.finalAmount || rawAmount + gstAmount;

  setInvoiceData((prev) => ({
    ...prev,
    quotationId: quotation.quotationNumber || quotation.id,
    clientName: quotation.client || "",
    clientEmail: quotation.clientEmail || "",
    clientPhone: quotation.clientPhone || "",
    clientAddress: quotation.clientAddress || "",
    projectName: quotation.project || "",

    totalAmount: rawAmount,

    // 🔥 Fetch GST directly from DB
    taxRate: gstPercent,
    taxAmount: gstAmount,

    finalAmount: finalTotal,
  }));

  setSelectedQuotation(quotation);
  setShowForm(true);
};

  const handleSaveInvoice = async () => {
    try {
      const savedName = localStorage.getItem("empName") || currentEmpName;
      const payload = {
        ...invoiceData,
        employeeId: currentEmpId,
        employeeName: savedName,
        status: 'Sent',
        date: new Date().toLocaleDateString('en-IN')
      };

      const response = await fetch(`http://localhost:8080/api/invoices/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Invoice generated and saved successfully! ✅");
        navigate('/MyInvoice'); 
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Server connection error ❌");
    }
  };

const handleInvoicePrint = () => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const content = printRef.current.innerHTML;
  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
      } catch (e) { return ""; }
    }).join("");

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <html>
      <head>
        <style>
          ${styles}
          @page { 
            size: A4; 
            margin: 10mm; /* Space between paper edge and your border */
          }
          body { 
            -webkit-print-color-adjust: exact; 
            margin: 0;
            padding: 0;
          }
          /* This creates the outer page border */
          .print-wrapper {
            border: 2px solid black; 
            min-height: 277mm; /* Approximate A4 height minus margins */
            padding: 20px;
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        <div class="print-wrapper">
          ${content}
        </div>
        <script>
          window.onload = () => {
            window.print();
            setTimeout(() => { window.frameElement.remove(); }, 100);
          };
        </script>
      </body>
    </html>
  `);
  doc.close();
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
              <span>Approved Quotations Ready for Invoice</span>
            </h3>
          </div>
          
          <div className="p-4 sm:p-6">
            {isLoading ? (
                <div className="text-center py-6 text-gray-500">Loading approved projects...</div>
            ) : approvedQuotations.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {approvedQuotations.map((quotation) => (
                  <div key={quotation.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-3">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{quotation.quotationNumber || quotation.id}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{quotation.client} - {quotation.project}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-green-600">₹{quotation.totalCost?.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-500">Approved: {quotation.date}</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => generateInvoice(quotation)}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium text-sm"
                    >
                      Generate Invoice
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-800">No Approved Quotations</h3>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-4">
            <h3 className="text-lg font-bold text-white">Generate Invoice - {invoiceData.quotationId}</h3>
          </div>
          
          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Number:</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" value={invoiceData.invoiceNumber} onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Date:</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" value={invoiceData.invoiceDate} onChange={(e) => setInvoiceData({...invoiceData, invoiceDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date:</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" value={invoiceData.dueDate} onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})} />
              </div>
            </div>

           {/* Client Information Section */}
<div className="bg-[#f0f7ff] p-4 sm:p-6 rounded-xl border border-blue-100 shadow-sm">
  <h4 className="text-gray-700 font-bold mb-4 text-base">Client Information</h4>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1">Client Name:</label>
      <input 
        type="text"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        value={invoiceData.clientName}
        onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})}
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1">Email:</label>
      <input 
        type="email"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        value={invoiceData.clientEmail}
        onChange={(e) => setInvoiceData({...invoiceData, clientEmail: e.target.value})}
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1">Phone:</label>
      <input 
        type="text"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        value={invoiceData.clientPhone}
        onChange={(e) => setInvoiceData({...invoiceData, clientPhone: e.target.value})}
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1">Project Name:</label>
      <input 
        type="text"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        value={invoiceData.projectName}
        onChange={(e) => setInvoiceData({...invoiceData, projectName: e.target.value})}
      />
    </div>
    <div className="sm:col-span-2">
      <label className="block text-sm font-semibold text-gray-600 mb-1">Address:</label>
      <textarea 
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white resize-none"
        rows="2"
        value={invoiceData.clientAddress}
        onChange={(e) => setInvoiceData({...invoiceData, clientAddress: e.target.value})}
      />
    </div>
  </div>
</div>

            {/* Payment Breakdown Section */}
<div className="bg-[#fdfaff] p-5 rounded-xl border border-purple-100 shadow-sm">
  <div className="font-bold text-gray-700 mb-4 flex items-center gap-2">
    <span>🗓️</span> Payment Details
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* 1. Advance Payment */}
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-gray-500 uppercase">1. Advance</label>
        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">REQUIRED</span>
      </div>
      <select 
        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-purple-400 outline-none"
        value={invoiceData.advancePercentage.replace('%', '')}
        onChange={(e) => {
          const percent = parseFloat(e.target.value);
          const amt = (parseFloat(invoiceData.finalAmount) * percent) / 100;
          setInvoiceData(prev => ({ ...prev, advancePaid: amt.toFixed(2), advancePercentage: percent + "%" }));
        }}
      >
        <option value="0">Select Percentage</option>
        <option value="40">40% Advance</option>
        <option value="50">50% Advance</option>
        <option value="100">100% Full Payment</option>
      </select>
      <div className="text-lg font-bold text-purple-600">
        ₹{Number(invoiceData.advancePaid).toLocaleString('en-IN')}
      </div>
    </div>

    {/* 2. Mid-Way Payment */}
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-gray-500 uppercase">2. Mid-Way</label>
        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">OPTIONAL</span>
      </div>
      <select 
        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-400 outline-none"
        value={invoiceData.midwayPercentage.replace('%', '')}
        onChange={(e) => {
          const percent = parseFloat(e.target.value);
          const amt = (parseFloat(invoiceData.finalAmount) * percent) / 100;
          setInvoiceData(prev => ({ ...prev, midwayPaid: amt.toFixed(2), midwayPercentage: percent + "%" }));
        }}
      >
        <option value="0">No Mid-way (0%)</option>
        <option value="20">20% Milestone</option>
        <option value="40">40% Milestone</option>
      </select>
      <div className="text-lg font-bold text-blue-600">
        ₹{Number(invoiceData.midwayPaid).toLocaleString('en-IN')}
      </div>
    </div>

    {/* 3. Pending Balance */}
    <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-xl border border-orange-100 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-orange-600 uppercase">3. Pending Details</label>
        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">DUE LATER</span>
      </div>
      <div className="pt-2">
        <div className="text-2xl font-black text-orange-700">
          ₹{(parseFloat(invoiceData.finalAmount) - parseFloat(invoiceData.advancePaid)).toLocaleString('en-IN')}
        </div>
        
      </div>
    </div>
  </div>
</div>

{/* Payment Method Selection */}
<div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
    💳 Payment Method
  </label>
  <select 
    className="w-full p-3 bg-white border border-gray-300 rounded-lg font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
    value={invoiceData.paymentMethod}
    onChange={(e) => setInvoiceData({...invoiceData, paymentMethod: e.target.value})}
  >
    <option value="UPI/Online">UPI / Online Transfer</option>
    <option value="Cash">Cash</option>
    <option value="Cheque">Cheque</option>
    <option value="Bank Transfer">NEFT / Bank Transfer</option>
  </select>
</div>
           <div className="mt-4">
  <label className="block text-sm font-bold text-gray-700 mb-2">
    Authorized Signature
  </label>
  <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors relative">
    {/* Icon or Preview */}
    <div className="w-16 h-12 border bg-white rounded flex items-center justify-center overflow-hidden">
      {signature ? (
        <img src={signature} alt="Sign" className="h-full object-contain" />
      ) : (
        <span className="text-gray-400 text-xs text-center">No sign</span>
      )}
    </div>

    {/* Text and Hidden Input */}
    <div>
      <p className="text-sm font-medium text-indigo-600">Click to upload image</p>
      <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
    </div>

    <input 
      type="file" 
      accept="image/*" 
      className="absolute inset-0 opacity-0 cursor-pointer" 
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) setSignature(URL.createObjectURL(file));
      }} 
    />
  </div>
  {signature && (
    <button 
      onClick={() => setSignature(null)}
      className="text-xs text-red-500 mt-2 underline"
    >
      Clear signature
    </button>
  )}
</div>

            <div className="flex gap-4 pt-4">
              <button onClick={handleSaveInvoice} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow">Save Invoice</button>
              <button onClick={() => setShowPreview(true)} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow">Preview</button>
              <button onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-8 py-3 rounded-lg font-bold shadow">Cancel</button>
            </div>
          </div>
        </div>
      )}

      
    
     {showPreview && (
  <div className="fixed inset-0 bg-black/40 overflow-y-auto z-50 p-10 flex flex-col items-center">
    <div className="bg-white w-[794px] min-h-[900px] p-8 shadow-xl">
      <div ref={printRef} className="border-2 border-black h-full p-6 text-[14px] flex flex-col">
        
        {/* Header Section */}
        <div className="flex justify-between items-start border-b border-gray-400 pb-4">
          <div className="flex gap-4">
            <img src={mainlogo} alt="Logo" className="w-30 border p-1" />
            <div>
              <h1 className="text-lg font-bold">SMARTMATRIX Digital Services</h1>
              <p className="text-[13px] leading-tight">First Floor, Survey No. 21, Ganesham Commercial-A, Office No 102-A,
Aundh-Ravet BRTS Rd, Pimple Saudagar, Pune 411027</p>
              <p className="text-[13px]">Phone: 9112108484</p>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">INVOICE</h1>
        </div>

        {/* TAX TITLE */}

<div className="text-center text-gray-500 font-bold text-base py-3 border-b">

TAX INVOICE

</div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 border-b border-gray-400">
          <div className="p-3 border-r border-gray-400 space-y-1">
            <h3 className="font-bold text-sm">BILL TO:</h3>
            <p><span className="font-bold">Client Name:</span> {invoiceData.clientName}</p>
            <p><span className="font-bold">Phone:</span> {invoiceData.clientPhone}</p>
            <p><span className="font-bold">Email:</span> {invoiceData.clientEmail}</p>
            <p><span className="font-bold">Address:</span> {invoiceData.clientAddress}</p>
          </div>
          <div className="p-3 text-sm flex flex-col justify-between">
            <div className="flex justify-between border-b border-gray-300 py-1"><span>Invoice No:</span><span className="font-medium">{invoiceData.invoiceNumber}</span></div>
            <div className="flex justify-between border-b border-gray-300 py-1"><span>Invoice Date:</span><span className="font-medium">{invoiceData.invoiceDate}</span></div>
            <div className="flex justify-between border-b border-gray-300 py-1"><span>Employee:</span><span className="font-medium">{currentEmpName}</span></div>
          {/* Replace the hardcoded line with this dynamic one */}
<div className="flex justify-between border-b border-gray-300 py-1">
  <span>Payment Method:</span>
  <span className="font-bold text-green-600">
    {invoiceData.paymentMethod}
  </span>
</div>
            <div className="flex justify-between py-1">
              <span>Payment Status:</span>
              <span className={`font-bold ${invoiceData.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                {invoiceData.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Item Table */}
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-400">
              <th className="border border-gray-400 p-2 w-16 text-gray-700">Sr No.</th>
              <th className="border border-gray-400 p-2 text-left text-gray-700">Name of Project/Service</th>
              <th className="border border-gray-400 p-2 w-24 text-gray-700">Price</th>
              <th className="border border-gray-400 p-2 w-32 text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-20">
              <td className="border border-gray-400 text-center pt-2 align-top">1</td>
              <td className="border border-gray-400 p-2 align-top font-medium">{invoiceData.projectName}</td>
              <td className="border border-gray-400 text-center pt-2 align-top">₹{Number(invoiceData.totalAmount).toLocaleString("en-IN")}</td>
              <td className="border border-gray-400 text-center p-2 align-top font-bold text-gray-800">₹{Number(invoiceData.finalAmount).toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>

       {/* Totals Section */}
<div className="grid grid-cols-2 border border-gray-400 mt-4">
  <div className="p-4 border-r-2 border-gray-400 justify-center bg-gray-50/50">
    <p className="font-bold text-[12px] uppercase text-gray-700 mb-1">Total in words:</p>   <br />
    <p 
  style={{ fontSize: '15px' }} 
  className="uppercase leading-tight text-gray-900 tracking-wide font-medium"
>
  {numberToWords(Math.round(invoiceData.finalAmount))} RUPEES ONLY
</p>
  </div>
          <div className="p-0 text-sm">
            <div className="flex justify-between p-2 border-b border-gray-300"><span>Total Project Amount:</span><span>₹{Number(invoiceData.totalAmount).toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between p-2 border-b border-gray-300 text-gray-900"><span>GST ({invoiceData.taxRate}%):</span><span>₹{Number(invoiceData.taxAmount).toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between p-2 font-black text-base"><span>Final Amount:</span><span>₹{Number(invoiceData.finalAmount).toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between p-2 text-green-900 font-bold bg-green-100"><span>Paid Amount:</span><span className="font-bold">₹{Number(invoiceData.totalPaidAmount).toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between p-2 border-t-2 border-orange-500 bg-orange-50 font-bold text-orange-700">
              <span>Balance Amount:</span>
              <span>₹{Number(invoiceData.balanceAmount).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Signature */}
        
        
        <div className="flex justify-end mt-13">
          <div className="text-center">
            {signature ? <img src={signature} alt="Signature" className="h-12 mx-auto mb-1" /> : <div className="h-12"></div>}
            <div className="w-48 border-t border-black"></div>
            <p className="text-[11px] font-bold uppercase mt-1">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
    <div className="flex gap-4 mt-6">
      <button onClick={handleInvoicePrint} className="bg-blue-600 text-white px-10 py-2 rounded-full font-bold shadow-lg hover:bg-blue-700">Print Invoice</button>
      <button onClick={() => setShowPreview(false)} className="bg-white text-gray-800 px-10 py-2 rounded-full font-bold border hover:bg-gray-50">Close</button>
    </div>
  </div>
)}
    </div> 
  );
};

export default Invoice;