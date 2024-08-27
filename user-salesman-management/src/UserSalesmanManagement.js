import React, { useState } from 'react';
import { Users, UserPlus, ShoppingCart, Package, Layers, ChevronDown } from 'lucide-react';
import UsersComponent from './UsersComponent';
import SalesmenComponent from './SalesmenComponent';
import OrderForm from './OrdersComponent';
import ProductManagement from './ProductManagement';
import CategoryComponent from './CategoryManagement';
import logoImage from './Logo.png';

const UserSalesmanManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const NavItem = ({ id, Icon, text, className = '' }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsAdminDropdownOpen(false);
      }}
      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
        activeTab === id
          ? 'bg-blue-500 text-white'
          : 'text-gray-700 hover:bg-blue-100'
      } ${className}`}
    >
      <Icon className="mr-2" size={18} />
      {text}
    </button>
  );

  const AdminDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
        className="flex items-center px-4 py-2 rounded-md transition-colors text-gray-700 hover:bg-blue-100"
      >
        Admin
        <ChevronDown className="ml-2" size={18} />
      </button>
      {isAdminDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <NavItem id="users" Icon={Users} text="Users" className="w-full justify-start" />
          <NavItem id="salesmen" Icon={UserPlus} text="Salesmen" className="w-full justify-start" />
          <NavItem id="products" Icon={Package} text="Products" className="w-full justify-start" />
          <NavItem id="categories" Icon={Layers} text="Categories" className="w-full justify-start" />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src={logoImage} 
                  alt="Company Logo" 
                  className="h-8 w-auto"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NavItem id="orders" Icon={ShoppingCart} text="Orders" />
              <AdminDropdown />
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
          {activeTab === 'categories' && <CategoryComponent />}
        </div>
      </main>
    </div>
  );
};

export default UserSalesmanManagement;