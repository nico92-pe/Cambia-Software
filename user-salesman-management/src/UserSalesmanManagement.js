import React, { useState } from 'react';
import UsersComponent from './UsersComponent';
import SalesmenComponent from './SalesmenComponent';
import OrderForm from './OrdersComponent';

const UserSalesmanManagement = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Management System</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('users')} style={{ marginRight: '10px' }}>Users</button>
        <button onClick={() => setActiveTab('salesmen')} style={{ marginRight: '10px' }}>Salesmen</button>
        <button onClick={() => setActiveTab('orders')}>Orders</button>
      </div>
      
      {activeTab === 'users' && <UsersComponent />}
      {activeTab === 'salesmen' && <SalesmenComponent />}
      {activeTab === 'orders' && <OrderForm />}
    </div>
  );
};

export default UserSalesmanManagement;