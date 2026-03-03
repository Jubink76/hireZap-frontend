import React, { useState, useEffect, useCallback } from 'react';
import VideoInterviewInterface from '../../../modals/VideoInterviewInterface';
import { useDispatch, useSelector } from 'react-redux';
import { notify } from '../../../utils/toast';
import ScheduleInterviewModal from '../../../modals/ScheduleInterviewModal';
import HrRoundCandidateDetailModal from '../../../modals/HrRoundCandidateDetailModal';
import HrRoundConfigModal from '../../../modals/hrRoundConfigModal';
import { 
  Video, 
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
  VideoOff,
  XCircle
} from 'lucide-react';

import {
  fetchHrRoundSettings,
  fetchHrRoundInterviews,
  scheduleHRInterview,
  startHRMeeting,
  joinHRMeeting,
  setFilterStatus,
  setSelectedInterviews,
  toggleInterviewSelection,
  clearSelectedInterviews,
  clearError,
  clearSuccessMessage,
  updateHrRoundSettings,
  leaveHRMeeting,
  resetHRMeetingSession,
  endHRMeeting,
  moveToNextStage,
} from '../../../redux/slices/hrRoundSlice';

// ─── StatCard ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    gray:   'bg-gray-100 text-gray-600',
    blue:   'bg-blue-100 text-blue-600',
    green:  'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const HRInterviewRound = ({ jobId, onRefresh, onMoveToNext }) => {
  const dispatch = useDispatch();
  const {
    settings,
    interviews,
    stats,
    selectedInterviews,
    filterStatus,
    interviewsLoading,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.hrRound);

  const [showScheduleModal,  setShowScheduleModal]  = useState(false);
  const [showConfigModal,    setShowConfigModal]    = useState(false);
  const [showDetailsModal,   setShowDetailsModal]   = useState(false);
  const [showVideoInterface, setShowVideoInterface] = useState(false);
  const [selectedCandidate,  setSelectedCandidate]  = useState(null);
  const [activeInterview,    setActiveInterview]    = useState(null);
  const [isVideoMinimized,   setIsVideoMinimized]   = useState(false);

  // ── Error / success toasts ────────────────────────────────────────────────
  useEffect(() => {
    if (error)          { notify.error(error);          dispatch(clearError());          }
  }, [error, dispatch]);
  useEffect(() => {
    if (successMessage) { notify.success(successMessage); dispatch(clearSuccessMessage()); }
  }, [successMessage, dispatch]);

  // ── Initial fetch ─────────────────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    if (!jobId) return;
    try {
      await Promise.all([
        dispatch(fetchHrRoundSettings(jobId)).unwrap(),
        dispatch(fetchHrRoundInterviews({
          jobId,
          statusFilter: filterStatus === 'all' ? null : filterStatus,
        })).unwrap(),
      ]);
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  }, [jobId, filterStatus, dispatch]);

  useEffect(() => { if (jobId) handleRefresh(); }, [jobId, handleRefresh]);

  // ── Auto-detect active interview (banner only, don't overwrite zegoConfig) ─
  useEffect(() => {
    if (!interviews?.length) return;
    const activeCall = interviews.find(
      i => (i.status === 'in_progress' || i.status === 'candidate_joined') && i.id
    );
    if (activeCall && !activeInterview?.zegoConfig) {
      setActiveInterview(prev => {
        if (prev?.interview_id === activeCall.id) return prev;
        return {
          interview_id: activeCall.id,
          session_id:   activeCall.meeting_session?.session_id,
          candidate_name: activeCall.candidate_name,
          recruiter_name: 'Recruiter',
          job_title:    'Job Title',
          status:       activeCall.status,
          scheduled_at: activeCall.scheduled_at,
        };
      });
      if (!showVideoInterface) {
        setIsVideoMinimized(true);
      }
    }
  }, [interviews]);

  // ── Derived: qualified candidates ─────────────────────────────────────────
  const qualifiedInterviews = interviews.filter(
    i => i.status === 'completed' && i.result_decision === 'qualified'
  );
  const qualifiedCount = qualifiedInterviews.length;

  // ── Filter change ─────────────────────────────────────────────────────────
  const handleFilterChange = (status) => {
    dispatch(setFilterStatus(status));
    dispatch(fetchHrRoundInterviews({ jobId, statusFilter: status === 'all' ? null : status }));
  };

  // ── Selection (mirrors telephonic pattern exactly) ────────────────────────
  const handleSelectCandidate = (interviewId) => {
    dispatch(toggleInterviewSelection(interviewId));
  };

  const handleSelectAll = () => {
    if (selectedInterviews.length === qualifiedCount && qualifiedCount > 0) {
      dispatch(clearSelectedInterviews());
    } else {
      qualifiedInterviews.forEach(i => {
        if (!selectedInterviews.includes(i.id)) {
          dispatch(toggleInterviewSelection(i.id));
        }
      });
    }
  };

  // ── Proceed to next round (matches telephonic handleProceedToNextRound) ────
  const handleProceedToNextRound = async () => {
    if (selectedInterviews.length === 0) {
      notify.warning('Please select candidates to proceed');
      return;
    }
    if (!window.confirm(`Move ${selectedInterviews.length} candidate(s) to next round?`)) return;
    try {
      await dispatch(moveToNextStage({
            interviewIds: selectedInterviews,     
            feedback: 'Passed HR round'
        })).unwrap();
      handleRefresh();
      if (onMoveToNext) onMoveToNext();
    } catch (err) {
      notify.error(err?.message || 'Failed to move candidates to next stage');
    }
  };

  // ── Schedule / Config ─────────────────────────────────────────────────────
  const handleScheduleInterview = async (scheduleData) => {
    try {
      await dispatch(scheduleHRInterview({
        application_id:    scheduleData.candidate_id,
        scheduled_at:      scheduleData.scheduled_at,
        duration_minutes:  scheduleData.duration,
        timezone:          scheduleData.timezone,
        notes:             scheduleData.notes,
        send_notification: scheduleData.send_notification,
        send_email:        scheduleData.send_email,
      })).unwrap();
      setShowScheduleModal(false);
      setSelectedCandidate(null);
      handleRefresh();
    } catch (err) {
      notify.error(err.message || 'Failed to schedule interview');
    }
  };

  const handleConfigSave = async (configData) => {
    try {
      await dispatch(updateHrRoundSettings({
        jobId,
        settingsData: {
          job:                       parseInt(jobId),
          communication_weight:      parseInt(configData.communication_weight  || 25),
          culture_fit_weight:        parseInt(configData.culture_fit_weight    || 20),
          motivation_weight:         parseInt(configData.motivation_weight     || 15),
          professionalism_weight:    parseInt(configData.professionalism_weight|| 15),
          problem_solving_weight:    parseInt(configData.problem_solving_weight|| 15),
          team_collaboration_weight: parseInt(configData.team_collaboration_weight || 10),
          minimum_qualifying_score:  parseInt(configData.passing_score) || 70,
          default_duration_minutes:  parseInt(configData.default_duration) || 30,
          auto_schedule_enabled:     Boolean(configData.enable_auto_recording),
          send_reminders:            true,
          reminder_hours_before:     24,
          enable_recording:          Boolean(configData.enable_auto_recording),
        },
      })).unwrap();
      setShowConfigModal(false);
      notify.success('Configuration saved successfully');
    } catch (err) {
      notify.error(err.message || 'Failed to save configuration');
    }
  };

  // ── Meeting handlers ──────────────────────────────────────────────────────
  const handleStartInterview = async (interview) => {
    try {
      const result = await dispatch(startHRMeeting(interview.id)).unwrap();
      if (result.success) {
        const data = {
          interview_id:       interview.id,
          session_id:         result.session.session_id,
          candidate_name:     interview.candidate_name,
          recruiter_name:     'Recruiter',
          job_title:          'Job Title',
          status:             'in_progress',
          scheduled_at:       interview.scheduled_at,
          session_started_at: result.session.started_at || null,
          zegoConfig: {
            appID:    Number(result.zegocloud_config.app_id),
            roomID:   result.zegocloud_config.room_id,
            token:    result.zegocloud_config.token,
            userID:   result.zegocloud_config.user_id,
            userName: 'Recruiter',
          },
        };
        if (!data.zegoConfig.appID) { notify.error('Missing video configuration.'); return; }
        setActiveInterview(data);
        setShowVideoInterface(true);
        setIsVideoMinimized(false);
        notify.success('Interview started! Waiting for candidate to join...');
        handleRefresh();
      }
    } catch (err) {
      notify.error(err || 'Failed to start interview');
    }
  };

  const handleResumeInterview = async (interview) => {
    try {
      if (!interview.meeting_session?.session_id) { notify.error('No active session found'); return; }
      const result = await dispatch(joinHRMeeting(interview.meeting_session.session_id)).unwrap();
      if (result.success) {
        const data = {
          interview_id:       interview.id,
          session_id:         interview.meeting_session.session_id,
          candidate_name:     interview.candidate_name,
          recruiter_name:     'Recruiter',
          job_title:          interview.job?.job_title || 'Job Title',
          status:             interview.status,
          scheduled_at:       interview.scheduled_at,
          session_started_at: result.session?.started_at || null,
          zegoConfig: {
            appID:    Number(result.zegocloud_config.app_id),
            roomID:   result.zegocloud_config.room_id,
            token:    result.zegocloud_config.token,
            userID:   result.zegocloud_config.user_id,
            userName: 'Recruiter',
          },
        };
        if (!data.zegoConfig.appID || !data.zegoConfig.roomID || !data.zegoConfig.token) {
          notify.error('Failed to resume: Invalid video configuration'); return;
        }
        setActiveInterview(data);
        setShowVideoInterface(true);
        setIsVideoMinimized(false);
      }
    } catch (err) {
      notify.error(err?.message || 'Failed to resume interview');
    }
  };

  const handleVideoInterfaceClose = () => {
    setShowVideoInterface(false);
    setIsVideoMinimized(true);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const canStartInterview = (interview) => {
    if (interview.status !== 'scheduled' || !interview.scheduled_at) return false;
    const diff = (new Date() - new Date(interview.scheduled_at)) / (1000 * 60);
    return diff >= -5 && diff <= 60;
  };

  const canRescheduleInterview = (interview) => {
    if (interview.status !== 'scheduled' || !interview.scheduled_at) return false;
    return (new Date() - new Date(interview.scheduled_at)) / (1000 * 60) < -5;
  };

  const getTimeUntilInterview = (scheduledAt) => {
    const diffMs = new Date(scheduledAt) - new Date();
    if (diffMs <= 0) return null;
    const hours   = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `in ${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''}`;
    if (hours > 0)  return `in ${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    return `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const getStatusBadge = (status) => {
    const cfg = {
      not_scheduled:   { text: 'Not Scheduled',   color: 'bg-gray-100 text-gray-700',   icon: AlertCircle  },
      scheduled:       { text: 'Scheduled',        color: 'bg-blue-100 text-blue-700',   icon: Calendar     },
      in_progress:     { text: 'In Progress',      color: 'bg-yellow-100 text-yellow-700', icon: Video      },
      candidate_joined:{ text: 'Interview Active', color: 'bg-green-100 text-green-700', icon: Video        },
      completed:       { text: 'Completed',        color: 'bg-green-100 text-green-700', icon: CheckCircle  },
      cancelled:       { text: 'Cancelled',        color: 'bg-red-100 text-red-700',     icon: XCircle      },
      no_show:         { text: 'No Show',          color: 'bg-red-100 text-red-700',     icon: XCircle      },
    }[status] || { text: status, color: 'bg-gray-100 text-gray-700', icon: AlertCircle };
    const Icon = cfg.icon;
    return (
      <span className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${cfg.color}`}>
        <Icon className="w-3 h-3" />{cfg.text}
      </span>
    );
  };

  const formatDateTime = (ds) => {
    if (!ds) return 'N/A';
    return new Date(ds).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const transformCandidateData = (interview) => {
    if (!interview) return null;
    return {
      id:             interview.application_id || interview.id,
      name:           interview.candidate_name  || 'Unknown Candidate',
      email:          interview.candidate_email || 'No email',
      phone:          interview.candidate_phone || 'No phone',
      interview_id:   interview.id,
      application_id: interview.application_id,
    };
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (interviewsLoading && (!interviews || interviews.length === 0)) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading HR video interview data...</p>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Minimized / active interview banner (mirrors telephonic) ──────── */}
      {isVideoMinimized && activeInterview && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Video className="w-6 h-6 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div>
                <p className="font-semibold">Interview in Progress</p>
                <p className="text-sm text-green-100">
                  {activeInterview.candidate_name} •{' '}
                  {activeInterview.status === 'candidate_joined' ? 'Connected' : 'Waiting for candidate'}
                </p>
              </div>
            </div>
            <button
              onClick={() => { setShowVideoInterface(true); setIsVideoMinimized(false); }}
              className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 font-medium"
            >
              Open Interview
            </button>
          </div>
        </div>
      )}

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard icon={Users}       label="Total"     value={stats?.total_interviews || interviews.length} color="gray"   />
        <StatCard icon={Calendar}    label="Scheduled" value={stats?.scheduled        || interviews.filter(i => i.status === 'scheduled').length}  color="blue"   />
        <StatCard icon={CheckCircle} label="Completed" value={stats?.completed        || interviews.filter(i => i.status === 'completed').length}  color="green"  />
        <StatCard icon={TrendingUp}  label="Avg. Score" value={Math.round(stats?.results?.average_score || 0)} color="orange" />
        <StatCard icon={CheckCircle} label="Qualified" value={qualifiedCount} color="purple" />
      </div>

      {/* ── Action Bar ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">HR Video Interviews</h3>
            <p className="text-sm text-gray-600 mt-1">
              {interviews.length} candidates •{' '}
              {interviews.filter(i => i.status === 'scheduled').length} scheduled •{' '}
              {interviews.filter(i => i.status === 'completed').length} completed
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={interviewsLoading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className={`w-4 h-4 ${interviewsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              Configure
            </button>

            {/* Select-all + Proceed — same pattern as telephonic */}
            {qualifiedCount > 0 && (
              <>
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <CheckSquare className="w-4 h-4" />
                  {selectedInterviews.length > 0 ? 'Deselect All' : 'Select All Qualified'}
                </button>

                <button
                  onClick={handleProceedToNextRound}
                  disabled={selectedInterviews.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                  {selectedInterviews.length > 0
                    ? `Proceed ${selectedInterviews.length} to Next`
                    : 'Select to Proceed'}
                </button>
              </>
            )}

            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All</option>
              <option value="not_scheduled">Not Scheduled</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Candidates List ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {interviews.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No candidates found</p>
          </div>
        ) : (
          interviews.map((interview) => {
            // ✅ Use result_decision from backend
            const isQualified    = interview.result_decision === 'qualified';
            const isActiveInterview = activeInterview?.interview_id === interview.id;

            return (
              <div
                key={interview.id}
                className={`px-6 py-4 hover:bg-gray-50 ${isActiveInterview ? 'bg-green-50' : ''}`}
              >
                <div className="flex items-center gap-4">

                  {/* Checkbox — only for qualified completed interviews (mirrors telephonic) */}
                  {interview.status === 'completed' && isQualified && (
                    <input
                      type="checkbox"
                      checked={selectedInterviews.includes(interview.id)}
                      onChange={() => handleSelectCandidate(interview.id)}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                  )}

                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {interview.candidate_name?.charAt(0).toUpperCase() || 'C'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-base font-semibold text-gray-900">
                        {interview.candidate_name || 'Unknown'}
                      </h3>
                      {getStatusBadge(interview.status)}
                      {interview.status === 'completed' && interview.overall_score != null && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          isQualified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {isQualified ? 'Qualified' : 'Not Qualified'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{interview.candidate_email || 'No email'}</p>

                    {interview.status === 'scheduled' && interview.scheduled_at && (
                      <p className="text-xs text-gray-600 mt-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDateTime(interview.scheduled_at)}
                      </p>
                    )}

                    {interview.status === 'completed' && (
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>
                          Duration: {interview.actual_duration_seconds
                            ? Math.round(interview.actual_duration_seconds / 60)
                            : 'N/A'} mins
                        </span>
                        {interview.has_recording && (
                          <span className="text-blue-600">• Recording Available</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Score */}
                  {interview.status === 'completed' && interview.overall_score != null && (
                    <div className="text-center flex-shrink-0">
                      <p className={`text-2xl font-bold ${isQualified ? 'text-green-600' : 'text-red-500'}`}>
                        {interview.overall_score}
                      </p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {interview.status === 'not_scheduled' && (
                      <button
                        onClick={() => { setSelectedCandidate(interview); setShowScheduleModal(true); }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Calendar className="w-4 h-4 inline mr-1" />Schedule
                      </button>
                    )}

                    {interview.status === 'scheduled' && canStartInterview(interview) && (
                      <button
                        onClick={() => handleStartInterview(interview)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Play className="w-4 h-4 inline mr-1" />Start Interview
                      </button>
                    )}

                    {interview.status === 'scheduled' && canRescheduleInterview(interview) && (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-500 font-medium">
                          Starts {getTimeUntilInterview(interview.scheduled_at)}
                        </span>
                        <button
                          onClick={() => { setSelectedCandidate(interview); setShowScheduleModal(true); }}
                          className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />Reschedule
                        </button>
                      </div>
                    )}

                    {(interview.status === 'in_progress' || interview.status === 'candidate_joined') && (
                      <button
                        onClick={() => handleResumeInterview(interview)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 animate-pulse"
                      >
                        <VideoOff className="w-4 h-4 inline mr-1" />
                        {interview.status === 'candidate_joined' ? 'Resume Interview' : 'Join Interview'}
                      </button>
                    )}

                    <button
                      onClick={() => { setSelectedCandidate(interview); setShowDetailsModal(true); }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4 inline mr-1" />Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <HrRoundConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        jobId={jobId}
        existingConfig={settings ? {
          passing_score:              settings.minimum_qualifying_score,
          default_duration:           settings.default_duration_minutes,
          enable_auto_recording:      settings.enable_recording,
          communication_weight:       settings.communication_weight,
          technical_knowledge_weight: settings.technical_knowledge_weight,
          problem_solving_weight:     settings.problem_solving_weight,
          enthusiasm_weight:          settings.enthusiasm_weight,
          clarity_weight:             settings.clarity_weight,
          professionalism_weight:     settings.professionalism_weight,
        } : null}
        onSave={handleConfigSave}
      />

      <HrRoundCandidateDetailModal
        isOpen={showDetailsModal}
        onClose={() => { setShowDetailsModal(false); setSelectedCandidate(null); }}
        candidate={selectedCandidate ? {
          ...transformCandidateData(selectedCandidate),
          performance_score:       selectedCandidate.overall_score,
          interview_completed_at:  selectedCandidate.ended_at,
          interview_scheduled_at:  selectedCandidate.scheduled_at,
          call_duration:           selectedCandidate.actual_duration_seconds,
          recording_url:           selectedCandidate.has_recording ? 'available' : null,
          status:                  selectedCandidate.status,
        } : null}
        minQualifyingScore={settings?.minimum_qualifying_score || 70}
      />

      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        onClose={() => { setShowScheduleModal(false); setSelectedCandidate(null); }}
        candidate={transformCandidateData(selectedCandidate)}
        existingSchedule={selectedCandidate?.status === 'scheduled' ? {
          scheduled_at: selectedCandidate.scheduled_at,
          duration:     selectedCandidate.duration_minutes,
          timezone:     selectedCandidate.timezone,
          notes:        selectedCandidate.notes,
        } : null}
        onSchedule={handleScheduleInterview}
        roundType="hr_round"
      />

      {/* Video Interface — conditional mount to prevent premature ZegoCloud init */}
      {activeInterview && showVideoInterface && (
        <VideoInterviewInterface
          interview={activeInterview}
          zegoConfig={activeInterview.zegoConfig}
          isRecruiter={true}
          sessionStartedAt={activeInterview.session_started_at}
          onClose={handleVideoInterfaceClose}
          onMinimize={handleVideoInterfaceClose}
          onCallEnd={() => {
            setShowVideoInterface(false);
            setIsVideoMinimized(false);
            setActiveInterview(null);
            handleRefresh();
          }}
          onEndMeeting={async ({ session_id, interview_id, notes, recommendation }) => {
            await dispatch(endHRMeeting({
              sessionId: session_id,
              notesData: notes,
              recommendation,
            })).unwrap();
            handleRefresh();
          }}
          onLeaveMeeting={async (sessionId) => {
            await dispatch(leaveHRMeeting(sessionId)).unwrap();
          }}
          onReschedule={async (sessionId) => {
            await dispatch(resetHRMeetingSession(sessionId)).unwrap();
            setShowVideoInterface(false);
            setIsVideoMinimized(false);
            setActiveInterview(null);
            handleRefresh();
          }}
        />
      )}

    </div>
  );
};

export default HRInterviewRound;