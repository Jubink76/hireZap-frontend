
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MapPin, Globe, Users, Calendar, ArrowLeft, 
  CheckCircle, XCircle, Building2, Mail, Phone,
  FileText, ExternalLink, User, Briefcase, BadgeCheck, Clock
} from 'lucide-react';
import { approveCompany, fetchCompanyById, rejectCompany } from '../../../redux/slices/companySlice';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const AdminCompanyDetail = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get company data from Redux or fetch it
  const { selectedCompany, loading, error } = useSelector((state) => state.company);
  const company = selectedCompany;

  useEffect(() => {
    // If company not in state, fetch it
    if (!company && !loading) {
      dispatch(fetchCompanyById(companyId))
    }
  }, [dispatch, companyId]);

  const handleApprove = async () => {
    if (window.confirm('Are you sure you want to approve this company?')) {
      setIsProcessing(true);
      try {
        // TODO: Dispatch approve action
        // await dispatch(approveCompany(companyId));
        await dispatch(approveCompany(companyId)).unwrap()
        console.log('Approving company:', companyId);
        // navigate('/admin/verification');
      } catch (error) {
        console.error('Error approving company:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    setIsProcessing(true);
    try {
      // TODO: Dispatch reject action
      // await dispatch(rejectCompany({ companyId, reason: rejectionReason }));
      await dispatch(rejectCompany({companyId,reason:rejectionReason })).unwrap()
      console.log('Rejecting company:', companyId, rejectionReason);
      setShowRejectModal(false);
      // navigate('/admin/verification');
    } catch (error) {
      console.error('Error rejecting company:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const markerIcon = new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/company-verifications')}
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Company not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/company-verifications')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Verification List</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border
                ${
                  company.verification_status === 'pending'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : company.verification_status === 'verified'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
            >
              {company.verification_status === 'verified' && (
                <BadgeCheck size={14} className="text-green-600" />
              )}
              {company.verification_status === 'pending' && (
                <Clock size={13} className="text-yellow-600" />
              )}
              {company.verification_status === 'rejected' && (
                <XCircle size={13} className="text-red-600" />
              )}
              <span>
                {company.verification_status.charAt(0).toUpperCase() +
                  company.verification_status.slice(1)}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4 mb-6">
                {/* Company Logo */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {company.logo_url ? (
                    <img 
                      src={company.logo_url} 
                      alt={company.company_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl">
                      {company.company_name?.charAt(0) || 'C'}
                    </div>
                  )}
                </div>

                {/* Company Name and Industry */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {company.company_name}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded">
                      {company.industry}
                    </span>
                    <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {company.company_size}
                    </span>
                    {company.founded_year && (
                      <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Est. {company.founded_year}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {company.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">About Company</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{company.description}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
                
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{company.business_email}</span>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{company.phone_number}</span>
                </div>

                {company.website && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a 
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline flex items-center"
                    >
                      {company.website.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}

                {company.linkedin_url && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <a 
                      href={company.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline flex items-center"
                    >
                      LinkedIn Profile
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}

                {company.address && (
                  <div className="flex items-start space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">{company.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Business Certificate */}
            {company.business_certificate && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Business Certificate
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={company.business_certificate} 
                    alt="Business Certificate"
                    className="w-full h-auto"
                  />
                </div>
                <a    
                  href={company.business_certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center text-sm text-teal-600 hover:text-teal-700"
                >
                  View Full Size
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}

            {/* Location Map */}
            {company.latitude && company.longitude && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-900">Location</h3>
                  <span className="text-xs text-slate-500">
                    Coordinates: {parseFloat(company.latitude).toFixed(4)}, {parseFloat(company.longitude).toFixed(4)}
                  </span>
                </div>
              
                <div className="w-full h-[300px] rounded-lg overflow-hidden border border-slate-200">
                  <MapContainer
                    center={[parseFloat(company.latitude), parseFloat(company.longitude)]}
                    zoom={15}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    />
                    <Marker
                      position={[parseFloat(company.latitude), parseFloat(company.longitude)]}
                      icon={markerIcon}
                    >
                      <Popup>
                        {company.company_name} <br /> {company.address}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Recruiter Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Recruiter Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Recruiter ID:</span>
                  <p className="text-gray-900 font-medium">#{company.recruiter_id}</p>
                </div>
                {/* TODO: Add more recruiter details when available */}
              </div>
            </div>

            {/* Submission Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Submission Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Submitted:</span>
                  <p className="text-gray-900 font-medium">
                    {new Date(company.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Last Updated:</span>
                  <p className="text-gray-900 font-medium">
                    {new Date(company.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons - Only show for pending status */}
            {company.verification_status === 'pending' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>{isProcessing ? 'Processing...' : 'Approve Company'}</span>
                  </button>

                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Reject Company</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Company Verification</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this company's verification. This will be sent to the recruiter.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows="4"
            />
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim() || isProcessing}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanyDetail;