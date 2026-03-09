import React, { useRef } from "react";
import headerImg from "../../assets/header.jpg";
import footerImg from "../../assets/footer.jpg";
import html2pdf from "html2pdf.js";




const QuotationPreview = ({ formData, onClose }) => {
  const fileInputRef = useRef(null);
  console.log("Preview formData:", formData);
  if (!formData) return null;

  const formatIndianCurrency = (amount) => {
    if (!amount || amount === 0) return "₹ 0";

    if (amount >= 10000000) {
      return `₹ ${(amount / 10000000).toFixed(2)} Crores`;
    } else if (amount >= 100000) {
      return `₹ ${(amount / 100000).toFixed(2)} Lakhs`;
    } else { 
      return `₹ ${amount.toLocaleString("en-IN")}`;
    }
  };

  // GST calculation for preview
const gstPercent = formData.gstPercent || 0;

const gstAmount = gstPercent
  ? Math.round((formData.totalCost * gstPercent) / 100)
  : 0;

const finalAmount = formData.totalCost + gstAmount;

  
const handlePrint = () => {
  const printContent = document.querySelector("#print-section .content").innerHTML;

  const headerURL = new URL(headerImg, window.location.href).href;
  const footerURL = new URL(footerImg, window.location.href).href;

  const printWindow = window.open("", "", "width=1200,height=800");

  printWindow.document.write(`
<html>
<head>
<title>Quotation</title>
${Array.from(document.styleSheets)
  .map(sheet => {
    try {
      if (sheet.href) {
        return `<link rel="stylesheet" href="${sheet.href}">`;
      } else if (sheet.ownerNode && sheet.ownerNode.innerHTML) {
        return `<style>${sheet.ownerNode.innerHTML}</style>`;
      }
    } catch (e) {
      return "";
    }
  })

  .join("")}
<style>
  /* 1. Kill browser default margins completely */
  @page {
    size: A4;
    margin: 0;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: Arial, sans-serif;
    -webkit-print-color-adjust: exact;
  }

  /* 2. REPEATING HEADER */
  thead {
    display: table-header-group;
  }

  /* 3. THE FIXED FOOTER FIX */
  .footer-fixed {
    position: fixed;
    bottom: 0; /* Pinned to the very bottom */
    left: 0;
    width: 100%;
    height: auto;
    z-index: 9999;
    line-height: 0; 
    font-size: 0;    
  }

  .footer-fixed img {
    width: 100%;
    display: block; /* Removes inline spacing */
    margin: 0;
    padding: 0;
  }

  .page-header img {
    width: 100%;
    display: block;
  }

  /* Space under header */
  .page-header td {
    padding-bottom: 44px;
  }

  /* RESERVES SPACE AT BOTTOM SO TEXT DOESN'T OVERLAP IMAGE */
  tfoot {
    display: table-footer-group;
  }

  .footer-spacer {
    height: 60px; /* Adjust this to match your footer height */
  }

  /* CONTENT AREA SPACING */
  .page-content {
    padding: 0 40px;
    vertical-align: top;
  }

 
  .page-content > div { margin-bottom: 26px; }
  .page-content h3 { margin-bottom: 16px; font-weight: bold; font-size: 1.1rem; }
  .page-content table { margin-top: 16px; margin-bottom: 24px; width: 100%; border-collapse: collapse; }
  .page-content ul { margin-top: 12px; margin-bottom: 30px; }
  .page-content th, .page-content td { padding: 10px; border: 1px solid #e5e7eb; }

  tr { page-break-inside: avoid; }
</style>
</head>

<body>
  <div class="footer-fixed">
    <img src="${footerURL}" />
  </div>

  <table style="width: 100%; border-collapse: collapse; margin: 0;">
    <thead class="page-header">
      <tr>
        <td>
          <img src="${headerURL}" />
        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td class="page-content">
          ${printContent}
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td class="footer-spacer"></td>
      </tr>
    </tfoot>
  </table>

  <script>
    window.onload = () => {
      setTimeout(() => {
        window.print();
      }, 700);
    };
  </script>
</body>
</html>
`);

  printWindow.document.close();
};



const handleSendForApprovalClick = () => {
    fileInputRef.current.click();
  };

  // 3. This runs as soon as you select the PDF from your computer
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:8080/api/quotations/${formData.id}/send-approval-pdf`,
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        alert("PDF uploaded and email sent to client! ✅");
        onClose();
      } else {
        alert("Failed to send email. Check backend.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Connection error ❌");
    }
  };


  return (
  <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto p-6 print:static print:bg-white print:p-0">

       {/* 4. THE HIDDEN FILE INPUT */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="application/pdf"
        onChange={handleFileChange}
      />
    
    <div
      id="print-section"
      className="bg-white w-full max-w-6xl mx-auto rounded-xl shadow-2xl print:shadow-none print:rounded-none"
    >

      {/* HEADER */}
      <div className="header">
        <img src={headerImg} alt="Header" className="w-full" />
      </div>

        {/* BODY */}
        <div className="content p-8 space-y-8 text-gray-800">

          {/* Quotation Info */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p><strong>Quotation No:</strong> {formData.quotationNumber}</p>
              <p><strong>Date:</strong> {formData.date}</p>
              <p><strong>Valid Until:</strong> {formData.validUntil}</p>
            </div>
            <div>
              <p><strong>Client:</strong> {formData.client}</p>
              <p><strong>Email:</strong> {formData.clientEmail}</p>
              <p><strong>Phone:</strong> {formData.clientPhone}</p>
              <p><strong>Address:</strong> {formData.clientAddress}</p>
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-orange-50 border border-orange-300 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-orange-700 mb-4">
              Project Details
            </h3>
            <p><strong>Project:</strong> {formData.project}</p>
            <p><strong>Version:</strong> {formData.version}</p>
            <p><strong>Currency:</strong> {formData.currency}</p>
            <p className="text-lg font-bold text-orange-700 mt-2">
               Final Amount: {formatIndianCurrency(gstPercent > 0 ? finalAmount : formData.totalCost)}
            </p>
          </div>
   
          {/* About Project */}
{formData.aboutProject && (
  <div className=" p-4 rounded-lg mt-6 print:bg-transparent print:border-none print:p-0">
    <h3 className="text-sm font-bold text-black-500 uppercase tracking-widest mb-2 print:text-black print:text-base">About Project</h3>
    <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed print:text-black">
      {formData.aboutProject}
    </p>
  </div>
)}


          {/* Cost Breakdown */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              1. Cost Breakdown
            </h3>

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3">Sr</th>
                  <th className="border p-3">Development Area</th>
                  <th className="border p-3">Scope</th>
                  <th className="border p-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {formData.costBreakdown.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-3 text-center">{item.srNo}</td>
                    <td className="border p-3">{item.area}</td>
                    <td className="border p-3">{item.scope}</td>
                    <td className="border p-3 text-center font-semibold text-orange-600">
                      {item.amount}
                    </td>
                  </tr>
                ))}
                <tr className="bg-orange-100 font-bold">
                  <td colSpan="3" className="border p-3 text-right">
                    TOTAL PROJECT COST
                  </td>
                  <td className="border p-3 text-center text-orange-700">
                    {formatIndianCurrency(formData.totalCost)}
                  </td>
                </tr>

                {/* Show GST only if GST > 0 */}
{gstPercent > 0 && (
  <tr className="bg-gray-100 font-semibold">
    <td colSpan="3" className="border p-3 text-right">
      GST ({gstPercent}%)
    </td>
    <td className="border p-3 text-center text-blue-700">
      {formatIndianCurrency(gstAmount)}
    </td>
  </tr>
)}

{/* Show Final Amount only if GST applied */}
{gstPercent > 0 && (
  <tr className="bg-green-100 font-bold">
    <td colSpan="3" className="border p-3 text-right">
      FINAL AMOUNT
    </td>
    <td className="border p-3 text-center text-green-700 text-lg">
      {formatIndianCurrency(finalAmount)}
    </td>
  </tr>
)}

              </tbody>
            </table>
          </div>

          

          {/* Includes */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              2. What This Cost Includes
            </h3>

            <ul className="space-y-1 text-sm">
              {formData.includes.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 text-lg font-bold">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              3. Development Timeline
            </h3>

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border p-3">Phase</th>
                  <th className="border p-3">Duration</th>
                  <th className="border p-3">Deliverables</th>
                </tr>
              </thead>
              <tbody>
                {formData.timeline.map((phase, index) => (
                  <tr key={index}>
                    <td className="border p-3">{phase.phase}</td>
                    <td className="border p-3">{phase.duration}</td>
                    <td className="border p-3">{phase.deliverables}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-3 font-semibold">
              Total Timeline: {formData.totalTimeline}
            </p>
          </div>

          {/* Commercial Terms */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              4. Commercial Terms
            </h3>

            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li><strong>Pricing Model:</strong> {formData.terms.pricingModel}</li>
              <li><strong>Payment Milestones:</strong> {formData.terms.paymentMilestones}</li>
              <li><strong>Taxes:</strong> {formData.terms.taxes}</li>
              <li><strong>Domain & Server:</strong> {formData.terms.domainServer}</li>
              <li><strong>Change Requests:</strong> {formData.terms.changeRequests}</li>
            </ul>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 mt-10">
            <div className="text-center">
              {formData.projectManagerSignature && (
                <img
                  src={formData.projectManagerSignature}
                  alt="PM Sign"
                  className="w-32 h-20 mx-auto mb-3"
                />
              )}
              <p className="font-bold">{formData.projectManager}</p>
              <p className="text-sm text-gray-500">Project Manager</p>
            </div>

            <div className="text-center">
              {formData.operationManagerSignature && (
                <img
                  src={formData.operationManagerSignature}
                  alt="OM Sign"
                  className="w-32 h-20 mx-auto mb-3"
                />
              )}
              <p className="font-bold">{formData.operationManager}</p>
              <p className="text-sm text-gray-500">Operation Manager</p>
            </div>
          </div>

        </div>

 {/* FOOTER */}
      <div className="footer">
        <img src={footerImg} alt="Footer" className="w-full" />
      </div>

      {/* BUTTONS */}
      <div className="bg-gray-100 border-t p-4 flex justify-center gap-6 print:hidden">
        <button
          onClick={onClose}
          className="bg-gray-600 text-white px-6 py-2 rounded"
        >
          Close
        </button>

        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Print / Save PDF
        </button>

        
  <button
    onClick={handleSendForApprovalClick}
    className="bg-green-600 text-white px-6 py-2 rounded"
  >
    Send for Approval
  </button>


      </div>
      </div>
    </div>
  );
};

export default QuotationPreview;