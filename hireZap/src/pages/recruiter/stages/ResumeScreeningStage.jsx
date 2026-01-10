import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, 
  Clock, 
  Loader2, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw, 
  XCircle, 
  ChevronRight, 
  CheckSquare,
  Users,
  CheckCircle,
  TrendingUp,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import ATSConfigurationModal from '../../../modals/ATSConfigurationModal';
import CandidateDetailModal from '../../../modals/CandidateDetailModal';
import {
  startBulkScreening,
  getScreeningProgress,
  pauseScreening,
  resetScreening,
  moveToNextStage,
  getATSConfig,
} from '../../../redux/slices/resumeScreeningSlice';

const ResumeScreeningStage = ({ 
  jobId, 
  candidates, 
  onRefresh,
  onMoveToNext 
}) => {
  const dispatch = useDispatch();

  // Redux State
  const {
    atsConfig,
    screeningProgress,
    screeningInProgress,
    progressLoading,
    loading: screeningLoading,
  } = useSelector((state) => state.resumeScreener);

  // Local State
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [atsConfigured, setAtsConfigured] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progressBarAutoHideTimer, setProgressBarAutoHideTimer] = useState(null);
  
  // Modals
  const [showATSConfig, setShowATSConfig] = useState(false);
  const [showCandidateDetail, setShowCandidateDetail] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // ==================== Filter Candidates ====================
  const filteredCandidates = candidates.filter(candidate => {
    if (filterStatus === 'all') return true;
    return candidate.decision === filterStatus;
  });

  // ==================== Computed Values ====================
  const qualifiedCount = candidates.filter(c => c.decision === 'qualified').length;
  const rejectedCount = candidates.filter(c => c.decision === 'rejected').length;
  const pendingCount = candidates.filter(c => c.decision === 'pending').length;
  const avgScore = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + c.scores.overall, 0) / candidates.length)
    : 0;

  // ✅ NEW: Check if candidates are still in resume screening stage
  const candidatesInCurrentStage = candidates.filter(c => 
    c.current_stage?.slug === 'resume-screening' || 
    c.current_stage?.name?.toLowerCase().includes('resume') ||
    !c.current_stage // No stage means they haven't moved
  );

  // ✅ NEW: Qualified candidates who are STILL in resume screening stage
  const qualifiedInCurrentStage = candidatesInCurrentStage.filter(c => 
    c.decision === 'qualified' && c.is_screened
  );

  // ✅ NEW: Check if any candidates have been moved to next stage
  const hasCandidatesMovedToNextStage = candidates.some(c => 
    c.current_stage?.slug !== 'resume-screening' && 
    c.current_stage !== null &&
    !c.current_stage?.name?.toLowerCase().includes('resume')
  );

  // ==================== Progress Bar Auto-Show/Hide ====================
  useEffect(() => {
    if (screeningProgress && jobId) {
      const shouldShow = screeningProgress.status === 'in_progress' || 
                        screeningProgress.status === 'paused' ||
                        (screeningProgress.status === 'completed' && showProgressBar);
      
      if (shouldShow && !showProgressBar) {
        setShowProgressBar(true);
      }

      // Auto-hide on completion
      if (screeningProgress.status === 'completed') {
        const timer = setTimeout(() => {
          setShowProgressBar(false);
        }, 5000);
        setProgressBarAutoHideTimer(timer);
      }
    }

    return () => {
      if (progressBarAutoHideTimer) {
        clearTimeout(progressBarAutoHideTimer);
      }
    };
  }, [screeningProgress, jobId]);

  // ==================== Check ATS Configuration ====================
  const checkAtsConfiguration = useCallback(async () => {
    if (!jobId) return;
    
    try {
      const result = await dispatch(getATSConfig(jobId)).unwrap();
      const isConfigured = result.configured === true || (result.config && !result.is_default);
      setAtsConfigured(isConfigured);
    } catch (err) {
      console.error('Failed to check ATS configuration:', err);
      setAtsConfigured(false);
    }
  }, [jobId, dispatch]);

  useEffect(() => {
    checkAtsConfiguration();
  }, [checkAtsConfiguration]);

  // ==================== Start Screening ====================
  const handleStartScreening = async (restart = false) => {
    if (!atsConfigured) {
      alert('Please configure ATS settings before starting screening.');
      setShowATSConfig(true);
      return;
    }

    const message = restart
      ? 'Restart screening for failed or pending candidates?'
      : 'Start automated resume screening for all applicants?';

    if (!window.confirm(message)) return;

    try {
      setShowProgressBar(true);
      await dispatch(startBulkScreening(jobId)).unwrap();
      onRefresh();
    } catch (err) {
      console.error('Failed to start screening:', err);
    }
  };

  // ==================== Pause Screening ====================
  const handlePauseScreening = async () => {
    if (!window.confirm('Pause the screening process?')) return;

    try {
      await dispatch(pauseScreening(jobId)).unwrap();
      onRefresh();
    } catch (err) {
      console.error('Failed to pause screening:', err);
    }
  };

  // ==================== Reset Screening ====================
  const handleResetScreening = async () => {
    if (!window.confirm('⚠️ This will clear all screening results and start fresh. Continue?')) {
      return;
    }

    try {
      await dispatch(resetScreening(jobId)).unwrap();
      setSelectedCandidates([]);
      setShowProgressBar(false);
      if (progressBarAutoHideTimer) {
        clearTimeout(progressBarAutoHideTimer);
        setProgressBarAutoHideTimer(null);
      }
      onRefresh();
    } catch (err) {
      console.error('Failed to reset screening:', err);
    }
  };

  // ==================== Candidate Selection ====================
  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    // ✅ Only select qualified candidates who are STILL in resume screening stage
    const selectableQualified = qualifiedInCurrentStage;
    
    if (selectedCandidates.length === selectableQualified.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(selectableQualified.map(c => c.application_id));
    }
  };

  // ==================== Move to Next Stage ====================
  const handleProceedToNextRound = async () => {
    if (selectedCandidates.length === 0) {
      alert('Please select candidates to proceed');
      return;
    }

    if (!window.confirm(`Move ${selectedCandidates.length} candidate(s) to next round?`)) {
      return;
    }

    try {
      await dispatch(moveToNextStage({ 
        applicationIds: selectedCandidates,
        feedback: 'Passed resume screening' 
      })).unwrap();
      
      setSelectedCandidates([]);
      
      // Notify parent to navigate to next stage
      if (onMoveToNext) {
        onMoveToNext();
      }
      
      await onRefresh();
    } catch (err) {
      console.error('Failed to move candidates:', err);
    }
  };

  // ==================== Status Badge Helper ====================
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      qualified: { text: 'Qualified', color: 'bg-green-100 text-green-700' },
      rejected: { text: 'Rejected', color: 'bg-red-100 text-red-700' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // ✅ NEW: Helper to check if candidate can be selected
  const canSelectCandidate = (candidate) => {
    return candidate.decision === 'qualified' && 
           (candidate.current_stage?.slug === 'resume-screening' || 
            candidate.current_stage?.name?.toLowerCase().includes('resume') ||
            !candidate.current_stage);
  };

  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      {screeningProgress && 
       screeningProgress.status !== 'not_started' && 
       showProgressBar && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
          <button
            onClick={() => setShowProgressBar(false)}
            className="absolute top-2 right-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-blue-700" />
          </button>
          
          <div className="flex items-center justify-between mb-2 pr-8">
            <span className="text-sm font-medium text-blue-900">
              {screeningInProgress ? '🔄 Screening in Progress...' : 
               screeningProgress.status === 'completed' ? '✅ Screening Completed' : 
               screeningProgress.status === 'paused' ? '⏸️ Screening Paused' : 
               '📊 Screening Status'}
            </span>
            <span className="text-sm font-semibold text-blue-900">
              {screeningProgress.screened_applications} / {screeningProgress.total_applications} 
              ({screeningProgress.percentage?.toFixed(1) || 0}%)
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${screeningProgress.percentage || 0}%` }}
            />
          </div>
          
          {screeningProgress.status === 'completed' && (
            <p className="text-xs text-blue-600 mt-2 text-center">
              Auto-hiding in 5 seconds...
            </p>
          )}
        </div>
      )}

      {/* Statistics Cards */}
      {candidates.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Screened</p>
                <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Qualified</p>
                <p className="text-2xl font-bold text-green-600">{qualifiedCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900">{avgScore}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Resume Screening</h3>
            <p className="text-sm text-gray-600 mt-1">
              {candidatesInCurrentStage.length} candidates in this stage • {qualifiedInCurrentStage.length} qualified and ready
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={progressLoading}
            >
              <RefreshCw className={`w-4 h-4 ${progressLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {/* ATS Config Button */}
            <button
              onClick={() => setShowATSConfig(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Settings className="w-4 h-4" />
              {atsConfigured ? 'Edit ATS Config' : 'Configure ATS'}
            </button>

            {/* Start Button */}
            {!screeningInProgress && screeningProgress?.status === 'not_started' && (
              <button
                onClick={() => handleStartScreening(false)}
                disabled={screeningLoading || !atsConfigured}
                className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {screeningLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    {!atsConfigured ? 'Configure ATS First' : 'Start Screening'}
                  </>
                )}
              </button>
            )}

            {/* Restart Button */}
            {!screeningInProgress &&
             (screeningProgress?.status === 'paused' || screeningProgress?.status === 'failed') && (
              <button
                onClick={() => handleStartScreening(true)}
                disabled={screeningLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
              >
                <RefreshCw className="w-5 h-5" />
                Restart Screening
              </button>
            )}

            {/* Pause Button */}
            {screeningInProgress && (
              <button
                onClick={handlePauseScreening}
                disabled={screeningLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
              >
                <Pause className="w-5 h-5" />
                Pause Screening
              </button>
            )}

            {/* ✅ Reset Button - Only show if candidates are STILL in this stage */}
            {candidatesInCurrentStage.length > 0 &&
             !screeningInProgress &&
             !hasCandidatesMovedToNextStage &&
             (screeningProgress?.status === 'completed' ||
              screeningProgress?.status === 'paused' ||
              screeningProgress?.status === 'failed') && (
              <button
                onClick={handleResetScreening}
                disabled={screeningLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                <XCircle className="w-5 h-5" />
                Reset Screening
              </button>
            )}

            {/* ✅ Proceed Button - Only show if there are qualified candidates STILL in this stage */}
            {screeningProgress?.status === 'completed' && 
             qualifiedInCurrentStage.length > 0 && (
              <button
                onClick={handleProceedToNextRound}
                disabled={screeningLoading || selectedCandidates.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:bg-gray-400"
              >
                <ChevronRight className="w-5 h-5" />
                {selectedCandidates.length > 0 
                  ? `Proceed ${selectedCandidates.length} to Next Round`
                  : 'Select Candidates to Proceed'}
              </button>
            )}

            {/* Filter Dropdown */}
            {candidates.length > 0 && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Candidates</option>
                <option value="qualified">Qualified Only</option>
                <option value="rejected">Rejected Only</option>
                <option value="pending">Pending Only</option>
              </select>
            )}

            {/* ✅ Select All Button - Only for qualified candidates in current stage */}
            {qualifiedInCurrentStage.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <CheckSquare className="w-4 h-4" />
                {selectedCandidates.length === qualifiedInCurrentStage.length ? 'Deselect All' : 'Select All Qualified'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {progressLoading ? (
          <div className="px-6 py-12 text-center">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading candidates...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {!atsConfigured 
                ? 'Configure ATS settings to start screening candidates.'
                : screeningProgress?.status === 'not_started'
                ? 'No screening started yet. Click "Start Screening" to begin.'
                : 'No candidates match the current filter.'}
            </p>
            {!atsConfigured && (
              <button
                onClick={() => setShowATSConfig(true)}
                className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
              >
                Configure ATS Now
              </button>
            )}
          </div>
        ) : (
          filteredCandidates.map((candidate) => {
            const isInCurrentStage = canSelectCandidate(candidate);
            
            return (
              <div key={candidate.application_id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* ✅ Checkbox - Only for qualified candidates STILL in this stage */}
                  {candidate.decision === 'qualified' && isInCurrentStage && (
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(candidate.application_id)}
                      onChange={() => handleSelectCandidate(candidate.application_id)}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                  )}

                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {candidate.candidate.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-semibold text-gray-900">{candidate.candidate.name}</h3>
                      {getStatusBadge(candidate.decision)}
                      {/* ✅ Show "Moved to Next Stage" badge */}
                      {!isInCurrentStage && candidate.decision === 'qualified' && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          Moved to {candidate.current_stage?.name || 'Next Stage'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{candidate.candidate.email}</p>
                    {candidate.screened_at && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Screened {new Date(candidate.screened_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>

                  {/* Scores */}
                  {candidate.scores && (
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${
                          candidate.scores.overall >= 70 ? 'text-green-600' : 
                          candidate.scores.overall >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {candidate.scores.overall}
                        </p>
                        <p className="text-xs text-gray-500">Overall</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-teal-600">{candidate.scores.skills}</p>
                        <p className="text-xs text-gray-500">Skills</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-blue-600">{candidate.scores.experience}</p>
                        <p className="text-xs text-gray-500">Experience</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-purple-600">{candidate.scores.education}</p>
                        <p className="text-xs text-gray-500">Education</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <button
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setShowCandidateDetail(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <ATSConfigurationModal
        isOpen={showATSConfig}
        onClose={() => setShowATSConfig(false)}
        jobId={jobId}
        onSave={() => {
          setShowATSConfig(false);
          checkAtsConfiguration();
        }}
      />

      <CandidateDetailModal
        isOpen={showCandidateDetail}
        onClose={() => {
          setShowCandidateDetail(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate}
      />
    </div>
  );
};

export default ResumeScreeningStage;