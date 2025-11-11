import React from 'react';
import appLogo from '../../../assets/app-logo.png';
import profileAvatar from '../../../assets/profile_avatar.jpg';
import RecruiterPremiumCard from './RecruiterPremiumCard';
import RecruiterProfileCard from './RecruiterProfileCard';
import { 
  User, 
  Briefcase, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Bell, 
  Settings,
  Crown,
  Factory
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

// Navigation Items Configuration for Recruiters
const navigationItems = [
  { id: "overview", label: "Overview", icon: User },
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "company", label: "Company details", icon: Factory },
  { id: "jobs", label: "Created Jobs", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Account Settings", icon: Settings },
];

const RecruiterProfileNavigationSidebar = ({ activeTab, setActiveTab }) => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const location = useLocation()

  const currentPath = location.pathname
  const recruiter = useSelector((state) => state.auth.user)
  const recruiterData = {
    name: user?.full_name || 'Anonymous',
    role: user?.role || 'recruiter',
    avatar: recruiter?.profile_image_url || profileAvatar,
  };

  const handleUpgrade = () => {
    // Handle premium upgrade
    console.log("Upgrade to premium clicked");
  };

  const handleTabClick = (id) => {
    if (id === 'settings') navigate('/recruiter/account-settings');
    else if (id === 'company') navigate('/recruiter/company-details');
    else if (id === 'jobs') navigate('/recruiter/created-jobs');
    else if (id === 'professional') navigate('/recruiter/profile-detail')
    else navigate('/recruiter/profile-overview'); // overview
  };

  const isActive = (id) => {
    if (id === 'settings') return currentPath.includes('account-settings');
    else if (id === 'company') return currentPath.includes('company-details');
    else if (id === 'jobs') return currentPath.includes('created-jobs');
    else if (id === 'professional') return currentPath.includes('profile-detail');

    return currentPath.includes('profile-overview');
  };

  return (
    <div className="bg-white w-64 h-full border-r border-slate-200 fixed left-0 top-20 bottom-0 z-10 overflow-y-auto">
      {/* Navigation */}
      <nav className="p-4">
        <RecruiterPremiumCard onUpgrade={handleUpgrade} />
        
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

        <RecruiterProfileCard 
          recruiter={recruiterData} 
        />
      </nav>
    </div>
  );
};

export default RecruiterProfileNavigationSidebar;