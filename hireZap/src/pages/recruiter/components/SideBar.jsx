
import {Home, Briefcase, Users, BarChart3, MessageSquare, TrendingUp} from 'lucide-react'
import RecruiterProfileCard from './RecruiterProfileCard';
import RecruiterPremiumCard from './RecruiterPremiumCard';
import { useNavigate } from 'react-router-dom';
import profileAvatar from '../../../assets/profile_avatar.jpg';
import { useSelector } from 'react-redux';
const Sidebar = ({ activeTab, onTabChange, onProfileClick }) => {
  const {user, loading, isAuthenticated} = useSelector((state)=>state.auth)

  const sideBarProfile = {
      name: user?.full_name || 'Anonymous',
      role : user?.role || 'undefined',
      avatar : user?.profile_image_url || profileAvatar,
    } 
console.log("user details",sideBarProfile)
  const navigate = useNavigate()
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'selection', label: 'Selection Process', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'communication', label: 'Communication Hub', icon: MessageSquare },
    { id: 'talent', label: 'Talent Pool', icon: Users },
    { id: 'analyze', label: 'Analyze Reports', icon: TrendingUp },
  ];


  return (
    <div className="bg-white w-64 h-full border-r border-slate-200">
      {/* Navigation */}
      <nav className="p-4">
        <RecruiterPremiumCard />
        
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
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
        <RecruiterProfileCard recruiter={sideBarProfile} 
        onClick={onProfileClick}/>
      </nav>
    </div>
  );
};

export default Sidebar;