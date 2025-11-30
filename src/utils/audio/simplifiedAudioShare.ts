
import WebRTCSignaling from './webrtcSignaling';
import AudioProcessor, { AudioProcessorConfig } from './audioProcessor';

interface AudioPeer {
  id: string;
  name: string;
  connection: RTCPeerConnection;
  audio?: HTMLAudioElement;
  connected: boolean;
  queuedIceCandidates: RTCIceCandidate[];
  remoteDescriptionSet: boolean;
  muted: boolean;
  connectionAttempts: number;
  lastConnectionAttempt: number;
  reconnectTimeout?: NodeJS.Timeout;
  audioAnalyser?: AnalyserNode;
  audioLevel: number;
  latency?: number;
}

class SimplifiedAudioShare {
  private static instance: SimplifiedAudioShare;
  private localStream: MediaStream | null = null;
  private peers: Map<string, AudioPeer> = new Map();
  private signaling: WebRTCSignaling | null = null;
  private roomId: string = '';
  private userId: string = '';
  private isSharing = false;
  private audioContext: AudioContext | null = null;
  private currentParticipants: string[] = [];
  private participantNames: Map<string, string> = new Map();
  private userInteracted = false;
  private audioProcessor: AudioProcessor | null = null;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private connectionTimeout = 30000;
  private statusUpdateInterval?: NodeJS.Timeout;

  private constructor() {}

  public static getInstance(): SimplifiedAudioShare {
    if (!SimplifiedAudioShare.instance) {
      SimplifiedAudioShare.instance = new SimplifiedAudioShare();
    }
    return SimplifiedAudioShare.instance;
  }

  async initialize(roomId: string, userId: string): Promise<boolean> {
    try {
      console.log('SimplifiedAudioShare: Initializing for room', roomId, 'user', userId);
      this.roomId = roomId;
      this.userId = userId;
      this.signaling = new WebRTCSignaling(roomId, userId);
      
      // Listen for incoming WebRTC signals
      this.signaling.listenForSignals((signal) => {
        console.log('SimplifiedAudioShare: Received signal:', signal.type, 'from', signal.from);
        this.handleSignalingMessage(signal);
      });

      // Start periodic status updates
      this.startStatusUpdates();

      return true;
    } catch (error) {
      console.error('SimplifiedAudioShare: Initialization failed:', error);
      return false;
    }
  }

  private startStatusUpdates(): void {
    if (this.statusUpdateInterval) {
      clearInterval(this.statusUpdateInterval);
    }
    
    this.statusUpdateInterval = setInterval(() => {
      this.updatePeerStatuses();
    }, 1000);
  }

  private updatePeerStatuses(): void {
    this.peers.forEach((peer) => {
      // Update audio level
      if (peer.audioAnalyser && peer.connected && !peer.muted) {
        const dataArray = new Uint8Array(peer.audioAnalyser.frequencyBinCount);
        peer.audioAnalyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        peer.audioLevel = Math.min(average / 128, 1);
      } else {
        peer.audioLevel = 0;
      }
    });
  }

  async startSharing(): Promise<boolean> {
    try {
      if (this.isSharing) {
        console.log('SimplifiedAudioShare: Already sharing');
        return true;
      }

      console.log('SimplifiedAudioShare: Starting audio sharing...');

      // Initialize audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('SimplifiedAudioShare: Audio context resumed');
      }

      // Initialize audio processor
      this.audioProcessor = new AudioProcessor(this.audioContext);
      await this.audioProcessor.initialize();
      console.log('SimplifiedAudioShare: Audio processor initialized');

      // Try to get system audio first (screen share with audio)
      try {
        console.log('SimplifiedAudioShare: Requesting system audio...');
        this.localStream = await navigator.mediaDevices.getDisplayMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: 44100,
            channelCount: 2
          },
          video: false
        });

        if (this.localStream && this.localStream.getAudioTracks().length > 0) {
          console.log('SimplifiedAudioShare: System audio capture enabled');
          
          // Process audio through noise suppression pipeline
          if (this.audioProcessor) {
            try {
              this.localStream = await this.audioProcessor.processStream(this.localStream);
              console.log('SimplifiedAudioShare: Audio processing pipeline active');
            } catch (error) {
              console.warn('SimplifiedAudioShare: Audio processing failed, using raw stream:', error);
            }
          }
          
          this.isSharing = true;
          
          // Automatically connect to existing participants after sharing starts
          if (this.currentParticipants.length > 0) {
            console.log('SimplifiedAudioShare: Auto-connecting to existing participants:', this.currentParticipants);
            this.connectToAllParticipants();
          }
          
          return true;
        }
      } catch (displayError) {
        console.log('SimplifiedAudioShare: System audio not available, trying microphone...', displayError.message);
      }

      // Fallback to microphone
      try {
        console.log('SimplifiedAudioShare: Requesting microphone audio...');
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: 44100,
            channelCount: 2
          },
          video: false
        });

        if (this.localStream) {
          console.log('SimplifiedAudioShare: Microphone audio sharing started');
          
          // Process audio through noise suppression pipeline
          if (this.audioProcessor) {
            try {
              this.localStream = await this.audioProcessor.processStream(this.localStream);
              console.log('SimplifiedAudioShare: Audio processing pipeline active');
            } catch (error) {
              console.warn('SimplifiedAudioShare: Audio processing failed, using raw stream:', error);
            }
          }
          
          this.isSharing = true;
          
          // Automatically connect to existing participants after sharing starts
          if (this.currentParticipants.length > 0) {
            console.log('SimplifiedAudioShare: Auto-connecting to existing participants:', this.currentParticipants);
            this.connectToAllParticipants();
          }
          
          return true;
        }
      } catch (micError) {
        console.error('SimplifiedAudioShare: Failed to access microphone:', micError);
      }

      return false;
    } catch (error) {
      console.error('SimplifiedAudioShare: Failed to start sharing:', error);
      return false;
    }
  }

  private connectToAllParticipants(): void {
    this.currentParticipants.forEach(participantId => {
      if (participantId !== this.userId && !this.peers.has(participantId)) {
        console.log('SimplifiedAudioShare: Auto-connecting to participant:', participantId);
        this.connectToPeer(participantId);
      }
    });
  }

  private scheduleReconnect(peerId: string): void {
    const peer = this.peers.get(peerId);
    if (!peer) return;

    // Clear existing reconnect timeout
    if (peer.reconnectTimeout) {
      clearTimeout(peer.reconnectTimeout);
    }

    // Check if we should attempt reconnection
    if (peer.connectionAttempts >= this.maxReconnectAttempts) {
      console.error(`SimplifiedAudioShare: Max reconnection attempts reached for ${peerId}`);
      return;
    }

    // Calculate delay with exponential backoff
    const delay = this.reconnectDelay * Math.pow(2, peer.connectionAttempts);
    console.log(`SimplifiedAudioShare: Scheduling reconnection for ${peerId} in ${delay}ms (attempt ${peer.connectionAttempts + 1})`);

    peer.reconnectTimeout = setTimeout(() => {
      console.log(`SimplifiedAudioShare: Attempting to reconnect to ${peerId}`);
      this.disconnectPeer(peerId);
      this.connectToPeer(peerId);
    }, delay);
  }

  private handleConnectionTimeout(peerId: string): void {
    console.error(`SimplifiedAudioShare: Connection timeout for ${peerId}`);
    const peer = this.peers.get(peerId);
    if (peer && !peer.connected) {
      this.scheduleReconnect(peerId);
    }
  }

  async connectToPeer(peerId: string): Promise<void> {
    if (this.peers.has(peerId) || !this.localStream || !this.signaling) {
      console.log('SimplifiedAudioShare: Skip connecting to peer', peerId, {
        alreadyExists: this.peers.has(peerId),
        hasStream: !!this.localStream,
        hasSignaling: !!this.signaling
      });
      return;
    }

    try {
      console.log('SimplifiedAudioShare: Connecting to peer', peerId);
      
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Initialize peer with ICE candidate queue and tracking
      const peer: AudioPeer = {
        id: peerId,
        name: this.participantNames.get(peerId) || peerId.substring(0, 8),
        connection: pc,
        connected: false,
        queuedIceCandidates: [],
        remoteDescriptionSet: false,
        muted: false,
        connectionAttempts: 1,
        lastConnectionAttempt: Date.now(),
        audioLevel: 0
      };

      // Set connection timeout
      const timeoutId = setTimeout(() => {
        if (!peer.connected) {
          console.warn(`SimplifiedAudioShare: Connection timeout for peer ${peerId}`);
          this.handleConnectionTimeout(peerId);
        }
      }, this.connectionTimeout);

      this.peers.set(peerId, peer);

      // Add local stream tracks - only for the initiator
      this.localStream.getTracks().forEach(track => {
        console.log('SimplifiedAudioShare: Adding track to peer connection:', track.kind, track.label);
        pc.addTrack(track, this.localStream!);
      });

      // Handle incoming audio tracks
      pc.ontrack = (event) => {
        console.log('SimplifiedAudioShare: Received audio track from', peerId);
        const remoteStream = event.streams[0];
        this.setupRemoteAudio(peerId, remoteStream);
      };

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log(`SimplifiedAudioShare: Connection state with ${peerId}:`, pc.connectionState);
        peer.connected = pc.connectionState === 'connected';
        
        if (pc.connectionState === 'connected') {
          clearTimeout(timeoutId);
          peer.connectionAttempts = 0;
          if (peer.reconnectTimeout) {
            clearTimeout(peer.reconnectTimeout);
            peer.reconnectTimeout = undefined;
          }
        }
      };

      // Handle ICE connection state
      pc.oniceconnectionstatechange = () => {
        console.log(`SimplifiedAudioShare: ICE connection state with ${peerId}:`, pc.iceConnectionState);
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          console.log(`SimplifiedAudioShare: Successfully connected to ${peerId}`);
          peer.connected = true;
        } else if (pc.iceConnectionState === 'failed') {
          console.error(`SimplifiedAudioShare: Connection failed with ${peerId}, attempting reconnection`);
          peer.connected = false;
          this.scheduleReconnect(peerId);
        } else if (pc.iceConnectionState === 'disconnected') {
          console.log(`SimplifiedAudioShare: Connection disconnected with ${peerId}`);
          peer.connected = false;
          this.scheduleReconnect(peerId);
        }
      };

      // Handle ICE candidates - queue them until remote description is set
      pc.onicecandidate = (event) => {
        if (event.candidate && this.signaling) {
          console.log('SimplifiedAudioShare: Sending ICE candidate to', peerId);
          this.signaling.sendSignal('ice-candidate', event.candidate, peerId);
        }
      };

      // Create and send offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      });
      await pc.setLocalDescription(offer);
      
      await this.signaling.sendSignal('offer', offer, peerId);
      console.log('SimplifiedAudioShare: Sent offer to', peerId);

    } catch (error) {
      console.error('SimplifiedAudioShare: Error connecting to peer:', error);
      this.peers.delete(peerId);
    }
  }

  private async handleSignalingMessage(signal: any): Promise<void> {
    try {
      console.log('SimplifiedAudioShare: Processing signal:', signal.type, 'from', signal.from);
      
      switch (signal.type) {
        case 'offer':
          await this.handleOffer(signal.from, signal.data);
          break;
        case 'answer':
          const answerPeer = this.peers.get(signal.from);
          if (answerPeer) {
            await answerPeer.connection.setRemoteDescription(signal.data);
            answerPeer.remoteDescriptionSet = true;
            console.log('SimplifiedAudioShare: Set remote description for answer from', signal.from);
            
            // Process queued ICE candidates
            this.processQueuedIceCandidates(signal.from);
          }
          break;
        case 'ice-candidate':
          await this.handleIceCandidate(signal.from, signal.data);
          break;
      }
    } catch (error) {
      console.error('SimplifiedAudioShare: Error handling signaling message:', error);
    }
  }

  private async handleIceCandidate(fromPeerId: string, candidate: RTCIceCandidate): Promise<void> {
    const peer = this.peers.get(fromPeerId);
    if (!peer) {
      console.log('SimplifiedAudioShare: No peer found for ICE candidate from', fromPeerId);
      return;
    }

    // Queue ICE candidate if remote description is not set yet
    if (!peer.remoteDescriptionSet) {
      console.log('SimplifiedAudioShare: Queuing ICE candidate from', fromPeerId, '(no remote description yet)');
      peer.queuedIceCandidates.push(candidate);
      return;
    }

    // Add ICE candidate immediately if remote description is set
    try {
      await peer.connection.addIceCandidate(candidate);
      console.log('SimplifiedAudioShare: Added ICE candidate from', fromPeerId);
    } catch (error) {
      console.error('SimplifiedAudioShare: Error adding ICE candidate:', error);
    }
  }

  private async processQueuedIceCandidates(peerId: string): Promise<void> {
    const peer = this.peers.get(peerId);
    if (!peer || peer.queuedIceCandidates.length === 0) return;

    console.log(`SimplifiedAudioShare: Processing ${peer.queuedIceCandidates.length} queued ICE candidates for ${peerId}`);
    
    for (const candidate of peer.queuedIceCandidates) {
      try {
        await peer.connection.addIceCandidate(candidate);
        console.log('SimplifiedAudioShare: Added queued ICE candidate from', peerId);
      } catch (error) {
        console.error('SimplifiedAudioShare: Error adding queued ICE candidate:', error);
      }
    }
    
    peer.queuedIceCandidates = [];
  }

  private async handleOffer(fromPeerId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.localStream || !this.signaling) {
      console.log('SimplifiedAudioShare: Cannot handle offer - no local stream or signaling');
      return;
    }

    try {
      console.log('SimplifiedAudioShare: Handling offer from', fromPeerId);
      
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Initialize peer with ICE candidate queue
      const peer: AudioPeer = {
        id: fromPeerId,
        name: this.participantNames.get(fromPeerId) || fromPeerId.substring(0, 8),
        connection: pc,
        connected: false,
        queuedIceCandidates: [],
        remoteDescriptionSet: false,
        muted: false,
        connectionAttempts: 1,
        lastConnectionAttempt: Date.now(),
        audioLevel: 0
      };

      this.peers.set(fromPeerId, peer);

      // Add local stream tracks for bidirectional audio
      this.localStream.getTracks().forEach(track => {
        console.log('SimplifiedAudioShare: Adding track for answer:', track.kind);
        pc.addTrack(track, this.localStream!);
      });

      // Handle incoming audio tracks
      pc.ontrack = (event) => {
        console.log('SimplifiedAudioShare: Received audio track from', fromPeerId, '(answer)');
        const remoteStream = event.streams[0];
        this.setupRemoteAudio(fromPeerId, remoteStream);
      };

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log(`SimplifiedAudioShare: Connection state with ${fromPeerId}:`, pc.connectionState);
        peer.connected = pc.connectionState === 'connected';
      };

      // Handle ICE connection state
      pc.oniceconnectionstatechange = () => {
        console.log(`SimplifiedAudioShare: ICE connection state with ${fromPeerId}:`, pc.iceConnectionState);
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          peer.connected = true;
        } else if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          peer.connected = false;
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && this.signaling) {
          console.log('SimplifiedAudioShare: Sending ICE candidate to', fromPeerId, '(answer)');
          this.signaling.sendSignal('ice-candidate', event.candidate, fromPeerId);
        }
      };

      // Set remote description and create answer
      await pc.setRemoteDescription(offer);
      peer.remoteDescriptionSet = true;
      
      // Process any queued ICE candidates
      this.processQueuedIceCandidates(fromPeerId);
      
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send answer
      await this.signaling.sendSignal('answer', answer, fromPeerId);
      console.log('SimplifiedAudioShare: Sent answer to', fromPeerId);
    } catch (error) {
      console.error('SimplifiedAudioShare: Error handling offer:', error);
    }
  }

  private setupRemoteAudio(peerId: string, stream: MediaStream): void {
    try {
      console.log('SimplifiedAudioShare: Setting up remote audio for', peerId);
      
      // Clean up existing audio element if any
      const existingPeer = this.peers.get(peerId);
      if (existingPeer?.audio) {
        console.log('SimplifiedAudioShare: Cleaning up existing audio element for', peerId);
        existingPeer.audio.pause();
        existingPeer.audio.srcObject = null;
        existingPeer.audio.remove();
        existingPeer.audio = undefined;
      }

      // Remove any orphaned audio elements with same peer ID
      const orphanedAudio = document.getElementById(`remote-audio-${peerId}`);
      if (orphanedAudio) {
        console.log('SimplifiedAudioShare: Removing orphaned audio element for', peerId);
        orphanedAudio.remove();
      }

      // Create new audio element
      const audio = new Audio();
      audio.srcObject = stream;
      audio.autoplay = true;
      audio.volume = 0.8;
      audio.muted = false;
      audio.id = `remote-audio-${peerId}`;
      
      // Add to DOM for better browser compatibility
      audio.style.display = 'none';
      document.body.appendChild(audio);
      
      // Store audio element with peer
      const peer = this.peers.get(peerId);
      if (peer) {
        peer.audio = audio;
        
        // Setup audio analyser for level detection
        if (this.audioContext) {
          try {
            const source = this.audioContext.createMediaStreamSource(stream);
            const analyser = this.audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            peer.audioAnalyser = analyser;
            console.log('SimplifiedAudioShare: Audio analyser setup for', peerId);
          } catch (error) {
            console.warn('SimplifiedAudioShare: Could not setup audio analyser:', error);
          }
        }
        
        console.log('SimplifiedAudioShare: Audio element attached to peer', peerId);
      }

      // Handle audio play with user gesture support
      this.playRemoteAudio(audio, peerId);
      
    } catch (error) {
      console.error('SimplifiedAudioShare: Error setting up remote audio:', error);
    }
  }

  private async playRemoteAudio(audio: HTMLAudioElement, peerId: string): Promise<void> {
    try {
      // Ensure audio context is resumed if needed
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('SimplifiedAudioShare: Resumed audio context for playback');
      }
      
      await audio.play();
      console.log('SimplifiedAudioShare: Successfully playing audio from peer', peerId);
    } catch (error: any) {
      console.error('SimplifiedAudioShare: Error playing remote audio:', error.message);
      
      // If autoplay fails, wait for user interaction
      if (!this.userInteracted) {
        console.log('SimplifiedAudioShare: Waiting for user interaction to enable audio playback');
        const enableAudio = async () => {
          try {
            if (this.audioContext && this.audioContext.state === 'suspended') {
              await this.audioContext.resume();
            }
            await audio.play();
            console.log('SimplifiedAudioShare: Audio playback enabled after user interaction for', peerId);
            this.userInteracted = true;
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
          } catch (e: any) {
            console.error('SimplifiedAudioShare: Failed to enable audio after user interaction:', e.message);
          }
        };
        
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
      }
    }
  }

  public async resumeAudio(): Promise<void> {
    console.log('SimplifiedAudioShare: Resuming audio for all peers (user gesture)');
    this.userInteracted = true;
    
    // Resume audio context if suspended
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log('SimplifiedAudioShare: Audio context resumed successfully');
      } catch (error) {
        console.error('SimplifiedAudioShare: Failed to resume audio context:', error);
      }
    }
    
    // Attempt to play all peer audio elements
    const playPromises: Promise<void>[] = [];
    this.peers.forEach((peer, peerId) => {
      if (peer.audio) {
        playPromises.push(this.playRemoteAudio(peer.audio, peerId));
      }
    });
    
    await Promise.allSettled(playPromises);
    console.log('SimplifiedAudioShare: Resumed audio for', playPromises.length, 'peers');
  }

  updateParticipants(participantIds: string[], participantNames?: Map<string, string>): void {
    console.log('SimplifiedAudioShare: Updating participants:', participantIds);
    this.currentParticipants = [...participantIds];
    
    // Update participant names if provided
    if (participantNames) {
      this.participantNames = new Map(participantNames);
    }
    
    // Connect to new participants if sharing is active
    if (this.isSharing) {
      participantIds.forEach(participantId => {
        if (participantId !== this.userId && !this.peers.has(participantId)) {
          console.log('SimplifiedAudioShare: Connecting to new participant:', participantId);
          this.connectToPeer(participantId);
        }
      });
    }

    // Remove disconnected participants
    this.peers.forEach((peer, peerId) => {
      if (!participantIds.includes(peerId)) {
        console.log('SimplifiedAudioShare: Removing disconnected participant:', peerId);
        this.disconnectPeer(peerId);
      }
    });
  }

  private disconnectPeer(peerId: string): void {
    const peer = this.peers.get(peerId);
    if (peer) {
      // Clear any reconnect timeout
      if (peer.reconnectTimeout) {
        clearTimeout(peer.reconnectTimeout);
      }
      
      // Close peer connection
      peer.connection.close();
      
      // Clean up audio element
      if (peer.audio) {
        peer.audio.pause();
        peer.audio.srcObject = null;
        peer.audio.remove();
        peer.audio = undefined;
      }
      
      // Remove from peers map
      this.peers.delete(peerId);
      console.log('SimplifiedAudioShare: Disconnected from peer', peerId);
    }
    
    // Also remove any orphaned audio elements
    const orphanedAudio = document.getElementById(`remote-audio-${peerId}`);
    if (orphanedAudio) {
      console.log('SimplifiedAudioShare: Removing orphaned audio element during disconnect:', peerId);
      orphanedAudio.remove();
    }
  }

  stopSharing(): void {
    console.log('SimplifiedAudioShare: Stopping sharing');
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }

    this.peers.forEach((peer, peerId) => {
      this.disconnectPeer(peerId);
    });

    this.isSharing = false;
  }

  updateAudioProcessorConfig(config: Partial<AudioProcessorConfig>): void {
    if (this.audioProcessor) {
      this.audioProcessor.updateConfig(config);
      console.log('SimplifiedAudioShare: Audio processor config updated');
    }
  }

  getAudioProcessorConfig(): AudioProcessorConfig | null {
    return this.audioProcessor ? this.audioProcessor.getConfig() : null;
  }

  dispose(): void {
    console.log('SimplifiedAudioShare: Disposing');
    
    // Stop status updates
    if (this.statusUpdateInterval) {
      clearInterval(this.statusUpdateInterval);
      this.statusUpdateInterval = undefined;
    }
    
    this.stopSharing();
    
    // Clean up all audio elements
    this.peers.forEach((peer, peerId) => {
      if (peer.audio) {
        peer.audio.pause();
        peer.audio.srcObject = null;
        peer.audio.remove();
      }
      if (peer.reconnectTimeout) {
        clearTimeout(peer.reconnectTimeout);
      }
    });
    
    // Clean up signaling
    if (this.signaling) {
      this.signaling.cleanup();
      this.signaling = null;
    }
    
    // Dispose audio processor
    if (this.audioProcessor) {
      this.audioProcessor.dispose();
      this.audioProcessor = null;
    }
    
    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    // Reset state
    this.peers.clear();
    this.currentParticipants = [];
    this.participantNames.clear();
    this.userInteracted = false;
    console.log('SimplifiedAudioShare: Disposal complete');
  }

  mutePeer(peerId: string): void {
    const peer = this.peers.get(peerId);
    if (peer && peer.audio) {
      peer.muted = !peer.muted;
      peer.audio.muted = peer.muted;
      console.log(`SimplifiedAudioShare: ${peer.muted ? 'Muted' : 'Unmuted'} peer ${peerId}`);
    }
  }

  getPeerStatuses(): Array<{
    id: string;
    name: string;
    connected: boolean;
    connectionState: RTCPeerConnectionState;
    iceConnectionState: RTCIceConnectionState;
    audioLevel: number;
    muted: boolean;
    latency?: number;
  }> {
    return Array.from(this.peers.entries()).map(([id, peer]) => ({
      id,
      name: peer.name,
      connected: peer.connected,
      connectionState: peer.connection.connectionState,
      iceConnectionState: peer.connection.iceConnectionState,
      audioLevel: peer.audioLevel,
      muted: peer.muted,
      latency: peer.latency
    }));
  }

  isCurrentlySharing(): boolean {
    return this.isSharing && this.localStream !== null;
  }

  getConnectedPeersCount(): number {
    return Array.from(this.peers.values()).filter(peer => peer.connected).length;
  }

  getActiveAudioLevel(): number {
    if (!this.localStream) return 0;
    return this.localStream.getAudioTracks().length > 0 ? 0.5 : 0;
  }
}

export default SimplifiedAudioShare;
