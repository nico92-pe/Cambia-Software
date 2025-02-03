import React, { useState, useEffect } from 'react';
import { Plus, Edit, X, Check, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const ProductForm = ({ onAddProduct, onUpdateProduct, ProductToEdit, setProductToEdit }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [type, setType] = useState('');
  const [catPrice, setcatPrice] = useState('');
  const [distPrice, setdistPrice] = useState('');

  useEffect(() => {
    if (ProductToEdit) {
      setName(ProductToEdit.name);
      setCode(ProductToEdit.code);
      setSelectedCategory(ProductToEdit.category);
      setType(ProductToEdit.type);
      setcatPrice(ProductToEdit.catPrice);
      setdistPrice(ProductToEdit.distPrice);
    } else {
      resetForm();
    }
  }, [ProductToEdit]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName('');
    setCode('');
    setSelectedCategory('');
    setType('');
    setcatPrice('');
    setdistPrice('');
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ProductData = {
      name,
      code,
      category: selectedCategory,
      type: type,
      catPrice,
      distPrice,
    };
    if (ProductToEdit) {
      await onUpdateProduct(ProductToEdit._id, ProductData);
      setProductToEdit(null);
    } else {
      await onAddProduct(ProductData);
    }
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    setProductToEdit(null);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Code"
        className="p-2 border rounded"
        required
      />
      <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded">
          <option value="">Select Category</option>
          {categories.map((categories) => (
            <option key={categories.category} value={categories.category}>
              {categories.category}
            </option>
          ))}
      </select>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="p-2 border rounded"
        required
        >
        <option value="">Select Type</option>
        <option value="Individual">Individual</option>
        <option value="Kit">Kit</option>
      </select>
      <input
        type="number"
        value={catPrice}
        onChange={(e) => {
        if (e.target.value.includes('.') && e.target.value.split('.')[1].length > 2) {
            return;
        }
        setcatPrice(e.target.value);
        }}
        step="0.01"
        placeholder="Precio Minorista"
        min="0"
        className="p-2 border rounded"
        required
      />
      <input
        type="number"
        value={distPrice}
        onChange={(e) => {
        if (e.target.value.includes('.') && e.target.value.split('.')[1].length > 2) {
            return;
        }
        setdistPrice(e.target.value);
        }}
        step="0.01"
        placeholder="Precio Minorista"
        min="0"
        className="p-2 border rounded"
        required
      />
      <div className="col-span-2 flex justify-center space-x-4">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded flex items-center justify-center"
        >
          {ProductToEdit ? (
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

const ProductsList = ({ Products, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ProductToDelete, setProductToDelete] = useState(null);
  const ProductsPerPage = 10;

  const indexOfLastProduct = currentPage * ProductsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - ProductsPerPage;
  const currentProducts = Products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(Products.length / ProductsPerPage);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleDeleteClick = (Product) => {
    setProductToDelete(Product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(ProductToDelete._id);
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Products List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
        <thead>
            <tr className="bg-gray-100">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Code</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-right">Cat. Price</th>
            <th className="p-3 text-right">Dist. Price</th>
            <th className="p-3 text-center">Actions</th>
            </tr>
        </thead>
          <tbody>
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-3 text-center">No Products added yet</td>
              </tr>
            ) : (
              currentProducts.map((Product) => (
                <tr key={Product._id} className="border-t">
                  <td className="p-3">{Product.name}</td>
                  <td className="p-3">{Product.code}</td>
                  <td className="p-3">{Product.category}</td>
                  <td className="p-3">{Product.type}</td>
                  <td className="p-3 text-right">S/ {Product.catPrice.toFixed(2)}</td>
                  <td className="p-3 text-right">S/ {Product.distPrice.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onEdit(Product)}
                      className="p-2 bg-blue-500 text-white rounded mr-2"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(Product)}
                      className="p-2 bg-red-500 text-white rounded"
                    >
                      <Trash2 size={18} />
                    </button>
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
        message={`Are you sure you want to delete the Product "${ProductToDelete?.name}"?`}
      />
    </div>
  );
};

const ProductManagement = () => {
  const [Products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [ProductToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Products`);
      if (!response.ok) {
        throw new Error('Failed to fetch Products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching Products:', error);
      setError('Failed to load Products. Please try again later.');
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      console.log(newProduct);
      if (!response.ok) {
        throw new Error('Failed to add Product');
      }

      const addedProduct = await response.json();
      setProducts((prevProducts) => [...prevProducts, addedProduct]);
      setError(null);
    } catch (error) {
      console.error('Error adding Product:', error);
      setError('Failed to add Product. Please try again.');
    }
  };

  const handleUpdateProduct = async (id, updatedProduct) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to update Product');
      }

      const updatedProductData = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((Product) =>
          Product._id === id ? updatedProductData : Product
        )
      );
      setError(null);
      setProductToEdit(null);
    } catch (error) {
      console.error('Error updating Product:', error);
      setError('Failed to update Product. Please try again.');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete Product');
      }

      setProducts((prevProducts) =>
        prevProducts.filter((Product) => Product._id !== id)
      );
      setError(null);
    } catch (error) {
      console.error('Error deleting Product:', error);
      setError('Failed to delete Product. Please try again.');
    }
  };

  const handleEditClick = (Product) => {
    setProductToEdit(Product);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Products Management</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ProductForm
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        ProductToEdit={ProductToEdit}
        setProductToEdit={setProductToEdit}
      />
      <ProductsList
        Products={Products}
        onEdit={handleEditClick}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductManagement;