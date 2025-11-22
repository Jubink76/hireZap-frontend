// src/pages/admin/candidates/AdminCandidateManagement.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, Calendar, MoreVertical, Briefcase, FileText, Loader2 } from 'lucide-react';
import { fetchAllCandidates, clearAdminError } from '../../../redux/slices/adminSlice';
import Pagination from '../../../components/Pagination';

const AdminCandidateManagement = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    candidates, 
    candidatesLoading, 
    candidatesError, 
    candidatesPagination 
  } = useSelector((state) => state.admin);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterLocation, setFilterLocation] = useState('');
  const itemsPerPage = 10;

  // Fetch candidates on mount and page change
  useEffect(() => {
    const filters = {};
    if (filterStatus !== 'all') {
      filters.is_active = filterStatus === 'active';
    }
    if (filterLocation) {
      filters.location = filterLocation;
    }
    
    dispatch(fetchAllCandidates({ 
      page: currentPage, 
      pageSize: itemsPerPage,
      filters 
    }));
  }, [dispatch, currentPage, filterStatus, filterLocation]);

  // // Handle search
  // const handleSearch = () => {
  //   if (searchQuery.trim().length >= 2) {
  //     dispatch(searchCandidates(searchQuery.trim()));
  //   } else {
  //     // Fetch all if search is cleared
  //     dispatch(fetchAllCandidates({ 
  //       page: 1, 
  //       pageSize: itemsPerPage 
  //     }));
  //   }
  // };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate stats
  const totalCandidates = candidatesPagination?.total_count || 0;
  const activeCandidates = candidates.filter(c => c.is_active).length;

  const stats = [
    { 
      label: 'Total Candidates', 
      count: totalCandidates,
      change: 'All Status',
      isPositive: true
    },
    { 
      label: 'Active Candidates', 
      count: activeCandidates,
      change: 'Active Users',
      isPositive: true
    }
  ];

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
                  <div className="text-xs text-gray-500">
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="ml-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        {/* Header with Search */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Candidates ({totalCandidates})
          </h2>
          
          {/* Search */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                // onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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

        {/* Error Message */}
        {candidatesError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {candidatesError}
            <button
              onClick={() => dispatch(clearAdminError())}
              className="ml-2 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {candidatesLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading candidates...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No candidates found</p>
          </div>
        ) : (
          <>
            {/* Candidates List */}
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div key={candidate.user_id} className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-start justify-between">
                    {/* Left Section - Candidate Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                        {candidate.full_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {candidate.full_name || 'No Name'}
                          </h3>
                        </div>
                        
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            ✉ {candidate.email}
                          </span>
                          {candidate.phone && (
                            <span className="flex items-center">
                              📞 {candidate.phone}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center flex-wrap gap-x-6 gap-y-2">
                          <div className="flex items-center gap-4">
                            {candidate.location && (
                              <span className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-3 h-3 mr-1" />
                                {candidate.location}
                              </span>
                            )}
                            <span className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-3 h-3 mr-1" />
                              Joined {new Date(candidate.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Skills Preview */}
                        {candidate.skills && candidate.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {candidate.skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill.id}
                                className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full"
                              >
                                {skill.name}
                              </span>
                            ))}
                            {candidate.skills.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{candidate.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle Section - Status Badge */}
                    <div className="flex items-start px-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded ${
                        candidate.is_active 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {candidate.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Right Section - Stats and Actions */}
                    <div className="flex items-center space-x-6">
                      <div className="flex flex-col items-center">
                        <FileText className="w-4 h-4 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">{candidate.total_applications}</span>
                        <span className="text-xs text-gray-500">Applications</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Briefcase className="w-4 h-4 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">{candidate.experiences?.length || 0}</span>
                        <span className="text-xs text-gray-500">Experience</span>
                      </div>
                      
                      <button 
                        className="px-3 py-1.5 text-xs font-medium bg-teal-100 text-teal-700 rounded hover:bg-teal-200"
                        onClick={() => {
                          // Navigate to candidate detail page
                          // navigate(`/admin/candidates/${candidate.user_id}`)
                        }}
                      >
                        View Details
                      </button>

                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {candidatesPagination && candidatesPagination.total_pages > 1 && (
              <Pagination
                currentPage={candidatesPagination.page}
                totalPages={candidatesPagination.total_pages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={candidatesPagination.total_count}
                startIndex={(candidatesPagination.page - 1) * itemsPerPage}
                loading={candidatesLoading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCandidateManagement;