import React from 'react';

const QuotationPreview = ({ formData, onClose }) => {
  if (!formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
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
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
          .print-page-1, .print-page-2 {
            background-color: #1f2937 !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            height: 100vh;
            margin: 0;
            padding: 0;
            page-break-inside: avoid;
          }
          .print-page-1 {
            page-break-after: always;
          }
          .print-page-2 {
            page-break-before: always;
          }
        }
      `}</style>
      
      <div className="bg-white rounded-lg max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center no-print">
          <h2 className="text-lg sm:text-xl font-bold">Quotation Preview</h2>
          <button 
            onClick={onClose}
            className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-gray-600 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
        
        <div className="print-container">
          {/* Page 1 */}
          <div className="print-page-1 bg-gray-800 text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 sm:p-4 md:p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-20 hidden sm:block">
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 p-2 sm:p-4">
                  {[...Array(40)].map((_, i) => (
                    <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 border border-white transform rotate-45"></div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-orange-500 font-bold text-lg sm:text-2xl">SRES</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">SRES</h1>
                  <p className="text-orange-200 text-sm sm:text-base">SMARTMATRIX</p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6">
              {/* Quotation Title */}
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">QUOTATION</h2>
                <div className="text-left space-y-1 text-sm sm:text-base">
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
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-b border-gray-600 pb-2">1. Cost Breakdown (Fixed Price – ₹2.5 Cr)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left p-1 sm:p-2 w-12 sm:w-16">Sr. No</th>
                        <th className="text-left p-1 sm:p-2">Development Area</th>
                        <th className="text-left p-1 sm:p-2">Scope Includes</th>
                        <th className="text-left p-1 sm:p-2 w-20 sm:w-24">Amount (₹ Lakhs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.costBreakdown.map((item, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="p-1 sm:p-2 text-center">{item.srNo}</td>
                          <td className="p-1 sm:p-2 font-medium">{item.area}</td>
                          <td className="p-1 sm:p-2 text-xs sm:text-sm">{item.scope}</td>
                          <td className="p-1 sm:p-2 text-center font-bold">{item.amount}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-orange-500 font-bold">
                        <td className="p-1 sm:p-2" colSpan="2">TOTAL PROJECT COST</td>
                        <td className="p-1 sm:p-2">Fixed Enterprise Cost</td>
                        <td className="p-1 sm:p-2 text-center text-orange-400">₹250 Lakhs (₹2.5 Crores)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* What This Cost Includes */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-b border-gray-600 pb-2">2. What This Cost Includes</h3>
                <div className="space-y-2">
                  {formData.includes.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-green-400 mr-2 mt-1">✓</span>
                      <span className="text-xs sm:text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Page 2 */}
          <div className="print-page-2 bg-gray-800 text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 sm:p-4 md:p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-20 hidden sm:block">
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 p-2 sm:p-4">
                  {[...Array(40)].map((_, i) => (
                    <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 border border-white transform rotate-45"></div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-orange-500 font-bold text-lg sm:text-2xl">SRES</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">SRES</h1>
                  <p className="text-orange-200 text-sm sm:text-base">SMARTMATRIX</p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6">
              {/* Development Timeline */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-b border-gray-600 pb-2">3. Development Timeline</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm mb-3 sm:mb-4 min-w-[500px]">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left p-1 sm:p-2">Phase</th>
                        <th className="text-left p-1 sm:p-2">Duration</th>
                        <th className="text-left p-1 sm:p-2">Deliverables</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.timeline.map((phase, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="p-1 sm:p-2 font-medium">{phase.phase}</td>
                          <td className="p-1 sm:p-2">{phase.duration}</td>
                          <td className="p-1 sm:p-2 text-xs sm:text-sm">{phase.deliverables}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="font-bold text-sm sm:text-base">Total Estimated Timeline: {formData.totalTimeline}</p>
              </div>

              {/* Commercial Terms */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-b border-gray-600 pb-2">4. Commercial Terms</h3>
                <ul className="space-y-2 text-xs sm:text-sm">
                  <li><strong>Pricing Model:</strong> {formData.terms.pricingModel}</li>
                  <li><strong>Payment Milestones:</strong> {formData.terms.paymentMilestones}</li>
                  <li><strong>Taxes:</strong> {formData.terms.taxes}</li>
                  <li><strong>Domain & Server Cost:</strong> {formData.terms.domainServer}</li>
                  <li><strong>Change Requests:</strong> {formData.terms.changeRequests}</li>
                </ul>
              </div>

              {/* Company Name */}
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold">Smartmatrix Digital Services</h3>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div className="text-center">
                  <div className="w-20 h-12 sm:w-24 sm:h-16 border-2 border-gray-600 mx-auto mb-2 flex items-center justify-center">
                    {formData.projectManagerSignature ? (
                      <img src={formData.projectManagerSignature} alt="PM Signature" className="max-w-full max-h-full" />
                    ) : (
                      <span className="text-gray-400 text-xs">Signature</span>
                    )}
                  </div>
                  <p className="font-bold text-sm sm:text-base">{formData.projectManager}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Project Manager</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-12 sm:w-24 sm:h-16 border-2 border-gray-600 mx-auto mb-2 flex items-center justify-center">
                    {formData.operationManagerSignature ? (
                      <img src={formData.operationManagerSignature} alt="OM Signature" className="max-w-full max-h-full" />
                    ) : (
                      <span className="text-gray-400 text-xs">Signature</span>
                    )}
                  </div>
                  <p className="font-bold text-sm sm:text-base">{formData.operationManager}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Operation Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Print Button */}
        <div className="bg-white border-t px-3 sm:px-6 py-3 sm:py-4 text-center no-print">
          <button 
            onClick={() => window.print()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center mx-auto text-sm sm:text-base"
          >
            <span className="mr-2 text-base sm:text-lg">🖨️</span> Print Quotation
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationPreview;