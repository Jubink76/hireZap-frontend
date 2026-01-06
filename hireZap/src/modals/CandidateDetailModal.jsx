import React from 'react';
import { X, TrendingUp, Award, GraduationCap, Key, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const CandidateDetailModal = ({ isOpen, onClose, candidate }) => {
  if (!isOpen || !candidate) return null;

  const scores = candidate.scores || {
    overall: 0,
    skills: 0,
    experience: 0,
    education: 0,
    keywords: 0
  };

  console.log('🔍 Candidate Modal Data:', { candidate, scores });
  return (
    <div className="fixed inset-0 bg-opacity-bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{candidate.candidate.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{candidate.candidate.email}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
            <div className="text-center">
              <p className="text-sm text-teal-700 font-medium mb-2">Overall ATS Score</p>
              <p className={`text-6xl font-bold ${
                scores.overall >= 70 ? 'text-green-600' : 
                scores.overall >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {scores.overall}
              </p>
              <p className="text-lg text-gray-600 mt-2">out of 100</p>
              <span className={`inline-block mt-4 px-4 py-2 rounded-full text-sm font-medium ${
                candidate.candidate.decision === 'qualified' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {candidate.decision === 'qualified' ? '✓ Qualified' : '✗ Rejected'}
              </span>
            </div>
          </div>

          {/* Score Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-gray-700">Skills Match</span>
                </div>
                <p className="text-3xl font-bold text-teal-600">{scores.skills}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${scores.skills}%` }} />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Experience</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">{scores.experience}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${scores.experience}%` }} />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Education</span>
                </div>
                <p className="text-3xl font-bold text-purple-600">{scores.education}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${scores.education}%` }} />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Key className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Keywords</span>
                </div>
                <p className="text-3xl font-bold text-orange-600">{scores.keywords}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${scores.keywords}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Matched Skills */}
          {candidate.details?.matched_skills && candidate.details.matched_skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Matched Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.details.matched_skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {candidate.details?.missing_skills && candidate.details.missing_skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.details.missing_skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    ✗ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience & Education */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-1">Experience</p>
              <p className="text-lg font-bold text-blue-700">
                {candidate.details?.experience_years || 0} years
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-900 mb-1">Education</p>
              <p className="text-lg font-bold text-purple-700">
                {candidate.details?.education || 'Not specified'}
              </p>
            </div>
          </div>

          {/* ATS Friendliness */}
          <div className={`rounded-lg p-4 border ${
            candidate.details?.is_ats_friendly 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start gap-3">
              {candidate.details?.is_ats_friendly ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  candidate.details?.is_ats_friendly ? 'text-green-900' : 'text-yellow-900'
                }`}>
                  {candidate.details?.is_ats_friendly ? 'ATS-Friendly Resume' : 'ATS Issues Detected'}
                </p>
                {!candidate.details?.is_ats_friendly && candidate.details?.ats_issues && (
                  <ul className="text-xs text-yellow-800 mt-2 space-y-1">
                    {candidate.details.ats_issues.map((issue, idx) => (
                      <li key={idx}>• {issue}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {candidate.details?.ai_summary && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 border border-gray-200 rounded-lg p-4">
                {candidate.details.ai_summary}
              </p>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-4">
            {candidate.details?.strengths && candidate.details.strengths.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-900 mb-2">Strengths</h3>
                <ul className="space-y-1">
                  {candidate.details.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-700">✓ {strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {candidate.details?.weaknesses && candidate.details.weaknesses.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-900 mb-2">Areas of Concern</h3>
                <ul className="space-y-1">
                  {candidate.details.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm text-gray-700">• {weakness}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailModal;