import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Save, X, ImageIcon, Briefcase, MapPin, DollarSign, Calendar 
} from 'lucide-react';
import useCloudinaryUpload from '../hooks/useCloudinaryUpload';
import { notify } from '../utils/toast';

const CreateJobModal = ({ isOpen, onClose, editMode = false, jobData = null }) => {
  const dispatch = useDispatch();
  const { company } = useSelector((state) => state.company);
//   const { isLoading: isCreating } = useSelector((state) => state.jobs);
  
  // Cover image upload
  const { 
    uploadFile: uploadCoverImage, 
    loading: isUploadingCover, 
    error: coverError,
    uploadedUrl: coverUrl 
  } = useCloudinaryUpload();
  
  const [formData, setFormData] = useState({
    job_title: '',
    location: '',
    work_type: 'hybrid',
    employment_type: 'full-time',
    compensation_range: '',
    posting_date: new Date().toISOString().split('T')[0],
    skills_required: [],
    cover_image: null,
    role_summary: '',
    key_responsibilities: '',
    requirements: '',
    benefits: '',
    application_link: '',
    application_deadline: '',
    applicants_visibility: 'public'
  });
  
  const [previewCover, setPreviewCover] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});
  const coverInputRef = useRef(null);

  const workTypeOptions = [
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-site' }
  ];

  const employmentTypeOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleCoverImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        cover_image: 'Image size should be less than 5MB'
      }));
      return;
    }

    // Create preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreviewCover(e.target.result);
    reader.readAsDataURL(file);

    try {
      const url = await uploadCoverImage(file, 'job_covers', 'image');
      if (url) {
        notify.success('Cover image uploaded successfully');
        setPreviewCover(url);
        setFormData(prev => ({ ...prev, cover_image: url }));
      }
    } catch (error) {
      notify.error(error.message || 'Failed to upload cover image');
      setPreviewCover(null);
      setErrors(prev => ({ ...prev, cover_image: error.message || 'Upload failed' }));
    }
  };

  const handleRemoveCover = () => {
    setPreviewCover(null);
    setFormData(prev => ({ ...prev, cover_image: null }));
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills_required.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills_required: [...prev.skills_required, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills_required: prev.skills_required.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.job_title?.trim()) {
      newErrors.job_title = 'Job title is required';
    }
    
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.compensation_range?.trim()) {
      newErrors.compensation_range = 'Compensation range is required';
    }
    
    if (!formData.role_summary?.trim()) {
      newErrors.role_summary = 'Role summary is required';
    }
    
    if (!formData.key_responsibilities?.trim()) {
      newErrors.key_responsibilities = 'Key responsibilities are required';
    }
    
    if (!formData.requirements?.trim()) {
      newErrors.requirements = 'Requirements are required';
    }
    
    if (formData.skills_required.length === 0) {
      newErrors.skills_required = 'At least one skill is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      notify.error('Please fill all required fields');
      return;
    }

    if (isUploadingCover) {
      notify.error('Please wait for cover image to upload');
      return;
    }

    const submissionData = {
      company_id: company.id,
      recruiter_id: company.recruiter_id,
      job_title: formData.job_title,
      location: formData.location,
      work_type: formData.work_type,
      employment_type: formData.employment_type,
      compensation_range: formData.compensation_range,
      posting_date: formData.posting_date,
      skills_required: JSON.stringify(formData.skills_required),
      cover_image: formData.cover_image,
      role_summary: formData.role_summary,
      key_responsibilities: formData.key_responsibilities,
      requirements: formData.requirements,
      benefits: formData.benefits || null,
      application_link: formData.application_link || null,
      application_deadline: formData.application_deadline || null,
      applicants_visibility: formData.applicants_visibility,
      status: 'active'
    };

    try {
      // Dispatch create/update job action here
      console.log('Submitting job:', submissionData);
      notify.success('Job posted successfully!');
      handleClose();
    } catch (err) {
      notify.error(err.message || 'Failed to post job');
    }
  };

  const handleClose = () => {
    setFormData({
      job_title: '',
      location: '',
      work_type: 'hybrid',
      employment_type: 'full-time',
      compensation_range: '',
      posting_date: new Date().toISOString().split('T')[0],
      skills_required: [],
      cover_image: null,
      role_summary: '',
      key_responsibilities: '',
      requirements: '',
      benefits: '',
      application_link: '',
      application_deadline: '',
      applicants_visibility: 'public'
    });
    setPreviewCover(null);
    setSkillInput('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {editMode ? 'Edit Job Post' : 'Create Job'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {company?.company_name || 'Your Company'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-all duration-200 hover:scale-105"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Overview Section */}
              <div>
                <h3 className="text-base font-semibold text-slate-800 mb-4">Job Overview</h3>
                
                {/* Job Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.job_title}
                    onChange={(e) => handleInputChange('job_title', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                      errors.job_title ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                    }`}
                    placeholder="e.g., Senior Product Designer"
                  />
                  {errors.job_title && (
                    <p className="text-sm text-red-500 mt-1">{errors.job_title}</p>
                  )}
                </div>

                {/* Location & Work Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                        errors.location ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                      }`}
                      placeholder="e.g., San Francisco, CA"
                    />
                    {errors.location && (
                      <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Work Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.work_type}
                      onChange={(e) => handleInputChange('work_type', e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
                    >
                      {workTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Employment Type & Compensation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Employment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.employment_type}
                      onChange={(e) => handleInputChange('employment_type', e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
                    >
                      {employmentTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Compensation Range <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.compensation_range}
                      onChange={(e) => handleInputChange('compensation_range', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                        errors.compensation_range ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                      }`}
                      placeholder="e.g., $140k - $170k"
                    />
                    {errors.compensation_range && (
                      <p className="text-sm text-red-500 mt-1">{errors.compensation_range}</p>
                    )}
                  </div>
                </div>

                {/* Posting Date */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Posting Date
                  </label>
                  <input
                    type="date"
                    value={formData.posting_date}
                    onChange={(e) => handleInputChange('posting_date', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
                  />
                </div>
              </div>

              {/* Skills/Tags Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Skills / Tags <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleSkillKeyPress}
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
                    placeholder="Add skill (press Enter)"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills_required.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-500 hover:text-red-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.skills_required && (
                  <p className="text-sm text-red-500 mt-1">{errors.skills_required}</p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  Click on  to add skills to improve your listing
                </p>
              </div>

              {/* Visual Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cover Image
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-teal-400 transition-colors">
                  {previewCover ? (
                    <div className="relative">
                      <img
                        src={previewCover}
                        alt="Cover"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {!isUploadingCover && (
                        <button
                          onClick={handleRemoveCover}
                          className="absolute top-2 right-2 bg-red-500 rounded-full p-2 shadow-lg hover:bg-red-600 transition-all duration-200"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      </div>
                      <button
                        onClick={() => coverInputRef.current?.click()}
                        disabled={isUploadingCover}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium mb-1 disabled:opacity-50"
                      >
                        {isUploadingCover ? 'Uploading...' : 'Upload or drop image URL'}
                      </button>
                      <p className="text-xs text-slate-500">Recommended 1110x400px</p>
                    </div>
                  )}
                </div>
                {(errors.cover_image || coverError) && (
                  <p className="text-sm text-red-500 mt-2">{errors.cover_image || coverError}</p>
                )}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="hidden"
                  disabled={isUploadingCover}
                />
              </div>

              {/* About This Role */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  About This Role <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-2">Role Summary</p>
                <textarea
                  value={formData.role_summary}
                  onChange={(e) => handleInputChange('role_summary', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.role_summary ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                  }`}
                  placeholder="Describe the mission and impact of the role..."
                />
                {errors.role_summary && (
                  <p className="text-sm text-red-500 mt-1">{errors.role_summary}</p>
                )}
              </div>

              {/* Key Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Key Responsibilities <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-2">Responsibilities</p>
                <textarea
                  value={formData.key_responsibilities}
                  onChange={(e) => handleInputChange('key_responsibilities', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.key_responsibilities ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                  }`}
                  placeholder="• Own discovery to delivery...&#10;• Create user flows...&#10;• Establish and extend design systems..."
                />
                {errors.key_responsibilities && (
                  <p className="text-sm text-red-500 mt-1">{errors.key_responsibilities}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">List 5-8 relevant bullet points</p>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Requirements <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-2">Requirements</p>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.requirements ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                  }`}
                  placeholder="• 6+ years in product design...&#10;• Portfolio demonstrating systems thinking...&#10;• Experience in agile teams..."
                />
                {errors.requirements && (
                  <p className="text-sm text-red-500 mt-1">{errors.requirements}</p>
                )}
              </div>

              {/* Benefits & Perks */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Benefits & Perks
                </label>
                <p className="text-xs text-slate-500 mb-2">Benefits</p>
                <textarea
                  value={formData.benefits}
                  onChange={(e) => handleInputChange('benefits', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none hover:border-slate-400"
                  placeholder="• Competitive salary and equity...&#10;• Health, dental, and vision..."
                />
              </div>
            </div>

            {/* Right Column - Publishing Options */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 sticky top-24">
                <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Publishing
                </h3>

                {/* Application Link */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Application Link or Email
                  </label>
                  <input
                    type="text"
                    value={formData.application_link}
                    onChange={(e) => handleInputChange('application_link', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://company.com/apply/role"
                  />
                </div>

                {/* Application Deadline */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.application_deadline}
                    onChange={(e) => handleInputChange('application_deadline', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-slate-500 mt-1">30 days from now</p>
                </div>

                {/* Applicants Visibility */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Applicants Visibility
                  </label>
                  <select
                    value={formData.applicants_visibility}
                    onChange={(e) => handleInputChange('applicants_visibility', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                {/* Company Details Preview */}
                <div className="mb-4 p-4 bg-white rounded-lg border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">Company Details</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-600">
                      <span className="font-medium">Company Size:</span><br/>
                      {company?.company_size || 'Not specified'}
                    </p>
                    <p className="text-slate-600">
                      <span className="font-medium">Industry:</span><br/>
                      {company?.industry || 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Company Page Link */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Page Link
                  </label>
                  <input
                    type="text"
                    value={company?.website || ''}
                    disabled
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleSubmit}
                    // disabled={isCreating || isUploadingCover}
                    className="w-full px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Briefcase className="w-4 h-4" />
                    {/* {isCreating ? 'Publishing...' : 'Publish Job'} */}
                  </button>
                  <button
                    onClick={handleClose}
                    // disabled={isCreating || isUploadingCover}
                    className="w-full px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors border border-slate-300 disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-3 text-center">
                  You can edit after publishing.<br/>
                  Drafts auto-save every few minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJobModal;