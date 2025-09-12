import React from 'react'
import VerifyOtp from './pages/auth/VerifyOtp'
import RegLog from './pages/auth/RegLog'
import { BrowserRouter, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Route } from 'react-router-dom'
import ResetPassword from './pages/auth/ResetPassword'
import ForgotPassword from './pages/auth/ForgotPassword'
import CandidateDashboard from './pages/candidate/CandidateDashboard'
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import axiosInstance from './api/axiosInstance'
import { useEffect } from 'react'
import CandidateProfileDashboard from './pages/candidate/CandidateProfileDashboard'
import CandidateAccountSettings from './pages/candidate/CandidateAccountSettings'
import RecruiterProfileDashboard from './pages/recruiter/RecruiterProfileDashboard'
import RecruiterAccountSettings from './pages/recruiter/RecruiterAccountSettings'
import AdminAccountSettings from './pages/admin/AdminAccountSettings'
import AdminLogin from './pages/auth/AdminLogin'
const App = () => {
  useEffect(() => {
    axiosInstance.get('/auth/csrf-cookie/')
        .then(() => console.log('CSRF cookie set'))
        .catch(err => console.error('CSRF cookie error', err));
}, []);
  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route path= "/" element={<RegLog/>}/>
            <Route path= "/login" element={<RegLog/>}/>
            <Route path= "/register" element={<RegLog/>}/>
            <Route path= "/admin/login" element={<AdminLogin />} />
            <Route path= "/reset_password" element={<ResetPassword/>}/>
            <Route path= "/forgot_password" element={<ForgotPassword/>}/>
            <Route path= "/verify_otp" element={<VerifyOtp/>}/>
            <Route path= "/candidate_dashboard" element= {<CandidateDashboard />} />
            <Route path= "/recruiter_dashboard" element= {<RecruiterDashboard />} />
            <Route path= "/admin_dashboard" element= {<AdminDashboard />} />
            <Route path= "/candidate/profile_dashboard" element ={<CandidateProfileDashboard />} />
            <Route path= "/candidate/account_settings" element = {<CandidateAccountSettings />} />
            <Route path= "/recruiter/profile_dashboard" element = {<RecruiterProfileDashboard />} />
            <Route path= "/recruiter/account_settings" element = {<RecruiterAccountSettings />} />
            <Route path= "/admin/account_settings" element = {<AdminAccountSettings />} />
          </Routes>
        <ToastContainer/>
      </BrowserRouter>
    </div>
  )
}

export default App