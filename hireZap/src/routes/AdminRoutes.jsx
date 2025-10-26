import { lazy } from 'react';
const AdminLayout = lazy(() => import('../pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/admin/components/AdminDashboard'));
const AdminAccountSettings = lazy(() => import('../pages/admin/components/AdminAccountSettings'));
const AdminVerificationList = lazy(() => import('../pages/admin/components/AdminVerificationList'));
const AdminCompanyDetail = lazy(() => import('../pages/admin/components/AdminCompanyDetail'));
const AdminRecruiterManagement = lazy(() => import('../pages/admin/components/AdminRecruiterManagement'));
const AdminCandidateManagement = lazy(()=> import('../pages/admin/components/AdminCandidateManagement'));
const AdminCompanyManagement = lazy(() => import ('../pages/admin/components/AdminCompanyManagement'));
const AdminJobPostManagement = lazy(() => import('../pages/admin/components/AdminJobPostManagement'));
export const adminRoutes = {
  element: <AdminLayout />,
  children: [
    { path: '/admin/dashboard', element: <AdminDashboard />, handle: { title: 'Dashboard' } },
    { path: '/admin/account-settings', element: <AdminAccountSettings />, handle: { title: 'Account Settings' } },
    { path: '/admin/company-verifications', element:<AdminVerificationList />, handle:{title:'Verification List'}},
    { path: '/admin/company-detail/:companyId', element:<AdminCompanyDetail />, handle:{title: 'Company Details'}},
    { path: '/admin/recruiters', element: <AdminRecruiterManagement />, handle: {title: 'Recruiter Management'}},
    { path: '/admin/candidates', element: <AdminCandidateManagement />, handle: {title: 'Candidate Management'}},
    { path: '/admin/companies', element: <AdminCompanyManagement />, handle: {title: 'Company Management'}},
    { path: '/admin/job-posts', element: <AdminJobPostManagement />, handle: {title: 'Job Post Management'}},
  ],
};
