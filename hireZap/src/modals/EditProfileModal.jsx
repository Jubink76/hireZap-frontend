import React, { useState, useRef, useEffect } from 'react';
import { Camera, Save, X, User, Mail, Phone, MapPin, Upload } from 'lucide-react';
import useCloudinaryUpload from '../hooks/useCloudinaryUpload';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../redux/slices/authSlice';
import ImageCropModal from './ImageCropModal'; 

const EditProfileModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    profile_image_url: user?.profile_image_url || "",
  });

  const [previewImage, setPreviewImage] = useState(user?.profile_image_url || null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Crop modal state
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const { uploadFile, loading: uploadLoading, error: uploadError, uploadedUrl } = useCloudinaryUpload();

  
  useEffect(() => {
    if (uploadedUrl) {
      console.log(' UseEffect: Setting preview from uploadedUrl:', uploadedUrl);
      setFormData(prev => ({ ...prev, profile_image_url: uploadedUrl }));
      setPreviewImage(uploadedUrl);
    }
  }, [uploadedUrl]);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        full_name: user?.full_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        location: user?.location || "",
        profile_image_url: user?.profile_image_url || "",
      });
      setPreviewImage(user?.profile_image_url || null);
    }
  }, [user, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log(' File selected:', file.name, file.size);

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profile_image_url: 'File size must be < 5MB' }));
      return;
    }
    setSelectedFile(file);
    setShowCropModal(true);
  };

  // upload to Cloudinary
  const handleCropConfirm = async (croppedFile) => {
    setShowCropModal(false);
    
    try {
      console.log(' Starting upload to Cloudinary...');
      const url = await uploadFile(croppedFile, 'profiles', 'image');
      console.log(' Upload successful! URL:', url);
      
      if (url) {
        setPreviewImage(url);
        setFormData(prev => ({ ...prev, profile_image_url: url }));
      }
    } catch (err) {
      console.error(' Upload failed:', err);
      setErrors(prev => ({ ...prev, profile_image_url: err.message || 'Upload failed' }));
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, profile_image_url: '' }));
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (formData.phone && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, '')))
      newErrors.phone = 'Enter a valid phone number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    setErrors({});

    try {
      console.log(' Saving profile data:', formData);

      const cleanedData = {
        full_name: formData.full_name?.trim(),
        email: formData.email?.trim(),
        phone: formData.phone?.trim() || '',
        location: formData.location?.trim() || '',
        profile_image_url: formData.profile_image_url?.trim() || ''
      };
      
      const updatedUser = await dispatch(updateUserProfile(cleanedData)).unwrap();

      console.log(' Profile updated successfully:', updatedUser);
      onClose();
    } catch (err) {
      console.error(' Update failed:', err);
      setErrors({ general: err.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      full_name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      profile_image_url: user?.profile_image_url || null,
    });
    setPreviewImage(user?.profile_image_url || null);
    setErrors({});
    onClose();
  };

  const currentImage = previewImage;
  const userInitial = formData.full_name?.charAt(0)?.toUpperCase() || 'U';

  if (!isOpen) return null;

  return (
    <>
      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        imageFile={selectedFile}
        onConfirm={handleCropConfirm}
        onCancel={handleCropCancel}
        cropShape="round" // Use 'round' for profile pictures, 'rect' for logos
        aspectRatio={1} // 1:1 for square
      />

      {/* Main Edit Profile Modal */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Edit Profile</h2>
              <p className="text-sm text-slate-600 mt-1">Update your personal information</p>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-slate-200 rounded-full">
              <X className="w-5 h-5 text-red-600" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 text-red-700 text-sm mb-6">
                {errors.general}
              </div>
            )}

            {/* Profile Image */}
            <div className="mb-8 flex items-center space-x-6">
              <div className="relative">
                {currentImage ? (
                  <>
                    <img
                      src={currentImage}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-teal-100"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 shadow-lg hover:bg-red-600"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-medium shadow-lg ring-2 ring-teal-100">
                    {userInitial}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-800 mb-2">Profile Picture</h3>
                <p className="text-sm text-slate-500 mb-4">Upload a photo or take one with your camera</p>
                <div className="flex space-x-3">
                  <button onClick={() => cameraInputRef.current?.click()} className="flex items-center px-3 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm rounded-lg">
                    <Camera className="w-4 h-4 mr-1.5" /> Camera
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-3 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white text-sm rounded-lg">
                    <Upload className="w-4 h-4 mr-1.5" /> Upload
                  </button>
                </div>
                {(uploadLoading || errors.profile_image_url) && (
                  <p className="text-sm text-red-500 mt-2">
                    {uploadLoading ? 'Uploading...' : errors.profile_image_url || uploadError}
                  </p>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="user" onChange={handleImageSelect} className="hidden" />
            </div>

            {/* Form Fields - Same as before */}
            <div className="space-y-5">
              {/* Full Name */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <User className="w-4 h-4 mr-2 text-slate-500" /> Full Name <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                      errors.full_name ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.full_name && <p className="text-sm text-red-500 mt-1">{errors.full_name}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-slate-500" /> Email <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="col-span-2">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Phone */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-slate-500" /> Phone
                </label>
                <div className="col-span-2">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 border-slate-300 hover:border-slate-400"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-slate-500" /> Location
                </label>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 border-slate-300 hover:border-slate-400"
                    placeholder="Enter your location"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50/50">
            <button onClick={handleClose} disabled={isSaving || uploadLoading} className="px-6 py-2.5 border rounded-lg text-slate-700 cursor-pointer">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || uploadLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg flex items-center cursor-pointer"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;