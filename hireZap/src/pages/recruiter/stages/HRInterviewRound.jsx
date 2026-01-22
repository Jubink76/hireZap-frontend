import React, { useState, useEffect } from 'react';
import VideoInterviewInterface from '../../../modals/VideoInterviewInterface';
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

// Mock Redux hooks
const useDispatch = () => (action) => {
  if (typeof action === 'function') return action();
  return Promise.resolve({ unwrap: () => Promise.resolve({}) });
};

const useSelector = (selector) => selector({
  hrVideo: {
    settings: {
      communication_weight: 25,
      culture_fit_weight: 20,
      motivation_weight: 15,
      professionalism_weight: 15,
      problem_solving_weight: 15,
      team_collaboration_weight: 10,
      minimum_qualifying_score: 70,
      default_duration_minutes: 45,
      enable_recording: true
    },
    candidates: [
      {
        interview_id: 1,
        application_id: 101,
        status: 'scheduled',
        candidate: {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 234-567-8900'
        },
        scheduled_at: '2026-01-21T10:00:00Z',
        duration: 45,
        overall_score: null,
        session_id: 'session_123'
      },
      {
        interview_id: 2,
        application_id: 102,
        status: 'completed',
        candidate: {
          name: 'Michael Chen',
          email: 'michael.chen@email.com',
          phone: '+1 234-567-8901'
        },
        scheduled_at: '2026-01-20T14:00:00Z',
        ended_at: '2026-01-20T14:47:00Z',
        duration: 47,
        overall_score: 85,
        has_recording: true,
        actual_duration_seconds: 2820
      },
      {
        interview_id: 3,
        application_id: 103,
        status: 'not_scheduled',
        candidate: {
          name: 'Emily Rodriguez',
          email: 'emily.r@email.com',
          phone: '+1 234-567-8902'
        }
      }
    ],
    stats: {
      total_candidates: 15,
      scheduled: 5,
      completed: 8,
      not_scheduled: 2,
      average_score: 78,
      qualified: 6
    },
    selectedCandidates: [],
    filterStatus: 'all',
    candidatesLoading: false,
    loading: false,
    error: null,
    successMessage: null
  }
});

// Stats Card Component
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
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Main HR Video Interview Dashboard Component
const HRInterviewRound = ({ 
  jobId, 
  onRefresh, 
  onMoveToNext,
  onOpenVideoInterface 
}) => {
  const dispatch = useDispatch();
  const {
    settings,
    candidates,
    stats,
    selectedCandidates,
    filterStatus,
    candidatesLoading,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.hrVideo);

  // Local state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showVideoInterface, setShowVideoInterface] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeInterview, setActiveInterview] = useState(null);

  // Auto-detect active interviews
  useEffect(() => {
    if (candidates && candidates.length > 0) {
      const activeCall = candidates.find(
        c => (c.status === 'in_progress' || c.status === 'joined') && c.interview_id
      );
      
      if (activeCall && (!activeInterview || activeInterview.interview_id !== activeCall.interview_id)) {
        setActiveInterview({
          interview_id: activeCall.interview_id,
          session_id: activeCall.session_id,
          candidate_name: activeCall.candidate?.name,
          recruiter_name: 'Michael Chen',
          job_title: 'Senior Software Engineer',
          status: activeCall.status,
          scheduled_at: activeCall.scheduled_at
        });
      }
    }
  }, [candidates, activeInterview]);

  const handleRefresh = () => {
    console.log('🔄 Refreshing data...');
    if (onRefresh) onRefresh();
  };

  const handleFilterChange = (status) => {
    console.log('🔍 Filter changed:', status);
  };

  const handleSelectCandidate = (interviewId) => {
    console.log('✅ Toggle candidate selection:', interviewId);
  };

  const handleSelectAll = () => {
    const selectableInterviews = candidates.filter(i => 
      i.overall_score >= (settings?.minimum_qualifying_score || 70) && i.status === 'completed'
    );
    console.log('✅ Select all qualified:', selectableInterviews.length);
  };

  const handleStartInterview = async (interview) => {
    try {
      console.log('📹 Starting interview for:', interview.interview_id);
      
      const result = { success: true, session_id: 'session_' + Date.now() };
      
      if (result.success) {
        const interviewData = {
          interview_id: interview.interview_id,
          session_id: result.session_id,
          candidate_name: interview.candidate?.name,
          recruiter_name: 'Michael Chen',
          job_title: 'Senior Software Engineer',
          status: 'in_progress',
          scheduled_at: interview.scheduled_at
        };
        
        setActiveInterview(interviewData);
        
        if (onOpenVideoInterface) {
          onOpenVideoInterface(interviewData);
        }
        
        alert('Interview started! Waiting for candidate to join...');
        handleRefresh();
      }
    } catch (err) {
      console.error('❌ Failed to start interview:', err);
      alert('Failed to start interview');
    }
  };

  const handleResumeInterview = (interview) => {
    console.log('📹 Resuming interview:', interview);
    const interviewData = {
      interview_id: interview.interview_id,
      session_id: interview.session_id,
      candidate_name: interview.candidate?.name,
      recruiter_name: 'Michael Chen',
      job_title: 'Senior Software Engineer',
      status: interview.status,
      scheduled_at: interview.scheduled_at
    };
    
    setActiveInterview(interviewData);
    
    if (onOpenVideoInterface) {
      onOpenVideoInterface(interviewData);
    }
  };

  const handleVideoInterfaceClose =()=>{
    setShowVideoInterface(false)
  }
  const handleProceedToNextRound = async () => {
    if (selectedCandidates.length === 0) {
      alert('Please select candidates to proceed');
      return;
    }

    if (!window.confirm(`Move ${selectedCandidates.length} candidate(s) to next round?`)) {
      return;
    }

    console.log('➡️ Moving to next round:', selectedCandidates);
    handleRefresh();
    
    if (onMoveToNext) {
      onMoveToNext();
    }
  };

  const canStartInterview = (interview) => {
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
      in_progress: { text: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: Video },
      joined: { text: 'Interview Active', color: 'bg-green-100 text-green-700', icon: Video },
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

  if (candidatesLoading && candidates.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading HR video interview data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Active Interview Banner */}
        {activeInterview && (
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
                    {activeInterview.candidate_name} • {activeInterview.status === 'joined' ? 'Connected' : 'Waiting for candidate'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpenVideoInterface && onOpenVideoInterface(activeInterview)}
                className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 font-medium"
              >
                Open Interview
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4">
          <StatCard icon={Users} label="Total" value={stats?.total_candidates || 0} color="gray" />
          <StatCard icon={Calendar} label="Scheduled" value={stats?.scheduled || 0} color="blue" />
          <StatCard icon={CheckCircle} label="Completed" value={stats?.completed || 0} color="green" />
          <StatCard icon={TrendingUp} label="Avg. Score" value={Math.round(stats?.average_score || 0)} color="orange" />
          <StatCard icon={CheckCircle} label="Qualified" value={stats?.qualified || 0} color="purple" />
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">HR Video Interviews</h3>
              <p className="text-sm text-gray-600 mt-1">
                {candidates.length} candidates • {stats?.scheduled || 0} scheduled • {stats?.completed || 0} completed
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

              {(stats?.qualified || 0) > 0 && (
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
          {candidates.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No candidates found</p>
            </div>
          ) : (
            candidates.map((interview) => {
              const isQualified = interview.overall_score >= (settings?.minimum_qualifying_score || 70);
              const isActiveInterview = activeInterview?.interview_id === interview.interview_id;
              
              return (
                <div key={interview.interview_id} className={`px-6 py-4 hover:bg-gray-50 ${isActiveInterview ? 'bg-green-50' : ''}`}>
                  <div className="flex items-center gap-4">
                    {interview.status === 'completed' && isQualified && (
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(interview.interview_id)}
                        onChange={() => handleSelectCandidate(interview.interview_id)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                    )}

                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {interview.candidate?.name?.charAt(0).toUpperCase() || 'C'}
                    </div>

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

                    {interview.status === 'completed' && interview.overall_score && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{interview.overall_score}</p>
                        <p className="text-xs text-gray-500">Score</p>
                      </div>
                    )}

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
                      
                      {interview.status === 'scheduled' && canStartInterview(interview) && (
                        <button onClick={() => handleStartInterview(interview)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                          <Play className="w-4 h-4 inline mr-1" />
                          Start Interview
                        </button>
                      )}

                      {interview.status === 'scheduled' && !canStartInterview(interview) && (
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
                        <button onClick={() => handleResumeInterview(interview)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 animate-pulse">
                          <VideoOff className="w-4 h-4 inline mr-1" />
                          {interview.status === 'joined' ? 'Resume Interview' : 'Join Interview'}
                        </button>
                      )}
                      
                      <button onClick={() => {
                        setSelectedCandidate(interview);
                        setShowDetailsModal(true);
                      }}
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
      {activeInterview && showVideoInterface && 
      <VideoInterviewInterface 
      interview={activeInterview}
      onClose={handleVideoInterfaceClose}
      />}
      
    </div>
  );
};

export default HRInterviewRound;