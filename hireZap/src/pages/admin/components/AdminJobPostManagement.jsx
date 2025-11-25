import React, { useState, useEffect } from 'react';
import { CompanySearchModal } from '../../../modals/CompanySearchModal';
import Pagination from '../../../components/Pagination';
import { Search, MapPin, Calendar, Briefcase, DollarSign, Users, Eye, X, ChevronLeft, ChevronRight, Building2, Clock } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllJobs, fetchInactiveJobs, fetchPausedJobs, fetchActiveJobs } from '../../../redux/slices/jobSlice';

const AdminJobPostManagement = () => {
  const dispatch = useDispatch();
  const { allJobs, inactiveJobs, pausedJobs, allActiveJobs, loading, error } = useSelector((state) => state.job);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch data on component mount
  // Fetch jobs based on status filter
useEffect(() => {
  switch (statusFilter) {
    case 'active':
      dispatch(fetchActiveJobs());
      break;
    case 'paused': // paused jobs
      dispatch(fetchPausedJobs());
      break;
    case 'inactive': // inactive jobs
      dispatch(fetchInactiveJobs());
      break;
    default:
      dispatch(fetchAllJobs());
  }
}, [dispatch, statusFilter]);


  // Combine all jobs based on status filter
  const getJobsByStatus = () => {
    switch(statusFilter) {
      case 'active':
        return allActiveJobs || [];
      case 'paused':
        return pausedJobs || [];
      case 'inactive':
        return inactiveJobs || [];
      default:
        return allJobs || [];
    }
  };

  const jobsToDisplay = getJobsByStatus();
  console.log(jobsToDisplay)
  // Extract unique companies from jobs
  const uniqueCompanies = Array.from(
    new Map(
      jobsToDisplay
        .filter(job => job.company)
        .map(job => [job.company.id, {
          id: job.company.id,
          logo:job.company.logo_url,
          name: job.company.company_name,
          industry: job.company.industry || 'Company'
        }])
    ).values()
  );

  // Calculate stats
  const totalJobs = allJobs?.length || 0;
  const activeJobs = allActiveJobs?.length || 0;
  const pendingJobs = pausedJobs?.length || 0;
  const underReviewJobs = inactiveJobs?.length || 0;

  const stats = [
    { label: 'Total Job Posts', count: totalJobs, change: 'All posts' },
    { label: 'Active', count: activeJobs, change: 'Currently live' },
    { label: 'Paused process', count: pendingJobs, change: 'on hold' },
    { label: 'Completed process', count: underReviewJobs, change: 'Inactive' }
  ];

  // Get unique industries
  const industries = ['all', ...new Set(jobsToDisplay.map(j => j.company?.industry).filter(Boolean))];

  // Filter job posts
  const filteredJobs = jobsToDisplay.filter(job => {
    const matchesSearch = 
      job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.recruiter?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = industryFilter === 'all' || job.company?.industry === industryFilter;
    const matchesCompany = !selectedCompany || job.company?.id === selectedCompany.id;
    
    return matchesSearch && matchesIndustry && matchesCompany;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
      'paused': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Paused' },
      'inactive': { bg: 'bg-red-100', text: 'text-red-700', label: 'Inactive' },
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.active;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  if (loading && jobsToDisplay.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center px-6 py-4">
          {stats.map((stat, index) => (
            <div key={index} className={`flex-1 ${index !== stats.length - 1 ? 'border-r border-gray-200' : ''}`}>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1">{stat.count}</div>
                  <div className="text-xs text-gray-500">{stat.change}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        {/* Header with Filters */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">All Job Posts</h2>
          
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={industryFilter}
              onChange={(e) => {
                setIndustryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {industries.filter(i => i !== 'all').map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            <button
              onClick={() => setIsCompanyModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              {selectedCompany ? selectedCompany.name : 'All Companies'}
              {selectedCompany && (
                <X 
                  className="w-3 h-3 ml-1" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCompany(null);
                    setCurrentPage(1);
                  }}
                />
              )}
            </button>

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
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Job Posts List */}
        {currentJobs.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No job posts found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {job.company?.company_name?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">{job.job_title || job.title}</h3>
                        {getStatusBadge(job.status)}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">{job.company?.company_name}</span>
                      </div>

                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location || 'Not specified'}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {job.work_mode || job.workType || 'Remote'}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {job.job_type || job.employmentType || 'Full-time'}
                        </span>
                      </div>

                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {job.salary_range || job.salary || 'Not disclosed'}
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {job.experience_level || job.experienceLevel || 'Mid level'}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {job.applications_count || job.applications || 0} applications
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {job.views_count || job.views || 0} views
                        </span>
                      </div>

                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Posted {formatDate(job.created_at || job.postedDate)}</span>
                        {job.recruiter?.name && (
                          <>
                            <span className="mx-2">•</span>
                            <span>By {job.recruiter.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <button className="px-3 py-1.5 text-xs font-medium bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors">
                      View Details
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                      View Applications
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredJobs.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredJobs.length}
            startIndex={startIndex}
          />
        )}
      </div>

      <CompanySearchModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        companies={uniqueCompanies}
        onSelectCompany={setSelectedCompany}
        selectedCompany={selectedCompany}
      />
    </div>
  );
};

export default AdminJobPostManagement;