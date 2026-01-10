import React, { useState } from 'react';
import { X, Settings, CheckCircle, AlertCircle, Phone, Clock, TrendingUp } from 'lucide-react';

const TelephoneConfigModal = ({ 
  isOpen, 
  onClose, 
  jobId,
  existingConfig = null,
  onSave 
}) => {
  const [config, setConfig] = useState({
    passing_score: existingConfig?.passing_score || 70,
    default_duration: existingConfig?.default_duration || 30,
    enable_auto_recording: existingConfig?.enable_auto_recording !== false,
    enable_notifications: existingConfig?.enable_notifications !== false,
    enable_email_notifications: existingConfig?.enable_email_notifications !== false,
    evaluation_criteria: existingConfig?.evaluation_criteria || [
      'communication',
      'technical_knowledge',
      'problem_solving',
      'attitude',
      'overall_impression'
    ],
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateConfig = () => {
    const newErrors = {};

    if (config.passing_score < 0 || config.passing_score > 100) {
      newErrors.passing_score = 'Passing score must be between 0 and 100';
    }

    if (config.default_duration < 10 || config.default_duration > 120) {
      newErrors.default_duration = 'Duration must be between 10 and 120 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateConfig()) {
      return;
    }

    onSave({
      job_id: jobId,
      ...config,
    });
  };

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Telephonic Round Configuration</h2>
              <p className="text-sm text-gray-600 mt-1">Set up evaluation criteria and settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Passing Score */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Minimum Passing Score *
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={config.passing_score}
                onChange={(e) => handleChange('passing_score', parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.passing_score}
                  onChange={(e) => handleChange('passing_score', parseInt(e.target.value))}
                  className={`w-20 px-3 py-2 border rounded-lg text-center font-bold ${
                    errors.passing_score ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <span className="text-gray-600 font-medium">/100</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Candidates scoring below this threshold will be marked as not qualified
            </p>
            {errors.passing_score && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.passing_score}
              </p>
            )}
          </div>

          {/* Default Duration */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
              <Clock className="w-4 h-4 text-blue-600" />
              Default Interview Duration *
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={config.default_duration}
                onChange={(e) => handleChange('default_duration', parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={config.default_duration}
                  onChange={(e) => handleChange('default_duration', parseInt(e.target.value))}
                  className={`w-20 px-3 py-2 border rounded-lg text-center font-bold ${
                    errors.default_duration ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <span className="text-gray-600 font-medium">mins</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              This will be pre-filled when scheduling interviews
            </p>
            {errors.default_duration && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.default_duration}
              </p>
            )}
          </div>

          {/* Recording & Notifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-600" />
              Call Settings
            </h3>
            
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={config.enable_auto_recording}
                onChange={(e) => handleChange('enable_auto_recording', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 block">
                  Enable Automatic Recording
                </span>
                <span className="text-sm text-gray-600">
                  Automatically start recording when the call begins
                </span>
              </div>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={config.enable_notifications}
                onChange={(e) => handleChange('enable_notifications', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 block">
                  Send In-App Notifications
                </span>
                <span className="text-sm text-gray-600">
                  Notify candidates about scheduled interviews via app
                </span>
              </div>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={config.enable_email_notifications}
                onChange={(e) => handleChange('enable_email_notifications', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 block">
                  Send Email Notifications
                </span>
                <span className="text-sm text-gray-600">
                  Notify candidates about scheduled interviews via email
                </span>
              </div>
            </label>
          </div>

          {/* Evaluation Criteria */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Evaluation Criteria
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                The following criteria will be used to evaluate candidates:
              </p>
              <div className="space-y-2">
                {[
                  { key: 'communication', label: 'Communication Skills' },
                  { key: 'technical_knowledge', label: 'Technical Knowledge' },
                  { key: 'problem_solving', label: 'Problem Solving' },
                  { key: 'attitude', label: 'Attitude & Cultural Fit' },
                  { key: 'overall_impression', label: 'Overall Impression' },
                ].map(criterion => (
                  <div key={criterion.key} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">{criterion.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Configuration Tips
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Set passing score based on role seniority and requirements</li>
                <li>• Longer durations allow for deeper technical discussions</li>
                <li>• Recording helps with quality assurance and training</li>
                <li>• Email notifications ensure candidates don't miss interviews</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelephoneConfigModal;