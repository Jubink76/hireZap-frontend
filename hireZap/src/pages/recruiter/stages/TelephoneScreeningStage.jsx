import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Phone, 
  Calendar, 
  Clock, 
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Pause,
  Settings,
  RefreshCw,
  Eye,
  Users,
  TrendingUp,
  CheckSquare,
  ChevronRight,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';

// Redux actions
import {
  fetchTelephonicSettings,
  updateTelephonicSettings,
  fetchTelephonicCandidates,
  fetchTelephonicStats,
  scheduleInterview,
  rescheduleInterview,
  startCall,
  moveToNextStage,
  toggleCandidateSelection,
  clearSelectedCandidates,
  setFilterStatus,
  clearError,
  clearSuccessMessage,
} from '../../../redux/slices/telephonicSlice';

// Modals
import ScheduleInterviewModal from '../../../modals/ScheduleInterviewModal';
import TelephoneConfigModal from '../../../modals/TelephoneConfigModal';
import TelephonicCandidateDetailModal from '../../../modals/TelephonicRoundCandidateDetailModal';

// Toast notifications
import { notify } from '../../../utils/toast';

const TelephoneScreeningStage = ({ 
  jobId, 
  onRefresh,
  onMoveToNext 
}) => {
  const dispatch = useDispatch();

  // ==================== REDUX STATE ====================
  const {
    settings,
    settingsLoading,
    candidates,
    candidatesLoading,
    stats,
    statsLoading,
    selectedCandidates,
    filterStatus,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.telephonic);

  // ==================== LOCAL STATE ====================
  // Modals
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBulkScheduleModal, setShowBulkScheduleModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeInterview, setActiveInterview] = useState(null);

  // ==================== INITIAL DATA FETCH ====================
  useEffect(() => {
    if (jobId) {
      console.log('📞 Fetching telephonic data for job:', jobId);
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
  const noShowCount = stats?.no_show || 0;
  const avgScore = Math.round(stats?.average_score || 0);
  const qualifiedCount = stats?.qualified || 0;

  // Filter candidates based on current filter
  const filteredInterviews = candidates.filter(interview => {
    if (filterStatus === 'all') return true;
    return interview.status === filterStatus;
  });

  // ==================== HANDLERS ====================

  const handleRefresh = () => {
    console.log('🔄 Refreshing telephonic data...');
    dispatch(fetchTelephonicCandidates({ jobId, statusFilter: null }));
    dispatch(fetchTelephonicStats(jobId));
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleFilterChange = (status) => {
    console.log('🔍 Filter changed to:', status);
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
      console.log('📅 Scheduling interview:', scheduleData);
      await dispatch(scheduleInterview(scheduleData)).unwrap();
      setShowScheduleModal(false);
      setSelectedCandidate(null);
      handleRefresh();
    } catch (err) {
      console.error('❌ Schedule failed:', err);
      notify.error(err.message || 'Failed to schedule interview');
    }
  };

  const handleReschedule = (interview) => {
    console.log('🔄 Rescheduling interview:', interview);
    setSelectedCandidate(interview);
    setShowScheduleModal(true);
  };

  const handleConfigSave = async (configData) => {
    try {
      console.log('⚙️ Saving configuration:', configData);
      
      // Transform config data to match backend field names
      const settingsData = {
        job: parseInt(jobId), // ✅ Ensure job is an integer
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

      console.log('📤 Sending settings data:', settingsData);
      
      await dispatch(updateTelephonicSettings({ jobId, settingsData })).unwrap();
      setShowConfigModal(false);
      notify.success('Configuration saved successfully');
    } catch (err) {
      console.error('❌ Config save failed:', err);
      notify.error(err.message || 'Failed to save configuration');
    }
  };

  const handleViewDetails = (interview) => {
    console.log('👁️ Viewing details for:', interview);
    setSelectedCandidate(interview);
    setShowDetailsModal(true);
  };

  const handleStartCall = async (interview) => {
    try {
      console.log('📞 Starting call for interview:', interview.interview_id);
      await dispatch(startCall(interview.interview_id)).unwrap();
      setActiveInterview(interview);
      // Optionally navigate to call interface or show call modal
      notify.success('Call started successfully');
    } catch (err) {
      console.error('❌ Failed to start call:', err);
      notify.error(err.message || 'Failed to start call');
    }
  };

  const handleBulkSchedule = () => {
    const unscheduledCandidates = candidates.filter(i => i.status === 'not_scheduled');
    if (unscheduledCandidates.length === 0) {
      notify.warning('No pending candidates to schedule');
      return;
    }
    setShowBulkScheduleModal(true);
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
      console.log('🚀 Moving candidates to next stage:', selectedCandidates);
      await dispatch(moveToNextStage({ 
        interviewIds: selectedCandidates,
        feedback: 'Passed telephonic round with excellent performance'
      })).unwrap();

      handleRefresh();
      
      if (onMoveToNext) {
        onMoveToNext();
      }
    } catch (err) {
      console.error('❌ Failed to move candidates:', err);
      notify.error(err.message || 'Failed to move candidates to next stage');
    }
  };

  // ==================== UTILITY FUNCTIONS ====================

  const getStatusBadge = (status) => {
    const statusConfig = {
      not_scheduled: { text: 'Not Scheduled', color: 'bg-gray-100 text-gray-700', icon: AlertCircle },
      scheduled: { text: 'Scheduled', color: 'bg-blue-100 text-blue-700', icon: Calendar },
      in_progress: { text: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: Phone },
      completed: { text: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      failed: { text: 'Failed', color: 'bg-red-100 text-red-700', icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig.not_scheduled;
    const Icon = config.icon;
    
    return (
      <span className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  const canStartCall = (interview) => {
    if (interview.status !== 'scheduled') return false;
    
    const scheduledDateTime = new Date(interview.scheduled_at);
    const now = new Date();
    const timeDiff = (scheduledDateTime - now) / (1000 * 60); // minutes
    
    // Can start 10 minutes before or anytime after
    return timeDiff <= 10;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  };

  const transformCandidateData = (interview) => {
    if (!interview) return null;
    
    return {
      id: interview.application_id || interview.id,
      name: interview.candidate?.name || 'Unknown Candidate',
      email: interview.candidate?.email || 'No email',
      phone: interview.candidate?.phone || interview.candidate?.contact || 'No phone',
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

  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_candidates || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{scheduledCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
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
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Qualified</p>
              <p className="text-2xl font-bold text-purple-600">{qualifiedCount}</p>
            </div>
          </div>
        </div>
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
            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={candidatesLoading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${candidatesLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {/* Configure */}
            <button
              onClick={() => setShowConfigModal(true)}
              disabled={settingsLoading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <Settings className="w-4 h-4" />
              Configure Round
            </button>

            {/* Bulk Schedule */}
            {pendingCount > 0 && (
              <button
                onClick={handleBulkSchedule}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" />
                Schedule {pendingCount} Interviews
              </button>
            )}

            {/* Proceed to Next */}
            {qualifiedCount > 0 && (
              <button
                onClick={handleProceedToNextRound}
                disabled={selectedCandidates.length === 0 || loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-5 h-5" />
                    {selectedCandidates.length > 0 
                      ? `Proceed ${selectedCandidates.length} to Next Round`
                      : 'Select Candidates to Proceed'}
                  </>
                )}
              </button>
            )}

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Candidates</option>
              <option value="not_scheduled">Not Scheduled</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            {/* Select All Qualified */}
            {qualifiedCount > 0 && (
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <CheckSquare className="w-4 h-4" />
                {selectedCandidates.length > 0 ? 'Deselect All' : 'Select All Qualified'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {candidatesLoading && candidates.length > 0 ? (
          <div className="px-6 py-12 text-center">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Updating candidates...</p>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {candidates.length === 0 
                ? 'No candidates in this stage yet.'
                : 'No candidates match the current filter.'}
            </p>
          </div>
        ) : (
          filteredInterviews.map((interview) => {
            const isQualified = interview.overall_score >= (settings?.minimum_qualifying_score || 70);
            const canStart = canStartCall(interview);
            
            return (
              <div key={interview.interview_id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
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
                        {interview.candidate?.name || 'Unknown Candidate'}
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
                    
                    {/* Schedule Info */}
                    {interview.status === 'scheduled' && interview.scheduled_at && (
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateTime(interview.scheduled_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {interview.duration || 30} mins
                        </span>
                      </div>
                    )}
                    
                    {/* Completion Info */}
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
                      <p className={`text-2xl font-bold ${
                        interview.overall_score >= 70 ? 'text-green-600' : 
                        interview.overall_score >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {interview.overall_score}
                      </p>
                      <p className="text-xs text-gray-500">Interview Score</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Schedule/Reschedule */}
                    {interview.status === 'not_scheduled' && (
                      <button
                        onClick={() => {
                          setSelectedCandidate(interview);
                          setShowScheduleModal(true);
                        }}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Calendar className="w-4 h-4" />
                        Schedule
                      </button>
                    )}
                    
                    {interview.status === 'scheduled' && (
                      <>
                        {canStart ? (
                          <button
                            onClick={() => handleStartCall(interview)}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            <Play className="w-4 h-4" />
                            Start Call
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReschedule(interview)}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Edit className="w-4 h-4" />
                            Reschedule
                          </button>
                        )}
                      </>
                    )}
                    
                    {/* View Details */}
                    <button
                      onClick={() => handleViewDetails(interview)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4" />
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
        candidate={transformCandidateData(selectedCandidate)}
        existingConfig={settings ? {
          passing_score: settings.minimum_qualifying_score,
          default_duration: settings.default_duration_minutes,
          enable_auto_recording: settings.enable_recording,
          enable_notifications: settings.send_reminders,
          enable_email_notifications: settings.send_reminders,
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
    </div>
  );
};

export default TelephoneScreeningStage;