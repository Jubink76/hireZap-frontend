
import React, { useState } from 'react';

// Import all components (in a real app, these would be separate files)
import RecruiterDashboardHeader from '../recruiter/components/RecruiterDashboardHeader';
import Sidebar from '../recruiter/components/SideBar';
import StatsCards from '../recruiter/components/StatsCards';
import JobSection from '../recruiter/components/JobSection';
import RecentApplicants from '../recruiter/components/RecentApplicants';
import RecruiterDashboardGraph from '../recruiter/components/RecruiterDashboardGraph'
import {Users, TrendingUp, Briefcase, Clock} from 'lucide-react'
import Pagination from '../../components/Pagination';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Adjust as needed

  const navigate = useNavigate()
  // Mock data
  const stats = [
    {
      label: 'Total Applicants',
      value: '1,248',
      trend: 12.4,
      icon: Users
    },
    {
      label: 'Hires This Month', 
      value: '86',
      trend: 5.2,
      icon: TrendingUp
    },
    {
      label: 'Open Jobs',
      value: '42', 
      trend: 2.1,
      icon: Briefcase
    },
    {
      label: 'Avg. Time to Hire',
      value: '18d',
      trend: -1.6,
      icon: Clock
    }
  ];

  const jobs = [
    {
      id: 1,
      title: "Senior Product Designer",
      company: "Figma Inc.",
      location: "San Francisco, CA",
      salary: "$150k-$180k",
      posted: "2h ago",
      applicants: 120,
      status: "Active",
      skills: ["Figma", "UX Research", "Prototyping"],
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop"
    },
    {
      id: 2,
      title: "Backend Engineer", 
      company: "Stripe",
      location: "Remote",
      salary: "$160k-$200k",
      posted: "1d ago", 
      applicants: 89,
      status: "Active",
      skills: ["Go", "PostgreSQL", "Kubernetes"],
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop"
    },
    {
      id: 3,
      title: "People Operations Manager",
      company: "WellnessCo",
      location: "Austin, TX", 
      salary: "$110k-$130k",
      posted: "3d ago",
      applicants: 24,
      status: "Paused", 
      skills: ["HRIS", "Onboarding", "Compensation"],
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop"
    }
  ];

  const recentApplicants = [
    {
      id: 1,
      name: "Ava Johnson",
      title: "Senior Product Designer", 
      location: "New York, NY",
      applied: "45m ago",
      rating: 4.8,
      status: "New",
      skills: ["Design Systems", "Figma"],
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Noah Patel",
      title: "Backend Engineer",
      location: "Remote", 
      applied: "1h ago",
      rating: 4.6,
      status: "New",
      skills: ["Go", "K8s"],
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Liam Chen",
      title: "People Ops Manager",
      location: "Austin, TX",
      applied: "3h ago", 
      rating: 4.2,
      status: "Reviewed",
      skills: ["Onboarding", "HRIS"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    }
  ];

  // Event handlers
  const handleAddCandidate = () => {
    console.log('Add candidate clicked');
  };

  const handleCreateJob = () => {
    console.log('Create job clicked');
  };

  const handleManageJob = (job) => {
    console.log('Manage job:', job);
  };

  const handleSearchCandidates = (query) => {
    console.log('Search candidates:', query);
  };

  const handlePremiumUpgrade = () => {
    console.log('Premium upgrade clicked');
  };

  const handleProfileClick = (recruiter)=>{
    navigate('/recruiter/profile-overview')
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <RecruiterDashboardHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddCandidate={handleAddCandidate}
        />
      </div>
      
      {/* Fixed Left Sidebar */}
      <div className="fixed top-[73px] mt-3 left-0 bottom-0 z-40">
        <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onProfileClick={handleProfileClick} />
      </div>
      
      {/* Main Content Area with proper margins */}
      <div className="ml-64 mt-[73px]">
        <div className="p-6">
          <div className="max-w-7xl mx-auto mt-3">
            {/* Stats Cards */}
            <StatsCards stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecruiterDashboardGraph />
                <JobSection 
                  jobs={jobs}
                  onCreateJob={handleCreateJob}
                  onManageJob={handleManageJob}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                />
                <Pagination />
              </div>
              {/* Right Sidebar */}
              <div className="space-y-6">
                <RecentApplicants 
                  applicants={recentApplicants}
                  onSearchCandidates={handleSearchCandidates}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
