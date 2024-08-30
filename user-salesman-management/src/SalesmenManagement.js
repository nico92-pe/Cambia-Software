import React, { useState, useEffect } from 'react';
import { Plus, Edit, X, Check, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const SalesmanForm = ({ onAddSalesman, onUpdateSalesman, salesmanToEdit, setSalesmanToEdit }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shortName, setShortName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bank, setBank] = useState('');
  const [birthday, setBirthday] = useState('');

  useEffect(() => {
    if (salesmanToEdit) {
      setName(salesmanToEdit.name);
      setPhoneNumber(salesmanToEdit.phoneNumber);
      setShortName(salesmanToEdit.shortName);
      setBankAccount(salesmanToEdit.bankAccount);
      setBank(salesmanToEdit.bank);
      setBirthday(salesmanToEdit.birthday ? new Date(salesmanToEdit.birthday).toISOString().split('T')[0] : '');
    } else {
      resetForm();
    }
  }, [salesmanToEdit]);

  const resetForm = () => {
    setName('');
    setPhoneNumber('');
    setShortName('');
    setBankAccount('');
    setBank('');
    setBirthday('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const salesmanData = {
      name,
      phoneNumber,
      shortName,
      bankAccount,
      bank,
      birthday: birthday ? new Date(birthday).toISOString() : null,
    };
    
    if (salesmanToEdit) {
      await onUpdateSalesman(salesmanToEdit._id, salesmanData);
      setSalesmanToEdit(null);
    } else {
      await onAddSalesman(salesmanData);
    }
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    setSalesmanToEdit(null);
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
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        value={shortName}
        onChange={(e) => setShortName(e.target.value)}
        placeholder="Short Name"
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        value={bankAccount}
        onChange={(e) => setBankAccount(e.target.value)}
        placeholder="Bank Account"
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        value={bank}
        onChange={(e) => setBank(e.target.value)}
        placeholder="Bank"
        className="p-2 border rounded"
        required
      />
      <input
        type="date"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        placeholder="Birthday"
        className="p-2 border rounded"
        required
      />
      <div className="col-span-2 flex justify-center space-x-4">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded flex items-center justify-center"
        >
          {salesmanToEdit ? (
            <>
              <Check size={16} className="mr-2" /> Update Salesman
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" /> Add Salesman
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

const SalesmenList = ({ salesmen, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [salesmanToDelete, setSalesmanToDelete] = useState(null);
  const salesmenPerPage = 10;

  const indexOfLastSalesman = currentPage * salesmenPerPage;
  const indexOfFirstSalesman = indexOfLastSalesman - salesmenPerPage;
  const currentSalesmen = salesmen.slice(indexOfFirstSalesman, indexOfLastSalesman);

  const totalPages = Math.ceil(salesmen.length / salesmenPerPage);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleDeleteClick = (salesman) => {
    setSalesmanToDelete(salesman);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(salesmanToDelete._id);
    setIsDeleteModalOpen(false);
    setSalesmanToDelete(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Salesmen List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Short Name</th>
              <th className="p-3 text-left">Bank Account</th>
              <th className="p-3 text-left">Bank</th>
              <th className="p-3 text-left">Birthday</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSalesmen.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-3 text-center">No salesmen added yet</td>
              </tr>
            ) : (
              currentSalesmen.map((salesman) => (
                <tr key={salesman._id} className="border-t">
                  <td className="p-3">{salesman.name}</td>
                  <td className="p-3">{salesman.phoneNumber}</td>
                  <td className="p-3">{salesman.shortName}</td>
                  <td className="p-3">{salesman.bankAccount}</td>
                  <td className="p-3">{salesman.bank}</td>
                  <td className="p-3">{new Date(salesman.birthday).toLocaleDateString()}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onEdit(salesman)}
                      className="p-2 bg-blue-500 text-white rounded mr-2"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(salesman)}
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
        message={`Are you sure you want to delete the salesman "${salesmanToDelete?.name}"?`}
      />
    </div>
  );
};

const SalesmenManagement = () => {
  const [salesmen, setSalesmen] = useState([]);
  const [error, setError] = useState(null);
  const [salesmanToEdit, setSalesmanToEdit] = useState(null);

  useEffect(() => {
    fetchSalesmen();
  }, []);

  const fetchSalesmen = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/salesmen`);
      if (!response.ok) {
        throw new Error('Failed to fetch salesmen');
      }
      const data = await response.json();
      setSalesmen(data);
    } catch (error) {
      console.error('Error fetching salesmen:', error);
      setError('Failed to load salesmen. Please try again later.');
    }
  };

  const handleAddSalesman = async (newSalesman) => {
    try {
      const response = await fetch(`${API_BASE_URL}/salesmen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSalesman),
      });

      if (!response.ok) {
        throw new Error('Failed to add salesman');
      }

      const addedSalesman = await response.json();
      setSalesmen((prevSalesmen) => [...prevSalesmen, addedSalesman]);
      setError(null);
    } catch (error) {
      console.error('Error adding salesman:', error);
      setError('Failed to add salesman. Please try again.');
    }
  };

  const handleUpdateSalesman = async (id, updatedSalesman) => {
    try {
      const response = await fetch(`${API_BASE_URL}/salesmen/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSalesman),
      });

      if (!response.ok) {
        throw new Error('Failed to update salesman');
      }

      const updatedSalesmanData = await response.json();
      setSalesmen((prevSalesmen) =>
        prevSalesmen.map((salesman) =>
          salesman._id === id ? updatedSalesmanData : salesman
        )
      );
      setError(null);
      setSalesmanToEdit(null);
    } catch (error) {
      console.error('Error updating salesman:', error);
      setError('Failed to update salesman. Please try again.');
    }
  };

  const handleDeleteSalesman = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/salesmen/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete salesman');
      }

      setSalesmen((prevSalesmen) =>
        prevSalesmen.filter((salesman) => salesman._id !== id)
      );
      setError(null);
    } catch (error) {
      console.error('Error deleting salesman:', error);
      setError('Failed to delete salesman. Please try again.');
    }
  };

  const handleEditClick = (salesman) => {
    setSalesmanToEdit(salesman);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Salesmen Management</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <SalesmanForm
        onAddSalesman={handleAddSalesman}
        onUpdateSalesman={handleUpdateSalesman}
        salesmanToEdit={salesmanToEdit}
        setSalesmanToEdit={setSalesmanToEdit}
      />
      <SalesmenList
        salesmen={salesmen}
        onEdit={handleEditClick}
        onDelete={handleDeleteSalesman}
      />
    </div>
  );
};

export default SalesmenManagement;