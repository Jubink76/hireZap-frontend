import React, { useState } from 'react';
import UserProfileNavigationSidebar from './components/UserProfileNavigationSidebar';
import ProfileHeader from './components/ProfileHeader';
import CandidateProfileCard from './components/CandidateProfileCard';
import ApplicationsList from './components/ApplicationsList';
import appLogo from '../../assets/app-logo.png'
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

// Complete User Profile Dashboard Component
const CandidateProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Navigation items data
  const navigationItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "professional", label: "Professional", icon: Briefcase },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "mock-tests", label: "Mock Tests", icon: TestTube },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics Reports", icon: BarChart3 },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  // User data
  const userData = {
    name: "Sarah Johnson",
    title: "Senior Product Designer",
    location: "San Francisco, CA",
    joinDate: "Joined March 2024",
    profileCompletion: 85,
    initials: "SJ",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  // Stats data
  const statsData = [
    { value: "7", label: "Total Applications", color: "text-cyan-600" },
    { value: "1", label: "Hired", color: "text-emerald-600" },
    { value: "3", label: "In Progress", color: "text-amber-600" },
    { value: "2", label: "Tests Completed", color: "text-purple-600" },
  ];

  // Applications data
  const applicationsData = [
    {
      id: 1,
      title: "Senior Product Designer",
      company: "TechCorp",
      appliedDate: "2 days ago",
      status: "In Review",
    },
    {
      id: 2,
      title: "UX Designer",
      company: "Figma",
      appliedDate: "1 week ago",
      status: "Interview Scheduled",
    },
    {
      id: 3,
      title: "Product Designer",
      company: "Airbnb",
      appliedDate: "2 weeks ago",
      status: "Applied",
    },
    {
      id: 4,
      title: "Senior UX Researcher",
      company: "Notion",
      appliedDate: "3 weeks ago",
      status: "Offer Received",
    },
  ];

  // Event handlers
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    console.log(`Switched to tab: ${tabId}`);
  };

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
  };

  const handleTrackerClick = (applicationId) => {
    console.log(`Opening tracker for application ${applicationId}`);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Offer Received":
        return "bg-emerald-100 text-emerald-700";
      case "Interview Scheduled":
        return "bg-cyan-100 text-cyan-700";
      case "In Review":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Render different content based on active tab
  const renderMainContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* Profile Card */}
            <CandidateProfileCard />

            {/* Applications List */}
            <ApplicationsList 
            applications={applicationsData} 
            onTrackerClick={handleTrackerClick} 
            />
          </>
        );
      
      default:
        return (
          <div className="rounded-lg border bg-white shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              {navigationItems.find(item => item.id === activeTab)?.label}
            </h2>
            <p className="text-slate-600">
              Content for {navigationItems.find(item => item.id === activeTab)?.label.toLowerCase()} section will be displayed here.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Navigation Sidebar */}
          <UserProfileNavigationSidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                navigationItems={navigationItems}
                logoSrc={appLogo}
            />
          
          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <ProfileHeader 
                title="My Profile"
                onEdit={handleEditProfile}
            />
            {/* Dynamic Main Content */}
            {renderMainContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileDashboard;