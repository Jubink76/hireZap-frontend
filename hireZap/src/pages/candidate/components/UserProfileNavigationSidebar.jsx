import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  FileText, 
  TestTube, 
  Bell, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  Edit,
  MapPin,
  Calendar,
  Building2
} from 'lucide-react';
import appLogo from '../../../assets/app-logo.png'
// Navigation Items Configuration
const navigationItems = [
  { id: "overview", label: "Overview", icon: User },
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "mock-tests", label: "Mock Tests", icon: TestTube },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "analytics", label: "Analytics Reports", icon: BarChart3 },
  { id: "settings", label: "Account Settings", icon: Settings },
];

// Single Navigation Sidebar Component
const UserProfileNavigationSidebar = ({activeTab,setActiveTab,navigationItems}) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="flex gap-6">
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="rounded-lg border bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg sticky top-6">
            {/* Header */}
            <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <div className="flex items-center">
                    <button className="cursor-pointer">
                        <img
                        src={appLogo}
                        alt="HireZap Logo"
                        className="h-16 lg:h-24"
                        />
                    </button>
                    {/* <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none h-9 hover:bg-accent hover:text-accent-foreground">
                        <ChevronLeft className="h-8 w-12" />
                     </button> */}
                </div>
            </div>
            
            {/* Navigation Items */}
            <div className="p-6 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    item.id === activeTab
                      ? "bg-cyan-100 text-cyan-700 font-medium"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-left">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UserProfileNavigationSidebar;