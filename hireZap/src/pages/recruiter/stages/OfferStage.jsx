import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Award, RefreshCw, CheckSquare, ChevronRight, Eye,
    Users, TrendingUp, CheckCircle, Send, Loader2,
    Mail, UserCheck, XCircle, Clock
} from 'lucide-react';

import {
    fetchRankedCandidates,
    sendOffer,
    bulkSendOffer,
    toggleCandidateSelection,
    clearSelectedCandidates,
    selectAllCandidates,
    clearError,
    clearSuccessMessage,
} from '../../../redux/slices/offerSlice';

import { notify } from '../../../utils/toast';
import OfferSendModal from '../../../modals/OfferSendModal';
import CandidateCompleteDetailModal from '../../../modals/CandidateCompleteDetailModal'

// ─── StatCard (same as other stages) ─────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => {
    const colors = {
        gray:   'bg-gray-100 text-gray-600',
        blue:   'bg-blue-100 text-blue-600',
        green:  'bg-green-100 text-green-600',
        amber:  'bg-amber-100 text-amber-600',
        purple: 'bg-purple-100 text-purple-600',
    };
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colors[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
};

// ─── Offer status badge ───────────────────────────────────────────────────────
const getOfferBadge = (offerStatus, applicationStatus) => {
    // Final state takes priority
    if (applicationStatus === 'hired') {
        return (
            <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                <UserCheck className="w-3 h-3" /> Hired
            </span>
        );
    }
    if (applicationStatus === 'rejected' && offerStatus === 'declined') {
        return (
            <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                <XCircle className="w-3 h-3" /> Offer Declined
            </span>
        );
    }

    const config = {
        sent: {
            text: 'Offer Sent',
            color: 'bg-blue-100 text-blue-700',
            icon: Mail,
        },
        accepted: {
            text: 'Accepted',
            color: 'bg-green-100 text-green-700',
            icon: CheckCircle,
        },
        declined: {
            text: 'Declined',
            color: 'bg-red-100 text-red-700',
            icon: XCircle,
        },
    }[offerStatus] || {
        text: 'Pending Offer',
        color: 'bg-amber-100 text-amber-700',
        icon: Clock,
    };

    const Icon = config.icon;
    return (
        <span className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
            <Icon className="w-3 h-3" /> {config.text}
        </span>
    );
};

