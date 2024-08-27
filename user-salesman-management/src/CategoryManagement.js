import React, { useState, useEffect } from 'react';
import { Plus, Edit, X, Check } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const ProductForm = ({ onAddProduct, onUpdateProduct, productToEdit, setProductToEdit }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('');
  const [catPrice, setCatPrice] = useState('');
  const [distPrice, setDistPrice] = useState('');
  const [masterQ, setMasterQ] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCode(productToEdit.code);
      setCategory(productToEdit.category);
      setCatPrice(productToEdit.catPrice.toString());
      setDistPrice(productToEdit.distPrice.toString());
      setMasterQ(productToEdit.masterQ.toString());
    }
  }, [productToEdit]);

  const resetForm = () => {
    setName('');
    setCode('');
    setCategory('');
    setCatPrice('');
    setDistPrice('');
    setMasterQ('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name,
      code,
      category,
      catPrice: parseFloat(catPrice),
      distPrice: parseFloat(distPrice),
      masterQ: parseInt(masterQ),
    };
    
    if (productToEdit) {
      await onUpdateProduct(productToEdit._id, productData);
      setProductToEdit(null);
    } else {
      await onAddProduct(productData);
    }
    
    // Reset form fields
    resetForm();
    setProductToEdit(null);
  };

  const handleCancel = () => {
    setProductToEdit(null);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="flex space-x-2">
        <input
          type="number"
          value={catPrice}
          onChange={(e) => setCatPrice(e.target.value)}
          placeholder="Cat Price"
          className="w-1/2 p-2 border rounded"
          min="0"
          step="0.01"
          required
        />
        <input
          type="number"
          value={distPrice}
          onChange={(e) => setDistPrice(e.target.value)}
          placeholder="Dist Price"
          className="w-1/2 p-2 border rounded"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div>
        <input
          type="number"
          value={masterQ}
          onChange={(e) => setMasterQ(e.target.value)}
          placeholder="Master Q"
          className="w-full p-2 border rounded"
          min="0"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-green-500 text-white rounded flex items-center justify-center"
      >
        {productToEdit ? (
          <>
            <Check size={20} className="mr-2" /> Update Product
          </>
        ) : (
          <>
            <Plus size={20} className="mr-2" /> Add Product
          </>
        )}
      </button>
      {productToEdit && (
        <button
          type="button"
          onClick={handleCancel}
          className="w-full p-2 bg-red-500 text-white rounded flex items-center justify-center mt-2"
        >
          <X size={20} className="mr-2" /> Cancel Edit
        </button>
      )}
    </form>
  );
};

const ProductList = ({ products, onEdit }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Product List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Code</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-right">Cat Price</th>
              <th className="p-2 text-right">Dist Price</th>
              <th className="p-2 text-right">Master Q</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-2 text-center">No products added yet</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.code}</td>
                  <td className="p-2">{product.category}</td>
                  <td className="p-2 text-right">${product.catPrice.toFixed(2)}</td>
                  <td className="p-2 text-right">${product.distPrice.toFixed(2)}</td>
                  <td className="p-2 text-right">{product.masterQ}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1 bg-blue-500 text-white rounded"
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const addedProduct = await response.json();
      setProducts((prevProducts) => [...prevProducts, addedProduct]);
      setError(null);
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
    }
  };

  const handleUpdateProduct = async (id, updatedProduct) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProductData = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? updatedProductData : product
        )
      );
      setError(null);
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Products</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ProductForm
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        productToEdit={productToEdit}
        setProductToEdit={setProductToEdit}
      />
      <ProductList
        products={products}
        onEdit={setProductToEdit}
      />
    </div>
  );
};

export default ProductManagement;