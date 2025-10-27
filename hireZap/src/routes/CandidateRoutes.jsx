import { lazy } from 'react';
const CandidateDashboard = lazy(() => import('../pages/candidate/CandidateDashboard'));
const CandidateProfileLayout = lazy(() => import('../pages/candidate/CandidateProfileLayout'));
const CandidateProfileOverview = lazy(() => import('../pages/candidate/components/CandidateProfileOverview'));
const CandidateAccountSettings = lazy(() => import('../pages/candidate/components/CandidateAccountSettings'));
const CandidateProfessionalProfile = lazy(() => import('../pages/candidate/components/CandidateProfessionalProfile.jsx'));

import CookieDebugger from '../CookieDebugger';
export const candidateRoutes = [
    {
        path: '/candidate/dashboard',
        element: <CandidateDashboard />,
        handle: { title: 'Dashboard' },
    },
    { path: '/cookie-debugger', element: <CookieDebugger />},
    {
        path: '/candidate',
        element: <CandidateProfileLayout />,
        children: [
            {path: 'profile-overview',element: <CandidateProfileOverview />,handle: { title: 'My Profile' }},
            {path: 'account-settings',element: <CandidateAccountSettings />,handle: { title: 'Account Settings' }},
            {path: 'professional-profile',element : <CandidateProfessionalProfile />,handle: {title: 'Professional Profile'}}
        ],
    }
];
