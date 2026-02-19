
import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle
} from 'lucide-react';

import zegoCloudService from '../services/zegoCloudService';

const VideoInterviewInterface = ({ 
  interview,
  zegoConfig,
  isRecruiter = true,
  onClose,
  onMinimize,
  onCallEnd,
  sessionStartedAt 
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
  const [error, setError] = useState(null);
  
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
  
  useEffect(() => {
    const initZegoCloud = async () => {
      if (!zegoConfig) {
        console.log('⚠️ No zegoConfig provided');
        return;
      }
      
      if (isInitializedRef.current) {
        console.log('✅ Already initialized, skipping');
        return;
      }

      try {
        console.log('🚀 Initializing ZegoCloud...', zegoConfig);
        console.log('🔍 ZegoConfig breakdown:', {
          appID: zegoConfig.appID,
          roomID: zegoConfig.roomID,
          token: zegoConfig.token ? `${zegoConfig.token.substring(0, 20)}...` : 'UNDEFINED',
          userID: zegoConfig.userID,
          userName: zegoConfig.userName
        });
        if (!zegoConfig.appID || !zegoConfig.roomID || !zegoConfig.token || !zegoConfig.userID) {
          console.error('❌ Invalid ZegoCloud config:', zegoConfig);
          setError('Invalid video configuration');
          setCallState('ended');
          return;
        }

        console.log('✅ ZegoConfig validation passed');
        setConnectionStatus('connecting');

        // Initialize ZegoCloud
        await zegoCloudService.init(Number(zegoConfig.appID));

        // Register event listeners
        zegoCloudService.on({
          // Room state changes
          roomStateUpdate: (roomID, state, errorCode) => {
            console.log('🏠 Room state:', { state, errorCode });
            if (state === 'CONNECTED') {
              setConnectionStatus('connected');
              setCallState('connected');
            } else if (state === 'DISCONNECTED') {
              setConnectionStatus('disconnected');
              if (errorCode !== 0) {
                setError(`Connection failed: ${errorCode}`);
              }
            }
          },

          // User joined/left
          roomUserUpdate: (roomID, updateType, userList) => {
            console.log('👥 User update:', { updateType, userList });
            if (updateType === 'ADD') {
              console.log('✅ Remote user joined:', userList);
              setRemoteUserConnected(true);
            } else if (updateType === 'DELETE') {
              console.log('❌ Remote user left:', userList);
              setRemoteUserConnected(false);
            }
          },

          // Stream added/removed
          roomStreamUpdate: async (roomID, updateType, streamList) => {
            console.log('📡 Stream update:', { updateType, streamList });
            
            if (updateType === 'ADD') {
              // Remote user started publishing
              for (const stream of streamList) {
                console.log('▶️ Playing remote stream:', stream.streamID);
                if (remoteVideoRef.current) {
                  await zegoCloudService.startPlaying(
                    stream.streamID,
                    remoteVideoRef.current
                  );
                }
              }
            } else if (updateType === 'DELETE') {
              // Remote user stopped publishing
              for (const stream of streamList) {
                console.log('⏹️ Stopping remote stream:', stream.streamID);
                await zegoCloudService.stopPlaying(stream.streamID);
              }
            }
          },

          // Chat messages
          IMRecvBroadcastMessage: (roomID, chatData) => {
            console.log('💬 Message received:', chatData);
            chatData.forEach(msg => {
              setChatMessages(prev => [...prev, {
                id: Date.now() + Math.random(),
                sender: msg.fromUser.userID === zegoConfig.userID ? 'self' : 'other',
                senderName: msg.fromUser.userName,
                text: msg.message,
                timestamp: new Date().toISOString()
              }]);
            });
          },

          // Connection quality monitoring
          publishQualityUpdate: (streamID, stats) => {
            // Update connection quality UI if needed
          },

          playQualityUpdate: (streamID, stats) => {
            // Update connection quality UI if needed
          }
        });

        // Login to room
        await zegoCloudService.loginRoom(
          zegoConfig.roomID,
          zegoConfig.token,
          zegoConfig.userID,
          zegoConfig.userName || (isRecruiter ? 'Recruiter' : 'Candidate')
        );

        // Create and publish local stream
        const localStream = await zegoCloudService.createLocalStream(
          `${zegoConfig.userID}_main`,
          { camera: true, audio: true }
        );

        // Play local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        // Start publishing
        await zegoCloudService.startPublishing(`${zegoConfig.userID}_main`, localVideoRef.current);

        console.log('✅ ZegoCloud initialized and publishing');
        isInitializedRef.current = true;

      } catch (error) {
        console.error('❌ Failed to initialize ZegoCloud:', error);
        setError(error.message || 'Failed to connect to interview');
        setCallState('ended');
      }
    };

    initZegoCloud();

    return () => {
      if (isInitializedRef.current && zegoConfig) {
        // logout first (releases server room slot), then destroy
        zegoCloudService.logoutRoom(zegoConfig.roomID)
          .catch(console.error)
          .finally(() => {
            zegoCloudService.destroy();
            isInitializedRef.current = false;
          });
      }
    };
  }, [zegoConfig]);
  
  // ==================== TIMER ====================
  useEffect(() => {
    if (callState !== 'connected') return;

    durationIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
      setCallDuration(elapsed);
    }, 1000);
    
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [callState]);
  
  // ==================== AUTO-SCROLL CHAT ====================
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleToggleMute = async () => {
    try {
      await zegoCloudService.muteAudio(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
  };

  const handleToggleVideo = async () => {
    try {
      await zegoCloudService.enableCamera(!isVideoOn);
      setIsVideoOn(!isVideoOn);
    } catch (error) {
      console.error('Failed to toggle video:', error);
    }
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // Mute/unmute remote audio playback
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !isSpeakerOn;
    }
  };
  
  const handleStartRecording = async () => {
    try {
      setIsRecording(true);
      await zegoCloudService.startRecording(`${zegoConfig.userID}_main`);
      console.log('🔴 Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    console.log('⏹️ Recording stopped');
    // ZegoCloud handles recording automatically
  };
  
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !zegoConfig) return;
    
    try {
      await zegoCloudService.sendBroadcastMessage(zegoConfig.roomID, messageInput);
      
      // Add to local chat (will also be received via event)
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'self',
        senderName: zegoConfig.userName || 'You',
        text: messageInput,
        timestamp: new Date().toISOString()
      }]);
      
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  const handleSaveNotes = async () => {
    const weights = {
      communication: 25,
      culture_fit: 20,
      motivation: 15,
      professionalism: 15,
      problem_solving: 15,
      team_collaboration: 10
    };
    
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.keys(weights).forEach(key => {
      if (notes[key].rating !== null) {
        totalScore += notes[key].rating * (weights[key] / 100);
        totalWeight += weights[key];
      }
    });
    
    const calculatedScore = totalWeight > 0 ? Math.round(totalScore) : null;
    
    const notesData = {
      interview_id: interview.interview_id,
      communication_rating: notes.communication.rating,
      communication_notes: notes.communication.notes,
      culture_fit_rating: notes.culture_fit.rating,
      culture_fit_notes: notes.culture_fit.notes,
      motivation_rating: notes.motivation.rating,
      motivation_notes: notes.motivation.notes,
      professionalism_rating: notes.professionalism.rating,
      professionalism_notes: notes.professionalism.notes,
      problem_solving_rating: notes.problem_solving.rating,
      problem_solving_notes: notes.problem_solving.notes,
      team_collaboration_rating: notes.team_collaboration.rating,
      team_collaboration_notes: notes.team_collaboration.notes,
      overall_impression: notes.overall_impression,
      strengths: notes.strengths,
      areas_for_improvement: notes.areas_for_improvement,
      general_notes: notes.general_notes,
      calculated_score: calculatedScore
    };
    
    console.log(' Saving notes:', notesData);
    alert('Notes saved successfully!');
  };
  
  const handleEndCall = async () => {
    const confirmEnd = window.confirm(
      isRecruiter 
        ? 'Are you sure you want to end this interview? This will disconnect both parties.'
        : 'Are you sure you want to end the interview?'
    );

    if (!confirmEnd) return;
    
    setCallState('ending');
    
    if (isRecording) {
      handleStopRecording();
    }
    
    const durationSeconds = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
    console.log('📞 Ending call...', { durationSeconds });
    
    try {
      // Logout from ZegoCloud room
      if (zegoConfig) {
        await zegoCloudService.logoutRoom(zegoConfig.roomID);
      }
    } catch (error) {
      console.error('Error ending call:', error);
    }
    
    setTimeout(() => {
      setCallState('ended');
      if (onCallEnd) {
        setTimeout(onCallEnd, 2000);
      }
    }, 1000);
  };
  
  const toggleNoteSection = (section) => {
    setNotes(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        expanded: !prev[section].expanded
      }
    }));
  };


  const updateNoteRating = (section, rating) => {
    setNotes(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        rating
      }
    }));
  };
  
  const updateNoteText = (section, text) => {
    setNotes(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        notes: text
      }
    }));
  };

  
  // Ended state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (callState === 'ended') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Ended</h2>
          <p className="text-gray-600 mb-4">Interview completed successfully</p>
          <p className="text-sm text-gray-500">Duration: {formatDuration(callDuration)}</p>
        </div>
      </div>
    );
  }
  
  // Ending state
  if (callState === 'ending') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Ending interview...</p>
          <p className="text-sm text-gray-500 mt-2">Saving recording and notes</p>
        </div>
      </div>
    );
  }

  if (callState === 'connecting') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Connecting to interview...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }
  
  // Main interview interface
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header Bar */}
      <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {connectionStatus === 'connected' && (
              <>
                <Radio className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-sm text-green-400">Connected</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 bg-gray-700 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{formatDuration(callDuration)}</span>
          </div>
          
          {isRecording && (
            <div className="flex items-center gap-2 bg-red-600/20 border border-red-500 px-3 py-1.5 rounded-full">
              <Circle className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Recording</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onMinimize}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('Closing will minimize the interview. To end the interview, use the End Call button.')) {
                onMinimize();
              }
            }}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Close window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 bg-gray-900 relative">
          {/* Remote Video (Candidate) */}
          <div className="absolute inset-0 bg-gray-900">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Show placeholder only when no remote user connected */}
            {!remoteUserConnected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-gray-400">Waiting for {isRecruiter ? 'Candidate' : 'Recruiter'} to join...</p>
                </div>
              </div>
            )}
          </div>

          {/* Local Video (Self) - Picture in Picture */}
          <div className="absolute top-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
            />
            {!isVideoOn && (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <CameraOff className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Camera Off</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2">
              <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">You</span>
            </div>
          </div>
          
          {/* Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleToggleMute}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                </button>
                
                <button
                  onClick={handleToggleVideo}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    !isVideoOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                >
                  {isVideoOn ? <Camera className="w-6 h-6 text-white" /> : <CameraOff className="w-6 h-6 text-white" />}
                </button>
                
                <button
                  onClick={handleEndCall}
                  className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-lg"
                  title="End Interview"
                >
                  <VideoOff className="w-7 h-7 text-white" />
                </button>
                
                <button
                  onClick={handleToggleSpeaker}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    !isSpeakerOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title={isSpeakerOn ? 'Mute speaker' : 'Unmute speaker'}
                >
                  {isSpeakerOn ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
                </button>
                
                <button
                  onClick={() => setShowChat(!showChat)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    showChat ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title="Toggle Chat"
                >
                  <MessageSquare className="w-6 h-6 text-white" />
                </button>
                
                {isRecruiter && (
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      showNotes ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    title="Toggle Notes"
                  >
                    <FileText className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>
              
              {isRecruiter && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
                    >
                      <Circle className="w-4 h-4" />
                      Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                    >
                      <Circle className="w-4 h-4 fill-red-500 text-red-500" />
                      Stop Recording
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat Sidebar */}
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
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === (isRecruiter ? 'recruiter' : 'candidate') ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        msg.sender === (isRecruiter ? 'recruiter' : 'candidate')
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === (isRecruiter ? 'recruiter' : 'candidate')
                          ? 'text-teal-100'
                          : 'text-gray-500'
                      }`}>
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
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
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
        
        {/* Notes Sidebar (Recruiter only) */}
        {isRecruiter && showNotes && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Interview Notes</h3>
              <button onClick={() => setShowNotes(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {[
                { key: 'communication', label: 'Communication', weight: 25 },
                { key: 'culture_fit', label: 'Culture Fit', weight: 20 },
                { key: 'motivation', label: 'Motivation', weight: 15 },
                { key: 'professionalism', label: 'Professionalism', weight: 15 },
                { key: 'problem_solving', label: 'Problem Solving', weight: 15 },
                { key: 'team_collaboration', label: 'Team Collaboration', weight: 10 }
              ].map(section => (
                <div key={section.key} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleNoteSection(section.key)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{section.label}</span>
                      <span className="text-xs text-gray-500">({section.weight}%)</span>
                    </div>
                    {notes[section.key].expanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  
                  {notes[section.key].expanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-200">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Rating (0-100)
                        </label>
                        <div className="flex gap-1">
                          {[20, 40, 60, 80, 100].map(rating => (
                            <button
                              key={rating}
                              onClick={() => updateNoteRating(section.key, rating)}
                              className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${
                                notes[section.key].rating === rating
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                        {notes[section.key].rating && (
                          <p className="text-xs text-gray-600 mt-1">
                            Selected: {notes[section.key].rating}/100
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                          value={notes[section.key].notes}
                          onChange={(e) => updateNoteText(section.key, e.target.value)}
                          placeholder={`Add notes about ${section.label.toLowerCase()}...`}
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900">Overall Assessment</h4>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Overall Impression</label>
                  <textarea
                    value={notes.overall_impression}
                    onChange={(e) => setNotes(prev => ({ ...prev, overall_impression: e.target.value }))}
                    placeholder="Overall impression of the candidate..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Strengths</label>
                  <textarea
                    value={notes.strengths}
                    onChange={(e) => setNotes(prev => ({ ...prev, strengths: e.target.value }))}
                    placeholder="Key strengths observed..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Areas for Improvement</label>
                  <textarea
                    value={notes.areas_for_improvement}
                    onChange={(e) => setNotes(prev => ({ ...prev, areas_for_improvement: e.target.value }))}
                    placeholder="Areas that need improvement..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">General Notes</label>
                  <textarea
                    value={notes.general_notes}
                    onChange={(e) => setNotes(prev => ({ ...prev, general_notes: e.target.value }))}
                    placeholder="Any additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
              </div>
              
              {Object.values(notes).slice(0, 6).some(n => n.rating !== null) && (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Calculated Score</span>
                    <span className="text-2xl font-bold text-teal-600">
                      {(() => {
                        const weights = { communication: 25, culture_fit: 20, motivation: 15, professionalism: 15, problem_solving: 15, team_collaboration: 10 };
                        let total = 0, weight = 0;
                        Object.keys(weights).forEach(key => {
                          if (notes[key].rating) {
                            total += notes[key].rating * (weights[key] / 100);
                            weight += weights[key];
                          }
                        });
                        return weight > 0 ? Math.round(total) : 0;
                      })()}
                    </span>
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
                <Save className="w-4 h-4" />
                Save Notes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoInterviewInterface;