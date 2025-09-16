import { Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import RecruiterProfileDashboard from "../pages/recruiter/RecruiterProfileDashboard";
import RecruiterAccountSettings from "../pages/recruiter/RecruiterAccountSettings";
export const RecruiterRoutes = (
    <Route element={<PrivateRoutes allowedRole={['recruiter']} />}>
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/profile-dashboard" element={<RecruiterProfileDashboard />} />
        <Route path='/recruiter/account-settings' element={<RecruiterAccountSettings />} />
    </Route>
);