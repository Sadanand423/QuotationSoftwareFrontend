import React from 'react';

const QuotationPrint = ({ formData }) => {
  const handlePrint = () => {
    window.print();
  };

  if (!formData) return null;

  return (
    <div className="print-container">
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-page {
            background-color: #1f2937 !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
      
      <div className="no-print mb-4">
        <button 
          onClick={handlePrint}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-4"
        >
          Print Quotation
        </button>
      </div>

      <div className="print-page bg-gray-800 text-white max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-20">
            <div className="grid grid-cols-8 gap-1 p-4">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="w-4 h-4 border border-white transform rotate-45"></div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mr-4">
              <span className="text-orange-500 font-bold text-2xl">SRES</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">SRES</h1>
              <p className="text-orange-200">SMARTMATRIX</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Quotation Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-4">QUOTATION</h2>
            <div className="text-left space-y-1">
              <p><strong>Project:</strong> {formData.project}</p>
              <p><strong>Client:</strong> {formData.client}</p>
              <p><strong>Prepared By:</strong> {formData.preparedBy}</p>
              <p><strong>Document Type:</strong> {formData.documentType}</p>
              <p><strong>Version:</strong> {formData.version}</p>
              <p><strong>Currency:</strong> {formData.currency}</p>
              <p><strong>Total Fixed Project Cost:</strong> {formData.totalCost}</p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">1. Cost Breakdown (Fixed Price – ₹2.5 Cr)</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-2 w-16">Sr. No</th>
                  <th className="text-left p-2">Development Area</th>
                  <th className="text-left p-2">Scope Includes</th>
                  <th className="text-left p-2 w-24">Amount (₹ Lakhs)</th>
                </tr>
              </thead>
              <tbody>
                {formData.costBreakdown.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-2 text-center">{item.srNo}</td>
                    <td className="p-2 font-medium">{item.area}</td>
                    <td className="p-2 text-sm">{item.scope}</td>
                    <td className="p-2 text-center font-bold">{item.amount}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-orange-500 font-bold">
                  <td className="p-2" colSpan="2">TOTAL PROJECT COST</td>
                  <td className="p-2">Fixed Enterprise Cost</td>
                  <td className="p-2 text-center text-orange-400">₹250 Lakhs (₹2.5 Crores)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* What This Cost Includes */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">2. What This Cost Includes</h3>
            <div className="space-y-2">
              {formData.includes.map((item, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-green-400 mr-2 mt-1">✓</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Development Timeline */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">3. Development Timeline</h3>
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-2">Phase</th>
                  <th className="text-left p-2">Duration</th>
                  <th className="text-left p-2">Deliverables</th>
                </tr>
              </thead>
              <tbody>
                {formData.timeline.map((phase, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-2 font-medium">{phase.phase}</td>
                    <td className="p-2">{phase.duration}</td>
                    <td className="p-2 text-sm">{phase.deliverables}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="font-bold">Total Estimated Timeline: {formData.totalTimeline}</p>
          </div>

          {/* Commercial Terms */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">4. Commercial Terms</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>Pricing Model:</strong> {formData.terms.pricingModel}</li>
              <li><strong>Payment Milestones:</strong> {formData.terms.paymentMilestones}</li>
              <li><strong>Taxes:</strong> {formData.terms.taxes}</li>
              <li><strong>Domain & Server Cost:</strong> {formData.terms.domainServer}</li>
              <li><strong>Change Requests:</strong> {formData.terms.changeRequests}</li>
            </ul>
          </div>

          {/* Company Name */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold">Smartmatrix Digital Services</h3>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-24 h-16 border-2 border-gray-600 mx-auto mb-2 flex items-center justify-center">
                {formData.projectManagerSignature ? (
                  <img src={formData.projectManagerSignature} alt="PM Signature" className="max-w-full max-h-full" />
                ) : (
                  <span className="text-gray-400 text-xs">Signature</span>
                )}
              </div>
              <p className="font-bold">{formData.projectManager}</p>
              <p className="text-sm text-gray-400">Project Manager</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-16 border-2 border-gray-600 mx-auto mb-2 flex items-center justify-center">
                {formData.operationManagerSignature ? (
                  <img src={formData.operationManagerSignature} alt="OM Signature" className="max-w-full max-h-full" />
                ) : (
                  <span className="text-gray-400 text-xs">Signature</span>
                )}
              </div>
              <p className="font-bold">{formData.operationManager}</p>
              <p className="text-sm text-gray-400">Operation Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPrint;