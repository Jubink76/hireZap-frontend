import React from 'react'
import VerifyOtp from './pages/auth/VerifyOtp'
import RegLog from './pages/auth/RegLog'
import { BrowserRouter, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Route } from 'react-router-dom'
import ResetPassword from './pages/auth/ResetPassword'
import ForgotPassword from './pages/auth/ForgotPassword'
import axiosInstance from './api/axiosInstance'
import { useEffect } from 'react'
import AdminLogin from './pages/auth/AdminLogin'
import PublicRoutes from './routes/PublicRoutes'
import { CandidateRoutes } from './routes/CandidateRoutes'
import { AdminRoutes } from './routes/AdminRoutes'
import { RecruiterRoutes } from './routes/RecruiterRoutes'
import GithubCallback from './pages/auth/GithubCallback'
import { useDispatch } from 'react-redux'
import { fetchCurrentUser } from './redux/slices/authSlice'

const App = () => {

  const dispatch = useDispatch()


  useEffect(() => {
    axiosInstance.get('/auth/csrf-cookie/')
        .then(() => {
            console.log('CSRF cookie set');
            // only fetch if a JWT access cookie exists
            const accessCookie = document.cookie.split(';').find(c => c.trim().startsWith('access='));
            if (accessCookie) {
                dispatch(fetchCurrentUser());
            }
        })
        .catch(err => console.error('CSRF cookie error', err));
}, [dispatch]);
  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route element={<PublicRoutes />}>
              <Route path= "/" element={<RegLog/>}/>
              <Route path= "/login" element={<RegLog/>}/>
              <Route path= "/register" element={<RegLog/>}/>
              <Route path= "/admin/login" element={<AdminLogin />} />
              <Route path= "/reset_password" element={<ResetPassword/>}/>
              <Route path= "/forgot-password" element={<ForgotPassword/>}/>
              <Route path= "/verify-otp" element={<VerifyOtp/>}/>
            </Route>
            <Route path="/auth/github/callback" element={<GithubCallback />} />
            {CandidateRoutes}
            {RecruiterRoutes}
            {AdminRoutes}
            <Route path='/unauthorized' element={<h2>Not authorized</h2>} />
          </Routes>
        <ToastContainer/>
      </BrowserRouter>
    </div>
  )
}

export default App