import React, { useState, useRef } from 'react';
import { 
  Save, X, Building2, Mail, Phone, Globe, MapPin, 
  Calendar, Users, Linkedin, Upload, ImageIcon, FileText, AlertTriangle 
} from 'lucide-react';

const AddCompanyDetailsModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    company_name: '',
    business_email: '',
    phone_number: '',
    industry: '',
    company_size: '',
    website: '',
    linkedin_profile: '',
    founded_year: '',
    business_address: '',
    latitude: '',
    longitude: '',
    company_logo: null,
    tax_certificate: null
  });
  
  const [previewLogo, setPreviewLogo] = useState(null);
  const [taxCertificateName, setTaxCertificateName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const logoInputRef = useRef(null);
  const taxInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          company_logo: 'Logo size should be less than 5MB'
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewLogo(e.target.result);
        setFormData(prev => ({
          ...prev,
          company_logo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTaxCertificateUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          tax_certificate: 'File size should be less than 5MB'
        }));
        return;
      }
      
      setTaxCertificateName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          tax_certificate: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setPreviewLogo(null);
    setFormData(prev => ({
      ...prev,
      company_logo: null
    }));
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const handleRemoveTaxCertificate = () => {
    setTaxCertificateName('');
    setFormData(prev => ({
      ...prev,
      tax_certificate: null
    }));
    if (taxInputRef.current) {
      taxInputRef.current.value = '';
    }
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
        },
        (error) => {
          console.error('Error getting location:', error);
          setErrors(prev => ({
            ...prev,
            location: 'Unable to get current location'
          }));
        }
      );
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
      return;
    }
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting company details:', error);
      setErrors({ general: 'Failed to submit company details. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsDraft = () => {
    console.log('Saving as draft:', formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      company_name: '',
      business_email: '',
      phone_number: '',
      industry: '',
      company_size: '',
      website: '',
      linkedin_profile: '',
      founded_year: '',
      business_address: '',
      latitude: '',
      longitude: '',
      company_logo: null,
      tax_certificate: null
    });
    setPreviewLogo(null);
    setTaxCertificateName('');
    setErrors({});
    onClose();
  };

  const companyInitial = formData.company_name?.charAt(0)?.toUpperCase() || 'C';

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Company Details for verification</h2>
              <p className="text-sm text-slate-600 mt-1">Provide accurate company information for verification</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-all duration-200 hover:scale-105"
            >
              <X className="w-5 h-5 text-red-600 border " />
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
                  Verification Required
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your Company must be verified by our admin team before you can post job listing. Please provide accurate information.
                </p>
              </div>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 text-red-700 text-sm mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    {errors.general}
                  </div>
                </div>
              </div>
            )}

            {/* Company Logo & Tax Certificate Section */}
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
                        <button
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg hover:bg-red-600 transition-all duration-200"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      </div>
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium mb-1"
                      >
                        Upload a job post image
                      </button>
                      <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
                {errors.company_logo && (
                  <p className="text-sm text-red-500 mt-2">{errors.company_logo}</p>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>

              {/* Tax Certificate */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Tax certificate
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-teal-400 transition-colors">
                  {taxCertificateName ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                        <FileText className="w-8 h-8 text-teal-600" />
                      </div>
                      <p className="text-sm text-slate-700 font-medium mb-2 text-center truncate max-w-full px-2">
                        {taxCertificateName}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => taxInputRef.current?.click()}
                          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                        >
                          Change File
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          onClick={handleRemoveTaxCertificate}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <button
                        onClick={() => taxInputRef.current?.click()}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium mb-1"
                      >
                        Upload a job post image
                      </button>
                      <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
                {errors.tax_certificate && (
                  <p className="text-sm text-red-500 mt-2">{errors.tax_certificate}</p>
                )}
                <input
                  ref={taxInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleTaxCertificateUpload}
                  className="hidden"
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
                    placeholder="e.g., Senior Product Designer"
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
                    placeholder="e.g., Acme Corp"
                  />
                  {errors.business_email && (
                    <p className="text-sm text-red-500 mt-1">{errors.business_email}</p>
                  )}
                </div>

                {/* Company Size */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company size <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company_size}
                    onChange={(e) => handleInputChange('company_size', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                      errors.company_size ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                    }`}
                    placeholder="e.g., San Francisco, CA"
                  />
                  {errors.company_size && (
                    <p className="text-sm text-red-500 mt-1">{errors.company_size}</p>
                  )}
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
                    placeholder="e.g., $120k - $160k"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    placeholder="e.g., Senior Product Designer"
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
                    placeholder="e.g., Acme Corp"
                  />
                  {errors.industry && (
                    <p className="text-sm text-red-500 mt-1">{errors.industry}</p>
                  )}
                </div>

                {/* LinkedIn Profile */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Linkedin Profile
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin_profile}
                    onChange={(e) => handleInputChange('linkedin_profile', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
                    placeholder="e.g., San Francisco, CA"
                  />
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
                    placeholder="e.g., $120k - $160k"
                  />
                </div>
              </div>
            </div>

            {/* Location Details Section */}
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-4">Location Details</h3>
              <div className="space-y-5">
                {/* Business Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business address <span className="text-red-500">*</span>
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

                {/* Company Name (duplicate in design) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company_name}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 cursor-not-allowed"
                      placeholder="e.g., Senior Product Designer"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 cursor-not-allowed"
                      placeholder="e.g., Acme Corp"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company size
                    </label>
                    <input
                      type="text"
                      value={formData.company_size}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 cursor-not-allowed"
                      placeholder="e.g., San Francisco, CA"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Founded Year
                    </label>
                    <input
                      type="text"
                      value={formData.founded_year}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 cursor-not-allowed"
                      placeholder="e.g., $120k - $160k"
                      disabled
                    />
                  </div>
                </div>

                {/* Coordinates with Get Location Button */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange('longitude', e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
                      placeholder="e.g., Senior Product Designer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange('latitude', e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
                      placeholder="e.g., $120k - $160k"
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
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50/50">
            <button
              onClick={handleSaveAsDraft}
              disabled={isLoading}
              className="px-6 py-2.5 text-slate-700 border border-slate-300 rounded-lg hover:bg-white hover:border-slate-400 transition-all duration-200 disabled:opacity-50 font-medium"
            >
              Save as Draft
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-6 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center font-medium ${
                isLoading ? 'opacity-75 cursor-not-allowed transform-none' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Submit for verification
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddCompanyDetailsModal;