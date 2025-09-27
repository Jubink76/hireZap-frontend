import { useState } from "react";
import ProfileNavigationSidebar from "./components/ProfileNavigationSidebar";
import ProfileHeader from './components/ProfileHeader';
import ProfileInfo from "./components/ProfileInfo";
import ProfileStats from "./components/ProfileStats";
import RecentApplicationsList from "./components/RecentApplicationsList";
import { useSelector } from "react-redux";
import profileAvatar from '../../assets/profile_avatar.jpg'
import EditProfileModal from "../../modals/EditProfileModal";
const CandidateProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {user,loading,isAuthenticated} = useSelector((state)=>state.auth)
  const [isModalOpen, setIsModalOpen]= useState(false)

  // Sample profile data matching the design
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

  const handleEditProfile = ()=>{
    setIsModalOpen(true)
  }
  // Sample applications data matching the design
  const applicationsData = [
    {
      id: 1,
      position: "Senior Product Designer",
      company: "Google"
    },
    {
      id: 2,
      position: "UX Designer",
      company: "Apple"
    },
    {
      id: 3,
      position: "Product Designer",
      company: "Meta"
    },
    {
      id: 4,
      position: "Senior UX Researcher",
      company: "Netflix"
    }
  ];

  // Function to get page title based on active tab
  const getPageTitle = () => {
    switch(activeTab) {
      case 'overview':
        return 'My Profile';
      case 'applications':
        return 'Applications';
      case 'professional':
        return 'Professional Information';
      case 'mock-tests':
        return 'Mock Tests';
      case 'notifications':
        return 'Notifications';
      case 'analytics':
        return 'Analytics Reports';
      case 'settings':
        return 'Account Settings';
      default:
        return 'Dashboard';
    }
  };

  const getPageDescription = () => {
    switch(activeTab) {
      case 'overview':
        return 'Manage your profile and track your career journey';
      case 'applications':
        return 'View and manage your job applications';
      case 'professional':
        return 'Manage your professional details and experience';
      case 'mock-tests':
        return 'Practice and improve your skills with mock tests';
      case 'notifications':
        return 'Stay updated with your latest notifications';
      case 'analytics':
        return 'Track your job search progress and insights';
      case 'settings':
        return 'Manage your account preferences and settings';
      default:
        return 'Welcome to your dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Header - Full Width */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <ProfileHeader 
          pageName={getPageTitle()}
          onClick ={handleEditProfile}
          text = "edit profile"
        />
      </div>
      
      {/* Content Container with top padding for fixed header */}
      <div className="pt-20">
        <div className="flex">
          {/* Fixed Sidebar - positioned below header */}
          <div className="fixed left-0 top-20 bottom-0 w-64 z-10">
            <ProfileNavigationSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          {/* Main Content - with left margin for sidebar */}
          <div className="flex-1 ml-64 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Overview Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-3">
                      <ProfileInfo profile={profileData} />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <ProfileStats stats={profileData.stats} />
                  </div>
                  
                  <RecentApplicationsList applications={applicationsData} />
                </div>
              )}

              {/* Applications Tab Content */}
              {activeTab === 'applications' && (
                <div className="space-y-6">
                  <RecentApplicationsList applications={applicationsData} />
                </div>
              )}

              {/* Professional Tab Content */}
              {activeTab === 'professional' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <p className="text-slate-600">Professional details section will be implemented here.</p>
                  </div>
                </div>
              )}

              {/* Mock Tests Tab Content */}
              {activeTab === 'mock-tests' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <p className="text-slate-600">Mock tests section will be implemented here.</p>
                  </div>
                </div>
              )}

              {/* Notifications Tab Content */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <p className="text-slate-600">Notifications section will be implemented here.</p>
                  </div>
                </div>
              )}

              {/* Analytics Tab Content */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <p className="text-slate-600">Analytics reports section will be implemented here.</p>
                  </div>
                </div>
              )}

              {/* Settings Tab Content */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <p className="text-slate-600">Account settings section will be implemented here.</p>
                  </div>
                </div>
              )}
              <EditProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userProfile={profileData}       // pass current user data
                onSave={(updatedData) => {
                  // handle saving updated data here
                  console.log('Updated profile:', updatedData);
                  // e.g. dispatch Redux action to update user
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default CandidateProfileDashboard;