import React, { useState } from 'react';
import { Search, MapPin, Calendar, Globe, Mail, Star, ChevronLeft, ChevronRight, BadgeCheck, AlertCircle, Clock } from 'lucide-react';
import Pagination from '../../../components/Pagination';

// Mock data - replace with your Redux data
const mockCompanies = [
  {
    id: 1,
    name: 'NovaTech Labs',
    status: 'verified',
    email: 'contact@novatech.com',
    website: 'novatech.com',
    location: 'San Francisco, CA',
    joinedDate: 'Jan 2023',
    activeTime: '2h ago',
    activeJobs: 12,
    employees: 240,
    rating: 4.7,
    industry: 'SaaS',
    tags: ['AI'],
    logo: 'https://ui-avatars.com/api/?name=NovaTech+Labs&background=4F46E5&color=fff'
  },
  {
    id: 2,
    name: 'GreenLeaf Health',
    status: 'verified',
    email: 'hello@greenleaf.com',
    website: 'greenleaf.com',
    location: 'Austin, TX',
    joinedDate: 'Sep 2022',
    activeTime: '1d ago',
    activeJobs: 4,
    employees: 80,
    rating: 4.3,
    industry: 'Healthcare',
    tags: [],
    logo: 'https://ui-avatars.com/api/?name=GreenLeaf+Health&background=10B981&color=fff'
  },
  {
    id: 3,
    name: 'UrbanBuild Co.',
    status: 'pending',
    email: 'info@urbanbuild.com',
    website: 'urbanbuild.com',
    location: 'Denver, CO',
    joinedDate: 'May 2021',
    activeTime: '3d ago',
    activeJobs: 0,
    employees: 410,
    rating: 4.1,
    industry: 'Construction',
    tags: [],
    logo: 'https://ui-avatars.com/api/?name=UrbanBuild+Co&background=F59E0B&color=fff'
  },
  {
    id: 4,
    name: 'SkyRoute Logistics',
    status: 'verified',
    email: 'team@skyroute.io',
    website: 'skyroute.io',
    location: 'Seattle, WA',
    joinedDate: 'Nov 2020',
    activeTime: '5h ago',
    activeJobs: 6,
    employees: 160,
    rating: 4.5,
    industry: 'Logistics',
    tags: [],
    logo: 'https://ui-avatars.com/api/?name=SkyRoute+Logistics&background=3B82F6&color=fff'
  },
  {
    id: 5,
    name: 'Artify Studios',
    status: 'suspended',
    email: 'hello@artify.co',
    website: 'artify.co',
    location: 'Brooklyn, NY',
    joinedDate: 'Feb 2024',
    activeTime: '30m ago',
    activeJobs: 2,
    employees: 24,
    rating: 4.9,
    industry: 'Design',
    tags: ['Creative'],
    logo: 'https://ui-avatars.com/api/?name=Artify+Studios&background=EC4899&color=fff'
  },
  {
    id: 6,
    name: 'FarmFresh Co.',
    status: 'verified',
    email: 'contact@farmfresh.co',
    website: 'farmfresh.co',
    location: 'Boise, ID',
    joinedDate: 'Aug 2023',
    activeTime: '4d ago',
    activeJobs: 1,
    employees: 52,
    rating: 4.0,
    industry: 'Agriculture',
    tags: ['D2C'],
    logo: 'https://ui-avatars.com/api/?name=FarmFresh+Co&background=84CC16&color=fff'
  }
];

const AdminCompanyManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate stats
  const totalCompanies = mockCompanies.length;
  const verifiedCompanies = mockCompanies.filter(c => c.status === 'verified').length;
  const pendingCompanies = mockCompanies.filter(c => c.status === 'pending').length;
  const suspendedCompanies = mockCompanies.filter(c => c.status === 'suspended').length;

  const stats = [
    { 
      label: 'Total Companies', 
      count: totalCompanies,
      change: 'All companies',
    },
    { 
      label: 'Verified', 
      count: verifiedCompanies,
      change: 'Active verified',
    },
    { 
      label: 'Pending', 
      count: pendingCompanies,
      change: 'Awaiting review',
    },
    { 
      label: 'Suspended', 
      count: suspendedCompanies,
      change: 'Temporarily disabled',
    }
  ];

  // Get unique industries
  const industries = ['all', ...new Set(mockCompanies.map(c => c.industry))];

  // Filter companies
  const filteredCompanies = mockCompanies.filter(company => {
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

  const getStatusBadge = (status) => {
    switch(status) {
      case 'verified':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-teal-100 text-teal-700 rounded">
            <BadgeCheck size={14} />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
            <Clock size={14} />
            Pending
          </span>
        );
      case 'suspended':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
            <AlertCircle size={14} />
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* Industry Filter */}
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
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
                        <a 
                          href={`https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <Globe className="w-3 h-3 mr-1" />
                          {company.website}
                        </a>
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
                    <button className="px-3 py-1.5 text-xs font-medium bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors">
                      Company Details
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                      Recruiter Details
                    </button>
                  </div>
                </div>

                {/* Tags Section */}
                {(company.industry || company.tags.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                      {company.industry}
                    </span>
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