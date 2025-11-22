import React from "react";
import { Briefcase, ArrowRight, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RecruiterJobList({ jobs }) {
  const navigate = useNavigate();
  
  // Get only the latest 4 jobs
  const recentJobs = jobs?.slice(0, 4) || [];
  const hasMore = jobs?.length > 4;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get status display
  const getStatusDisplay = (job) => {
    const status = job.status || job.job_status;
    if (status === 'active') return { label: 'Active', color: 'bg-emerald-100 text-emerald-700' };
    if (status === 'paused' || status === 'inactive') return { label: 'Paused', color: 'bg-amber-100 text-amber-700' };
    if (status === 'closed') return { label: 'Closed', color: 'bg-slate-100 text-slate-700' };
    return { label: status || 'Active', color: 'bg-cyan-100 text-cyan-700' };
  };

  const handleViewAll = () => {
    navigate('/recruiter/jobs');
  };

  const handleManageJob = (e, jobId) => {
    e.stopPropagation();
    // Navigate to job management page
    navigate(`/recruiter/jobs/${jobId}/manage`);
  };

  // Empty state
  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg rounded-xl w-full">
        <div className="px-6 pt-6 pb-2 border-b border-slate-200">
          <h2 className="flex items-center gap-2 text-slate-900 text-lg font-semibold">
            <Briefcase className="h-5 w-5 text-cyan-600" />
            Recent Job Postings
          </h2>
        </div>
        <div className="p-12 text-center">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No jobs posted yet</p>
          <button
            onClick={() => navigate('/recruiter/jobs')}
            className="mt-4 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-lg transition-colors"
          >
            Create Your First Job
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg rounded-xl w-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 border-b border-slate-200 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-slate-900 text-lg font-semibold">
          <Briefcase className="h-5 w-5 text-cyan-600" />
          Recent Job Postings
        </h2>
        {hasMore && (
          <button
            onClick={handleViewAll}
            className="flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        {recentJobs.map((job) => {
          const statusInfo = getStatusDisplay(job);
          const applicantCount = job.applications_count || job.applicants || 0;
          const jobTitle = job.job_title || job.title || 'Untitled Job';
          const jobLocation = job.location || job.job_location || 'Location not specified';

          return (
            <div
              key={job.id}
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/recruiter/jobs/${job.id}`)}
            >
              {/* Job Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Company Logo */}
                <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {job.company_logo ? (
                    <img
                      src={job.company_logo}
                      alt={job.company_name || 'Company'}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full bg-slate-700 flex items-center justify-center text-white font-bold text-lg';
                        fallback.textContent = (job.company_name || 'C').charAt(0).toUpperCase();
                        e.target.parentElement.appendChild(fallback);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white font-bold text-lg">
                      {(job.company_name || 'C').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 truncate">{jobTitle}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-slate-500 truncate">{jobLocation}</p>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(job.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side Info */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right hidden sm:flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{applicantCount}</p>
                    <p className="text-xs text-slate-400">applicants</p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>

                {/* Manage Button */}
                <button
                  onClick={(e) => handleManageJob(e, job.id)}
                  className="px-3 py-1.5 rounded-md text-sm bg-teal-500 hover:bg-teal-600 text-white whitespace-nowrap transition-colors"
                >
                  Manage Job
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View More Button at Bottom */}
      {hasMore && (
        <div className="px-6 pb-6">
          <button
            onClick={handleViewAll}
            className="w-full py-2.5 text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
          >
            <span>View All Jobs ({jobs.length - 4} more)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}