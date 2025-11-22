import React, { useState } from 'react';
import { Plus, Edit2, Save, X, Trash2, GripVertical, FileText, Phone, Video, Users, CheckCircle, Award, Briefcase, Lock } from 'lucide-react';

// Create/Edit Stage Modal Component
const CreateStageModal = ({ isOpen, onClose, onSave, editingStage, isCreating }) => {
  const [formData, setFormData] = useState(editingStage || {
    id: `stage-${Date.now()}`,
    name: '',
    description: '',
    icon: 'FileText',
    duration: '',
    requiresPremium: false,
    tier: 'free',
    isDefault: false
  });

  const iconMap = {
    FileText, Phone, Video, Users, CheckCircle, Award, Briefcase, Lock
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      alert('Please fill in all required fields (Name and Description)');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Modal Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isCreating ? 'Create New Stage' : 'Edit Stage'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure hiring process stage
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-red-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-8 py-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stage Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Technical Round, HR Interview"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this stage"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {Object.keys(iconMap).map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 30 minutes, 1 hour"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Level
              </label>
              <select
                value={formData.tier}
                onChange={(e) => {
                  const tier = e.target.value;
                  setFormData({ 
                    ...formData, 
                    tier,
                    requiresPremium: tier !== 'free'
                  });
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="free">Free (Available to all)</option>
                <option value="per-post">Per Post Payment</option>
                <option value="professional">Professional Plan Required</option>
                <option value="enterprise">Enterprise Plan Required</option>
              </select>
            </div>

            {formData.requiresPremium && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Premium Stage</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Recruiters need {formData.tier === 'per-post' ? 'to purchase additional job posts' : `a ${formData.tier} subscription`} to use this stage.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    {React.createElement(iconMap[formData.icon] || FileText, {
                      className: "w-6 h-6 text-teal-600"
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        {formData.name || 'Stage Name'}
                      </h3>
                      {formData.requiresPremium && (
                        <Lock className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.description || 'Stage description'}
                    </p>
                    {formData.duration && (
                      <p className="text-xs text-gray-500 mt-2">
                        Duration: {formData.duration}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            {isCreating ? 'Create Stage' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStageModal;