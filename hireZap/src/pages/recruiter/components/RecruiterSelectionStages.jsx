import React, { useState } from 'react';
import { ChevronLeft, FileText, Phone, Video, Users, CheckCircle, Award, Briefcase, Lock, Plus, X, ArrowUp, ArrowDown, AlertCircle, Crown } from 'lucide-react';

// Premium Required Modal
const PremiumModal = ({ isOpen, onClose, requiredTier, stageName }) => {
  if (!isOpen) return null;

  const tierInfo = {
    'per-post': {
      title: 'Per Post Payment Required',
      description: 'This stage requires purchasing an additional job post.',
      price: '₹999',
      features: ['Access to this stage', 'All interview stages', 'Advanced screening']
    },
    'professional': {
      title: 'Professional Plan Required',
      description: 'Upgrade to Professional plan to unlock this stage.',
      price: '₹2,999 / 3 months',
      features: ['Unlimited job postings', 'All stages access', 'Advanced analytics']
    },
    'enterprise': {
      title: 'Enterprise Plan Required',
      description: 'Upgrade to Enterprise plan to unlock this stage.',
      price: '₹5,999 / 6 months',
      features: ['Everything in Professional', 'Dedicated support', 'Custom branding']
    }
  };

  const info = tierInfo[requiredTier] || tierInfo['professional'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{info.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{stageName}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-900">{info.description}</p>
          </div>

          <div className="mb-6">
            <div className="text-2xl font-bold text-gray-900 mb-4">{info.price}</div>
            <div className="space-y-2">
              {info.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecruiterSelectionStages = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedStages, setSelectedStages] = useState([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [pendingStage, setPendingStage] = useState(null);

  // Mock recruiter subscription (change this based on actual subscription)
  const recruiterSubscription = {
    plan: 'free', // Options: 'free', 'per-post', 'professional', 'enterprise'
    jobPostsRemaining: 1
  };

  // Mock jobs data
  const jobs = [
    { id: 1, title: 'Senior Frontend Developer', applicants: 45, status: 'active' },
    { id: 2, title: 'Backend Engineer', applicants: 32, status: 'active' },
    { id: 3, title: 'Full Stack Developer', applicants: 28, status: 'draft' }
  ];

  // Available stages from admin
  const availableStages = [
    {
      id: 'resume-screening',
      name: 'Resume Screening',
      description: 'Screen submitted applications for minimum qualifications and fit.',
      icon: FileText,
      duration: '15 minutes',
      requiresPremium: false,
      tier: 'free'
    },
    {
      id: 'telephonic',
      name: 'Telephonic Round',
      description: '30-minute recruiter phone interview to validate experience and interest.',
      icon: Phone,
      duration: '30 minutes',
      requiresPremium: false,
      tier: 'free'
    },
    {
      id: 'hr-round',
      name: 'HR Round',
      description: 'In-depth deep dive on past projects, current role, and career goals.',
      icon: Users,
      duration: '45 minutes',
      requiresPremium: false,
      tier: 'free'
    },
    {
      id: 'technical',
      name: 'Technical Round',
      description: 'Multi-round panel including system design, coding, and culture ask.',
      icon: Award,
      duration: '1-2 hours',
      requiresPremium: true,
      tier: 'per-post'
    },
    {
      id: 'machine-task',
      name: 'Machine Task',
      description: 'Home assignment or timed test to evaluate frontend expertise.',
      icon: Briefcase,
      duration: '2-3 hours',
      requiresPremium: true,
      tier: 'professional'
    },
    {
      id: 'group-discussion',
      name: 'Group Discussion',
      description: 'Home assignment or timed test to evaluate frontend expertise.',
      icon: Users,
      duration: '1 hour',
      requiresPremium: true,
      tier: 'professional'
    },
    {
      id: 'ceo-round',
      name: 'CEO Round',
      description: 'Higher-level discussions and competency-based tests.',
      icon: Award,
      duration: '45 minutes',
      requiresPremium: true,
      tier: 'per-post'
    },
    {
      id: 'offline-meeting',
      name: 'Offline Meeting',
      description: 'Home assignment or timed test to evaluate frontend expertise.',
      icon: Users,
      duration: '1-2 hours',
      requiresPremium: true,
      tier: 'enterprise'
    },
    {
      id: 'offer',
      name: 'Offer',
      description: 'Compensation review, verbal offer, and formal letter issuance.',
      icon: CheckCircle,
      duration: '30 minutes',
      requiresPremium: false,
      tier: 'free'
    }
  ];

  const canAccessStage = (stage) => {
    if (!stage.requiresPremium) return true;
    
    if (recruiterSubscription.plan === 'enterprise') return true;
    if (recruiterSubscription.plan === 'professional' && ['per-post', 'professional'].includes(stage.tier)) return true;
    if (recruiterSubscription.plan === 'per-post' && stage.tier === 'per-post') return true;
    
    return false;
  };

  const handleStageSelect = (stage) => {
    if (stage.requiresPremium && !canAccessStage(stage)) {
      setPendingStage(stage);
      setShowPremiumModal(true);
      return;
    }

    if (selectedStages.find(s => s.id === stage.id)) {
      setSelectedStages(selectedStages.filter(s => s.id !== stage.id));
    } else {
      setSelectedStages([...selectedStages, { ...stage, order: selectedStages.length + 1 }]);
    }
  };

  const moveStage = (index, direction) => {
    const newStages = [...selectedStages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newStages.length) return;
    
    [newStages[index], newStages[targetIndex]] = [newStages[targetIndex], newStages[index]];
    setSelectedStages(newStages.map((stage, idx) => ({ ...stage, order: idx + 1 })));
  };

  const removeStage = (stageId) => {
    setSelectedStages(selectedStages.filter(s => s.id !== stageId).map((stage, idx) => ({ ...stage, order: idx + 1 })));
  };

  const handleSaveProcess = () => {
    console.log('Saving selection process for job:', selectedJob);
    console.log('Selected stages:', selectedStages);
    alert('Selection process saved successfully!');
  };

  if (!selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Selection Process</h1>
            <p className="text-sm text-gray-600 mt-1">Configure hiring stages for your job posts</p>
          </div>

          <div className="grid gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{job.applicants} applicants</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {job.status}
                    </span>
                    <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium">
                      Configure Stages
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
              <h1 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h1>
              <p className="text-sm text-gray-600 mt-1">Select Interview Stages</p>
            </div>
            <button
              onClick={handleSaveProcess}
              disabled={selectedStages.length === 0}
              className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              Save Process
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Available Stages */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Stages</h2>
              <div className="space-y-3">
                {availableStages.map((stage) => {
                  const Icon = stage.icon;
                  const isSelected = selectedStages.find(s => s.id === stage.id);
                  const hasAccess = canAccessStage(stage);

                  return (
                    <button
                      key={stage.id}
                      onClick={() => handleStageSelect(stage)}
                      disabled={isSelected}
                      className={`w-full text-left rounded-xl p-4 border-2 transition-all ${
                        isSelected
                          ? 'border-teal-300 bg-teal-50 opacity-50 cursor-not-allowed'
                          : hasAccess
                          ? 'border-gray-200 hover:border-teal-400 hover:shadow-md cursor-pointer'
                          : 'border-amber-200 bg-amber-50 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          hasAccess ? 'bg-teal-100' : 'bg-amber-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            hasAccess ? 'text-teal-600' : 'text-amber-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-gray-900">{stage.name}</h3>
                            {stage.requiresPremium && !hasAccess && (
                              <Lock className="w-4 h-4 text-amber-500" />
                            )}
                            {isSelected && (
                              <CheckCircle className="w-4 h-4 text-teal-600" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{stage.description}</p>
                          {stage.requiresPremium && !hasAccess && (
                            <div className="flex items-center gap-2 mt-2">
                              <Crown className="w-3 h-3 text-amber-600" />
                              <span className="text-xs font-medium text-amber-700">
                                Requires upgrade
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Stages */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Selected Stages ({selectedStages.length})
              </h2>

              {selectedStages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No stages selected yet</p>
                  <p className="text-gray-400 text-xs mt-1">Click on stages from the left to add them</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedStages.map((stage, index) => {
                    const Icon = stage.icon;
                    return (
                      <div
                        key={stage.id}
                        className="bg-teal-50 rounded-xl p-4 border-2 border-teal-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => moveStage(index, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-teal-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ArrowUp className="w-4 h-4 text-teal-700" />
                            </button>
                            <button
                              onClick={() => moveStage(index, 'down')}
                              disabled={index === selectedStages.length - 1}
                              className="p-1 hover:bg-teal-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ArrowDown className="w-4 h-4 text-teal-700" />
                            </button>
                          </div>

                          <div className="flex items-center justify-center w-8 h-8 bg-teal-600 text-white rounded-full font-bold text-sm">
                            {index + 1}
                          </div>

                          <div className="p-2 bg-teal-100 rounded-lg">
                            <Icon className="w-5 h-5 text-teal-600" />
                          </div>

                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">{stage.name}</h3>
                            <p className="text-xs text-gray-600 mt-1">{stage.duration}</p>
                          </div>

                          <button
                            onClick={() => removeStage(stage.id)}
                            className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedStages.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Process Order</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Candidates will go through these stages in the order shown above. Use arrows to reorder.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => {
          setShowPremiumModal(false);
          setPendingStage(null);
        }}
        requiredTier={pendingStage?.tier}
        stageName={pendingStage?.name}
      />
    </div>
  );
};

export default RecruiterSelectionStages;