import React, { useState } from 'react';
import { Search, MapPin, Calendar, Briefcase, DollarSign, Users, Eye, X, ChevronLeft, ChevronRight, Building2, Clock } from 'lucide-react';
import Pagination from '../../../components/Pagination';

// Company Search Modal
const CompanySearchModal = ({ isOpen, onClose, companies, onSelectCompany, selectedCompany }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Company</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            autoFocus
          />
        </div>

        {/* Companies List */}
        <div className="max-h-96 overflow-y-auto space-y-2">
          <button
            onClick={() => {
              onSelectCompany(null);
              onClose();
            }}
            className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
              !selectedCompany ? 'bg-teal-50 border border-teal-200' : 'border border-gray-200'
            }`}
          >
            <div className="font-medium text-gray-900">All Companies</div>
            <div className="text-xs text-gray-500">Show all job posts</div>
          </button>

          {filteredCompanies.map((company) => (
            <button
              key={company.id}
              onClick={() => {
                onSelectCompany(company);
                onClose();
              }}
              className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
                selectedCompany?.id === company.id ? 'bg-teal-50 border border-teal-200' : 'border border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img src={company.logo} alt={company.name} className="w-10 h-10 rounded-lg" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{company.name}</div>
                  <div className="text-xs text-gray-500">{company.industry}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mock data
const mockCompanies = [
  { id: 1, name: 'NovaTech Labs', industry: 'SaaS', logo: 'https://ui-avatars.com/api/?name=NovaTech+Labs&background=4F46E5&color=fff' },
  { id: 2, name: 'GreenLeaf Health', industry: 'Healthcare', logo: 'https://ui-avatars.com/api/?name=GreenLeaf+Health&background=10B981&color=fff' },
  { id: 3, name: 'UrbanBuild Co.', industry: 'Construction', logo: 'https://ui-avatars.com/api/?name=UrbanBuild+Co&background=F59E0B&color=fff' },
  { id: 4, name: 'SkyRoute Logistics', industry: 'Logistics', logo: 'https://ui-avatars.com/api/?name=SkyRoute+Logistics&background=3B82F6&color=fff' },
  { id: 5, name: 'Artify Studios', industry: 'Design', logo: 'https://ui-avatars.com/api/?name=Artify+Studios&background=EC4899&color=fff' },
];

const mockJobPosts = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    company: mockCompanies[0],
    companyId: 1,
    recruiterName: 'Sarah Mitchell',
    location: 'San Francisco, CA',
    workType: 'Remote',
    employmentType: 'Full-time',
    salary: '$160k-$200k',
    experienceLevel: 'Mid-Senior level',
    postedDate: '2d ago',
    applications: 42,
    views: 1200,
    status: 'active',
    industry: 'SaaS'
  },
  {
    id: 2,
    title: 'Product Designer',
    company: mockCompanies[4],
    companyId: 5,
    recruiterName: 'Michael Chen',
    location: 'New York, NY',
    workType: 'Hybrid',
    employmentType: 'Contract',
    salary: '$90k-$120k',
    experienceLevel: 'Mid level',
    postedDate: '5d ago',
    applications: 18,
    views: 640,
    status: 'pending',
    industry: 'Design'
  },
  {
    id: 3,
    title: 'Data Analyst',
    company: mockCompanies[1],
    companyId: 2,
    recruiterName: 'Emily Rodriguez',
    location: 'Austin, TX',
    workType: 'Onsite',
    employmentType: 'Full-time',
    salary: '$80k-$100k',
    experienceLevel: 'Entry-Mid level',
    postedDate: '1w ago',
    applications: 7,
    views: 210,
    status: 'rejected',
    industry: 'Healthcare'
  },
  {
    id: 4,
    title: 'Backend Engineer',
    company: mockCompanies[3],
    companyId: 4,
    recruiterName: 'David Kim',
    location: 'Seattle, WA',
    workType: 'Remote',
    employmentType: 'Full-time',
    salary: '$150k-$190k',
    experienceLevel: 'Senior level',
    postedDate: '3d ago',
    applications: 30,
    views: 980,
    status: 'under-review',
    industry: 'Logistics'
  },
  {
    id: 5,
    title: 'Customer Success Manager',
    company: mockCompanies[0],
    companyId: 1,
    recruiterName: 'Sarah Mitchell',
    location: 'Boston, MA',
    workType: 'Hybrid',
    employmentType: 'Full-time',
    salary: '$95k-$115k',
    experienceLevel: 'Mid level',
    postedDate: '4d ago',
    applications: 22,
    views: 530,
    status: 'active',
    industry: 'SaaS'
  },
  {
    id: 6,
    title: 'Machine Learning Engineer',
    company: mockCompanies[0],
    companyId: 1,
    recruiterName: 'Sarah Mitchell',
    location: 'Remote',
    workType: 'Remote',
    employmentType: 'Contract',
    salary: '$120/hr',
    experienceLevel: 'Senior level',
    postedDate: '1d ago',
    applications: 10,
    views: 410,
    status: 'pending',
    industry: 'SaaS'
  }
];

const AdminJobPostManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate stats
  const totalJobs = mockJobPosts.length;
  const activeJobs = mockJobPosts.filter(j => j.status === 'active').length;
  const pendingJobs = mockJobPosts.filter(j => j.status === 'pending').length;
  const underReviewJobs = mockJobPosts.filter(j => j.status === 'under-review').length;

  const stats = [
    { label: 'Total Job Posts', count: totalJobs, change: 'All posts' },
    { label: 'Active', count: activeJobs, change: 'Currently live' },
    { label: 'Pending Review', count: pendingJobs, change: 'Awaiting approval' },
    { label: 'Under Review', count: underReviewJobs, change: 'Being reviewed' }
  ];

  // Get unique industries
  const industries = ['all', ...new Set(mockJobPosts.map(j => j.industry))];

  // Filter job posts
  const filteredJobs = mockJobPosts.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.recruiterName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || job.industry === industryFilter;
    const matchesCompany = !selectedCompany || job.companyId === selectedCompany.id;
    return matchesSearch && matchesStatus && matchesIndustry && matchesCompany;
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
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
      'under-review': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Under Review' }
    };
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

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
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Industry Filter */}
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {industries.filter(i => i !== 'all').map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            {/* Company Filter Button */}
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
                  }}
                />
              )}
            </button>

            {/* More Filters */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              More Filters
            </button>
          </div>
        </div>

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
                  {/* Left Section - Job Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <img src={job.company.logo} alt={job.company.name} className="w-12 h-12 rounded-lg" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
                        {getStatusBadge(job.status)}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">{job.company.name}</span>
                      </div>

                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {job.workType}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {job.employmentType}
                        </span>
                      </div>

                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {job.salary}
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {job.experienceLevel}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {job.applications} applications
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {job.views} views
                        </span>
                      </div>

                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Posted {job.postedDate}</span>
                        <span className="mx-2">•</span>
                        <span>By {job.recruiterName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
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

        {/* Pagination */}
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

      {/* Company Search Modal */}
      <CompanySearchModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        companies={mockCompanies}
        onSelectCompany={setSelectedCompany}
        selectedCompany={selectedCompany}
      />
    </div>
  );
};

export default AdminJobPostManagement;