import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const SalesmenComponent = () => {
  const [salesmen, setSalesmen] = useState([]);
  const [newSalesman, setNewSalesman] = useState({ name: '', email: '', territory: '' });
  const [editingSalesman, setEditingSalesman] = useState(null);

  useEffect(() => {
    fetchSalesmen();
  }, []);

  const fetchSalesmen = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/salesmen`);
      setSalesmen(response.data);
    } catch (error) {
      console.error('Error fetching salesmen:', error);
    }
  };

  const addSalesman = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/salesmen`, newSalesman);
      setSalesmen([...salesmen, response.data]);
      setNewSalesman({ name: '', email: '', territory: '' });
    } catch (error) {
      console.error('Error adding salesman:', error);
    }
  };

  const updateSalesman = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/salesmen/${editingSalesman._id}`, newSalesman);
      setSalesmen(salesmen.map(salesman => salesman._id === editingSalesman._id ? response.data : salesman));
      setNewSalesman({ name: '', email: '', territory: '' });
      setEditingSalesman(null);
    } catch (error) {
      console.error('Error updating salesman:', error);
    }
  };

  const deleteSalesman = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/salesmen/${id}`);
      setSalesmen(salesmen.filter(salesman => salesman._id !== id));
    } catch (error) {
      console.error('Error deleting salesman:', error);
    }
  };

  return (
    <div>
      <h2>Salesmen</h2>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newSalesman.name}
          onChange={(e) => setNewSalesman({ ...newSalesman, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newSalesman.email}
          onChange={(e) => setNewSalesman({ ...newSalesman, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Territory"
          value={newSalesman.territory}
          onChange={(e) => setNewSalesman({ ...newSalesman, territory: e.target.value })}
        />
        <button onClick={editingSalesman ? updateSalesman : addSalesman}>
          {editingSalesman ? 'Update Salesman' : 'Add Salesman'}
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Territory</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salesmen.map(salesman => (
            <tr key={salesman._id}>
              <td>{salesman.name}</td>
              <td>{salesman.email}</td>
              <td>{salesman.territory}</td>
              <td>
                <button onClick={() => setEditingSalesman(salesman)}>Edit</button>
                <button onClick={() => deleteSalesman(salesman._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesmenComponent;