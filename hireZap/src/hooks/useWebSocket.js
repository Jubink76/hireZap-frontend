// src/hooks/useWebSocket.js
// Native WebSocket implementation for Django Channels

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
  const { user } = useSelector((state) => state.auth);

  const connect = useCallback(() => {
    if (!user?.id) {
      console.log('⏳ No user logged in, skipping WebSocket connection');
      return;
    }

    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.close();
    }

    const wsUrl = `${WEBSOCKET_URL}/ws/notifications/${user.id}/`;
    console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);

    try {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      // Connection opened
      socket.onopen = () => {
        console.log('✅ WebSocket Connected');
        reconnectAttemptsRef.current = 0;
        
        // Send initial ping
        socket.send(JSON.stringify({ type: 'ping' }));
      };

      // Listen for messages
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Message received:', data);

          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      // Connection closed
      socket.onclose = (event) => {
        console.log('❌ WebSocket Disconnected:', event.code, event.reason);
        
        // Attempt to reconnect
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

      // Connection error
      socket.onerror = (error) => {
        console.error('❌ WebSocket Error:', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [user?.id]);

  const handleWebSocketMessage = (data) => {
    const { type, message, company, reason, application, job_title } = data;

    switch (type) {
      case 'pong':
        // Keep-alive response
        break;

      case 'company_verified':
        console.log('🎉 Company verified:', company);
        
        // Refetch company data to sync state
        dispatch(fetchCompany());
        
        // Show notification
        notify.success(
          message || '🎉 Your company has been verified! You can now post jobs.',
          { duration: 5000 }
        );
        break;

      case 'company_rejected':
        console.log('❌ Company rejected:', company, reason);
        
        // Refetch company data
        dispatch(fetchCompany());
        
        // Show notification
        notify.error(
          `Company verification rejected: ${reason || 'Please check details'}`,
          { duration: 7000 }
        );
        break;

      case 'job_application':
        console.log('📧 New job application:', application);
        
        // Update applications count
        dispatch({
          type: 'applications/incrementCount',
          payload: application
        });
        
        // Show notification
        notify.info(
          `New application for ${job_title}`,
          { duration: 5000 }
        );
        break;

      case 'application_status_updated':
        console.log('📬 Application status updated:', data);
        
        // Update application status in state
        dispatch({
          type: 'applications/updateStatus',
          payload: data
        });
        
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
        console.log('💼 New job posted:', data);
        
        notify.info(
          `New job posted: ${data.job_title}`,
          { duration: 5000 }
        );
        break;

      default:
        console.log('Unknown message type:', type);
    }
  };

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();

    // Ping interval to keep connection alive
    const pingInterval = setInterval(() => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(pingInterval);
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.readyState === WebSocket.OPEN,
    disconnect
  };
};

export default useWebSocket;