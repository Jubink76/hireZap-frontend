import React from 'react'
import { Route } from 'react-router-dom'
import CandidateDashboard from '../pages/candidate/CandidateDashboard'
import CandidateProfileDashboard from '../pages/candidate/CandidateProfileDashboard'
import CandidateAccountSettings from '../pages/candidate/CandidateAccountSettings'
import PrivateRoutes from './PrivateRoutes'
export const CandidateRoutes = (
    <Route element={<PrivateRoutes allowedRole={['candidate']} />}>
        <Route path='/candidate/dashboard' element={<CandidateDashboard />} />
        <Route path='/candidate/profile-dashboard' element={<CandidateProfileDashboard />} />
        <Route path='/candidate/account-settings' element={<CandidateAccountSettings />} />
    </Route>
)