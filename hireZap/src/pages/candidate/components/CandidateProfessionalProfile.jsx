import React, { useState, useRef,useEffect } from 'react';
import { 
  Upload, 
  Download, 
  Eye, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  Check,
  Star,
  FileText,
  Award,
  Mail,
  Phone,
  MapPin, 
  Briefcase,
  Camera,
  Loader2
} from 'lucide-react';

import {
  fetchCompleteProfile,
  updateProfile,
  addSkill,
  deleteSkill,
  addEducation,
  deleteEducation,
  addExperience,
  deleteExperience,
  addCertification,
  deleteCertification,
} from '../../../redux/slices/candidateSlice'

import { notify } from '../../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import useFileUpload from '../../../hooks/useFileUpload';

const CandidateProfessionalProfile = () => {

  const dispatch = useDispatch()
  const {user} = useSelector((state)=>state.auth)
  const { 
    profile, 
    educations, 
    experiences, 
    skills, 
    certifications,
    stats,
    loading, 
    error,
    profileLoaded 
  } = useSelector((state) => state.candidate);

  const { uploadFile, loading: uploading } = useFileUpload();
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [isAddingCertification, setIsAddingCertification] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    bio: '',
    phone_number: '',
    linkedin_url: '',
    github_url: '',
    location: '',
    website: ''
  });

  // Form states
  const [skillForm, setSkillForm] = useState({ 
    skill_name: '', 
    proficiency: 3, 
    years_of_experience: 1 
  });
  const [experienceForm, setExperienceForm] = useState({ 
    role: '', 
    company_name: '', 
    start_date: '', 
    end_date: '',
    description: '' 
  });
  const [educationForm, setEducationForm] = useState({ 
    degree: '', 
    field_of_study: '',
    institution: '', 
    start_year: '',
    end_year: '' 
  });
  const [certificationForm, setCertificationForm] = useState({ 
    name: '', 
    issuer: '', 
    field: '',
    issue_date: '',
    expiry_date: '',
    credential_url: ''
  });

  // Profile image state
  const [profileImage, setProfileImage] = useState(user?.profile_image_url || null);

  // Fetch profile on mount
  useEffect(() => {
    if (user && !profileLoaded) {
      console.log("user data", user)
      dispatch(fetchCompleteProfile());
    }
  }, [dispatch, user, profileLoaded]);

  // Update edit form when profile loads
  useEffect(() => {
    if (profile) {
      console.log("Profile data loaded:", profile);
      setEditForm({
        bio: profile.bio || '',
        phone_number: profile.phone_number || user?.phone || '',
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        location: profile.location || user?.location || '',
        website: profile.website || ''
      });
      
      // Update profile image from profile or user
      setProfileImage(profile.profile_image_url || user?.profile_image_url || null);
    } else if (user) {
      // If profile not loaded yet, use user data
      console.log("Using user data:", user);
      setEditForm({
        bio: '',
        phone_number: user.phone || '',
        linkedin_url: '',
        github_url: '',
        location: user.location || '',
        website: ''
      });
      setProfileImage(user.profile_image_url || null);
    }
  }, [profile, user]);

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    const checks = {
      uploadedProfilePhoto: !!(profileImage || user?.profile_image_url),
      addedBio: !!(profile?.bio),
      addedWorkExperience: experiences.length > 0,
      addedSkills: skills.length > 0,
      addedEducation: educations.length > 0,
      uploadedLatestResume: !!(profile?.resume_url)
    };
    const completed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    return {
      percentage: Math.round((completed / total) * 100),
      checks
    };
  };

// Handler to open edit modal
  const handleOpenEdit = () => {
    setEditForm({
      bio: profile?.bio || '',
      phone_number: profile?.phone_number || user?.phone || '',
      linkedin_url: profile?.linkedin_url || '',
      github_url: profile?.github_url || '',
      location: profile?.location || user?.location || '',
      website: profile?.website || ''
    });
    setIsEditingBasicInfo(true);
  };

  // Handler to save profile changes
  const handleSaveProfile = async () => {
    try {
      await dispatch(updateProfile(editForm)).unwrap();
      notify.success('Profile updated successfully');
      setIsEditingBasicInfo(false);
    } catch (error) {
      notify.error(error || 'Failed to update profile');
    }
  };

  // Handler to cancel edit
  const handleCancelEdit = () => {
    setEditForm({
      bio: profile?.bio || '',
      phone_number: profile?.phone_number || user?.phone || '',
      linkedin_url: profile?.linkedin_url || '',
      github_url: profile?.github_url || '',
      location: profile?.location || user?.location || '',
      website: profile?.website || ''
    });
    setIsEditingBasicInfo(false);
  };

  // Handler for profile picture upload
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        const url = await uploadFile(file, 'profiles/avatars', 'image');
        if (url) {
          // Update profile with new image URL
          await dispatch(updateProfile({ profile_image_url: url })).unwrap();
          setProfileImage(url);
          notify.success('Profile picture updated');
        }
      } catch (error) {
        notify.error('Failed to upload profile picture');
        // Revert to previous image on error
        setProfileImage(profile?.profile_image_url || user?.profile_image_url || null);
      }
    }
  };

  // Handler for resume upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadFile(file, 'profiles/resumes', 'raw');
        if (url) {
          await dispatch(updateProfile({ resume_url: url })).unwrap();
          notify.success('Resume uploaded successfully');
          // Refresh profile to get updated data
          dispatch(fetchCompleteProfile());
        }
      } catch (error) {
        notify.error('Failed to upload resume');
      }
    }
  };
  // Handlers for Skills
  const handleAddSkill = async () => {
    if (!skillForm.skill_name.trim()) {
      notify.error('Skill name is required');
      return;
    }
    try {
      await dispatch(addSkill(skillForm)).unwrap();
      setSkillForm({ skill_name: '', proficiency: 3, years_of_experience: 1 });
      setIsAddingSkill(false);
      notify.success('Skill added successfully');
    } catch (error) {
      notify.error(error || 'Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await dispatch(deleteSkill(id)).unwrap();
        notify.success('Skill deleted successfully');
      } catch (error) {
        notify.error(error || 'Failed to delete skill');
      }
    }
  };

  // Handlers for Experience
  const handleAddExperience = async () => {
    if (!experienceForm.role.trim() || !experienceForm.company_name.trim()) {
      notify.error('Role and company name are required');
      return;
    }
    if (!experienceForm.start_date) {
      notify.error('Start date is required');
      return;
    }
    try {
      await dispatch(addExperience(experienceForm)).unwrap();
      setExperienceForm({ 
        role: '', 
        company_name: '', 
        start_date: '', 
        end_date: '',
        description: '' 
      });
      setIsAddingExperience(false);
      notify.success('Experience added successfully');
    } catch (error) {
      notify.error(error || 'Failed to add experience');
    }
  };

  const handleDeleteExperience = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await dispatch(deleteExperience(id)).unwrap();
        notify.success('Experience deleted successfully');
      } catch (error) {
        notify.error(error || 'Failed to delete experience');
      }
    }
  };

  // Handlers for Education
  const handleAddEducation = async () => {
    if (!educationForm.degree.trim() || !educationForm.institution.trim()) {
      notify.error('Degree and institution are required');
      return;
    }
    if (!educationForm.field_of_study.trim()) {
      notify.error('Field of study is required');
      return;
    }
    if (!educationForm.start_year) {
      notify.error('Start year is required');
      return;
    }
    try {
      await dispatch(addEducation(educationForm)).unwrap();
      setEducationForm({ 
        degree: '', 
        field_of_study: '',
        institution: '', 
        start_year: '',
        end_year: '' 
      });
      setIsAddingEducation(false);
      notify.success('Education added successfully');
    } catch (error) {
      notify.error(error || 'Failed to add education');
    }
  };

  const handleDeleteEducation = async (id) => {
    if (window.confirm('Are you sure you want to delete this education?')) {
      try {
        await dispatch(deleteEducation(id)).unwrap();
        notify.success('Education deleted successfully');
      } catch (error) {
        notify.error(error || 'Failed to delete education');
      }
    }
  };

  // Handlers for Certifications
  const handleAddCertification = async () => {
    if (!certificationForm.name.trim()) {
      notify.error('Certification name is required');
      return;
    }
    if (!certificationForm.issuer.trim()) {
      notify.error('Issuer is required');
      return;
    }
    if (!certificationForm.field.trim()) {
      notify.error('Field is required');
      return;
    }
    try {
      await dispatch(addCertification(certificationForm)).unwrap();
      setCertificationForm({ 
        name: '', 
        issuer: '', 
        field: '',
        issue_date: '',
        expiry_date: '',
        credential_url: ''
      });
      setIsAddingCertification(false);
      notify.success('Certification added successfully');
    } catch (error) {
      notify.error(error || 'Failed to add certification');
    }
  };

  const handleDeleteCertification = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await dispatch(deleteCertification(id)).unwrap();
        notify.success('Certification deleted successfully');
      } catch (error) {
        notify.error(error || 'Failed to delete certification');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (loading && !profileLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const { percentage: completionPercentage, checks: completionChecks } = calculateProfileCompletion();

  // Get profile image with fallback
  const displayProfileImage = profileImage || user?.profile_image_url || `https://ui-avatars.com/api/?name=${user?.full_name}&size=80`;
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
              {!isEditingBasicInfo ? (
                <button 
                  onClick={handleOpenEdit}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {!isEditingBasicInfo ? (
              // View Mode
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img 
                    src={displayProfileImage}
                    alt="Profile" 
                    className="w-20 h-20 rounded-full border-2 border-slate-200 object-cover"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-700 shadow-lg disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">{user?.full_name}</h3>
                  {profile?.bio ? (
                    <p className="text-slate-600 text-sm mb-4">{profile.bio}</p>
                  ) : (
                    <button
                      onClick={handleOpenEdit}
                      className="text-slate-400 hover:text-teal-600 text-sm mb-4 italic text-left"
                    >
                      Add a bio to describe yourself...
                    </button>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-slate-500 block">Email</span>
                        <span className="text-slate-900">{user?.email}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-slate-500 block">Phone</span>
                        {(profile?.phone_number || user?.phone) ? (
                          <span className="text-slate-900">{profile?.phone_number || user?.phone}</span>
                        ) : (
                          <button
                            onClick={handleOpenEdit}
                            className="text-slate-400 hover:text-teal-600 text-sm italic"
                          >
                            Add phone
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-slate-500 block">Location</span>
                        {(profile?.location || user?.location) ? (
                          <span className="text-slate-900">{profile?.location || user?.location}</span>
                        ) : (
                          <button
                            onClick={handleOpenEdit}
                            className="text-slate-400 hover:text-teal-600 text-sm italic"
                          >
                            Add location
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-slate-500 block">Website</span>
                        {profile?.website ? (
                          <a 
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:underline"
                          >
                            {profile.website}
                          </a>
                        ) : (
                          <button
                            onClick={handleOpenEdit}
                            className="text-slate-400 hover:text-teal-600 text-sm italic"
                          >
                            Add website
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <img 
                    src={displayProfileImage}
                    alt="Profile" 
                    className="w-20 h-20 rounded-full border-2 border-slate-200 object-cover"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-700 shadow-lg disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows="3"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone_number}
                        onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={editForm.linkedin_url}
                        onChange={(e) => setEditForm({...editForm, linkedin_url: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={editForm.github_url}
                        onChange={(e) => setEditForm({...editForm, github_url: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resume & Documents */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Resume & Documents</h2>
              <button 
                onClick={() => resumeInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Upload Resume
              </button>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
              />
            </div>

            {profile?.resume_url && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Resume</p>
                      <a 
                        href={profile.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-teal-600 hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                  <a 
                    href={profile.resume_url}
                    download
                    className="text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </div>
            )}

            {!profile?.resume_url && (
              <div className="mt-4 p-6 bg-slate-50 rounded-lg text-center border-2 border-dashed border-slate-300">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">
                  No resume uploaded yet<br />
                  <span className="text-xs text-slate-500">PDF or DOC files supported</span>
                </p>
              </div>
            )}
          </div>

          {/* Skills & Expertise */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Skills & Expertise</h2>
              <button 
                onClick={() => setIsAddingSkill(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>

            <div className="space-y-4">
              {skills.map(skill => (
                <div key={skill.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{skill.skill_name}</span>
                      <span className="text-sm text-slate-500">{skill.years_of_experience} years</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < skill.proficiency ? 'fill-teal-500 text-teal-500' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => handleDeleteSkill(skill.id)} 
                      className="text-slate-400 hover:text-red-600"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {skills.length === 0 && !isAddingSkill && (
              <p className="text-sm text-slate-500 text-center py-4">
                No skills added yet. Click "Add Skill" to get started.
              </p>
            )}

            {isAddingSkill && (
              <div className="mt-4 p-4 border-2 border-teal-200 rounded-lg bg-teal-50">
                <input
                  type="text"
                  placeholder="Skill name"
                  value={skillForm.skill_name}
                  onChange={(e) => setSkillForm({...skillForm, skill_name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <div className="flex gap-3 mb-3">
                  <input
                    type="number"
                    placeholder="Years"
                    min="0"
                    max="50"
                    value={skillForm.years_of_experience}
                    onChange={(e) => setSkillForm({...skillForm, years_of_experience: parseInt(e.target.value) || 0})}
                    className="w-24 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Proficiency (1-5)"
                    min="1"
                    max="5"
                    value={skillForm.proficiency}
                    onChange={(e) => setSkillForm({...skillForm, proficiency: parseInt(e.target.value) || 1})}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddSkill} 
                    disabled={loading}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => setIsAddingSkill(false)} 
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Work Experience</h2>
              <button 
                onClick={() => setIsAddingExperience(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            </div>

            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id} className="border-b border-slate-200 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{exp.role} • {exp.company_name}</h3>
                      <p className="text-sm text-slate-500">
                        {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDeleteExperience(exp.id)} 
                        className="text-slate-400 hover:text-red-600"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {exp.description && <p className="text-sm text-slate-600">{exp.description}</p>}
                </div>
              ))}
            </div>

            {experiences.length === 0 && !isAddingExperience && (
              <p className="text-sm text-slate-500 text-center py-4">
                No work experience added yet.
              </p>
            )}

            {isAddingExperience && (
              <div className="mt-4 p-4 border-2 border-teal-200 rounded-lg bg-teal-50">
                <input
                  type="text"
                  placeholder="Job title/Role"
                  value={experienceForm.role}
                  onChange={(e) => setExperienceForm({...experienceForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <input
                  type="text"
                  placeholder="Company name"
                  value={experienceForm.company_name}
                  onChange={(e) => setExperienceForm({...experienceForm, company_name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={experienceForm.start_date}
                      onChange={(e) => setExperienceForm({...experienceForm, start_date: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">End Date (optional)</label>
                    <input
                      type="date"
                      value={experienceForm.end_date}
                      onChange={(e) => setExperienceForm({...experienceForm, end_date: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Description"
                  value={experienceForm.description}
                  onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3 h-20"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddExperience} 
                    disabled={loading}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => setIsAddingExperience(false)} 
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Education</h2>
              <button 
                onClick={() => setIsAddingEducation(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>

            <div className="space-y-3">
              {educations.map(edu => (
                <div key={edu.id} className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                    <p className="text-sm text-slate-600">{edu.field_of_study}</p>
                    <p className="text-sm text-slate-500">{edu.institution}</p>
                    <p className="text-sm text-slate-500">
                      {edu.start_year} - {edu.end_year || 'Present'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDeleteEducation(edu.id)} 
                      className="text-slate-400 hover:text-red-600"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {educations.length === 0 && !isAddingEducation && (
              <p className="text-sm text-slate-500 text-center py-4">
                No education added yet.
              </p>
            )}

            {isAddingEducation && (
              <div className="mt-4 p-4 border-2 border-teal-200 rounded-lg bg-teal-50">
                <input
                  type="text"
                  placeholder="Degree (e.g., Bachelor of Science)"
                  value={educationForm.degree}
                  onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <input
                  type="text"
                  placeholder="Field of Study (e.g., Computer Science)"
                  value={educationForm.field_of_study}
                  onChange={(e) => setEducationForm({...educationForm, field_of_study: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={educationForm.institution}
                  onChange={(e) => setEducationForm({...educationForm, institution: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="number"
                    placeholder="Start Year"
                    value={educationForm.start_year}
                    onChange={(e) => setEducationForm({...educationForm, start_year: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                  <input
                    type="number"
                    placeholder="End Year (optional)"
                    value={educationForm.end_year}
                    onChange={(e) => setEducationForm({...educationForm, end_year: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    min="1950"
                    max={new Date().getFullYear() + 10}
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddEducation} 
                    disabled={loading}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => setIsAddingEducation(false)} 
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Certifications & Achievements */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Certifications & Achievements</h2>
              <button 
                onClick={() => setIsAddingCertification(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Certificate
              </button>
            </div>

            <div className="space-y-3">
              {certifications.map(cert => (
                <div key={cert.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-teal-600" />
                    <div>
                      <h3 className="font-medium text-slate-900">{cert.name}</h3>
                      <p className="text-sm text-slate-500">{cert.issuer} • {cert.field}</p>
                      {cert.issue_date && (
                        <p className="text-xs text-slate-400">Issued: {formatDate(cert.issue_date)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    )}
                    <button 
                      onClick={() => handleDeleteCertification(cert.id)} 
                      className="text-slate-400 hover:text-red-600"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {certifications.length === 0 && !isAddingCertification && (
              <p className="text-sm text-slate-500 text-center py-4">
                No certifications added yet.
              </p>
            )}

            {isAddingCertification && (
              <div className="mt-4 p-4 border-2 border-teal-200 rounded-lg bg-teal-50">
                <input
                  type="text"
                  placeholder="Certification name"
                  value={certificationForm.name}
                  onChange={(e) => setCertificationForm({...certificationForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <input
                  type="text"
                  placeholder="Issuer"
                  value={certificationForm.issuer}
                  onChange={(e) => setCertificationForm({...certificationForm, issuer: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <input
                  type="text"
                  placeholder="Field/Category"
                  value={certificationForm.field}
                  onChange={(e) => setCertificationForm({...certificationForm, field: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Issue Date (optional)</label>
                    <input
                      type="date"
                      value={certificationForm.issue_date}
                      onChange={(e) => setCertificationForm({...certificationForm, issue_date: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Expiry Date (optional)</label>
                    <input
                      type="date"
                      value={certificationForm.expiry_date}
                      onChange={(e) => setCertificationForm({...certificationForm, expiry_date: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <input
                  type="url"
                  placeholder="Credential URL (optional)"
                  value={certificationForm.credential_url}
                  onChange={(e) => setCertificationForm({...certificationForm, credential_url: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddCertification} 
                    disabled={loading}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => setIsAddingCertification(false)} 
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Profile Completion</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-slate-900">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries(completionChecks).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  {value ? (
                    <Check className="w-4 h-4 text-teal-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                  )}
                  <span className={value ? "text-slate-900" : "text-slate-500"}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Public Profile
              </button>
              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  download
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              )}
              <button className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Applications
              </button>
            </div>
          </div>

          {/* Profile Analytics */}
          {stats && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Profile Analytics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Profile Views (30d)</span>
                  <span className="text-lg font-semibold text-slate-900">{stats.profileViews || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Recruiters</span>
                  <span className="text-lg font-semibold text-slate-900">{stats.recruiters || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Clicks</span>
                  <span className="text-lg font-semibold text-slate-900">{stats.clicks || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfessionalProfile;