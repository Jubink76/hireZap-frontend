import { Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import CompanyDetails from "../pages/recruiter/components/CompanyDetails";
import RecruiterProfileLayout from "../pages/recruiter/RecruiterProfileLayout";
import ProfileOverview from '../pages/recruiter/components/ProfileOverview';
import AccountSettings from "../pages/recruiter/components/AccountSettings";
export const RecruiterRoutes = (
    <Route element={<PrivateRoutes allowedRole={['recruiter']} />}>
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path='/recruiter' element={<RecruiterProfileLayout />} >
            <Route path="profile-overview" element={<ProfileOverview />} />
            <Route path='account-settings' element={<AccountSettings />} />
            <Route path='company-details' element={<CompanyDetails />} />
        </Route>
    </Route>
);