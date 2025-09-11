import React from 'react';
import { Search, Bell, MessageSquare, MoreHorizontal, Grid3X3 } from 'lucide-react';
import hireZapLogo from '../../../assets/hireZap.png'
const AdminDashboardHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="lg:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Grid3X3 className="h-4 w-4 text-white" />
            </div>
            <button className="cursor-pointer">
                        <img 
                          src={hireZapLogo} 
                          alt="HireZap Logo" 
                          className="h-12 lg:h-14 mx-auto"
                        />
            </button>
            <span className="text-xl font-semibold text-gray-900">Admin Panel</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 ml-8">Dashboard Overview</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, companies, jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MessageSquare className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;