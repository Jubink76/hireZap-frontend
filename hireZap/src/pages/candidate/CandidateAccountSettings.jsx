"use client"

import { useState } from "react"
import {
  User,
  Briefcase,
  FileText,
  TestTube,
  Users,
  Bell,
  BarChart3,
  Settings as SettingsIcon,
  Building2,
  ChevronRight,
  LogOut,
} from "lucide-react"

import ProfileNavigationSidebar from "./components/ProfileNavigationSidebar"
import ProfileHeader from "./components/ProfileHeader"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "../../redux/slices/authSlice"
import { notify } from "../../utils/toast"

export default function CandidateAccountSettings() {
  const [activeTab, setActiveTab] = useState("settings")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state)=>state.auth.user)

  const handleLogout = async()=>{
    try{
      await dispatch(logoutUser()).unwrap();
      notify.success("Logout successful")
      navigate('/login')
    }catch(err){
      notify.error(err)
    }
  }

  const navigationItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "professional", label: "Professional", icon: Briefcase },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "mock-tests", label: "Mock Tests", icon: TestTube },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics Reports", icon: BarChart3 },
    { id: "settings", label: "Account Settings", icon: SettingsIcon },
  ]

  // Sample profile data
  const profileData = {
    name: user?.name ?? '',
    title: user?.title ?? 'candidate',
  }

  // Function to get page title based on active tab
  const getPageTitle = () => {
    switch(activeTab) {
      case 'overview':
        return 'My Profile'
      case 'applications':
        return 'Applications'
      case 'professional':
        return 'Professional Information'
      case 'mock-tests':
        return 'Mock Tests'
      case 'notifications':
        return 'Notifications'
      case 'analytics':
        return 'Analytics Reports'
      case 'settings':
        return 'Account Settings'
      default:
        return 'Dashboard'
    }
  }

  const getPageDescription = () => {
    switch(activeTab) {
      case 'overview':
        return 'Manage your profile and track your career journey'
      case 'applications':
        return 'View and manage your job applications'
      case 'professional':
        return 'Manage your professional details and experience'
      case 'mock-tests':
        return 'Practice and improve your skills with mock tests'
      case 'notifications':
        return 'Stay updated with your latest notifications'
      case 'analytics':
        return 'Track your job search progress and insights'
      case 'settings':
        return 'Manage your account preferences and settings'
      default:
        return 'Welcome to your dashboard'
    }
  }
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Header - Full Width */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <ProfileHeader 
          pageName={getPageTitle()}
          userRole={profileData.name}
          userRoleDescription={profileData.title}
          userInitial={profileData.name.charAt(0)}
          avatarBgColor="bg-blue-500"
        />
      </div>
      
      {/* Content Container with top padding for fixed header */}
      <div className="pt-20">
        <div className="flex">
          {/* Fixed Sidebar - positioned below header */}
          <div className="fixed left-0 top-20 bottom-0 w-64 z-10">
            <ProfileNavigationSidebar
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            canidate={profileData}/>
          </div>
          
          {/* Main Content - with left margin for sidebar */}
          <div className="flex-1 ml-72">
            <div className="max-w-4xl mx-auto px-6 py-6">
              {/* Settings Content */}
              <main className="space-y-6">
                <div className="rounded-lg shadow-lg border border-slate-200 bg-white/80 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div>
                          <h4 className="font-medium text-slate-900">Personal Information</h4>
                          <p className="text-sm text-slate-600">Update your profile details</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div>
                          <h4 className="font-medium text-slate-900">Professional Information</h4>
                          <p className="text-sm text-slate-600">
                            Manage your career details and experience
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div>
                          <h4 className="font-medium text-slate-900">Notification Preferences</h4>
                          <p className="text-sm text-slate-600">Control your job alert notifications</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div>
                          <h4 className="font-medium text-slate-900">Privacy & Security</h4>
                          <p className="text-sm text-slate-600">Manage your account security settings</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div>
                          <h4 className="font-medium text-slate-900">Premium Subscription</h4>
                          <p className="text-sm text-slate-600">Manage your premium plan benefits</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      </div>

                      <div className="h-px bg-slate-200 my-6"></div>

                      <button 
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 w-full text-red-600 border border-red-200 hover:bg-red-50 bg-transparent transition-colors cursor-pointer">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
