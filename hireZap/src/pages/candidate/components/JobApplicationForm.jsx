import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobById } from '../../../redux/slices/jobSlice';
import { fetchCompanyById } from '../../../redux/slices/companySlice';
import {
  ArrowLeft,
  Upload,
  FileText,
  Link as LinkIcon,
  User,
  Briefcase,
  MapPin,
  DollarSign,
  Building
} from 'lucide-react';

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentJob, loading } = useSelector((state) => state.job);
  const { companiesById } = useSelector((state) => state.company);

  const [formData, setFormData] = useState({
    resume: null,
    portfolioLink: '',
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: '',
    linkedinProfile: '',
    yearsOfExperience: '',
    availability: '',
    expectedSalary: '',
    currentCompany: '',
    coverLetter: ''
  });

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId));
    }
  }, [jobId, dispatch]);

  useEffect(() => {
    if (currentJob?.company_id && !companiesById[currentJob.company_id]) {
      dispatch(fetchCompanyById(currentJob.company_id));
    }
  }, [currentJob, dispatch, companiesById]);

  if (loading) {
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

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    console.log('Saving draft...', formData);
    alert('Draft saved successfully!');
  };

  const handleSubmitApplication = () => {
    console.log('Submitting application...', formData);
    alert('Application submitted successfully!');
    navigate(`/candidate/jobs/${jobId}`);
  };

  const handleBackToJob = () => {
    navigate(`/candidate/jobs/${jobId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
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

          {/* Badges */}
          <div className="flex items-center space-x-2 mb-6">
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
              Equity available
            </span>
          </div>

          {/* Compensation */}
          <div className="mb-6">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Compensation:</span> Competitive salary with benefits
            </p>
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
                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-500 transition-colors">
                    {formData.resume ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-6 w-6 text-teal-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{formData.resume.name}</p>
                            <p className="text-xs text-gray-500">
                              PDF, max 10MB · {(formData.resume.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleInputChange('resume', null)}
                          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                        >
                          Upload / Update
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block text-center">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="text-teal-600 font-medium">resume.pdf</span>
                        </p>
                        <p className="text-xs text-gray-500">PDF, max 10MB</p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, 'resume')}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Portfolio Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">portfolio link</span>
                      </div>
                      <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                        Add
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="URL or file, max 10MB"
                      value={formData.portfolioLink}
                      onChange={(e) => handleInputChange('portfolioLink', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Letter Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <FileText className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Cover Letter & Questions</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Why are you interested in this role?</p>
                  <textarea
                    value={formData.coverLetter}
                    onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                    rows="8"
                    placeholder="Describe your most relevant experience in this role."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm"
                  ></textarea>
                </div>
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
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    value={formData.linkedinProfile}
                    onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
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
                    value={formData.yearsOfExperience}
                    onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  >
                    <option value="">5-7 years</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-7">5-7 years</option>
                    <option value="7+">7+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  >
                    <option value="">2 weeks notice</option>
                    <option value="immediate">Immediate</option>
                    <option value="2-weeks">2 weeks notice</option>
                    <option value="1-month">1 month notice</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Salary
                  </label>
                  <input
                    type="text"
                    value={formData.expectedSalary}
                    onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Company
                  </label>
                  <input
                    type="text"
                    value={formData.currentCompany}
                    onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                onClick={handleSaveDraft}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Save Draft
              </button>
              <button
                onClick={handleSubmitApplication}
                className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-sm"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;