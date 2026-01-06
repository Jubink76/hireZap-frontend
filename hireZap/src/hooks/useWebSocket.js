// src/hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notify } from '../utils/toast';
import { fetchCompany } from '../redux/slices/companySlice';

const WEBSOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:8000';

export const useWebSocket = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);
  const pingIntervalRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  // ------------------ Connect ------------------
  const connect = useCallback(() => {
    if (!user?.id) return;
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) return;
    if (isConnectingRef.current) return; // prevent multiple connects

    isConnectingRef.current = true;
    const wsUrl = `${WEBSOCKET_URL}/ws/notifications/${user.id}/`;
    console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // ---------- On Open ----------
    socket.onopen = () => {
      console.log('✅ WebSocket Connected');
      reconnectAttemptsRef.current = 0;
      isConnectingRef.current = false;

      // Start ping interval
      if (!pingIntervalRef.current) {
        pingIntervalRef.current = setInterval(() => {
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
      }

      // Initial ping
      socket.send(JSON.stringify({ type: 'ping' }));
    };

    // ---------- On Message ----------
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Message received:', data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // ---------- On Close ----------
    socket.onclose = (event) => {
      console.log('❌ WebSocket Disconnected:', event.code, event.reason);
      isConnectingRef.current = false;

      if (reconnectAttemptsRef.current < 10) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        console.log(`🔄 Reconnecting in ${delay}ms... (Attempt ${reconnectAttemptsRef.current + 1})`);
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current += 1;
          connect();
        }, delay);
      } else {
        console.error('❌ Max reconnection attempts reached');
        notify.error('Unable to connect to real-time updates. Please refresh the page.');
      }
    };

    // ---------- On Error ----------
    socket.onerror = (error) => {
      console.error('❌ WebSocket Error:', error);
    };
  }, [user?.id]);

  // ------------------ Disconnect ------------------
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    isConnectingRef.current = false;
  }, []);

  // ------------------ Handle Messages ------------------
  const handleWebSocketMessage = (data) => {
    const { type, message, company, reason, application, job_title } = data;

    switch (type) {
      case 'pong':
        break;

      case 'company_verified':
        dispatch(fetchCompany());
        notify.success(message || '🎉 Your company has been verified!', { duration: 5000 });
        break;

      case 'company_rejected':
        dispatch(fetchCompany());
        notify.error(`Company verification rejected: ${reason || 'Please check details'}`, { duration: 7000 });
        break;

      case 'job_application':
        dispatch({ type: 'applications/incrementCount', payload: application });
        notify.info(`New application for ${job_title}`, { duration: 5000 });
        break;

      case 'application_status_updated':
        dispatch({ type: 'applications/updateStatus', payload: data });
        const statusMessages = {
          'accepted': '🎉 Your application has been accepted!',
          'rejected': '😔 Your application was not selected this time.',
          'shortlisted': '⭐ You have been shortlisted!',
          'interviewing': '📞 Interview scheduled!'
        };
        const statusMessage = statusMessages[data.status] || 'Application status updated';
        if (data.status === 'accepted' || data.status === 'shortlisted') {
          notify.success(statusMessage, { duration: 7000 });
        } else {
          notify.info(statusMessage, { duration: 5000 });
        }
        break;

      case 'new_job_posted':
        notify.info(`New job posted: ${data.job_title}`, { duration: 5000 });
        break;
      
      // ==================== Bulk Screening Started ====================
      case 'bulk_screening_started':
        console.log('🚀 Bulk screening started:', data);
        notify.info(`🚀 Resume screening started for ${job_title || 'job'}`, { duration: 5000 });
        break;

      // ==================== Screening Progress ====================
      case 'screening_progress':
        console.log('📊 Screening progress update:', data.progress || data);
        
        // This is primarily handled in RecruiterHiringProcess component
        // Show milestone notifications
        const progressData = data.progress || data;
        if (progressData) {
          // Show notifications at 25%, 50%, 75%
          if ([25, 50, 75].includes(Math.floor(progressData.percentage))) {
            notify.info(`Screening ${Math.floor(progressData.percentage)}% complete`, { duration: 3000 });
          }
          
          // Completion notification
          if (progressData.status === 'completed') {
            notify.success(
              `✅ Resume screening completed! ${progressData.screened_applications || 0} candidates screened.`, 
              { duration: 7000 }
            );
          }
          
          // Failure notification
          if (progressData.status === 'failed') {
            notify.error(
              `❌ Screening failed: ${progressData.error || 'Unknown error'}`, 
              { duration: 7000 }
            );
          }
        }
        break;

      // ==================== Screening Progress Update ====================
      case 'screening_progress_update':
        console.log('📈 Screening progress update (individual):', data);
        // This is for real-time individual candidate updates
        // You can dispatch an action here if needed
        break;

      // ==================== Screening Paused ====================
      case 'screening_paused':
        notify.warning(`⏸️ Screening paused for ${job_title || 'job'}`, { duration: 5000 });
        break;

      // ==================== Individual Candidate Screened ====================
      case 'candidate_screened':
        console.log('✅ Candidate screened:', data);
        // Optional: Show individual notifications
        // Uncomment if you want real-time per-candidate notifications:
        // notify.info(`Candidate screened: ${data.candidate_name || 'Unknown'}`, { duration: 2000 });
        break;
      default:
        console.log('Unknown message type:', type);
    }
  };

  // ------------------ Effect ------------------
  useEffect(() => {
    if (!user?.id) return;
    connect();
    return () => disconnect();
  }, [user?.id, connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.readyState === WebSocket.OPEN,
    disconnect
  };
};

export default useWebSocket;
