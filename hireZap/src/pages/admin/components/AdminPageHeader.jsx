import React from 'react';
import { Grid3X3 } from 'lucide-react';
import hireZapLogo from '../../../assets/hireZap.png';

const AdminPageHeader = ({ pageName }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Page Name */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="lg:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Grid3X3 className="h-4 w-4 text-white" />
            </div>
            <button className="cursor-pointer">
              <img 
                src={hireZapLogo} 
                alt="HireZap Logo" 
                className="h-12 lg:h-14"
              />
            </button>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">{pageName}</h1>
        </div>
        
        {/* Right side - Admin Profile */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">A</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPageHeader;