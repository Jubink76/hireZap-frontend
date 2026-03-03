import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CheckCircle,
  Loader2,
} from 'lucide-react';

const EndMeetingModal = ({ isOpen, notes, onConfirm, onCancel, isSaving }) => {
  const [localNotes, setLocalNotes] = useState(notes);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  if (!isOpen) return null;

  const calculateScore = () => {
    const weights = {
      communication: 25, culture_fit: 20, motivation: 15,
      professionalism: 15, problem_solving: 15, team_collaboration: 10
    };
    let total = 0, weight = 0;
    Object.keys(weights).forEach(key => {
      if (localNotes[key]?.rating) {
        total += localNotes[key].rating * (weights[key] / 100);
        weight += weights[key];
      }
    });
    return weight > 0 ? Math.round(total) : null;
  };

  const score = calculateScore();

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complete Interview</h2>
            <p className="text-sm text-gray-500 mt-1">Review and finalize your notes before ending</p>
          </div>
          {score !== null && (
            <div className="text-center bg-teal-50 border border-teal-200 rounded-lg px-4 py-2">
              <p className="text-xs text-gray-500">Score</p>
              <p className="text-3xl font-bold text-teal-600">{score}</p>
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Recommendation — required before confirming */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Final Recommendation <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { value: 'strong_yes', label: 'Strong Yes', active: 'bg-green-600 border-green-600' },
                { value: 'yes',        label: 'Yes - Hire', active: 'bg-green-400 border-green-400' },
                { value: 'maybe',      label: 'Maybe',      active: 'bg-yellow-500 border-yellow-500' },
                { value: 'no',         label: 'No',         active: 'bg-red-400 border-red-400' },
                { value: 'strong_no',  label: 'Strong No',  active: 'bg-red-600 border-red-600' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setRecommendation(opt.value)}
                  className={`py-2.5 px-2 rounded-lg text-xs font-semibold transition-all border-2 ${
                    recommendation === opt.value
                      ? `${opt.active} text-white`
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ratings summary */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Ratings Summary</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'communication',      label: 'Communication',      weight: 25 },
                { key: 'culture_fit',        label: 'Culture Fit',        weight: 20 },
                { key: 'motivation',         label: 'Motivation',         weight: 15 },
                { key: 'professionalism',    label: 'Professionalism',    weight: 15 },
                { key: 'problem_solving',    label: 'Problem Solving',    weight: 15 },
                { key: 'team_collaboration', label: 'Team Collaboration', weight: 10 },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-600">{s.label}</span>
                  <span className={`text-sm font-bold ${
                    localNotes[s.key]?.rating >= 80 ? 'text-green-600' :
                    localNotes[s.key]?.rating >= 60 ? 'text-yellow-600' :
                    localNotes[s.key]?.rating       ? 'text-red-500'   : 'text-gray-400'
                  }`}>
                    {localNotes[s.key]?.rating ?? '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall impression */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Overall Impression</label>
            <textarea
              value={localNotes.overall_impression || ''}
              onChange={e => setLocalNotes(p => ({ ...p, overall_impression: e.target.value }))}
              rows={2}
              placeholder="Overall impression of the candidate..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          {/* Strengths */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Strengths</label>
            <textarea
              value={localNotes.strengths || ''}
              onChange={e => setLocalNotes(p => ({ ...p, strengths: e.target.value }))}
              rows={2}
              placeholder="Key strengths observed..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          {/* Areas for improvement */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Areas for Improvement</label>
            <textarea
              value={localNotes.areas_for_improvement || ''}
              onChange={e => setLocalNotes(p => ({ ...p, areas_for_improvement: e.target.value }))}
              rows={2}
              placeholder="Areas that need improvement..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          {/* Final general notes */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Final General Notes</label>
            <textarea
              value={localNotes.general_notes || ''}
              onChange={e => setLocalNotes(p => ({ ...p, general_notes: e.target.value }))}
              rows={3}
              placeholder="Any final thoughts before completing..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between gap-3 flex-shrink-0">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Back to Meeting
          </button>
          <button
            onClick={() => onConfirm(localNotes, recommendation)}
            disabled={!recommendation || isSaving}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
          >
            {isSaving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              : <><CheckCircle className="w-4 h-4" /> Complete Interview</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};
export default EndMeetingModal;