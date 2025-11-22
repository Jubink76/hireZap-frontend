import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, MessageSquare, BarChart3, Calendar, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

const JobApplicationTracker = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Mock application data - replace with actual API call
  const applicationData = {
    id: applicationId,
    job_title: 'Senior Frontend Developer',
    company_name: 'Tech Solutions Inc.',
    company_logo: null,
    applied_date: '2024-11-01T10:30:00Z',
    status: 'technical_challenge',
    
    // Progress tracking
    progress: {
      completed: 5,
      total: 7,
      percentage: 68
    },

    // Current status
    currentStatus: {
      stage: 'Technical Challenge Assigned',
      message: 'Complete the challenge by Friday, 5 PM.',
      scheduledDate: 'Sep 22, 2025',
      type: 'action_required' // action_required, scheduled, completed, pending
    },

    // Next step
    nextStep: {
      stage: 'Panel Interview',
      status: 'Scheduled',
      message: 'your review schedules on 21-08-2025 at 2:30pm',
      date: '21-08-2025',
      time: '2:30pm'
    },

    // Stats
    stats: {
      stagesCompleted: 5,
      averageScore: 86,
      daysInProcess: 21
    },

    // Application stages
    stages: [
      {
        id: 1,
        name: 'Application Submitted',
        description: 'Your application and resume were received.',
        status: 'completed',
        icon: 'check',
        date: '2024-11-01'
      },
      {
        id: 2,
        name: 'Resume Review',
        description: 'Recruiter reviewed your profile.',
        status: 'passed',
        icon: 'check',
        date: '2024-11-02'
      },
      {
        id: 3,
        name: 'Phone Screen',
        description: 'Initial screen with a recruiter.',
        status: 'completed',
        icon: 'check',
        date: '2024-11-05'
      },
      {
        id: 4,
        name: 'Technical Challenge',
        description: 'Take-home or live coding session.',
        status: 'in_progress',
        icon: 'clock',
        scheduledDate: 'Sep 22, 2025'
      },
      {
        id: 5,
        name: 'Panel Interview',
        description: 'your review schedules on 21-08-2025 at 2:30pm',
        status: 'scheduled',
        icon: 'calendar',
        scheduledDate: '21-08-2025',
        scheduledTime: '2:30pm'
      },
      {
        id: 6,
        name: 'References',
        description: 'Reference checks in progress.',
        status: 'pending',
        icon: 'pending'
      },
      {
        id: 7,
        name: 'Offer',
        description: 'Compensation and start date discussion.',
        status: 'pending',
        icon: 'pending'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setLoading(false), 500);
  }, [applicationId]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { text: 'Completed', color: 'bg-green-500 text-white', icon: CheckCircle },
      passed: { text: 'Passed', color: 'bg-green-500 text-white', icon: CheckCircle },
      in_progress: { text: 'In Progress', color: 'bg-orange-500 text-white', icon: Clock },
      scheduled: { text: 'Scheduled', color: 'bg-orange-400 text-white', icon: Calendar },
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
    
    if (stage.status === 'completed' || stage.status === 'passed') {
      return <CheckCircle className={`${iconClass} text-white`} />;
    }
    if (stage.status === 'in_progress') {
      return <Clock className={`${iconClass} text-white`} />;
    }
    if (stage.status === 'scheduled') {
      return <Calendar className={`${iconClass} text-white`} />;
    }
    return <Clock className={`${iconClass} text-white opacity-50`} />;
  };

  const getStageIconBg = (status) => {
    const bgMap = {
      completed: 'bg-teal-600',
      passed: 'bg-teal-600',
      in_progress: 'bg-orange-500',
      scheduled: 'bg-orange-400',
      pending: 'bg-gray-400'
    };
    return bgMap[status] || 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Application Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Progress Card */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Application Progress</h2>
              <p className="text-sm text-gray-600 mb-4">Overall progress across all stages of your application.</p>
              
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
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6">
                <div className="space-y-4">
                  {applicationData.stages.map((stage, index) => (
                    <div key={stage.id} className="relative">
                      {/* Connector Line */}
                      {index < applicationData.stages.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" style={{ height: 'calc(100% - 0rem)' }} />
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
                              <h3 className="text-base font-semibold text-gray-900">{stage.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                              {stage.date && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Completed on {new Date(stage.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              )}
                              {stage.scheduledDate && stage.status === 'scheduled' && (
                                <p className="text-xs text-orange-600 mt-2 font-medium">
                                  Scheduled: {stage.scheduledDate} {stage.scheduledTime && `at ${stage.scheduledTime}`}
                                </p>
                              )}
                              {stage.scheduledDate && stage.status === 'in_progress' && (
                                <p className="text-xs text-orange-600 mt-2 font-medium">
                                  Due: {stage.scheduledDate}
                                </p>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              {getStatusBadge(stage.status)}
                            </div>
                          </div>

                          {/* Action Button for Scheduled */}
                          {stage.status === 'scheduled' && (
                            <button className="mt-3 flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
                              Join Interview
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
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Current Status Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Current Status</h2>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{applicationData.currentStatus.stage}</h3>
                  <p className="text-xs text-gray-600 mt-1">{applicationData.currentStatus.message}</p>
                  {applicationData.currentStatus.scheduledDate && (
                    <p className="text-xs text-gray-500 mt-2">Scheduled: {applicationData.currentStatus.scheduledDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Next Step Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Next Step</h2>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{applicationData.nextStep.stage}</h3>
                  <p className="text-xs text-blue-700 font-medium mt-1">Status: {applicationData.nextStep.status}</p>
                  <p className="text-xs text-gray-600 mt-2">{applicationData.nextStep.message}</p>
                </div>
              </div>
            </div>

            {/* Application Stats Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Application Stats</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{applicationData.stats.stagesCompleted}</div>
                  <div className="text-xs text-gray-600 mt-1">Stages Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{applicationData.stats.averageScore}%</div>
                  <div className="text-xs text-gray-600 mt-1">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{applicationData.stats.daysInProcess}</div>
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
                
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">View Analytics</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bell className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Notification Settings</div>
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