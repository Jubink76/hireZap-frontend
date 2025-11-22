// src/pages/candidate/ApplicationDetail.jsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchApplicationById,
  withdrawApplication,
  clearSuccessMessage,
} from '../../../redux/slices/applicationSlice';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  FileText,
  Link as LinkIcon,
  User,
  Mail,
  Phone,
  MapPinIcon,
  CheckCircle,
} from 'lucide-react';

const JobApplicationDetail = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentApplication, loading, successMessage } = useSelector(
    (state) => state.application
  );

  useEffect(() => {
    if (applicationId) {
      dispatch(fetchApplicationById(applicationId));
    }
  }, [applicationId, dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
        navigate('/candidate/applications');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch, navigate]);

  const handleWithdraw = () => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      dispatch(withdrawApplication(applicationId));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const canWithdraw = currentApplication?.status === 'applied' || 
                      currentApplication?.status === 'under_review';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!currentApplication) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Application Not Found
        </h2>
        <button
          onClick={() => navigate('/candidate/applications')}
          className="text-teal-600 hover:text-teal-700"
        >
          Return to Applications
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate('/candidate/applications')}
        className="flex items-center text-teal-600 hover:text-teal-700 mb-6 font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Applications
      </button>

      {/* Application Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Application Details
            </h1>
            <p className="text-gray-600">
              Submitted on {formatDate(currentApplication.submitted_at || currentApplication.created_at)}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentApplication.status === 'offered' || currentApplication.status === 'hired'
                ? 'bg-green-100 text-green-800'
                : currentApplication.status === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {currentApplication.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {canWithdraw && (
          <button
            onClick={handleWithdraw}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
          >
            Withdraw Application
          </button>
        )}
      </div>

      {/* Application Content */}
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Name</p>
              <p className="text-gray-900 font-medium">
                {currentApplication.first_name} {currentApplication.last_name}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Email</p>
              <p className="text-gray-900 font-medium">{currentApplication.email}</p>
            </div>
            {currentApplication.phone && (
              <div>
                <p className="text-gray-600 mb-1">Phone</p>
                <p className="text-gray-900 font-medium">{currentApplication.phone}</p>
              </div>
            )}
            {currentApplication.location && (
              <div>
                <p className="text-gray-600 mb-1">Location</p>
                <p className="text-gray-900 font-medium">{currentApplication.location}</p>
              </div>
            )}
          </div>
        </div>

        {/* Professional Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Professional Details
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {currentApplication.years_of_experience && (
              <div>
                <p className="text-gray-600 mb-1">Experience</p>
                <p className="text-gray-900 font-medium">
                  {currentApplication.years_of_experience} years
                </p>
              </div>
            )}
            {currentApplication.current_company && (
              <div>
                <p className="text-gray-600 mb-1">Current Company</p>
                <p className="text-gray-900 font-medium">
                  {currentApplication.current_company}
                </p>
              </div>
            )}
            {currentApplication.availability && (
              <div>
                <p className="text-gray-600 mb-1">Availability</p>
                <p className="text-gray-900 font-medium">
                  {currentApplication.availability}
                </p>
              </div>
            )}
            {currentApplication.expected_salary && (
              <div>
                <p className="text-gray-600 mb-1">Expected Salary</p>
                <p className="text-gray-900 font-medium">
                  {currentApplication.expected_salary}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Documents & Links
          </h2>
          <div className="space-y-3">
            {currentApplication.resume_url && (
              <div>
                <p className="text-gray-600 text-sm mb-1">Resume</p>
                <a
                  href={currentApplication.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 text-sm flex items-center"
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  View Resume
                </a>
              </div>
            )}
            {currentApplication.portfolio_url && (
              <div>
                <p className="text-gray-600 text-sm mb-1">Portfolio</p>
                <a
                  href={currentApplication.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 text-sm flex items-center"
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  View Portfolio
                </a>
              </div>
            )}
            {currentApplication.linkedin_profile && (
              <div>
                <p className="text-gray-600 text-sm mb-1">LinkedIn</p>
                <a
                  href={currentApplication.linkedin_profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 text-sm flex items-center"
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  View Profile
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Cover Letter */}
        {currentApplication.cover_letter && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Cover Letter
            </h2>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">
              {currentApplication.cover_letter}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationDetail;