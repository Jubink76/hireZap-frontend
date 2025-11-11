
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, Briefcase, MapPin, Clock, DollarSign, 
  Edit, Eye, Trash2, AlertTriangle, Calendar, Globe 
} from 'lucide-react';
import Pagination from '../../../components/Pagination';
import { useOutletContext } from 'react-router-dom';
import { getJobsByRecruiterId } from '../../../redux/slices/jobSlice';

const CreatedJobs = ({ openCompanyModal }) => {
    const dispatch = useDispatch()
    const {company} = useSelector((state)=>state.company)
    const { openCreateJobModal,openPremiumModal } = useOutletContext()

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5;

    const { recruiterJobs, loading, error } = useSelector((state) => state.job);
    const recruiterId = useSelector((state) => state.auth.user?.id);
    console.log("Jobs data:", recruiterJobs);

    const hasJobs = Array.isArray(recruiterJobs) && recruiterJobs.length > 0;
    const totalPages = hasJobs ? Math.ceil(recruiterJobs.length / itemsPerPage) : 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentJobs = hasJobs
    ? recruiterJobs.slice(startIndex, startIndex + itemsPerPage)
    : [];
    
    useEffect(() => {
        if (recruiterId) {
        dispatch(getJobsByRecruiterId(recruiterId));
        }
    }, [dispatch, recruiterId]);

    // Loading state
    if (!company && company !== null) {
        return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading...</p>
            </div>
        </div>
        );
    }

    // Company not added
    if (!company) {
        return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                Company Details Required
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                You need to add and verify your company details before creating job postings.
                </p>
            </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                Add Company Details First
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                Before you can create job postings, you need to add your company information and get it verified by our admin team.
                </p>
                <button
                onClick={() => openCompanyModal(false)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                <Plus className="w-5 h-5" />
                <span>Add Company Details</span>
                </button>
            </div>
            </div>
        </div>
        );
    }

    // Company verification pending
    if (company.verification_status === 'pending') {
        return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                Verification Pending
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                Your company details are under review by our admin team. You can create job postings once your company is verified.
                </p>
            </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                Verification in Progress
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                Your company information has been submitted successfully. Our admin team is currently reviewing your details. This typically takes 1-2 business days. You'll be able to create job postings after verification.
                </p>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                    <strong>Company:</strong> {company.company_name}
                </p>
                <p className="text-sm text-blue-800 mt-1">
                    <strong>Submitted on:</strong> {new Date(company.updated_at || company.created_at).toLocaleDateString()}
                </p>
                </div>
            </div>
            </div>
        </div>
        );
    }

    // Company verification rejected
    if (company.verification_status === 'rejected') {
        return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                Verification Rejected
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-2">
                Your company verification was rejected. Please update your company details and resubmit for verification before creating job postings.
                </p>
                {company.rejection_reason && (
                <div className="mt-2 p-3 bg-white rounded border border-red-200">
                    <p className="text-sm text-slate-700">
                    <strong>Reason:</strong> {company.rejection_reason}
                    </p>
                </div>
                )}
            </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                Update Company Details
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                Please review the rejection reason and update your company information with correct details.
                </p>
                <button
                onClick={() => openCompanyModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                <Edit className="w-5 h-5" />
                <span>Update Company Details</span>
                </button>
            </div>
            </div>
        </div>
        );
    }
    // Company verified - Show jobs or empty state
    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                <h1 className="text-2xl font-bold text-slate-900">Your Created Jobs</h1>
                <p className="text-slate-600 mt-1">Manage and track your job postings</p>
                </div>
                <button
                onClick={hasJobs?()=>openPremiumModal():()=>openCreateJobModal()}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                <Plus className="w-5 h-5" />
                <span>Create New Job</span>
                </button>
            </div>

            {/* No Jobs State */}
            {!hasJobs ? (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-10 h-10 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                    No Jobs Posted Yet
                    </h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                    Start by creating your first job posting. Reach out to talented candidates and build your team.
                    </p>
                    <button
                        onClick={()=>openCreateJobModal()}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                        >
                        <Plus className="w-5 h-5" />
                        <span>Create Your First Job</span>
                    </button>
                    <p className="text-xs text-slate-500 mt-6">
                    Company verified ✓ You're ready to start hiring
                    </p>
                </div>
                </div>
            ) : (
                <>
                {/* Jobs List */}
                <div className="space-y-4">
                  {currentJobs.map((job) => {
                    const company = job.company || {}; // ✅ safely handle missing company
                    return (
                      <div
                        key={job.id}
                        className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            {/* Left Section - Job Info */}
                            <div className="flex items-start space-x-4 flex-1 min-w-0">
                              {/* Company Logo */}
                              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                                {company.company_name?.charAt(0) || "C"}
                              </div>

                              {/* Job Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate">
                                      {job.job_title || job.title}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                      {company.company_name} • {job.location}
                                    </p>
                                  </div>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                      job.status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-amber-100 text-amber-700"
                                    }`}
                                  >
                                    {job.status === "active" ? "Active" : "Paused"}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
                                  <div className="flex items-center space-x-1">
                                    <Briefcase className="w-4 h-4" />
                                    <span>{job.type || "Full-time"}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>{job.salary || "Not disclosed"}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{job.postedDate || "Recently"}</span>
                                  </div>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {(job.skills || []).map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>

                                {/* Applicants Count */}
                                <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                                  {job.applicants || 0} Applicants
                                </button>
                              </div>
                            </div>

                            {/* Right Section - Actions (Desktop) */}
                            <div className="hidden md:flex items-center space-x-2">
                              <button
                                className="p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                title="Manage"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* Actions (Mobile) */}
                          <div className="md:hidden mt-4 pt-4 border-t border-slate-100 flex gap-2">
                            <button className="flex-1 px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 border border-teal-200 hover:border-teal-300 rounded-lg transition-colors">
                              Manage
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors">
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>


                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={jobs.length}
                    startIndex={startIndex}
                    />
                )}
                </>
            )}
            </div>
        );
    };

export default CreatedJobs;