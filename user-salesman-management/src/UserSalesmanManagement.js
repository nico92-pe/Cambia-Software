import React, { useState } from 'react';
import { Users, UserPlus, ShoppingCart, Package } from 'lucide-react';
import UsersComponent from './UsersComponent';
import SalesmenComponent from './SalesmenComponent';
import OrderForm from './OrdersComponent';
import ProductManagement from './ProductManagement';
import logoImage from './Logo.png';

const UserSalesmanManagement = () => {
  const [activeTab, setActiveTab] = useState('users');

  const NavItem = ({ id, Icon, text }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
        activeTab === id
          ? 'bg-blue-500 text-white'
          : 'text-gray-700 hover:bg-blue-100'
      }`}
    >
      <Icon className="mr-2" size={18} />
      {text}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                {/* <h1 className="text-xl font-bold text-gray-800">Management System</h1> */}
                <img 
                  src={logoImage} 
                  alt="Company Logo" 
                  className="h-8 w-auto" // Adjust the height as needed
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NavItem id="users" Icon={Users} text="Users" />
              <NavItem id="salesmen" Icon={UserPlus} text="Salesmen" />
              <NavItem id="orders" Icon={ShoppingCart} text="Orders" />
              <NavItem id="products" Icon={Package} text="Products" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'users' && <UsersComponent />}
          {activeTab === 'salesmen' && <SalesmenComponent />}
          {activeTab === 'orders' && <OrderForm />}
          {activeTab === 'products' && <ProductManagement />}
        </div>
      </main>
    </div>
  );
};

export default UserSalesmanManagement;