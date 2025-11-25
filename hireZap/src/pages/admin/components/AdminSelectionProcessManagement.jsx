import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Save, X, Trash2, RefreshCw, FileText, Phone, Video, Users, CheckCircle,AlertCircle, Award, Briefcase, Lock } from 'lucide-react';
import CreateStageModal from '../../../modals/CreateStageModal';

import { 
  fetchAllStages, 
  fetchInactiveStages,
  reactivateSelectionStage,
  deleteSelectionStage, 
  clearStageError, 
  clearSuccessMessage 
} from '../../../redux/slices/selectionStageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicationById } from '../../../redux/slices/applicationSlice';

const AdminSelectionProcessManagement = () => {

  const dispatch = useDispatch();

  const { 
    stages, 
    freeStages, 
    premiumStages,
    selectedStage, 
    inactiveStages,
    loading, 
    error, 
    successMessage 
  } = useSelector((state) => state.selectionStage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const iconMap = {
    FileText, Phone, Video, Users, CheckCircle, Award, Briefcase, Lock,AlertCircle
  };

  // Fetch stages on mount
  useEffect(() => {
    dispatch(fetchAllStages());
    dispatch(fetchInactiveStages())
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

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

  const handleDelete = async (stageId) => {
    if (window.confirm(`Are you sure you want to delete?`)) {
      await dispatch(deleteSelectionStage(stageId)).unwrap();
      // Refresh stages list
      dispatch(fetchAllStages());
      dispatch(fetchInactiveStages())
    }
  };

  const handleReactivate = async (stageId) => {
    if (window.confirm('Are you sure you want to reactivate this stage?')) {
      await dispatch(reactivateSelectionStage(stageId)).unwrap();
      dispatch(fetchAllStages());
      dispatch(fetchInactiveStages());
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingStage(null);
    setIsCreating(false);
    // Refresh stages after modal closes
    dispatch(fetchAllStages());
    dispatch(fetchInactiveStages())
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


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Selection Process Management</h1>
            <p className="text-sm text-gray-600 mt-1">Configure hiring stages for recruitment process</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showInactive 
                  ? 'bg-gray-100 border-gray-300 text-gray-700' 
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              {showInactive ? 'Hide' : 'Show'} Inactive Stages
              {inactiveStages.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                  {inactiveStages.length}
                </span>
              )}
            </button>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Stage
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mx-6 mt-6">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-6">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Active Stages</p>
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
            <p className="text-sm text-gray-600">Inactive Stages</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{inactiveStages.length}</p>
          </div>
        </div>
      </div>

      {/* Inactive Stages Section */}
      {showInactive && inactiveStages.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Inactive Stages</h2>
              <span className="text-sm text-gray-600">
                (These stages are hidden from users but can be reactivated)
              </span>
            </div>
            <div className="space-y-3">
              {inactiveStages.map((stage) => {
                const Icon = iconMap[stage.icon];
                return (
                  <div key={stage.id} className="bg-white rounded-xl p-5 border border-orange-300 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-2 bg-gray-100 rounded-lg opacity-60">
                          <Icon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-semibold text-gray-700">{stage.name}</h3>
                            {getTierBadge(stage.tier)}
                            <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded">
                              Inactive
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                          {stage.duration && (
                            <p className="text-xs text-gray-500 mt-2">Duration: {stage.duration}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleReactivate(stage.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          title="Reactivate this stage"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Reactivate
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
        onClose={handleModalClose}
        editingStage={editingStage}
        isCreating={isCreating}
      />
    </div>
  );
};

export default AdminSelectionProcessManagement;