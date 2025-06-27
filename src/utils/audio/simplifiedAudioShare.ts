
import WebRTCSignaling from './webrtcSignaling';

interface AudioPeer {
  id: string;
  connection: RTCPeerConnection;
  audio?: HTMLAudioElement;
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
  private systemAudioSource: MediaStreamAudioSourceNode | null = null;
  private destination: MediaStreamAudioDestinationNode | null = null;

  private constructor() {}

  public static getInstance(): SimplifiedAudioShare {
    if (!SimplifiedAudioShare.instance) {
      SimplifiedAudioShare.instance = new SimplifiedAudioShare();
    }
    return SimplifiedAudioShare.instance;
  }

  async initialize(roomId: string, userId: string): Promise<boolean> {
    try {
      this.roomId = roomId;
      this.userId = userId;
      this.signaling = new WebRTCSignaling(roomId, userId);
      
      // Initialize audio context for better audio processing
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Listen for incoming WebRTC signals
      this.signaling.listenForSignals((signal) => {
        this.handleSignalingMessage(signal);
      });

      console.log('SimplifiedAudioShare: Initialized for room', roomId);
      return true;
    } catch (error) {
      console.error('SimplifiedAudioShare: Initialization failed:', error);
      return false;
    }
  }

  async startSharing(): Promise<boolean> {
    try {
      if (this.isSharing) return true;

      // Try to get system audio first (for desktop screen share with audio)
      try {
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
          await this.setupAudioProcessing();
          this.isSharing = true;
          return true;
        }
      } catch (displayError) {
        console.log('SimplifiedAudioShare: System audio not available, trying microphone...');
      }

      // Fallback to microphone with enhanced settings for instrument capture
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: 44100,
            channelCount: 2,
            // Enhanced settings for better instrument sound capture
            latency: 0.01,
            sampleSize: 16,
          },
          video: false
        });

        if (this.localStream) {
          console.log('SimplifiedAudioShare: Microphone audio sharing started');
          await this.setupAudioProcessing();
          this.isSharing = true;
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

  private async setupAudioProcessing(): Promise<void> {
    if (!this.localStream || !this.audioContext) return;

    try {
      // Create audio processing chain for better sound quality
      this.systemAudioSource = this.audioContext.createMediaStreamSource(this.localStream);
      this.destination = this.audioContext.createMediaStreamDestination();
      
      // Create a gain node for volume control
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime);
      
      // Connect the audio chain
      this.systemAudioSource.connect(gainNode);
      gainNode.connect(this.destination);
      
      // Replace the original stream with the processed one
      this.localStream = this.destination.stream;
      
      console.log('SimplifiedAudioShare: Audio processing setup complete');
    } catch (error) {
      console.error('SimplifiedAudioShare: Audio processing setup failed:', error);
    }
  }

  async connectToPeer(peerId: string): Promise<void> {
    if (this.peers.has(peerId) || !this.localStream || !this.signaling) return;

    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ],
        iceCandidatePoolSize: 10
      });

      // Add local stream tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        console.log('SimplifiedAudioShare: Adding track to peer connection:', track.kind);
        pc.addTrack(track, this.localStream!);
      });

      // Handle incoming audio tracks with proper audio element setup
      pc.ontrack = (event) => {
        console.log('SimplifiedAudioShare: Received audio track from', peerId);
        const remoteStream = event.streams[0];
        this.playRemoteAudio(peerId, remoteStream);
      };

      // Handle ICE connection state changes
      pc.oniceconnectionstatechange = () => {
        console.log(`SimplifiedAudioShare: ICE connection state with ${peerId}:`, pc.iceConnectionState);
        if (pc.iceConnectionState === 'failed') {
          console.warn(`SimplifiedAudioShare: ICE connection failed with ${peerId}, attempting restart`);
          pc.restartIce();
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && this.signaling) {
          console.log('SimplifiedAudioShare: Sending ICE candidate to', peerId);
          this.signaling.sendSignal('ice-candidate', event.candidate, peerId);
        }
      };

      // Store peer connection
      this.peers.set(peerId, { id: peerId, connection: pc });

      // Create and send offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      });
      await pc.setLocalDescription(offer);
      
      if (this.signaling) {
        await this.signaling.sendSignal('offer', offer, peerId);
      }

      console.log('SimplifiedAudioShare: Successfully connected to peer', peerId);
    } catch (error) {
      console.error('SimplifiedAudioShare: Error connecting to peer:', error);
      this.peers.delete(peerId);
    }
  }

  private async handleSignalingMessage(signal: any): Promise<void> {
    try {
      switch (signal.type) {
        case 'offer':
          await this.handleOffer(signal.from, signal.data);
          break;
        case 'answer':
          const answerPeer = this.peers.get(signal.from);
          if (answerPeer) {
            await answerPeer.connection.setRemoteDescription(signal.data);
            console.log('SimplifiedAudioShare: Set remote description for answer from', signal.from);
          }
          break;
        case 'ice-candidate':
          const icePeer = this.peers.get(signal.from);
          if (icePeer) {
            await icePeer.connection.addIceCandidate(signal.data);
            console.log('SimplifiedAudioShare: Added ICE candidate from', signal.from);
          }
          break;
      }
    } catch (error) {
      console.error('SimplifiedAudioShare: Error handling signaling message:', error);
    }
  }

  private async handleOffer(fromPeerId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.localStream || !this.signaling) return;

    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ],
        iceCandidatePoolSize: 10
      });

      // Add local stream tracks
      this.localStream.getTracks().forEach(track => {
        console.log('SimplifiedAudioShare: Adding track for answer:', track.kind);
        pc.addTrack(track, this.localStream!);
      });

      // Handle incoming audio tracks
      pc.ontrack = (event) => {
        console.log('SimplifiedAudioShare: Received audio track from', fromPeerId);
        const remoteStream = event.streams[0];
        this.playRemoteAudio(fromPeerId, remoteStream);
      };

      // Handle ICE connection state
      pc.oniceconnectionstatechange = () => {
        console.log(`SimplifiedAudioShare: ICE connection state with ${fromPeerId}:`, pc.iceConnectionState);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && this.signaling) {
          console.log('SimplifiedAudioShare: Sending ICE candidate to', fromPeerId);
          this.signaling.sendSignal('ice-candidate', event.candidate, fromPeerId);
        }
      };

      // Store peer connection
      this.peers.set(fromPeerId, { id: fromPeerId, connection: pc });

      // Set remote description and create answer
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      });
      await pc.setLocalDescription(answer);

      // Send answer
      await this.signaling.sendSignal('answer', answer, fromPeerId);
      console.log('SimplifiedAudioShare: Sent answer to', fromPeerId);
    } catch (error) {
      console.error('SimplifiedAudioShare: Error handling offer:', error);
    }
  }

  private playRemoteAudio(peerId: string, stream: MediaStream): void {
    try {
      // Remove existing audio element if any
      const existingPeer = this.peers.get(peerId);
      if (existingPeer?.audio) {
        existingPeer.audio.pause();
        existingPeer.audio.srcObject = null;
      }

      // Create new audio element with optimized settings
      const audio = new Audio();
      audio.srcObject = stream;
      audio.autoplay = true;
      audio.volume = 0.8;
      audio.muted = false;
      
      // Ensure audio plays even if user hasn't interacted with page
      audio.play().then(() => {
        console.log('SimplifiedAudioShare: Successfully playing audio from peer', peerId);
      }).catch(error => {
        console.error('SimplifiedAudioShare: Error playing remote audio:', error);
        // Retry once after a short delay
        setTimeout(() => {
          audio.play().catch(retryError => {
            console.error('SimplifiedAudioShare: Retry failed for audio from peer', peerId, retryError);
          });
        }, 1000);
      });

      // Store audio element with peer
      const peer = this.peers.get(peerId);
      if (peer) {
        peer.audio = audio;
      }

      console.log('SimplifiedAudioShare: Audio element created for peer', peerId);
    } catch (error) {
      console.error('SimplifiedAudioShare: Error setting up remote audio:', error);
    }
  }

  updateParticipants(participantIds: string[]): void {
    // Connect to new participants
    participantIds.forEach(participantId => {
      if (participantId !== this.userId && !this.peers.has(participantId)) {
        console.log('SimplifiedAudioShare: Connecting to new participant:', participantId);
        this.connectToPeer(participantId);
      }
    });

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
      peer.connection.close();
      if (peer.audio) {
        peer.audio.pause();
        peer.audio.srcObject = null;
      }
      this.peers.delete(peerId);
      console.log('SimplifiedAudioShare: Disconnected from peer', peerId);
    }
  }

  stopSharing(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
        console.log('SimplifiedAudioShare: Stopped track:', track.kind);
      });
      this.localStream = null;
    }

    // Clean up audio processing
    if (this.systemAudioSource) {
      this.systemAudioSource.disconnect();
      this.systemAudioSource = null;
    }
    if (this.destination) {
      this.destination.disconnect();
      this.destination = null;
    }

    this.peers.forEach((peer, peerId) => {
      this.disconnectPeer(peerId);
    });

    this.isSharing = false;
    console.log('SimplifiedAudioShare: Stopped sharing');
  }

  dispose(): void {
    this.stopSharing();
    if (this.signaling) {
      this.signaling.cleanup();
      this.signaling = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    console.log('SimplifiedAudioShare: Disposed');
  }

  isCurrentlySharing(): boolean {
    return this.isSharing && this.localStream !== null;
  }

  getConnectedPeersCount(): number {
    return this.peers.size;
  }

  getActiveAudioLevel(): number {
    if (!this.localStream || !this.audioContext) return 0;
    
    try {
      // This is a simplified approach - in real implementation you'd want to use AnalyserNode
      return this.localStream.getAudioTracks().length > 0 ? 0.5 : 0;
    } catch (error) {
      console.error('SimplifiedAudioShare: Error getting audio level:', error);
      return 0;
    }
  }
}

export default SimplifiedAudioShare;
