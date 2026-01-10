import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell,Loader2, MessageSquare, Briefcase , Calendar, CheckCircle, Clock, AlertCircle, ArrowRight,RefreshCw, FileText,Phone,Video,Users,Award       } from 'lucide-react';
import { fetchApplicationProgress } from '../../../redux/slices/applicationSlice';
import { useDispatch, useSelector } from 'react-redux';

const JobApplicationTracker = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {applicationData, loading, error} = useSelector(
    (state) => state.application
  )

  

  // Fetch application progress on mount and set up polling
  useEffect(() => {
    if (applicationId) {
      dispatch(fetchApplicationProgress(applicationId));
      
      // Poll every 30 seconds for updates
      const interval = setInterval(() => {
        dispatch(fetchApplicationProgress(applicationId));
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [applicationId, dispatch]);

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
    if (stage.status === 'in_progress') {
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

  const handleJoinInterview = (stage) => {
    if (stage.interview_id && stage.stage_slug === 'telephonic-round') {
      // Navigate to telephonic interview page
      navigate(`/candidate/telephonic-interview/${stage.interview_id}`);
    }
    // Add more interview types as needed
  };

  const canJoinInterview = (stage) => {
  // Only show join button if interview is actually in progress (started by recruiter)
  return stage.status === 'in_progress' && stage.interview_id;
};

// Add a helper function to check if we should show reminder
const shouldShowReminder = (stage) => {
  if (stage.status !== 'scheduled' || !stage.scheduled_at) return false;

  const scheduledTime = new Date(stage.scheduled_at);
  const now = new Date();

  const diffMs = scheduledTime - now;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  // Show reminder from 24h before until interview starts
  return diffHours <= 24 && diffHours > -0.25;
};

// Format time remaining until interview
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

  // Find current and next stages
  const currentStage = applicationData?.stages?.find(s => s.status === 'in_progress' || s.status === 'scheduled');
  const nextStageIndex = applicationData?.stages?.findIndex(s => s.status === 'in_progress' || s.status === 'scheduled');
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
              {/* Company Logo */}
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
          {/* Left Column - Application Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Progress Card */}
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

            {/* Stages List */}
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
                        {/* Connector Line */}
                        {index < applicationData.stages.length - 1 && (
                          <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
                        )}
                        
                        {/* Stage Card */}
                        <div className="relative flex items-start gap-4 bg-gray-50 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          {/* Icon */}
                          <div className={`w-12 h-12 rounded-lg ${getStageIconBg(stage.status)} flex items-center justify-center flex-shrink-0 relative z-10`}>
                            {getStageIcon(stage)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h3 className="text-base font-semibold text-gray-900">{stage.stage_name}</h3>
                                
                                {/* Scheduled Info - Show reminder */}
                                {stage.scheduled_at && stage.status === 'scheduled' && (
                                  <div className="mt-2 space-y-2">
                                    <p className="text-sm text-blue-600 font-medium">
                                      Scheduled for {formatDateTime(stage.scheduled_at)}
                                    </p>
                                    
                                    {/* Reminder Card */}
                                    {shouldShowReminder(stage) && (
                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                                        <div className="flex items-start gap-2">
                                          <Bell className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                          <div className="flex-1">
                                            <p className="text-xs font-semibold text-blue-900">
                                              Upcoming Interview
                                            </p>
                                            <p className="text-xs text-blue-700 mt-1">
                                              Your interview is scheduled {getTimeUntilInterview(stage.scheduled_at)}
                                            </p>
                                            <p className="text-xs text-blue-600 mt-1">
                                              The recruiter will start the call at the scheduled time. You'll be able to join once they begin.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* In Progress Info */}
                                {stage.status === 'in_progress' && (
                                  <div className="mt-2">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                      <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 animate-pulse" />
                                        <div className="flex-1">
                                          <p className="text-xs font-semibold text-green-900">
                                            Interview is Live
                                          </p>
                                          <p className="text-xs text-green-700 mt-1">
                                            The recruiter has started the interview. Click below to join now.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Completed Info */}
                                {stage.completed_at && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    Completed on {formatDate(stage.completed_at)}
                                  </p>
                                )}
                                
                                {/* Score */}
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
                                
                                {/* Feedback */}
                                {stage.feedback && (
                                  <p className="text-xs text-gray-600 mt-2 italic bg-white p-2 rounded border border-gray-200">
                                    "{stage.feedback}"
                                  </p>
                                )}
                              </div>
                              <div className="flex-shrink-0">
                                {getStatusBadge(stage.status)}
                              </div>
                            </div>

                            {/* Action Button - Only show when interview is in progress */}
                            {canJoinInterview(stage) && (
                              <button 
                                onClick={() => handleJoinInterview(stage)}
                                className="mt-3 flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors animate-pulse"
                              >
                                <Phone className="w-4 h-4" />
                                Join Interview Now
                                <ArrowRight className="w-4 h-4" />
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

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Current Status Card */}
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
                    {currentStage.status === 'in_progress' && !currentStage.scheduled_at && (
                      <p className="text-xs text-gray-600 mt-1">In progress</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Application Info Card - Show when no stages */}
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

            {/* Next Step Card */}
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

            {/* Application Stats Card */}
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
                        .filter(s => s.score !== null)
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

            {/* Quick Actions Card */}
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
    </div>
  );
};

export default JobApplicationTracker;