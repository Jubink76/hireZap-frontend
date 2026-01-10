import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Volume2,
  Download,
  User,
  Award,
  MessageSquare
} from 'lucide-react';

const TelephonicCandidateDetailModal = ({ 
  isOpen, 
  onClose, 
  candidate,
  minQualifyingScore = 70
}) => {
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  if (!isOpen || !candidate) return null;

  const isQualified = candidate.performance_score >= minQualifyingScore;
  const scoreColor = candidate.performance_score >= 80 ? 'text-green-600' : 
                     candidate.performance_score >= 60 ? 'text-yellow-600' : 'text-red-600';
  const scoreBgColor = candidate.performance_score >= 80 ? 'bg-green-50' : 
                       candidate.performance_score >= 60 ? 'bg-yellow-50' : 'bg-red-50';

  // Mock analysis data
  const performanceAnalysis = {
    communication: 85,
    technical_knowledge: 78,
    problem_solving: 82,
    enthusiasm: 90,
    clarity: 75,
    professionalism: 88
  };

  const keyHighlights = [
    "Strong communication skills with clear articulation",
    "Demonstrated good understanding of technical concepts",
    "Showed enthusiasm and interest in the role",
    "Provided relevant examples from past experience"
  ];

  const areasForImprovement = [
    "Could elaborate more on problem-solving approach",
    "Some technical answers lacked depth"
  ];

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleRecording = () => {
    setIsPlayingRecording(!isPlayingRecording);
    // In real implementation, control audio playback
  };

  const downloadRecording = () => {
    // In real implementation, download the recording
    window.open(candidate.recording_url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-opacity-bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {candidate.name}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
              <p className="text-sm text-gray-600">Telephonic Interview Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Performance Score Card */}
          <div className={`${scoreBgColor} border-2 ${
            isQualified ? 'border-green-300' : 'border-red-300'
          } rounded-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall Performance Score</h3>
                <div className="flex items-center gap-2">
                  {isQualified ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${isQualified ? 'text-green-700' : 'text-red-700'}`}>
                    {isQualified ? 'Qualified for Next Round' : 'Did Not Qualify'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-5xl font-bold ${scoreColor}`}>
                  {candidate.performance_score}
                </div>
                <div className="text-sm text-gray-600">out of 100</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Minimum Score Required</span>
                <span className="font-semibold text-gray-900">{minQualifyingScore}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    candidate.performance_score >= minQualifyingScore ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(candidate.performance_score / 100) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interview Details */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Interview Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-600">Candidate</p>
                  <p className="font-medium text-gray-900">{candidate.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{candidate.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{candidate.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-600">Interview Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDateTime(candidate.interview_completed_at || candidate.interview_scheduled_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-600">Duration</p>
                  <p className="font-medium text-gray-900">{formatDuration(candidate.call_duration || 0)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className={`font-medium ${isQualified ? 'text-green-600' : 'text-red-600'}`}>
                    {isQualified ? 'Qualified' : 'Not Qualified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recording Player */}
          {candidate.recording_url && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Interview Recording
              </h3>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-4 mb-3">
                  <button
                    onClick={toggleRecording}
                    className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    {isPlayingRecording ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${(playbackTime / (candidate.call_duration || 1)) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{formatDuration(playbackTime)}</span>
                      <span>{formatDuration(candidate.call_duration || 0)}</span>
                    </div>
                  </div>
                  <button
                    onClick={downloadRecording}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download Recording"
                  >
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Click play to listen to the interview recording
                </p>
              </div>
            </div>
          )}

          {/* Performance Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(performanceAnalysis).map(([skill, score]) => (
                <div key={skill}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 capitalize">{skill.replace('_', ' ')}</span>
                    <span className="font-semibold text-gray-900">{score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Highlights */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Key Highlights
            </h3>
            <ul className="space-y-2">
              {keyHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-green-800">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          {areasForImprovement.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {areasForImprovement.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-yellow-800">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Analysis Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI Analysis Summary
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              The candidate demonstrated strong communication skills and a solid understanding of the role requirements. 
              They articulated their thoughts clearly and provided relevant examples from their experience. 
              Technical knowledge was adequate, though there's room for improvement in depth of answers. 
              Overall, the candidate showed enthusiasm and professionalism throughout the interview.
              {isQualified 
                ? " Based on the performance score, the candidate is recommended to proceed to the next round."
                : " The candidate scored below the minimum qualifying threshold and may need additional preparation before advancing."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Close
            </button>
            {candidate.recording_url && (
              <button
                onClick={downloadRecording}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Recording
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelephonicCandidateDetailModal;