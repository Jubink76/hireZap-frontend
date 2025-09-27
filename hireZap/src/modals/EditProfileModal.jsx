
import React, { useState, useRef } from 'react';
import { Camera, Save, X, User, Mail, Phone, MapPin, Upload, ImageIcon } from 'lucide-react';

const EditProfileModal = ({ 
  isOpen, 
  onClose, 
  userProfile, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    location: userProfile?.location || '',
    profile_image_url: userProfile?.profile_image_url || null
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          profile_image: 'Image size should be less than 5MB'
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setFormData(prev => ({
          ...prev,
          profile_image_url: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({
      ...prev,
      profile_image_url: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name?.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the onSave callback with updated data
      if (onSave) {
        await onSave(formData);
      }
      
      // Close modal on success
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form to original values
    setFormData({
      full_name: userProfile?.full_name || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      location: userProfile?.location || '',
      profile_image_url: userProfile?.profile_image_url || null
    });
    setPreviewImage(null);
    setErrors({});
    onClose();
  };

  const currentImage = previewImage || formData.profile_image_url;
  const userInitial = formData.full_name?.charAt(0)?.toUpperCase() || 'U';

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Edit Profile</h2>
              <p className="text-sm text-slate-600 mt-1">Update your personal information</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-all duration-200 hover:scale-105"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
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

            {/* Profile Picture Section */}
            <div className="mb-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {currentImage ? (
                    <div className="relative">
                      <img
                        src={currentImage}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-teal-100"
                      />
                      {/* Remove Image Button */}
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 shadow-lg hover:bg-red-600 transition-all duration-200 hover:scale-110"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-medium shadow-lg ring-2 ring-teal-100">
                      {userInitial}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800 mb-2">Profile Picture</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Upload a photo or take one with your camera
                  </p>
                  
                  {/* Image Upload Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex items-center px-3 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                    >
                      <Camera className="w-4 h-4 mr-1.5" />
                      Camera
                    </button>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center px-3 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white text-sm rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 transform hover:scale-105 shadow-md"
                    >
                      <Upload className="w-4 h-4 mr-1.5" />
                      Upload
                    </button>
                  </div>
                  
                  {errors.profile_image && (
                    <p className="text-sm text-red-500 mt-2">{errors.profile_image}</p>
                  )}
                </div>
              </div>
              
              {/* Hidden File Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Full Name */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <User className="w-4 h-4 mr-2 text-slate-500" />
                  Full Name <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                      errors.full_name ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.full_name && (
                    <p className="text-sm text-red-500 mt-1">{errors.full_name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-slate-500" />
                  Email <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="col-span-2">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-slate-500" />
                  Phone
                </label>
                <div className="col-span-2">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                  Location
                </label>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
                    placeholder="Enter your location"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50/50">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-2.5 text-slate-700 border border-slate-300 rounded-lg hover:bg-white hover:border-slate-400 transition-all duration-200 disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`px-6 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center font-medium ${
                isLoading ? 'opacity-75 cursor-not-allowed transform-none' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;