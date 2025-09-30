// src/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminDashboardHeader from './components/AdminDashboardHeader';
import AdminPageHeader from './components/AdminPageHeader';

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // choose which header to render based on the current route
  const isSettingsPage = location.pathname.includes('/admin/account-settings');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {isSettingsPage ? (
          <AdminPageHeader pageName="Account Settings" />
        ) : (
          <AdminDashboardHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
      </div>

      {/* Sidebar */}
      <div className="fixed top-[73px] left-0 bottom-0 z-40">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main content */}
      <div className="ml-64 mt-[73px]">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
