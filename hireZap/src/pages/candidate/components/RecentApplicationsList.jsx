import React from 'react';
import { Building2, Briefcase, ArrowRight, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentApplicationsList = ({ applications }) => {
  const navigate = useNavigate();
  
  // Get only the latest 4 applications
  const recentApplications = applications.slice(0, 4);
  const hasMore = applications.length > 4;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      applied: 'Applied',
      under_review: 'Under Review',
      shortlisted: 'Shortlisted',
      interview_scheduled: 'Interview Scheduled',
      interviewed: 'Interviewed',
      offered: 'Offered',
      rejected: 'Rejected',
      withdrawn: 'Withdrawn',
      hired: 'Hired',
    };
    return statusMap[status] || status;
  };

  const handleViewAll = () => {
    navigate('/candidate/applications');
  };

  const handleCardClick = (id) => {
    navigate(`/candidate/application/detail/${id}`);
  };

  const handleTrackerClick = (e, id) => {
    e.stopPropagation(); // Prevent card click event
    navigate(`/candidate/applications/${id}`);
  };

  // Empty state
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Briefcase className="h-4 w-4 text-cyan-600" />
          <h2 className="text-base font-semibold text-slate-900">Recent Applications</h2>
        </div>
        <div className="text-center py-8">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No applications yet</p>
          <button
            onClick={() => navigate('/candidate/jobs')}
            className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm rounded-lg transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-4 w-4 text-cyan-600" />
          <h2 className="text-base font-semibold text-slate-900">Recent Applications</h2>
        </div>
        {hasMore && (
          <button 
            onClick={handleViewAll}
            className="text-base text-cyan-600 hover:text-cyan-700 font-medium flex items-center space-x-1"
          >
            <span>View all</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {recentApplications.map((application) => (
          <div
            key={application.id}
            onClick={() => handleCardClick(application.id)}
            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Company Logo/Icon */}
              <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {application.company_logo ? (
                  <img
                    src={application.company_logo}
                    alt={application.company_name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="bg-slate-700 text-white text-sm font-bold w-full h-full flex items-center justify-center">
                    {application.company_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
              </div>
              
              {/* Job Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 truncate">
                  {application.job_title || 'Job Title'}
                </h3>
                <p className="text-sm text-slate-500 truncate">
                  {application.company_name || 'Company Name'}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(application.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{getStatusDisplay(application.status)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Application Tracker Button */}
            <button 
              onClick={(e) => handleTrackerClick(e, application.id)}
              className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors flex-shrink-0"
            >
              application tracker
            </button>
          </div>
        ))}
      </div>

      {/* View More Button (shown at bottom if there are more than 4) */}
      {hasMore && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <button
            onClick={handleViewAll}
            className="w-full py-2.5 text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center justify-center space-x-2 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <span>View More Applications ({applications.length - 4} more)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentApplicationsList;