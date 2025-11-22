import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Upload, 
  Download, 
  Eye, 
  Edit2, 
  Check,
  FileText,
  Mail,
  Phone,
  MapPin, 
  Building,
  Globe,
  Clock,
  Users,
  Briefcase,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { fetchCompany, updateCompany } from '../../../redux/slices/companySlice';
import { getJobsByRecruiterId } from '../../../redux/slices/jobSlice';
import { notify } from '../../../utils/toast';

const RecruiterProfileDetail = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { company, loading: companyLoading } = useSelector((state) => state.company);
  const { recruiterJobs, loading: jobsLoading } = useSelector((state) => state.job);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCompany()); // Fetches company for authenticated recruiter
      dispatch(getJobsByRecruiterId(user.id));
    }
  }, [dispatch, user?.id]);

  // Initialize edit form when user/company data loads
  useEffect(() => {
    if (user && company) {
      setEditForm({
        // User fields
        name: user.full_name || user.name || '',
        email: user.email || '',
        phone: user.phone_number || user.phone || '',
        profileImage: user.profile_image_url || user.avatar_url || '',
        
        // Company fields
        position: user.position || user.job_title || 'Recruiter',
        companyName: company.company_name || '',
        industry: company.industry || '',
        location: company.location || company.address || '',
        website: company.website || company.website_url || '',
        address: company.address || company.full_address || '',
        companyDescription: company.description || company.company_description || '',
        companyLogo: company.logo_url || '',
        
        // Additional company fields
        foundedYear: company.founded_year || '',
        companySize: company.company_size || '',
        benefits: company.benefits || [],
        culture: company.culture || company.company_culture || ''
      });
    }
  }, [user, company]);

  // Calculate company stats
  const companyStats = {
    totalJobs: recruiterJobs?.length || 0,
    activeJobs: recruiterJobs?.filter(job => job.status === 'active' || job.job_status === 'active')?.length || 0,
    totalApplicants: recruiterJobs?.reduce((sum, job) => sum + (job.applications_count || job.applicants || 0), 0) || 0,
    hired: recruiterJobs?.reduce((sum, job) => sum + (job.hired_count || 0), 0) || 0
  };

  // Parse benefits if it's a JSON string
  const parsedBenefits = (() => {
    if (!company?.benefits) return [];
    if (Array.isArray(company.benefits)) return company.benefits;
    try {
      return JSON.parse(company.benefits);
    } catch {
      return [];
    }
  })();

  const benefitsWithColors = parsedBenefits.map((benefit, index) => {
    const colors = [
      'bg-teal-100 text-teal-700',
      'bg-blue-100 text-blue-700',
      'bg-amber-100 text-amber-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700'
    ];
    return {
      id: index,
      name: typeof benefit === 'string' ? benefit : benefit.name,
      color: colors[index % colors.length]
    };
  });

  // Verification documents (you'll need to fetch this from your backend)
  const [verificationDocs, setVerificationDocs] = useState([
    {
      id: 1,
      name: "Business Registration Certificate",
      date: company?.created_at ? new Date(company.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : "N/A",
      size: "1.2 MB",
      type: "PDF",
      status: company?.verification_status || "pending"
    }
  ]);

  const verificationStatus = {
    overallScore: company?.verification_status === 'verified' ? 100 : 
                   company?.verification_status === 'pending' ? 50 : 20,
    verifiedDocs: company?.verification_status === 'verified' ? 1 : 0,
    pendingReview: company?.verification_status === 'pending' ? 1 : 0,
    expiredRejected: company?.verification_status === 'rejected' ? 1 : 0
  };

  const getStatusBadge = (status) => {
    const styles = {
      verified: { bg: "bg-teal-50", text: "text-teal-700", icon: CheckCircle },
      pending: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
      expired: { bg: "bg-red-50", text: "text-red-700", icon: XCircle },
      rejected: { bg: "bg-red-50", text: "text-red-700", icon: XCircle }
    };
    
    const style = styles[status] || styles.pending;
    const Icon = style.icon;
    
    return (
      <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${style.bg}`}>
        <Icon className={`w-4 h-4 ${style.text}`} />
        <span className={`text-xs font-medium ${style.text} capitalize`}>{status}</span>
      </div>
    );
  };

  const handleSaveProfile = async () => {
    try {
      // Update company data
      if (company?.id) {
        await dispatch(updateCompany({
          id: company.id,
          data: {
            industry: editForm.industry,
            location: editForm.location,
            website: editForm.website,
            address: editForm.address,
            description: editForm.companyDescription,
            culture: editForm.culture,
            company_size: editForm.companySize,
            founded_year: editForm.foundedYear
          }
        })).unwrap();
      }

      // TODO: Update user profile if you have an updateUserProfile action
      // await dispatch(updateUserProfile({
      //   full_name: editForm.name,
      //   email: editForm.email,
      //   phone_number: editForm.phone,
      //   position: editForm.position
      // })).unwrap();

      notify.success('Profile updated successfully');
      setIsEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      notify.error('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original data
    setEditForm({
      name: user.full_name || user.name || '',
      email: user.email || '',
      phone: user.phone_number || user.phone || '',
      profileImage: user.profile_image_url || user.avatar_url || '',
      position: user.position || user.job_title || 'Recruiter',
      companyName: company?.company_name || '',
      industry: company?.industry || '',
      location: company?.location || company?.address || '',
      website: company?.website || company?.website_url || '',
      address: company?.address || company?.full_address || '',
      companyDescription: company?.description || company?.company_description || '',
      companyLogo: company?.logo_url || '',
      foundedYear: company?.founded_year || '',
      companySize: company?.company_size || '',
      benefits: company?.benefits || [],
      culture: company?.culture || company?.company_culture || ''
    });
    setIsEditMode(false);
  };

  // Loading state
  if (companyLoading || jobsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // No company data
  if (!company) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Building className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No Company Data Found
          </h3>
          <p className="text-slate-600">
            Please add your company information to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recruiter Info Section */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Recruiter Info</h2>
              {!isEditMode ? (
                <button 
                  onClick={() => setIsEditMode(true)}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600"
                  >
                    Save
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

            {!isEditMode ? (
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  {editForm.profileImage ? (
                    <img 
                      src={editForm.profileImage} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-lg border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg border border-slate-200 bg-teal-100 flex items-center justify-center">
                      <span className="text-3xl font-bold text-teal-600">
                        {editForm.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Full Name</label>
                    <p className="text-sm font-medium text-slate-900">{editForm.name || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Position</label>
                    <p className="text-sm font-medium text-slate-900">{editForm.position || 'Recruiter'}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Company</label>
                    <p className="text-sm font-medium text-slate-900">{editForm.companyName || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Industry</label>
                    <p className="text-sm font-medium text-slate-900">{editForm.industry || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Location</label>
                    <p className="text-sm font-medium text-slate-900">{editForm.location || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Website</label>
                    {editForm.website ? (
                      <a 
                        href={editForm.website.startsWith('http') ? editForm.website : `https://${editForm.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-teal-600 hover:underline cursor-pointer"
                      >
                        {editForm.website}
                      </a>
                    ) : (
                      <p className="text-sm text-slate-500">Not provided</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Phone</label>
                    <p className="text-sm font-medium text-slate-900">{editForm.phone || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Email</label>
                    <p className="text-sm text-slate-900">{editForm.email || 'Not provided'}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="text-xs text-slate-500 block mb-1">Address</label>
                    <p className="text-sm font-medium text-slate-900">{editForm.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  {editForm.profileImage ? (
                    <img 
                      src={editForm.profileImage} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-lg border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg border border-slate-200 bg-teal-100 flex items-center justify-center">
                      <span className="text-3xl font-bold text-teal-600">
                        {editForm.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-xs text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Change Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      // TODO: Handle image upload
                      console.log('File selected:', e.target.files[0]);
                    }}
                  />
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Position</label>
                    <input
                      type="text"
                      value={editForm.position}
                      onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={editForm.companyName}
                      onChange={(e) => setEditForm({...editForm, companyName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled
                      title="Company name cannot be changed here"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Industry</label>
                    <input
                      type="text"
                      value={editForm.industry}
                      onChange={(e) => setEditForm({...editForm, industry: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Website</label>
                    <input
                      type="text"
                      value={editForm.website}
                      onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Company Description */}
            {editForm.companyDescription && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Company Description</h3>
                {!isEditMode ? (
                  <p className="text-sm text-slate-600 leading-relaxed">{editForm.companyDescription}</p>
                ) : (
                  <textarea
                    value={editForm.companyDescription}
                    onChange={(e) => setEditForm({...editForm, companyDescription: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                )}
              </div>
            )}

            {/* Benefits */}
            {benefitsWithColors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Benefits</h3>
                <div className="flex flex-wrap gap-2">
                  {benefitsWithColors.map(benefit => (
                    <span 
                      key={benefit.id} 
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${benefit.color}`}
                    >
                      {benefit.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Company Culture */}
            {editForm.culture && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Company Culture</h3>
                {!isEditMode ? (
                  <p className="text-sm text-slate-600 leading-relaxed">{editForm.culture}</p>
                ) : (
                  <textarea
                    value={editForm.culture}
                    onChange={(e) => setEditForm({...editForm, culture: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                )}
              </div>
            )}
          </div>

          {/* Verification Documents */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Verification Documents</h2>
              <button className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            </div>

            {company.verification_status === 'rejected' && company.rejection_reason && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-900 mb-1">Verification Rejected</h4>
                    <p className="text-sm text-red-700">{company.rejection_reason}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {verificationDocs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <FileText className="w-10 h-10 text-slate-400" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-900">{doc.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500">{doc.date}</span>
                        <span className="text-xs text-slate-500">{doc.size}</span>
                        <span className="text-xs text-slate-500">{doc.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(doc.status)}
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Company Stats */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Company Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Jobs</span>
                <span className="text-xl font-bold text-slate-900">{companyStats.totalJobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Active Jobs</span>
                <span className="text-xl font-bold text-slate-900">{companyStats.activeJobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Applicants</span>
                <span className="text-xl font-bold text-slate-900">{companyStats.totalApplicants.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Hired</span>
                <span className="text-xl font-bold text-slate-900">{companyStats.hired}</span>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Verification Status</h3>
              <div className="flex items-center gap-2">
                {company.verification_status === 'verified' ? (
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-500" />
                )}
                <span className="text-sm font-semibold text-slate-900">{verificationStatus.overallScore}%</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    company.verification_status === 'verified' ? 'bg-teal-500' :
                    company.verification_status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${verificationStatus.overallScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Verified Documents</span>
                <span className="font-semibold text-slate-900">{verificationStatus.verifiedDocs}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Pending Review</span>
                <span className="font-semibold text-slate-900">{verificationStatus.pendingReview}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Expired / Rejected</span>
                <span className="font-semibold text-slate-900">{verificationStatus.expiredRejected}</span>
              </div>
            </div>

            {company.verification_status !== 'verified' && (
              <button className="w-full mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600">
                Complete Verification
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 justify-center">
                <AlertCircle className="w-4 h-4" />
                Contact Support
              </button>
              <button className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 justify-center">
                <AlertCircle className="w-4 h-4" />
                Verification Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfileDetail;