import React, { useState } from 'react';
import { Outlet, useMatches, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Bookmark, Home, User, Bell, Settings } from 'lucide-react';
import LeftIconSidebar from './components/LeftIconSidebar';
import DashboardHeader from './components/DashboardHeader';


const CandidateAppLayout = () => {
  const navigate = useNavigate();
  const matches = useMatches();
  const { user } = useSelector((state) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobsCount, setSavedJobsCount] = useState(3);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Determine active tab based on current route
  React.useEffect(() => {
    const currentPath = matches[matches.length - 1]?.pathname || '';
    if (currentPath.includes('profile')) {
      setActiveTab('profile');
    } else if (currentPath.includes('dashboard') || currentPath.includes('job')) {
      setActiveTab('dashboard');
    }
  }, [matches]);

  const handleSearch = (query) => {
    console.log('Search:', query);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Dashboard Header */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <DashboardHeader 
          savedJobsCount={savedJobsCount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 pt-[72px]">
        {/* Fixed Left Sidebar */}
        <div className="fixed left-0 top-[72px] bottom-0 z-10">
          <LeftIconSidebar 
            activeTab={activeTab}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Content Area - Offset by sidebar width */}
        <div className="flex-1 ml-20">
          <Outlet 
            context={{
              searchQuery,
              setSearchQuery,
              savedJobsCount,
              setSavedJobsCount,
              user
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CandidateAppLayout;