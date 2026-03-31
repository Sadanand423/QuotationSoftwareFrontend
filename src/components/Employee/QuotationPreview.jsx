import React, { useRef } from "react";
import headerImg from "../../assets/header.jpg";
import footerImg from "../../assets/footer.jpg";
import html2pdf from "html2pdf.js";
import watermark from "../../assets/Smartmatrix_watermark.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuotationPreview = ({ formData, onClose }) => {
  const fileInputRef = useRef(null);
  console.log("Preview formData:", formData);
  if (!formData || Object.keys(formData).length === 0) {
  return <div className="p-6 text-center">No data available</div>;
}

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
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

const original = document.querySelector("#print-section").cloneNode(true);

// ❌ Remove header & footer from clone
original.querySelector(".header")?.remove();
original.querySelector(".footer")?.remove();
original.querySelector("img[alt='watermark']")?.remove(); // 🔥 IMPORTANT

const printContent = original.innerHTML;
  const headerURL = new URL(headerImg, window.location.href).href;
  const footerURL = new URL(footerImg, window.location.href).href;
  const watermarkURL = new URL(watermark, window.location.href).href;

  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules).map(rule => rule.cssText).join("");
      } catch {
        return "";
      }
    })
    .join("");

  const doc = iframe.contentWindow.document;

  doc.open();
doc.write(`
<html>
<head>
<style>
  ${styles}

  @page {
    size: A4;
    margin: 0;
  }

  body {
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
  }

  /* HEADER REPEAT */
  thead {
    display: table-header-group;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  /* HEADER */
  .page-header img {
  width: 100%;
  display: block;
}

/* control spacing properly */
.page-header td {
  padding-bottom: 7px;
}

  /* CONTENT */
  .page-content {
  padding: 0px 20px;
  vertical-align: top;
}

  /* FIXED FOOTER (REAL FIX) */
  .footer-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .footer-fixed img {
    width: 100%;
  }

  /* WATERMARK */
  .watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 300px;
    opacity: 0.30;
    transform: translate(-50%, -50%);
    z-index: 0;
  }

  img {
    -webkit-print-color-adjust: exact;
  }

  tr {
    page-break-inside: avoid;
  }

  tfoot {
  display: table-footer-group;
}

.footer-spacer {
  height: 60px; /* match your footer height */
}
</style>
</head>

<body>

<img src="${watermarkURL}" class="watermark" />

<table>

  <!-- HEADER -->
  <thead class="page-header">
    <tr>
      <td>
        <img src="${headerURL}" />
      </td>
    </tr>
  </thead>

  <!-- CONTENT -->
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

<!-- ✅ FOOTER (FIXED, ALWAYS BOTTOM) -->
<div class="footer-fixed">
  <img src="${footerURL}" />
</div>

<script>
  window.onload = function() {
    window.print();
    setTimeout(() => {
      window.frameElement.remove();
    }, 100);
  };
</script>

</body>
</html>
`);
doc.close();
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
  toast.success("PDF uploaded & email sent successfully 🚀");

  setTimeout(() => {
    onClose();
  }, 2000);
      }
       else {
        toast.error("Failed to send email ❌");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Server connection error ⚠️");
    }
  };


const calculatePayment = (percent) => {
  return Math.round((formData.totalCost * percent) / 100);
};

const calculateTimelineWeeks = () => {
  if (!formData.timeline) return 0;

  return formData.timeline.reduce((total, item) => {
    const match = item.duration?.match(/\d+/); // extract number
    const weeks = match ? Number(match[0]) : 0;
    return total + weeks;
  }, 0);
};

const calculateMaintenanceRange = () => {
  if (!formData.maintenancePlans?.length) return "₹0";

  const yearlyPrices = formData.maintenancePlans.map(
    plan => (Number(plan.monthly) || 0) * 12
  );

  const min = Math.min(...yearlyPrices);
  const max = Math.max(...yearlyPrices);

  return `₹${min.toLocaleString("en-IN")} – ₹${max.toLocaleString("en-IN")}`;
};


  return (
  <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto p-6 print:static print:bg-white print:p-0">
    <ToastContainer position="top-right" autoClose={3000} />

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
        <div className="content relative p-8 space-y-6 text-gray-800 overflow-hidden">
          {/* WATERMARK */}
            <img
              src={watermark}
              alt="watermark"
              className="absolute top-1/2 left-1/2 w-[280px] opacity-25 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />
          {/* Quotation Info */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p><strong>Quotation No:</strong> {formData.quotationNumber}</p>
              <p><strong>Date:</strong> {formData.date}</p>
              <p><strong>Valid Until:</strong> {formData.validUntil}</p>
            </div>
            <div>
              <p><strong>Client:</strong> {formData.client}</p>
              {formData.clientOrganization && (
              <p className="text-sm text-gray-700"><strong>Organization:</strong> {formData.clientOrganization}</p>)}
              <p><strong>Email:</strong> {formData.clientEmail}</p>
              <p><strong>Phone:</strong> {formData.clientPhone}</p>
              <p><strong>Address:</strong> {formData.clientAddress}</p>
            </div>
          </div>

          {/* Project Info */}
          <div className=" border border-gray-500 p-6 rounded-lg">
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
            <div className=" rounded-lg print:bg-transparent print:border-none print:p-0">
              <h3 className="text-xl font-bold mb-4">1. About Project</h3>
              <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed print:text-black">
                {formData.aboutProject}
              </p>
            </div>
          )}

   
          {/* ==============Scope of Work============== */}
          {formData.scopeOfWork && (
            <div className=" rounded-lg print:bg-transparent print:border-none print:p-0">
              <h3 className="text-xl font-bold mb-4">2. Scope of Work</h3>
              <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed print:text-black">
                {formData.scopeOfWork}
              </p>
            </div>
          )}

          {/* ============   Technology Stack  ============== */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              3. Technology Stack
            </h3>

            <table className="w-full border border-black-500 border-collapse text-sm">

              {/* Header */}
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-3 text-left font-semibold">
                    Component
                  </th>

                  <th className="p-3 text-left font-semibold">
                    Technology
                  </th>

                  <th className="p-3 text-left font-semibold">
                    Rationale
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {formData.techStack
                  ?.filter(
                    (tech) =>
                      tech.component?.trim() ||
                      tech.technology?.trim() ||
                      tech.rationale?.trim()
                  )
                  ?.map((tech, index) => {
                    const isLast =
                      index ===
                      formData.techStack.filter(
                        (t) =>
                          t.component?.trim() ||
                          t.technology?.trim() ||
                          t.rationale?.trim()
                      ).length - 1;

                    return (
                      <tr
                        key={index}
                        className={!isLast ? "border-b border-gray-200" : ""}
                      >
                        <td className="p-3">
                          {tech.component}
                        </td>

                        <td className="p-3">
                          {tech.technology}
                        </td>

                        <td className="p-3">
                          {tech.rationale}
                        </td>
                      </tr>
                    );
                  })}

                {/* Empty State */}
                {!formData.techStack?.some(
                  (tech) =>
                    tech.component?.trim() ||
                    tech.technology?.trim() ||
                    tech.rationale?.trim()
                ) && (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-3 text-center text-gray-500"
                    >
                      No technology stack defined
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>


          {/* Cost Breakdown */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              4. Cost Breakdown
            </h3>

            <table className="w-full border border-black-500 border-collapse text-sm table-fixed">

              {/* Header */}
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-3 w-[8%] text-left">Sr</th>
                  <th className="p-3 w-[30%] text-left">Development Area</th>
                  <th className="p-3 w-[40%] text-left">Resources Assigned</th>
                  <th className="p-3 w-[22%] text-left">Amount</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {formData.costBreakdown?.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200"
                  >
                    <td className="p-3 text-center">{item.srNo}</td>
                    <td className="p-3">{item.area}</td>
                    <td className="p-3 whitespace-pre-wrap break-words">{item.resources || item.scope}</td>
                    <td className="p-3 text-left font-semibold text-black">{item.amount}
                    </td>
                  </tr>
                ))}

                {/* Total Cost */}
                <tr className="font-bold border-t border-black">
                  <td colSpan="3" className="p-3 text-right">
                    TOTAL PROJECT COST
                  </td>
                  <td className="p-3 text-left text-black">
                    {formatIndianCurrency(formData.totalCost)}
                  </td>
                </tr>

                {/* GST */}
                {gstPercent > 0 && (
                  <tr className="border-b border-gray-200">
                    <td colSpan="3" className="p-3 text-right font-semibold">
                      GST ({gstPercent}%)
                    </td>
                    <td className="p-3 text-left text-black">
                      {formatIndianCurrency(gstAmount)}
                    </td>
                  </tr>
                )}

                {/* Final Amount */}
                {gstPercent > 0 && (
                  <tr className="font-bold border-t border-black">
                    <td colSpan="3" className="p-3 text-right">
                      FINAL AMOUNT
                    </td>
                    <td className="p-3 text-left text-lg text-black">
                      {formatIndianCurrency(finalAmount)}
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>


          {/* Timeline */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              5. Project Timeline
            </h3>

            <table className="w-full border border-black border-collapse text-sm">
              
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-3 text-left">Phase</th>
                  <th className="p-3 text-left">Duration</th>
                  <th className="p-3 text-left">Deliverables</th>
                </tr>
              </thead>

              <tbody>
                {formData.timeline?.map((phase, index) => (
                  <tr
                    key={index}
                    className={`border-gray-200 ${
                      index !== formData.timeline.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <td className="p-3">{phase.phase}</td>
                    <td className="p-3">{phase.duration}</td>
                    <td className="p-3">{phase.deliverables}</td>
                  </tr>
                ))}
              </tbody>

            </table>

            <p className="mt-3 font-semibold">
              Total Timeline: {calculateTimelineWeeks()} Weeks
            </p>
          </div>


          {/* Payment Terms */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              6. Payment Terms (Net 30 Days Invoicing)
            </h3>

            <ul className="space-y-1 text-sm">

              {formData.paymentTerms
                ?.filter(term => term.percent && term.label)?.map((term, index) => (
                <li key={index} className="flex items-start gap-2">

                  <span className="text-green-600 text-lg font-bold">✔</span>

                  <span>
                    {term.percent}% 
                    ({formatIndianCurrency(calculatePayment(term.percent))}) – {term.label}
                  </span>

                </li>
              ))}

              <li className="flex items-start gap-2">
                <span className="text-green-600 text-lg font-bold">✔</span>
                <span>GST @ {gstPercent}% extra as applicable</span>
              </li>

            </ul>
          </div>

          {/* Post Launch Maintenance */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              7. Post-Launch Maintenance (Optional, 12-Month Contract)
            </h3>

            <table className="w-full border border-black border-collapse text-sm">

              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-3 text-left">Plan</th>
                  <th className="p-3 text-left">Coverage</th>
                  <th className="p-3 text-left">Monthly (₹)</th>
                </tr>
              </thead>

              <tbody>
                {formData.maintenancePlans?.map((plan, index) => (
                  <tr
                    key={index}
                    className={`border-gray-200 ${
                      index !== formData.maintenancePlans.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <td className="p-3 font-medium">
                      {plan.plan}
                    </td>

                    <td className="p-3">
                      {plan.coverage}
                    </td>

                    <td className="p-3">
                      ₹{Number(plan.monthly).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            {/* Total Range */}
            <p className="mt-4 font-semibold">
              Total Range: {calculateMaintenanceRange()} 
              <span className="font-normal">(per year, Excl. GST)</span>
            </p>

            {/* Note */}
            <p className="mt-2 text-sm text-gray-700">
              <span className="font-semibold">Note:</span> Usage-based recurring costs excluded from development quote per industry norms. Client manages billing directly with providers.
            </p>

          </div>


          {/* Assumptions, Exclusions & Warranty */}
          <div className="mt-8">

            <h3 className="text-xl font-bold mb-4 text-gray-800">
              9. Assumptions, Exclusions & Warranty
            </h3>

            {/* INCLUDED */}
            {formData.assumptions?.included?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">INCLUDED:</h4>

                <ul className="space-y-1 text-sm">
                  {formData.assumptions.included.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* EXCLUDED */}
            {formData.assumptions?.excluded?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">EXCLUDED:</h4>

                <ul className="space-y-1 text-sm">
                  {formData.assumptions.excluded.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* WARRANTY */}
            {formData.assumptions?.warranty?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">WARRANTY & SUPPORT:</h4>

                <ul className="space-y-1 text-sm">
                  {formData.assumptions.warranty.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>  

          {/* Total Investment */}

          <div className="mt-8">
            <p className="text-lg font-semibold text-gray-800">
              Total Investment:{" "}
              {formatIndianCurrency(formData.totalCost)} +{" "}
              {formatIndianCurrency(gstAmount)} ({gstPercent}% GST Applicable)
            </p>

            <p className="text-xl font-bold text-gray-900 mt-2">
              Final Project Investment: {formatIndianCurrency(finalAmount)}
            </p>
          </div>


          {/* Authorized Signature Preview */}
          <div className="mt-8 border-t pt-6">

            <h3 className="font-semibold text-gray-800 mb-3">
              Authorized Signature:
            </h3>

            {/* Signature + Stamp */}
            {(formData.signature || formData.companyStamp) && (
              <div className="flex items-end gap-6 mb-4">

                {/* Signature */}
                {formData.signature && (
                  <img
                    src={formData.signature}
                    alt="Signature"
                    className="w-28 h-auto object-contain"
                  />
                )}

                {/* Stamp */}
                {formData.companyStamp && (
                  <img
                    src={formData.companyStamp}
                    alt="Company Stamp"
                    className="w-30 h-30 object-contain"
                  />
                )}
              </div>
            )}

            {/* Info remains left aligned */}
            <div className="text-sm text-gray-800">

              <p className="font-semibold">{formData.authorizedName}</p>

              <p>{formData.authorizedRole}</p>

              <p className="font-semibold">
                {formData.companyName}
              </p>

              <p>
                Contact: {formData.contactNumber} |{" "}
                <span className="text-blue-600 underline">
                  {formData.contactEmail}
                </span>{" "}
                | {formData.location}
              </p>

              <p className="mt-2">
                <span className="font-semibold">Note:</span>{" "}
                {formData.signatureNote}
              </p>
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