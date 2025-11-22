import { lazy } from 'react';

const RecruiterDashboard = lazy(() => import('../pages/recruiter/components/RecruiterDashboard'));
const RecruiterProfileLayout = lazy(() => import('../pages/recruiter/RecruiterProfileLayout'));
const ProfileOverview = lazy(() => import('../pages/recruiter/components/ProfileOverview'));
const AccountSettings = lazy(() => import('../pages/recruiter/components/AccountSettings'));
const CompanyDetails = lazy(() => import('../pages/recruiter/components/CompanyDetails'));
const CreatedJobs = lazy(() => import('../pages/recruiter/components/CreatedJobs'));
const RecruiterProfileDetail = lazy(() => import('../pages/recruiter/components/RecruiterProfileDetail'));
const RecruiterAppLayout = lazy(() => import('../pages/recruiter/RecruiterAppLayout'));
const RecruiterSelectionStages = lazy(() => import('../pages/recruiter/components/RecruiterSelectionStages'));
const RecruiterHiringProcess = lazy(() => import('../pages/recruiter/components/RecruiterHiringProcess'));

export const recruiterRoutes = [
    {
        path:'/recruiter',
        element:<RecruiterAppLayout />,
        children: [
            {path:'dashboard', element:<RecruiterDashboard />, handle:{title:'Dashboard'}},
            {path:'selection-stages', element: <RecruiterSelectionStages />, handle: { title: 'Selection Stages'}},
            {path:'hiring-process', element: <RecruiterHiringProcess />, handle: {title: 'Hiring Process'}},
        ]
    },
    {
        path: '/recruiter',
        element: <RecruiterProfileLayout />,
        children: [
            { path: 'profile-overview', element: <ProfileOverview />, handle: { title: 'Profile Overview' } },
            { path: 'account-settings', element: <AccountSettings />, handle: { title: 'Account Settings' } },
            { path: 'company-details', element: <CompanyDetails />, handle: { title: 'Company Details' } },
            { path: 'created-jobs', element: <CreatedJobs />, handle: {title: 'Created Jobs'} },
            { path: 'profile-detail', element: <RecruiterProfileDetail />, handle: {title: 'Profile Detail'}}
        ],
    }
];
