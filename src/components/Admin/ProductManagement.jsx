import React, { useState } from 'react';

const ProductManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [products] = useState([
    { id: 1, name: 'Web Development', category: 'Service', price: 5000, unit: 'Project' },
    { id: 2, name: 'Mobile App Development', category: 'Service', price: 8000, unit: 'Project' },
    { id: 3, name: 'UI/UX Design', category: 'Service', price: 2500, unit: 'Project' },
    { id: 4, name: 'Hosting Service', category: 'Product', price: 100, unit: 'Monthly' }
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Product Management</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Product/Service
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Add New Product/Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Product/Service Name" className="border p-2 rounded" />
            <select className="border p-2 rounded">
              <option>Select Category</option>
              <option>Product</option>
              <option>Service</option>
            </select>
            <input type="number" placeholder="Price" className="border p-2 rounded" />
            <input type="text" placeholder="Unit (e.g., Project, Monthly)" className="border p-2 rounded" />
            <textarea placeholder="Description" className="border p-2 rounded md:col-span-2" rows="3"></textarea>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
            <button 
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.category === 'Service' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">${product.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">{product.unit}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;