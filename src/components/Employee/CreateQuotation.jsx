import React, { useState } from 'react';
import QuotationPreview from './QuotationPreview';
import QuotationPrint from './QuotationPrint';

const CreateQuotation = ({ selectedClient }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [formData, setFormData] = useState({
    quotationNumber: `QT-${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString('en-IN'),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
    project: '',
    client: selectedClient?.name || '',
    clientAddress: '',
    clientContact: '',
    clientPhone: '',
    preparedBy: 'Development Team',
    documentType: 'Commercial Quotation',
    version: '1.0',
    currency: 'INR',
    totalCost: '₹2,50,00,000 2.5 Crores',
    costBreakdown: [
      { srNo: 1, area: 'Architecture & Planning', scope: '', amount: '' },
      { srNo: 2, area: 'UI / UX Design', scope: '', amount: '' },
      { srNo: 3, area: 'Core 3D Engine Development', scope: '', amount: '' },
      { srNo: 4, area: 'Backend Development', scope: '', amount: '' },
      { srNo: 5, area: '3D Asset Creation & Optimization', scope: '', amount: '' },
      { srNo: 6, area: 'Testing & Quality Assurance', scope: '', amount: '' },
      { srNo: 7, area: 'DevOps & Cloud Deployment', scope: '', amount: '' },
      { srNo: 8, area: 'Project Management & Delivery', scope: '', amount: '' }
    ],
    includes: [
      'Complete enterprise-grade web platform',
      'Backend APIs + database',
      'QA testing & production rollout'
    ],
    timeline: [
      { phase: 'Phase-1 (MVP)', duration: '8 Weeks', deliverables: 'Core 3D editor, drag-drop, materials' },
      { phase: 'Phase-2 (Advanced)', duration: '12 Weeks', deliverables: 'Save/load, user accounts, admin panel' },
      { phase: 'Phase-3 (Premium)', duration: 'Optional', deliverables: 'AI layout, pricing, checkout' }
    ],
    totalTimeline: '20-24 Weeks',
    terms: {
      pricingModel: 'Fixed Price',
      paymentMilestones: 'Phase-wise (Mutually agreed)',
      taxes: 'GST applicable as per government norms',
      domainServer: 'Not included (Charged separately)',
      changeRequests: 'Any scope change will be quoted separately'
    },
    projectManager: 'Sagar Solanke',
    operationManager: 'Bikram Burman',
    projectManagerSignature: null,
    operationManagerSignature: null
  });

  const addCostItem = () => {
    setFormData({
      ...formData,
      costBreakdown: [...formData.costBreakdown, { srNo: formData.costBreakdown.length + 1, area: '', scope: '', amount: '' }]
    });
  };

  const removeCostItem = (index) => {
    const newItems = formData.costBreakdown.filter((_, i) => i !== index);
    // Re-number the items
    const reNumberedItems = newItems.map((item, i) => ({ ...item, srNo: i + 1 }));
    setFormData({ ...formData, costBreakdown: reNumberedItems });
  };

  const updateCostItem = (index, field, value) => {
    const newItems = formData.costBreakdown.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, costBreakdown: newItems });
  };

  const calculateTotal = () => {
    return formData.costBreakdown.reduce((total, item) => total + (item.amount || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">SM</span>
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-bold tracking-wide">SMARTMATRIX</div>
                    <div className="text-sm lg:text-base text-gray-300">Digital Services & Solutions</div>
                  </div>
                </div>
              </div>
              <div className="text-white text-right">
                <div className="text-lg lg:text-xl font-semibold mb-1">PROFESSIONAL QUOTATION</div>
                <div className="text-sm text-gray-300">ISO 27001:2013 | ISO 9001:2015 Certified</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400"></div>
        </div>

        {/* Quotation Details */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
            {/* Quotation Info */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 lg:p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Quotation Details
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="text-sm font-medium text-gray-600 w-full sm:w-24 mb-1 sm:mb-0">Number:</label>
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    value={formData.quotationNumber}
                    onChange={(e) => setFormData({...formData, quotationNumber: e.target.value})}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="text-sm font-medium text-gray-600 w-full sm:w-24 mb-1 sm:mb-0">Date:</label>
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="text-sm font-medium text-gray-600 w-full sm:w-24 mb-1 sm:mb-0">Valid Until:</label>
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 lg:p-6 rounded-xl border border-green-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Client Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Client Name:</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                    value={formData.client}
                    onChange={(e) => setFormData({...formData, client: e.target.value})}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Email:</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                    value={formData.clientContact}
                    onChange={(e) => setFormData({...formData, clientContact: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Phone No:</label>
                  <input 
                    type="tel" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Address:</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm resize-none"
                    rows="2"
                    value={formData.clientAddress}
                    onChange={(e) => setFormData({...formData, clientAddress: e.target.value})}
                    placeholder="Enter client address"
                  />
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 lg:p-6 rounded-xl border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Project Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Project Name:</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                    value={formData.project}
                    onChange={(e) => setFormData({...formData, project: e.target.value})}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Total Cost:</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm font-semibold text-orange-700"
                    value={formData.totalCost}
                    onChange={(e) => setFormData({...formData, totalCost: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Version:</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                      value={formData.version}
                      onChange={(e) => setFormData({...formData, version: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Currency:</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</span>
                Cost Breakdown (Fixed Price – ₹2.5 Cr)
              </h2>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 text-sm w-20">Sr. No</th>
                      <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 text-sm">Development Area</th>
                      <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 text-sm">Scope Includes</th>
                      <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 text-sm w-32">Amount (₹ Lakhs)</th>
                      <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 text-sm w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.costBreakdown.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-200 p-3 text-center font-medium text-gray-600">{item.srNo}</td>
                        <td className="border border-gray-200 p-3">
                          <input 
                            type="text" 
                            className="w-full outline-none bg-transparent font-medium text-gray-800 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 transition-all"
                            value={item.area}
                            onChange={(e) => updateCostItem(index, 'area', e.target.value)}
                            placeholder="Enter development area"
                          />
                        </td>
                        <td className="border border-gray-200 p-3">
                          <textarea 
                            className="w-full outline-none bg-transparent text-gray-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 transition-all resize-none text-sm leading-relaxed"
                            rows="3"
                            value={item.scope}
                            onChange={(e) => updateCostItem(index, 'scope', e.target.value)}
                            placeholder="Enter scope details"
                          />
                        </td>
                        <td className="border border-gray-200 p-3">
                          <input 
                            type="text" 
                            className="w-full outline-none bg-transparent font-semibold text-orange-600 focus:bg-orange-50 focus:ring-2 focus:ring-orange-200 rounded px-2 py-1 transition-all text-center"
                            value={item.amount}
                            onChange={(e) => updateCostItem(index, 'amount', e.target.value)}
                            placeholder="Amount"
                          />
                        </td>
                        <td className="border border-gray-200 p-3 text-center">
                          <button 
                            onClick={() => removeCostItem(index)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors text-xs"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gradient-to-r from-orange-100 to-amber-100 font-bold">
                      <td className="border border-gray-200 p-4 text-center" colSpan="3">
                        <span className="text-gray-800 text-lg">TOTAL PROJECT COST</span>
                      </td>
                      <td className="border border-gray-200 p-4 text-center">
                        <span className="text-orange-700 text-lg font-bold">₹{calculateTotal()} Lakhs</span>
                        <div className="text-sm text-gray-600 font-normal">(₹2.5 Crores)</div>
                      </td>
                      <td className="border border-gray-200 p-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={addCostItem}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <span className="mr-2">+</span> Add Cost Item
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* What This Cost Includes */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="w-6 h-6 bg-white text-green-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</span>
                What This Cost Includes
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {formData.includes.map((item, index) => (
                  <div key={index} className="flex items-start bg-green-50 rounded-lg p-3 border border-green-100 hover:bg-green-100 transition-colors">
                    <span className="text-green-600 mr-3 mt-1 text-lg font-bold">✓</span>
                    <input 
                      type="text" 
                      className="flex-1 outline-none bg-transparent text-gray-800 font-medium focus:bg-white focus:ring-2 focus:ring-green-200 rounded px-2 py-1 transition-all"
                      value={item}
                      onChange={(e) => {
                        const newIncludes = [...formData.includes];
                        newIncludes[index] = e.target.value;
                        setFormData({...formData, includes: newIncludes});
                      }}
                    />
                    <button 
                      onClick={() => {
                        const newIncludes = formData.includes.filter((_, i) => i !== index);
                        setFormData({...formData, includes: newIncludes});
                      }}
                      className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setFormData({...formData, includes: [...formData.includes, 'New feature']})}
                className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                + Add Feature
              </button>
            </div>
          </div>
        </div>

        {/* Development Timeline */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</span>
                Development Timeline
              </h2>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">Phase</th>
                      <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">Duration</th>
                      <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">Deliverables</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.timeline.map((phase, index) => (
                      <tr key={index} className="hover:bg-blue-50 transition-colors">
                        <td className="border border-gray-200 p-4">
                          <input 
                            type="text" 
                            className="w-full outline-none bg-transparent font-semibold text-blue-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 transition-all"
                            value={phase.phase}
                            onChange={(e) => {
                              const newTimeline = [...formData.timeline];
                              newTimeline[index].phase = e.target.value;
                              setFormData({...formData, timeline: newTimeline});
                            }}
                          />
                        </td>
                        <td className="border border-gray-200 p-4">
                          <input 
                            type="text" 
                            className="w-full outline-none bg-transparent font-medium text-gray-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 transition-all"
                            value={phase.duration}
                            onChange={(e) => {
                              const newTimeline = [...formData.timeline];
                              newTimeline[index].duration = e.target.value;
                              setFormData({...formData, timeline: newTimeline});
                            }}
                          />
                        </td>
                        <td className="border border-gray-200 p-4">
                          <input 
                            type="text" 
                            className="w-full outline-none bg-transparent text-gray-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 transition-all"
                            value={phase.deliverables}
                            onChange={(e) => {
                              const newTimeline = [...formData.timeline];
                              newTimeline[index].deliverables = e.target.value;
                              setFormData({...formData, timeline: newTimeline});
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-semibold text-gray-800">Total Estimated Timeline:</span>
                  <input 
                    type="text" 
                    className="flex-1 sm:max-w-xs px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-bold text-blue-700 bg-white"
                    value={formData.totalTimeline}
                    onChange={(e) => setFormData({...formData, totalTimeline: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commercial Terms */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="w-6 h-6 bg-white text-purple-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">4</span>
                Commercial Terms & Conditions
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pricing Model:</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-medium"
                      value={formData.terms.pricingModel} 
                      onChange={(e) => setFormData({...formData, terms: {...formData.terms, pricingModel: e.target.value}})}
                    />
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Milestones:</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      value={formData.terms.paymentMilestones} 
                      onChange={(e) => setFormData({...formData, terms: {...formData.terms, paymentMilestones: e.target.value}})}
                    />
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Taxes:</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      value={formData.terms.taxes} 
                      onChange={(e) => setFormData({...formData, terms: {...formData.terms, taxes: e.target.value}})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Domain & Server Cost:</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      value={formData.terms.domainServer} 
                      onChange={(e) => setFormData({...formData, terms: {...formData.terms, domainServer: e.target.value}})}
                    />
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Change Requests:</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      value={formData.terms.changeRequests} 
                      onChange={(e) => setFormData({...formData, terms: {...formData.terms, changeRequests: e.target.value}})}
                    />
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-center mb-2">
                      <span className="text-amber-600 text-lg mr-2">⚠️</span>
                      <span className="font-semibold text-gray-700">Important Note:</span>
                    </div>
                    <p className="text-sm text-gray-600">This quotation is valid for 30 days from the date of issue. All prices are subject to change without prior notice.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
              <h3 className="text-xl font-bold text-white text-center">Authorized Signatures</h3>
              <p className="text-gray-300 text-center text-sm mt-1">Smartmatrix Digital Services</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="text-center">
                  <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => document.getElementById('projectManagerSign').click()}>
                    <span className="text-gray-400 text-sm">Click to Sign</span>
                  </div>
                  <input 
                    id="projectManagerSign"
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setFormData({...formData, projectManagerSignature: event.target.result});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {formData.projectManagerSignature && (
                    <img src={formData.projectManagerSignature} alt="Signature" className="w-32 h-20 mx-auto mb-4 border rounded-lg" />
                  )}
                  <input 
                    type="text" 
                    className="text-center font-semibold outline-none border-b-2 border-gray-300 focus:border-blue-500 transition-colors w-full max-w-xs mx-auto block text-lg"
                    value={formData.projectManager}
                    onChange={(e) => setFormData({...formData, projectManager: e.target.value})}
                  />
                  <div className="text-sm text-gray-600 mt-2 font-medium">Project Manager</div>
                  <div className="text-xs text-gray-500 mt-1">Date: {formData.date}</div>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => document.getElementById('operationManagerSign').click()}>
                    <span className="text-gray-400 text-sm">Click to Sign</span>
                  </div>
                  <input 
                    id="operationManagerSign"
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setFormData({...formData, operationManagerSignature: event.target.result});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {formData.operationManagerSignature && (
                    <img src={formData.operationManagerSignature} alt="Signature" className="w-32 h-20 mx-auto mb-4 border rounded-lg" />
                  )}
                  <input 
                    type="text" 
                    className="text-center font-semibold outline-none border-b-2 border-gray-300 focus:border-blue-500 transition-colors w-full max-w-xs mx-auto block text-lg"
                    value={formData.operationManager}
                    onChange={(e) => setFormData({...formData, operationManager: e.target.value})}
                  />
                  <div className="text-sm text-gray-600 mt-2 font-medium">Operation Manager</div>
                  <div className="text-xs text-gray-500 mt-1">Date: {formData.date}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
              <div>
                <h4 className="font-semibold mb-2 text-orange-400">Contact Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center"><span className="mr-2">📧</span> hr@smartmatrixtech.com</div>
                  <div className="flex items-center"><span className="mr-2">🌐</span> www.smartmatrixtech.com</div>
                  <div className="flex items-center"><span className="mr-2">📱</span> +91 2721 2397 | 9112106843</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-orange-400">Office Address</h4>
                <div className="text-sm text-gray-300">
                  Shop No. 5, Athwagate Road,<br/>
                  Opp. Sombhai Material Road<br/>
                  Surat, Gujarat, India
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-orange-400">Certifications</h4>
                <div className="text-sm text-gray-300">
                  <div className="flex items-center mb-1"><span className="mr-2">🏆</span> ISO 27001:2013</div>
                  <div className="flex items-center"><span className="mr-2">🏆</span> ISO 9001:2015</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400"></div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-green-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
              <span className="mr-2 text-lg">💾</span> Save Quotation
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
              <span className="mr-2 text-lg">📤</span> Send for Approval
            </button>
            <button 
              onClick={() => setShowPreview(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            >
              <span className="mr-2 text-lg">👁️</span> Preview & Print
            </button>
          </div>
        </div>
      </div>
      
      {/* Preview Modal */}
      {showPreview && (
        <QuotationPreview 
          formData={formData} 
          onClose={() => setShowPreview(false)} 
        />
      )}
    </div>
  );
};

export default CreateQuotation;