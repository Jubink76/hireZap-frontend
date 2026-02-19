import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Save, X, ImageIcon, FileText, AlertTriangle, MapPin 
} from 'lucide-react';
import { createCompany } from '../redux/slices/companySlice';
import { updateCompany } from '../redux/slices/companySlice';
import useCloudinaryUpload from '../hooks/useCloudinaryUpload';
import { notify } from '../utils/toast';

const AddCompanyDetailsModal = ({ isOpen, onClose,editMode = false }) => {
  const dispatch = useDispatch();
  const { company, isLoading: isCreating } = useSelector((state) => state.company);
  

  const { 
    uploadFile: uploadLogo, 
    loading: isUploadingLogo, 
    error: logoError,
    uploadedUrl: logoUrl 
  } = useCloudinaryUpload();
  
  const { 
    uploadFile: uploadCertificate, 
    loading: isUploadingCert, 
    error: certError,
    uploadedUrl: certUrl 
  } = useCloudinaryUpload();
  
  const [formData, setFormData] = useState({
    company_name: '',
    business_email: '',
    phone_number: '',
    industry: '',
    company_size: '',
    website: '',
    linkedin_url: '',
    founded_year: '',
    business_address: '',
    latitude: '',
    longitude: '',
    description: '',
    logo_url: null,
    business_certificate: null
  });
  
  const [initialFormData, setInitialFormData] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [certificateName, setCertificateName] = useState('');
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const logoInputRef = useRef(null);
  const certInputRef = useRef(null);

  // Load existing company data in edit mode
  useEffect(() => {
    if (isOpen && editMode && company) {
      const existingData = {
        company_name: company.company_name || '',
        business_email: company.business_email || '',
        phone_number: company.phone_number || '',
        industry: company.industry || '',
        company_size: company.company_size || '',
        website: company.website || '',
        linkedin_url: company.linkedin_url || '',
        founded_year: company.founded_year || '',
        business_address: company.address || '',
        latitude: company.latitude || '',
        longitude: company.longitude || '',
        description: company.description || '',
        logo_url: company.logo_url || null,
        business_certificate: company.business_certificate || null
      };
      
      setFormData(existingData);
      setInitialFormData(existingData);
      
      if (company.logo_url) {
        setPreviewLogo(company.logo_url);
      }
      
      if (company.business_certificate) {
        
        const urlParts = company.business_certificate.split('/');
        const filename = urlParts[urlParts.length - 1];
        setCertificateName(filename || 'Existing Certificate');
      }
    }
  }, [isOpen, editMode, company]);

  // Check if form has changes
  useEffect(() => {
    if (editMode && initialFormData) {
      const changed = Object.keys(formData).some(key => {
        return JSON.stringify(formData[key]) !== JSON.stringify(initialFormData[key]);
      });
      setHasChanges(changed);
    }
  }, [formData, initialFormData, editMode]);

  
  useEffect(() => {
    if (logoUrl) {
      console.log(' Logo uploaded successfully:', logoUrl);
      setFormData(prev => ({ ...prev, logo_url: logoUrl }));
    }
  }, [logoUrl]);

  
  useEffect(() => {
    if (certUrl) {
      console.log(' Certificate uploaded successfully:', certUrl);
      setFormData(prev => ({ ...prev, business_certificate: certUrl }));
    }
  }, [certUrl]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        logo_url: 'Logo size should be less than 5MB'
      }));
      return;
    }

    // Create preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreviewLogo(e.target.result);
    reader.readAsDataURL(file);

   
    try {
      console.log('📁 Uploading logo to Cloudinary...');
      const url = await uploadLogo(file, 'company_logos', 'image');
      
      if (url) {
        notify.success('Logo uploaded successfully');
        setPreviewLogo(url); 
        setFormData(prev => ({ ...prev, logo_url: url }));
      }
    } catch (error) {
      console.error('❌ Logo upload failed:', error);
      notify.error(error.message || 'Failed to upload logo');
      setPreviewLogo(null);
      setErrors(prev => ({ ...prev, logo_url: error.message || 'Upload failed' }));
    }
  };

  const handleCertificateUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        business_certificate: 'File size should be less than 5MB'
      }));
      return;
    }

    setCertificateName(file.name);


    // 'auto' or 'raw' for PDFs, 'image' for images
    const resourceType = file.type === 'application/pdf' ? 'raw' : 'image';
    
    try {
      console.log(' Uploading certificate to Cloudinary...');
      const url = await uploadCertificate(file, 'company_certificates', resourceType);
      
      if (url) {
        notify.success('Certificate uploaded successfully');
        setFormData(prev => ({ ...prev, business_certificate: url }));
      }
    } catch (error) {
      console.error(' Certificate upload failed:', error);
      notify.error(error.message || 'Failed to upload certificate');
      setCertificateName('');
      setErrors(prev => ({ ...prev, business_certificate: error.message || 'Upload failed' }));
    }
  };

  const handleRemoveLogo = () => {
    setPreviewLogo(null);
    setFormData(prev => ({ ...prev, logo_url: null }));
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const handleRemoveCertificate = () => {
    setCertificateName('');
    setFormData(prev => ({ ...prev, business_certificate: null }));
    if (certInputRef.current) certInputRef.current.value = '';
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
          notify.success('Location captured successfully');
        },
        (error) => {
          console.error('Error getting location:', error);
          notify.error('Unable to get current location');
        }
      );
    } else {
      notify.error('Geolocation is not supported by your browser');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.company_name?.trim()) {
      newErrors.company_name = 'Company name is required';
    }
    
    if (!formData.business_email?.trim()) {
      newErrors.business_email = 'Business email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.business_email)) {
      newErrors.business_email = 'Please enter a valid email address';
    }
    
    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = 'Phone number is required';
    }
    
    if (!formData.industry?.trim()) {
      newErrors.industry = 'Industry is required';
    }
    
    if (!formData.company_size?.trim()) {
      newErrors.company_size = 'Company size is required';
    }
    
    if (!formData.business_address?.trim()) {
      newErrors.business_address = 'Business address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      notify.error('Please fill all required fields');
      return;
    }

    // Wait for any pending uploads
    if (isUploadingLogo || isUploadingCert) {
      notify.error('Please wait for uploads to complete');
      return;
    }

    // Prepare data for submission
    const submissionData = {
      company_name: formData.company_name,
      business_email: formData.business_email,
      phone_number: formData.phone_number,
      industry: formData.industry,
      company_size: formData.company_size,
      address: formData.business_address,
      website: formData.website || null,
      linkedin_url: formData.linkedin_url || null,
      founded_year: formData.founded_year || null,
      description: formData.description || null,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      logo_url: formData.logo_url || null,
      business_certificate: formData.business_certificate || null,
    };
    
    try{
      let result;
      if (editMode){
        result = await dispatch(updateCompany({id:company.id,data:submissionData})).unwrap();
      }else{
        result = await dispatch(createCompany(submissionData)).unwrap();
      }
      setHasChanges(false);

      setTimeout(()=>{handleClose()},100)

    }catch(err){
      notify.error(err.message || "Failed to submit company details")
    }
  };

  const handleClose = () => {
    if (editMode && hasChanges) {
      const confirmDiscard = window.confirm(
        'You have unsaved changes. Are you sure you want to discard them?'
      );
      if (!confirmDiscard) return;
    }

    setFormData({
      company_name: '',
      business_email: '',
      phone_number: '',
      industry: '',
      company_size: '',
      website: '',
      linkedin_url: '',
      founded_year: '',
      business_address: '',
      latitude: '',
      longitude: '',
      description: '',
      logo_url: null,
      business_certificate: null
    });
    setInitialFormData(null);
    setPreviewLogo(null);
    setCertificateName('');
    setErrors({});
    setHasChanges(false);

    onClose();
  };

  const isSubmitting = isCreating || isUploadingLogo || isUploadingCert;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {editMode ? 'Update Company Details' : 'Company Details for verification'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {editMode 
                ? 'Update your company information and resubmit for verification' 
                : 'Provide accurate company information for verification'}
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
          {/* Verification Notice */}
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                {editMode ? 'Re-verification Required' : 'Verification Required'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {editMode 
                  ? 'After updating your company details, they will be submitted for verification again. Your company status will be set to pending until verified by our admin team.'
                  : 'Your Company must be verified by our admin team before you can post job listings. Please provide accurate information.'}
              </p>
            </div>
          </div>

          {/* Company Logo & Certificate Section */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Logo */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Company Logo
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-teal-400 transition-colors">
                {previewLogo ? (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-3">
                      <img
                        src={previewLogo}
                        alt="Company Logo"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-slate-200"
                      />
                      {!isUploadingLogo && (
                        <button
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg hover:bg-red-600 transition-all duration-200"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      )}
                    </div>
                    {isUploadingLogo ? (
                      <p className="text-sm text-teal-600">Uploading...</p>
                    ) : (
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Change Image
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium mb-1 disabled:opacity-50"
                    >
                      {isUploadingLogo ? 'Uploading...' : 'Upload company logo'}
                    </button>
                    <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
              {(errors.logo_url || logoError) && (
                <p className="text-sm text-red-500 mt-2">{errors.logo_url || logoError}</p>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={isUploadingLogo}
              />
            </div>

            {/* Business Certificate */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Business Certificate
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-teal-400 transition-colors">
                {certificateName ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                      <FileText className="w-8 h-8 text-teal-600" />
                    </div>
                    <p className="text-sm text-slate-700 font-medium mb-2 text-center truncate max-w-full px-2">
                      {certificateName}
                    </p>
                    {isUploadingCert ? (
                      <p className="text-sm text-teal-600">Uploading...</p>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => certInputRef.current?.click()}
                          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                        >
                          Change File
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          onClick={handleRemoveCertificate}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <button
                      onClick={() => certInputRef.current?.click()}
                      disabled={isUploadingCert}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium mb-1 disabled:opacity-50"
                    >
                      {isUploadingCert ? 'Uploading...' : 'Upload business certificate'}
                    </button>
                    <p className="text-xs text-slate-500">PDF, PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
              {(errors.business_certificate || certError) && (
                <p className="text-sm text-red-500 mt-2">{errors.business_certificate || certError}</p>
              )}
              <input
                ref={certInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleCertificateUpload}
                className="hidden"
                disabled={isUploadingCert}
              />
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                    errors.company_name ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                  }`}
                  placeholder="e.g., Tech Solutions Inc."
                />
                {errors.company_name && (
                  <p className="text-sm text-red-500 mt-1">{errors.company_name}</p>
                )}
              </div>

              {/* Business Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.business_email}
                  onChange={(e) => handleInputChange('business_email', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                    errors.business_email ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                  }`}
                  placeholder="contact@company.com"
                />
                {errors.business_email && (
                  <p className="text-sm text-red-500 mt-1">{errors.business_email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                    errors.phone_number ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone_number && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone_number}</p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Industry <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                    errors.industry ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                  }`}
                  placeholder="e.g., Technology, Healthcare"
                />
                {errors.industry && (
                  <p className="text-sm text-red-500 mt-1">{errors.industry}</p>
                )}
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Size <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.company_size}
                  onChange={(e) => handleInputChange('company_size', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                    errors.company_size ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1001+">1001+ employees</option>
                </select>
                {errors.company_size && (
                  <p className="text-sm text-red-500 mt-1">{errors.company_size}</p>
                )}
              </div>

              {/* Founded Year */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Founded Year
                </label>
                <input
                  type="text"
                  value={formData.founded_year}
                  onChange={(e) => handleInputChange('founded_year', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
                  placeholder="e.g., 2020"
                  maxLength="4"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
                  placeholder="https://www.company.com"
                />
              </div>

              {/* LinkedIn Profile */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
                  placeholder="https://www.linkedin.com/company/..."
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none hover:border-slate-400"
              placeholder="Brief description about your company..."
            />
          </div>

          {/* Location Details Section */}
          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-4">Location Details</h3>
            <div className="space-y-5">
              {/* Business Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.business_address}
                  onChange={(e) => handleInputChange('business_address', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.business_address ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                  }`}
                  placeholder="Enter complete business address"
                />
                {errors.business_address && (
                  <p className="text-sm text-red-500 mt-1">{errors.business_address}</p>
                )}
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
                    placeholder="e.g., 37.7749"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
                    placeholder="e.g., -122.4194"
                    readOnly
                  />
                </div>
              </div>

              {/* Get Current Location Button */}
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get current location</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50/50">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-slate-700 border border-slate-300 rounded-lg hover:bg-white hover:border-slate-400 transition-all duration-200 disabled:opacity-50 font-medium"
          >
            {editMode && hasChanges ? 'Discard Changes' : 'Cancel'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center font-medium ${
              isSubmitting ? 'opacity-75 cursor-not-allowed transform-none' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editMode ? 'Apply for Re-verification' : 'Submit for verification'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyDetailsModal;