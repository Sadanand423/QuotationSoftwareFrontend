import React, { useState, useEffect } from 'react';
import QuotationPreview from './QuotationPreview';


const CreateQuotation = ({ selectedClient }) => {
  const [showPreview, setShowPreview] = useState(false);

  const [clients, setClients] = useState([]);

  const [formData, setFormData] = useState({
    quotationNumber: `QT-${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString('en-IN'),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
    project: '',
    client: selectedClient?.name || '',
    clientAddress: '',
    clientEmail: '',
    clientPhone: '',
    preparedBy: 'Development Team',
    documentType: 'Commercial Quotation',
    version: '1.0',
    currency: 'INR',
    totalCost: 0,
    gstPercent: 18,
    aboutProject: '',
    scopeOfWork: '',
    techStack: [
      { component: "Frontend", technology: "React.js", rationale: "Fast rendering, design fidelity" },
      { component: "Backend", technology: "PHP (Laravel)", rationale: "Secure e-commerce APIs" },
      { component: "Database", technology: "MySQL", rationale: "Reliable transaction handling" },
      { component: "Admin Panels", technology: "React.js", rationale: "Real-time dashboards" },
      { component: "Hosting", technology: "AWS / DigitalOcean", rationale: "99.9% uptime, easy scaling" },
      { component: "Payments", technology: "Razorpay", rationale: "UPI / recurring billing" }
    ],
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
  { srNo: 1, phase: "Discovery", duration: "1 Week", deliverables: "Requirements, main page prototype" },
  { srNo: 2, phase: "Core Frontend + Backend", duration: "2 Weeks", deliverables: "Main + subscription MVP" },
  { srNo: 3, phase: "Payments Page", duration: "1 Week", deliverables: "Checkout integration" },
  { srNo: 4, phase: "Admin + Testing", duration: "1 Week", deliverables: "Dashboards, QA cycles" },
  { srNo: 5, phase: "UAT & Launch", duration: "1 Week", deliverables: "Bug fixes, deployment, training" }
],
    paymentTerms: [
  { percent: 25, label: "Advance upon contract signing" },
  { percent: 30, label: "Midpoint milestone" },
  { percent: 25, label: "UAT approval" },
  { percent: 20, label: "Final delivery and deployment" }
],

    maintenancePlans: [
  {plan: "Basic", coverage: "Bug fixes, server monitoring", monthly: 12000},
  {plan: "Standard (Recommended)", coverage: "+ Feature updates, API monitoring", monthly: 20000}
],

 authorizedName: "Sanjay K.",
authorizedRole: "Project Lead",
companyName: "SmartMatrix Digital Solutions Pvt. Ltd",
contactNumber: "+91 9765400796",
contactEmail: "sanjay.k@smartmatrixds.com",
location: "Pune, Maharashtra, India",
companyStamp: null,
signatureNote:
  "Once discussion is finalized, the SOW will be initiated along with the contractual obligations.",

    assumptions: {
    included: [
      "Source code handover (React + PHP/Laravel)",
      "30 days free post-launch support",
      "Complete documentation",
      "Training session for admin panel"
    ],
    excluded: [
      "Custom hardware integration",
      "Marketing & user acquisition",
      "Regulatory compliance (e-commerce norms)",
      "Third-party API costs",
      "Hosting/domain setup"
    ],
    warranty: [
      "3 months defect-free guarantee, priority support"
    ]
  },
    projectManager: 'Sagar Solanke',
    operationManager: 'Bikram Burman',
    projectManagerSignature: null,
    operationManagerSignature: null
  
    
  }
);



  useEffect(() => {
  if (selectedClient) {
    setFormData((prev) => ({
      ...prev,
      client: selectedClient.name || '',
      clientEmail: selectedClient.email || '',
      clientPhone: selectedClient.phone || '',
      clientAddress: selectedClient.address || ''
    }));
  }
}, [selectedClient]);
  
  useEffect(() => {
  const total = calculateTotal();
  setFormData((prev) => ({
    ...prev,
    totalCost: total
  }));
}, [formData.costBreakdown]);


  // ===========  GST =====================
  const gstPercent = formData.gstPercent || 0;

  const gstAmount = gstPercent
    ? Math.round((formData.totalCost * gstPercent) / 100)
    : 0;

  const finalAmount = formData.totalCost + gstAmount;

  const addTechStack = () => {
  setFormData({
    ...formData,
    techStack: [
      ...formData.techStack,
      { component: "", technology: "", rationale: "" }
    ]
  });
};

  const addCostItem = () => {
    setFormData((prev) => ({
      ...prev,
      costBreakdown: [
        ...prev.costBreakdown,
        {
          srNo: prev.costBreakdown.length + 1,
          area: "",
          scope: "",
          amount: ""
        }
      ]
    }));
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
    const total = formData.costBreakdown.reduce((sum, item) => {
      const amount = Number(item.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return Math.round(total);
  };

    const formatIndianCurrency = (amount) => {
    if (!amount || amount === 0) return "₹ 0";

    if (amount >= 10000000) {
      return `₹ ${(amount / 10000000).toFixed(2)} Crores`;
    } 
    else if (amount >= 100000) {
      return `₹ ${(amount / 100000).toFixed(2)} Lakhs`;
    } 
    else {
      return `₹ ${amount.toLocaleString('en-IN')}`;
    }
  };

    const saveQuotation = async () => {
    if (!formData.client || !formData.project) {
      alert("Client and Project name required ❗");
      return;
    }

    // 1. Get the Unique EmpId from localStorage
    const currentEmpId = localStorage.getItem("empId");

    if (!currentEmpId) {
      alert("Session expired. Please login again. ❌");
      return;
    }

    // 2. Prepare the payload with the dynamic fields
    const payload = {
    ...formData,
    totalCost: formData.totalCost,
    gstAmount: gstAmount,
    finalAmount: finalAmount,
    preparedBy: currentEmpId,
    status: "Pending"
  };

  try {
    const response = await fetch("http://localhost:8080/api/quotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload) // Send payload, not formData
    });

    if (!response.ok) {
      // If server returns 500, this alert will trigger
      alert("Error saving quotation ❌");
      return;
    }

    const data = await response.json();

    // ✅ Sync the ID from the database into your local state
    setFormData(prev => ({
      ...prev,
      id: data.id 
    }));

    alert("Quotation Saved Successfully ✅");
    setShowPreview(true);

  } catch (error) {
    console.error("Error:", error);
    alert("Server error ❌");
  }
};

const removeTechStack = (index) => {
  const newStack = formData.techStack.filter((_, i) => i !== index);
  setFormData({ ...formData, techStack: newStack });
};


const updatePaymentTerm = (index, field, value) => {
  const updated = [...formData.paymentTerms];
  updated[index][field] = value;

  setFormData({
    ...formData,
    paymentTerms: updated
  });
};
const addPaymentTerm = () => {
  setFormData({
    ...formData,
    paymentTerms: [
      ...formData.paymentTerms,
      { percent: "", label: "" }
    ]
  });
};
const removePaymentTerm = (index) => {
  const updated = formData.paymentTerms.filter((_, i) => i !== index);

  setFormData({
    ...formData,
    paymentTerms: updated
  });
};

const calculatePayment = (percent) => {
  return Math.round((formData.totalCost * percent) / 100);
};

const calculateTimelineWeeks = () => {

  return formData.timeline.reduce((total, phase) => {
    const match = phase.duration?.match(/\d+/); // extract number
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

const updateMaintenancePlan = (index, field, value) => {
  const updated = [...formData.maintenancePlans];
  updated[index][field] = value;

  setFormData({
    ...formData,
    maintenancePlans: updated
  });
};

const addMaintenancePlan = () => {
  setFormData({
    ...formData,
    maintenancePlans: [
      ...formData.maintenancePlans,
      { plan: "", coverage: "", monthly: "" }
    ]
  });
};

const removeMaintenancePlan = (index) => {
  const updated = formData.maintenancePlans.filter((_, i) => i !== index);

  setFormData({
    ...formData,
    maintenancePlans: updated
  });
};

const updateAssumption = (section, index, value) => {
  const updated = [...formData.assumptions[section]];
  updated[index] = value;

  setFormData({
    ...formData,
    assumptions: {
      ...formData.assumptions,
      [section]: updated
    }
  });
};

const addAssumption = (section) => {
  setFormData({
    ...formData,
    assumptions: {
      ...formData.assumptions,
      [section]: [...formData.assumptions[section], ""]
    }
  });
};

const removeAssumption = (section, index) => {
  const updated = formData.assumptions[section].filter((_, i) => i !== index);

  setFormData({
    ...formData,
    assumptions: {
      ...formData.assumptions,
      [section]: updated
    }
  });
};

const addTimelineRow = () => {
  setFormData({
    ...formData,
    timeline: [
      ...formData.timeline,
      {
        srNo: formData.timeline.length + 1,
        phase: "",
        duration: "",
        deliverables: ""
      }
    ]
  });
};

const removeTimelineRow = (index) => {
  const newTimeline = formData.timeline.filter((_, i) => i !== index);

  setFormData({
    ...formData,
    timeline: newTimeline
  });
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
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
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
                    placeholder="Enter project name"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Final Amount:</label>
                 <input 
                   type="text"
                   readOnly
                   value={formatIndianCurrency(finalAmount)}

                   className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 font-semibold text-orange-700"/>

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
   
          {/* About Project */}
          <div className="px-4 sm:px-6 lg:px-8 pb-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                    1
                  </span>
                  About Project
                </h2>
              </div>

              {/* Body */}
              <div className="p-6 bg-yellow-50">
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none resize-none text-sm"
                  placeholder="Write something about the project..."
                  value={formData.aboutProject}
                  onChange={(e) =>
                    setFormData({ ...formData, aboutProject: e.target.value })
                  }
                />
              </div>

            </div>
          </div>

          {/* ========= Scope of Work ========= */}
          <div className="px-4 sm:px-6 lg:px-8 pb-2">
            <div className="bg-white rounded-xl shadow-lg border border-pink-200 overflow-hidden">

              {/* Header */}
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="w-6 h-6 bg-white text-pink-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                    2
                  </span>
                  Scope of Work
                </h2>
              </div>

              {/* Body */}
              <div className="p-6 bg-pink-50">
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none resize-none text-sm"
                  placeholder="Write something about scope of project..."
                  value={formData.scopeOfWork}
                  onChange={(e) =>
                    setFormData({ ...formData, scopeOfWork: e.target.value })
                  }
                />
              </div>

            </div>
          </div>


          {/* ==========Technology Stack============  */}
            <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</span>
                Technology Stack
              </h2>
            </div>

              {/* Body */}
                <div className="p-6">
                  <div className="overflow-x-auto">

                    <table className="w-full border-collapse">
                      
                     <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">
                          Component
                        </th>

                        <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">
                          Technology
                        </th>

                        <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">
                          Rationale
                        </th>

                        <th className="border border-gray-200 p-4 text-center font-semibold text-gray-700 w-20">
                          Action
                        </th>
                      </tr>
                    </thead>

                      <tbody>
                        {formData.techStack.map((tech, index) => (
                          <tr key={index} className="hover:bg-blue-50 transition-colors">

                            <td className="border border-gray-200 p-4">
                              <input
                                type="text"
                                className="w-full outline-none bg-transparent font-semibold text-blue-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 transition-all"
                                value={tech.component}
                                onChange={(e) => {
                                  const newStack = [...formData.techStack];
                                  newStack[index].component = e.target.value;
                                  setFormData({ ...formData, techStack: newStack });
                                }}
                              />
                            </td>

                            <td className="border border-gray-200 p-4">
                              <input
                                type="text"
                                className="w-full outline-none bg-transparent font-medium text-gray-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 transition-all"
                                value={tech.technology}
                                onChange={(e) => {
                                  const newStack = [...formData.techStack];
                                  newStack[index].technology = e.target.value;
                                  setFormData({ ...formData, techStack: newStack });
                                }}
                              />
                            </td>

                            <td className="border border-gray-200 p-4">
                              <input
                                type="text"
                                className="w-full outline-none bg-transparent text-gray-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 transition-all"
                                value={tech.rationale}
                                onChange={(e) => {
                                  const newStack = [...formData.techStack];
                                  newStack[index].rationale = e.target.value;
                                  setFormData({ ...formData, techStack: newStack });
                                }}
                              />
                            </td>

                            {/* REMOVE BUTTON */}
                            <td className="border border-gray-200 p-4 text-center min-w-[100px]">
                              <button
                                onClick={() => removeTechStack(index)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-xs"
                              >
                                Remove
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Technology Row Button */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={addTechStack}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      <span className="mr-2">+</span> Add Technology
                    </button>
                  </div>

                </div>
            </div>
          </div>

    

        {/* Cost Breakdown */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-sm font-bold">4</span>
                Cost Breakdown 
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
                      <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 text-sm w-32">Amount (₹)</th>
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
                            type="number" 
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
                      <td className="border border-gray-200 p-4 text-right" colSpan="3">
                        <span className="text-gray-800 text-lg">TOTAL PROJECT COST</span>
                      </td>
                      <td className="border border-gray-200 p-4 text-center">
                        <span className="text-orange-700 text-lg font-bold">{formatIndianCurrency(formData.totalCost)}</span>
                        
                      </td>
                      <td className="border border-gray-200 p-4"></td>
                    </tr>

                    
                    {/*=========  GST row ========= */}
                    <tr className="bg-gray-50 font-semibold">

                      <td colSpan="3" className="border border-gray-200 p-4 text-right">
                        <span className="mr-2">GST</span>

                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.gstPercent === 0 ? "" : formData.gstPercent}
                          onChange={(e) => {
                            const value = e.target.value;

                            setFormData({
                              ...formData,
                              gstPercent: value === "" ? "" : Number(value)
                            });
                          }}
                          onBlur={() => {
                            if (formData.gstPercent === "") {
                              setFormData({
                                ...formData,
                                gstPercent: 0
                              });
                            }
                          }}
                          className="w-16 text-center border border-gray-300 rounded px-1 mx-1"
                        /> %
                      </td>

                      <td className="border border-gray-200 p-4 text-center text-blue-700">
                        {formatIndianCurrency(gstAmount)}
                      </td>

                      <td className="border border-gray-200 p-4"></td>

                    </tr>


                    {/* FINAL AMOUNT */}
                    <tr className="bg-green-100 font-bold">
                      <td colSpan="3" className="border border-gray-200 p-4 text-right text-lg">
                        FINAL AMOUNT
                      </td>

                      <td className="border border-gray-200 p-4 text-center text-green-700 text-lg">
                        {formatIndianCurrency(finalAmount)}
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
        

        {/* Project Timeline */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">5</span>
                Project Timeline
              </h2>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700 text-sm w-20">Sr. No</th>
                      <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">Phase</th>
                      <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">Duration</th>
                      <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">Deliverables</th>
                      <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700 w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.timeline.map((phase, index) => (

                      <tr key={index} className="hover:bg-blue-50 transition-colors">
                        <td className="border border-gray-200 p-3 text-center font-medium text-gray-600">
                          {index + 1}
                        </td>

                        <td className="border border-gray-200 p-4">
                          <input
                            type="text"
                            className="w-full outline-none bg-transparent font-semibold text-blue-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1"
                            value={phase.phase}
                            onChange={(e) => {
                              const newTimeline = [...formData.timeline];
                              newTimeline[index].phase = e.target.value;
                              setFormData({ ...formData, timeline: newTimeline });
                            }}
                          />
                        </td>

                        <td className="border border-gray-200 p-4">
                          <input
                            type="text"
                            className="w-full outline-none bg-transparent font-medium text-gray-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1"
                            value={phase.duration}
                            onChange={(e) => {
                              const newTimeline = [...formData.timeline];
                              newTimeline[index].duration = e.target.value;
                              setFormData({ ...formData, timeline: newTimeline });
                            }}
                          />
                        </td>

                        <td className="border border-gray-200 p-4">
                          <input
                            type="text"
                            className="w-full outline-none bg-transparent text-gray-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1"
                            value={phase.deliverables}
                            onChange={(e) => {
                              const newTimeline = [...formData.timeline];
                              newTimeline[index].deliverables = e.target.value;
                              setFormData({ ...formData, timeline: newTimeline });
                            }} />
                        </td>

                        {/* REMOVE BUTTON */}
                        <td className="border border-gray-200 p-4 text-center">
                          <button
                            onClick={() => removeTimelineRow(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-xs">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-semibold text-gray-800">Total Timeline:</span>
                  <input
                    type="text"
                    readOnly
                    value={`${calculateTimelineWeeks()} Weeks`}
                    className="flex-1 sm:max-w-xs px-3 py-2 border border-blue-200 rounded-lg font-bold text-blue-700 bg-white"/>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={addTimelineRow}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center">
                <span className="mr-2">+</span> Add Phase
              </button>
            </div>

            </div>
          </div>
        </div>


        {/* Payment Terms */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="w-6 h-6 bg-white text-green-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  6
                </span>
                Payment Terms (Net 30 Days Invoicing)
              </h2>
            </div>

            <div className="p-6 space-y-3">

              {formData.paymentTerms.map((term, index) => (
                <div key={index} className="flex items-center gap-3">

                  <input
                    type="number"
                    value={term.percent}
                    onChange={(e) =>
                      updatePaymentTerm(index, "percent", e.target.value)
                    }
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-center"
                  />

                  <span className="font-semibold">%</span>

                  <span className="text-gray-600">
                    ({formatIndianCurrency(calculatePayment(term.percent))})
                  </span>

                  <input
                    type="text"
                    value={term.label}
                    onChange={(e) =>
                      updatePaymentTerm(index, "label", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded px-3 py-1"
                  />

                  <button
                    onClick={() => removePaymentTerm(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Remove
                  </button>

                </div>
              ))}

              {/* Add Button */}
              <button
                onClick={addPaymentTerm}
                className="mt-3 bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 text-sm"
              >
                + Add Payment Term
              </button>

              {/* GST */}
              <div className="flex items-center gap-2 mt-4">
                <span className="text-green-600 font-bold">•</span>
                <span>GST @ {gstPercent}% extra as applicable</span>
              </div>

            </div>
          </div>
        </div>


        {/* Post-Launch Maintenance */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  7
                </span>
                Post-Launch Maintenance (Optional, 12-Month Contract)
              </h2>
            </div>

            <div className="p-6">

              <div className="overflow-x-auto">

                <table className="w-full border-collapse">

                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">
                        Plan
                      </th>

                      <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">
                        Coverage
                      </th>

                      <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">
                        Monthly (₹)
                      </th>

                      <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {formData.maintenancePlans?.map((plan, index) => (
                      <tr key={index} className="hover:bg-blue-50 transition-colors">

                        <td className="border border-gray-200 p-4">
                          <input
                            type="text"
                            className="w-full outline-none bg-transparent font-semibold text-blue-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1"
                            value={plan.plan}
                            onChange={(e) =>
                              updateMaintenancePlan(index, "plan", e.target.value)
                            }
                          />
                        </td>

                        <td className="border border-gray-200 p-4">
                          <input
                            type="text"
                            className="w-full outline-none bg-transparent text-gray-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1"
                            value={plan.coverage}
                            onChange={(e) =>
                              updateMaintenancePlan(index, "coverage", e.target.value)
                            }
                          />
                        </td>

                        <td className="border border-gray-200 p-4">
                          <input
                            type="number"
                            className="w-full outline-none bg-transparent font-semibold text-gray-800 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1"
                            value={plan.monthly}
                            onChange={(e) =>
                              updateMaintenancePlan(index, "monthly", e.target.value)
                            }
                          />
                        </td>

                        <td className="border border-gray-200 p-4">
                          <button
                            onClick={() => removeMaintenancePlan(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">
                            Remove
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

              {/* Add Plan Button */}
              <div className="mt-6">
                <button
                  onClick={addMaintenancePlan}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium shadow">
                  + Add Plan
                </button>
              </div>

              {/* Total Range */}
              <p className="mt-6 font-semibold text-gray-800">
                Total Range: {calculateMaintenanceRange()} <span className="font-normal">(per year, Excl. GST)</span>
              </p>

              {/* Note */}
              <p className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Note:</span> Usage-based recurring costs excluded from development quote per industry norms. Client manages billing directly with providers.
              </p>

            </div>
          </div>
        </div>

        {/* Assumptions, Exclusions & Warranty */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="w-6 h-6 bg-white text-slate-700 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  8
                </span>
                Assumptions, Exclusions & Warranty
              </h2>
            </div>

            <div className="p-6 space-y-8">

              {/* INCLUDED */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Included</h3>

                {formData.assumptions.included.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateAssumption("included", index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-3 py-2"
                    />

                    <button
                      onClick={() => removeAssumption("included", index)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-xs flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addAssumption("included")}
                  className="mt-2 text-blue-600 font-medium"
                >
                  + Add Included
                </button>
              </div>


              {/* EXCLUDED */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Excluded</h3>
                {formData.assumptions.excluded.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateAssumption("excluded", index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-3 py-2"/>

                    <button
                      onClick={() => removeAssumption("excluded", index)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-xs flex-shrink-0">
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addAssumption("excluded")}
                  className="mt-2 text-blue-600 font-medium">
                  + Add Exclusion
                </button>
              </div>


              {/* WARRANTY */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Warranty & Support</h3>

                {formData.assumptions.warranty.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateAssumption("warranty", index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-3 py-2"/>

                    <button
                      onClick={() => removeAssumption("warranty", index)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-xs flex-shrink-0">
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addAssumption("warranty")}
                  className="mt-2 text-blue-600 font-medium">
                  + Add Warranty
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Investment Summary */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="w-6 h-6 bg-white text-green-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  9
                </span>
                Project Investment Summary
              </h2>
            </div>

            <div className="p-6 space-y-4">

              {/* Total Project Cost */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="font-semibold text-gray-700 w-56">
                  Total Project Cost
                </span>

                <input
                  type="text"
                  readOnly
                  value={formatIndianCurrency(formData.totalCost)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold text-gray-800"
                />
              </div>


              {/* GST Input */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="font-semibold text-gray-700 w-56">
                  GST Percentage
                </span>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.gstPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gstPercent: Number(e.target.value)
                    })
                  }
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                />

                <span className="text-gray-600">% GST Applicable</span>
              </div>


              {/* GST Amount */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="font-semibold text-gray-700 w-56">
                  GST Amount
                </span>

                <input
                  type="text"
                  readOnly
                  value={formatIndianCurrency(gstAmount)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold text-blue-700"
                />
              </div>


              {/* Final Amount */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-t pt-4">

                <span className="font-bold text-gray-800 w-56 text-lg">
                  Final Project Investment
                </span>

                <input
                  type="text"
                  readOnly
                  value={formatIndianCurrency(finalAmount)}
                  className="px-3 py-2 border border-green-300 rounded-lg bg-green-50 font-bold text-green-700 text-lg"
                />

              </div>

            </div>
          </div>
        </div>


        {/* Authorized Signature */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="w-6 h-6 bg-white text-gray-700 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  10
                </span>
                Authorized Signature
              </h2>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-8 items-start">

              {/* Left Side Info */}
              <div className="space-y-3">

                <input
                  type="text"
                  value={formData.authorizedName}
                  placeholder="Authorized Person Name"
                  onChange={(e) =>
                    setFormData({ ...formData, authorizedName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  value={formData.authorizedRole}
                  placeholder="Designation"
                  onChange={(e) =>
                    setFormData({ ...formData, authorizedRole: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  value={formData.companyName}
                  placeholder="Company Name"
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  value={formData.contactNumber}
                  placeholder="Contact Number"
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="email"
                  value={formData.contactEmail}
                  placeholder="Email Address"
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  value={formData.location}
                  placeholder="Location"
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Signature + Stamp Upload */}
              <div className="text-center space-y-6">

                {/* Signature Upload */}
                <div>
                  <p className="font-semibold text-gray-700 mb-3">
                    Authorized Signature
                  </p>

                  <div
                    className="w-35 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 mx-auto"
                    onClick={() => document.getElementById("signatureUpload").click()}
                  >
                    {formData.signature ? (
                      <img
                        src={formData.signature}
                        alt="Signature"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Upload Signature
                      </span>
                    )}
                  </div>

                  <input
                    id="signatureUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({
                          ...formData,
                          signature: event.target.result
                        });
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>

                {/* Company Stamp */}
                <div>
                  <p className="font-semibold text-gray-700 mb-3">
                    Company Stamp
                  </p>

                  <div
                    className="w-40 h-25 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 mx-auto"
                    onClick={() => document.getElementById("companyStamp").click()}
                  >
                    {formData.companyStamp ? (
                      <img
                        src={formData.companyStamp}
                        alt="Stamp"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Click to Upload
                      </span>
                    )}
                  </div>

                  <input
                    id="companyStamp"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({
                          ...formData,
                          companyStamp: event.target.result
                        });
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              </div>
              </div>

            {/* Note */}
            <div className="px-6 pb-6">
              <textarea
                rows="2"
                placeholder="Note..."
                value={formData.signatureNote}
                onChange={(e) =>
                  setFormData({ ...formData, signatureNote: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
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
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <button
               onClick={saveQuotation}
               className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base">
               Save Quotation
               </button> 

            

            <button 
              onClick={() => {
                if (!formData.id) {
                  alert("Please save the quotation before previewing or sending for approval.");
                  return;
                }
                setShowPreview(true);
              }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"> 
              Preview Quotation
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