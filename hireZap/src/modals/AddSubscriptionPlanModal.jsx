import React, { useState, useEffect } from 'react';
import {useDispatch} from 'react-redux';
import { Plus, Edit2, Save, X, CheckCircle2, Lock, Zap, Award, Users, Crown, Briefcase, Trash2 } from 'lucide-react';
import { createSubscriptionPlan,updatePlan } from '../redux/slices/subscriptionPlanSlice';

const AddSubscriptionPlanModal = ({ isOpen, onClose, editingPlan, isCreating, userType }) => {

  const dispatch = useDispatch();
  

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    period: 'month',
    description: '',
    features: [
      { icon: 'CheckCircle2', text: '', available: true }
    ],
    button_text: '', 
    card_color: 'cyan', 
    badge: null,
    is_default: false,
    is_free: false,
    user_type: userType
  });

  // Load editing plan data
  useEffect(() => {
    console.log(" Effect triggered:", { editingPlan, isOpen, userType });
    
    if (editingPlan) {
      const loadedData = {
        name: editingPlan.name || '',
        price: editingPlan.price || '',
        period: editingPlan.period || 'month',
        description: editingPlan.description || '',
        features: editingPlan.features || [{ icon: 'CheckCircle2', text: '', available: true }],
        button_text: editingPlan.buttonText || editingPlan.button_text || '', 
        card_color: editingPlan.cardColor || editingPlan.card_color || 'cyan', 
        badge: editingPlan.badge || null,
        is_default: editingPlan.isDefault || editingPlan.is_default || false,
        is_free: editingPlan.isFree || editingPlan.is_free || false,
        user_type: editingPlan.userType || editingPlan.user_type || userType
      };
      console.log(" Loading plan data:", loadedData);
      setFormData(loadedData);
    } else {
      const resetData = {
        name: '',
        price: '',
        period: 'month',
        description: '',
        features: [{ icon: 'CheckCircle2', text: '', available: true }],
        button_text: '',
        card_color: 'cyan',
        badge: null,
        is_default: false,
        is_free: false,
        user_type: userType
      };
      console.log(" Resetting form:", resetData);
      setFormData(resetData);
    }
  }, [editingPlan, userType, isOpen]);

  const iconMap = {
    Lock, CheckCircle2, Zap, Award, Users, Crown, Briefcase
  };

  const handleFreePlanChange = (isFree) =>{
    setFormData({
      ...formData,
      is_free: isFree,
      is_default:isFree,
      price:isFree? '0':formData.price,
      card_color:isFree?'gray':formData.card_color,
      button_text:isFree? 'Current Plan':formData.button_text
    });
  };

  const addFeature = () => {
    console.log(" Adding feature");
    setFormData({
      ...formData,
      features: [...formData.features, { icon: 'CheckCircle2', text: '', available: true }]
    });
  };

  const removeFeature = (index) => {
    console.log(" Removing feature at index:", index);
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const updateFeature = (index, field, value) => {
    console.log(` Updating feature ${index}, ${field}:`, value);
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSave = async () => {
    console.log(" Form Data:", JSON.stringify(formData, null, 2));
    console.log(" Is Creating:", isCreating);
    console.log(" Editing Plan:", editingPlan);
    
    // Validation
    console.log(" Starting validation...");
    
    if (!formData.name) {
      console.log(" Validation failed: name is empty");
      alert('Please enter a plan name');
      return;
    }
    
    if (!formData.price) {
      console.log(" Validation failed: price is empty");
      alert('Please enter a price');
      return;
    }
    
    if (!formData.button_text) {
      console.log(" Validation failed: button_text is empty");
      alert('Please enter button text');
      return;
    }

    // Validate features
    console.log(" Validating features...", formData.features);
    const hasEmptyFeatures = formData.features.some(f => !f.text || !f.text.trim());
    if (hasEmptyFeatures) {
      console.log(" Validation failed: empty features found");
      alert('Please fill in all feature texts or remove empty features');
      return;
    }

    console.log(" All validations passed!");

    try {
      if (isCreating) {
        console.log(" Creating new plan with data:", formData);
        const result = await dispatch(createSubscriptionPlan(formData)).unwrap();
        console.log(" Plan created successfully:", result);
      } else {
        console.log(" Updating plan ID:", editingPlan.id);
        const result = await dispatch(updatePlan({
          planId: editingPlan.id,
          planData: formData
        })).unwrap();
        console.log(" Plan updated successfully:", result);
      }
      console.log(" Closing modal...");
      onClose();
    } catch (error) {
      console.error(' Failed to save plan:', error);
      alert(error || 'Failed to save plan. Please try again.');
    }
  };

  console.log(" Rendering modal, isOpen:", isOpen);
  
  if (!isOpen) {
    console.log(" Modal closed, not rendering");
    return null;
  }

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
            onClick={() => {
              console.log("❌ Close button clicked");
              onClose();
            }}
            type="button"
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
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) => handleFreePlanChange(e.target.checked)}
                    className="mt-1 w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-semibold text-gray-900">
                      This is a Free Plan
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      Free plans are automatically set as the default plan for all users. 
                      Only one free plan can exist per user type.
                    </p>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      console.log("Name changed:", e.target.value);
                      setFormData({ ...formData, name: e.target.value });
                    }}
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
                    onChange={(e) => {
                      console.log("Price changed:", e.target.value);
                      setFormData({ ...formData, price: e.target.value });
                    }}
                    placeholder="e.g., 1499"
                    disabled={formData.is_free}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {formData.is_free && (
                    <p className="text-xs text-gray-500 mt-1">Price is automatically set to ₹0 for free plans</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Period
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    disabled={formData.is_free}
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
                    value={formData.card_color} // ✅ Fixed field name
                    onChange={(e) => setFormData({ ...formData, card_color: e.target.value })}
                    disabled={formData.is_free}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="cyan">Cyan (Popular)</option>
                    <option value="emerald">Emerald (Premium)</option>
                    <option value="gray">Gray (Basic)</option>
                    {formData.is_free && (
                      <p className="text-xs text-gray-500 mt-1">Free plans automatically use gray theme</p>
                    )}
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
                    value={formData.button_text} // ✅ Fixed field name
                    onChange={(e) => {
                      console.log("Button text changed:", e.target.value);
                      setFormData({ ...formData, button_text: e.target.value });
                    }}
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
                    disabled={formData.is_free}
                    placeholder="e.g., Most Popular, Save ₹499"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {formData.is_free && (
                    <p className="text-xs text-gray-500 mt-1">Free plans don't display badges</p>
                  )}
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Plan Features</h3>
                <button
                  onClick={addFeature}
                  type="button"
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
                        type="button"
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
                formData.card_color === 'cyan' ? 'bg-cyan-50' :
                formData.card_color === 'emerald' ? 'bg-emerald-50' :
                'bg-gray-50'
              } rounded-2xl p-6 border-2 border-gray-200 relative max-w-sm mx-auto`}>
                {formData.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={`${
                      formData.card_color === 'cyan' ? 'bg-cyan-500' :
                      formData.card_color === 'emerald' ? 'bg-emerald-600' :
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
                    {formData.button_text || 'Button Text'}
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
            onClick={() => {
              console.log("🚫 Cancel clicked");
              onClose();
            }}
            type="button"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              console.log("🖱️ Save button clicked, event:", e.type);
              e.preventDefault();
              handleSave();
            }}
            type="button"
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