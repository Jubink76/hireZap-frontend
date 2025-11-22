import React, { useState } from 'react';
import { ChevronLeft, FileText, Phone, Video, Users, CheckCircle, Award, Briefcase, Calendar, Eye, Clock, ChevronDown, ChevronUp, Filter } from 'lucide-react';

const RecruiterHiringProcess = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [expandedStage, setExpandedStage] = useState('resume-screening');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, scheduled, completed

  // Mock jobs data
  const jobs = [
    { 
      id: 1, 
      title: 'Senior Frontend Developer', 
      location: 'Remote',
      applicants: 45, 
      status: 'active',
      stages: [
        { id: 'resume-screening', name: 'Resume Screening', icon: FileText, candidates: 24, pending: 8, completed: 16 },
        { id: 'telephonic', name: 'Telephonic Round', icon: Phone, candidates: 16, pending: 8, completed: 8 },
        { id: 'hr-round', name: 'HR Round', icon: Users, candidates: 8, pending: 5, completed: 3 },
        { id: 'technical', name: 'Technical Round', icon: Award, candidates: 3, pending: 2, completed: 1 },
        { id: 'offer', name: 'Offer', icon: CheckCircle, candidates: 1, pending: 1, completed: 0 }
      ]
    },
    { 
      id: 2, 
      title: 'Backend Engineer', 
      location: 'Bangalore, India',
      applicants: 32, 
      status: 'active',
      stages: [
        { id: 'resume-screening', name: 'Resume Screening', icon: FileText, candidates: 18, pending: 10, completed: 8 },
        { id: 'telephonic', name: 'Telephonic Round', icon: Phone, candidates: 8, pending: 5, completed: 3 }
      ]
    },
    { 
      id: 3, 
      title: 'Full Stack Developer', 
      location: 'Mumbai, India',
      applicants: 28, 
      status: 'draft',
      stages: []
    }
  ];

  // Mock candidates data with stage-specific information
  const candidatesData = {
    'resume-screening': [
      { id: 1, name: 'Ava Thompson', email: 'ava.thompson@example.com', score: 86, status: 'completed', avatar: '👩', appliedDate: '2d ago', reviewDate: '1d ago' },
      { id: 2, name: 'Noah Williams', email: 'noah.williams@example.com', score: 92, status: 'completed', avatar: '👨', appliedDate: '3d ago', reviewDate: '2d ago' },
      { id: 3, name: 'Olivia Chen', email: 'olivia.chen@example.com', score: 78, status: 'completed', avatar: '👩', appliedDate: '4d ago', reviewDate: '3d ago' },
      { id: 4, name: 'Liam Patel', email: 'liam.patel@example.com', score: 81, status: 'pending', avatar: '👨', appliedDate: '1d ago', reviewDate: null },
      { id: 5, name: 'Sophia Garcia', email: 'sophia.garcia@example.com', score: 88, status: 'completed', avatar: '👩', appliedDate: '5d ago', reviewDate: '4d ago' },
      { id: 6, name: 'Ethan Rossi', email: 'ethan.rossi@example.com', score: 73, status: 'pending', avatar: '👨', appliedDate: '2d ago', reviewDate: null }
    ],
    'telephonic': [
      { id: 1, name: 'Ava Thompson', email: 'ava.thompson@example.com', score: 86, status: 'scheduled', avatar: '👩', scheduledDate: 'Dec 15, 10:00 AM', duration: '30 min' },
      { id: 2, name: 'Noah Williams', email: 'noah.williams@example.com', score: 92, status: 'completed', avatar: '👨', scheduledDate: 'Dec 10, 2:00 PM', completedDate: 'Dec 10' },
      { id: 3, name: 'Olivia Chen', email: 'olivia.chen@example.com', score: 78, status: 'pending', avatar: '👩', scheduledDate: null, duration: null },
      { id: 5, name: 'Sophia Garcia', email: 'sophia.garcia@example.com', score: 88, status: 'scheduled', avatar: '👩', scheduledDate: 'Dec 16, 3:00 PM', duration: '30 min' }
    ],
    'hr-round': [
      { id: 2, name: 'Noah Williams', email: 'noah.williams@example.com', score: 92, status: 'completed', avatar: '👨', scheduledDate: 'Dec 12, 11:00 AM', completedDate: 'Dec 12' },
      { id: 5, name: 'Sophia Garcia', email: 'sophia.garcia@example.com', score: 88, status: 'scheduled', avatar: '👩', scheduledDate: 'Dec 18, 1:00 PM', duration: '45 min' },
      { id: 1, name: 'Ava Thompson', email: 'ava.thompson@example.com', score: 86, status: 'pending', avatar: '👩', scheduledDate: null, duration: null }
    ],
    'technical': [
      { id: 2, name: 'Noah Williams', email: 'noah.williams@example.com', score: 92, status: 'scheduled', avatar: '👨', scheduledDate: 'Dec 20, 10:00 AM', duration: '1-2 hours' },
      { id: 5, name: 'Sophia Garcia', email: 'sophia.garcia@example.com', score: 88, status: 'pending', avatar: '👩', scheduledDate: null, duration: null }
    ],
    'offer': [
      { id: 2, name: 'Noah Williams', email: 'noah.williams@example.com', score: 92, status: 'pending', avatar: '👨', offerAmount: '₹18 LPA', offerDate: null }
    ]
  };

  const getStageIcon = (iconName) => {
    const icons = { FileText, Phone, Video, Users, CheckCircle, Award, Briefcase };
    return icons[iconName] || FileText;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      scheduled: { text: 'Scheduled', color: 'bg-blue-100 text-blue-700' },
      completed: { text: 'Completed', color: 'bg-green-100 text-green-700' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getFilteredCandidates = (stageId) => {
    const candidates = candidatesData[stageId] || [];
    if (filterStatus === 'all') return candidates;
    return candidates.filter(c => c.status === filterStatus);
  };

  if (!selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Round Summary</h1>
            <p className="text-sm text-gray-600 mt-1">Manage candidates across interview stages</p>
          </div>

          <div className="grid gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{job.location}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-sm text-gray-600">{job.applicants} applicants</span>
                      {job.stages.length > 0 && (
                        <span className="text-sm text-gray-600">{job.stages.length} stages configured</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {job.status}
                    </span>
                    <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium">
                      View Stages
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const selectedStage = selectedJob.stages.find(s => s.id === expandedStage);
  const stageCandidates = getFilteredCandidates(expandedStage);

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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedJob.title} — Round Summary</h1>
            <p className="text-sm text-gray-600 mt-1">{selectedJob.location}</p>
          </div>
        </div>

        {/* Stage Tabs */}
        <div className="px-6 overflow-x-auto">
          <div className="flex gap-2 pb-4">
            {selectedJob.stages.map((stage, index) => {
              const Icon = getStageIcon(stage.icon.name);
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
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-600">{stage.candidates} Candidates</span>
                      <span className="text-xs text-yellow-600">{stage.pending} Pending</span>
                      <span className="text-xs text-green-600">{stage.completed} Completed</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Stage Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedStage?.name}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {stageCandidates.length} of {selectedStage?.candidates} candidates
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>
            </div>
          </div>

          {/* Candidates List */}
          <div className="divide-y divide-gray-200">
            {stageCandidates.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No candidates found for this filter</p>
              </div>
            ) : (
              stageCandidates.map((candidate) => (
                <div key={candidate.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xl">
                        {candidate.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-gray-900">{candidate.name}</h3>
                          <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                            Score: {candidate.score}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{candidate.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          {candidate.appliedDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Applied {candidate.appliedDate}
                            </span>
                          )}
                          {candidate.scheduledDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {candidate.status === 'completed' ? `Completed on ${candidate.completedDate}` : `Scheduled: ${candidate.scheduledDate}`}
                            </span>
                          )}
                          {candidate.duration && (
                            <span>Duration: {candidate.duration}</span>
                          )}
                          {candidate.offerAmount && (
                            <span>Offer: {candidate.offerAmount}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(candidate.status)}
                      {candidate.status === 'pending' && expandedStage !== 'offer' && (
                        <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Schedule next
                        </button>
                      )}
                      {candidate.status === 'pending' && expandedStage === 'offer' && (
                        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium">
                          Send Offer
                        </button>
                      )}
                      {candidate.status === 'scheduled' && (
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium">
                          Reschedule
                        </button>
                      )}
                      {candidate.status === 'completed' && (
                        <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium">
                          Move to Next
                        </button>
                      )}
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stage Statistics */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Candidates</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{selectedStage?.candidates}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Ready to Schedule</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{selectedStage?.pending}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{selectedStage?.completed}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Avg. Time Spent</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">2.5d</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterHiringProcess;