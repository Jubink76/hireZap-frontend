import { lazy } from 'react';
const CandidateDashboard = lazy(() => import('../pages/candidate/CandidateDashboard'));
const CandidateProfileLayout = lazy(() => import('../pages/candidate/CandidateProfileLayout'));
const CandidateProfileOverview = lazy(() => import('../pages/candidate/components/CandidateProfileOverview'));
const CandidateAccountSettings = lazy(() => import('../pages/candidate/components/CandidateAccountSettings'));
const CandidateProfessionalProfile = lazy(() => import('../pages/candidate/components/CandidateProfessionalProfile.jsx'));
const CandidateAppLayout = lazy(()=> import('../pages/candidate/CandidateAppLayout.jsx'));
const JobListView = lazy(() => import('../pages/candidate/components/JobListView.jsx'));
const JobDetailView = lazy(()=> import('../pages/candidate/components/JobDetailView.jsx'));
const JobApplicationForm = lazy(() => import('../pages/candidate/components/JobApplicationForm.jsx'));
const JobApplicationsList = lazy(() => import('../pages/candidate/components/JobApplicationList.jsx'));
const JobApplicationDetail = lazy(() => import('../pages/candidate/components/JobApplicationDetail.jsx'));
const JobApplicationTracker = lazy(() => import('../pages/candidate/components/JobApplicationTracker.jsx'));

import CookieDebugger from '../CookieDebugger';

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
            {path: 'professional-profile',element : <CandidateProfessionalProfile />,handle: {title: 'Professional Profile'}},
            {path: 'applications', element: <JobApplicationsList />, handle: { title: 'Job Applications'}},
            {path: 'application/detail/:applicationId', element: <JobApplicationDetail />, handle: { title: 'Application Details'}},
            {path: 'application/tracker/:applicationId', element: <JobApplicationTracker />, handle: { title: 'Application Tracker'}},
        ],
    }
];
