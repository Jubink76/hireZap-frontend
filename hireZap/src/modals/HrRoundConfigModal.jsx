import React, { useState } from 'react';
import { X, Settings, CheckCircle, AlertCircle, Video, Clock, TrendingUp } from 'lucide-react';

const HrRoundConfigModal = ({ 
  isOpen, 
  onClose, 
  jobId,
  existingConfig = null,
  onSave 
}) => {
  const [config, setConfig] = useState({
    passing_score: existingConfig?.passing_score || 70,
    default_duration: existingConfig?.default_duration || 45,
    enable_auto_recording: existingConfig?.enable_auto_recording !== false,
    enable_notifications: existingConfig?.enable_notifications !== false,
    enable_email_notifications: existingConfig?.enable_email_notifications !== false,
    // Evaluation weights
    communication_weight: existingConfig?.communication_weight || 25,
    culture_fit_weight: existingConfig?.culture_fit_weight || 20,
    motivation_weight: existingConfig?.motivation_weight || 15,
    professionalism_weight: existingConfig?.professionalism_weight || 15,
    problem_solving_weight: existingConfig?.problem_solving_weight || 15,
    team_collaboration_weight: existingConfig?.team_collaboration_weight || 10,
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateConfig = () => {
    const newErrors = {};

    if (config.passing_score < 0 || config.passing_score > 100) {
      newErrors.passing_score = 'Passing score must be between 0 and 100';
    }

    if (config.default_duration < 15 || config.default_duration > 180) {
      newErrors.default_duration = 'Duration must be between 15 and 180 minutes';
    }

    // Validate weights total to 100%
    const totalWeight = 
      config.communication_weight +
      config.culture_fit_weight +
      config.motivation_weight +
      config.professionalism_weight +
      config.problem_solving_weight +
      config.team_collaboration_weight;

    if (totalWeight !== 100) {
      newErrors.weights = `Total weight must be 100% (currently ${totalWeight}%)`;
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

  // Calculate total weight
  const totalWeight = 
    config.communication_weight +
    config.culture_fit_weight +
    config.motivation_weight +
    config.professionalism_weight +
    config.problem_solving_weight +
    config.team_collaboration_weight;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">HR Video Round Configuration</h2>
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
              Minimum Qualifying Score *
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
                min="15"
                max="180"
                step="5"
                value={config.default_duration}
                onChange={(e) => handleChange('default_duration', parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="15"
                  max="180"
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

          {/* Evaluation Weights */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                Evaluation Criteria Weights
              </h3>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                totalWeight === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                Total: {totalWeight}%
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              {[
                { key: 'communication_weight', label: 'Communication Skills' },
                { key: 'culture_fit_weight', label: 'Culture Fit' },
                { key: 'motivation_weight', label: 'Motivation & Interest' },
                { key: 'professionalism_weight', label: 'Professionalism' },
                { key: 'problem_solving_weight', label: 'Problem Solving' },
                { key: 'team_collaboration_weight', label: 'Team Collaboration' },
              ].map(criterion => (
                <div key={criterion.key} className="flex items-center gap-4">
                  <label className="flex-1 text-sm font-medium text-gray-700">
                    {criterion.label}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={config[criterion.key]}
                    onChange={(e) => handleChange(criterion.key, parseInt(e.target.value))}
                    className="w-32"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={config[criterion.key]}
                      onChange={(e) => handleChange(criterion.key, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    />
                    <span className="text-gray-600 text-sm">%</span>
                  </div>
                </div>
              ))}
            </div>
            
            {errors.weights && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.weights}
              </p>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              * Weights must total exactly 100%. Adjust the percentages to match your evaluation priorities.
            </p>
          </div>

          {/* Video & Notifications Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-600" />
              Video Interview Settings
            </h3>
            
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={config.enable_auto_recording}
                onChange={(e) => handleChange('enable_auto_recording', e.target.checked)}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 block">
                  Enable Automatic Recording
                </span>
                <span className="text-sm text-gray-600">
                  Automatically start recording when the video interview begins
                </span>
              </div>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={config.enable_notifications}
                onChange={(e) => handleChange('enable_notifications', e.target.checked)}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 block">
                  Send In-App Notifications
                </span>
                <span className="text-sm text-gray-600">
                  Notify candidates about scheduled HR interviews via app
                </span>
              </div>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={config.enable_email_notifications}
                onChange={(e) => handleChange('enable_email_notifications', e.target.checked)}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 block">
                  Send Email Notifications
                </span>
                <span className="text-sm text-gray-600">
                  Notify candidates about scheduled HR interviews via email
                </span>
              </div>
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-900 mb-1">
                Configuration Tips
              </p>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• HR rounds typically focus on culture fit, motivation, and soft skills</li>
                <li>• Longer durations (45-60 min) allow for deeper behavioral discussions</li>
                <li>• Recording helps with quality assurance and compliance</li>
                <li>• Ensure evaluation weights total 100% before saving</li>
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
              disabled={totalWeight !== 100}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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

export default HrRoundConfigModal;