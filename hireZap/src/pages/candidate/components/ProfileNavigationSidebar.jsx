import React from 'react';
import { 
  User, 
  Briefcase, 
  FileText, 
  TestTube, 
  Bell, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import CandidatePremiumCard from './CandidatePremiumCard';
import CandidateSidebarProfile from './CandidateSidebarProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import profileAvatar from '../../../assets/profile_avatar.jpg';

const navigationItems = [
  { id: "overview", label: "Overview", icon: User },
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "mock-tests", label: "Mock Tests", icon: TestTube },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "analytics", label: "Analytics Reports", icon: BarChart3 },
  { id: "settings", label: "Account Settings", icon: Settings },
];

const ProfileNavigationSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Sidebar Profile Info
  const sideBarProfile = {
    name: user?.full_name || 'Anonymous',
    role: user?.role || 'candidate',
    avatar: user?.profile_image_url || profileAvatar
  };

  // Navigate to different pages based on tab clicked
  const handleTabClick = (id) => {
    if (id === 'settings') navigate('/candidate/account-settings');
    else if (id === 'professional') navigate('/candidate/professional-profile');
    else navigate('/candidate/profile-overview'); // default route
  };

  // Detect which tab is active based on current path
  const isActive = (id) => {
    const currentPath = location.pathname;
    if (id === 'settings') return currentPath.includes('account-settings');
    else if (id === 'professional') return currentPath.includes('professional-profile');
    else if (id === 'applications') return currentPath.includes('applications');
    else if (id === 'mock-tests') return currentPath.includes('mock-tests');
    else if (id === 'notifications') return currentPath.includes('notifications');
    else if (id === 'analytics') return currentPath.includes('analytics');
    return currentPath.includes('profile-overview');
  };

  const handleUpgrade = () => {
    console.log("Upgrade to premium clicked");
  };

  const handleProfileClick = (candidate) => {
    console.log("Profile clicked", candidate);
  };

  return (
    <div className="bg-white w-full h-full border-r border-slate-200 overflow-y-auto">
      <nav className="p-4">
        {/* Premium upgrade card */}
        <CandidatePremiumCard onUpgrade={handleUpgrade} />
        
        {/* Navigation items */}
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                  isActive(item.id)
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

        {/* Profile summary at bottom */}
        <CandidateSidebarProfile 
          candidate={sideBarProfile} 
          onClick={handleProfileClick}
        />
      </nav>
    </div>
  );
};

export default ProfileNavigationSidebar;
