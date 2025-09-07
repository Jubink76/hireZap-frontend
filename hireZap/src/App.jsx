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
const App = () => {
  useEffect(() => {
    axiosInstance.get('/auth/csrf_cookie/')
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
            <Route path= "/reset_password" element={<ResetPassword/>}/>
            <Route path= "/forgot_password" element={<ForgotPassword/>}/>
            <Route path= "/verify_otp" element={<VerifyOtp/>}/>
            <Route path= "/candidate_dashboard" element= {<CandidateDashboard />} />
            <Route path= "/recruiter_dashboard" element= {<RecruiterDashboard />} />
            <Route path= "/admin_dashboard" element= {<AdminDashboard />} />
          </Routes>
        <ToastContainer/>
      </BrowserRouter>
    </div>
  )
}

export default App