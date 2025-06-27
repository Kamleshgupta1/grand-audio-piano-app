
import WebRTCSignaling from './webrtcSignaling';

interface AudioPeer {
  id: string;
  connection: RTCPeerConnection;
  audio?: HTMLAudioElement;
  connected: boolean;
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

      return true;
    } catch (error) {
      console.error('SimplifiedAudioShare: Initialization failed:', error);
      return false;
    }
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
          this.isSharing = true;
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

      // Add local stream tracks
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
        const peer = this.peers.get(peerId);
        if (peer) {
          peer.connected = pc.connectionState === 'connected';
        }
      };

      // Handle ICE connection state
      pc.oniceconnectionstatechange = () => {
        console.log(`SimplifiedAudioShare: ICE connection state with ${peerId}:`, pc.iceConnectionState);
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          console.log(`SimplifiedAudioShare: Successfully connected to ${peerId}`);
          const peer = this.peers.get(peerId);
          if (peer) {
            peer.connected = true;
          }
        } else if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          console.log(`SimplifiedAudioShare: Connection failed/disconnected with ${peerId}`);
          const peer = this.peers.get(peerId);
          if (peer) {
            peer.connected = false;
          }
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
      this.peers.set(peerId, { id: peerId, connection: pc, connected: false });

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
            console.log('SimplifiedAudioShare: Set remote description for answer from', signal.from);
          }
          break;
        case 'ice-candidate':
          const icePeer = this.peers.get(signal.from);
          if (icePeer && icePeer.connection.remoteDescription) {
            await icePeer.connection.addIceCandidate(signal.data);
            console.log('SimplifiedAudioShare: Added ICE candidate from', signal.from);
          } else {
            console.log('SimplifiedAudioShare: Queuing ICE candidate from', signal.from, '(no remote description yet)');
          }
          break;
      }
    } catch (error) {
      console.error('SimplifiedAudioShare: Error handling signaling message:', error);
    }
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

      // Add local stream tracks
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
        const peer = this.peers.get(fromPeerId);
        if (peer) {
          peer.connected = pc.connectionState === 'connected';
        }
      };

      // Handle ICE connection state
      pc.oniceconnectionstatechange = () => {
        console.log(`SimplifiedAudioShare: ICE connection state with ${fromPeerId}:`, pc.iceConnectionState);
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          const peer = this.peers.get(fromPeerId);
          if (peer) {
            peer.connected = true;
          }
        } else if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          const peer = this.peers.get(fromPeerId);
          if (peer) {
            peer.connected = false;
          }
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && this.signaling) {
          console.log('SimplifiedAudioShare: Sending ICE candidate to', fromPeerId, '(answer)');
          this.signaling.sendSignal('ice-candidate', event.candidate, fromPeerId);
        }
      };

      // Store peer connection
      this.peers.set(fromPeerId, { id: fromPeerId, connection: pc, connected: false });

      // Set remote description and create answer
      await pc.setRemoteDescription(offer);
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
      
      // Remove existing audio element if any
      const existingPeer = this.peers.get(peerId);
      if (existingPeer?.audio) {
        existingPeer.audio.pause();
        existingPeer.audio.srcObject = null;
        existingPeer.audio.remove();
        console.log('SimplifiedAudioShare: Removed existing audio element for', peerId);
      }

      // Create new audio element
      const audio = new Audio();
      audio.srcObject = stream;
      audio.autoplay = true;
      audio.volume = 0.8;
      audio.muted = false;
      
      // Add to DOM for better browser compatibility
      audio.style.display = 'none';
      document.body.appendChild(audio);
      
      // Handle audio play promise
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('SimplifiedAudioShare: Successfully playing audio from peer', peerId);
        }).catch(error => {
          console.error('SimplifiedAudioShare: Error playing remote audio:', error);
          // Auto-retry on user interaction
          const retryPlay = () => {
            audio.play().then(() => {
              console.log('SimplifiedAudioShare: Retry successful for peer', peerId);
              document.removeEventListener('click', retryPlay);
              document.removeEventListener('keydown', retryPlay);
            }).catch(e => console.error('Retry failed:', e));
          };
          document.addEventListener('click', retryPlay, { once: true });
          document.addEventListener('keydown', retryPlay, { once: true });
        });
      }

      // Store audio element with peer
      const peer = this.peers.get(peerId);
      if (peer) {
        peer.audio = audio;
        console.log('SimplifiedAudioShare: Audio element attached to peer', peerId);
      }
    } catch (error) {
      console.error('SimplifiedAudioShare: Error setting up remote audio:', error);
    }
  }

  updateParticipants(participantIds: string[]): void {
    console.log('SimplifiedAudioShare: Updating participants:', participantIds);
    
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
        peer.audio.remove();
      }
      this.peers.delete(peerId);
      console.log('SimplifiedAudioShare: Disconnected from peer', peerId);
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

  dispose(): void {
    console.log('SimplifiedAudioShare: Disposing');
    this.stopSharing();
    if (this.signaling) {
      this.signaling.cleanup();
      this.signaling = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
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
