import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, TrendingUp, Award, GraduationCap, Key } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { configureATS, getATSConfig } from '../redux/slices/resumeScreeningSlice';

const ATSConfigurationModal = ({ isOpen, onClose, jobId, onSave }) => {
  const dispatch = useDispatch();

  const [config, setConfig] = useState({
    skills_weight: 40,
    experience_weight: 30,
    education_weight: 20,
    keywords_weight: 10,
    passing_score: 60,
    required_skills: [],
    preferred_skills: [],
    minimum_experience_years: 0,
    required_education: '',
    important_keywords: [],
    auto_reject_missing_skills: false,
    auto_reject_below_experience: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  // Load existing config when modal opens
  useEffect(() => {
    if (isOpen && jobId) {
      fetchATSConfig();
    }
  }, [isOpen, jobId]);

  const fetchATSConfig = async () => {
    try {
      const response = await dispatch(getATSConfig(jobId)).unwrap();
      console.log(' Fetched ATS Config:', response);
      
      if (response.config && !response.is_default) {
        setConfig(response.config);
      }
    } catch (err) {
      console.error('Failed to fetch ATS config:', err);
    }
  };

  const handleWeightChange = (field, value) => {
    const newValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    setConfig(prev => ({ ...prev, [field]: newValue }));
  };

  const totalWeight = 
    config.skills_weight + 
    config.experience_weight + 
    config.education_weight + 
    config.keywords_weight;

  const isWeightValid = totalWeight === 100;

  const addSkill = () => {
    if (newSkill.trim() && !config.required_skills.includes(newSkill.trim())) {
      setConfig(prev => ({
        ...prev,
        required_skills: [...prev.required_skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setConfig(prev => ({
      ...prev,
      required_skills: prev.required_skills.filter(s => s !== skill)
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !config.important_keywords.includes(newKeyword.trim())) {
      setConfig(prev => ({
        ...prev,
        important_keywords: [...prev.important_keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword) => {
    setConfig(prev => ({
      ...prev,
      important_keywords: prev.important_keywords.filter(k => k !== keyword)
    }));
  };

  const handleSave = async () => {
    if (!isWeightValid) {
      setError('Weights must sum to 100%');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(' Saving ATS Config:', { jobId, config });
      const response = await dispatch(configureATS({ jobId, configData: config })).unwrap();
      
      console.log(' ATS Config saved:', response);
      
      alert('ATS Configuration saved successfully!');
      
      if (onSave) {
        await onSave(response.config || response.data);
      }
      
    } catch (err) {
      console.error(' Failed to save ATS config:', err);
      setError(err.message || err.error || 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ATS Configuration</h2>
            <p className="text-sm text-gray-600 mt-1">Configure resume screening criteria</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Scoring Weights */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring Weights</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  Skills Weight
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.skills_weight}
                    onChange={(e) => handleWeightChange('skills_weight', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-600 font-medium">%</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  Experience Weight
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.experience_weight}
                    onChange={(e) => handleWeightChange('experience_weight', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-600 font-medium">%</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  Education Weight
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.education_weight}
                    onChange={(e) => handleWeightChange('education_weight', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-600 font-medium">%</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Key className="w-4 h-4 text-orange-600" />
                  Keywords Weight
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.keywords_weight}
                    onChange={(e) => handleWeightChange('keywords_weight', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-600 font-medium">%</span>
                </div>
              </div>
            </div>

            {/* Weight Validation */}
            <div className={`mt-4 p-3 rounded-lg ${
              isWeightValid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <p className={`text-sm font-medium ${
                isWeightValid ? 'text-green-800' : 'text-yellow-800'
              }`}>
                Total Weight: {totalWeight}%
                {!isWeightValid && ' (must equal 100%)'}
              </p>
            </div>
          </div>

          {/* Passing Score */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Passing Score (Minimum to Qualify)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={config.passing_score}
                onChange={(e) => setConfig(prev => ({ ...prev, passing_score: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.passing_score}
                  onChange={(e) => setConfig(prev => ({ ...prev, passing_score: parseInt(e.target.value) || 0 }))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-600 font-medium">/100</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Candidates scoring below {config.passing_score} will be automatically rejected
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Required Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add skill (e.g., React, Python)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                onClick={addSkill}
                type="button"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.required_skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-teal-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Important Keywords */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Important Keywords (Optional)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                placeholder="Add keyword"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                onClick={addKeyword}
                type="button"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.important_keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="hover:bg-orange-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Minimum Experience */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Minimum Experience (Years)
            </label>
            <input
              type="number"
              min="0"
              value={config.minimum_experience_years}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                minimum_experience_years: parseInt(e.target.value) || 0 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Required Education */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Required Education (Optional)
            </label>
            <select
              value={config.required_education}
              onChange={(e) => setConfig(prev => ({ ...prev, required_education: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">No requirement</option>
              <option value="diploma">Diploma</option>
              <option value="associate">Associate Degree</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="phd">PhD/Doctorate</option>
            </select>
          </div>

          {/* Auto-rejection Rules */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Auto-Rejection Rules</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.auto_reject_missing_skills}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    auto_reject_missing_skills: e.target.checked 
                  }))}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">
                  Auto-reject if missing required skills
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.auto_reject_below_experience}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    auto_reject_below_experience: e.target.checked 
                  }))}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">
                  Auto-reject if below minimum experience
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 z-10">
          <button
            onClick={onClose}
            type="button"
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            type="button"
            disabled={!isWeightValid || loading}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ATSConfigurationModal;