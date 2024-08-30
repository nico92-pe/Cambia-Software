import React, { useState, useEffect } from 'react';
import { Plus, Edit, X, Check, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const CategoryForm = ({ onAddCategory, onUpdateCategory, categoryToEdit, setCategoryToEdit }) => {
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (categoryToEdit) {
      setCategory(categoryToEdit.category);
    } else {
      resetForm();
    }
  }, [categoryToEdit]);

  const resetForm = () => {
    setCategory('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = {
      category,
    };
    
    if (categoryToEdit) {
      await onUpdateCategory(categoryToEdit._id, categoryData);
      setCategoryToEdit(null);
    } else {
      await onAddCategory(categoryData);
    }
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    setCategoryToEdit(null);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-8">
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="flex-grow p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded flex items-center justify-center"
      >
        {categoryToEdit ? (
          <>
            <Check size={16} className="mr-2" /> Update Category
          </>
        ) : (
          <>
            <Plus size={16} className="mr-2" /> Add Category
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

const CategoryList = ({ categories, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const categoriesPerPage = 10;

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(categoryToDelete._id);
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Category List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.length === 0 ? (
              <tr>
                <td colSpan="2" className="p-3 text-center">No categories added yet</td>
              </tr>
            ) : (
              currentCategories.map((category) => (
                <tr key={category._id} className="border-t">
                  <td className="p-3">{category.category}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onEdit(category)}
                      className="p-2 bg-blue-500 text-white rounded mr-2"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
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
        message={`Are you sure you want to delete the category "${categoryToDelete?.category}"?`}
      />
    </div>
  );
};

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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
      setError('Failed to load categories. Please try again later.');
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      const addedCategory = await response.json();
      setCategories((prevCategories) => [...prevCategories, addedCategory]);
      setError(null);
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category. Please try again.');
    }
  };

  const handleUpdateCategory = async (id, updatedCategory) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      const updatedCategoryData = await response.json();
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === id ? updatedCategoryData : category
        )
      );
      setError(null);
      setCategoryToEdit(null);
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category. Please try again.');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== id)
      );
      setError(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category. Please try again.');
    }
  };

  const handleEditClick = (category) => {
    setCategoryToEdit(category);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Category Management</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <CategoryForm
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        categoryToEdit={categoryToEdit}
        setCategoryToEdit={setCategoryToEdit}
      />
      <CategoryList
        categories={categories}
        onEdit={handleEditClick}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
};

export default CategoryManagement;