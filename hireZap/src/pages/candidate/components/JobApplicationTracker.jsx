import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Loader2, MessageSquare, Briefcase, Calendar, CheckCircle, Clock, AlertCircle, ArrowRight, RefreshCw, FileText, Phone, Video, Users, Award } from 'lucide-react';
import { fetchApplicationProgress } from '../../../redux/slices/applicationSlice';
import VideoInterviewInterface from '../../../modals/VideoInterviewInterface';
import { joinHRMeeting } from '../../../redux/slices/hrRoundSlice';
import { joinCall } from '../../../redux/slices/telephonicSlice'; 
import InterviewCallInterface from '../../../modals/InterviewCallInterface'; 
import { useDispatch, useSelector } from 'react-redux';
import { notify } from '../../../utils/toast';

const JobApplicationTracker = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get application data from Redux
  const { applicationData, loading, error } = useSelector(
    (state) => state.application
  );

  // ✅ Get telephonic state (for activeCallSession if you store it)
  const { currentCall } = useSelector((state) => state.telephonic);
  // get hr round
  const { activeMeeting } = useSelector((state) => state.hrRound);

  const [showCallInterface, setShowCallInterface] = useState(false);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [joiningCall, setJoiningCall] = useState(false);

  const [interviewType, setInterviewType] = useState(null);

  const hasManuallyMinimizedRef = useRef(false);

  // Fetch application progress on mount and set up polling
  useEffect(() => {
    if (applicationId) {
      dispatch(fetchApplicationProgress(applicationId));
      
      // Poll every 10 seconds for updates (faster polling for real-time feel)
      const interval = setInterval(() => {
        dispatch(fetchApplicationProgress(applicationId));
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [applicationId, dispatch]);

  //auto open interface
  useEffect(() => {
    if (!applicationData?.stages) {
      return;
    }
    
    const activeStage = applicationData.stages.find(
      stage => {
        const isActive = (stage.status === 'in_progress' || stage.status === 'joined');
        const hasRequiredData = stage.interview_id && stage.session_id;
        const isNotCompleted = stage.status !== 'completed';
        return isActive && hasRequiredData && isNotCompleted;
      }
    );
    
    if (activeStage) {
      const type = activeStage.stage_slug === 'hr-round' ? 'hr_video' : 'telephonic';
      
      // New interview detected (different from current)
      if (!currentInterview || currentInterview.interview_id !== activeStage.interview_id) {
        const interviewData = {
          interview_id: activeStage.interview_id,
          recruiter_name: 'Recruiter',
          job_title: applicationData.job_title,
          session_id: activeStage.session_id,
          status: activeStage.status,
          stage_slug: activeStage.stage_slug,
          zegoConfig: activeStage.zegocloud_config ? {
            appID: Number(activeStage.zegocloud_config.app_id),
            roomID: activeStage.zegocloud_config.room_id,
            token: activeStage.zegocloud_config.token,
            userID: activeStage.zegocloud_config.user_id,
            userName: 'Candidate'
          } : null,
          session_started_at: activeStage.session_started_at || null,
        };
        
        if (type === 'hr_video') {
          if (!interviewData.zegoConfig || !interviewData.zegoConfig.appID) {
            console.error('❌ Missing ZegoCloud config');
            notify.error('Unable to join HR interview: Missing video configuration');
            return;
          }
          console.log('✅ ZegoConfig validated successfully:', {
            appID: interviewData.zegoConfig.appID,
            roomID: interviewData.zegoConfig.roomID,
            userID: interviewData.zegoConfig.userID,
            tokenLength: interviewData.zegoConfig.token?.length
          });
        }
        hasManuallyMinimizedRef.current = false;
        setCurrentInterview(interviewData);
        setInterviewType(type);
      }
    } else {
      // No active interview - clear state if interview ended
      if (currentInterview && !showCallInterface) {
        setCurrentInterview(null);
        setInterviewType(null);
      }
    }
  }, [applicationData]); 

  // Listen for WebSocket notifications
  useEffect(() => {
    if (!applicationData?.candidate_id) return;

    const ws = new WebSocket(
      `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/notifications/${applicationData.candidate_id}/`
    );

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'call_started') {
        notify.info('Interview call has started! You can join now.');
        dispatch(fetchApplicationProgress(applicationId));
      }
      
      if (data.type === 'call_ended') {
        notify.info('Interview call has ended');
        setShowCallInterface(false);
        setCurrentInterview(null); // ✅ Clear interview on call end
        dispatch(fetchApplicationProgress(applicationId));
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      console.log('WebSocket disconnecting');
      ws.close();
    };
  }, [applicationData?.candidate_id, applicationId, dispatch]);

  // Helper function to get stage icon
  const getStageIconComponent = (slug) => {
    const icons = {
      'resume-screening': FileText,
      'telephonic-round': Phone,
      'technical-round': Video,
      'panel-interview': Users,
      'hr-interview': Users,
      'background-check': CheckCircle,
      'offer': Award
    };
    return icons[slug] || Briefcase;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { text: 'Completed', color: 'bg-green-500 text-white', icon: CheckCircle },
      passed: { text: 'Passed', color: 'bg-green-500 text-white', icon: CheckCircle },
      in_progress: { text: 'In Progress', color: 'bg-orange-500 text-white', icon: Clock },
      joined: { text: 'Interview Active', color: 'bg-green-500 text-white', icon: Phone },
      scheduled: { text: 'Scheduled', color: 'bg-blue-500 text-white', icon: Calendar },
      pending: { text: 'Pending', color: 'bg-gray-400 text-white', icon: Clock }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        <IconComponent className="w-3.5 h-3.5" />
        {config.text}
      </span>
    );
  };

  const getStageIcon = (stage) => {
    const iconClass = "w-6 h-6";
    const IconComponent = getStageIconComponent(stage.stage_slug);
    
    if (stage.status === 'completed') {
      return <CheckCircle className={`${iconClass} text-white`} />;
    }
    if (stage.status === 'in_progress' || stage.status === 'joined') {
      return <Clock className={`${iconClass} text-white`} />;
    }
    if (stage.status === 'scheduled') {
      return <Calendar className={`${iconClass} text-white`} />;
    }
    return <IconComponent className={`${iconClass} text-white opacity-50`} />;
  };

  const getStageIconBg = (status) => {
    const bgMap = {
      completed: 'bg-teal-600',
      in_progress: 'bg-orange-500',
      joined: 'bg-green-600',
      scheduled: 'bg-blue-500',
      pending: 'bg-gray-400'
    };
    return bgMap[status] || 'bg-gray-400';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleJoinInterview = async (stage) => {
    if (!stage.interview_id) {
      notify.error('Interview ID not found');
      return;
    }

    setJoiningCall(true);
    
    try {
      // ✅ Detect interview type
      const isHRRound = stage.stage_slug === 'hr-round';
      const type = isHRRound ? 'hr_video' : 'telephonic';
      
      let result;
      
      if (isHRRound) {
        // ✅ Join HR video meeting
        result = await dispatch(joinHRMeeting(stage.session_id)).unwrap();
      } else {
        // Join telephonic call
        result = await dispatch(joinCall(stage.interview_id)).unwrap();
      }
      
      if (result.success) {
        setCurrentInterview({
          interview_id: stage.interview_id,
          recruiter_name: result.recruiter_name || 'Recruiter',
          job_title: result.job_title || applicationData.job_title,
          session_id: result.session?.session_id || result.session_id,
          status: 'joined',
          stage_slug: stage.stage_slug,
          zegoConfig: isHRRound ? {
            appID: Number(result.zegocloud_config.app_id),
            roomID: result.zegocloud_config.room_id,
            token: result.zegocloud_config.token,
            userID: result.zegocloud_config.user_id,
            userName: 'Candidate'
          } : null,
          session_started_at: result.session?.started_at || null,
        });
        setInterviewType(type);
        setShowCallInterface(true);
        notify.success('Successfully joined the interview');
      }
    } catch (error) {
      console.error('Failed to join interview:', error);
      notify.error(error?.message || 'Failed to join interview');
    } finally {
      setJoiningCall(false);
    }
  };

  const handleCallInterfaceClose = () => {
    hasManuallyMinimizedRef.current = true; 
    setShowCallInterface(false);
  };

  const canJoinInterview = (stage) => {
    return stage.status === 'in_progress' && stage.interview_id;
  };

  const shouldShowReminder = (stage) => {
    if (stage.status !== 'scheduled' || !stage.scheduled_at) return false;

    const scheduledTime = new Date(stage.scheduled_at);
    const now = new Date();
    const diffMs = scheduledTime - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours <= 24 && diffHours > -0.25;
  };

  const getTimeUntilInterview = (scheduledAt) => {
    const scheduledTime = new Date(scheduledAt);
    const now = new Date();
    const diffMs = scheduledTime - now;
    
    if (diffMs < 0) return 'Interview time has passed';
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `in ${hours} hour${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min` : ''}`;
    } else if (minutes > 0) {
      return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return 'starting soon';
    }
  };

  const currentStage = applicationData?.stages?.find(s =>
    s.status === 'in_progress' || s.status === 'joined' || s.status === 'scheduled');
  const nextStageIndex = applicationData?.stages?.findIndex(s => 
    s.status === 'in_progress' || s.status === 'joined' || s.status === 'scheduled');
  const nextStage = nextStageIndex >= 0 && nextStageIndex < (applicationData?.stages?.length - 1) 
    ? applicationData?.stages[nextStageIndex + 1] 
    : null;

  if (loading && !applicationData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold mb-2">Failed to load application</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => dispatch(fetchApplicationProgress(applicationId))}
            className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!applicationData) {
    return null;
  }

  const hasNoStages = applicationData.stages?.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/candidate/applications')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Applications
          </button>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {applicationData.company_logo ? (
                  <img
                    src={applicationData.company_logo}
                    alt={applicationData.company_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="bg-slate-700 text-white text-2xl font-bold w-full h-full flex items-center justify-center">
                    {applicationData.company_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{applicationData.job_title}</h1>
                <p className="text-gray-600 mt-1">{applicationData.company_name}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/candidate/application/detail/${applicationId}`)}
              className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors"
            >
              View Application Details
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {applicationData.warning && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-900">
                  Selection Process Not Configured
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {applicationData.warning}. The recruiter hasn't set up the hiring stages for this position yet.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Application Progress</h2>
              <p className="text-sm text-gray-600 mb-4">
                {hasNoStages 
                  ? 'Your application has been submitted. The hiring process will be updated soon.'
                  : 'Overall progress across all stages of your application.'}
              </p>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  {applicationData.progress.percentage}% Complete
                </span>
                <span className="text-sm text-gray-600">
                  {applicationData.progress.completed} of {applicationData.progress.total} Completed
                </span>
              </div>
              
              <div className="w-full bg-white rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${applicationData.progress.percentage}%` }}
                />
              </div>
            </div>

            {hasNoStages ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selection Process Coming Soon
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  The recruiter is still setting up the interview stages for this position. 
                  You'll be notified once the hiring process begins.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6">
                  <div className="space-y-4">
                    {applicationData.stages?.map((stage, index) => (
                      <div key={stage.stage_id} className="relative">
                        {index < applicationData.stages.length - 1 && (
                          <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
                        )}
                        
                        <div className="relative flex items-start gap-4 bg-gray-50 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className={`w-12 h-12 rounded-lg ${getStageIconBg(stage.status)} flex items-center justify-center flex-shrink-0 relative z-10`}>
                            {getStageIcon(stage)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h3 className="text-base font-semibold text-gray-900">{stage.stage_name}</h3>

                                {/* ✅ SCHEDULED - show scheduled time + reminder only */}
                                {stage.status === 'scheduled' && stage.scheduled_at && (
                                  <div className="mt-2 space-y-2">
                                    <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5" />
                                      Scheduled for {formatDateTime(stage.scheduled_at)}
                                    </p>
                                    {stage.scheduled_duration_minutes && (
                                      <p className="text-xs text-gray-500">
                                        Duration: {stage.scheduled_duration_minutes} minutes
                                      </p>
                                    )}

                                    {shouldShowReminder(stage) ? (
                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                          <Bell className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                          <div className="flex-1">
                                            <p className="text-xs font-semibold text-blue-900">Upcoming Interview</p>
                                            <p className="text-xs text-blue-700 mt-1">
                                              Your interview is {getTimeUntilInterview(stage.scheduled_at)}
                                            </p>
                                            <p className="text-xs text-blue-600 mt-1">
                                              The recruiter will start the call at the scheduled time.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                          <p className="text-xs text-gray-600">
                                            Interview scheduled {getTimeUntilInterview(stage.scheduled_at)}.
                                            You'll be notified when the recruiter starts the call.
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* ✅ IN PROGRESS / JOINED - show ready banner only */}
                                {(stage.status === 'in_progress' || stage.status === 'joined') && (
                                  <div className="mt-2">
                                    {/* Show scheduled time if exists */}
                                    {stage.scheduled_at && (
                                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Scheduled for {formatDateTime(stage.scheduled_at)}
                                      </p>
                                    )}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                      <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 animate-pulse flex-shrink-0" />
                                        <div className="flex-1">
                                          <p className="text-xs font-semibold text-green-900">
                                            {stage.status === 'joined' ? 'Interview Active' : 'Interview Ready'}
                                          </p>
                                          <p className="text-xs text-green-700 mt-1">
                                            {stage.status === 'joined'
                                              ? 'You are currently in the interview call'
                                              : 'The recruiter has started the interview. Click below to join now.'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* ✅ COMPLETED - show completed date only, NO scheduled date */}
                                {(stage.status === 'completed' || stage.status === 'passed') && (
                                  <div className="mt-2">
                                    {stage.completed_at && (
                                      <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        Completed on {formatDate(stage.completed_at)}
                                      </p>
                                    )}
                                    {stage.score !== null && stage.score !== undefined && (
                                      <p className="text-sm text-teal-600 font-semibold mt-2">
                                        Score: {stage.score}%
                                        {stage.result && (
                                          <span className={`ml-2 ${stage.result === 'passed' ? 'text-green-600' : 'text-red-600'}`}>
                                            ({stage.result})
                                          </span>
                                        )}
                                      </p>
                                    )}
                                    {/* ✅ Only show feedback for THIS stage */}
                                    {stage.feedback && (
                                      <p className="text-xs text-gray-600 mt-2 italic bg-white p-2 rounded border border-gray-200">
                                        "{stage.feedback}"
                                      </p>
                                    )}
                                  </div>
                                )}

                                {/* ✅ PENDING - show nothing extra */}

                              </div>
                              <div className="flex-shrink-0">
                                {getStatusBadge(stage.status)}
                              </div>
                            </div>

                            {/* Join button - only in_progress */}
                            {canJoinInterview(stage) && (
                              <button
                                onClick={() => handleJoinInterview(stage)}
                                disabled={joiningCall}
                                className="mt-3 flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors animate-pulse disabled:opacity-50"
                              >
                                {joiningCall ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Joining...
                                  </>
                                ) : (
                                  <>
                                    <Phone className="w-4 h-4" />
                                    Join Interview Now
                                    <ArrowRight className="w-4 h-4" />
                                  </>
                                )}
                              </button>
                            )}

                            {/* Resume button - only when joined but modal closed */}
                            {stage.status === 'joined' && currentInterview && !showCallInterface && (
                              <button
                                onClick={() => setShowCallInterface(true)}
                                className="mt-3 flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                                Resume Call
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {currentStage && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Current Status</h2>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Bell className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{currentStage.stage_name}</h3>
                    {currentStage.scheduled_at && (
                      <p className="text-xs text-gray-600 mt-1">
                        Scheduled: {formatDateTime(currentStage.scheduled_at)}
                      </p>
                    )}
                    {(currentStage.status === 'in_progress' || currentStage.status === 'joined') && !currentStage.scheduled_at && (
                      <p className="text-xs text-gray-600 mt-1">
                        {currentStage.status === 'joined' ? 'Interview active' : 'Ready to join'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {hasNoStages && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Application Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="text-sm font-semibold text-gray-900 capitalize">
                      {applicationData.current_stage_status || 'Submitted'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Applied On</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatDate(applicationData.applied_at)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Position</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {applicationData.job_title}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {nextStage && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Next Step</h2>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{nextStage.stage_name}</h3>
                    <p className="text-xs text-blue-700 font-medium mt-1">
                      Status: {nextStage.status === 'scheduled' ? 'Scheduled' : 'Pending'}
                    </p>
                    {nextStage.scheduled_at && (
                      <p className="text-xs text-gray-600 mt-2">
                        {formatDateTime(nextStage.scheduled_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Application Stats</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{applicationData.progress.completed}</div>
                  <div className="text-xs text-gray-600 mt-1">Stages Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(
                      applicationData.stages
                        ?.filter(s => s.score !== null)
                        .reduce((sum, s, _, arr) => sum + s.score / arr.length, 0)
                    ) || 0}%
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.floor((new Date() - new Date(applicationData.applied_at)) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Days in Process</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Contact Recruiter</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => dispatch(fetchApplicationProgress(applicationId))}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <RefreshCw className={`w-4 h-4 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Refresh Status</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {currentInterview && (
        <div style={{ display: showCallInterface ? 'block' : 'none' }}>
          {console.log('📦 Rendering VideoInterviewInterface with:', {
            showCallInterface,
            currentInterview,
            interviewType,
            zegoConfig: currentInterview?.zegoConfig,
            appID: currentInterview?.zegoConfig?.appID,
            roomID: currentInterview?.zegoConfig?.roomID,
            token: currentInterview?.zegoConfig?.token ? `${currentInterview.zegoConfig.token.substring(0, 30)}...` : 'UNDEFINED',
            userID: currentInterview?.zegoConfig?.userID,
          })}
          {interviewType === 'hr_video' ? (
            <VideoInterviewInterface
              interview={currentInterview}
              zegoConfig={currentInterview.zegoConfig}
              sessionStartedAt={currentInterview.session_started_at}
              isRecruiter={false}
              onClose={handleCallInterfaceClose}
              onMinimize={handleCallInterfaceClose}
              onCallEnd={() => {
                setShowCallInterface(false);
                setCurrentInterview(null);
                setInterviewType(null);
                hasManuallyMinimizedRef.current = false;
                dispatch(fetchApplicationProgress(applicationId));
              }}
            />
          ) : (
            <InterviewCallInterface
              interview={currentInterview}
              isRecruiter={false}
              onClose={handleCallInterfaceClose}
              onCallEnd={() => {
                setShowCallInterface(false);
                setCurrentInterview(null);
                setInterviewType(null);
                hasManuallyMinimizedRef.current = false;
                dispatch(fetchApplicationProgress(applicationId));
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default JobApplicationTracker;