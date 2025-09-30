import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Link, 
  Bell, 
  Eye, 
  Globe, 
  Trash2,
  LogOut,
  ChevronRight
} from 'lucide-react';
import AdminPageHeader from './AdminPageHeader';
import AdminSidebar from './AdminSidebar';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../../redux/slices/authSlice';
import { notify } from '../../../utils/toast';
const AdminAccountSettings = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('settings');

  const handleLogout = async()=>{
    try{
      await dispatch(logoutUser()).unwrap()
      notify.success("Logout successful")
    }catch(err){
      notify.error(err)
    }
  }
  const settingsItems = [
    {
      icon: User,
      title: 'Personal Information',
      description: 'Name, email, phone number, and identity',
      onClick: () => console.log('Personal Information clicked')
    },
    {
      icon: Lock,
      title: 'Password & Security',
      description: 'Password, 2FA, security, and recovery',
      onClick: () => console.log('Password & Security clicked')
    },
    {
      icon: Link,
      title: 'Connected Apps',
      description: 'Manage sign-in providers and integrations',
      onClick: () => console.log('Connected Apps clicked')
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Email, push, and in-app alerts',
      onClick: () => console.log('Notifications clicked')
    },
    {
      icon: Eye,
      title: 'Privacy',
      description: 'Data sharing and visibility preferences',
      onClick: () => console.log('Privacy clicked')
    },
    {
      icon: Globe,
      title: 'Language & Region',
      description: 'Locale, timezone, number formats',
      onClick: () => console.log('Language & Region clicked')
    },
    {
      icon: Trash2,
      title: 'Delete Account',
      description: 'Permanently remove your account and data',
      onClick: () => console.log('Delete Account clicked'),
      danger: true
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb/Subtitle */}
      <div className="mb-6">
        <p className="text-gray-600">Manage Account</p>
      </div>

      {/* Settings Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors ${
                  item.danger ? 'hover:bg-red-50' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.danger ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      item.danger ? 'text-red-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${
                      item.danger ? 'text-red-900' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm ${
                      item.danger ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 ${
                  item.danger ? 'text-red-400' : 'text-gray-400'
                }`} />
              </button>
            );
                })}
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="mt-6">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminAccountSettings;