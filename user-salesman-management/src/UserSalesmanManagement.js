import React, { useState } from 'react';

const UserSalesmanManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ]);
  const [salesmen, setSalesmen] = useState([
    { id: 1, name: 'Mike Johnson', email: 'mike@example.com', territory: 'North' },
    { id: 2, name: 'Sarah Brown', email: 'sarah@example.com', territory: 'South' },
  ]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [newSalesman, setNewSalesman] = useState({ name: '', email: '', territory: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [editingSalesman, setEditingSalesman] = useState(null);

  const addUser = () => {
    setUsers([...users, { ...newUser, id: users.length + 1 }]);
    setNewUser({ name: '', email: '', role: '' });
  };

  const addSalesman = () => {
    setSalesmen([...salesmen, { ...newSalesman, id: salesmen.length + 1 }]);
    setNewSalesman({ name: '', email: '', territory: '' });
  };

  const editUser = (user) => {
    setEditingUser(user);
    setNewUser(user);
  };

  const editSalesman = (salesman) => {
    setEditingSalesman(salesman);
    setNewSalesman(salesman);
  };

  const updateUser = () => {
    setUsers(users.map(user => user.id === editingUser.id ? newUser : user));
    setNewUser({ name: '', email: '', role: '' });
    setEditingUser(null);
  };

  const updateSalesman = () => {
    setSalesmen(salesmen.map(salesman => salesman.id === editingSalesman.id ? newSalesman : salesman));
    setNewSalesman({ name: '', email: '', territory: '' });
    setEditingSalesman(null);
  };

  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const deleteSalesman = (id) => {
    setSalesmen(salesmen.filter(salesman => salesman.id !== id));
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>User and Salesman Management</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('users')} 
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: activeTab === 'users' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'users' ? 'white' : 'black',
            border: 'none',
            marginRight: '0.5rem'
          }}
        >
          Users
        </button>
        <button 
          onClick={() => setActiveTab('salesmen')} 
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: activeTab === 'salesmen' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'salesmen' ? 'white' : 'black',
            border: 'none'
          }}
        >
          Salesmen
        </button>
      </div>
      {activeTab === 'users' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              style={{ flex: 1, padding: '0.5rem' }}
            />
            {editingUser ? (
              <button onClick={updateUser} style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
                Update User
              </button>
            ) : (
              <button onClick={addUser} style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
                Add User
              </button>
            )}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Role</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>{user.name}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>{user.email}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>{user.role}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                    <button onClick={() => editUser(user)} style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#ffc107', border: 'none' }}>Edit</button>
                    <button onClick={() => deleteUser(user.id)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'salesmen' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Name"
              value={newSalesman.name}
              onChange={(e) => setNewSalesman({ ...newSalesman, name: e.target.value })}
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={newSalesman.email}
              onChange={(e) => setNewSalesman({ ...newSalesman, email: e.target.value })}
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Territory"
              value={newSalesman.territory}
              onChange={(e) => setNewSalesman({ ...newSalesman, territory: e.target.value })}
              style={{ flex: 1, padding: '0.5rem' }}
            />
            {editingSalesman ? (
              <button onClick={updateSalesman} style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
                Update Salesman
              </button>
            ) : (
              <button onClick={addSalesman} style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
                Add Salesman
              </button>
            )}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Territory</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salesmen.map((salesman) => (
                <tr key={salesman.id}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>{salesman.name}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>{salesman.email}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>{salesman.territory}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                    <button onClick={() => editSalesman(salesman)} style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#ffc107', border: 'none' }}>Edit</button>
                    <button onClick={() => deleteSalesman(salesman.id)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>Delete</button>
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