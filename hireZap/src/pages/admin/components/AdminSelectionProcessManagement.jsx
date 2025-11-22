import React, { useState } from 'react';
import { Plus, Edit2, Save, X, Trash2, GripVertical, FileText, Phone, Video, Users, CheckCircle, Award, Briefcase, Lock } from 'lucide-react';
import CreateStageModal from '../../../modals/CreateStageModal';

const AdminSelectionProcessManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [stages, setStages] = useState([
    {
      id: 'resume-screening',
      name: 'Resume Screening',
      description: 'Screen submitted applications for minimum qualifications and fit.',
      icon: 'FileText',
      duration: '15 minutes',
      requiresPremium: false,
      tier: 'free',
      isDefault: true,
      order: 1
    },
    {
      id: 'telephonic',
      name: 'Telephonic Round',
      description: '30-minute recruiter phone interview to validate experience and interest.',
      icon: 'Phone',
      duration: '30 minutes',
      requiresPremium: false,
      tier: 'free',
      isDefault: true,
      order: 2
    },
    {
      id: 'hr-round',
      name: 'HR Round',
      description: 'In-depth deep dive on past projects, current role, and career goals.',
      icon: 'Users',
      duration: '45 minutes',
      requiresPremium: false,
      tier: 'free',
      isDefault: true,
      order: 3
    },
    {
      id: 'technical',
      name: 'Technical Round',
      description: 'Multi-round panel including system design, coding, and culture ask.',
      icon: 'Award',
      duration: '1-2 hours',
      requiresPremium: true,
      tier: 'per-post',
      isDefault: false,
      order: 4
    },
    {
      id: 'machine-task',
      name: 'Machine Task',
      description: 'Home assignment or timed test to evaluate frontend expertise.',
      icon: 'Briefcase',
      duration: '2-3 hours',
      requiresPremium: true,
      tier: 'professional',
      isDefault: false,
      order: 5
    },
    {
      id: 'group-discussion',
      name: 'Group Discussion',
      description: 'Home assignment or timed test to evaluate frontend expertise.',
      icon: 'Users',
      duration: '1 hour',
      requiresPremium: true,
      tier: 'professional',
      isDefault: false,
      order: 6
    },
    {
      id: 'ceo-round',
      name: 'CEO Round',
      description: 'Higher-level discussions and competency-based tests to hire specialists.',
      icon: 'Award',
      duration: '45 minutes',
      requiresPremium: true,
      tier: 'per-post',
      isDefault: false,
      order: 7
    },
    {
      id: 'offline-meeting',
      name: 'Offline Meeting',
      description: 'Home assignment or timed test to evaluate frontend expertise.',
      icon: 'Users',
      duration: '1-2 hours',
      requiresPremium: true,
      tier: 'enterprise',
      isDefault: false,
      order: 8
    },
    {
      id: 'offer',
      name: 'Offer',
      description: 'Compensation review, verbal offer, and formal letter issuance.',
      icon: 'CheckCircle',
      duration: '30 minutes',
      requiresPremium: false,
      tier: 'free',
      isDefault: true,
      order: 9
    }
  ]);

  const iconMap = {
    FileText, Phone, Video, Users, CheckCircle, Award, Briefcase, Lock
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingStage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (stage) => {
    setEditingStage(stage);
    setIsCreating(false);
    setIsModalOpen(true);
  };

  const handleSave = (stageData) => {
    if (isCreating) {
      const maxOrder = Math.max(...stages.map(s => s.order), 0);
      setStages([...stages, { ...stageData, order: maxOrder + 1 }]);
    } else {
      setStages(stages.map(s => s.id === stageData.id ? stageData : s));
    }
  };

  const handleDelete = (stageId) => {
    if (window.confirm('Are you sure you want to delete this stage?')) {
      setStages(stages.filter(s => s.id !== stageId));
    }
  };

  const getTierBadge = (tier) => {
    const badges = {
      free: { text: 'Free', color: 'bg-green-100 text-green-700' },
      'per-post': { text: 'Per Post', color: 'bg-blue-100 text-blue-700' },
      professional: { text: 'Professional', color: 'bg-purple-100 text-purple-700' },
      enterprise: { text: 'Enterprise', color: 'bg-orange-100 text-orange-700' }
    };
    const badge = badges[tier] || badges.free;
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const freeStages = stages.filter(s => !s.requiresPremium).sort((a, b) => a.order - b.order);
  const premiumStages = stages.filter(s => s.requiresPremium).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Selection Process Management</h1>
            <p className="text-sm text-gray-600 mt-1">Configure hiring stages for recruitment process</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Stage
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Stages</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stages.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Free Stages</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{freeStages.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Premium Stages</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{premiumStages.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Default Stages</p>
            <p className="text-2xl font-bold text-teal-600 mt-1">{stages.filter(s => s.isDefault).length}</p>
          </div>
        </div>
      </div>

      {/* Free Stages Section */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Free Stages</h2>
          <div className="space-y-3">
            {freeStages.map((stage) => {
              const Icon = iconMap[stage.icon];
              return (
                <div key={stage.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <Icon className="w-6 h-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-gray-900">{stage.name}</h3>
                          {getTierBadge(stage.tier)}
                          {stage.isDefault && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-600 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                        {stage.duration && (
                          <p className="text-xs text-gray-500 mt-2">Duration: {stage.duration}</p>
                        )}
                      </div>
                    </div>
                    {!stage.isDefault && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(stage)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(stage.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Premium Stages Section */}
      <div className="px-6 pb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Premium Stages</h2>
          <div className="space-y-3">
            {premiumStages.map((stage) => {
              const Icon = iconMap[stage.icon];
              return (
                <div key={stage.id} className="bg-purple-50 rounded-xl p-5 border border-purple-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-gray-900">{stage.name}</h3>
                          <Lock className="w-4 h-4 text-amber-500" />
                          {getTierBadge(stage.tier)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                        {stage.duration && (
                          <p className="text-xs text-gray-500 mt-2">Duration: {stage.duration}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(stage)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(stage.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage Modal */}
      <CreateStageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingStage={editingStage}
        isCreating={isCreating}
      />
    </div>
  );
};

export default AdminSelectionProcessManagement;