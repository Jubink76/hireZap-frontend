// src/recruiter/RecruiterProfileLayout.jsx
import React, { useState } from 'react'
import { Outlet, useMatches } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileHeader from '../candidate/components/ProfileHeader'
import RecruiterProfileNavigationSidebar from './components/RecruiterProfileNavigationSidebar'
import EditProfileModal from '../../modals/EditProfileModal'
import profileAvatar from '../../assets/profile_avatar.jpg'
import AddCompanyDetailsModal from '../../modals/AddCompanyDetailsModal'
const RecruiterProfileLayout = () => {
  const { user } = useSelector((state) => state.auth)
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)
  const [isAddCompanyDetailsModalOpen, setIsAddCompanyDetailsModalOpen] = useState(false)

  const matches = useMatches()
  const currentRoute = matches.find((m)=>m.handle?.title)
  const pageName = currentRoute?.handle?.title || 'Candidate Dashboard'

  const profileData = {
    name: user?.full_name || 'Anonymous',
    title: 'Senior Recruiter',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    joinedDate: 'January 2023',
    profileComplete: 92,
    avatar: user?.profile_image_url || profileAvatar,
  }

  const handleSubmit = (data)=>{
    console.log("company details submitted", data)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-20 h-20 bg-white shadow-sm">
        <ProfileHeader
          pageName={pageName}
        />
      </div>

      {/* Fixed sidebar */}
      <div className="fixed left-0 top-20 bottom-0 w-64 z-10 overflow-y-auto bg-white shadow-sm">
        <RecruiterProfileNavigationSidebar />
      </div>

      {/* Main content area offset by header + sidebar */}
      <div className="ml-64 mt-20">
        <div className="p-6 w-full">
          <div className="space-y-6 w-full">
            <Outlet 
              context={{
                  openCompanyModal: () => setIsAddCompanyDetailsModalOpen(true)
              }}
            />
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        userProfile={profileData}
        onSave={(updatedData) => console.log('Updated profile:', updatedData)}
      />
      <AddCompanyDetailsModal
        isOpen={isAddCompanyDetailsModalOpen}
        onClose={() => setIsAddCompanyDetailsModalOpen(false)}
        onClick={handleSubmit}
      />
    </div>
  )
}

export default RecruiterProfileLayout
