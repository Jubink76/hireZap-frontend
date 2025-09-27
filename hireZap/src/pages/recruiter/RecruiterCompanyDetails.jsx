import React, { useState } from 'react';
import RecruiterProfileNavigationSidebar from './components/RecruiterProfileNavigationSidebar';
import ProfileHeader from '../candidate/components/ProfileHeader';
import CompanyDetailsCard from './components/CompanyDetails';


import { useSelector } from 'react-redux';
const RecruiterCompanyDetails = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {user,loading, isAuthenticated} = useSelector((state)=>state.auth)
  
  // Sample company data
  const sampleCompanyData = {
    name: "TechCorp Solutions",
    industry: "Technology",
    size: "500-1000 employees",
    website: "www.techcorp.com",
    description: "Leading technology solutions provider specializing in AI and cloud computing. We help businesses transform their operations through innovative technology solutions and expert consulting services.",
    founded: "2015",
    headquarters: "San Francisco, CA",
    isVerified: true,
    coordinates: {
      lat: 37.7749,
      lng: -122.4194
    }
  };

  const handleEdit = () => {
    console.log('Edit company details clicked');
  };
  

  // Function to get page title based on active tab
  const getPageTitle = () => {
    switch(activeTab) {
      case 'overview':
        return 'Recruiter Dashboard';
      case 'company':
        return 'Company Details';
      case 'candidates':
        return 'Candidates';
      case 'analytics':
        return 'Analytics Reports';
      case 'communication':
        return 'Communication Hub';
      case 'notifications':
        return 'Notifications';
      case 'settings':
        return 'Account Settings';
      default:
        return 'Dashboard';
    }
  };
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Header - Full Width */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <ProfileHeader 
          pageName={getPageTitle()}
          onClick ={handleEdit}
          text = "add company"
        />
      </div>
      
      {/* Content Container with top padding for fixed header */}
      <div className="pt-20">
        <div className="flex">
          {/* Fixed Sidebar - positioned below header */}
          <div className="fixed left-0 top-20 bottom-0 w-64 z-10 overflow-y-auto">
            <RecruiterProfileNavigationSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          {/* Main Content - with left margin for sidebar */}
          <div className="flex-1 ml-64 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Overview Tab Content */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <CompanyDetailsCard 
                    companyData={sampleCompanyData}
                    onEdit={handleEdit}
                />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterCompanyDetails;