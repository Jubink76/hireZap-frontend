import React from 'react'
import ProfileNavigationSidebar from './components/ProfileNavigationSidebar';
import { Outlet, useMatches } from 'react-router-dom';
import EditProfileModal from '../../modals/EditProfileModal';
import { useSelector } from 'react-redux';
import profileAvatar from '../../assets/profile_avatar.jpg'
import { useState } from 'react';
import ProfileHeader from './components/ProfileHeader'
const CandidateProfileLayout = () => {
    const {user} = useSelector((state)=>state.auth)
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)

    const matches = useMatches()
    const currentRoute = matches.find((m)=>m.handle?.title)
    const pageName = currentRoute?.handle?.title || 'Candidate Dashboard'

    const profileData = {
        name: user?.full_name || 'Anonymous  ',
        title: "Senior Product Designer",
        location: "San Francisco, CA",
        joinedDate: "March 2024",
        profileComplete: 85,
        avatar: user?.profile_image_url || profileAvatar,
        stats: {
          totalApplications: 7,
          hired: 1,
          inProgress: 3,
          testsCompleted: 2
        }
    };
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
        <ProfileNavigationSidebar 
        userProfile={profileData}/>
      </div>

      {/* Main content area offset by header + sidebar */}
      <div className="ml-64 mt-20">
        <div className="p-6 w-full">
          <div className="space-y-6 w-full">
            <Outlet 
            context={{openEditUserModal:()=>setIsEditProfileModalOpen(true)}}/>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        userProfile={profileData}
        onSave={(updatedData) => console.log('Updated profile:', updatedData)}
      />
    </div>
  );
};

export default CandidateProfileLayout