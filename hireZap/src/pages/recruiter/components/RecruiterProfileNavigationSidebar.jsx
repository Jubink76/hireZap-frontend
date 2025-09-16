import React from 'react';
import appLogo from '../../../assets/app-logo.png'
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
  Crown
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// Navigation Items Configuration for Recruiters
const navigationItems = [
  { id: "overview", label: "Overview", icon: User },
  { id: "company", label: "Company details", icon: Briefcase },
  { id: "jobs", label: "Created Jobs", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Account Settings", icon: Settings },
];

const RecruiterProfileNavigationSidebar = ({ activeTab, setActiveTab }) => {
  // Sample recruiter data - replace with actual data
  const navigate = useNavigate()
  const recruiter = useSelector((state)=>state.auth.user)
  const recruiterData = {
    name: recruiter?.name ?? 'recruiter',
    title: recruiter?.title ?? "Senior Recruiter",
    avatar: recruiter?.avatar ?? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
  };

  const handleUpgrade = () => {
    // Handle premium upgrade
    console.log("Upgrade to premium clicked");
  };

  const handleTabClick = (id)=>{
    if(id === 'settings'){
      navigate('/recruiter/account-settings')
    }else{
      setActiveTab(id)
    }
  }
  return (
    <div className="bg-white w-64 h-full border-r border-slate-200 fixed left-0 top-0 h-screen overflow-y-auto">
      {/* Navigation */}
      <nav className="p-4">
        <div className="flex items-center mb-2">
                  <button className="cursor-pointer">
                    {/* Uncomment and use this when you have the actual logo */}
                    <img
                      src={appLogo}
                      alt="HireZap Logo"
                      className="h-16 lg:h-24"
                    />
                  </button>
                </div>

        <RecruiterPremiumCard onUpgrade={handleUpgrade} />
        
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

        <RecruiterProfileCard 
          recruiter={recruiterData} 
        />
      </nav>
    </div>
  );
};

export default RecruiterProfileNavigationSidebar;