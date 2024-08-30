import React, { useState, useEffect } from 'react';
import { Plus, Edit, X, Check, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const ProductForm = ({ onAddProduct, onUpdateProduct, productToEdit, setProductToEdit }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('');
  const [catPrice, setCatPrice] = useState('');
  const [distPrice, setDistPrice] = useState('');
  const [masterQ, setMasterQ] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (productToEdit) {
      setName(productToEdit.name);
      setCode(productToEdit.code);
      setCategory(productToEdit.category);
      setCatPrice(productToEdit.catPrice.toString());
      setDistPrice(productToEdit.distPrice.toString());
      setMasterQ(productToEdit.masterQ.toString());
    } else {
      resetForm();
    }
  }, [productToEdit]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    setProductToEdit(null);
  }
  
  const preventNonNumericInput = (e) => {
    const invalidChars = ['e', 'E', '+', '-'];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-8">
      <div className="col-span-1">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="col-span-1">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="col-span-1">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.category}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-1">
        <input
          type="number"
          value={catPrice}
          onChange={(e) => setCatPrice(e.target.value)}
          onKeyDown={preventNonNumericInput}
          placeholder="Cat Price"
          className="w-full p-2 border rounded"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="col-span-1">
        <input
          type="number"
          value={distPrice}
          onChange={(e) => setDistPrice(e.target.value)}
          onKeyDown={preventNonNumericInput}
          placeholder="Dist Price"
          className="w-full p-2 border rounded"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="col-span-1">
        <input
          type="number"
          value={masterQ}
          onChange={(e) => setMasterQ(e.target.value)}
          onKeyDown={preventNonNumericInput}
          placeholder="Master Q"
          className="w-full p-2 border rounded"
          min="0"
          required
        />
      </div>
      <div className="col-span-3 flex justify-center space-x-4">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded flex items-center justify-center"
        >
          {productToEdit ? (
            <>
              <Check size={16} className="mr-2" /> Update Product
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" /> Add Product
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-red-500 text-white rounded flex items-center justify-center"
        >
          <X size={16} className="mr-2" /> Cancel
        </button>
      </div>
    </form>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductList = ({ products, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const productsPerPage = 10;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(productToDelete._id);
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

    return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-right">Cat Price</th>
              <th className="p-3 text-right">Dist Price</th>
              <th className="p-3 text-right">Master Q</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-3 text-center">No products added yet</td>
              </tr>
            ) : (
              currentProducts.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.code}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3 text-right">${product.catPrice.toFixed(2)}</td>
                  <td className="p-3 text-right">${product.distPrice.toFixed(2)}</td>
                  <td className="p-3 text-right">{product.masterQ}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="p-2 bg-gray-200 rounded disabled:opacity-50"
        >
          <ChevronLeft size={18} />
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="p-2 bg-gray-200 rounded disabled:opacity-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the product ${productToDelete?.name}?`}
      />
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
      setProductToEdit(null);
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      console.log(id);
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
      setError(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Products Management</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ProductForm
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        productToEdit={productToEdit}
        setProductToEdit={setProductToEdit}
      />
      <ProductList
        products={products}
        onEdit={handleEditClick}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductManagement;