import React, { useState } from 'react';
import { Plus, Trash2, Printer, Save, ChevronDown } from 'lucide-react';

// Sample product data with image URLs
const productCategories = {
  "Válvulas de Ingreso": [
    { 
      name: "Válvula de Ingreso 7/8''", 
      price: 10.99, 
      image: "https://m.media-amazon.com/images/I/61EPFGFfwCL._AC_SL1500_.jpg"
    },
    { 
      name: "Válvula de Ingreso 1/2''", 
      price: 9.99, 
      image: "https://m.media-amazon.com/images/I/71a8dPphMXL._AC_SL1500_.jpg"
    }
  ],
  "Válvulas de Descarga": [
    { 
      name: "Descarga Simple One-Piece", 
      price: 15.99, 
      image: "https://m.media-amazon.com/images/I/61EPox11mxL._AC_SL1000_.jpg"
    },
    { 
      name: "Descarga Dual One-Piece", 
      price: 19.99, 
      image: "https://m.media-amazon.com/images/I/71Wg9WuT3sL._AC_SL1500_.jpg"
    }
  ]
};

const OrderForm = () => {
  const [clientName, setClientName] = useState('');
  const [salesman, setSalesman] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [items, setItems] = useState([]);
  const [productImage, setProductImage] = useState('');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedProduct('');
    setPrice('');
    setProductImage('');
    setQuantity('');
  };

  const handleProductSelect = (productName) => {
    setSelectedProduct(productName);
    const product = productCategories[selectedCategory].find(p => p.name === productName);
    setPrice(product.price.toFixed(2));
    setProductImage(product.image);
    setQuantity('');
  };

  const handleAddItem = () => {
    if (selectedProduct && price && quantity > 0) {
      setItems([...items, {
        product: selectedProduct,
        price: parseFloat(price),
        quantity: parseInt(quantity)
      }]);
      setSelectedProduct('');
      setPrice('');
      setQuantity('');
      setProductImage('');
    }
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateItemTotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCreatePDF = () => {
    console.log('Creating PDF for order:', { clientName, salesman, items, total: calculateTotal() });
    alert('PDF creation functionality would be implemented here.');
  };

  const handleSaveOrder = () => {
    console.log('Saving order:', { clientName, salesman, items, total: calculateTotal() });
    alert('Order saving functionality would be implemented here.');
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">New Order</h1>
      <div className="space-y-4">
        <div className="mb-4">
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Client Name"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={salesman}
            onChange={(e) => setSalesman(e.target.value)}
            placeholder="Assigned Salesman"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="relative mb-2">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="w-full p-2 border rounded appearance-none"
          >
            <option value="">Select Category</option>
            {Object.keys(productCategories).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2" size={20} />
        </div>

        <div className="relative mb-2">
          <select
            value={selectedProduct}
            onChange={(e) => handleProductSelect(e.target.value)}
            className="w-full p-2 border rounded appearance-none"
            disabled={!selectedCategory}
          >
            <option value="">Select Product</option>
            {selectedCategory && productCategories[selectedCategory].map((product) => (
              <option key={product.name} value={product.name}>{product.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2" size={20} />
        </div>

        <div className="flex flex-wrap -mx-2">
          <div className="w-1/2 px-2 mb-2">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
            />
          </div>
          <div className="w-1/2 px-2 mb-2">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Qty"
              className="w-full p-2 border rounded"
              min="1"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="w-full p-2 bg-green-500 text-white rounded flex items-center justify-center"
          disabled={!selectedProduct || !price || !quantity}
        >
          <Plus size={20} className="mr-2" /> Add Item
        </button>

        {productImage && (
          <div className="flex justify-center mt-4">
            <img src={productImage} alt={selectedProduct} className="max-w-full h-auto max-h-40 object-contain"/>
          </div>
        )}
        
        {items.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-right">Qty</th>
                    <th className="p-2 text-right">Total</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{item.product}</td>
                      <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">${calculateItemTotal(item)}</td>
                      <td className="p-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t font-bold">
                    <td colSpan="3" className="p-2 text-right">Total:</td>
                    <td className="p-2 text-right">${calculateTotal()}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-2 mt-6">
          <button
            type="button"
            onClick={handleCreatePDF}
            className="w-full p-2 bg-blue-500 text-white rounded flex items-center justify-center"
            disabled={items.length === 0}
          >
            <Printer size={20} className="mr-2" /> Create PDF
          </button>
          <button
            type="button"
            onClick={handleSaveOrder}
            className="w-full p-2 bg-green-500 text-white rounded flex items-center justify-center"
            disabled={items.length === 0}
          >
            <Save size={20} className="mr-2" /> Save Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;