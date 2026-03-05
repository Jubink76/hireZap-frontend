import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    X, CheckCircle, XCircle, Download,
    Briefcase, DollarSign, Calendar, Clock, Loader2,
    PartyPopper, FileText, AlertTriangle
} from 'lucide-react';
import { respondToOffer } from '../redux/slices/offerSlice';
import { notify } from '../utils/toast';

const Confetti = () => {
    const pieces = Array.from({ length: 20 }, (_, i) => i);
    const colors = ['#10b981', '#059669', '#3b82f6', '#8b5cf6', '#14b8a6', '#34d399'];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-2xl">
            {pieces.map(i => (
                <div
                    key={i}
                    className="absolute w-2 h-2 rounded-sm animate-bounce"
                    style={{
                        left:             `${5 + (i * 4.7) % 90}%`,
                        top:              `${-10 + (i * 7) % 30}%`,
                        backgroundColor:  colors[i % colors.length],
                        animationDelay:   `${(i * 0.15) % 1.5}s`,
                        animationDuration:`${0.8 + (i % 5) * 0.2}s`,
                        opacity:          0.7,
                        transform:        `rotate(${i * 23}deg)`,
                    }}
                />
            ))}
        </div>
    );
};

const CongratsView = ({ offerData, onViewOffer, onClose }) => (
    <div className="relative">
        <Confetti />
        <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors"
        >
            <X className="w-4 h-4 text-gray-600" />
        </button>

        <div className="bg-gradient-to-br from-teal-500 via-emerald-500 to-green-600 px-6 pt-12 pb-8 text-center rounded-t-2xl relative">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <PartyPopper className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
                Congratulations!
            </h2>
            <p className="text-white/90 text-sm font-medium">
                You've received a job offer
            </p>
        </div>

        <div className="px-6 py-6 bg-white rounded-b-2xl">
            <div className="text-center mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Offer from</p>
                <h3 className="text-xl font-bold text-gray-900">
                    {offerData?.company_name || 'Your Company'}
                </h3>
                <p className="text-base text-teal-600 font-semibold mt-1">
                    {offerData?.position_title || 'Position'}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                {offerData?.offered_salary && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                        <DollarSign className="w-4 h-4 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-green-600 font-medium">Salary</p>
                        <p className="text-sm font-bold text-green-800">{offerData.offered_salary}</p>
                    </div>
                )}
                {offerData?.joining_date && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                        <Calendar className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-blue-600 font-medium">Joining Date</p>
                        <p className="text-sm font-bold text-blue-800">
                            {new Date(offerData.joining_date).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric'
                            })}
                        </p>
                    </div>
                )}
                {offerData?.offer_expiry_date && (
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-center col-span-2">
                        <Clock className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                        <p className="text-xs text-teal-600 font-medium">Offer Expires</p>
                        <p className="text-sm font-bold text-teal-800">
                            {new Date(offerData.offer_expiry_date).toLocaleDateString('en-US', {
                                month: 'long', day: 'numeric', year: 'numeric'
                            })}
                        </p>
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-500 text-center mb-5 leading-relaxed">
                You've received a formal offer letter with all the details.
                Review it carefully before responding.
            </p>

            <button
                onClick={onViewOffer}
                className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors shadow-md shadow-teal-200"
            >
                <FileText className="w-5 h-5" />
                View Offer Letter
            </button>
        </div>
    </div>
);

const OfferLetterView = ({ offerData, onRespond, responding, onClose, onBack }) => {
    const isExpired       = offerData?.is_expired;
    const alreadyResponded = ['accepted', 'declined'].includes(offerData?.status);

    return (
        <div className="flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-lg font-bold text-gray-900">Offer Letter</h2>
                </div>
                <div className="flex items-center gap-2">
                    {offerData?.offer_letter_url && (
                        <a
                            href={offerData.offer_letter_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                            <Download className="w-3.5 h-3.5" />
                            View / Download PDF
                        </a>
                    )}
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {alreadyResponded && (
                    <div className={`flex items-center gap-3 rounded-xl p-4 border ${
                        offerData.status === 'accepted' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                    }`}>
                        {offerData.status === 'accepted'
                            ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                        <p className={`text-sm font-semibold ${
                            offerData.status === 'accepted' ? 'text-green-800' : 'text-red-800'
                        }`}>
                            You have {offerData.status === 'accepted' ? 'accepted' : 'declined'} this offer.
                        </p>
                    </div>
                )}

                {isExpired && !alreadyResponded && (
                    <div className="flex items-center gap-3 bg-gray-100 border border-gray-300 rounded-xl p-4">
                        <AlertTriangle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <p className="text-sm text-gray-600 font-medium">
                            This offer has expired and can no longer be accepted.
                        </p>
                    </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Ref: OFR-{String(offerData?.id || '0000').padStart(4, '0')}</span>
                    <span>
                        Issued:{' '}
                        {offerData?.sent_at
                            ? new Date(offerData.sent_at).toLocaleDateString('en-US', {
                                month: 'long', day: 'numeric', year: 'numeric'
                            })
                            : '—'}
                    </span>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                    <div>
                        <p className="text-sm text-gray-800 leading-relaxed">
                            Dear <span className="font-semibold">{offerData?.candidate_name}</span>,
                        </p>
                        <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                            We are delighted to extend this formal offer of employment to you for the position of{' '}
                            <span className="font-semibold text-gray-900">{offerData?.position_title}</span>{' '}
                            at <span className="font-semibold text-gray-900">{offerData?.company_name}</span>.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <div className="px-4 py-2.5 bg-gray-800 text-white text-xs font-semibold uppercase tracking-wider">
                            Offer Details
                        </div>
                        {[
                            { icon: Briefcase,   label: 'Position',        value: offerData?.position_title },
                            { icon: DollarSign,  label: 'Offered Salary',  value: offerData?.offered_salary },
                            { icon: Calendar,    label: 'Joining Date',    value: offerData?.joining_date
                                ? new Date(offerData.joining_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                : null },
                            { icon: Clock,       label: 'Offer Valid Until', value: offerData?.offer_expiry_date
                                ? new Date(offerData.offer_expiry_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                : null },
                        ].filter(r => r.value).map(({ icon: Icon, label, value }, idx) => (
                            <div key={idx} className={`flex items-center gap-3 px-4 py-3 text-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <Icon className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                <span className="text-gray-500 w-32 flex-shrink-0">{label}</span>
                                <span className="font-semibold text-gray-900">{value}</span>
                            </div>
                        ))}
                    </div>

                    {offerData?.custom_message && (
                        <div className="border-l-4 border-teal-400 pl-4 bg-teal-50 rounded-r-lg py-3 pr-3">
                            <p className="text-xs text-teal-700 font-semibold mb-1">Message from Recruiter</p>
                            <p className="text-sm text-teal-900 italic leading-relaxed">
                                "{offerData.custom_message}"
                            </p>
                        </div>
                    )}

                    <p className="text-sm text-gray-700 leading-relaxed">
                        Please review the details carefully and respond before the expiry date.
                        We look forward to welcoming you to our team.
                    </p>
                    <p className="text-sm text-gray-700">
                        Warm regards,<br />
                        <span className="font-semibold text-gray-900">
                            {offerData?.recruiter_name || 'The Recruitment Team'}
                        </span>
                    </p>
                </div>
            </div>

            {!alreadyResponded && !isExpired && (
                <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-white rounded-b-2xl">
                    <p className="text-xs text-gray-400 text-center mb-3">
                        Your decision is final once submitted.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => onRespond('decline')}
                            disabled={responding}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                            {responding === 'decline'
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <XCircle className="w-4 h-4" />}
                            Decline
                        </button>
                        <button
                            onClick={() => onRespond('accept')}
                            disabled={responding}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-md shadow-teal-200"
                        >
                            {responding === 'accept'
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <CheckCircle className="w-4 h-4" />}
                            Accept Offer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const OfferReceivedModal = ({ isOpen, onClose, offerData, onOfferResponded }) => {
    const dispatch = useDispatch();
    const [view, setView]           = useState('congrats');
    const [responding, setResponding] = useState(null);

    useEffect(() => {
        if (isOpen) setView('congrats');
    }, [isOpen]);

    if (!isOpen || !offerData) return null;

    const alreadyResponded = ['accepted', 'declined'].includes(offerData?.status);
    const effectiveView    = alreadyResponded ? 'letter' : view;

    const handleRespond = async (action) => {
        if (!offerData?.id) return;
        setResponding(action);
        try {
            await dispatch(respondToOffer({
                offerId: offerData.id,
                responseData: { action },
            })).unwrap();
            notify.success(
                action === 'accept'
                    ? '🎉 Offer accepted! Congratulations on your new role.'
                    : 'Offer declined. The recruiter will be notified.'
            );
            if (onOfferResponded) onOfferResponded(action);
            onClose();
        } catch (err) {
            notify.error(err?.message || 'Failed to submit response. Please try again.');
        } finally {
            setResponding(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {effectiveView === 'congrats' ? (
                    <CongratsView
                        offerData={offerData}
                        onViewOffer={() => setView('letter')}
                        onClose={onClose}
                    />
                ) : (
                    <OfferLetterView
                        offerData={offerData}
                        onRespond={handleRespond}
                        responding={responding}
                        onClose={onClose}
                        onBack={() => setView('congrats')}
                    />
                )}
            </div>
        </div>
    );
};

export default OfferReceivedModal;