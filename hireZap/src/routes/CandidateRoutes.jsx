import { lazy } from 'react';
const CandidateDashboard = lazy(() => import('../pages/candidate/CandidateDashboard'));
const CandidateProfileLayout = lazy(() => import('../pages/candidate/CandidateProfileLayout'));
const CandidateProfileOverview = lazy(() => import('../pages/candidate/components/CandidateProfileOverview'));
const CandidateAccountSettings = lazy(() => import('../pages/candidate/components/CandidateAccountSettings'));
const CandidateProfessionalProfile = lazy(() => import('../pages/candidate/components/CandidateProfessionalProfile.jsx'));

import CookieDebugger from '../CookieDebugger';
import CandidateAppLayout from '../pages/candidate/CandidateAppLayout.jsx';
import JobListView from '../pages/candidate/components/JobListView.jsx';
import JobDetailView from '../pages/candidate/components/JobDetailView.jsx';
import JobApplicationForm from '../pages/candidate/components/JobApplicationForm.jsx';
export const candidateRoutes = [
    {
        path:'/candidate',
        element:<CandidateAppLayout />,
        children:[
            {path:'jobs', element:<JobListView />, handle:{title:'Jobs'}},
            {path:'jobs/:jobId', element:<JobDetailView />, handle:{title:'Job Details'}},
            {path:'jobs/:jobId/apply', element:<JobApplicationForm />, handle:{title:'Apply for Job'}}
        ]
    },
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
