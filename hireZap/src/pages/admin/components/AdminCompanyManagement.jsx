import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, Calendar, Globe, Mail, Star, ChevronLeft, ChevronRight, BadgeCheck, AlertCircle, Clock } from 'lucide-react';
import Pagination from '../../../components/Pagination';
import { fetchVerifiedCompanies,fetchCompanyById } from '../../../redux/slices/companySlice';
import { useNavigate } from 'react-router-dom';

const AdminCompanyManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { verifiedCompanies, loading, error } = useSelector((state) => state.company);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('verified'); // Default to verified
  const [industryFilter, setIndustryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch verified companies on component mount
  useEffect(() => {
    dispatch(fetchVerifiedCompanies());
  }, [dispatch]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Helper function to generate company logo
  const getCompanyLogo = (company) => {
    if (company.logo_url) return company.logo_url;
    const name = company.name || company.company_name || 'Company';
    const colors = ['4F46E5', '10B981', 'F59E0B', '3B82F6', 'EC4899', '84CC16'];
    const colorIndex = (company.id || 0) % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${colors[colorIndex]}&color=fff`;
  };

  // Normalize company data from backend
  const normalizeCompany = (company) => {
    return {
      id: company.id,
      name: company.name || company.company_name || 'N/A',
      status: company.verification_status || 'verified',
      email: company.email || company.contact_email || 'N/A',
      website: company.website || 'N/A',
      location: company.location || company.city || 'N/A',
      joinedDate: formatDate(company.created_at),
      activeTime: getTimeAgo(company.updated_at || company.created_at),
      activeJobs: company.active_jobs_count || 0,
      employees: company.size || company.employee_count || 0,
      rating: company.rating || 0,
      industry: company.industry || 'N/A',
      tags: company.tags || [],
      logo: getCompanyLogo(company),
      description: company.description || '',
      founded_year: company.founded_year || null
    };
  };

  // Get companies data
  const companies = verifiedCompanies ? verifiedCompanies.map(normalizeCompany) : [];

  // Calculate stats
  const totalCompanies = companies.length;
  const verifiedCount = companies.filter(c => c.status === 'verified').length;
  const blockedCount = companies.filter(c => c.status === 'blocked').length; // For future use

  const stats = [
    { 
      label: 'Total Companies', 
      count: totalCompanies,
      change: 'All companies',
    },
    { 
      label: 'Verified', 
      count: verifiedCount,
      change: 'Active verified',
    },
    { 
      label: 'Blocked', 
      count: blockedCount,
      change: 'Temporarily blocked',
    }
  ];

  // Get unique industries
  const industries = ['all', ...new Set(companies.map(c => c.industry).filter(i => i && i !== 'N/A'))];

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter;
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetail = async (companyId) => {
      console.log(`Viewing company ${companyId}`);
      
      // Dispatch action to fetch and set the selected company in Redux
      await dispatch(fetchCompanyById(companyId));
      
      // Then navigate to the detail page
      navigate(`/admin/company-detail/${companyId}`);
    };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'verified':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-teal-100 text-teal-700 rounded">
            <BadgeCheck size={14} />
            Verified
          </span>
        );
      case 'blocked':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
            <AlertCircle size={14} />
            Blocked
          </span>
        );
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => dispatch(fetchVerifiedCompanies())}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Retry
          </button>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        {/* Header with Filters */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Companies
          </h2>
          
          <div className="flex items-center space-x-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="blocked">Blocked</option>
            </select>

            {/* Industry Filter */}
            <select
              value={industryFilter}
              onChange={(e) => {
                setIndustryFilter(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">All Industries</option>
              {industries.filter(i => i !== 'all').map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            {/* More Filters Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              More Filters
            </button>
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

        {/* Companies List */}
        {currentCompanies.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No companies found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentCompanies.map((company) => (
              <div key={company.id} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  {/* Left Section - Company Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-base font-semibold text-gray-900">
                          {company.name}
                        </h3>
                        {getStatusBadge(company.status)}
                      </div>
                      
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {company.email}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {company.location}
                        </span>
                        {company.website !== 'N/A' && (
                          <a 
                            href={`https://${company.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:underline"
                          >
                            <Globe className="w-3 h-3 mr-1" />
                            {company.website}
                          </a>
                        )}
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Joined {company.joinedDate}</span>
                        <span className="mx-2">•</span>
                        <span>Active {company.activeTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Section - Stats */}
                  <div className="flex items-center space-x-6 px-6">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">Active Jobs: {company.activeJobs}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">Employees: {company.employees}</div>
                    </div>
                    {company.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">{company.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={()=>handleViewDetail(company.id)}
                      className="px-3 py-1.5 text-xs font-medium bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors">
                      Company Details
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                      Recruiter Details
                    </button>
                  </div>
                </div>

                {/* Tags Section */}
                {(company.industry !== 'N/A' || company.tags.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                    {company.industry !== 'N/A' && (
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {company.industry}
                      </span>
                    )}
                    {company.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredCompanies.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredCompanies.length}
            startIndex={startIndex}
          />
        )}
      </div>
    </div>
  );
};

export default AdminCompanyManagement;