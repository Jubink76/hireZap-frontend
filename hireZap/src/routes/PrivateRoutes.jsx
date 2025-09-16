import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = ({allowedRole}) => {
    const user = useSelector((state)=>state.auth.user);
    if(!user){
        return <Navigate to='/login' replace />
    }
    if(allowedRole && !allowedRole.includes(user.role)){
        return <Navigate to='/unautherized' replace />
    }
  return <Outlet />
}

export default PrivateRoutes