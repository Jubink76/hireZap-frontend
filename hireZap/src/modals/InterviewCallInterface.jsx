import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Clock,
  Circle,
  User,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  Minimize2,
  Radio
} from 'lucide-react';
import { endCall } from '../redux/slices/telephonicSlice';
import { notify } from '../utils/toast';

const InterviewCallInterface = ({ 
  interview,
  isRecruiter = false,
  onClose,
  onMinimize,
  onCallEnd
}) => {
  const dispatch = useDispatch();
  
  // State
  const [callState, setCallState] = useState('waiting');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const callStartTimeRef = useRef(Date.now());
  const durationIntervalRef = useRef(null);
  const audioStreamRef = useRef(null);

  console.log('🔍 InterviewCallInterface - interview:', interview);
  console.log('🔍 InterviewCallInterface - session_id:', interview?.session_id);

  // ==================== INITIALIZE CALL STATE ====================
  useEffect(() => {
    if (!interview) return;
    
    if (isRecruiter && interview.status === 'in_progress') {
      setCallState('waiting'); // Waiting for candidate
      setConnectionStatus('waiting');
    } else if (interview.status === 'joined') {
      setCallState('connected'); // Both parties connected
      setConnectionStatus('connected');
    }
  }, [interview?.status, isRecruiter]);

  // ==================== START CALL TIMER ====================
  useEffect(() => {
    callStartTimeRef.current = Date.now();
    
    durationIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
      setCallDuration(elapsed);
    }, 1000);
    
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  // ==================== INITIALIZE AUDIO RECORDING ====================
  useEffect(() => {
    // Only start recording when connected
    if (callState === 'connected' && !isRecording) {
      initAudioRecording();
    }
    
    // Cleanup on unmount
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [callState]);

  const initAudioRecording = async () => {
    if (isRecording || mediaRecorderRef.current) return;
    
    try {
      console.log('🎤 Requesting microphone access...');
      
      // Request microphone access with optimal settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      audioStreamRef.current = stream;
      console.log('✅ Microphone access granted');
      
      // Determine best MIME type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/wav';
      
      console.log('🎙️ Using MIME type:', mimeType);
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        audioBitsPerSecond: 128000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('📦 Audio chunk recorded:', event.data.size, 'bytes');
        }
      };
      
      // Handle recording stop
      mediaRecorder.onstop = () => {
        console.log('🛑 Recording stopped. Total chunks:', audioChunksRef.current.length);
        const totalSize = audioChunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0);
        console.log('📊 Total recording size:', totalSize, 'bytes');
      };
      
      // Handle errors
      mediaRecorder.onerror = (error) => {
        console.error('❌ MediaRecorder error:', error);
        notify.error('Recording error occurred');
      };
      
      // Start recording with timeslice (capture data every 1 second)
      mediaRecorder.start(1000);
      setIsRecording(true);
      setConnectionStatus('connected');
      console.log('🔴 Recording started successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize audio:', error);
      notify.error('Failed to access microphone. Please check permissions.');
      setConnectionStatus('error');
    }
  };

  // ==================== TOGGLE MUTE ====================
  const handleToggleMute = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Toggle enable/disable
      });
      setIsMuted(!isMuted);
      console.log('🎤', isMuted ? 'Unmuted' : 'Muted');
    }
  };

  // ==================== TOGGLE SPEAKER ====================
  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    console.log('🔊', isSpeakerOn ? 'Speaker off' : 'Speaker on');
  };

  // ==================== MINIMIZE ====================
  const handleMinimize = () => {
    console.log('📦 Minimizing call interface (call continues in background)');
    if (onMinimize) {
      onMinimize();
    } else {
      onClose();
    }
  };

  // ==================== END CALL ====================
  const handleEndCall = async () => {
    if (!interview?.session_id) {
      console.error('❌ ERROR: session_id is missing!');
      alert('Cannot end call: Session ID is missing. Please refresh and try again.');
      return;
    }

    const confirmEnd = window.confirm(
      isRecruiter 
        ? 'Are you sure you want to end this interview? This will disconnect both parties.'
        : 'Are you sure you want to end the interview?'
    );

    if (!confirmEnd) return;

    setCallState('ending');
    
    try {
      console.log('📞 Ending call...');
      
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        
        // Wait for all chunks to be collected
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Stop audio stream
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Stop timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      
      // Calculate final duration
      const durationSeconds = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
      console.log('⏱️ Final call duration:', durationSeconds, 'seconds');
      
      // Create audio file from chunks
      let recordingFile = null;
      
      if (audioChunksRef.current.length > 0) {
        console.log('🎵 Creating audio file from', audioChunksRef.current.length, 'chunks');
        
        // Determine MIME type from MediaRecorder
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const fileExtension = mimeType.includes('webm') ? 'webm' : 
                             mimeType.includes('mp4') ? 'mp4' : 'wav';
        
        // Create blob from all chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log('📼 Audio blob created:', {
          size: audioBlob.size,
          type: mimeType
        });
        
        // Validate blob size
        if (audioBlob.size === 0) {
          console.warn('⚠️ Warning: Audio blob is empty!');
          notify.warning('No audio was recorded. Call will end without recording.');
        }
        
        // Create File object
        const timestamp = Date.now();
        const filename = `interview_${interview.session_id}_${timestamp}.${fileExtension}`;
        
        recordingFile = new File([audioBlob], filename, { 
          type: mimeType,
          lastModified: timestamp
        });
        
        console.log('📁 Recording file created:', {
          name: recordingFile.name,
          size: recordingFile.size,
          type: recordingFile.type
        });
      } else {
        console.warn('⚠️ No audio chunks recorded');
        notify.warning('No audio was recorded. Call will end without recording.');
      }
      
      // Determine connection quality
      const quality = connectionStatus === 'connected' ? 'good' : 
                     connectionStatus === 'error' ? 'poor' : 'fair';
      
      // End call via API
      console.log('📤 Sending end call request...');
      console.log('  - sessionId:', interview.session_id);
      console.log('  - durationSeconds:', durationSeconds);
      console.log('  - recordingFile:', recordingFile ? `${recordingFile.name} (${recordingFile.size} bytes)` : 'null');
      console.log('  - connectionQuality:', quality);
      
      const result = await dispatch(endCall({
        sessionId: interview.session_id,
        durationSeconds,
        recordingFile,
        connectionQuality: quality
      })).unwrap();
      
      console.log('✅ Call ended successfully:', result);
      setCallState('ended');
      
      // Show success message
      if (recordingFile && recordingFile.size > 0) {
        notify.success('Interview ended successfully. Recording is being processed...');
      } else {
        notify.success('Interview ended successfully.');
      }
      
      // Call the onCallEnd callback
      if (onCallEnd) {
        console.log('✅ Calling onCallEnd callback');
        setTimeout(() => {
          onCallEnd();
        }, 2000);
      } else {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
      
    } catch (error) {
      console.error('❌ Failed to end call:', error);
      setCallState('connected');
      notify.error(error.message || 'Failed to end call');
      
      // Restart recording if it was stopped
      if (audioStreamRef.current) {
        console.log('🔄 Restarting recording after error...');
        initAudioRecording();
      }
      
      // Restart timer
      if (!durationIntervalRef.current) {
        callStartTimeRef.current = Date.now() - (callDuration * 1000);
        durationIntervalRef.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
          setCallDuration(elapsed);
        }, 1000);
      }
    }
  };

  // ==================== FORMAT DURATION ====================
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // ==================== WAITING STATE ====================
  if (callState === 'waiting' && isRecruiter) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg max-w-lg w-full p-8 text-white relative">
          <button
            onClick={handleMinimize}
            className="absolute top-4 right-12 p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Minimize (call continues in background)"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleEndCall}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            title="End interview"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <Phone className="w-12 h-12 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Waiting for Candidate</h2>
            <p className="text-teal-100 mb-4">
              {interview.candidate_name || 'Candidate'} has been notified to join the interview
            </p>
            
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Call session active</span>
              </div>
              <p className="text-xs text-teal-200">
                The candidate can join anytime. You'll be notified when they connect.
              </p>
              <p className="text-xs text-teal-200 mt-2">
                You can minimize this window and the call will continue in the background.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleMinimize}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
              >
                Minimize
              </button>
              <button
                onClick={handleEndCall}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors"
              >
                Cancel Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== ENDED STATE ====================
  if (callState === 'ended') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Call Ended</h2>
          <p className="text-gray-600 mb-4">
            Interview completed successfully
          </p>
          <p className="text-sm text-gray-500">
            Duration: {formatDuration(callDuration)}
          </p>
        </div>
      </div>
    );
  }

  // ==================== ENDING STATE ====================
  if (callState === 'ending') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Ending interview...</p>
          <p className="text-sm text-gray-500 mt-2">Saving recording and processing data</p>
        </div>
      </div>
    );
  }

  // ==================== CONNECTED STATE ====================
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg max-w-lg w-full p-8 text-white relative">
        {/* Minimize button */}
        <button
          onClick={handleMinimize}
          className="absolute top-4 right-12 p-2 hover:bg-white/10 rounded-full transition-colors"
          title="Minimize (call continues in background)"
        >
          <Minimize2 className="w-5 h-5" />
        </button>

        {/* Close button */}
        <button
          onClick={() => {
            if (window.confirm('Closing will minimize the call. To end the interview, use the End Call button.')) {
              handleMinimize();
            }
          }}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          title="Close window (call continues)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Connection Status Indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {connectionStatus === 'connecting' && (
            <div className="flex items-center gap-2 text-yellow-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Connecting...</span>
            </div>
          )}
          {connectionStatus === 'connected' && (
            <div className="flex items-center gap-2 text-green-300">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="text-xs">Connected</span>
            </div>
          )}
          {connectionStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-300">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">Error</span>
            </div>
          )}
        </div>

        {/* Call Status */}
        <div className="text-center mb-8 mt-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <User className="w-12 h-12" />
            {isRecording && (
              <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isRecruiter ? (interview.candidate_name || 'Candidate') : (interview.recruiter_name || 'Recruiter')}
          </h2>
          <p className="text-teal-100 mb-2">{interview.job_title || 'Position'}</p>
          
          {/* Call Duration */}
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-lg">{formatDuration(callDuration)}</span>
          </div>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 mb-6 flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Recording in progress</span>
          </div>
        )}

        {/* Call Controls */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Mute Button */}
          <button
            onClick={handleToggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isMuted 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
            title="End Call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          {/* Speaker Button */}
          <button
            onClick={handleToggleSpeaker}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isSpeakerOn 
                ? 'bg-white/20 hover:bg-white/30' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
            title={isSpeakerOn ? 'Mute Speaker' : 'Unmute Speaker'}
          >
            {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>
        </div>

        {/* Control Labels */}
        <div className="flex items-center justify-center gap-12 text-xs text-teal-100">
          <span>Mute</span>
          <span className="font-semibold">End Call</span>
          <span>Speaker</span>
        </div>

        {/* Important Note */}
        <div className="mt-6 bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-100">
            <p className="font-semibold mb-1">Recording Active</p>
            <p>This interview is being recorded for evaluation purposes. You can minimize this window and the call will continue.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCallInterface;