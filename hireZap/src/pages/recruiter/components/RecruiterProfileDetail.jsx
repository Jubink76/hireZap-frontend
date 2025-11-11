import React, { useState, useRef } from 'react';
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

const RecruiterProfileDetail = () => {
  // Sample data
  const [profileData, setProfileData] = useState({
    name: "Sarah Johnson",
    position: "Senior Product Designer",
    industry: "Software • SaaS",
    location: "San Francisco, CA",
    website: "www.acme.io",
    email: "hello@acme.io",
    phone: "+1 (415) 555-0199",
    address: "500 Market St, San Francisco, CA",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    companyDescription: "Acme builds modern internal tools that helps teams hire faster and grow smarter. We value craftsmanship, ownership, and kindness."
  });

  const [companyStats, setCompanyStats] = useState({
    totalJobs: 54,
    activeJobs: 12,
    totalApplicants: 3241,
    hired: 148
  });

  const [benefits, setBenefits] = useState([
    { id: 1, name: "Health Insurance", color: "bg-teal-100 text-teal-700" },
    { id: 2, name: "Remote Work", color: "bg-blue-100 text-blue-700" },
    { id: 3, name: "Wellness Stipend", color: "bg-amber-100 text-amber-700" },
    { id: 4, name: "Flexible Hours", color: "bg-purple-100 text-purple-700" }
  ]);

  const [companyCulture] = useState(
    "We are product-first, feedback-friendly, and prioritize work-life balance. Diversity and inclusion are at the heart of how we build."
  );

  const [verificationDocs, setVerificationDocs] = useState([
    {
      id: 1,
      name: "Business Registration Certificate",
      date: "Aug 02, 2025",
      size: "1.2 MB",
      type: "PDF",
      status: "verified"
    },
    {
      id: 2,
      name: "Tax Identification (TIN)",
      date: "Jul 20, 2025",
      size: "900 KB",
      type: "PDF",
      status: "pending"
    },
    {
      id: 3,
      name: "Employer Liability Insurance",
      date: "May 14, 2025",
      size: "2.3 MB",
      type: "PDF",
      status: "expired"
    }
  ]);

  const [verificationStatus] = useState({
    overallScore: 92,
    verifiedDocs: 7,
    pendingReview: 2,
    expiredRejected: 1
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ ...profileData });
  const fileInputRef = useRef(null);

  const getStatusBadge = (status) => {
    const styles = {
      verified: { bg: "bg-teal-50", text: "text-teal-700", icon: CheckCircle },
      pending: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
      expired: { bg: "bg-red-50", text: "text-red-700", icon: XCircle }
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

  const handleSaveProfile = () => {
    setProfileData({ ...editForm });
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...profileData });
    setIsEditMode(false);
  };

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
                  <img 
                    src={profileData.profileImage} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-lg border border-slate-200 object-cover"
                  />
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Full Name</label>
                    <p className="text-sm font-medium text-slate-900">{profileData.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Position</label>
                    <p className="text-sm font-medium text-slate-900">{profileData.position}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Industry</label>
                    <p className="text-sm font-medium text-slate-900">{profileData.industry}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Location</label>
                    <p className="text-sm font-medium text-slate-900">{profileData.location}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Website</label>
                    <p className="text-sm text-teal-600 hover:underline cursor-pointer">{profileData.website}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Phone</label>
                    <p className="text-sm font-medium text-slate-900">{profileData.phone}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Email</label>
                    <p className="text-sm text-slate-900">{profileData.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Address</label>
                    <p className="text-sm font-medium text-slate-900">{profileData.address}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <img 
                    src={editForm.profileImage} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-lg border border-slate-200 object-cover"
                  />
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
                  
                  <div>
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
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Company Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{profileData.companyDescription}</p>
            </div>

            {/* Benefits */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {benefits.map(benefit => (
                  <span 
                    key={benefit.id} 
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${benefit.color}`}
                  >
                    {benefit.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Company Culture */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Company Culture</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{companyCulture}</p>
            </div>
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
                <CheckCircle className="w-5 h-5 text-teal-500" />
                <span className="text-sm font-semibold text-slate-900">{verificationStatus.overallScore}% Verified</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-teal-500 h-2 rounded-full transition-all duration-300"
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

            <button className="w-full mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600">
              Complete Verification
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 justify-center">
                <Download className="w-4 h-4" />
                Download Company Profile
              </button>
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