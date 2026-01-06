import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, FileText, Phone, Video, Users, CheckCircle, Award, Briefcase, Calendar, Eye, Clock, X, Filter, Loader2, DollarSign, Settings, Play, XCircle, TrendingUp, CheckSquare, ChevronRight, Pause, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getJobsByRecruiterId } from '../../../redux/slices/jobSlice';
import { getJobSelectionProcess } from '../../../redux/slices/selectionStageSlice';
import { fetchJobApplications } from '../../../redux/slices/applicationSlice';
import ATSConfigurationModal from '../../../modals/ATSConfigurationModal';
import CandidateDetailModal from '../../../modals/CandidateDetailModal';
import { useWebSocket } from '../../../hooks/useWebSocket';
import {
  startBulkScreening,
  getScreeningProgress,
  getScreeningResults,
  moveToNextStage,
  pauseScreening,
  resetScreening,
  clearError,
  clearSuccessMessage,
  getATSConfig,
  updateProgressFromWebSocket,
} from '../../../redux/slices/resumeScreeningSlice';

const RecruiterHiringProcess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Selectors
  const { recruiterJobs, loading } = useSelector((state) => state.job);
  const { company } = useSelector((state) => state.company);
  const { jobApplications, loading: applicationsLoading } = useSelector((state) => state.application);
  const recruiterId = useSelector((state) => state.auth.user?.id);
  const { jobStages, loading: stageLoading } = useSelector((state) => state.selectionStage);
  
  // Resume Screening Redux State
  const {
    atsConfig,
    atsConfigLoading,
    screeningProgress,
    screeningInProgress,
    progressLoading,
    screeningResults,
    resultsLoading,
    loading: screeningLoading,
    error: screeningError,
    successMessage,
  } = useSelector((state) => state.resumeScreener);

  // WebSocket
  const { socket, isConnected } = useWebSocket();

  // Local State
  const [selectedJob, setSelectedJob] = useState(null);
  const [expandedStage, setExpandedStage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [screeningCandidates, setScreeningCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [atsConfigured, setAtsConfigured] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [lastProgressStatus, setLastProgressStatus] = useState(null);
  const [progressBarAutoHideTimer, setProgressBarAutoHideTimer] = useState(null);

  
  // Modals
  const [showATSConfig, setShowATSConfig] = useState(false);
  const [showCandidateDetail, setShowCandidateDetail] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // ==================== WebSocket Listeners ====================
  useEffect(() => {
    if (!socket || !isConnected || !selectedJob) {
      console.log('❌ No socket, not connected, or no selected job');
      return;
    }

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 WebSocket message received:', data);
        
        const messageJobId = data.job_id || data.data?.job_id;
        console.log('🔍 Message job_id:', messageJobId, 'Selected job:', selectedJob?.id);
        
        // ✅ Handle bulk_screening_started
        if (data.type === 'bulk_screening_started' && data.job_id === selectedJob?.id) {
          console.log('🚀 Bulk screening started');
          setShowProgressBar(true);
          // Clear any existing auto-hide timer
          if (progressBarAutoHideTimer) {
            clearTimeout(progressBarAutoHideTimer);
            setProgressBarAutoHideTimer(null);
          }
        }
        
        // ✅ Handle screening_progress
        if (data.type === 'screening_progress' && data.job_id === selectedJob?.id) {
          console.log('✅ Processing screening_progress message');
          dispatch(updateProgressFromWebSocket(data.progress));

          setShowProgressBar(true);
          
          // Clear any existing auto-hide timer
          if (progressBarAutoHideTimer) {
            clearTimeout(progressBarAutoHideTimer);
            setProgressBarAutoHideTimer(null);
          }

          // ✅ Handle completion
          if (data.progress.status === 'completed' && lastProgressStatus !== 'completed') {
            console.log('🎉 Screening completed! Refreshing data...');
            
            // ✅ Add delay to ensure backend has saved all data
            setTimeout(async () => {
              await dispatch(fetchJobApplications({ 
                jobId: selectedJob.id, 
                status: null 
              })).unwrap();
              
              // ✅ Also fetch screening results
              await dispatch(getScreeningResults({ 
                jobId: selectedJob.id, 
                filters: {} 
              })).unwrap();
            }, 1000);

            // Set auto-hide timer
            const timer = setTimeout(() => {
              console.log('⏱️ Auto-hiding progress bar');
              setShowProgressBar(false);
            }, 5000);
            
            setProgressBarAutoHideTimer(timer);
          }

          setLastProgressStatus(data.progress.status);
        }
        
        // ✅ Handle screening_progress_update
        if (data.type === 'screening_progress_update' && data.job_id === selectedJob?.id) {
          console.log('📊 Screening progress update:', data);
          // Optionally update progress here if needed
        }
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => {
      socket.removeEventListener('message', handleMessage);
      // Cleanup timer on unmount
      if (progressBarAutoHideTimer) {
        clearTimeout(progressBarAutoHideTimer);
      }
    };
  }, [socket, isConnected, selectedJob, lastProgressStatus, dispatch, progressBarAutoHideTimer]);

useEffect(() => {
    if (screeningProgress && selectedJob) {
      const shouldShow = screeningProgress.status === 'in_progress' || 
                        screeningProgress.status === 'paused' ||
                        (screeningProgress.status === 'completed' && showProgressBar);
      
      if (shouldShow && !showProgressBar) {
        setShowProgressBar(true);
      }
    }
  }, [screeningProgress, selectedJob]);

  // ==================== Initial Data Fetch ====================
  useEffect(() => {
    if (recruiterId) {
      dispatch(getJobsByRecruiterId(recruiterId));
    }
  }, [recruiterId, dispatch]);

  useEffect(() => {
    if (selectedJob) {
      dispatch(getJobSelectionProcess(selectedJob.id));
      dispatch(fetchJobApplications({ jobId: selectedJob.id, status: null }));
      checkAtsConfiguration();
    }
  }, [selectedJob, dispatch]);

  // ==================== Set First Stage as Expanded ====================
  useEffect(() => {
    if (jobStages && jobStages.length > 0 && !expandedStage) {
      const firstStage = jobStages[0];
      setExpandedStage(firstStage.id);
    }
  }, [jobStages]);

  // ==================== Fetch Stage Data When Stage Changes ====================
  useEffect(() => {
    if (selectedJob && expandedStage && jobStages) {
      const currentStage = jobStages.find(s => s.id === expandedStage);
      if (currentStage?.slug === 'resume-screening') {
        fetchScreeningData();
      }
    }
  }, [expandedStage, selectedJob, filterStatus]);

  // ==================== Transform Applications to Candidates ====================
  useEffect(() => {
  if (jobApplications && jobApplications.length > 0) {
    const transformed = jobApplications.map(app => ({
      application_id: app.id,
      candidate: {
        name: `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Unknown',
        email: app.email || 'No email',
      },
      decision: app.screening_decision || 'pending', 
      scores: app.screening_scores || {  
        overall: 0,
        skills: 0,
        experience: 0,
        education: 0,
        keywords: 0,
      },
      details: app.screening_details || null,  
      screened_at: app.screened_at || null, 
      current_stage: app.current_stage,
      status: app.status,
      is_screened: !!(app.screening_decision && app.screened_at)
    }));
    
    setScreeningCandidates(transformed);
  } else {
    setScreeningCandidates([]);
  }
}, [jobApplications]);

  // ==================== Error & Success Handling ====================
  useEffect(() => {
    if (screeningError) {
      alert(`Error: ${screeningError}`);
      dispatch(clearError());
    }
  }, [screeningError, dispatch]);

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, dispatch]);

  // ==================== ATS Configuration Check ====================
  const checkAtsConfiguration = useCallback(async () => {
    if (!selectedJob) return;
    
    try {
      const result = await dispatch(getATSConfig(selectedJob.id)).unwrap();
      // Check if config exists and is not default
      const isConfigured = result.configured === true || (result.config && !result.is_default);
      console.log('🔍 ATS Config Check:', { result, isConfigured });
      setAtsConfigured(isConfigured);
    } catch (err) {
      console.error('Failed to check ATS configuration:', err);
      setAtsConfigured(false);
    }
  }, [selectedJob, dispatch]);

  // ==================== Fetch Screening Data ====================
  const fetchScreeningData = useCallback(async () => {
    if (!selectedJob) return;
    
    try {
      // Fetch progress
      await dispatch(getScreeningProgress(selectedJob.id)).unwrap();
      
      // Fetch applications
      await dispatch(fetchJobApplications({ 
        jobId: selectedJob.id, 
        status: filterStatus === 'all' ? null : filterStatus 
      })).unwrap();
    } catch (err) {
      console.error('Failed to fetch screening data:', err);
    }
  }, [selectedJob, filterStatus, dispatch]);

  // ==================== Start Screening ====================
  const handleStartScreening = async (restart=false) => {
    if (!atsConfigured) {
      alert('Please configure ATS settings before starting screening.');
      setShowATSConfig(true);
      return;
    }

    const message = restart
      ? 'Restart screening for failed or pending candidates?'
      : 'Start automated resume screening for all applicants?';

    if (!window.confirm(message)) return;

    try {
      setShowProgressBar(true);
      await dispatch(startBulkScreening(selectedJob.id)).unwrap();
      // Progress will be updated via WebSocket
      fetchScreeningData();
    } catch (err) {
      console.error('Failed to start screening:', err);
    }
  };

  // ==================== Pause Screening ====================
  const handlePauseScreening = async () => {
    if (!window.confirm('Pause the screening process?')) return;

    try {
      await dispatch(pauseScreening(selectedJob.id)).unwrap();
      fetchScreeningData();
    } catch (err) {
      console.error('Failed to pause screening:', err);
    }
  };

  // ==================== Reset Screening ====================
const handleResetScreening = async () => {
  if (!window.confirm('⚠️ This will clear all screening results and start fresh. Continue?')) {
    return;
  }

  try {
    await dispatch(resetScreening(selectedJob.id)).unwrap();
    setSelectedCandidates([]);
    setShowProgressBar(false);
    if (progressBarAutoHideTimer) {
        clearTimeout(progressBarAutoHideTimer);
        setProgressBarAutoHideTimer(null);
      }
    fetchScreeningData();
  } catch (err) {
    console.error('Failed to reset screening:', err);
  }
};

  // ==================== Candidate Selection ====================
  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    const qualifiedCandidates = screeningCandidates.filter(c => c.decision === 'qualified');
    if (selectedCandidates.length === qualifiedCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(qualifiedCandidates.map(c => c.application_id));
    }
  };

  // ==================== Move to Next Stage ====================
  const handleProceedToNextRound = async () => {
    if (selectedCandidates.length === 0) {
      alert('Please select candidates to proceed');
      return;
    }

    if (!window.confirm(`Move ${selectedCandidates.length} candidate(s) to next round?`)) {
      return;
    }

    try {
      await dispatch(moveToNextStage({ 
        applicationIds: selectedCandidates,
        feedback: 'Passed resume screening' 
      })).unwrap();
      
      setSelectedCandidates([]);
      fetchScreeningData();
    } catch (err) {
      console.error('Failed to move candidates:', err);
    }
  };

  // ==================== Utility Functions ====================
  const getStageIcon = (iconName) => {
    const icons = { FileText, Phone, Video, Users, CheckCircle, Award, Briefcase };
    return icons[iconName] || FileText;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      qualified: { text: 'Qualified', color: 'bg-green-100 text-green-700' },
      rejected: { text: 'Rejected', color: 'bg-red-100 text-red-700' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatSalary = (job) => {
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`;
    }
    if (job.salary) return job.salary;
    return 'Not disclosed';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // ==================== Computed Values ====================
  const qualifiedCount = screeningCandidates.filter(c => c.decision === 'qualified').length;
  const rejectedCount = screeningCandidates.filter(c => c.decision === 'rejected').length;
  const pendingCount = screeningCandidates.filter(c => c.decision === 'pending').length;
  const avgScore = screeningCandidates.length > 0
    ? Math.round(screeningCandidates.reduce((sum, c) => sum + c.scores.overall, 0) / screeningCandidates.length)
    : 0;

  // ==================== Loading States ====================
  if (loading || applicationsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {loading ? 'Loading jobs...' : 'Loading applications...'}
          </p>
        </div>
      </div>
    );
  }

  // ==================== No Jobs State ====================
  if (!recruiterJobs || recruiterJobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Round Summary</h1>
            <p className="text-sm text-gray-600 mt-1">Manage candidates across interview stages</p>
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
                You need to create job postings before you can manage the hiring process.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== Job List View ====================
  if (!selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Round Summary</h1>
            <p className="text-sm text-gray-600 mt-1">Manage candidates across interview stages</p>
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
                      <div className="flex items-start space-x-4 flex-1">
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
                            {jobHasStages && (
                              <span className="text-sm text-gray-600">
                                {job.configured_stages_count} stages configured
                              </span>
                            )}
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

                      <button
                        onClick={() => setSelectedJob(job)}
                        disabled={!jobHasStages}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {jobHasStages ? 'View Stages' : 'Configure Stages First'}
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

  // ==================== Stages Loading ====================
  if (stageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading stages...</p>
        </div>
      </div>
    );
  }

  // ==================== No Stages Configured ====================
  if (!jobStages || jobStages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedJob(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Jobs
          </button>

          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">No Stages Configured</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                This job doesn't have any interview stages configured yet. Please configure stages first.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedStage = jobStages.find(s => s.id === expandedStage);
  const isResumeScreeningStage = selectedStage?.slug === 'resume-screening';
  const stageCandidates = isResumeScreeningStage ? screeningCandidates : [];

  // ==================== Main Stage View ====================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <button
            onClick={() => setSelectedJob(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Jobs
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedJob.job_title} — Round Summary</h1>
              <p className="text-sm text-gray-600 mt-1">{selectedJob.location}</p>
            </div>
            {isResumeScreeningStage && (
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchScreeningData}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={progressLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${progressLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={() => setShowATSConfig(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4" />
                  {atsConfigured ? 'Edit ATS Config' : 'Configure ATS'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Screening Progress Bar */}
        {isResumeScreeningStage && 
        screeningProgress && 
        screeningProgress.status !== 'not_started' && 
        showProgressBar && (  // ✅ Add showProgressBar condition
          <div className="px-6 pb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
              {/* ✅ Close Button */}
              <button
                onClick={() => setShowProgressBar(false)}
                className="absolute top-2 right-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
                title="Close"
              >
                <X className="w-4 h-4 text-blue-700" />
              </button>
              
              <div className="flex items-center justify-between mb-2 pr-8">
                <span className="text-sm font-medium text-blue-900">
                  {screeningInProgress ? '🔄 Screening in Progress...' : 
                  screeningProgress.status === 'completed' ? '✅ Screening Completed' : 
                  screeningProgress.status === 'paused' ? '⏸️ Screening Paused' : 
                  '📊 Screening Status'}
                </span>
                <span className="text-sm font-semibold text-blue-900">
                  {screeningProgress.screened_applications} / {screeningProgress.total_applications} 
                  ({screeningProgress.percentage?.toFixed(1) || 0}%)
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${screeningProgress.percentage || 0}%` }}
                />
              </div>
              
              {/* ✅ Auto-hide notice */}
              {screeningProgress.status === 'completed' && (
                <p className="text-xs text-blue-600 mt-2 text-center">
                  Auto-hiding in 3 seconds...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Stage Tabs */}
        <div className="px-6 overflow-x-auto">
          <div className="flex gap-2 pb-4">
            {jobStages.map((stage) => {
              const Icon = getStageIcon(stage.icon?.name);
              const isActive = expandedStage === stage.id;
              
              return (
                <button
                  key={stage.id}
                  onClick={() => setExpandedStage(stage.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all min-w-fit ${
                    isActive
                      ? 'bg-teal-50 border-teal-600 text-teal-900'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-teal-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-gray-500'}`} />
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{stage.name}</span>
                    </div>
                    {isActive && isResumeScreeningStage && (
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-600">{screeningCandidates.length} Total</span>
                        <span className="text-xs text-green-600">{qualifiedCount} Qualified</span>
                        <span className="text-xs text-red-600">{rejectedCount} Rejected</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {isResumeScreeningStage && screeningCandidates.length > 0 && (
        <div className="px-6 py-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Screened</p>
                  <p className="text-2xl font-bold text-gray-900">{screeningCandidates.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Qualified</p>
                  <p className="text-2xl font-bold text-green-600">{qualifiedCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Score</p>
                  <p className="text-2xl font-bold text-gray-900">{avgScore}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage Content */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Stage Header with Actions */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedStage?.name}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {isResumeScreeningStage 
                    ? `${stageCandidates.length} candidates ${screeningProgress?.status === 'completed' ? 'screened' : 'in queue'}`
                    : `Manage candidates in ${selectedStage?.name}`
                  }
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isResumeScreeningStage && (
                  <>
                    {/* ▶ Start - Show when not started */}
                    {!screeningInProgress && 
                    screeningProgress?.status === 'not_started' && (
                      <button
                        onClick={() => handleStartScreening(false)}
                        disabled={screeningLoading || !atsConfigured}
                        className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {screeningLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            {!atsConfigured ? 'Configure ATS First' : 'Start Screening'}
                          </>
                        )}
                      </button>
                    )}

                    {/* 🔄 Restart - Show when paused or failed */}
                    {!screeningInProgress &&
                    (screeningProgress?.status === 'paused' || screeningProgress?.status === 'failed') && (
                      <button
                        onClick={() => handleStartScreening(true)}
                        disabled={screeningLoading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Restart Screening
                      </button>
                    )}

                    {/* ⏸ Pause - Show when in progress */}
                    {screeningInProgress && (
                      <button
                        onClick={handlePauseScreening}
                        disabled={screeningLoading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
                      >
                        <Pause className="w-5 h-5" />
                        Pause Screening
                      </button>
                    )}

                    {/* 🔁 Reset - Show when completed, paused, or failed (NOT in progress) */}
                    {!screeningInProgress &&
                    (screeningProgress?.status === 'completed' ||
                      screeningProgress?.status === 'paused' ||
                      screeningProgress?.status === 'failed') && (
                      <button
                        onClick={handleResetScreening}
                        disabled={screeningLoading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                      >
                        <XCircle className="w-5 h-5" />
                        Reset Screening
                      </button>
                    )}

                    {/* ➡ Proceed - Show when completed AND candidates selected */}
                    {screeningProgress?.status === 'completed' && 
                      screeningCandidates.some(c => c.is_screened && c.decision === 'qualified') && (
                        <button
                          onClick={handleProceedToNextRound}
                          disabled={screeningLoading || selectedCandidates.length === 0}
                          className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:bg-gray-400"
                        >
                          <ChevronRight className="w-5 h-5" />
                          {selectedCandidates.length > 0 
                            ? `Proceed ${selectedCandidates.length} to Next Round`
                            : 'Select Candidates to Proceed'}
                        </button>
                      )}
                    {/* Filters - Always show if candidates exist */}
                    {screeningCandidates.length > 0 && (
                      <>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="all">All Candidates</option>
                          <option value="qualified">Qualified Only</option>
                          <option value="rejected">Rejected Only</option>
                          <option value="pending">Pending Only</option>
                        </select>

                        {qualifiedCount > 0 && (
                          <button
                            onClick={handleSelectAll}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            <CheckSquare className="w-4 h-4" />
                            {selectedCandidates.length === qualifiedCount ? 'Deselect All' : 'Select All Qualified'}
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Candidates List */}
          <div className="divide-y divide-gray-200">
            {resultsLoading || progressLoading ? (
              <div className="px-6 py-12 text-center">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading candidates...</p>
              </div>
            ) : stageCandidates.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {isResumeScreeningStage 
                    ? (!atsConfigured 
                        ? 'Configure ATS settings to start screening candidates.'
                        : screeningProgress?.status === 'not_started'
                        ? 'No screening started yet. Click "Start Screening" to begin.'
                        : 'No candidates match the current filter.')
                    : 'No candidates in this stage yet.'
                  }
                </p>
                {isResumeScreeningStage && !atsConfigured && (
                  <button
                    onClick={() => setShowATSConfig(true)}
                    className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                  >
                    Configure ATS Now
                  </button>
                )}
              </div>
            ) : (
              stageCandidates.map((candidate) => (
                <div key={candidate.application_id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Checkbox for qualified candidates */}
                    {isResumeScreeningStage && candidate.decision === 'qualified' && (
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.application_id)}
                        onChange={() => handleSelectCandidate(candidate.application_id)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                    )}

                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {candidate.candidate.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Candidate Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">{candidate.candidate.name}</h3>
                        {isResumeScreeningStage && getStatusBadge(candidate.decision)}
                      </div>
                      <p className="text-sm text-gray-600">{candidate.candidate.email}</p>
                      {candidate.screened_at && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Screened {new Date(candidate.screened_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>

                    {/* Scores (Resume Screening only) */}
                    {isResumeScreeningStage && candidate.scores && (
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className={`text-2xl font-bold ${
                            candidate.scores.overall >= 70 ? 'text-green-600' : 
                            candidate.scores.overall >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {candidate.scores.overall}
                          </p>
                          <p className="text-xs text-gray-500">Overall</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-teal-600">{candidate.scores.skills}</p>
                          <p className="text-xs text-gray-500">Skills</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-blue-600">{candidate.scores.experience}</p>
                          <p className="text-xs text-gray-500">Experience</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-purple-600">{candidate.scores.education}</p>
                          <p className="text-xs text-gray-500">Education</p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <button
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setShowCandidateDetail(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ATSConfigurationModal
        isOpen={showATSConfig}
        onClose={() => setShowATSConfig(false)}
        jobId={selectedJob?.id}
        onSave={() => {
          setShowATSConfig(false);
          checkAtsConfiguration();
        }}
      />

      <CandidateDetailModal
        isOpen={showCandidateDetail}
        onClose={() => {
          setShowCandidateDetail(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate}
      />
    </div>
  );
};

export default RecruiterHiringProcess;