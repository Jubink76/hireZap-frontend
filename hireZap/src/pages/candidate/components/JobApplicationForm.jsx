// src/pages/candidate/JobApplicationForm.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobById } from '../../../redux/slices/jobSlice';
import { fetchCompanyById } from '../../../redux/slices/companySlice';
import { fetchCompleteProfile } from '../../../redux/slices/candidateSlice';
import {
  createApplication,
  checkApplicationExists,
  clearApplicationError,
  clearSuccessMessage,
} from '../../../redux/slices/applicationSlice';
import useCloudinaryUpload from '../../../hooks/useCloudinaryUpload';
import { notify } from '../../../utils/toast';
import {
  ArrowLeft,
  Upload,
  FileText,
  Link as LinkIcon,
  User,
  Briefcase,
  MapPin,
  DollarSign,
  Building,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  ExternalLink,
  Check,
} from 'lucide-react';

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { currentJob, loading: jobLoading } = useSelector((state) => state.job);
  const { companiesById } = useSelector((state) => state.company);
  const { profile, profileLoaded } = useSelector((state) => state.candidate);
  const {
    submitting,
    error: applicationError,
    successMessage,
    applicationCheck,
  } = useSelector((state) => state.application);

  const { uploadFile, loading: uploading } = useCloudinaryUpload();
  const resumeInputRef = useRef(null);

  const [formData, setFormData] = useState({
    resume_url: '',
    portfolio_url: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    linkedin_profile: '',
    years_of_experience: '',
    availability: '',
    expected_salary: '',
    current_company: '',
    cover_letter: ''
  });

  // Resume management state
  const [availableResumes, setAvailableResumes] = useState([]);
  const [selectedResumeIndex, setSelectedResumeIndex] = useState(null);
  const [showResumeOptions, setShowResumeOptions] = useState(false);
  
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Fetch job details and candidate profile
  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId));
      dispatch(checkApplicationExists(jobId));
    }
    
    // Fetch candidate profile if not loaded
    if (user && !profileLoaded) {
      dispatch(fetchCompleteProfile());
    }
  }, [jobId, dispatch, user, profileLoaded]);

  // Fetch company details
  useEffect(() => {
    if (currentJob?.company_id && !companiesById[currentJob.company_id]) {
      dispatch(fetchCompanyById(currentJob.company_id));
    }
  }, [currentJob, dispatch, companiesById]);

  // Initialize available resumes
  useEffect(() => {
    const resumes = [];
    
    // Add profile resume if exists
    if (profile?.resume_url) {
      resumes.push({
        id: 'profile',
        url: profile.resume_url,
        name: 'Profile Resume',
        source: 'From your profile',
        uploadedAt: profile.updated_at || new Date().toISOString()
      });
    }

    setAvailableResumes(resumes);
    
    // Set default selection to profile resume if available
    if (resumes.length > 0 && !formData.resume_url) {
      setSelectedResumeIndex(0);
      setFormData(prev => ({ ...prev, resume_url: resumes[0].url }));
    }
  }, [profile]);

  // Initialize form with profile data or draft
  useEffect(() => {
    // Check if there's a draft first
    if (applicationCheck.has_draft && applicationCheck.draft) {
      const draft = applicationCheck.draft;
      setFormData({
        resume_url: draft.resume_url || '',
        portfolio_url: draft.portfolio_url || '',
        first_name: draft.first_name || '',
        last_name: draft.last_name || '',
        email: draft.email || '',
        phone: draft.phone || '',
        location: draft.location || '',
        linkedin_profile: draft.linkedin_profile || '',
        years_of_experience: draft.years_of_experience || '',
        availability: draft.availability || '',
        expected_salary: draft.expected_salary || '',
        current_company: draft.current_company || '',
        cover_letter: draft.cover_letter || '',
      });
      
      // Find and select the draft's resume if it matches
      if (draft.resume_url) {
        const resumeIndex = availableResumes.findIndex(r => r.url === draft.resume_url);
        if (resumeIndex !== -1) {
          setSelectedResumeIndex(resumeIndex);
        }
      }
    } 
    // Otherwise, load from profile
    else if (profile || user) {
      setFormData({
        resume_url: profile?.resume_url || '',
        portfolio_url: profile?.website || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone: profile?.phone_number || user?.phone || '',
        location: profile?.location || user?.location || '',
        linkedin_profile: profile?.linkedin_url || '',
        years_of_experience: '',
        availability: '',
        expected_salary: '',
        current_company: '',
        cover_letter: ''
      });
    }
  }, [applicationCheck, profile, user, availableResumes]);

  // Handle success message
  useEffect(() => {
    if (successMessage) {
      setShowSuccessAlert(true);
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
        dispatch(clearSuccessMessage());
        // Navigate to job detail page after successful submission
        if (!formData.is_draft) {
          navigate(`/candidate/jobs/${jobId}`);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch, navigate, jobId]);

  // Handle application errors
  useEffect(() => {
    if (applicationError) {
      if (applicationError.fieldErrors) {
        setValidationErrors(applicationError.fieldErrors);
      }
      const timer = setTimeout(() => {
        dispatch(clearApplicationError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [applicationError, dispatch]);

  // Check if already applied
  if (applicationCheck.has_applied) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-8 py-12 text-center bg-white rounded-lg shadow">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Already Applied</h2>
          <p className="text-gray-600 mb-6">
            You have already submitted an application for this position.
          </p>
          <button
            onClick={() => navigate('/candidate/dashboard')}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (jobLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
        <button
          onClick={() => navigate('/candidate/dashboard')}
          className="text-teal-600 hover:text-teal-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const companyData = companiesById[currentJob.company_id];

  const parseSkills = (skillsJson) => {
    if (!skillsJson) return [];
    try {
      return JSON.parse(skillsJson);
    } catch {
      return [];
    }
  };
  
  const job = {
    id: currentJob.id,
    title: currentJob.job_title,
    company: companyData?.company_name || 'Unknown Company',
    logo: companyData?.logo_url || 'https://via.placeholder.com/40',
    location: currentJob.location,
    salary: currentJob.compensation_range || 'Not specified',
    type: currentJob.employment_type,
    skills: parseSkills(currentJob.skills_required)
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle resume file upload
  const handleResumeFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        notify.error('Please upload a PDF or DOC file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        notify.error('File size must be less than 10MB');
        return;
      }

      // Upload to Cloudinary
      try {
        notify.info('Uploading resume...');
        const url = await uploadFile(file, 'applications/resumes', 'raw');
        if (url) {
          // Add new resume to available resumes
          const newResume = {
            id: `uploaded-${Date.now()}`,
            url: url,
            name: file.name,
            source: 'Newly uploaded',
            uploadedAt: new Date().toISOString()
          };
          
          const updatedResumes = [...availableResumes, newResume];
          setAvailableResumes(updatedResumes);
          
          // Select the newly uploaded resume
          setSelectedResumeIndex(updatedResumes.length - 1);
          setFormData(prev => ({ ...prev, resume_url: url }));
          setShowResumeOptions(false);
          
          notify.success('Resume uploaded successfully');
        }
      } catch (error) {
        notify.error('Failed to upload resume');
      }
    }
  };

  // Select an existing resume
  const handleSelectResume = (index) => {
    setSelectedResumeIndex(index);
    setFormData(prev => ({ ...prev, resume_url: availableResumes[index].url }));
    setShowResumeOptions(false);
    
    // Clear validation error
    if (validationErrors.resume_url) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.resume_url;
        return newErrors;
      });
    }
  };

  // Remove selected resume
  const handleRemoveResume = () => {
    setSelectedResumeIndex(null);
    setFormData(prev => ({ ...prev, resume_url: '' }));
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  // Open resume in new tab with proper content-type handling
  const handleViewResume = (url) => {
    // For Cloudinary URLs, ensure we're getting the raw file
    let viewUrl = url;
    
    // If it's a Cloudinary URL, modify it to force download/view as PDF
    if (url.includes('cloudinary.com')) {
      // Replace /upload/ with /upload/fl_attachment/ to force proper content-type
      viewUrl = url.replace('/upload/', '/upload/fl_attachment:resume/');
    }
    
    window.open(viewUrl, '_blank', 'noopener,noreferrer');
  };

  // Get file extension from URL
  const getFileExtension = (url) => {
    if (!url) return '';
    const parts = url.split('.');
    return parts[parts.length - 1].split('?')[0].toUpperCase();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const handleSaveDraft = async () => {
    const applicationData = {
      job_id: parseInt(jobId),
      ...formData,
      is_draft: true,
    };

    await dispatch(createApplication(applicationData));
  };

  const handleSubmitApplication = async () => {
    // Basic client-side validation
    const errors = {};
    if (!formData.first_name) errors.first_name = 'First name is required';
    if (!formData.last_name) errors.last_name = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.resume_url) errors.resume_url = 'Resume is required for submission';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const applicationData = {
      job_id: parseInt(jobId),
      ...formData,
      is_draft: false,
    };

    await dispatch(createApplication(applicationData));
  };

  const handleBackToJob = () => {
    navigate(`/candidate/jobs/${jobId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Success Alert */}
      {showSuccessAlert && successMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {applicationError && !applicationError.fieldErrors && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <p className="text-sm text-red-800">{applicationError.message || applicationError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Left Side - Job Details (Fixed) */}
      <div className="w-80 bg-teal-50 border-l-4 border-l-teal-600 border-r-2 border-gray-300 flex flex-col overflow-y-auto">
        {/* Back Button */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={handleBackToJob}
            className="flex items-center text-teal-600 hover:text-teal-700 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job
          </button>
        </div>

        {/* Job Info */}
        <div className="p-6">
          <div className="flex items-start space-x-3 mb-6">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Building className="h-6 w-6 text-gray-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h2>
              <p className="text-sm text-gray-600">{job.company}</p>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-700">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
              <span>{job.type}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded ${
                  index < 2
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Application Form (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Apply for Position</h1>
            {applicationCheck.has_draft && (
              <p className="text-sm text-blue-600 mt-2">
                Draft found - Your previous progress has been loaded
              </p>
            )}
            {profile && (
              <p className="text-sm text-gray-600 mt-2">
                Your profile information has been pre-filled
              </p>
            )}
          </div>

          {/* Form Sections */}
          <div className="space-y-8">
            {/* Resume & Portfolio Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <FileText className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Resume & Portfolio</h2>
              </div>

              <div className="space-y-6">
                {/* Resume Selection/Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Selected Resume Display */}
                  {selectedResumeIndex !== null && availableResumes[selectedResumeIndex] ? (
                    <div className="space-y-3">
                      <div className="border-2 border-teal-200 bg-teal-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <FileText className="h-8 w-8 text-teal-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {availableResumes[selectedResumeIndex].name}
                                </p>
                                <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-teal-100 text-teal-800 rounded">
                                  {getFileExtension(availableResumes[selectedResumeIndex].url)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5">
                                {availableResumes[selectedResumeIndex].source}
                                {availableResumes[selectedResumeIndex].uploadedAt && 
                                  ` • ${formatDate(availableResumes[selectedResumeIndex].uploadedAt)}`
                                }
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                            <button
                              onClick={() => handleViewResume(availableResumes[selectedResumeIndex].url)}
                              className="p-2 text-teal-600 hover:text-teal-700 hover:bg-teal-100 rounded-lg transition-colors"
                              type="button"
                              title="View resume"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setShowResumeOptions(!showResumeOptions)}
                              className="px-3 py-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium"
                              type="button"
                            >
                              Change
                            </button>
                            <button
                              onClick={handleRemoveResume}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              type="button"
                              title="Remove resume"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Resume Options Dropdown */}
                      {showResumeOptions && (
                        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                          <p className="text-xs font-medium text-gray-700 mb-2">Select a resume:</p>
                          <div className="space-y-2">
                            {availableResumes.map((resume, index) => (
                              <button
                                key={resume.id}
                                onClick={() => handleSelectResume(index)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                  index === selectedResumeIndex
                                    ? 'bg-teal-50 border border-teal-200'
                                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                                }`}
                                type="button"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {resume.name}
                                      </p>
                                      <p className="text-xs text-gray-500">{resume.source}</p>
                                    </div>
                                  </div>
                                  {index === selectedResumeIndex && (
                                    <Check className="h-4 w-4 text-teal-600 flex-shrink-0" />
                                  )}
                                </div>
                              </button>
                            ))}
                            
                            {/* Upload New Resume Option */}
                            <button
                              onClick={() => resumeInputRef.current?.click()}
                              disabled={uploading}
                              className="w-full text-left px-3 py-2 rounded-lg bg-white border-2 border-dashed border-gray-300 hover:border-teal-500 transition-colors"
                              type="button"
                            >
                              <div className="flex items-center gap-2">
                                {uploading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 text-teal-600 animate-spin" />
                                    <span className="text-sm text-gray-600">Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-teal-600 font-medium">
                                      Upload new resume
                                    </span>
                                  </>
                                )}
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* No Resume Selected - Show Upload Option */
                    <div className="space-y-3">
                      {availableResumes.length > 0 ? (
                        /* Show available resumes to select */
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Select a resume or upload a new one:
                          </p>
                          <div className="space-y-2">
                            {availableResumes.map((resume, index) => (
                              <button
                                key={resume.id}
                                onClick={() => handleSelectResume(index)}
                                className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                                type="button"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {resume.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{resume.source}</p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      
                      {/* Upload New Resume */}
                      <div 
                        onClick={() => !uploading && resumeInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
                          uploading ? 'border-gray-300 bg-gray-50' :
                          validationErrors.resume_url ? 'border-red-300 bg-red-50 hover:border-red-400' : 
                          'border-gray-300 hover:border-teal-500'
                        }`}
                      >
                        <div className="text-center">
                          {uploading ? (
                            <div className="flex flex-col items-center">
                              <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-2" />
                              <p className="text-sm text-gray-600">Uploading resume...</p>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="text-teal-600 font-medium">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 10MB)</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeFileSelect}
                    className="hidden"
                    disabled={uploading}
                  />
                  
                  {validationErrors.resume_url && (
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.resume_url}
                    </p>
                  )}
                </div>

                {/* Portfolio URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    name="portfolio_url"
                    placeholder="https://portfolio.com"
                    value={formData.portfolio_url}
                    onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                      validationErrors.portfolio_url ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.portfolio_url && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.portfolio_url}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Letter Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <FileText className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Cover Letter</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why are you interested in this role?
                </label>
                <textarea
                  name="cover_letter"
                  value={formData.cover_letter}
                  onChange={(e) => handleInputChange('cover_letter', e.target.value)}
                  rows="8"
                  placeholder="Describe your most relevant experience for this role..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm ${
                    validationErrors.cover_letter ? 'border-red-500' : 'border-gray-300'
                  }`}
                ></textarea>
                {validationErrors.cover_letter && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.cover_letter}</p>
                )}
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <User className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                      validationErrors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.first_name && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                      validationErrors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.last_name && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.last_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1234567890"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                      validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.phone && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                      validationErrors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.location && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin_profile"
                    value={formData.linkedin_profile}
                    onChange={(e) => handleInputChange('linkedin_profile', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                      validationErrors.linkedin_profile ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.linkedin_profile && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.linkedin_profile}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Details Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Briefcase className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Professional Details</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <select
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={(e) => handleInputChange('years_of_experience', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                      validationErrors.years_of_experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-7">5-7 years</option>
                    <option value="7-10">7-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {validationErrors.years_of_experience && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.years_of_experience}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                      validationErrors.availability ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select availability</option>
                    <option value="immediate">Immediate</option>
                    <option value="2-weeks">2 weeks notice</option>
                    <option value="1-month">1 month notice</option>
                    <option value="2-months">2 months notice</option>
                    <option value="flexible">Flexible</option>
                  </select>
                  {validationErrors.availability && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.availability}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Salary
                  </label>
                  <input
                    type="text"
                    name="expected_salary"
                    value={formData.expected_salary}
                    onChange={(e) => handleInputChange('expected_salary', e.target.value)}
                    placeholder="e.g., $80,000 - $100,000"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                      validationErrors.expected_salary ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.expected_salary && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.expected_salary}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Company
                  </label>
                  <input
                    type="text"
                    name="current_company"
                    value={formData.current_company}
                    onChange={(e) => handleInputChange('current_company', e.target.value)}
                    placeholder="Your current employer"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm ${
                      validationErrors.current_company ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.current_company && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.current_company}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 pb-8">
              <button
                onClick={handleSaveDraft}
                disabled={submitting || uploading}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={handleSubmitApplication}
                disabled={submitting || uploading}
                className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;