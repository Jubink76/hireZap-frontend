import { lazy } from 'react';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';
import { candidateRoutes } from './CandidateRoutes';
import { recruiterRoutes } from './RecruiterRoutes';
import { adminRoutes } from './AdminRoutes';
import RegLog from '../pages/auth/RegLog';
import VerifyOtp from '../pages/auth/VerifyOtp';
import ResetPassword from '../pages/auth/ResetPassword';
import ForgotPassword from '../pages/auth/ForgotPassword';
import AdminLogin from '../pages/auth/AdminLogin';
import GithubCallback from '../pages/auth/GithubCallback';
export const routes = [
  {
    element: <PublicRoutes />,
    children: [
      { path: '/', element: <RegLog /> },
      { path: '/login', element: <RegLog /> },
      { path: '/register', element: <RegLog /> },
      { path: '/admin/login', element: <AdminLogin /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/verify-otp', element: <VerifyOtp /> },
      
    ],
  },
  { path: '/auth/github/callback', element: <GithubCallback /> },
  {
    element: <PrivateRoutes allowedRole={['candidate']} />,
    children: [...candidateRoutes],
  },
  {
    element: <PrivateRoutes allowedRole={['recruiter']} />,
    children: [...recruiterRoutes],
  },
  {
    element: <PrivateRoutes allowedRole={['admin']} />,
    children: [adminRoutes],
  },
  { path: '/unauthorized', element: <h2>Not authorized</h2> },
];
