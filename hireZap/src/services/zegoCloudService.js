import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

class ZegoCloudService {
  constructor() {
    this.zg = null;
    this.localStream = null;
    this.remoteStreams = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize ZegoCloud Engine
   * @param {number} appID - Your ZegoCloud App ID
   * @param {string} server - Server URL (usually 'wss://webliveroom-api.zego.im/ws')
   */
  async init(appID) {
    try {
      if (this.isInitialized) {
        console.log(' ZegoCloud already initialized');
        return;
      }

      //Destroy any previous instance before creating new one
      if (this.zg) {
        try {
          this.zg = null;
        } catch(e) {}
      }

      console.log(' Initializing ZegoCloud...', { appID });

      // ✅ NO SERVER PARAMETER - SDK auto-detects
      this.zg = new ZegoExpressEngine(appID);
      this.isInitialized = true;

      console.log('ZegoCloud initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ZegoCloud:', error);
      throw error;
    }
  }

  /**
   * Login to room
   * @param {string} roomID - Room ID
   * @param {string} token - Authentication token from backend
   * @param {string} userID - User ID
   * @param {string} userName - User name
   */
  async loginRoom(roomID, token, userID, userName) {
    try {
      if (!this.zg) {
        throw new Error('ZegoCloud not initialized. Call init() first.');
      }

      console.log(' Logging into room...', { roomID, userID, userName });

      const result = await this.zg.loginRoom(
        roomID,
        token,
        { userID, userName },
        { userUpdate: true }
      );

      console.log(' Logged into room successfully:', result);
      return result;
    } catch (error) {
      console.error(' Failed to login room:', error);
      throw error;
    }
  }

  /**
   * Logout from room
   * @param {string} roomID - Room ID
   */
  async logoutRoom(roomID) {
  try {
    if (!this.zg) return;

    console.log('🚪 Logging out from room...', { roomID });

    if (this.localStream) {
      try { this.zg.stopPublishingStream(this.localStream.streamID); } catch(e) {}
      try { this.zg.destroyStream(this.localStream); } catch(e) {}
      this.localStream = null;
    }

    this.remoteStreams.forEach((stream, streamID) => {
      try { this.zg.stopPlayingStream(streamID); } catch(e) {}
    });
    this.remoteStreams.clear();

    // ✅ This is what releases the room slot on ZegoCloud's server
    await this.zg.logoutRoom(roomID);
    console.log('✅ Logged out from room');
  } catch (error) {
    console.error('❌ Failed to logout room:', error);
    // Don't rethrow — cleanup should always complete
  }
}

  /**
   * Create and publish local stream
   * @param {string} streamID - Stream ID (usually userID)
   * @param {Object} constraints - Media constraints
   */
  async createLocalStream(streamID, constraints = { camera: true, audio: true }) {
    try {
      if (!this.zg) {
        throw new Error('ZegoCloud not initialized');
      }

      console.log(' Creating local stream...', { streamID, constraints });

      // Create stream
      this.localStream = await this.zg.createStream({
        camera: {
          audio: constraints.audio !== false,
          video: constraints.camera !== false,
        },
      });

      this.localStream.streamID = streamID;

      console.log(' Local stream created:', this.localStream);
      return this.localStream;
    } catch (error) {
      console.error(' Failed to create local stream:', error);
      throw error;
    }
  }

  /**
   * Start publishing local stream
   * @param {string} streamID - Stream ID
   * @param {HTMLVideoElement} videoElement - Video element to play stream
   */
  async startPublishing(streamID, videoElement = null) {
    try {
      if (!this.zg || !this.localStream) {
        throw new Error('Local stream not created');
      }

      console.log(' Starting to publish stream...', { streamID });

      // Start publishing
      await this.zg.startPublishingStream(streamID, this.localStream);

      // Play local video
      if (videoElement) {
        videoElement.srcObject = this.localStream;  // ← not this.zg.playStream()
      }

      console.log(' Publishing stream started');
    } catch (error) {
      console.error(' Failed to start publishing:', error);
      throw error;
    }
  }

  /**
   * Stop publishing local stream
   * @param {string} streamID - Stream ID
   */
  async stopPublishing(streamID) {
    try {
      if (!this.zg) return;

      console.log('⏹️ Stopping publishing...', { streamID });

      if (this.localStream) {
        this.zg.stopPublishingStream(streamID);
        this.zg.destroyStream(this.localStream);
        this.localStream = null;
      }

      console.log('Publishing stopped');
    } catch (error) {
      console.error(' Failed to stop publishing:', error);
      throw error;
    }
  }

  /**
   * Start playing remote stream
   * @param {string} streamID - Stream ID
   * @param {HTMLVideoElement} videoElement - Video element to play stream
   */
  async startPlaying(streamID, videoElement) {
    try {
      if (!this.zg) {
        throw new Error('ZegoCloud not initialized');
      }

      console.log(' Starting to play stream...', { streamID });

      const remoteStream = await this.zg.startPlayingStream(streamID, {
        video: true,
        audio: true,
      });

      this.remoteStreams.set(streamID, remoteStream);

      // Play in video element
      if (videoElement) {
        videoElement.srcObject = remoteStream;  // ← not this.zg.playStream()
      }

      console.log(' Playing stream started');
      return remoteStream;
    } catch (error) {
      console.error(' Failed to start playing:', error);
      throw error;
    }
  }

  /**
   * Stop playing remote stream
   * @param {string} streamID - Stream ID
   */
  async stopPlaying(streamID) {
    try {
      if (!this.zg) return;

      console.log('Stopping playing...', { streamID });

      this.zg.stopPlayingStream(streamID);
      this.remoteStreams.delete(streamID);

      console.log(' Playing stopped');
    } catch (error) {
      console.error(' Failed to stop playing:', error);
      throw error;
    }
  }

  /**
   * Mute/Unmute microphone
   * @param {boolean} mute - True to mute, false to unmute
   */
  async muteAudio(mute) {
    try {
      if (!this.zg || !this.localStream) return;

      console.log(` ${mute ? 'Muting' : 'Unmuting'} audio...`);

      this.zg.mutePublishStreamAudio(this.localStream, mute);

      console.log(` Audio ${mute ? 'muted' : 'unmuted'}`);
    } catch (error) {
      console.error(' Failed to toggle audio:', error);
      throw error;
    }
  }

  /**
   * Enable/Disable camera
   * @param {boolean} enable - True to enable, false to disable
   */
  async enableCamera(enable) {
    try {
      if (!this.zg || !this.localStream) return;

      console.log(` ${enable ? 'Enabling' : 'Disabling'} camera...`);

      this.zg.mutePublishStreamVideo(this.localStream, !enable);

      console.log(` Camera ${enable ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error(' Failed to toggle camera:', error);
      throw error;
    }
  }

  /**
   * Send broadcast message (chat)
   * @param {string} roomID - Room ID
   * @param {string} message - Message to send
   */
  async sendBroadcastMessage(roomID, message) {
    try {
      if (!this.zg) {
        throw new Error('ZegoCloud not initialized');
      }

      console.log('💬 Sending broadcast message...', { roomID, message });

      const result = await this.zg.sendBroadcastMessage(roomID, message);

      console.log(' Message sent:', result);
      return result;
    } catch (error) {
      console.error(' Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Start cloud recording
   * @param {string} streamID - Stream ID to record
   */
  async startRecording(streamID) {
    try {
      console.log(' Starting cloud recording...', { streamID });
      // ZegoCloud handles recording automatically if enabled in console
      // No client-side API needed
      console.log(' Recording started (managed by ZegoCloud)');
    } catch (error) {
      console.error(' Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * Register event listeners
   * @param {Object} callbacks - Event callbacks
   */
  on(callbacks = {}) {
    if (!this.zg) {
      console.warn(' ZegoCloud not initialized, cannot register events');
      return;
    }

    // Room state update
    if (callbacks.roomStateUpdate) {
      this.zg.on('roomStateUpdate', (roomID, state, errorCode, extendedData) => {
        console.log(' Room state update:', { roomID, state, errorCode });
        callbacks.roomStateUpdate(roomID, state, errorCode, extendedData);
      });
    }

    // User state update
    if (callbacks.roomUserUpdate) {
      this.zg.on('roomUserUpdate', (roomID, updateType, userList) => {
        console.log(' User update:', { roomID, updateType, userList });
        callbacks.roomUserUpdate(roomID, updateType, userList);
      });
    }

    // Stream update
    if (callbacks.roomStreamUpdate) {
      this.zg.on('roomStreamUpdate', (roomID, updateType, streamList, extendedData) => {
        console.log(' Stream update:', { roomID, updateType, streamList });
        callbacks.roomStreamUpdate(roomID, updateType, streamList, extendedData);
      });
    }

    // Broadcast message received
    if (callbacks.IMRecvBroadcastMessage) {
      this.zg.on('IMRecvBroadcastMessage', (roomID, chatData) => {
        console.log(' Message received:', { roomID, chatData });
        callbacks.IMRecvBroadcastMessage(roomID, chatData);
      });
    }

    // Player state update
    if (callbacks.playerStateUpdate) {
      this.zg.on('playerStateUpdate', (result) => {
        console.log(' Player state update:', result);
        callbacks.playerStateUpdate(result);
      });
    }

    // Publisher state update
    if (callbacks.publisherStateUpdate) {
      this.zg.on('publisherStateUpdate', (result) => {
        console.log(' Publisher state update:', result);
        callbacks.publisherStateUpdate(result);
      });
    }

    // Network quality
    if (callbacks.publishQualityUpdate) {
      this.zg.on('publishQualityUpdate', (streamID, stats) => {
        callbacks.publishQualityUpdate(streamID, stats);
      });
    }

    if (callbacks.playQualityUpdate) {
      this.zg.on('playQualityUpdate', (streamID, stats) => {
        callbacks.playQualityUpdate(streamID, stats);
      });
    }
  }

  /**
   * Destroy ZegoCloud instance
   */
  destroy() {
    try {
      if (this.localStream && this.zg) {
        try {
          this.zg.destroyStream(this.localStream);
        } catch(e) {}
        this.localStream = null;
      }

      this.remoteStreams.forEach((stream, streamID) => {
        try {
          this.zg?.stopPlayingStream(streamID);
        } catch(e) {}
      });
      this.remoteStreams.clear();

      // ✅ Correct method for WebRTC SDK
      if (this.zg) {
        try {
          this.zg.off('roomStateUpdate');
          this.zg.off('roomUserUpdate');
          this.zg.off('roomStreamUpdate');
          this.zg.off('IMRecvBroadcastMessage');
          this.zg.off('publisherStateUpdate');
          this.zg.off('playerStateUpdate');
          this.zg.off('publishQualityUpdate');
          this.zg.off('playQualityUpdate');
        } catch(e) {}
        this.zg = null;
      }

      this.isInitialized = false;
      console.log('✅ ZegoCloud destroyed');
    } catch (error) {
      console.error('❌ Failed to destroy ZegoCloud:', error);
    }
  }
}

// Export singleton instance
export const zegoCloudService = new ZegoCloudService();
export default zegoCloudService;