import React, { useState, useEffect } from 'react';
import { ChevronLeft, FileText, Phone, Video, Users, CheckCircle, Award, Briefcase, Lock, Plus, X, ArrowUp, ArrowDown, AlertCircle, Crown, Loader2,DollarSign,Calendar } from 'lucide-react';
import PremiumRequiredModal from '../../../modals/PremiumRequiredModal';
import { getJobsByRecruiterId } from '../../../redux/slices/jobSlice';
import { fetchAllStages,
        saveJobSelectionProcess,
        getJobSelectionProcess,
        clearSuccessMessage,
        clearStageError,
        clearJobStages } from '../../../redux/slices/selectionStageSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RecruiterSelectionStages = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {recruiterJobs, loading} = useSelector((state)=>state.job);
  const {stages,jobStages,freeStages,premiumStages,loading:stageLoading, successMessage, error} = useSelector((state)=>state.selectionStage)
  const { company } = useSelector((state) => state.company);
  const recruiterId = useSelector((state) => state.auth.user?.id);

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedStages, setSelectedStages] = useState([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [pendingStage, setPendingStage] = useState(null);
  const [isSaving,setIsSaving] = useState(false)

  // Icon mapping
  const iconMap = {
    FileText, Phone, Video, Users, CheckCircle, Award, Briefcase, Lock
  };

  // Mock recruiter subscription (change this based on actual subscription)
  const recruiterSubscription = {
    plan: 'free', // Options: 'free', 'per-post', 'professional', 'enterprise'
    jobPostsRemaining: 1
  };

  useEffect(()=>{
    if(recruiterId){
      dispatch(getJobsByRecruiterId(recruiterId))
    }
    dispatch(fetchAllStages())
  },[dispatch,recruiterId])

  useEffect(() => {
    if (selectedJob) {
      dispatch(getJobSelectionProcess(selectedJob.id));
    } else {
      dispatch(clearJobStages());
    }
  }, [selectedJob, dispatch]);

  useEffect(() => {
    if (jobStages && jobStages.length > 0) {
      // Sort by order and set as selected stages
      const sortedStages = [...jobStages].sort((a, b) => a.order - b.order);
      setSelectedStages(sortedStages);
    } else if (selectedJob) {
      // If no saved stages, reset selection
      setSelectedStages([]);
    }
  }, [jobStages, selectedJob]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearStageError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);


  const canAccessStage = (stage) => {
    if (!stage.requiresPremium) return true;
    
    if (recruiterSubscription.plan === 'enterprise') return true;
    if (recruiterSubscription.plan === 'professional' && ['per-post', 'professional'].includes(stage.tier)) return true;
    if (recruiterSubscription.plan === 'per-post' && stage.tier === 'per-post') return true;
    
    return false;
  };

  const handleStageSelect = (stage) => {
    if (stage.requiresPremium && !canAccessStage(stage)) {
      setPendingStage(stage);
      setShowPremiumModal(true);
      return;
    }

    if (selectedStages.find(s => s.id === stage.id)) {
      setSelectedStages(selectedStages.filter(s => s.id !== stage.id));
    } else {
      setSelectedStages([...selectedStages, { ...stage, order: selectedStages.length + 1 }]);
    }
  };

  const moveStage = (index, direction) => {
    const newStages = [...selectedStages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newStages.length) return;
    
    [newStages[index], newStages[targetIndex]] = [newStages[targetIndex], newStages[index]];
    setSelectedStages(newStages.map((stage, idx) => ({ ...stage, order: idx + 1 })));
  };

  const removeStage = (stageId) => {
    setSelectedStages(selectedStages.filter(s => s.id !== stageId).map((stage, idx) => ({ ...stage, order: idx + 1 })));
  };

  const handleSaveProcess = async () => {
    if (selectedStages.length === 0) {
      return;
    }

    setIsSaving(true);
    
    try {
      const stageIds = selectedStages.map(stage => stage.id);
      await dispatch(saveJobSelectionProcess({ 
        jobId: selectedJob.id, 
        stageIds 
      })).unwrap();
      
      // Refresh the saved stages
      await dispatch(getJobSelectionProcess(selectedJob.id)).unwrap();
      // refresh the job list to get updated has_configured_stages
      await dispatch(getJobsByRecruiterId(recruiterId)).unwrap();
      
      // ✅ Navigate to hiring process after successful save
      setTimeout(() => {
        navigate('/recruiter/hiring-process');
      }, 1500); // Wait 1.5 seconds to show success message
      
    } catch (error) {
      console.error('Failed to save selection process:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasExistingStages = jobStages && jobStages.length > 0;

  // Format salary helper
  const formatSalary = (job) => {
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`;
    }
    if (job.salary) return job.salary;
    return 'Not disclosed';
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // No jobs state
  if (!recruiterJobs || recruiterJobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Selection Process</h1>
            <p className="text-sm text-gray-600 mt-1">Configure hiring stages for your job posts</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                No Jobs Available
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                You need to create job postings before you can configure selection stages.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Job list view (when no job is selected)
  if (!selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Selection Process</h1>
            <p className="text-sm text-gray-600 mt-1">Configure hiring stages for your job posts</p>
          </div>

          <div className="grid gap-4">
            {recruiterJobs.map((job) => {
              const jobCompany = job.company || company;
              const jobHasStages = job.has_configured_stages === true && job.configured_stages_count > 0;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Section - Job Info */}
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Company Logo */}
                        <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {jobCompany?.logo_url ? (
                            <img
                              src={jobCompany.logo_url}
                              alt={jobCompany.company_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                              {jobCompany?.company_name?.charAt(0) || 'C'}
                            </div>
                          )}
                        </div>

                        {/* Job Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {job.job_title || job.title || 'Untitled Job'}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {jobCompany?.company_name || 'Company'} • {job.location || job.job_location || 'Location not specified'}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{job.employment_type || job.job_type || 'Full-time'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{formatSalary(job)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(job.created_at)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                              {job.applications_count || job.applicants || 0} applicants
                            </span>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              job.status === 'active' || job.job_status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {job.status === 'active' || job.job_status === 'active' ? 'Active' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Action Button */}
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium whitespace-nowrap"
                      >
                        {jobHasStages ? 'Update Stages' : 'Configure Stages'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Stage configuration view (when a job is selected)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <button
            onClick={() => {
              setSelectedJob(null);
              setSelectedStages([]);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Jobs
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedJob.job_title || selectedJob.title || 'Untitled Job'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{hasExistingStages ? 'Update Interview Stages' : 'Select Interview Stages'}</p>
            </div>
            <button
              onClick={handleSaveProcess}
              disabled={selectedStages.length === 0}
              className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {hasExistingStages ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>{hasExistingStages ? 'Update Process' : 'Save Process'}</>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mx-6 mt-6">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-6 mt-6">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Stages */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Available Stages ({stages.length})
              </h2>
              
              {stages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No stages available</p>
                  <p className="text-gray-400 text-xs mt-1">Contact admin to add selection stages</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {stages.map((stage) => {
                    const Icon = iconMap[stage.icon] || Briefcase;
                    const isSelected = selectedStages.find(s => s.id === stage.id);
                    const hasAccess = canAccessStage(stage);

                    return (
                      <button
                        key={stage.id}
                        onClick={() => handleStageSelect(stage)}
                        disabled={isSelected}
                        className={`w-full text-left rounded-xl p-4 border-2 transition-all ${
                          isSelected
                            ? 'border-teal-300 bg-teal-50 opacity-50 cursor-not-allowed'
                            : hasAccess
                            ? 'border-gray-200 hover:border-teal-400 hover:shadow-md cursor-pointer'
                            : 'border-amber-200 bg-amber-50 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            hasAccess ? 'bg-teal-100' : 'bg-amber-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              hasAccess ? 'text-teal-600' : 'text-amber-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-gray-900">{stage.name}</h3>
                              {stage.requiresPremium && !hasAccess && (
                                <Lock className="w-4 h-4 text-amber-500" />
                              )}
                              {isSelected && (
                                <CheckCircle className="w-4 h-4 text-teal-600" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{stage.description}</p>
                            {stage.duration && (
                              <p className="text-xs text-gray-500">Duration: {stage.duration}</p>
                            )}
                            {stage.requiresPremium && !hasAccess && (
                              <div className="flex items-center gap-2 mt-2">
                                <Crown className="w-3 h-3 text-amber-600" />
                                <span className="text-xs font-medium text-amber-700">
                                  Requires {stage.tier} plan
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Selected Stages */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Selected Stages ({selectedStages.length})
              </h2>

              {selectedStages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No stages selected yet</p>
                  <p className="text-gray-400 text-xs mt-1">Click on stages from the left to add them</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {selectedStages.map((stage, index) => {
                      const Icon = iconMap[stage.icon] || Briefcase;
                      return (
                        <div
                          key={stage.id}
                          className="bg-teal-50 rounded-xl p-4 border-2 border-teal-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => moveStage(index, 'up')}
                                disabled={index === 0}
                                className="p-1 hover:bg-teal-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <ArrowUp className="w-4 h-4 text-teal-700" />
                              </button>
                              <button
                                onClick={() => moveStage(index, 'down')}
                                disabled={index === selectedStages.length - 1}
                                className="p-1 hover:bg-teal-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <ArrowDown className="w-4 h-4 text-teal-700" />
                              </button>
                            </div>

                            <div className="flex items-center justify-center w-8 h-8 bg-teal-600 text-white rounded-full font-bold text-sm flex-shrink-0">
                              {index + 1}
                            </div>

                            <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                              <Icon className="w-5 h-5 text-teal-600" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900">{stage.name}</h3>
                              <p className="text-xs text-gray-600 mt-1">{stage.duration}</p>
                            </div>

                            <button
                              onClick={() => removeStage(stage.id)}
                              className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Process Order</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Candidates will go through these stages in the order shown above. Use arrows to reorder.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <PremiumRequiredModal
          isOpen={showPremiumModal}
          onClose={() => {
            setShowPremiumModal(false);
            setPendingStage(null);
          }}
          requiredTier={pendingStage?.tier}
          stageName={pendingStage?.name}
        />
      )}
    </div>
  );
};

export default RecruiterSelectionStages;