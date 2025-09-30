import React, { useState } from 'react';
import { Users, Activity, UserPlus, DollarSign } from 'lucide-react';

// Import all components
import AdminStatsCards from './AdminStatsCards';
import AdminDashboardGraph from './AdminDashboardGraph';
import RecentUsers from './RecentUsers';
import AdminSystemMetrics from './AdminSystemMetrics';

const AdminDashboard = () => {
  
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
  );
};

export default AdminDashboard;