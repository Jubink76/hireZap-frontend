import React from 'react'
import { Route } from 'react-router-dom'
import CandidateDashboard from '../pages/candidate/CandidateDashboard'
import PrivateRoutes from './PrivateRoutes'
import CandidateProfileLayout from '../pages/candidate/CandidateProfileLayout'
import CandidateProfileOverview from '../pages/candidate/components/CandidateProfileOverview'
import CandidateAccountSettings from '../pages/candidate/components/CandidateAccountSettings'
export const CandidateRoutes = (
    <Route element={<PrivateRoutes allowedRole={['candidate']} />}>
        <Route path='/candidate/dashboard' element={<CandidateDashboard />} />
        <Route path='/candidate' element={<CandidateProfileLayout />}>
            <Route path='profile-overview' element={<CandidateProfileOverview />} />
            <Route path='account-settings' element={<CandidateAccountSettings />} />
        </Route>
    </Route>
)