import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
const PublicRoutes = () => {
  const user = useSelector((state)=>state.auth.user);
  const location = useLocation();

  const alwaysPublicPages = ["/verify-otp", "/forgot-password", "/reset-password"];

  if(user && !alwaysPublicPages.includes(location.pathname)) {
      switch(user.role){
          case 'candidate':
              return <Navigate to='/candidate/dashboard' replace />;
          case 'recruiter':
              return <Navigate to='/recruiter/dashboard' replace />;
          case 'admin':
              return <Navigate to='/admin/dashboard' replace />;
          default:
              return <Navigate to='/' replace />;
      }
  }

  return <Outlet />
}
export default PublicRoutes;