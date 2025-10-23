// src/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminDashboardHeader from './components/AdminDashboardHeader';
import AdminPageHeader from './components/AdminPageHeader';

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/account-settings')) {
      setActiveTab('settings');
    } else if (path.includes('/admin/company-verifications') || path.includes('/admin/company-detail')) {
      setActiveTab('verifications');
    } else if (path === '/admin' || path === '/admin/') {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  // choose which header to render based on the current route
  const isSettingsPage = location.pathname.includes('/admin/account-settings');
  const isVerificationPage = location.pathname.includes('/admin/company-verifications') || location.pathname.includes('/admin/company-detail');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {isSettingsPage ? (
          <AdminPageHeader pageName="Account Settings" />
        ) : isVerificationPage ? (
          <AdminPageHeader pageName="Company Verifications" />
        ) : (
          <AdminDashboardHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
      </div>

      {/* Sidebar */}
      <div className="fixed top-[73px] left-0 bottom-0 z-40">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
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