import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, DollarSign, Calendar, FileText, Users, User, AlertCircle } from 'lucide-react';

// ── Defined OUTSIDE component — never remounts ─────────────────────────────
const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        {children}
        {error && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {error}
            </p>
        )}
    </div>
);

const OfferSendModal = ({ isOpen, onClose, candidate, isBulk = false, bulkCount = 0, onSend, loading = false }) => {
    const today = new Date().toISOString().split('T')[0];

    const [positionTitle,   setPositionTitle]   = useState('');
    const [offeredSalary,   setOfferedSalary]   = useState('');
    const [joiningDate,     setJoiningDate]     = useState('');
    const [expiryDate,      setExpiryDate]      = useState('');
    const [customMessage,   setCustomMessage]   = useState('');
    const [errors,          setErrors]          = useState({});

    useEffect(() => {
        if (isOpen) {
            setPositionTitle('');
            setOfferedSalary('');
            setJoiningDate('');
            setExpiryDate('');
            setCustomMessage('');
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        const e = {};
        if (!positionTitle.trim()) e.position_title    = 'Position title is required';
        if (!offeredSalary.trim()) e.offered_salary    = 'Salary is required';
        if (!joiningDate)          e.joining_date      = 'Joining date is required';
        if (!expiryDate)           e.offer_expiry_date = 'Expiry date is required';
        if (expiryDate && joiningDate && expiryDate <= joiningDate)
            e.offer_expiry_date = 'Expiry must be after joining date';

        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setErrors({});

        await onSend({
            position_title   : positionTitle.trim(),
            offered_salary   : offeredSalary.trim(),
            joining_date     : joiningDate,
            offer_expiry_date: expiryDate,
            custom_message   : customMessage.trim() || null,
        });
    };

    const inp = (hasErr) =>
        `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${
            hasErr ? 'border-red-400 bg-red-50' : 'border-gray-300'
        }`;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Send className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {isBulk ? 'Bulk Send Offer' : 'Send Offer Letter'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {isBulk ? `Sending to ${bulkCount} candidate${bulkCount > 1 ? 's' : ''}` : candidate?.name}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {isBulk && (
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <Users className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-amber-800">
                                The same offer details will be sent to all {bulkCount} selected candidates.
                            </p>
                        </div>
                    )}

                    <Field label="Position Title *" error={errors.position_title}>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={positionTitle}
                                onChange={e => setPositionTitle(e.target.value)}
                                placeholder="e.g. Senior Backend Engineer"
                                className={`${inp(errors.position_title)} pl-9`}
                            />
                        </div>
                    </Field>

                    <Field label="Offered Salary *" error={errors.offered_salary}>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={offeredSalary}
                                onChange={e => setOfferedSalary(e.target.value)}
                                placeholder="e.g. ₹12,00,000 / year"
                                className={`${inp(errors.offered_salary)} pl-9`}
                            />
                        </div>
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Joining Date *" error={errors.joining_date}>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    min={today}
                                    value={joiningDate}
                                    onChange={e => setJoiningDate(e.target.value)}
                                    className={`${inp(errors.joining_date)} pl-9`}
                                />
                            </div>
                        </Field>

                        <Field label="Offer Expiry *" error={errors.offer_expiry_date}>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    min={joiningDate || today}
                                    value={expiryDate}
                                    onChange={e => setExpiryDate(e.target.value)}
                                    className={`${inp(errors.offer_expiry_date)} pl-9`}
                                />
                            </div>
                        </Field>
                    </div>

                    <Field label="Custom Message (Optional)" error={null}>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <textarea
                                value={customMessage}
                                onChange={e => setCustomMessage(e.target.value)}
                                rows={3}
                                placeholder="Add a personal note to the candidate..."
                                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                            This will appear in the offer letter PDF sent to the candidate.
                        </p>
                    </Field>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button onClick={onClose} disabled={loading}
                        className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium disabled:opacity-60">
                        {loading
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                            : <><Send className="w-4 h-4" /> {isBulk ? `Send to ${bulkCount}` : 'Send Offer'}</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfferSendModal;