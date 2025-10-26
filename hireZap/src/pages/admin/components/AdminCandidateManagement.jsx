import React, { useState } from 'react';
import { Search, MapPin, Calendar, MoreVertical, ChevronLeft, ChevronRight, Briefcase, FileText } from 'lucide-react';
import Pagination from '../../../components/Pagination';

// Mock data - replace with your Redux data
// Only candidates (Job Seekers), no recruiters
const mockCandidates = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    location: 'San Jose, CA',
    joinedDate: 'Sep 2023',
    role: 'Job Seeker',
    status: 'Active',
    applications: 12,
    activeJobs: 14,
    activeDays: 7,
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=random'
  },
  {
    id: 2,
    name: 'Maria Gomez',
    email: 'maria.gomez@example.com',
    location: 'New York, NY',
    joinedDate: 'July 2024',
    role: 'Job Seeker',
    status: 'Active',
    applications: 5,
    activeJobs: 8,
    activeDays: 3,
    avatar: 'https://ui-avatars.com/api/?name=Maria+Gomez&background=random'
  },
  {
    id: 3,
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    location: 'Delhi, IN',
    joinedDate: 'Sep 2023',
    role: 'Job Seeker',
    status: 'Active',
    applications: 8,
    activeJobs: 17,
    activeDays: 1,
    avatar: 'https://ui-avatars.com/api/?name=Priya+Singh&background=random'
  },
  {
    id: 4,
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@example.com',
    location: 'Dublin, IE',
    joinedDate: 'Feb 2020',
    role: 'Job Seeker',
    status: 'Active',
    applications: 9,
    activeJobs: 14,
    activeDays: 2,
    avatar: 'https://ui-avatars.com/api/?name=Liam+Oconnor&background=random'
  },
  {
    id: 5,
    name: 'Sofia Rossi',
    email: 'sofia.rossi@example.com',
    location: 'Milan, IT',
    joinedDate: 'May 2022',
    role: 'Job Seeker',
    status: 'Active',
    applications: 6,
    activeJobs: 11,
    activeDays: 1,
    avatar: 'https://ui-avatars.com/api/?name=Sofia+Rossi&background=random'
  },
  {
    id: 6,
    name: 'Kenji Tanaka',
    email: 'kenji.tanaka@example.com',
    location: 'Tokyo, JP',
    joinedDate: 'Sep 2023',
    role: 'Job Seeker',
    status: 'Active',
    applications: 8,
    activeJobs: 15,
    activeDays: 0,
    avatar: 'https://ui-avatars.com/api/?name=Kenji+Tanaka&background=random'
  },
  {
    id: 7,
    name: 'Daniel Müller',
    email: 'daniel.muller@example.com',
    location: 'Berlin, DE',
    joinedDate: 'Feb 2023',
    role: 'Job Seeker',
    status: 'Active',
    applications: 10,
    activeJobs: 12,
    activeDays: 2,
    avatar: 'https://ui-avatars.com/api/?name=Daniel+Muller&background=random'
  },
  {
    id: 8,
    name: 'Aisha Khan',
    email: 'aisha.khan@example.com',
    location: 'Dubai, AE',
    joinedDate: 'Nov 2023',
    role: 'Job Seeker',
    status: 'Active',
    applications: 7,
    activeJobs: 9,
    activeDays: 3,
    avatar: 'https://ui-avatars.com/api/?name=Aisha+Khan&background=random'
  }
];

const AdminCandidateManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate stats
  const totalCandidates = mockCandidates.length;
  const activeCandidates = mockCandidates.filter(c => c.status === 'Active').length;
  const totalApplications = mockCandidates.reduce((sum, c) => sum + c.applications, 0);
  const recruiters = mockCandidates.filter(c => c.status === 'Recruiter').length;

  const stats = [
    { 
      label: 'All Users', 
      count: totalCandidates,
      change: 'All Status',
      isPositive: true
    },
    { 
      label: 'All Roles', 
      count: activeCandidates,
      change: 'All Filters',
      isPositive: true
    }
  ];

  // Filter and search candidates
  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || candidate.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

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
        {/* Header with Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Users
          </h2>
        </div>

        {/* Candidates List */}
        {currentCandidates.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No candidates found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentCandidates.map((candidate) => (
              <div key={candidate.id} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  {/* Left Section - Candidate Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">
                          {candidate.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          ✉ {candidate.email}
                        </span>
                      </div>

                      <div className="flex items-center flex-wrap gap-x-6 gap-y-2">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {candidate.location}
                          </span>
                          <span className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            Joined {candidate.joinedDate}
                          </span>
                          <span className="flex items-center text-sm text-gray-600">
                            <span className="mr-1">⚡</span>
                            Active {candidate.activeDays}d ago
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Section - Role Badge */}
                  <div className="flex items-start px-4">
                    {candidate.status === 'Active' && (
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                        {candidate.role}
                      </span>
                    )}
                    {candidate.status === 'Recruiter' && (
                      <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded">
                        {candidate.role}
                      </span>
                    )}
                  </div>

                  {/* Right Section - Stats and Actions */}
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-center">
                      <FileText className="w-4 h-4 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">{candidate.applications}</span>
                      <span className="text-xs text-gray-500">Applications</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Briefcase className="w-4 h-4 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">{candidate.activeJobs}</span>
                      <span className="text-xs text-gray-500">Active jobs</span>
                    </div>
                    
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
        {filteredCandidates.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredCandidates.length}
            startIndex={startIndex}
          />
        )}
      </div>
    </div>
  );
};

export default AdminCandidateManagement;