// ─── Send / Offered button per row ────────────────────────────────────────────
const OfferActionButton = ({ candidate, onSendOffer }) => {
    const { offer_status, application_status } = candidate;

    if (application_status === 'hired') {
        return (
            <button disabled className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium cursor-default">
                <UserCheck className="w-4 h-4" /> Hired
            </button>
        );
    }
    if (application_status === 'rejected' || offer_status === 'declined') {
        return (
            <button disabled className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium cursor-default">
                <XCircle className="w-4 h-4" /> Rejected
            </button>
        );
    }
    if (offer_status === 'sent' || offer_status === 'accepted') {
        return (
            <button disabled className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium cursor-default">
                <Mail className="w-4 h-4" /> Offered
            </button>
        );
    }

    // Not yet offered — show Send Offer button
    return (
        <button
            onClick={() => onSendOffer(candidate)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium transition-colors"
        >
            <Send className="w-4 h-4" /> Send Offer
        </button>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const OfferStage = ({ jobId, onRefresh }) => {
    const dispatch = useDispatch();

    const {
        candidates,
        candidatesLoading,
        selectedCandidates,
        loading,
        error,
        successMessage,
        total,
    } = useSelector((state) => state.offer);

    const [showSendModal,    setShowSendModal]    = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    // ── Error / success toasts ────────────────────────────────────────────
    useEffect(() => {
        if (error)          { notify.error(error);           dispatch(clearError());          }
    }, [error, dispatch]);

    useEffect(() => {
        if (successMessage) { notify.success(successMessage); dispatch(clearSuccessMessage()); }
    }, [successMessage, dispatch]);

    // ── Initial fetch ─────────────────────────────────────────────────────
    const handleRefresh = useCallback(async () => {
        if (!jobId) return;
        try {
            await dispatch(fetchRankedCandidates(jobId)).unwrap();
        } catch (err) {
            console.error('Failed to refresh offer candidates:', err);
        }
    }, [jobId, dispatch]);

    useEffect(() => { if (jobId) handleRefresh(); }, [jobId, handleRefresh]);

    // ── Stats ─────────────────────────────────────────────────────────────
    const sentCount     = candidates.filter(c => ['sent', 'accepted', 'declined'].includes(c.offer_status)).length;
    const acceptedCount = candidates.filter(c => c.offer_status === 'accepted' || c.application_status === 'hired').length;
    const pendingCount  = candidates.filter(c => !c.offer_status).length;

    // ── Selection ─────────────────────────────────────────────────────────
    // Only candidates who haven't received an offer yet are selectable
    const selectableCandidates = candidates.filter(c => !c.offer_status);

    const handleToggleSelect = (applicationId) => {
        dispatch(toggleCandidateSelection(applicationId));
    };

    const handleSelectAll = () => {
        if (selectedCandidates.length === selectableCandidates.length && selectableCandidates.length > 0) {
            dispatch(clearSelectedCandidates());
        } else {
            dispatch(selectAllCandidates(selectableCandidates.map(c => c.application_id)));
        }
    };

    // ── Single send offer ─────────────────────────────────────────────────
    const handleOpenSendOffer = (candidate) => {
        setSelectedCandidate(candidate);
        setShowSendModal(true);
    };

    const handleSendOffer = async (offerData) => {
        try {
            await dispatch(sendOffer({
                applicationId: selectedCandidate.application_id,
                offerData,
            })).unwrap();
            setShowSendModal(false);
            setSelectedCandidate(null);
            handleRefresh();
        } catch (err) {
            notify.error(err?.message || 'Failed to send offer');
        }
    };

    // ── Bulk send offer ───────────────────────────────────────────────────
    const handleBulkSendOffer = async (offerData) => {
        try {
            await dispatch(bulkSendOffer({
                jobId,
                payload: {
                    application_ids: selectedCandidates,
                    ...offerData,
                },
            })).unwrap();
            setShowSendModal(false);
            setSelectedCandidate(null);
            handleRefresh();
        } catch (err) {
            notify.error(err?.message || 'Failed to bulk send offers');
        }
    };

    // Open bulk send modal (no specific candidate selected)
    const handleOpenBulkSend = () => {
        if (selectedCandidates.length === 0) {
            notify.warning('Please select candidates first');
            return;
        }
        setSelectedCandidate(null); // null = bulk mode
        setShowSendModal(true);
    };

    // ── View full profile ─────────────────────────────────────────────────
    const handleViewProfile = (candidate) => {
        setSelectedCandidate(candidate);
        setShowProfileModal(true);
    };
    
    const filteredCandidates = candidates.filter(c => {
        if (activeFilter === 'all')      return true;
        if (activeFilter === 'pending')  return !c.offer_status;
        if (activeFilter === 'offered')  return c.offer_status === 'sent';
        if (activeFilter === 'accepted') return c.offer_status === 'accepted' || c.application_status === 'hired';
        if (activeFilter === 'declined') return c.offer_status === 'declined';
        return true;
    });

    // ── Loading ───────────────────────────────────────────────────────────
    if (candidatesLoading && candidates.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading offer stage candidates...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard icon={Users}       label="Total"    value={total || candidates.length} color="gray"   />
                <StatCard icon={Clock}       label="Pending"  value={pendingCount}                color="amber"  />
                <StatCard icon={Send}        label="Offered"  value={sentCount}                   color="blue"   />
                <StatCard icon={CheckCircle} label="Accepted" value={acceptedCount}               color="green"  />
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Offer Stage</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {candidates.length} candidates · ranked by last round score
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={candidatesLoading}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${candidatesLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>

                        {selectableCandidates.length > 0 && (
                            <>
                                <button
                                    onClick={handleSelectAll}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    <CheckSquare className="w-4 h-4" />
                                    {selectedCandidates.length > 0 ? 'Deselect All' : 'Select All'}
                                </button>

                                <button
                                    onClick={handleOpenBulkSend}
                                    disabled={selectedCandidates.length === 0 || loading}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {selectedCandidates.length > 0 ? `Send Offer to ${selectedCandidates.length}` : 'Select to Send'}
                                </button>
                            </>
                        )}

                        {/* ── Filter dropdown — matches telephonic/HR pattern exactly ── */}
                        <select
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="offered">Offered</option>
                            <option value="accepted">Accepted</option>
                            <option value="declined">Declined</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Candidates List */}
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {filteredCandidates.length === 0 ?(
                    <div className="px-6 py-12 text-center">
                        <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No candidates in offer stage yet</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Candidates will appear here after completing all previous rounds
                        </p>
                    </div>
                ) : (
                    filteredCandidates.map((candidate, index) => {
                        const isSelectable = !candidate.offer_status;
                        const isSelected   = selectedCandidates.includes(candidate.application_id);

                        return (
                            <div
                                key={candidate.application_id}
                                className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                                    isSelected ? 'bg-amber-50' : ''
                                }`}
                            >
                                <div className="flex items-center gap-4">

                                    {/* Rank badge */}
                                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-amber-100 flex items-center justify-center">
                                        <span className="text-xs font-bold text-amber-700">#{index + 1}</span>
                                    </div>

                                    {/* Checkbox — only for candidates without an offer */}
                                    {isSelectable && (
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleToggleSelect(candidate.application_id)}
                                            className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-400"
                                        />
                                    )}
                                    {/* Spacer when no checkbox */}
                                    {!isSelectable && <div className="w-4" />}

                                    {/* Avatar */}
                                    <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                        {candidate.name?.charAt(0).toUpperCase() || 'C'}
                                    </div>

                                    {/* Candidate info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {candidate.name}
                                            </h3>
                                            {getOfferBadge(candidate.offer_status, candidate.application_status)}
                                        </div>
                                        <p className="text-sm text-gray-500">{candidate.email}</p>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                            {candidate.current_company && (
                                                <span>{candidate.current_company}</span>
                                            )}
                                            {candidate.years_of_experience && (
                                                <span>{candidate.years_of_experience} yrs exp</span>
                                            )}
                                            {candidate.last_stage_name && (
                                                <span className="text-gray-400">
                                                    Last: {candidate.last_stage_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Score */}
                                    <div className="text-center flex-shrink-0">
                                        <p className={`text-2xl font-bold ${
                                            candidate.last_score >= 80 ? 'text-green-600'
                                            : candidate.last_score >= 60 ? 'text-amber-500'
                                            : 'text-red-500'
                                        }`}>
                                            {candidate.last_score ?? '—'}
                                        </p>
                                        <p className="text-xs text-gray-400">Score</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <OfferActionButton
                                            candidate={candidate}
                                            onSendOffer={handleOpenSendOffer}
                                        />
                                        <button
                                            onClick={() => handleViewProfile(candidate)}
                                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
                                        >
                                            <Eye className="w-4 h-4" /> Full Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Send Offer Modal */}
            <OfferSendModal
                isOpen={showSendModal}
                onClose={() => { setShowSendModal(false); setSelectedCandidate(null); }}
                candidate={selectedCandidate}
                isBulk={!selectedCandidate}
                bulkCount={selectedCandidates.length}
                onSend={selectedCandidate ? handleSendOffer : handleBulkSendOffer}
                loading={loading}
            />

            {/* Full Profile Modal */}
            <CandidateCompleteDetailModal
                isOpen={showProfileModal}
                onClose={() => { setShowProfileModal(false); setSelectedCandidate(null); }}
                candidate={selectedCandidate}
            />
        </div>
    );
};

export default OfferStage;