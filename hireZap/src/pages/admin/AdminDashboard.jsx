import React, { useState } from 'react';
import { Users, Activity, UserPlus, DollarSign } from 'lucide-react';

// Import all components
import AdminDashboardHeader from './components/AdminDashboardHeader';
import AdminSidebar from './components/AdminSidebar';
import AdminStatsCards from './components/AdminStatsCards';
import AdminDashboardGraph from './components/AdminDashboardGraph';
import RecentUsers from './components/RecentUsers';
import AdminSystemMetrics from './components/AdminSystemMetrics';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  const stats = [
    {
      label: 'Total Users',
      value: '24,583',
      trend: 4.2,
      icon: Users
    },
    {
      label: 'Active Sessions', 
      value: '1,204',
      trend: 1.8,
      icon: Activity
    },
    {
      label: 'New Signups',
      value: '532',
      trend: -3.1,
      icon: UserPlus
    },
    {
      label: 'Revenue',
      value: '$86,420',
      trend: 6.4,
      icon: DollarSign
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AdminDashboardHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      
      {/* Fixed Sidebar */}
      <div className="fixed top-[73px] left-0 bottom-0 z-40">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Main Content Area */}
      <div className="ml-64 mt-[73px]">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <AdminStatsCards stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AdminDashboardGraph />
                <AdminSystemMetrics />
              </div>
              
              {/* Right Sidebar */}
              <div className="space-y-6">
                <RecentUsers />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;