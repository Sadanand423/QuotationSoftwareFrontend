import React, { useState } from 'react';

const CreateQuotation = ({ selectedClient }) => {
  const [formData, setFormData] = useState({
    project: '',
    client: selectedClient?.name || '',
    preparedBy: 'Development Team',
    documentType: 'Commercial Quotation',
    version: '1.0',
    currency: 'INR',
    totalCost: '₹2,50,00,000 2.5 Crores',
    costBreakdown: [
      { srNo: 1, area: 'Architecture & Planning', scope: 'System design, technical architecture, SRS, scalability planning', amount: 15 },
      { srNo: 2, area: 'UI / UX Design', scope: 'Brand identity, UI theme, dashboards, editor layout, responsive design', amount: 18 },
      { srNo: 3, area: 'Core 3D Engine Development', scope: 'Real-time 3D rendering, drag-drop, rotate, scale, snap, collision, lighting, performance optimization', amount: 100 },
      { srNo: 4, area: 'Backend Development', scope: 'APIs, authentication, user roles, pricing logic, scene save load, database', amount: 50 },
      { srNo: 5, area: '3D Asset Creation & Optimization', scope: '500-1000 furniture & room models, materials, textures, Draco compression', amount: 45 },
      { srNo: 6, area: 'Testing & Quality Assurance', scope: 'Functional testing, performance profiling, security testing, browser compatibility', amount: 20 },
      { srNo: 7, area: 'DevOps & Cloud Deployment', scope: 'AWS setup, CI/CD pipelines, server configuration, production rollout', amount: 12 },
      { srNo: 8, area: 'Project Management & Delivery', scope: 'Sprint planning, reporting, coordination, final deployment support', amount: 10 }
    ],
    includes: [
      'Complete enterprise-grade 3D web platform',
      'React + React Three Fiber (R3F) based architecture',
      'Drag, drop, rotate, scale, snap & collision system',
      'Advanced material, texture & lighting engine',
      'Room templates & furniture library',
      'Scene save/load & export (PNG)',
      'Backend APIs + database',
      'AWS cloud deployment',
      '500-1000 optimized 3D models',
      'Security, performance & scalability optimization',
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
    operationManager: 'Bikram Burman'
  });

  const addCostItem = () => {
    setFormData({
      ...formData,
      costBreakdown: [...formData.costBreakdown, { srNo: formData.costBreakdown.length + 1, area: '', scope: '', amount: 0 }]
    });
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
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header with Logo */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-6 relative">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <div className="text-2xl font-bold">SRES</div>
            <div className="text-sm">SMARTMATRIX</div>
          </div>
          <div className="text-white opacity-20">
            <div className="grid grid-cols-6 gap-1">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-4 h-4 border border-white rounded-sm"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-yellow-400"></div>
      </div>

      {/* Quotation Header */}
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-6">QUOTATION</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-sm">
          <div>
            <div className="mb-2">
              <strong>Project:</strong>
              <input 
                type="text" 
                className="ml-2 border-b border-gray-300 outline-none flex-1"
                value={formData.project}
                onChange={(e) => setFormData({...formData, project: e.target.value})}
                placeholder="Enter project name"
              />
            </div>
            <div className="mb-2">
              <strong>Client:</strong>
              <input 
                type="text" 
                className="ml-2 border-b border-gray-300 outline-none flex-1"
                value={formData.client}
                onChange={(e) => setFormData({...formData, client: e.target.value})}
                placeholder="Enter client name"
              />
            </div>
            <div className="mb-2">
              <strong>Prepared By:</strong>
              <input 
                type="text" 
                className="ml-2 border-b border-gray-300 outline-none flex-1"
                value={formData.preparedBy}
                onChange={(e) => setFormData({...formData, preparedBy: e.target.value})}
              />
            </div>
          </div>
          <div>
            <div className="mb-2">
              <strong>Document Type:</strong>
              <input 
                type="text" 
                className="ml-2 border-b border-gray-300 outline-none flex-1"
                value={formData.documentType}
                onChange={(e) => setFormData({...formData, documentType: e.target.value})}
              />
            </div>
            <div className="mb-2">
              <strong>Version:</strong>
              <input 
                type="text" 
                className="ml-2 border-b border-gray-300 outline-none flex-1"
                value={formData.version}
                onChange={(e) => setFormData({...formData, version: e.target.value})}
              />
            </div>
            <div className="mb-2">
              <strong>Currency:</strong>
              <input 
                type="text" 
                className="ml-2 border-b border-gray-300 outline-none flex-1"
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
              />
            </div>
            <div className="mb-2">
              <strong>Total Fixed Project Cost:</strong>
              <input 
                type="text" 
                className="ml-2 border-b border-gray-300 outline-none flex-1"
                value={formData.totalCost}
                onChange={(e) => setFormData({...formData, totalCost: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="px-6">
        <h2 className="text-lg font-bold mb-4">1. Cost Breakdown (Fixed Price – ₹2.5 Cr)</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Sr. No</th>
                <th className="border border-gray-300 p-2 text-left">Development Area</th>
                <th className="border border-gray-300 p-2 text-left">Scope Includes</th>
                <th className="border border-gray-300 p-2 text-left">Amount (₹ Lakhs)</th>
              </tr>
            </thead>
            <tbody>
              {formData.costBreakdown.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{item.srNo}</td>
                  <td className="border border-gray-300 p-2">
                    <input 
                      type="text" 
                      className="w-full outline-none"
                      value={item.area}
                      onChange={(e) => updateCostItem(index, 'area', e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <textarea 
                      className="w-full outline-none resize-none"
                      rows="2"
                      value={item.scope}
                      onChange={(e) => updateCostItem(index, 'scope', e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input 
                      type="number" 
                      className="w-full outline-none"
                      value={item.amount}
                      onChange={(e) => updateCostItem(index, 'amount', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="border border-gray-300 p-2" colSpan="2">TOTAL PROJECT COST</td>
                <td className="border border-gray-300 p-2">Fixed Enterprise Cost</td>
                <td className="border border-gray-300 p-2">₹{calculateTotal()} Lakhs (₹2.5 Crores)</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <button 
          onClick={addCostItem}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          + Add Cost Item
        </button>
      </div>

      {/* What This Cost Includes */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-bold mb-4">2. What This Cost Includes</h2>
        <div className="space-y-2">
          {formData.includes.map((item, index) => (
            <div key={index} className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <input 
                type="text" 
                className="flex-1 outline-none border-b border-gray-200"
                value={item}
                onChange={(e) => {
                  const newIncludes = [...formData.includes];
                  newIncludes[index] = e.target.value;
                  setFormData({...formData, includes: newIncludes});
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Development Timeline */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-bold mb-4">3. Development Timeline</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Phase</th>
              <th className="text-left p-2">Duration</th>
              <th className="text-left p-2">Deliverables</th>
            </tr>
          </thead>
          <tbody>
            {formData.timeline.map((phase, index) => (
              <tr key={index}>
                <td className="p-2">
                  <input 
                    type="text" 
                    className="w-full outline-none"
                    value={phase.phase}
                    onChange={(e) => {
                      const newTimeline = [...formData.timeline];
                      newTimeline[index].phase = e.target.value;
                      setFormData({...formData, timeline: newTimeline});
                    }}
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="text" 
                    className="w-full outline-none"
                    value={phase.duration}
                    onChange={(e) => {
                      const newTimeline = [...formData.timeline];
                      newTimeline[index].duration = e.target.value;
                      setFormData({...formData, timeline: newTimeline});
                    }}
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="text" 
                    className="w-full outline-none"
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
        <p className="mt-4 font-semibold">
          Total Estimated Timeline: 
          <input 
            type="text" 
            className="ml-2 outline-none border-b border-gray-300"
            value={formData.totalTimeline}
            onChange={(e) => setFormData({...formData, totalTimeline: e.target.value})}
          />
        </p>
      </div>

      {/* Commercial Terms */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-bold mb-4">4. Commercial Terms</h2>
        <ul className="space-y-2 text-sm">
          <li><strong>Pricing Model:</strong> <input type="text" className="ml-2 outline-none border-b border-gray-300" value={formData.terms.pricingModel} onChange={(e) => setFormData({...formData, terms: {...formData.terms, pricingModel: e.target.value}})} /></li>
          <li><strong>Payment Milestones:</strong> <input type="text" className="ml-2 outline-none border-b border-gray-300" value={formData.terms.paymentMilestones} onChange={(e) => setFormData({...formData, terms: {...formData.terms, paymentMilestones: e.target.value}})} /></li>
          <li><strong>Taxes:</strong> <input type="text" className="ml-2 outline-none border-b border-gray-300" value={formData.terms.taxes} onChange={(e) => setFormData({...formData, terms: {...formData.terms, taxes: e.target.value}})} /></li>
          <li><strong>Domain & Server Cost:</strong> <input type="text" className="ml-2 outline-none border-b border-gray-300" value={formData.terms.domainServer} onChange={(e) => setFormData({...formData, terms: {...formData.terms, domainServer: e.target.value}})} /></li>
          <li><strong>Change Requests:</strong> <input type="text" className="ml-2 outline-none border-b border-gray-300" value={formData.terms.changeRequests} onChange={(e) => setFormData({...formData, terms: {...formData.terms, changeRequests: e.target.value}})} /></li>
        </ul>
      </div>

      {/* Signatures */}
      <div className="px-6 mt-8 mb-8">
        <div className="text-center mb-6">
          <h3 className="font-bold">Smartmatrix Digital Services</h3>
        </div>
        
        <div className="flex justify-between items-end">
          <div className="text-center">
            <div className="w-24 h-16 border-2 border-gray-300 rounded-full mx-auto mb-2"></div>
            <input 
              type="text" 
              className="text-center font-semibold outline-none border-b border-gray-300"
              value={formData.projectManager}
              onChange={(e) => setFormData({...formData, projectManager: e.target.value})}
            />
            <div className="text-sm text-gray-600">Project Manager</div>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-16 border-2 border-gray-300 rounded-full mx-auto mb-2"></div>
            <input 
              type="text" 
              className="text-center font-semibold outline-none border-b border-gray-300"
              value={formData.operationManager}
              onChange={(e) => setFormData({...formData, operationManager: e.target.value})}
            />
            <div className="text-sm text-gray-600">Operation Manager</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-4 text-white text-xs">
        <div className="flex justify-between">
          <div>
            📧 hr@smartmatrixtech.com<br/>
            🌐 www.smartmatrixtech.com
          </div>
          <div className="text-right">
            ISO 27001:2013 | ISO 9001:2015 Call Us @ +91 2721 2397 | 9112106843 | 9112106843<br/>
            Office Address: Shop No. 5, Athwagate Road, Opp. Sombhai Material Road
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 flex gap-4">
        <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium">
          💾 Save Quotation
        </button>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium">
          📤 Send for Approval
        </button>
        <button className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium">
          🖨️ Print Preview
        </button>
      </div>
    </div>
  );
};

export default CreateQuotation;