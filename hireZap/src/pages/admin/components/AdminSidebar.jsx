import React from 'react';
import AdminProfileCard from './AdminProfileCard';
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  CreditCard,
  FileText,
  Grid3X3,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const AdminSidebar = ({ activeTab, onTabChange, setActiveTab }) => {

  const navigate = useNavigate()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'recruiters', label: 'Recruiters', icon: UserPlus },
    { id: 'companies', label: 'Companies', icon: Grid3X3 },
    { id: 'job-postings', label: 'Job Postings', icon: FileText },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'verifications', label: 'Verifications', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTablClick = (id)=>{
    if (id=== 'settings'){
      navigate('/admin/account-settings')
    }else if(id == 'verifications'){
      navigate('/admin/company-verifications')
    }else{
      setActiveTab(id)
    }
  }
  return (
    <div className="w-64 bg-gray-800 mt-6 text-white h-full">
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTablClick(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
        <AdminProfileCard 
            admin={{
            name: "Admin",
            role: "System Administrator",
            avatar: "/path/to/admin-avatar.jpg"
            }}
            onClick={(admin) => {
            // Handle admin profile click
            console.log("Admin profile clicked:", admin);
            }}
        />
      </div>
    </div>
  );
};

export default AdminSidebar;