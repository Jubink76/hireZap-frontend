import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchInterviewDetails } from '../redux/slices/hrRoundSlice';
import { 
  X, 
  Video, 
  Mail, 
  Calendar, 
  Clock, 
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Download,
  User,
  Award,
  MessageSquare,
  FileText,
  Star,
  Loader2,
  Phone,
  ThumbsUp,
  ThumbsDown,
  HelpCircle
} from 'lucide-react';



const RECOMMENDATION_CONFIG = {
  strong_yes: { label: 'Strong Yes — Hire',      bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300'  },
  yes:        { label: 'Yes — Hire',              bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300'  },
  maybe:      { label: 'Maybe — Need Discussion', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  no:         { label: 'No — Reject',             bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300'    },
  strong_no:  { label: 'Strong No — Reject',      bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300'    },
};

const DECISION_CONFIG = {
  qualified:      { label: 'Qualified',      bg: 'bg-green-50',  border: 'border-green-300',  text: 'text-green-700'  },
  not_qualified:  { label: 'Not Qualified',  bg: 'bg-red-50',    border: 'border-red-300',    text: 'text-red-700'    },
  pending_review: { label: 'Pending Review', bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700' },
};

const formatDateTime = (ds) => {
  if (!ds) return 'N/A';
  return new Date(ds).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const formatDuration = (seconds) => {
  if (!seconds) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};


const InfoRow = ({ icon: Icon, label, value, valueClassName = 'text-gray-900 font-medium' }) => (
  <div className="flex items-start gap-2">
    <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className={valueClassName}>{value || 'N/A'}</p>
    </div>
  </div>
);

const ScoreBar = ({ label, score }) => {
  const barColor = score == null ? 'bg-gray-300'
    : score >= 80 ? 'bg-green-500'
    : score >= 60 ? 'bg-yellow-500'
    : 'bg-red-500';

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-700 flex items-center gap-2 capitalize">
          <Star className="w-3 h-3 text-purple-400" />
          {label.replace(/_/g, ' ')}
        </span>
        <span className="font-semibold text-gray-900">{score ?? '—'}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${score ?? 0}%` }}
        />
      </div>
    </div>
  );
};

const NoteCard = ({ title, rating, notes, bgColor, borderColor, titleColor, textColor, icon: Icon }) => {
  if (rating == null && !notes) return null;
  return (
    <div className={`${bgColor} ${borderColor} border rounded-xl p-4`}>
      <h4 className={`text-sm font-semibold ${titleColor} mb-2 flex items-center gap-2`}>
        <Icon className="w-4 h-4" />
        {title}
        {rating != null && (
          <span className="ml-auto font-normal text-xs opacity-80">{rating}/100</span>
        )}
      </h4>
      {notes && <p className={`text-sm ${textColor} leading-relaxed`}>{notes}</p>}
      {!notes && rating != null && (
        <p className="text-xs opacity-60 italic">Score recorded, no written notes.</p>
      )}
    </div>
  );
};


const HrRoundCandidateDetailModal = ({ 
  isOpen, 
  onClose, 
  candidate,
  minQualifyingScore = 70
}) => {
  const dispatch = useDispatch();

  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  useEffect(() => {
    if (!isOpen || !candidate?.interview_id) return;
    setDetail(null);
    setFetchError(null);
    setIsPlayingRecording(false);
    setPlaybackTime(0);
    setLoadingDetail(true);

    dispatch(fetchInterviewDetails(candidate.interview_id))
      .unwrap()
      .then(data => setDetail(data))
      .catch(err => setFetchError(typeof err === 'string' ? err : 'Failed to load interview details'))
      .finally(() => setLoadingDetail(false));
  }, [isOpen, candidate?.interview_id, dispatch]);

  if (!isOpen || !candidate) return null;

  const notes    = detail?.notes    || {};
  const result   = detail?.result   || {};
  const recording = detail?.recording || null;

  const isCompleted   = detail?.status === 'completed' || candidate.status === 'completed';
  const score         = result?.final_score ?? candidate.performance_score ?? null;
  const decision      = result?.decision ?? null;               // 'qualified' | 'not_qualified' | 'pending_review'
  const recommendation = notes?.recommendation ?? null;          // 'strong_yes' | 'yes' | 'maybe' | 'no' | 'strong_no'

  const isQualified = decision === 'qualified'
    || (!decision && score != null && score >= minQualifyingScore);

  const decisionCfg = decision ? DECISION_CONFIG[decision] : null;
  const recCfg      = recommendation ? RECOMMENDATION_CONFIG[recommendation] : null;

  const scoreColor   = score == null ? 'text-gray-400'
    : score >= 80 ? 'text-green-600'
    : score >= 60 ? 'text-yellow-600'
    : 'text-red-600';

  const scoreBgColor = score == null ? 'bg-gray-50'
    : score >= 80 ? 'bg-green-50'
    : score >= 60 ? 'bg-yellow-50'
    : 'bg-red-50';

  const recordingUrl  = recording?.video_url || candidate.recording_url;
  const durationMins  = detail?.actual_duration_minutes
    || (candidate.call_duration ? Math.round(candidate.call_duration / 60) : null);
  const durationSecs  = recording?.duration_seconds || (durationMins ? durationMins * 60 : 0);

  const hasAnyNotes = Object.values(notes).some(v => v != null && v !== '' && v !== false);
  const hasBreakdown = [
    notes.communication_rating, notes.culture_fit_rating, notes.motivation_rating,
    notes.professionalism_rating, notes.problem_solving_rating, notes.team_collaboration_rating
  ].some(v => v != null);

  const toggleRecording  = () => setIsPlayingRecording(p => !p);
  const downloadRecording = () => { if (recordingUrl) window.open(recordingUrl, '_blank'); };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">

        {/*Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow">
              {candidate.name?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm text-gray-500">HR Video Interview Details</p>
                {decisionCfg && !loadingDetail && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${decisionCfg.bg} ${decisionCfg.text} border ${decisionCfg.border}`}>
                    {decisionCfg.label}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Loading */}
          {loadingDetail && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              <p className="text-sm">Loading interview results...</p>
            </div>
          )}

          {/* Fetch error*/}
          {fetchError && !loadingDetail && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {fetchError} — showing available data only.
            </div>
          )}

          {/* Score Card  */}
          {!loadingDetail && isCompleted && score != null && (
            <div className={`${scoreBgColor} border-2 ${isQualified ? 'border-green-300' : 'border-red-300'} rounded-xl p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Performance Score</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {isQualified
                      ? <CheckCircle className="w-5 h-5 text-green-600" />
                      : <XCircle    className="w-5 h-5 text-red-600"   />}
                    <span className={`text-sm font-semibold ${isQualified ? 'text-green-700' : 'text-red-700'}`}>
                      {decision === 'pending_review' ? 'Pending Review'
                        : isQualified ? 'Qualified for Next Round'
                        : 'Did Not Qualify'}
                    </span>
                    {/* Recruiter recommendation badge */}
                    {recCfg && (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${recCfg.bg} ${recCfg.text} ${recCfg.border}`}>
                        {recCfg.label}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-6xl font-black ${scoreColor}`}>{score}</div>
                  <div className="text-sm text-gray-500 mt-0.5">out of 100</div>
                </div>
              </div>

              {/* Score bar */}
              <div className="bg-white/80 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span>Minimum qualifying score</span>
                  <span className="font-semibold text-gray-700">{minQualifyingScore}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-700 ${isQualified ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min((score / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Decision reason */}
              {result?.decision_reason && (
                <p className="mt-3 text-sm text-gray-700 bg-white/70 rounded-lg p-3 italic border border-white">
                  "{result.decision_reason}"
                </p>
              )}
            </div>
          )}

          {/* Incomplete / not-yet-completed notice */}
          {!loadingDetail && !isCompleted && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3 text-sm text-blue-700">
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              This interview has not been completed yet. Full results will appear once the interview is finished.
            </div>
          )}

          {/* Interview Information  */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Interview Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoRow icon={User}     label="Candidate"      value={candidate.name} />
              <InfoRow icon={Mail}     label="Email"          value={candidate.email} />
              {(candidate.phone || detail?.candidate_phone) && (
                <InfoRow icon={Phone}  label="Phone"          value={detail?.candidate_phone || candidate.phone} />
              )}
              <InfoRow icon={Calendar} label="Interview Date"
                value={formatDateTime(detail?.ended_at || candidate.interview_completed_at || candidate.interview_scheduled_at)} />
              <InfoRow icon={Clock}    label="Duration"
                value={durationMins ? `${durationMins} mins` : 'N/A'} />
              <InfoRow icon={Award}    label="Status"
                valueClassName={`font-medium ${
                  isCompleted
                    ? (isQualified ? 'text-green-600' : decision === 'pending_review' ? 'text-yellow-600' : 'text-red-600')
                    : 'text-blue-600'
                }`}
                value={
                  isCompleted
                    ? (decision === 'pending_review' ? 'Pending Review' : isQualified ? 'Qualified' : 'Not Qualified')
                    : (detail?.status || candidate.status || 'N/A')
                }
              />
              <InfoRow icon={Video}    label="Recording"
                valueClassName={`font-medium ${recordingUrl ? 'text-blue-600' : 'text-gray-500'}`}
                value={recordingUrl ? 'Available' : 'Not Available'} />
            </div>
          </div>

          {/* Recording Player*/}
          {recordingUrl && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Video className="w-4 h-4" />
                Interview Recording
              </h3>
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-4 mb-2">
                  <button
                    onClick={toggleRecording}
                    className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white transition-colors shadow"
                  >
                    {isPlayingRecording
                      ? <Pause className="w-5 h-5" />
                      : <Play  className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: durationSecs ? `${(playbackTime / durationSecs) * 100}%` : '0%' }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatDuration(playbackTime)}</span>
                      <span>{formatDuration(durationSecs)}</span>
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
                <p className="text-xs text-gray-400">Click play to watch the interview recording</p>
              </div>
            </div>
          )}

          {/* Performance Breakdown */}
          {!loadingDetail && isCompleted && (
            hasBreakdown ? (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Performance Breakdown
                </h3>
                <div className="space-y-3">
                  <ScoreBar label="Communication"      score={notes.communication_rating} />
                  <ScoreBar label="Culture Fit"        score={notes.culture_fit_rating} />
                  <ScoreBar label="Motivation"         score={notes.motivation_rating} />
                  <ScoreBar label="Professionalism"    score={notes.professionalism_rating} />
                  <ScoreBar label="Problem Solving"    score={notes.problem_solving_rating} />
                  <ScoreBar label="Team Collaboration" score={notes.team_collaboration_rating} />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-5 text-center text-gray-400 text-sm">
                No detailed performance ratings were recorded for this interview.
              </div>
            )
          )}

          {/* Detailed Notes Grid */}
          {!loadingDetail && hasAnyNotes && (
            <div className="grid grid-cols-2 gap-4">
              <NoteCard title="Communication"      rating={notes.communication_rating}     notes={notes.communication_notes}
                bgColor="bg-blue-50"    borderColor="border-blue-200"    titleColor="text-blue-900"    textColor="text-blue-800"    icon={MessageSquare} />
              <NoteCard title="Culture Fit"        rating={notes.culture_fit_rating}       notes={notes.culture_fit_notes}
                bgColor="bg-purple-50"  borderColor="border-purple-200"  titleColor="text-purple-900"  textColor="text-purple-800"  icon={Award} />
              <NoteCard title="Motivation"         rating={notes.motivation_rating}        notes={notes.motivation_notes}
                bgColor="bg-green-50"   borderColor="border-green-200"   titleColor="text-green-900"   textColor="text-green-800"   icon={TrendingUp} />
              <NoteCard title="Professionalism"    rating={notes.professionalism_rating}   notes={notes.professionalism_notes}
                bgColor="bg-indigo-50"  borderColor="border-indigo-200"  titleColor="text-indigo-900"  textColor="text-indigo-800"  icon={CheckCircle} />
              <NoteCard title="Problem Solving"    rating={notes.problem_solving_rating}   notes={notes.problem_solving_notes}
                bgColor="bg-orange-50"  borderColor="border-orange-200"  titleColor="text-orange-900"  textColor="text-orange-800"  icon={AlertTriangle} />
              <NoteCard title="Team Collaboration" rating={notes.team_collaboration_rating} notes={notes.team_collaboration_notes}
                bgColor="bg-teal-50"    borderColor="border-teal-200"    titleColor="text-teal-900"    textColor="text-teal-800"    icon={User} />
            </div>
          )}

          {/* Overall Assessment */}
          {!loadingDetail && (notes.overall_impression || notes.strengths || notes.areas_for_improvement || notes.general_notes) && (
            <div className="space-y-4">
              {notes.overall_impression && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Overall Impression
                  </h3>
                  <p className="text-sm text-purple-800 leading-relaxed">{notes.overall_impression}</p>
                </div>
              )}
              {notes.strengths && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Key Strengths
                  </h3>
                  <p className="text-sm text-green-800 whitespace-pre-line leading-relaxed">{notes.strengths}</p>
                </div>
              )}
              {notes.areas_for_improvement && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Areas for Improvement
                  </h3>
                  <p className="text-sm text-yellow-800 whitespace-pre-line leading-relaxed">{notes.areas_for_improvement}</p>
                </div>
              )}
              {notes.general_notes && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Additional Notes
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{notes.general_notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Recommendation Summary  */}
          {!loadingDetail && isCompleted && score != null && (
            <div className={`border-2 rounded-xl p-5 ${
              decision === 'pending_review'
                ? 'bg-yellow-50 border-yellow-300'
                : isQualified
                  ? 'bg-green-50 border-green-300'
                  : 'bg-red-50 border-red-300'
            }`}>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                {decision === 'pending_review' ? (
                  <><HelpCircle className="w-5 h-5 text-yellow-600" /><span className="text-yellow-900">Recommendation: Pending Review</span></>
                ) : isQualified ? (
                  <><ThumbsUp className="w-5 h-5 text-green-600" /><span className="text-green-900">Recommendation: Proceed to Next Round</span></>
                ) : (
                  <><ThumbsDown className="w-5 h-5 text-red-600" /><span className="text-red-900">Recommendation: Not Qualified</span></>
                )}
              </h3>
              <p className={`text-sm leading-relaxed ${
                decision === 'pending_review' ? 'text-yellow-800'
                  : isQualified ? 'text-green-800' : 'text-red-800'
              }`}>
                {decision === 'pending_review'
                  ? `The candidate scored ${score}/100. Their application requires further discussion before a final decision is made.`
                  : isQualified
                    ? `The candidate scored ${score}/100, exceeding the minimum of ${minQualifyingScore}. Based on the comprehensive evaluation, they are recommended to advance to the next stage.`
                    : `The candidate scored ${score}/100, below the minimum of ${minQualifyingScore}. The overall assessment indicates they may not be the best fit for this role at this time.`
                }
              </p>
              {result?.next_steps && (
                <div className="mt-3 pt-3 border-t border-current/20">
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">Next Steps</p>
                  <p className="text-sm">{result.next_steps}</p>
                </div>
              )}
            </div>
          )}

          {/*  Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Close
            </button>
            {recordingUrl && (
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

export default HrRoundCandidateDetailModal;