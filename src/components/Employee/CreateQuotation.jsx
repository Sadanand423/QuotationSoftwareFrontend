import React, { useState } from 'react';

const CreateQuotation = () => {
  const [formData, setFormData] = useState({
    client: '',
    project: '',
    description: '',
    items: [{ name: '', quantity: 1, price: 0 }]
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = formData.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Create New Quotation</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Generate a professional quotation for your client</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 sm:p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Client Information</h3>
        </div>
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Client</label>
            <select className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base">
              <option>Choose existing client...</option>
              <option>ABC Corp</option>
              <option>XYZ Ltd</option>
              <option>Tech Solutions</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
            <input 
              type="text" 
              placeholder="Enter project title"
              className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base"
              value={formData.project}
              onChange={(e) => setFormData({...formData, project: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
            <textarea 
              placeholder="Describe the project requirements..."
              className="w-full border p-2 sm:p-3 rounded-lg text-sm sm:text-base"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Quotation Items</h3>
          <button 
            onClick={addItem}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm sm:text-base self-start sm:self-auto"
          >
            + Add Item
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="sm:col-span-2 lg:col-span-2">
                  <input 
                    type="text" 
                    placeholder="Item/Service name"
                    className="w-full border p-2 rounded text-sm sm:text-base"
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <input 
                    type="number" 
                    placeholder="Qty"
                    className="w-full border p-2 rounded text-sm sm:text-base"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <input 
                    type="number" 
                    placeholder="Price"
                    className="w-full border p-2 rounded text-sm sm:text-base"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center justify-between sm:justify-center lg:justify-between">
                  <span className="font-semibold text-sm sm:text-base">${(item.quantity * item.price).toFixed(2)}</span>
                  {formData.items.length > 1 && (
                    <button 
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center text-base sm:text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-600 font-medium text-sm sm:text-base">
          💾 Save as Draft
        </button>
        <button className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-600 font-medium text-sm sm:text-base">
          📤 Send for Approval
        </button>
        <button className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-600 font-medium text-sm sm:text-base">
          👁️ Preview
        </button>
      </div>
    </div>
  );
};

export default CreateQuotation;