import { lazy } from 'react';

const RecruiterDashboard = lazy(() => import('../pages/recruiter/RecruiterDashboard'));
const RecruiterProfileLayout = lazy(() => import('../pages/recruiter/RecruiterProfileLayout'));
const ProfileOverview = lazy(() => import('../pages/recruiter/components/ProfileOverview'));
const AccountSettings = lazy(() => import('../pages/recruiter/components/AccountSettings'));
const CompanyDetails = lazy(() => import('../pages/recruiter/components/CompanyDetails'));

export const recruiterRoutes = [
    {
        path:'/recruiter/dashboard',
        element:<RecruiterDashboard />,
        handle:{title:'Dashboard'},
    },

    {
        path: '/recruiter',
        element: <RecruiterProfileLayout />,
        children: [
            { path: 'profile-overview', element: <ProfileOverview />, handle: { title: 'Profile Overview' } },
            { path: 'account-settings', element: <AccountSettings />, handle: { title: 'Account Settings' } },
            { path: 'company-details', element: <CompanyDetails />, handle: { title: 'Company Details' } },
        ],
    }
];
