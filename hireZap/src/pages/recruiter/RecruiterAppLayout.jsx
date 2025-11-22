import React from 'react'
import { useState } from 'react'
import Sidebar from './components/SideBar'
import { Outlet, useNavigate } from 'react-router-dom'
import RecruiterDashboardHeader from './components/RecruiterDashboardHeader'
const RecruiterAppLayout = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    
    const navigate = useNavigate()
    
    const handleProfileClick = (recruiter)=>{
    navigate('/recruiter/profile-overview')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <RecruiterDashboardHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      
      {/* Fixed Left Sidebar */}
      <div className="fixed top-[73px] mt-3 left-0 bottom-0 z-40">
        <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onProfileClick={handleProfileClick} />
      </div>
      
      {/* Main Content Area with proper margins */}
      <div className="ml-64 mt-[73px]">
        <div className="p-6">
          <div className="space-y-6 w-full">
            <Outlet 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterAppLayout