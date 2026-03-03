
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CheckCircle,
  Loader2,
  VideoOff,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  MessageSquare,
  FileText,
  Save,
  X,
  Send,
  Clock,
  Radio,
  Minimize2,
  User,
  Circle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  PhoneOff,
  LogOut,
  RefreshCw

} from 'lucide-react';

import EndMeetingModal from './EndMeetingModal';
import zegoCloudService from '../services/zegoCloudService';
import endHRMeeting, { joinHRMeeting } from '../redux/slices/hrRoundSlice'
import { useDispatch } from 'react-redux';

const VideoInterviewInterface = ({ 
  interview,
  zegoConfig,
  isRecruiter = true,
  onClose,
  onMinimize,
  onCallEnd,
  sessionStartedAt,
  onEndMeeting,
  onLeaveMeeting,
  onReschedule,

}) => {
  // State
  const [callState, setCallState] = useState('connecting'); // connecting, connected, ending, ended
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [remoteUserConnected, setRemoteUserConnected] = useState(false);
  const [remoteVideoOn, setRemoteVideoOn] = useState(true);
  const [error, setError] = useState(null);

  const [showEndModal, setShowEndModal] = useState(false);
  const [candidateLeft, setCandidateLeft] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isReconnecting,    setIsReconnecting]    = useState(false);
  const MAX_RECONNECT = 3;
  const [localZegoConfig, setLocalZegoConfig] = useState(zegoConfig);
  const dispatch = useDispatch()
  // Notes state
  const [notes, setNotes] = useState({
    communication: { rating: null, notes: '', expanded: false },
    culture_fit: { rating: null, notes: '', expanded: false },
    motivation: { rating: null, notes: '', expanded: false },
    professionalism: { rating: null, notes: '', expanded: false },
    problem_solving: { rating: null, notes: '', expanded: false },
    team_collaboration: { rating: null, notes: '', expanded: false },
    overall_impression: '',
    strengths: '',
    areas_for_improvement: '',
    general_notes: ''
  });
  
  // Refs
  const callStartTimeRef = useRef(sessionStartedAt ? new Date(sessionStartedAt).getTime() : Date.now());
  const durationIntervalRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatEndRef = useRef(null);
  const isInitializedRef = useRef(false);
  const reconnectTimerRef     = useRef(null);
  const reconnectAttemptsRef  = useRef(0);
  const pendingRemoteStreamRef = useRef(null);
  
  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  const broadcastMediaState = useCallback((cameraOn, micOn) => {
    if (!zegoCloudService.zg || !zegoCloudService.localStream) return;
    
    // ✅ Use the streamID string, not the stream object
    const streamID = zegoCloudService.localStream.streamID;
    if (!streamID) return;
    
    zegoCloudService.zg
      .setStreamExtraInfo(streamID, JSON.stringify({ isCameraOn: cameraOn, isMicOn: micOn }))
      .catch(e => console.error('setStreamExtraInfo failed:', e));
  }, []);

  const handleNetworkDisconnect = useCallback(() => {
    setIsReconnecting(true);
    reconnectAttemptsRef.current += 1;
    const attempt = reconnectAttemptsRef.current;
    setReconnectAttempts(attempt);

    if (attempt <= MAX_RECONNECT) {
      console.log(`🔄 Reconnect attempt ${attempt}/${MAX_RECONNECT}`);
      reconnectTimerRef.current = setTimeout(async () => {
        try {
          await zegoCloudService.loginRoom(
            localZegoConfig.roomID,
            localZegoConfig.token,
            localZegoConfig.userID,
            localZegoConfig.userName || (isRecruiter ? 'Recruiter' : 'Candidate')
          );
          setIsReconnecting(false);
          reconnectAttemptsRef.current = 0;
          setReconnectAttempts(0);
        } catch (err) {
          console.error('Reconnect failed:', err);
          handleNetworkDisconnect();
        }
      }, 3000 * attempt); // 3 s, 6 s, 9 s back-off
    } else {
      setIsReconnecting(false);
      setCallState('disconnected');
    }
  }, [localZegoConfig, isRecruiter]);

  useEffect(() => {
    const init = async () => {
      if (!localZegoConfig  || isInitializedRef.current) return;
      if (!localZegoConfig .token) return;
      try {

        zegoCloudService.reset();
        console.log('🚀 Initialising ZegoCloud…', {
          appID:  localZegoConfig .appID,
          roomID: localZegoConfig .roomID,
          token:  localZegoConfig .token ? `${localZegoConfig.token.substring(0, 20)}…` : 'UNDEFINED',
          userID: localZegoConfig .userID,
        });

        if (!localZegoConfig .appID || !localZegoConfig .roomID || !localZegoConfig .token || !localZegoConfig .userID) {
          setError('Invalid video configuration');
          setCallState('ended');
          return;
        }

        setConnectionStatus('connecting');
        await zegoCloudService.init(Number(localZegoConfig .appID));

        zegoCloudService.on({
          roomStateUpdate: (roomID, state, errorCode) => {
            console.log('🏠 Room state:', { state, errorCode });
            if (state === 'CONNECTED') {
              setConnectionStatus('connected');
              setCallState('connected');
              setIsReconnecting(false);
              reconnectAttemptsRef.current = 0;
              setReconnectAttempts(0);
            } else if (state === 'CONNECTING') {
              setConnectionStatus('reconnecting');
            } else if (state === 'DISCONNECTED') {
              setConnectionStatus('disconnected');
              if (errorCode !== 0) handleNetworkDisconnect();
            }
          },

          roomUserUpdate: (roomID, updateType, userList) => {
            console.log('👥 User update:', { updateType, userList });
            if (updateType === 'ADD') {
              setRemoteUserConnected(true);
              setCandidateLeft(false);

            } else if (updateType === 'DELETE') {
              setRemoteUserConnected(false);
              if (isRecruiter) {
                // ✅ Only set candidateLeft if the leaving user is NOT the current user
                const deletedIDs = userList.map(u => u.userID);
                const isRemoteLeaving = deletedIDs.some(id => id !== localZegoConfig ?.userID);
                if (isRemoteLeaving) {
                  setCandidateLeft(true);
                }
              }
            }
          },

          roomStreamUpdate: async (roomID, updateType, streamList) => {
            console.log('📡 Stream update:', { updateType, streamList });
            if (updateType === 'ADD') {
              for (const stream of streamList) {
                if (remoteVideoRef.current) {
                  await zegoCloudService.startPlaying(stream.streamID, remoteVideoRef.current);
                } else {
                  // ✅ Video element not ready yet — store for later
                  pendingRemoteStreamRef.current = stream.streamID;
                  console.log('⏳ Stored pending stream:', stream.streamID);
                }
              }
            } else if (updateType === 'DELETE') {
              for (const stream of streamList) {
                await zegoCloudService.stopPlaying(stream.streamID);
                if (pendingRemoteStreamRef.current === stream.streamID) {
                  pendingRemoteStreamRef.current = null;
                }
              }
            }
          },

          roomStreamExtraInfoUpdate: (_roomID, streamList) => {
            streamList.forEach(stream => {
              try {
                const info = JSON.parse(stream.extraInfo || '{}');
                if (typeof info.isCameraOn !== 'undefined') {
                  setRemoteVideoOn(info.isCameraOn);

                  if (!info.isCameraOn && remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = null;
                  } else if (info.isCameraOn && remoteVideoRef.current) {
                    const existingStream = zegoCloudService.remoteStreams.get(stream.streamID);
                    if (existingStream) {
                      remoteVideoRef.current.srcObject = existingStream;
                    }
                  }
                }
              } catch (_) {}
            });
          },

          IMRecvBroadcastMessage: (_roomID, chatData) => {
            chatData.forEach(msg => {
              setChatMessages(prev => [...prev, {
                id:         Date.now() + Math.random(),
                sender:     msg.fromUser.userID === localZegoConfig.userID ? 'self' : 'other',
                senderName: msg.fromUser.userName,
                text:       msg.message,
                timestamp:  new Date().toISOString(),
              }]);
            });
          },

          publishQualityUpdate: () => {},
          playQualityUpdate:    () => {},
        });

        await zegoCloudService.loginRoom(
          localZegoConfig.roomID,
          localZegoConfig.token,
          localZegoConfig.userID,
          localZegoConfig.userName || (isRecruiter ? 'Recruiter' : 'Candidate')
        );

        const localStream = await zegoCloudService.createLocalStream(
          `${localZegoConfig.userID}_main`,
          { camera: true, audio: true }
        );

        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

        await zegoCloudService.startPublishing(`${localZegoConfig.userID}_main`, localVideoRef.current);

        // broadcast initial camera/mic state to remote user
        broadcastMediaState(true, true);

        console.log('✅ ZegoCloud initialised and publishing');
        isInitializedRef.current = true;

      } catch (err) {
        console.error('Failed to initialise ZegoCloud:', err);
        setError(err.message || 'Failed to connect to interview');
        setCallState('ended');
      }
    };

    init();

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (isInitializedRef.current && localZegoConfig ) {
        zegoCloudService.logoutRoom(localZegoConfig.roomID)
          .catch(console.error)
          .finally(() => { zegoCloudService.destroy(); isInitializedRef.current = false; });
      }
    };
  }, [localZegoConfig]);
  
  // ==================== TIMER ====================
  useEffect(() => {
    if (callState !== 'connected') return;
    durationIntervalRef.current = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(durationIntervalRef.current);
  }, [callState]);
  
  useEffect(() => {
  const playPendingStream = async () => {
    if (
      callState === 'connected' &&
      pendingRemoteStreamRef.current &&
      remoteVideoRef.current
    ) {
      console.log('▶️ Playing pending remote stream:', pendingRemoteStreamRef.current);
      try {
        await zegoCloudService.startPlaying(
          pendingRemoteStreamRef.current,
          remoteVideoRef.current
        );
        pendingRemoteStreamRef.current = null;
      } catch (err) {
        console.error('Failed to play pending stream:', err);
      }
    }
  };

  playPendingStream();
}, [callState]);

  // ==================== AUTO-SCROLL CHAT ====================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const cleanupZego = async () => {
    if (!localZegoConfig) return;
    await zegoCloudService.logoutRoom(localZegoConfig.roomID).catch(console.error);
    zegoCloudService.destroy();
    isInitializedRef.current = false;
  };

  const handleToggleMute = async () => {
    try {
      const next = !isMuted;
      await zegoCloudService.muteAudio(next);
      setIsMuted(next);
      broadcastMediaState(isVideoOn, !next);
    } catch (err) { console.error('Toggle mute failed:', err); }
  };

  const handleToggleVideo = async () => {
    try {
      const next = !isVideoOn;
      await zegoCloudService.enableCamera(next);
      setIsVideoOn(next);
      broadcastMediaState(next, !isMuted);
    } catch (err) { console.error('Toggle video failed:', err); }
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(prev => {
      if (remoteVideoRef.current) remoteVideoRef.current.muted = prev; // prev=true → now off → muted
      return !prev;
    });
  };
  
  const handleStartRecording = async () => {
    try {
      setIsRecording(true);
      await zegoCloudService.startRecording(`${localZegoConfig.userID}_main`);
      console.log('Recording started');
    } catch (err) {
      console.error('Start recording failed:', err);
      setIsRecording(false);
    }
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    console.log('⏹️ Recording stopped');
  };
  
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !localZegoConfig) return;
    try {
      await zegoCloudService.sendBroadcastMessage(localZegoConfig.roomID, messageInput);
      setChatMessages(prev => [...prev, {
        id: Date.now(), sender: 'self',
        senderName: localZegoConfig.userName || 'You',
        text: messageInput, timestamp: new Date().toISOString(),
      }]);
      setMessageInput('');
    } catch (err) { console.error('Send message failed:', err); }
  };
  
  const toggleNoteSection = section =>
    setNotes(p => ({ ...p, [section]: { ...p[section], expanded: !p[section].expanded } }));

  const updateNoteRating = (section, rating) =>
    setNotes(p => ({ ...p, [section]: { ...p[section], rating } }));

  const updateNoteText = (section, text) =>
    setNotes(p => ({ ...p, [section]: { ...p[section], notes: text } }));

  const calcWeightedScore = () => {
    const W = { communication: 25, culture_fit: 20, motivation: 15, professionalism: 15, problem_solving: 15, team_collaboration: 10 };
    let total = 0, weight = 0;
    Object.keys(W).forEach(k => {
      if (notes[k].rating) { total += notes[k].rating * (W[k] / 100); weight += W[k]; }
    });
    return weight > 0 ? Math.round(total) : null;
  };

  const handleSaveNotes = () => {
    const notesData = {
      interview_id:              interview?.interview_id,
      communication_rating:      notes.communication.rating,
      communication_notes:       notes.communication.notes,
      culture_fit_rating:        notes.culture_fit.rating,
      culture_fit_notes:         notes.culture_fit.notes,
      motivation_rating:         notes.motivation.rating,
      motivation_notes:          notes.motivation.notes,
      professionalism_rating:    notes.professionalism.rating,
      professionalism_notes:     notes.professionalism.notes,
      problem_solving_rating:    notes.problem_solving.rating,
      problem_solving_notes:     notes.problem_solving.notes,
      team_collaboration_rating: notes.team_collaboration.rating,
      team_collaboration_notes:  notes.team_collaboration.notes,
      overall_impression:        notes.overall_impression,
      strengths:                 notes.strengths,
      areas_for_improvement:     notes.areas_for_improvement,
      general_notes:             notes.general_notes,
      calculated_score:          calcWeightedScore(),
    };
    console.log('💾 Saving notes (draft):', notesData);
    alert('Notes saved successfully!');
  };
    
  const handleRejoin = async() => {
    try{
      isInitializedRef.current = false;
      reconnectAttemptsRef.current = 0;
      setReconnectAttempts(0);
      setIsReconnecting(false);
      setError(null);
      setCandidateLeft(false);
      zegoCloudService.reset();
      setCallState('connecting');

      const result = await dispatch(joinHRMeeting(interview.session_id)).unwrap();
      const freshConfig = result.zegocloud_config;

      if(!freshConfig?.token){
        throw new Error('Failed ot get fresh token for rejoin');
      }
      setLocalZegoConfig({
        appID: freshConfig.app_id,
        roomID: freshConfig.room_id,
        token: freshConfig.token,
        userID: freshConfig.user_id,
        userName: 'Candidate'
      });
    }catch(err){
      console.error('rejoin failed', err);
      setError(err.message ||  'Failed to rejoin interview');
      setCallState('ended')
    }
  };

  const handleLeaveCall = async () => {
    if (!window.confirm('Are you sure you want to leave the interview?')) return;
    setCallState('ending');
    try {
      await cleanupZego();
      if (onLeaveMeeting && interview?.session_id) await onLeaveMeeting(interview.session_id);
    } catch (err) { console.error('Leave call error:', err); }
    setCallState('left');
  };

  const handleEndCall = () => {
    if (!isRecruiter) { handleLeaveCall(); return; }
    setShowEndModal(true);
  };

  // RECRUITER — confirmed end from modal: save notes + complete interview
  const handleConfirmEnd = async (finalNotes, recommendation) => {
    setIsSavingNotes(true);
    setShowEndModal(false);
    setCallState('ending');
    if (isRecording) handleStopRecording();
    try {
      await cleanupZego();
      if (onEndMeeting && interview?.session_id) {
        await onEndMeeting({ session_id: interview.session_id, interview_id: interview.interview_id, notes: finalNotes, recommendation });
      }
    } catch (err) { console.error('Confirm end error:', err); }
    finally { setIsSavingNotes(false); }
    setCallState('ended');
    if (onCallEnd) setTimeout(onCallEnd, 2000);
  };

  // RECRUITER — stop session without completing; trigger reschedule flow
  const handleStopAndReschedule = async () => {
    if (!window.confirm('This will end the current session without completing the interview. The candidate can be rescheduled. Continue?')) return;
    setCallState('ending');
    if (isRecording) handleStopRecording();
    try {
      await cleanupZego();
      if (onReschedule && interview?.session_id) await onReschedule(interview.session_id);
    } catch (err) { console.error('Stop & reschedule error:', err); }
    setCallState('ended');
    if (onCallEnd) setTimeout(onCallEnd, 1500);
  };


  if (error) return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={handleRejoin} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            Try Again
          </button>
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );

  if (callState === 'connecting') return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Connecting to interview…</p>
        <p className="text-sm text-gray-500 mt-2">Please wait</p>
      </div>
    </div>
  );

  if (callState === 'ending') return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">
          {isRecruiter ? 'Saving notes and ending interview…' : 'Leaving interview…'}
        </p>
        <p className="text-sm text-gray-500 mt-2">Please wait</p>
      </div>
    </div>
  );

  if (callState === 'ended') return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Ended</h2>
        <p className="text-gray-600 mb-2">Interview completed successfully</p>
        <p className="text-sm text-gray-500">Duration: {formatDuration(callDuration)}</p>
      </div>
    </div>
  );

  // Candidate has left voluntarily
  if (callState === 'left') return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">You've Left the Interview</h2>
        <p className="text-gray-600 mb-2">The recruiter may still be in the meeting.</p>
        <p className="text-sm text-gray-500 mb-6">Duration so far: {formatDuration(callDuration)}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={handleRejoin} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Rejoin Meeting
          </button>
          <button onClick={onCallEnd} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Leave Permanently
          </button>
        </div>
      </div>
    </div>
  );

  // Network dropped and max reconnect attempts exhausted
  if (callState === 'disconnected') return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Lost</h2>
        <p className="text-gray-600 mb-2">Unable to reconnect after {MAX_RECONNECT} attempts.</p>
        <p className="text-sm text-gray-500 mb-6">Duration: {formatDuration(callDuration)}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={handleRejoin} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Try Rejoining
          </button>
          <button onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Leave
          </button>
        </div>
      </div>
    </div>
  )
  
  // Main interview interface
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header Bar */}
      <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">

          {/* Connection status */}
          {connectionStatus === 'connected' && (
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-sm text-green-400">Connected</span>
            </div>
          )}
          {connectionStatus === 'reconnecting' && (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
              <span className="text-sm text-yellow-400">Reconnecting…</span>
            </div>
          )}

          {/* Timer */}
          <div className="flex items-center gap-2 bg-gray-700 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{formatDuration(callDuration)}</span>
          </div>

          {/* Recording badge */}
          {isRecording && (
            <div className="flex items-center gap-2 bg-red-600/20 border border-red-500 px-3 py-1.5 rounded-full">
              <Circle className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Recording</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onMinimize} className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Minimize">
            <Minimize2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => { if (window.confirm('Closing will minimize the interview. To end it, use the End Call button.')) onMinimize(); }}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Close window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Video area ─────────────────────────────── */}
        <div className="flex-1 bg-gray-900 relative">

          {/* Reconnecting overlay */}
          {isReconnecting && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
              <div className="bg-white rounded-lg p-6 text-center">
                <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto mb-3" />
                <p className="font-semibold text-gray-900">Reconnecting…</p>
                <p className="text-sm text-gray-500 mt-1">Attempt {reconnectAttempts}/{MAX_RECONNECT}</p>
              </div>
            </div>
          )}

          {/* Candidate-left banner (recruiter only) */}
          {isRecruiter && candidateLeft && (
            <div className="absolute top-4 left-4 right-72 bg-yellow-500/90 text-white rounded-lg p-3 flex items-center gap-3 z-10">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Candidate has left the meeting</p>
                <p className="text-xs text-yellow-100">You can continue updating notes. End meeting when ready.</p>
              </div>
            </div>
          )}

          {/* Remote video */}
          <div className="absolute inset-0 bg-gray-900">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              style={{ 
                display: (!remoteUserConnected && !pendingRemoteStreamRef.current) 
                  ? 'none' 
                  : 'block' 
              }}
            />
            {(!remoteUserConnected || !remoteVideoOn) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-white text-lg font-medium mb-1">
                    {isRecruiter ? 'Candidate' : 'Recruiter'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {!remoteUserConnected
                      ? (isRecruiter && candidateLeft ? 'Candidate has left' : 'Waiting to join…')
                      : 'Camera is off'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Local video PiP */}
          <div className="absolute top-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
            />
            {!isVideoOn && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <CameraOff className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Camera Off</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2">
              <span className="text-white text-xs bg-black/60 px-2 py-1 rounded">You</span>
            </div>
          </div>

          {/* ── Control bar ──────────────────────────── */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="max-w-4xl mx-auto">

              {/* Primary controls */}
              <div className="flex items-center justify-center gap-4">

                {/* Mute */}
                <button
                  onClick={handleToggleMute}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                </button>

                {/* Camera */}
                <button
                  onClick={handleToggleVideo}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    !isVideoOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                >
                  {isVideoOn ? <Camera className="w-6 h-6 text-white" /> : <CameraOff className="w-6 h-6 text-white" />}
                </button>

                {/* End / Leave — role-specific */}
                {isRecruiter ? (
                  <button
                    onClick={handleEndCall}
                    className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-lg"
                    title="End Interview"
                  >
                    <VideoOff className="w-7 h-7 text-white" />
                  </button>
                ) : (
                  <button
                    onClick={handleLeaveCall}
                    className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-lg"
                    title="Leave Interview"
                  >
                    <PhoneOff className="w-7 h-7 text-white" />
                  </button>
                )}

                {/* Speaker */}
                <button
                  onClick={handleToggleSpeaker}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    !isSpeakerOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title={isSpeakerOn ? 'Mute speaker' : 'Unmute speaker'}
                >
                  {isSpeakerOn ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
                </button>

                {/* Chat */}
                <button
                  onClick={() => setShowChat(p => !p)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    showChat ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title="Toggle Chat"
                >
                  <MessageSquare className="w-6 h-6 text-white" />
                </button>

                {/* Notes (recruiter only) */}
                {isRecruiter && (
                  <button
                    onClick={() => setShowNotes(p => !p)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      showNotes ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    title="Toggle Notes"
                  >
                    <FileText className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>

              {/* Recruiter secondary controls */}
              {isRecruiter && (
                <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors"
                    >
                      <Circle className="w-4 h-4" /> Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors"
                    >
                      <Circle className="w-4 h-4 fill-red-500 text-red-500" /> Stop Recording
                    </button>
                  )}

                  <button
                    onClick={handleStopAndReschedule}
                    className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white text-sm font-medium transition-colors"
                    title="Stop session and reschedule"
                  >
                    <RefreshCw className="w-4 h-4" /> Stop & Reschedule
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Chat sidebar ───────────────────────────── */}
        {showChat && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Chat</h3>
              <button onClick={() => setShowChat(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No messages yet</p>
                  <p className="text-xs mt-1">Start a conversation</p>
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'self' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      msg.sender === 'self' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'self' ? 'text-teal-100' : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message…"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Notes sidebar (recruiter only) ─────────── */}
        {isRecruiter && showNotes && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Interview Notes</h3>
              <button onClick={() => setShowNotes(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* Category sections */}
              {[
                { key: 'communication',      label: 'Communication',      weight: 25 },
                { key: 'culture_fit',        label: 'Culture Fit',        weight: 20 },
                { key: 'motivation',         label: 'Motivation',         weight: 15 },
                { key: 'professionalism',    label: 'Professionalism',    weight: 15 },
                { key: 'problem_solving',    label: 'Problem Solving',    weight: 15 },
                { key: 'team_collaboration', label: 'Team Collaboration', weight: 10 },
              ].map(section => (
                <div key={section.key} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleNoteSection(section.key)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{section.label}</span>
                      <span className="text-xs text-gray-500">({section.weight}%)</span>
                      {notes[section.key].rating && (
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                          {notes[section.key].rating}
                        </span>
                      )}
                    </div>
                    {notes[section.key].expanded
                      ? <ChevronUp   className="w-4 h-4 text-gray-500" />
                      : <ChevronDown className="w-4 h-4 text-gray-500" />
                    }
                  </button>

                  {notes[section.key].expanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-200">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2 mt-3">Rating (0-100)</label>
                        <div className="flex gap-1">
                          {[20, 40, 60, 80, 100].map(r => (
                            <button
                              key={r}
                              onClick={() => updateNoteRating(section.key, r)}
                              className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${
                                notes[section.key].rating === r
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                        {notes[section.key].rating && (
                          <p className="text-xs text-gray-600 mt-1">Selected: {notes[section.key].rating}/100</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                          value={notes[section.key].notes}
                          onChange={e => updateNoteText(section.key, e.target.value)}
                          placeholder={`Add notes about ${section.label.toLowerCase()}…`}
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Overall assessment */}
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900">Overall Assessment</h4>
                {[
                  { key: 'overall_impression',    label: 'Overall Impression',    placeholder: 'Overall impression of the candidate…' },
                  { key: 'strengths',             label: 'Strengths',             placeholder: 'Key strengths observed…' },
                  { key: 'areas_for_improvement', label: 'Areas for Improvement', placeholder: 'Areas that need improvement…' },
                  { key: 'general_notes',         label: 'General Notes',         placeholder: 'Any additional notes…', rows: 3 },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{f.label}</label>
                    <textarea
                      value={notes[f.key]}
                      onChange={e => setNotes(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      rows={f.rows || 2}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                    />
                  </div>
                ))}
              </div>

              {/* Live weighted score */}
              {calcWeightedScore() !== null && (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Calculated Score</span>
                    <span className="text-2xl font-bold text-teal-600">{calcWeightedScore()}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Based on weighted average of all ratings</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleSaveNotes}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors"
              >
                <Save className="w-4 h-4" /> Save Notes (Draft)
              </button>
            </div>
          </div>
        )}
      </div>
      {isRecruiter && (
        <EndMeetingModal
          isOpen={showEndModal}
          notes={notes}
          onConfirm={handleConfirmEnd}
          onCancel={() => setShowEndModal(false)}
          isSaving={isSavingNotes}
        />
      )}
    </div>
  );
};

export default VideoInterviewInterface;