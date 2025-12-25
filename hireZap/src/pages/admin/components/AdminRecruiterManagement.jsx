import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, Briefcase, Calendar, MoreVertical, Loader2 } from 'lucide-react';
import { fetchAllRecruiters, clearAdminError } from '../../../redux/slices/adminSlice';
import Pagination from '../../../components/Pagination';

const AdminRecruiterManagement = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    recruiters, 
    recruitersLoading, 
    recruitersError, 
    recruitersPagination
    } = useSelector((state) => state.admin);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch recruiters on mount and page change
  useEffect(() => {
    dispatch(fetchAllRecruiters({ 
      page: currentPage, 
      pageSize: itemsPerPage 
    }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate stats
  const totalRecruiters = recruitersPagination?.total_count || 0;
  const activeRecruiters = recruiters.filter(r => r.is_active).length;
  const totalJobs = recruiters.reduce((sum, r) => sum + (r.total_jobs_posted || 0), 0);
  const totalApplications = recruiters.reduce((sum, r) => sum + (r.total_application_recieved || 0), 0);

  const stats = [
    { 
      label: 'Total recruiters', 
      count: totalRecruiters,
      change: '+4.2%',
      isPositive: true
    },
    { 
      label: 'Active recruiters', 
      count: activeRecruiters,
      change: `${Math.round((activeRecruiters / totalRecruiters) * 100)}% active rate`,
      isPositive: true
    },
    { 
      label: 'Total Jobs', 
      count: totalJobs,
      change: '+8 this month',
      isPositive: true
    },
    { 
      label: 'Total Applications', 
      count: totalApplications,
      change: `${totalApplications} applications`,
      isPositive: true
    }
  ];

  // Filter recruiters by search
  const filteredRecruiters = recruiters.filter(recruiter => 
    recruiter.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recruiter.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

return (
    <div className="min-h-screen bg-gray-50">
      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center px-6 py-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex-1 ${
                index !== stats.length - 1 ? 'border-r border-gray-200' : ''
              }`}
            >
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1">
                    {stat.count}
                  </div>
                  <div className={`text-xs ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        {/* Header with Search */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recruiters ({totalRecruiters})
          </h2>
          
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
                />
              </div>
              <button
                // onClick={handleSearch}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {recruitersError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {recruitersError}
            <button
              onClick={() => dispatch(clearAdminError())}
              className="ml-2 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {recruitersLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading recruiters...</p>
          </div>
        ) : filteredRecruiters.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No recruiters found</p>
          </div>
        ) : (
          <>
            {/* Recruiters List */}
            <div className="space-y-4">
              {filteredRecruiters.map((recruiter) => (
                <div key={recruiter.user_id} className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-start justify-between">
                    {/* Left Section - Recruiter Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                        {recruiter.full_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {recruiter.full_name || 'No Name'}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {new Date(recruiter.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            <span className="mr-1">✉</span> {recruiter.email}
                          </span>
                          {recruiter.company && (
                            <span className="flex items-center">
                              <Briefcase className="w-3 h-3 mr-1" />
                              {recruiter.company.name}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-6 text-sm">
                          <div>
                            <span className="text-gray-500">
                              {recruiter.total_jobs_posted} job posts
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              {recruiter.active_jobs} active jobs
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              {recruiter.total_application_recieved} applications
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center space-x-3">
                      {recruiter.company && (
                        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-teal-100 text-teal-700 rounded hover:bg-teal-200">
                          Company Details
                        </button>
                      )}
                      
                      <span className={`px-3 py-1 text-xs font-medium rounded ${
                        recruiter.is_active 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {recruiter.is_active ? 'Active' : 'Inactive'}
                      </span>

                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {recruitersPagination && recruitersPagination.total_pages > 1 && (
              <Pagination
                currentPage={recruitersPagination.page}
                totalPages={recruitersPagination.total_pages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={recruitersPagination.total_count}
                startIndex={(recruitersPagination.page - 1) * itemsPerPage}
                loading={recruitersLoading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminRecruiterManagement;