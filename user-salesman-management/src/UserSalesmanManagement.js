import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const UserSalesmanManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [salesmen, setSalesmen] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [newSalesman, setNewSalesman] = useState({ name: '', email: '', territory: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [editingSalesman, setEditingSalesman] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchSalesmen();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchSalesmen = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/salesmen`);
      setSalesmen(response.data);
    } catch (error) {
      console.error('Error fetching salesmen:', error);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, newUser);
      setUsers([...users, response.data]);
      setNewUser({ name: '', email: '', role: '' });
    } catch (error) {
      console.error('Error adding user:', error);
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

  const editUser = (user) => {
    setEditingUser(user);
    setNewUser({ name: user.name, email: user.email, role: user.role });
  };

  const editSalesman = (salesman) => {
    setEditingSalesman(salesman);
    setNewSalesman({ name: salesman.name, email: salesman.email, territory: salesman.territory });
  };

  const updateUser = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${editingUser._id}`, newUser);
      setUsers(users.map(user => user._id === editingUser._id ? response.data : user));
      setNewUser({ name: '', email: '', role: '' });
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
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

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
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
    <div style={{ padding: '20px' }}>
      <h1>User and Salesman Management</h1>
      <div>
        <button onClick={() => setActiveTab('users')} style={{ marginRight: '10px' }}>Users</button>
        <button onClick={() => setActiveTab('salesmen')}>Salesmen</button>
      </div>
      
      {activeTab === 'users' ? (
        <div>
          <h2>Users</h2>
          <div>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            />
            <button onClick={editingUser ? updateUser : addUser}>
              {editingUser ? 'Update User' : 'Add User'}
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => editUser(user)}>Edit</button>
                    <button onClick={() => deleteUser(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
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
                    <button onClick={() => editSalesman(salesman)}>Edit</button>
                    <button onClick={() => deleteSalesman(salesman._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserSalesmanManagement;