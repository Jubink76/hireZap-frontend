import { Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import RecruiterProfileDashboard from "../pages/recruiter/RecruiterProfileDashboard";
import RecruiterAccountSettings from "../pages/recruiter/RecruiterAccountSettings";
import CompanyDetails from "../pages/recruiter/components/CompanyDetails";
import RecruiterProfileLayout from "../pages/recruiter/RecruiterProfileLayout";
export const RecruiterRoutes = (
    <Route element={<PrivateRoutes allowedRole={['recruiter']} />}>
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path='/recruiter' element={<RecruiterProfileLayout />} >
            <Route path="profile-dashboard" element={<RecruiterProfileDashboard />} />
            <Route path='account-settings' element={<RecruiterAccountSettings />} />
            <Route path='company-details' element={<CompanyDetails />} />
        </Route>
    </Route>
);