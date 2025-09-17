import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoutes = () => {
    const user = useSelector((state)=>state.auth.user)
    if(user){
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

export default PublicRoutes