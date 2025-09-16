import React from 'react';
import { Building2 } from 'lucide-react';

const RecentApplicationsList = ({ applications }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Applications</h2>
      
      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Building Icon */}
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-slate-600" />
              </div>
              
              {/* Job Details */}
              <div>
                <h3 className="font-medium text-slate-900">{application.position}</h3>
                <p className="text-sm text-slate-500">{application.company}</p>
              </div>
            </div>
            
            {/* Application Tracker Button */}
            <button className="px-4 py-2 bg-cyan-500 text-white text-sm rounded-lg hover:bg-cyan-600 transition-colors">
              application tracker
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentApplicationsList;