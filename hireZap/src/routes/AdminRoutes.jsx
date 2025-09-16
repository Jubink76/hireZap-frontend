import { Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAccountSettings from "../pages/admin/AdminAccountSettings";

export const AdminRoutes = (
    <Route element={<PrivateRoutes allowedRole={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/account-settings" element={<AdminAccountSettings />} />
    </Route>
)