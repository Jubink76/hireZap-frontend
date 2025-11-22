// src/pages/candidate/components/JobApplicationsList.jsx
import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyApplications } from '../../../redux/slices/applicationSlice';
import Pagination from '../../../components/Pagination';

const JobApplicationsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myApplications, loading } = useSelector((state) => state.application);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchMyApplications(false)); // Don't include drafts
  }, [dispatch]);


  // Pagination calculations
  const totalPages = Math.ceil(myApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = myApplications.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
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

  const getCompanyIcon = (companyName) => {
    // Generate icon based on company name first letter
    const firstLetter = companyName?.charAt(0).toUpperCase() || '?';
    return firstLetter;
  };

  const getBgColor = (index) => {
    const colors = [
      'bg-slate-900',
      'bg-blue-600',
      'bg-slate-700',
      'bg-teal-600',
      'bg-purple-600',
      'bg-indigo-600',
      'bg-pink-600',
      'bg-gray-700',
    ];
    return colors[index % colors.length];
  };

  const handleCardClick = (id) => {
    navigate(`/candidate/application/detail/${id}`);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="text-slate-600 mt-1">Track and manage your job applications</p>
      </div>

      {/* Empty State */}
      {myApplications.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No Applications Yet
          </h3>
          <p className="text-slate-600 mb-6">
            Start applying to jobs to see your applications here
          </p>
          <button
            onClick={() => navigate('/candidate/jobs')}
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <>
          {/* Applications Grid */}
          <div className="space-y-4">
            {currentApplications.map((application, index) => (
              <div
                key={application.id}
                onClick={()=>handleCardClick(application.id)}
                className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow"
              > 
                <div className="flex items-start justify-between">
                  {/* Left section with icon and details */}
                  <div className="flex gap-4 flex-1">
                    {/* Company Icon */}
                    <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {application.company_logo ? (
                        <img
                          src={application.company_logo}
                          alt={application.company_name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-company-logo.png'; // fallback image
                          }}
                        />
                      ) : (
                        <div className="bg-slate-700 text-white text-lg font-bold w-full h-full flex items-center justify-center">
                          {application.company_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {application.job_title || 'Job Title'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          <span>{application.company_name || 'Company Name'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>Applied on {formatDate(application.created_at)}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-700">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Current Stage:</span>
                        <span>{getStatusDisplay(application.status)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right section with button */}
                  <div className="ml-4 flex-shrink-0 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/candidate/application/detail/${application.id}`);
                      }}
                      className="px-4 py-2 border border-teal-500 text-teal-600 hover:bg-teal-50 text-sm font-medium rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/candidate/application/tracker/${application.id}`);
                      }}
                      className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Application Tracker
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={myApplications.length}
              startIndex={startIndex}
            />
          )}
        </>
      )}
    </div>
  );
};

export default JobApplicationsList;