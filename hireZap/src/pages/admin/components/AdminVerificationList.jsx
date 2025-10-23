import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, MoreVertical, MapPin, Globe, Calendar, Users, Star, Briefcase, Eye, BadgeCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingCompanies, fetchVerifiedCompanies, fetchRejectedCompanies } from '../../../redux/slices/companySlice';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const CompanyVerificationManagement = () => {
  const [activeFilter, setActiveFilter] = useState('pending');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(fetchPendingCompanies());
    dispatch(fetchVerifiedCompanies());
    dispatch(fetchRejectedCompanies());
  }, [dispatch]);

  // Fetch data when filter changes
  useEffect(() => {
    if (activeFilter === 'pending') {
      dispatch(fetchPendingCompanies());
    } else if (activeFilter === 'verified') {
      dispatch(fetchVerifiedCompanies());
    } else if (activeFilter === 'rejected') {
      dispatch(fetchRejectedCompanies());
    }
  }, [activeFilter, dispatch]);

  const { pendingCompanies, verifiedCompanies, rejectedCompanies, loading, error } = useSelector((state) => state.company);

  useEffect(() => {
    if (pendingCompanies) {
      console.log("company data", pendingCompanies);
      console.log("Is array?", Array.isArray(pendingCompanies));
      console.log("Length:", pendingCompanies?.length);
    }
  }, [pendingCompanies]);

  // Helper function to format date
  const formatJoinedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  // SAFETY CHECK: Get the correct data based on active filter
  const getActiveCompanies = () => {
    if (activeFilter === 'pending') {
      return Array.isArray(pendingCompanies) ? pendingCompanies : [];
    } else if (activeFilter === 'verified') {
      return Array.isArray(verifiedCompanies) ? verifiedCompanies : [];
    } else if (activeFilter === 'rejected') {
      return Array.isArray(rejectedCompanies) ? rejectedCompanies : [];
    }
    return [];
  };

  const companiesList = getActiveCompanies();

  // Map backend data to frontend format
  const verificationRequests = companiesList.map((company) => ({
    id: company.id,
    companyName: company.company_name,
    email: company.business_email,
    website: company.website,
    location: company.address,
    joinedDate: formatJoinedDate(company.created_at),
    activeTime: getTimeAgo(company.updated_at),
    status: company.verification_status,
    statusLabel: company.verification_status.charAt(0).toUpperCase() + company.verification_status.slice(1),
    statusColor: 
      company.verification_status === 'pending' 
        ? 'bg-yellow-100 text-yellow-700'
        : company.verification_status === 'verified'
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700',
    logoUrl: company.logo_url,
    industry: company.industry,
    companySize: company.company_size,
    phoneNumber: company.phone_number,
    linkedinUrl: company.linkedin_url,
    description: company.description,
    foundedYear: company.founded_year,
    businessCertificate: company.business_certificate,
    activeJobs: 0,
    employees: company.company_size,
    rating: 0,
  }));

  // Calculate stats - use all data for counts
  const allPendingCompanies = Array.isArray(pendingCompanies) ? pendingCompanies : [];
  const allVerifiedCompanies = Array.isArray(verifiedCompanies) ? verifiedCompanies : [];
  const allRejectedCompanies = Array.isArray(rejectedCompanies) ? rejectedCompanies : [];

  const stats = [
    { 
      label: 'Pending', 
      count: allPendingCompanies.filter(r => r.verification_status === 'pending').length, 
      icon: Clock, 
      active: activeFilter === 'pending',
      filter: 'pending'
    },
    { 
      label: 'Approved', 
      count: allVerifiedCompanies.filter(r => r.verification_status === 'verified').length, 
      icon: CheckCircle, 
      active: activeFilter === 'verified',
      filter: 'verified'
    },
    { 
      label: 'Rejected', 
      count: allRejectedCompanies.filter(r => r.verification_status === 'rejected').length, 
      icon: XCircle, 
      active: activeFilter === 'rejected',
      filter: 'rejected'
    }
  ];

  // Filter requests based on active filter - already filtered by getActiveCompanies
  const filteredRequests = verificationRequests;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verification requests...</p>
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
              onClick={() => setActiveFilter(stat.filter)}
              className={`flex-1 cursor-pointer ${
                index !== stats.length - 1 ? 'border-r border-gray-200' : ''
              } ${stat.active ? 'bg-gray-50' : ''}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <stat.icon className={`w-4 h-4 ${stat.active ? 'text-teal-500' : 'text-gray-400'}`} />
                <div className="text-center">
                  <div className="text-xs text-gray-500">{stat.label}</div>
                  <div className={`text-2xl font-semibold ${stat.active ? 'text-teal-600' : 'text-gray-900'}`}>
                    {stat.count}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Request Section */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Request</h2>

        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              {activeFilter === 'pending' && 'No pending verification requests'}
              {activeFilter === 'verified' && 'No verified companies'}
              {activeFilter === 'rejected' && 'No rejected companies'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  {/* Left Section - Company Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={request.logoUrl || `https://ui-avatars.com/api/?name=${request.companyName}&background=random`}
                      alt={request.companyName}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${request.companyName}&background=random`;
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">
                          {request.companyName}
                        </h3>

                        {request.status === 'verified' && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded-full border border-green-200">
                            <BadgeCheck size={14} className="text-green-600" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <span className="mr-1">✉</span> {request.email}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {request.location}
                        </span>
                        {request.website && (
                          <a 
                            href={request.website.startsWith('http') ? request.website : `https://${request.website}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:underline"
                          >
                            <Globe className="w-3 h-3 mr-1" />
                            {request.website.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                          </a>
                        )}
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Joined {request.joinedDate}</span>
                        <span className="mx-2">•</span>
                        <span>Active {request.activeTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Status and Actions */}
                  <div className="flex items-center space-x-3">
                    {request.status === 'pending' && (
                      <>
                        <span className={`px-3 py-1 text-xs font-medium rounded ${request.statusColor}`}>
                          {request.statusLabel}
                        </span>
                        <button 
                          onClick={() => navigate(`/admin/company-detail/${request.id}`)}
                          className="px-3 py-1.5 text-xs font-medium bg-teal-100 text-teal-700 rounded hover:bg-teal-200"
                        >
                          View Detail
                        </button>
                        <button className="px-4 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200">
                          Reject
                        </button>
                        <button className="px-4 py-1.5 text-xs font-medium bg-teal-500 text-white rounded hover:bg-teal-600">
                          Approve
                        </button>
                      </>
                    )}
                    {(request.status === 'verified' || request.status === 'rejected') && (
                      <button 
                          onClick={() => navigate(`/admin/company-detail/${request.id}`)}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-teal-100 text-teal-700 rounded hover:border border-teal-700 cursor-pointer"
                        >
                          <Eye size={14} className="text-teal-700" />
                          View Detail
                      </button>
                    )}
                  </div>
                </div>

                {/* Additional Info for Verified Companies */}
                {request.status === 'verified' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-8 text-sm">
                        <div>
                          <span className="text-gray-500">Active Jobs: </span>
                          <span className="font-semibold text-gray-900">{request.activeJobs}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Company Size: </span>
                          <span className="font-semibold text-gray-900">{request.employees}</span>
                        </div>
                        {request.rating > 0 && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="font-semibold text-gray-900">{request.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        {request.industry && (
                          <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                            {request.industry}
                          </span>
                        )}
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Industry Tag for Pending */}
                {request.status === 'pending' && request.industry && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                      {request.industry}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper components for icons
const Clock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default CompanyVerificationManagement;