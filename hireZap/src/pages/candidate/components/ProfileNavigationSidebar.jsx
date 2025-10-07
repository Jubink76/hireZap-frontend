import React from 'react';
import { 
  User, 
  Briefcase, 
  FileText, 
  TestTube, 
  Bell, 
  BarChart3, 
  Settings,
  Crown
} from 'lucide-react';
import CandidatePremiumCard from './CandidatePremiumCard';
import CandidateSidebarProfile from './CandidateSidebarProfile';
import avatar from '../../../assets/profile_avatar.jpg'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import profileAvatar from '../../../assets/profile_avatar.jpg'
const navigationItems = [
  { id: "overview", label: "Overview", icon: User },
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "mock-tests", label: "Mock Tests", icon: TestTube },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "analytics", label: "Analytics Reports", icon: BarChart3 },
  { id: "settings", label: "Account Settings", icon: Settings },
];

const ProfileNavigationSidebar = ({ activeTab, setActiveTab, userProfile }) => {
  const navigate = useNavigate()

  const sideBarProfile = {
    name: userProfile?.full_name || 'Anonymous',
    role : userProfile?.role || 'undefined',
    avatar : userProfile?.profile_image_url || profileAvatar
  } 
  const handleTabClick = (id)=>{
  if(id === 'settings'){
    navigate('/candidate/account-settings')
  }else{
    setActiveTab(id)
  }
}

  const handleUpgrade = () => {
    // Handle premium upgrade
    console.log("Upgrade to premium clicked");
  };

  const handleProfileClick = (candidate) => {
    // Handle profile click
    console.log("Profile clicked", candidate);
  };

  return (
    <div className="bg-white w-full h-full border-r border-slate-200 overflow-y-auto">
      {/* Navigation */}
      <nav className="p-4">
        <CandidatePremiumCard onUpgrade={handleUpgrade} />
        
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-teal-100 text-cyan-700 shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        <CandidateSidebarProfile 
          candidate={sideBarProfile} 
          onClick={handleProfileClick}
        />
      </nav>
    </div>
  );
};

export default ProfileNavigationSidebar;