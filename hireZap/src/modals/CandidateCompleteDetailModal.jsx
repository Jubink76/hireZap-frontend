import React from 'react';
import {
    X, User, Mail, Phone, MapPin, Briefcase, Link,
    Clock, TrendingUp, CheckCircle, XCircle, Award,
    FileText, ExternalLink, Star, ChevronRight
} from 'lucide-react';

// ─── Small helpers ────────────────────────────────────────────────────────────
const InfoItem = ({ icon: Icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-2.5">
            <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
            </div>
        </div>
    );
};

const ScoreBar = ({ label, score }) => {
    const color = score == null ? 'bg-gray-300'
        : score >= 80 ? 'bg-green-500'
        : score >= 60 ? 'bg-amber-400'
        : 'bg-red-500';
    return (
        <div>
            <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600 capitalize">{label.replace(/_/g, ' ')}</span>
                <span className="font-semibold text-gray-800">{score ?? '—'}/100</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${score ?? 0}%` }} />
            </div>
        </div>
    );
};

const StagePill = ({ status }) => {
    const cfg = {
        qualified: { text: 'Qualified', color: 'bg-green-100 text-green-700' },
        rejected:  { text: 'Rejected',  color: 'bg-red-100 text-red-700'   },
        started:   { text: 'Started',   color: 'bg-blue-100 text-blue-700' },
    }[status] || { text: status, color: 'bg-gray-100 text-gray-600' };

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
            {cfg.text}
        </span>
    );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────
const CandidateCompleteDetailModal = ({ isOpen, onClose, candidate }) => {
    if (!isOpen || !candidate) return null;

    const stages       = candidate.stage_performances || [];
    const offerStatus  = candidate.offer_status;
    const appStatus    = candidate.application_status;

    const offerBannerConfig = {
        accepted: { bg: 'bg-green-50 border-green-300', text: 'text-green-800', label: '🎉 Candidate Accepted the Offer — Hired!', icon: CheckCircle },
        declined: { bg: 'bg-red-50 border-red-300',   text: 'text-red-800',   label: '❌ Candidate Declined the Offer',           icon: XCircle    },
        sent:     { bg: 'bg-blue-50 border-blue-300', text: 'text-blue-800',  label: '📬 Offer Sent — Awaiting Response',          icon: Clock      },
    }[offerStatus];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">

                {/* ── Header ──────────────────────────────────────────── */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow">
                            {candidate.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
                            <p className="text-sm text-gray-500">Complete Candidate Profile</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">

                    {/* Offer status banner */}
                    {offerBannerConfig && (
                        <div className={`flex items-center gap-3 border rounded-xl p-4 ${offerBannerConfig.bg}`}>
                            <offerBannerConfig.icon className={`w-5 h-5 flex-shrink-0 ${offerBannerConfig.text}`} />
                            <p className={`text-sm font-semibold ${offerBannerConfig.text}`}>
                                {offerBannerConfig.label}
                            </p>
                        </div>
                    )}

                    {/* ── Personal Info ────────────────────────────────── */}
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" /> Personal Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem icon={User}     label="Full Name"         value={candidate.name} />
                            <InfoItem icon={Mail}     label="Email"             value={candidate.email} />
                            <InfoItem icon={Phone}    label="Phone"             value={candidate.phone} />
                            <InfoItem icon={MapPin}   label="Location"          value={candidate.location} />
                            <InfoItem icon={Briefcase} label="Current Company"  value={candidate.current_company} />
                            <InfoItem icon={Clock}    label="Experience"        value={candidate.years_of_experience ? `${candidate.years_of_experience} years` : null} />
                            {candidate.linkedin_profile && (
                                <div className="flex items-start gap-2.5">
                                    <Link className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400">LinkedIn</p>
                                        <a
                                            href={candidate.linkedin_profile}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            View Profile <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            )}
                            {candidate.resume_url && (
                                <div className="flex items-start gap-2.5">
                                    <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400">Resume</p>
                                        <a
                                            href={candidate.resume_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            Download <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Overall Score ────────────────────────────────── */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-amber-900 mb-1 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" /> Final Stage Score
                                </h3>
                                <p className="text-xs text-amber-700">
                                    Based on {candidate.last_stage_name || 'last completed stage'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`text-5xl font-black ${
                                    candidate.last_score >= 80 ? 'text-green-600'
                                    : candidate.last_score >= 60 ? 'text-amber-600'
                                    : 'text-red-500'
                                }`}>
                                    {candidate.last_score ?? '—'}
                                </p>
                                <p className="text-xs text-amber-700">out of 100</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Stage Journey ─────────────────────────────────── */}
                    {stages.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-5 flex items-center gap-2">
                                <Award className="w-4 h-4" /> Selection Journey
                            </h3>

                            <div className="space-y-4">
                                {stages.map((stage, idx) => (
                                    <div key={stage.stage_id} className="relative">
                                        {/* Connector line */}
                                        {idx < stages.length - 1 && (
                                            <div className="absolute left-5 top-10 w-0.5 h-6 bg-gray-200" />
                                        )}

                                        <div className={`rounded-xl border p-4 ${
                                            stage.status === 'qualified' ? 'border-green-200 bg-green-50'
                                            : stage.status === 'rejected' ? 'border-red-200 bg-red-50'
                                            : 'border-gray-200 bg-gray-50'
                                        }`}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Step number */}
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                                        stage.status === 'qualified' ? 'bg-green-500 text-white'
                                                        : stage.status === 'rejected' ? 'bg-red-500 text-white'
                                                        : 'bg-gray-400 text-white'
                                                    }`}>
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-semibold text-gray-900">
                                                                {stage.stage_name}
                                                            </h4>
                                                            <StagePill status={stage.status} />
                                                        </div>
                                                        {stage.completed_at && (
                                                            <p className="text-xs text-gray-400 mt-0.5">
                                                                Completed {new Date(stage.completed_at).toLocaleDateString('en-US', {
                                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                                })}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Score */}
                                                {stage.score != null && (
                                                    <div className="text-right flex-shrink-0">
                                                        <p className={`text-2xl font-bold ${
                                                            stage.score >= 80 ? 'text-green-600'
                                                            : stage.score >= 60 ? 'text-amber-500'
                                                            : 'text-red-500'
                                                        }`}>
                                                            {stage.score}
                                                        </p>
                                                        <p className="text-xs text-gray-400">Score</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Score bar */}
                                            {stage.score != null && (
                                                <div className="mt-3">
                                                    <div className="w-full bg-white rounded-full h-1.5">
                                                        <div
                                                            className={`h-1.5 rounded-full ${
                                                                stage.score >= 80 ? 'bg-green-500'
                                                                : stage.score >= 60 ? 'bg-amber-400'
                                                                : 'bg-red-500'
                                                            }`}
                                                            style={{ width: `${stage.score}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Feedback */}
                                            {stage.feedback && (
                                                <div className="mt-3 pt-3 border-t border-white/60">
                                                    <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                                                        <FileText className="w-3 h-3" /> Feedback
                                                    </p>
                                                    <p className="text-sm text-gray-700 leading-relaxed italic">
                                                        "{stage.feedback}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Close */}
                    <div className="flex justify-end pt-2 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateCompleteDetailModal;