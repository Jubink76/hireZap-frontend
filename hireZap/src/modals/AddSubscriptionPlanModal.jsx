import React, { useState } from 'react';
import { Plus, Edit2, Save, X, CheckCircle2, Lock, Zap, Award, Users, Crown, Briefcase, Trash2 } from 'lucide-react';

// Create/Edit Plan Modal Component
const  AddSubscriptionPlanModal= ({ isOpen, onClose, onSave, editingPlan, isCreating, userType }) => {
  const [formData, setFormData] = useState(editingPlan || {
    id: `new-${Date.now()}`,
    name: '',
    price: '',
    period: 'month',
    description: '',
    features: [
      { icon: 'CheckCircle2', text: '', available: true }
    ],
    buttonText: '',
    cardColor: 'cyan',
    badge: null,
    isDefault: false
  });

  const iconMap = {
    Lock, CheckCircle2, Zap, Award, Users, Crown, Briefcase
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { icon: 'CheckCircle2', text: '', available: true }]
    });
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.buttonText) {
      alert('Please fill in all required fields (Name, Price, Button Text)');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isCreating ? 'Create New Plan' : 'Edit Plan'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure {userType} subscription plan
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-red-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Premium, Professional"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 1499"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Period
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="month">Monthly</option>
                    <option value="3 months">3 Months</option>
                    <option value="6 months">6 Months</option>
                    <option value="year">Yearly</option>
                    <option value="per post">Per Post</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Color Theme
                  </label>
                  <select
                    value={formData.cardColor}
                    onChange={(e) => setFormData({ ...formData, cardColor: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="cyan">Cyan (Popular)</option>
                    <option value="emerald">Emerald (Premium)</option>
                    <option value="gray">Gray (Basic)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the plan"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="e.g., Start Free Trial, Subscribe"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value || null })}
                    placeholder="e.g., Most Popular, Save ₹499"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Plan Features</h3>
                <button
                  onClick={addFeature}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </button>
              </div>

              <div className="space-y-3">
                {formData.features.map((feature, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-1/4">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Icon
                        </label>
                        <select
                          value={feature.icon}
                          onChange={(e) => updateFeature(idx, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          {Object.keys(iconMap).map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Feature Text
                        </label>
                        <input
                          type="text"
                          value={feature.text}
                          onChange={(e) => updateFeature(idx, 'text', e.target.value)}
                          placeholder="e.g., Unlimited AI generations"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex-shrink-0 w-32">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={feature.available ? 'available' : 'coming-soon'}
                          onChange={(e) => updateFeature(idx, 'available', e.target.value === 'available')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="available">Available</option>
                          <option value="coming-soon">Coming Soon</option>
                        </select>
                      </div>

                      <button
                        onClick={() => removeFeature(idx)}
                        className="flex-shrink-0 mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove feature"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {!feature.available && (
                      <div className="mt-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Coming Soon Tag
                        </label>
                        <input
                          type="text"
                          value={feature.tag || 'Soon'}
                          onChange={(e) => updateFeature(idx, 'tag', e.target.value)}
                          placeholder="e.g., Soon, Coming Soon"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {formData.features.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No features added yet. Click "Add Feature" to get started.
                  </div>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              <div className={`${
                formData.cardColor === 'cyan' ? 'bg-cyan-50' :
                formData.cardColor === 'emerald' ? 'bg-emerald-50' :
                'bg-gray-50'
              } rounded-2xl p-6 border-2 border-gray-200 relative max-w-sm mx-auto`}>
                {formData.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={`${
                      formData.cardColor === 'cyan' ? 'bg-cyan-500' :
                      formData.cardColor === 'emerald' ? 'bg-emerald-600' :
                      'bg-gray-500'
                    } text-white text-xs font-bold px-4 py-1 rounded-full`}>
                      {formData.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {formData.name || 'Plan Name'}
                  </h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{formData.price || '0'}
                    </span>
                    <span className="text-gray-600 text-sm">/ {formData.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {formData.description || 'Plan description'}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="w-full bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg text-center">
                    {formData.buttonText || 'Button Text'}
                  </div>
                </div>

                <div className="space-y-3">
                  {formData.features.map((feature, idx) => {
                    const Icon = iconMap[feature.icon];
                    return (
                      <div key={idx} className="flex items-start">
                        <Icon className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                          feature.available ? 'text-gray-700' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm ${
                          feature.available ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {feature.text || 'Feature text'}
                          {!feature.available && (
                            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              {feature.tag || 'Soon'}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
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
            {isCreating ? 'Create Plan' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddSubscriptionPlanModal;