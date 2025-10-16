import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = ({allowedRole}) => {
    const user = useSelector((state)=>state.auth.user);
    const loading = useSelector((state) => state.auth.loading);

    if (loading) {
        return <div>Loading...</div>;
    }

    if(!user){
        console.log("🔴 PrivateRoutes: No user found, redirecting to /login");
        return <Navigate to='/login' replace />
    }
    if(allowedRole && !allowedRole.includes(user.role)){
        console.log(`🔴 PrivateRoutes: User role '${user.role}' not in allowed roles ${allowedRole}`);
        return <Navigate to='/unautherized' replace />
    }
  return <Outlet />
}

export default PrivateRoutes