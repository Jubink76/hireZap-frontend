import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, FileText, Phone, Video, Users, CheckCircle, Award, Briefcase, Calendar, DollarSign, Loader2, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ResumeScreeningStage from '../stages/ResumeScreeningStage';
import TelephoneScreeningStage from '../stages/TelephoneScreeningStage';

import { getJobsByRecruiterId } from '../../../redux/slices/jobSlice';
import { getJobSelectionProcess } from '../../../redux/slices/selectionStageSlice';
import { fetchJobApplications } from '../../../redux/slices/applicationSlice';
import { useWebSocket } from '../../../hooks/useWebSocket';
import {
  getScreeningProgress,
  getScreeningResults,
  clearError,
  clearSuccessMessage,
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
    error: screeningError,
    successMessage,
  } = useSelector((state) => state.resumeScreener);

  // WebSocket
  const { socket, isConnected } = useWebSocket();

  // Local State
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [expandedStage, setExpandedStage] = useState(null);
  const [screeningCandidates, setScreeningCandidates] = useState([]);
  const [lastProgressStatus, setLastProgressStatus] = useState(null);

  // ==================== WebSocket Listeners ====================
  useEffect(() => {
    if (!socket || !isConnected || !selectedJob) {
      return;
    }

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 WebSocket message received:', data);
        
        if (data.type === 'screening_progress' && data.job_id === selectedJob?.id) {
          console.log('✅ Processing screening_progress message');
          dispatch(updateProgressFromWebSocket(data.progress));

          if (data.progress.status === 'completed' && lastProgressStatus !== 'completed') {
            console.log('🎉 Screening completed! Refreshing data...');
            
            setTimeout(async () => {
              await dispatch(fetchJobApplications({ 
                jobId: selectedJob.id, 
                status: null 
              })).unwrap();
              
              await dispatch(getScreeningResults({ 
                jobId: selectedJob.id, 
                filters: {} 
              })).unwrap();
            }, 1000);
          }

          setLastProgressStatus(data.progress.status);
        }
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket, isConnected, selectedJob, lastProgressStatus, dispatch]);

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
    }
  }, [selectedJob, dispatch]);

  // ==================== Set Default Stage Based on Current Working Stage ====================
  useEffect(() => {
    if (jobStages && jobStages.length > 0 && jobApplications && jobApplications.length > 0 && !expandedStage) {
      // Find the FIRST stage (in order) that has candidates
      // This represents the "current working stage" - the active stage in the pipeline
      let defaultStage = null;

      for (const stage of jobStages) {
        const candidatesInStage = jobApplications.filter(app => 
          app.current_stage?.id === stage.stage?.id || 
          app.current_stage?.slug === stage.slug
        );

        if (candidatesInStage.length > 0) {
          defaultStage = stage;
          console.log('🎯 Current working stage:', stage.name, 'with', candidatesInStage.length, 'candidates');
          break; // Stop at the first stage with candidates
        }
      }

      // If no stage has candidates, default to first stage
      if (!defaultStage) {
        defaultStage = jobStages[0];
        console.log('📍 No candidates yet, defaulting to first stage:', defaultStage.name);
      }

      setExpandedStage(defaultStage.id);
    } else if (jobStages && jobStages.length > 0 && !expandedStage) {
      // Fallback to first stage if no applications yet
      console.log('📍 No applications, defaulting to first stage:', jobStages[0].name);
      setExpandedStage(jobStages[0].id);
    }
  }, [jobStages, jobApplications, expandedStage]);

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
        current_stage_status: app.current_stage_status,
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

  // ==================== Fetch Screening Data ====================
  const fetchScreeningData = useCallback(async () => {
    if (!selectedJob) return;
    
    try {
      await dispatch(getScreeningProgress(selectedJob.id)).unwrap();
      await dispatch(fetchJobApplications({ 
        jobId: selectedJob.id, 
        status: filterStatus === 'all' ? null : filterStatus 
      })).unwrap();
    } catch (err) {
      console.error('Failed to fetch screening data:', err);
    }
  }, [selectedJob, filterStatus, dispatch]);

  // ==================== Get Stage-Specific Stats ====================
  const getStageStats = useCallback((stage) => {
    if (!stage || !jobApplications) return { total: 0, qualified: 0, rejected: 0, pending: 0 };

    const candidatesInStage = jobApplications.filter(app => 
      app.current_stage?.id === stage.stage?.id || 
      app.current_stage?.slug === stage.slug
    );

    // For resume screening stage
    if (stage.slug === 'resume-screening') {
      return {
        total: candidatesInStage.length,
        qualified: candidatesInStage.filter(c => c.screening_decision === 'qualified').length,
        rejected: candidatesInStage.filter(c => c.screening_decision === 'rejected').length,
        pending: candidatesInStage.filter(c => c.screening_decision === 'pending').length,
      };
    }

    // For other stages (telephonic, technical, etc.)
    return {
      total: candidatesInStage.length,
      qualified: candidatesInStage.filter(c => c.current_stage_status === 'qualified').length,
      rejected: candidatesInStage.filter(c => c.current_stage_status === 'rejected').length,
      pending: candidatesInStage.filter(c => 
        c.current_stage_status === 'pending' || !c.current_stage_status
      ).length,
    };
  }, [jobApplications]);

  // ==================== Get Candidates for Current Stage ====================
  const getCandidatesForStage = useCallback((stage) => {
    if (!stage || !screeningCandidates) return [];

    return screeningCandidates.filter(candidate => 
      candidate.current_stage?.id === stage.stage?.id || 
      candidate.current_stage?.slug === stage.slug
    );
  }, [screeningCandidates]);

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
  const selectedStage = jobStages?.find(s => s.id === expandedStage);
  const currentStageCandidates = selectedStage ? getCandidatesForStage(selectedStage) : [];
  const currentStageStats = selectedStage ? getStageStats(selectedStage) : { total: 0, qualified: 0, rejected: 0, pending: 0 };

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
          </div>
        </div>

        {/* Stage Tabs */}
        <div className="px-6 overflow-x-auto">
          <div className="flex gap-2 pb-4">
            {jobStages.map((stage) => {
              const Icon = getStageIcon(stage.icon?.name);
              const isActive = expandedStage === stage.id;
              const stageStats = getStageStats(stage);
              
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
                    {/* ✅ Show stats for ALL stages when active */}
                    {isActive && stageStats.total > 0 && (
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-600">{stageStats.total} Total</span>
                        {stageStats.qualified > 0 && (
                          <span className="text-xs text-green-600">{stageStats.qualified} Qualified</span>
                        )}
                        {stageStats.rejected > 0 && (
                          <span className="text-xs text-red-600">{stageStats.rejected} Rejected</span>
                        )}
                        {stageStats.pending > 0 && (
                          <span className="text-xs text-yellow-600">{stageStats.pending} Pending</span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      
        <div className="px-6 pb-6">
          {/* Stage-Specific Components */}
          {selectedStage?.slug === 'resume-screening' ? (
            <ResumeScreeningStage
              jobId={selectedJob.id}
              candidates={currentStageCandidates}
              onRefresh={fetchScreeningData}
              onMoveToNext={() => {
                const currentIndex = jobStages.findIndex(s => s.id === expandedStage);
                if (currentIndex !== -1 && currentIndex < jobStages.length - 1) {
                  setExpandedStage(jobStages[currentIndex + 1].id);
                }
              }}
            />
          ) : selectedStage?.slug === 'telephonic-round' ? (
            <TelephoneScreeningStage 
              jobId={selectedJob.id}
              onRefresh={fetchScreeningData}
              onMoveToNext={() => {
                const currentIndex = jobStages.findIndex(s => s.id === expandedStage);
                if (currentIndex !== -1 && currentIndex < jobStages.length - 1) {
                  setExpandedStage(jobStages[currentIndex + 1].id);
                }
              }}
            />
          ) : (
            // Default stage view for other stages
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{selectedStage?.name}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {currentStageCandidates.length} candidates in this stage
                </p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {currentStageCandidates.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No candidates in this stage yet.</p>
                  </div>
                ) : (
                  currentStageCandidates.map((candidate) => (
                    <div key={candidate.application_id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {candidate.candidate.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{candidate.candidate.name}</h3>
                            <p className="text-sm text-gray-600">{candidate.candidate.email}</p>
                            {getStatusBadge(candidate.current_stage_status || 'pending')}
                          </div>
                        </div>
                        <button
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterHiringProcess;