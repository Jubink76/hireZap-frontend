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

const AdminSidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'recruiters', label: 'Recruiters', icon: UserPlus },
    { key: 'companies', label: 'Companies', icon: Grid3X3 },
    { key: 'job-postings', label: 'Job Postings', icon: FileText },
    { key: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { key: 'revenue', label: 'Revenue', icon: DollarSign },
    { key: 'reports', label: 'Reports', icon: BarChart3 },
    { key: 'verifications', label: 'Verifications', icon: Shield },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-800 mt-6 text-white h-full">
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === item.key 
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
            name: "John Doe",
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