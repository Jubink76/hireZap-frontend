import { lazy } from 'react';

const AdminLayout = lazy(() => import('../pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/admin/components/AdminDashboard'));
const AdminAccountSettings = lazy(() => import('../pages/admin/components/AdminAccountSettings'));
const AdminVerificationList = lazy(() => import('../pages/admin/components/AdminVerificationList'));

export const adminRoutes = {
  element: <AdminLayout />,
  children: [
    { path: '/admin/dashboard', element: <AdminDashboard />, handle: { title: 'Dashboard' } },
    { path: '/admin/account-settings', element: <AdminAccountSettings />, handle: { title: 'Account Settings' } },
    { path: '/admin/company-verifications', element:<AdminVerificationList />, handle:{title:'Verification List'}},
  ],
};
