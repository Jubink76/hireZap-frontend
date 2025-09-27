import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ProfileHeader from '../candidate/components/ProfileHeader'
import RecruiterProfileNavigationSidebar from './components/RecruiterProfileNavigationSidebar'
import { useSelector } from 'react-redux'
import EditProfileModal from '../../modals/EditProfileModal'
import profileAvatar from '../../assets/profile_avatar.jpg'

const RecruiterProfileLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const profileData = {
    name: user?.full_name || "Anonymous",
    title: "Senior Recruiter",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    joinedDate: "January 2023",
    profileComplete: 92,
    avatar: user?.profile_image_url || profileAvatar,
  };

  const handleEditProfile = () => setIsEditProfileModalOpen(true);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 h-20 bg-white shadow-sm">
        <ProfileHeader
          pageName="Recruiter Dashboard"
          onClick={handleEditProfile}
          text="Edit Profile"
        />
      </div>

      {/* Container for sidebar and main content */}
        <div className="flex">
          {/* Sidebar */}
          <div className="fixed left-0 top-20 bottom-0 w-64 z-10 overflow-y-auto bg-white shadow-sm">
            <RecruiterProfileNavigationSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-screen"> {/* Remove mt-20 since we added pt-20 to parent */}
            <div className="p-6 w-full"> {/* Use w-full instead of max-w-full */}
              <div className="space-y-6 w-full">
                <Outlet />
              </div>
            </div>
          </div>

      </div>

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        userProfile={profileData}
        onSave={(updatedData) => console.log("Updated profile:", updatedData)}
      />
    </div>
  );
};

export default RecruiterProfileLayout