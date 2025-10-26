import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Calendar, Eye, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../components/Pagination';

// Mock data - replace with your Redux data
const mockRecruiters = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: 'Sarah Mitchell',
  email: 'sarah.mitchell@techcorp.com',
  location: 'San Jose, CA',
  experience: '5 years',
  joinedDate: '2 hours ago',
  jobPosts: 12,
  hirings: 48,
  status: 'active',
  avatar: `https://ui-avatars.com/api/?name=Sarah+Mitchell&background=random&seed=${i}`
}));

const AdminRecruiterManagement = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate stats
    const totalRecruiters = mockRecruiters.length;
    const activeRecruiters = mockRecruiters.filter(r => r.status === 'active').length;
    const totalJobs = mockRecruiters.reduce((sum, r) => sum + r.jobPosts, 0);
    const totalHirings = mockRecruiters.reduce((sum, r) => sum + r.hirings, 0);

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
      change: '85% active rate',
      isPositive: true
    },
    { 
      label: 'Total Jobs', 
      count: totalJobs,
      change: '+8 this month',
      isPositive: true
    },
    { 
      label: 'Total job postings', 
      count: totalHirings,
      change: '30 active posts',
      isPositive: true
    }
  ];

  // Filter and search recruiters
  const filteredRecruiters = mockRecruiters.filter(recruiter => {
    const matchesSearch = recruiter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recruiter.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || recruiter.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecruiters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecruiters = filteredRecruiters.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {/* Header with Search and Sort */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recruiters ({filteredRecruiters.length})
          </h2>
          
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search recruiters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
            >
              <option value="recent">Sort by: Recent</option>
              <option value="name">Sort by: Name</option>
              <option value="posts">Sort by: Job Posts</option>
              <option value="hirings">Sort by: Hirings</option>
            </select>
          </div>
        </div>

        {/* Recruiters List */}
        {currentRecruiters.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No recruiters found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentRecruiters.map((recruiter) => (
              <div key={recruiter.id} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  {/* Left Section - Recruiter Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={recruiter.avatar}
                      alt={recruiter.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">
                          {recruiter.name}
                        </h3>
                        <span className="text-xs text-gray-500">{recruiter.joinedDate}</span>
                      </div>
                      
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <span className="mr-1">✉</span> {recruiter.email}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {recruiter.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {recruiter.experience}
                        </span>
                      </div>

                      <div className="flex items-center space-x-6 text-sm">
                        <div>
                          <span className="text-gray-500">12 job posts</span>
                        </div>
                        <div>
                          <span className="text-gray-500">48 hirings</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-teal-100 text-teal-700 rounded hover:bg-teal-200">
                      Company Details
                    </button>
                    
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                      active
                    </span>

                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredRecruiters.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredRecruiters.length}
            startIndex={startIndex}
          />
        )}
      </div>
    </div>
  );
};

export default AdminRecruiterManagement;