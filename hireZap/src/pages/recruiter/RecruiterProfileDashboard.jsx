import React, { useState } from 'react';
import RecruiterProfileNavigationSidebar from './components/RecruiterProfileNavigationSidebar';
import ProfileHeader from '../candidate/components/ProfileHeader';
import ProfileInfo from '../candidate/components/ProfileInfo';
import ProfileStats from '../candidate/components/ProfileStats';
import RecruiterJobList from './components/RecruiterJobList';
import profileAvatar from '../../assets/profile_avatar.jpg'
import { useSelector } from 'react-redux';

const RecruiterProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {user,loading, isAuthenticated} = useSelector((state)=>state.auth)
  // Sample recruiter profile data
  const profileData = {
    name: user?.full_name || 'Anonymous',
    title: "Senior Recruiter",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    joinedDate: "January 2023",
    profileComplete: 92,
    avatar: user?.profile_image_url || profileAvatar,
    stats: {
      activeJobs: 12,
      totalCandidates: 248,
      hiredThisMonth: 8,
      pendingReviews: 23
    }
  };

  // Sample job postings data
  const jobsData = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      postedDate: "2 days ago",
      applicants: 45,
      status: "Active"
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      postedDate: "5 days ago", 
      applicants: 32,
      status: "Interview Phase"
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      postedDate: "1 week ago",
      applicants: 28,
      status: "Reviewing"
    },
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Engineering",
      postedDate: "10 days ago",
      applicants: 19,
      status: "Active"
    }
  ];

  // Function to get page title based on active tab
  const getPageTitle = () => {
    switch(activeTab) {
      case 'overview':
        return 'Recruiter Dashboard';
      case 'jobs':
        return 'Job Management';
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

  const getPageDescription = () => {
    switch(activeTab) {
      case 'overview':
        return 'Manage your recruitment activities and track performance';
      case 'jobs':
        return 'Manage your job postings and track applications';
      case 'candidates':
        return 'Review and manage candidate applications';
      case 'analytics':
        return 'Track your hiring performance and insights';
      case 'communication':
        return 'Manage communications with candidates and team';
      case 'notifications':
        return 'Stay updated with your latest notifications';
      case 'settings':
        return 'Manage your account preferences and settings';
      default:
        return 'Welcome to your recruiter dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Header - Full Width */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <ProfileHeader 
          pageName={getPageTitle()}
          userRole={profileData.name}
          userRoleDescription={`${profileData.title} at ${profileData.company}`}
          userInitial={profileData.name.charAt(0)}
          avatarBgColor="bg-emerald-500"
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
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-3">
                      <ProfileInfo profile={profileData} />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <ProfileStats stats={profileData.stats} />
                  </div>
                  
                  <RecruiterJobList jobs={jobsData} />
                </div>
              )}

              {/* Jobs Tab Content */}
              {activeTab === 'jobs' && (
                <div className="space-y-6">
                  <RecruiterJobList jobs={jobsData} />
                </div>
              )}

              {/* Candidates Tab Content */}
              {activeTab === 'candidates' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <p className="text-slate-600">Candidates management section will be implemented here.</p>
                  </div>
                </div>
              )}

              {/* Analytics Tab Content */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <p className="text-slate-600">Analytics reports section will be implemented here.</p>
                  </div>
                </div>
              )}

              {/* Communication Tab Content */}
              {activeTab === 'communication' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <p className="text-slate-600">Communication hub section will be implemented here.</p>
                  </div>
                </div>
              )}

              {/* Notifications Tab Content */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <p className="text-slate-600">Notifications section will be implemented here.</p>
                  </div>
                </div>
              )}

              {/* Settings Tab Content */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <p className="text-slate-600">Account settings section will be implemented here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfileDashboard;