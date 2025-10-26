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
    } else if (path.includes('/admin/recruiters') || path.includes('/admin/recruiter-detail')) {
      setActiveTab('recruiters');
    } else if (path.includes('/admin/candidates') || path.includes('/admin/candidate-detail')) {
      setActiveTab('candidates');
    } else if (path.includes('/admin/companies') || path.includes('/admin/company-detail')) {
      setActiveTab('companies');
    } else if (path.includes('/admin/job-posts') || path.includes('/admin/job-details')) {
      setActiveTab('job-posts');
    } else if (path === '/admin' || path === '/admin/' || path === '/admin/dashboard') {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  // Determine which header to render based on the current route
  const isSettingsPage = location.pathname.includes('/admin/account-settings');
  const isVerificationPage = location.pathname.includes('/admin/company-verifications') || location.pathname.includes('/admin/company-detail');
  const isRecruiterManagement = location.pathname.includes('/admin/recruiters') || location.pathname.includes('/admin/recruiter-detail');
  const isCandidateManagement = location.pathname.includes('/admin/candidates') || location.pathname.includes('/admin/candidate-detail');
  const isCompanyManagement = location.pathname.includes('/admin/companies') || location.pathname.includes('/admin/company-detail');
  const isJobPostManagement = location.pathname.includes('/admin/job-posts') || location.pathname.includes('/admin/job-details');

  // Get the page name for AdminPageHeader
  const getPageName = () => {
    if (isSettingsPage) return 'Account Settings';
    if (isVerificationPage) return 'Company Verifications';
    if (isRecruiterManagement) return 'Recruiter Management';
    if (isCandidateManagement) return 'Candidate Management';
    if (isCompanyManagement) return 'Company Management';
    if (isJobPostManagement) return 'Job Posts Management';
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {(isSettingsPage || isVerificationPage || isRecruiterManagement || 
          isCandidateManagement || isCompanyManagement || isJobPostManagement) ? (
          <AdminPageHeader pageName={getPageName()} />
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