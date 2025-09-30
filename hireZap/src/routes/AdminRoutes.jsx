import { Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import AdminDashboard from "../pages/admin/components/AdminDashboard";
import AdminAccountSettings from "../pages/admin/components/AdminAccountSettings";
import AdminLayout from "../pages/admin/AdminLayout";
export const AdminRoutes = (
    <Route element={<PrivateRoutes allowedRole={['admin']} />}>
        <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/account-settings" element={<AdminAccountSettings />} />
        </Route>
    </Route>
)