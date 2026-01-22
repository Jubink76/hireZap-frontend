import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Phone, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  Play,
  Settings,
  RefreshCw,
  Eye,
  Users,
  TrendingUp,
  CheckSquare,
  ChevronRight,
  Edit,
  Loader2,
  PhoneOff,
  XCircle
} from 'lucide-react';

import {
  fetchTelephonicSettings,
  updateTelephonicSettings,
  fetchTelephonicCandidates,
  fetchTelephonicStats,
  scheduleInterview,
  startCall,
  moveToNextStage,
  toggleCandidateSelection,
  clearSelectedCandidates,
  setFilterStatus,
  clearError,
  clearSuccessMessage,
} from '../../../redux/slices/telephonicSlice';

import ScheduleInterviewModal from '../../../modals/ScheduleInterviewModal';
import TelephoneConfigModal from '../../../modals/TelephoneConfigModal';
import TelephonicCandidateDetailModal from '../../../modals/TelephonicRoundCandidateDetailModal';
import InterviewCallInterface from '../../../modals/InterviewCallInterface';

import { notify } from '../../../utils/toast';

const TelephoneScreeningStage = ({ jobId, onRefresh, onMoveToNext }) => {
  const dispatch = useDispatch();

  const {
    settings,
    settingsLoading,
    candidates,
    candidatesLoading,
    stats,
    selectedCandidates,
    filterStatus,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.telephonic);

  // Local state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCallInterface, setShowCallInterface] = useState(false);
  
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeInterview, setActiveInterview] = useState(null);
  const [isCallMinimized, setIsCallMinimized] = useState(false);

  // ==================== POLLING & AUTO-RESTORE ====================
  // Polling for interview status updates when call is active
  useEffect(() => {
    if (activeInterview) {
      const pollInterval = setInterval(() => {
        console.log('🔄 Polling for interview updates...');
        dispatch(fetchTelephonicCandidates({ jobId, statusFilter: null }));
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(pollInterval);
    }
  }, [activeInterview, jobId, dispatch]);

  // Auto-restore call interface for active interviews on page load/refresh
  useEffect(() => {
    if (candidates && candidates.length > 0) {
      const activeCall = candidates.find(
        c => (c.status === 'in_progress' || c.status === 'joined') && c.interview_id
      );
      
      if (activeCall) {
        console.log('🔍 Found active call on load:', activeCall);
        
        // Only set if we don't already have this interview active
        if (!activeInterview || activeInterview.interview_id !== activeCall.interview_id) {
          setActiveInterview({
            interview_id: activeCall.interview_id,
            session_id: activeCall.session_id,
            candidate_name: activeCall.candidate?.name,
            candidate_email: activeCall.candidate?.email,
            job_title: 'Position', // You can add this to backend response
            status: activeCall.status,
            scheduled_at: activeCall.scheduled_at
          });
          
          // Auto-show the call interface if it was minimized
          if (!showCallInterface) {
            console.log('📞 Auto-opening call interface for active call');
            setShowCallInterface(true);
            setIsCallMinimized(false);
          }
        }
      } else if (activeInterview && activeInterview.status !== 'completed') {
        // Call ended, clear the active interview
        console.log('✅ Call ended, clearing active interview');
        setActiveInterview(null);
        setShowCallInterface(false);
        setIsCallMinimized(false);
      }
    }
  }, [candidates]);

  // ==================== INITIAL DATA FETCH ====================
  useEffect(() => {
    if (jobId) {
      dispatch(fetchTelephonicSettings(jobId));
      dispatch(fetchTelephonicCandidates({ jobId, statusFilter: null }));
      dispatch(fetchTelephonicStats(jobId));
    }
  }, [jobId, dispatch]);

  // ==================== ERROR & SUCCESS HANDLING ====================
  useEffect(() => {
    if (error) {
      notify.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      notify.success(successMessage);
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, dispatch]);

  // ==================== COMPUTED VALUES ====================
  const scheduledCount = stats?.scheduled || 0;
  const completedCount = stats?.completed || 0;
  const pendingCount = stats?.not_scheduled || 0;
  const avgScore = Math.round(stats?.average_score || 0);
  const qualifiedCount = stats?.qualified || 0;

  const filteredInterviews = candidates.filter(interview => {
    if (filterStatus === 'all') return true;
    return interview.status === filterStatus;
  });

  // ==================== HANDLERS ====================
  const handleRefresh = () => {
    dispatch(fetchTelephonicCandidates({ jobId, statusFilter: null }));
    dispatch(fetchTelephonicStats(jobId));
    if (onRefresh) onRefresh();
  };

  const handleFilterChange = (status) => {
    dispatch(setFilterStatus(status));
    dispatch(fetchTelephonicCandidates({ jobId, statusFilter: status === 'all' ? null : status }));
  };

  const handleSelectCandidate = (interviewId) => {
    dispatch(toggleCandidateSelection(interviewId));
  };

  const handleSelectAll = () => {
    const selectableInterviews = candidates.filter(i => 
      i.overall_score >= (settings?.minimum_qualifying_score || 70) && i.status === 'completed'
    );
    
    if (selectedCandidates.length === selectableInterviews.length) {
      dispatch(clearSelectedCandidates());
    } else {
      selectableInterviews.forEach(interview => {
        if (!selectedCandidates.includes(interview.interview_id)) {
          dispatch(toggleCandidateSelection(interview.interview_id));
        }
      });
    }
  };

  const handleScheduleInterview = async (scheduleData) => {
    try {
      await dispatch(scheduleInterview(scheduleData)).unwrap();
      setShowScheduleModal(false);
      setSelectedCandidate(null);
      handleRefresh();
      notify.success('Interview scheduled successfully');
    } catch (err) {
      notify.error(err.message || 'Failed to schedule interview');
    }
  };

  const handleConfigSave = async (configData) => {
    try {
      const settingsData = {
        job: parseInt(jobId),
        communication_weight: parseInt(configData.communication_weight) || 20,
        technical_knowledge_weight: parseInt(configData.technical_knowledge_weight) || 25,
        problem_solving_weight: parseInt(configData.problem_solving_weight) || 20,
        enthusiasm_weight: parseInt(configData.enthusiasm_weight) || 15,
        clarity_weight: parseInt(configData.clarity_weight) || 10,
        professionalism_weight: parseInt(configData.professionalism_weight) || 10,
        minimum_qualifying_score: parseInt(configData.passing_score) || 70,
        default_duration_minutes: parseInt(configData.default_duration) || 30,
        auto_schedule_enabled: Boolean(configData.enable_auto_recording),
        send_reminders: true,
        reminder_hours_before: 24,
        enable_recording: Boolean(configData.enable_auto_recording),
        enable_transcription: true,
        enable_ai_analysis: true,
      };

      await dispatch(updateTelephonicSettings({ jobId, settingsData })).unwrap();
      setShowConfigModal(false);
      notify.success('Configuration saved successfully');
    } catch (err) {
      notify.error(err.message || 'Failed to save configuration');
    }
  };

  const handleViewDetails = (interview) => {
    setSelectedCandidate(interview);
    setShowDetailsModal(true);
  };

  const handleStartCall = async (interview) => {
    try {
      console.log('📞 Starting call for interview:', interview.interview_id);
      const result = await dispatch(startCall(interview.interview_id)).unwrap();
      
      if (result.success) {
        console.log('✅ Call started, session_id:', result.session_id);
        setActiveInterview({
          interview_id: interview.interview_id,
          session_id: result.session_id,
          candidate_name: interview.candidate?.name,
          candidate_email: interview.candidate?.email,
          job_title: interview.job_title || 'Position',
          status: 'in_progress',
          scheduled_at: interview.scheduled_at
        });
        setShowCallInterface(true);
        setIsCallMinimized(false);
        notify.success('Call started successfully. Waiting for candidate to join...');
        handleRefresh();
      }
    } catch (err) {
      console.error('❌ Failed to start call:', err);
      notify.error(err || 'Failed to start call');
    }
  };

  const handleResumeCall = (interview) => {
    console.log('📞 Resuming call for interview:', interview);
    setActiveInterview({
      interview_id: interview.interview_id,
      session_id: interview.session_id,
      candidate_name: interview.candidate?.name,
      candidate_email: interview.candidate?.email,
      job_title: interview.job_title || 'Position',
      status: interview.status,
      scheduled_at: interview.scheduled_at
    });
    setShowCallInterface(true);
    setIsCallMinimized(false);
  };

  const handleCallInterfaceClose = () => {
    console.log('📦 Minimizing call interface');
    setShowCallInterface(false);
    setIsCallMinimized(true);
    // Don't clear activeInterview - call continues in background
  };

  const handleCallEnd = () => {
    console.log('✅ Call ended successfully');
    setShowCallInterface(false);
    setIsCallMinimized(false);
    setActiveInterview(null);
    handleRefresh();
    notify.success('Interview ended successfully');
  };

  const handleProceedToNextRound = async () => {
    if (selectedCandidates.length === 0) {
      notify.warning('Please select candidates to proceed');
      return;
    }

    if (!window.confirm(`Move ${selectedCandidates.length} candidate(s) to next round?`)) {
      return;
    }

    try {
      await dispatch(moveToNextStage({ 
        interviewIds: selectedCandidates,
        feedback: 'Passed telephonic round with excellent performance'
      })).unwrap();

      handleRefresh();
      
      if (onMoveToNext) {
        onMoveToNext();
      }
    } catch (err) {
      notify.error(err.message || 'Failed to move candidates to next stage');
    }
  };

  // ==================== UTILITY FUNCTIONS ====================
  const canStartCall = (interview) => {
    if (interview.status !== 'scheduled') return false;
    const scheduledTime = new Date(interview.scheduled_at);
    const now = new Date();
    const timeDiff = (now - scheduledTime) / (1000 * 60);
    return timeDiff >= -10 && timeDiff <= 60;
  };

  const getStatusBadge = (status) => {
    const config = {
      not_scheduled: { text: 'Not Scheduled', color: 'bg-gray-100 text-gray-700', icon: AlertCircle },
      scheduled: { text: 'Scheduled', color: 'bg-blue-100 text-blue-700', icon: Calendar },
      in_progress: { text: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: Phone },
      joined: { text: 'Interview Active', color: 'bg-green-100 text-green-700', icon: Phone },
      completed: { text: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      failed: { text: 'Failed', color: 'bg-red-100 text-red-700', icon: XCircle },
    }[status] || { text: status, color: 'bg-gray-100 text-gray-700', icon: AlertCircle };
    
    const Icon = config.icon;
    
    return (
      <span className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const transformCandidateData = (interview) => {
    if (!interview) return null;
    
    return {
      id: interview.application_id || interview.id,
      name: interview.candidate?.name || 'Unknown Candidate',
      email: interview.candidate?.email || 'No email',
      phone: interview.candidate?.phone || 'No phone',
      interview_id: interview.interview_id,
      application_id: interview.application_id
    };
  };

  // ==================== LOADING STATE ====================
  if (candidatesLoading && candidates.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading telephonic round data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Call Indicator - Shows when call is minimized */}
      {isCallMinimized && activeInterview && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Phone className="w-6 h-6 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div>
                <p className="font-semibold">Interview in Progress</p>
                <p className="text-sm text-green-100">
                  {activeInterview.candidate_name} • {activeInterview.status === 'joined' ? 'Connected' : 'Waiting for candidate'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowCallInterface(true);
                setIsCallMinimized(false);
              }}
              className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 font-medium"
            >
              Open Call Interface
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total" value={stats?.total_candidates || 0} color="gray" />
        <StatCard icon={Calendar} label="Scheduled" value={scheduledCount} color="blue" />
        <StatCard icon={CheckCircle} label="Completed" value={completedCount} color="green" />
        <StatCard icon={TrendingUp} label="Avg. Score" value={avgScore} color="orange" />
        <StatCard icon={CheckCircle} label="Qualified" value={qualifiedCount} color="purple" />
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Telephonic Screening</h3>
            <p className="text-sm text-gray-600 mt-1">
              {candidates.length} candidates • {scheduledCount} scheduled • {completedCount} completed
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleRefresh} disabled={candidatesLoading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <RefreshCw className={`w-4 h-4 ${candidatesLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Settings className="w-4 h-4" />
              Configure
            </button>

            {qualifiedCount > 0 && (
              <>
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <CheckSquare className="w-4 h-4" />
                  {selectedCandidates.length > 0 ? 'Deselect All' : 'Select All Qualified'}
                </button>

                <button
                  onClick={handleProceedToNextRound}
                  disabled={selectedCandidates.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400">
                  <ChevronRight className="w-5 h-5" />
                  {selectedCandidates.length > 0 
                    ? `Proceed ${selectedCandidates.length} to Next`
                    : 'Select to Proceed'}
                </button>
              </>
            )}

            <select value={filterStatus} onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="all">All</option>
              <option value="not_scheduled">Not Scheduled</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {filteredInterviews.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No candidates found</p>
          </div>
        ) : (
          filteredInterviews.map((interview) => {
            const isQualified = interview.overall_score >= (settings?.minimum_qualifying_score || 70);
            const isActiveCall = activeInterview?.interview_id === interview.interview_id;
            
            return (
              <div key={interview.interview_id} className={`px-6 py-4 hover:bg-gray-50 ${isActiveCall ? 'bg-green-50' : ''}`}>
                <div className="flex items-center gap-4">
                  {/* Checkbox for qualified candidates */}
                  {interview.status === 'completed' && isQualified && (
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(interview.interview_id)}
                      onChange={() => handleSelectCandidate(interview.interview_id)}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                  )}

                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {interview.candidate?.name?.charAt(0).toUpperCase() || 'C'}
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-semibold text-gray-900">
                        {interview.candidate?.name || 'Unknown'}
                      </h3>
                      {getStatusBadge(interview.status)}
                      {interview.status === 'completed' && interview.overall_score && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          isQualified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {isQualified ? 'Qualified' : 'Not Qualified'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{interview.candidate?.email || 'No email'}</p>
                    
                    {interview.status === 'scheduled' && interview.scheduled_at && (
                      <p className="text-xs text-gray-600 mt-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDateTime(interview.scheduled_at)}
                      </p>
                    )}

                    {interview.status === 'completed' && (
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span>Duration: {interview.actual_duration_seconds ? Math.round(interview.actual_duration_seconds / 60) : 'N/A'} mins</span>
                        {interview.has_recording && (
                          <span className="text-blue-600">• Recording Available</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Score */}
                  {interview.status === 'completed' && interview.overall_score && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{interview.overall_score}</p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {interview.status === 'not_scheduled' && (
                      <button onClick={() => {
                        setSelectedCandidate(interview);
                        setShowScheduleModal(true);
                      }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Schedule
                      </button>
                    )}
                    
                    {interview.status === 'scheduled' && canStartCall(interview) && (
                      <button onClick={() => handleStartCall(interview)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <Play className="w-4 h-4 inline mr-1" />
                        Start Call
                      </button>
                    )}

                    {interview.status === 'scheduled' && !canStartCall(interview) && (
                      <button onClick={() => {
                        setSelectedCandidate(interview);
                        setShowScheduleModal(true);
                      }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                        <Edit className="w-4 h-4 inline mr-1" />
                        Reschedule
                      </button>
                    )}

                    {(interview.status === 'in_progress' || interview.status === 'joined') && (
                      <button onClick={() => handleResumeCall(interview)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 animate-pulse">
                        <PhoneOff className="w-4 h-4 inline mr-1" />
                        {interview.status === 'joined' ? 'Resume Call' : 'Join Call'}
                      </button>
                    )}
                    
                    <button onClick={() => handleViewDetails(interview)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                      <Eye className="w-4 h-4 inline mr-1" />
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setSelectedCandidate(null);
        }}
        candidate={transformCandidateData(selectedCandidate)}
        existingSchedule={selectedCandidate?.status === 'scheduled' ? {
          scheduled_at: selectedCandidate.scheduled_at,
          duration: selectedCandidate.duration,
          timezone: selectedCandidate.timezone,
          notes: selectedCandidate.notes
        } : null}
        onSchedule={handleScheduleInterview}
      />
      
      <TelephoneConfigModal 
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        jobId={jobId}
        existingConfig={settings ? {
          passing_score: settings.minimum_qualifying_score,
          default_duration: settings.default_duration_minutes,
          enable_auto_recording: settings.enable_recording,
          communication_weight: settings.communication_weight,
          technical_knowledge_weight: settings.technical_knowledge_weight,
          problem_solving_weight: settings.problem_solving_weight,
          enthusiasm_weight: settings.enthusiasm_weight,
          clarity_weight: settings.clarity_weight,
          professionalism_weight: settings.professionalism_weight,
        } : null}
        onSave={handleConfigSave}
      />

      <TelephonicCandidateDetailModal 
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate ? {
          ...transformCandidateData(selectedCandidate),
          performance_score: selectedCandidate.overall_score,
          interview_completed_at: selectedCandidate.ended_at,
          interview_scheduled_at: selectedCandidate.scheduled_at,
          call_duration: selectedCandidate.actual_duration_seconds,
          recording_url: selectedCandidate.has_recording ? 'available' : null,
        } : null}
        minQualifyingScore={settings?.minimum_qualifying_score || 70}
      />


      {/* Call Interface Modal */}
      {showCallInterface && activeInterview && (
        <InterviewCallInterface
          interview={activeInterview}
          isRecruiter={true}
          onClose={handleCallInterfaceClose}
          onMinimize={handleCallInterfaceClose}
        />
      )}
    </div>
  );
};

// Helper component for stats cards
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${color === 'gray' ? 'text-gray-900' : `text-${color}-600`}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TelephoneScreeningStage;