import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Globe, Users, Calendar, Verified, Edit, AlertTriangle, Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { fetchCompany } from '../../../redux/slices/companySlice';

const CompanyDetails = () => {
  const dispatch = useDispatch();
  const { openCompanyModal } = useOutletContext();
  const { company, hasCompany, isLoading } = useSelector((state) => state.company);

  useEffect(() => {
    // Fetch company details when component mounts
    dispatch(fetchCompany());
  }, [dispatch]);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading company details...</p>
        </div>
      </div>
    );
  }

  // Empty state when no company details are added or not verified
  if (!hasCompany || !company || company.verification_status === 'pending') {
    const isPending = company?.verification_status === 'pending';
    
    return (
      <div className="max-w-4xl mx-auto">
        {/* Verification Notice */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              {isPending ? 'Verification Pending' : 'Verification Required'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isPending 
                ? 'Your company details are under review by our admin team. You will be notified once verified.'
                : 'Your Company must be verified by our admin team before you can post job listings. Please provide accurate information.'}
            </p>
          </div>
        </div>

        {/* Empty State or Pending State Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            {/* Icon */}
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {isPending ? (
                <Calendar className="w-10 h-10 text-amber-500" />
              ) : (
                <Globe className="w-10 h-10 text-slate-400" />
              )}
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              {isPending ? 'Verification in Progress' : 'Add Your Company Details'}
            </h2>

            {/* Description */}
            <p className="text-slate-600 mb-8 leading-relaxed">
              {isPending 
                ? 'Your company information has been submitted successfully. Our admin team is currently reviewing your details. This typically takes 1-2 business days.'
                : 'Get started by adding your company information. Once submitted, our admin team will review and verify your details. You\'ll be able to post job listings after verification.'}
            </p>

            {/* Action Button */}
            {!isPending && (
              <>
                <button
                  onClick={openCompanyModal}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Company Details</span>
                </button>

                {/* Helper Text */}
                <p className="text-xs text-slate-500 mt-6">
                  Verification typically takes 1-2 business days
                </p>
              </>
            )}

            {isPending && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Submitted on:</strong> {new Date(company.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Rejected state
  if (company.verification_status === 'rejected') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              Verification Rejected
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              Your company verification was rejected. Please review the reason below and resubmit with correct information.
            </p>
            {company.rejection_reason && (
              <div className="mt-2 p-3 bg-white rounded border border-red-200">
                <p className="text-sm text-slate-700">
                  <strong>Reason:</strong> {company.rejection_reason}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <button
            onClick={openCompanyModal}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Update Company Details</span>
          </button>
        </div>
      </div>
    );
  }

  // Verified company details view
  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-lg shadow-lg border border-slate-200 bg-white/80 backdrop-blur-sm">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {/* Company Logo */}
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                {company.logo_url ? (
                  <img 
                    src={company.logo_url} 
                    alt={company.company_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                    {company.company_name?.charAt(0) || 'C'}
                  </div>
                )}
              </div>

              {/* Company Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-xl font-semibold text-slate-900">{company.company_name}</h2>
                  {company.verification_status === 'verified' && (
                    <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                      <Verified className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
                      
                <div className="space-y-1 text-sm text-slate-600">
                  <p><span className="font-medium">Industry:</span> {company.industry}</p>
                  <p><span className="font-medium">Company Size:</span> {company.company_size}</p>
                  {company.website && (
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={openCompanyModal}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-teal-600 hover:text-teal-700 border border-teal-200 hover:border-teal-300 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>

        {/* Company Description */}
        {company.description && (
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-medium text-slate-900 mb-2">About Company</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{company.description}</p>
          </div>
        )}

        {/* Additional Details */}
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-medium text-slate-900 mb-3">Company Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {company.founded_year && (
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">Founded in {company.founded_year}</span>
              </div>
            )}
                  
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">{company.company_size}</span>
            </div>

            {company.address && (
              <div className="flex items-center space-x-2 text-sm md:col-span-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{company.address}</span>
              </div>
            )}

            <div className="flex items-center space-x-2 text-sm">
              <span className="text-slate-600">📧 {company.business_email}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <span className="text-slate-600">📞 {company.phone_number}</span>
            </div>
          </div>
        </div>

        {/* Map Section */}
        {company.latitude && company.longitude && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-900">Location</h3>
              <span className="text-xs text-slate-500">
                Coordinates: {parseFloat(company.latitude).toFixed(4)}, {parseFloat(company.longitude).toFixed(4)}
              </span>
            </div>
            <div className="w-full">
              <div style={{
                width: '100%',
                height: '200px',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: '#14b8a6',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '3px solid white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  background: 'rgba(255,255,255,0.9)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  📍 {company.address}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;