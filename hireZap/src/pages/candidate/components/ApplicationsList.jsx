import React from 'react';
import { Building2, FileText } from 'lucide-react';

// Single Applications List Component
const ApplicationsList = ({ applications = [], onTrackerClick }) => {


  const handleTrackerClick = (applicationId) => {
    console.log(`Opening tracker for application ${applicationId}`);
    // Add your tracker logic here
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

  return (
      <div className="max-w-6xl mx-auto">
        <div className="rounded-lg border bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
          {/* Header */}
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 text-slate-900">
              <FileText className="h-5 w-5 text-cyan-600" />
              Recent Applications
            </h3>
          </div>

          {/* Applications List */}
          <div className="p-6 space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">
                      {application.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {application.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-500">
                      {application.appliedDate}
                    </p>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusStyles(application.status)}`}>
                    {application.status}
                  </div>
                  
                  {/* Tracker Button */}
                  <button
                    onClick={() => onTrackerClick(application.id)}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-3 bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Application Tracker
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default ApplicationsList;