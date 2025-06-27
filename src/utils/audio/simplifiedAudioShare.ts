
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

      // Get user media (microphone audio for now, can be enhanced for system audio)
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        },
        video: false
      });

      this.isSharing = true;
      console.log('SimplifiedAudioShare: Started sharing audio');
      return true;
    } catch (error) {
      console.error('SimplifiedAudioShare: Failed to start sharing:', error);
      return false;
    }
  }

  async connectToPeer(peerId: string): Promise<void> {
    if (this.peers.has(peerId) || !this.localStream || !this.signaling) return;

    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Add local stream tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });

      // Handle incoming audio tracks
      pc.ontrack = (event) => {
        console.log('SimplifiedAudioShare: Received audio track from', peerId);
        const remoteStream = event.streams[0];
        this.playRemoteAudio(peerId, remoteStream);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && this.signaling) {
          this.signaling.sendSignal('ice-candidate', event.candidate, peerId);
        }
      };

      // Store peer connection
      this.peers.set(peerId, { id: peerId, connection: pc });

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      if (this.signaling) {
        await this.signaling.sendSignal('offer', offer, peerId);
      }

      console.log('SimplifiedAudioShare: Connected to peer', peerId);
    } catch (error) {
      console.error('SimplifiedAudioShare: Error connecting to peer:', error);
    }
  }

  private async handleSignalingMessage(signal: any): Promise<void> {
    const peer = this.peers.get(signal.from);
    
    try {
      switch (signal.type) {
        case 'offer':
          await this.handleOffer(signal.from, signal.data);
          break;
        case 'answer':
          if (peer) {
            await peer.connection.setRemoteDescription(signal.data);
          }
          break;
        case 'ice-candidate':
          if (peer) {
            await peer.connection.addIceCandidate(signal.data);
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
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Add local stream tracks
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });

      // Handle incoming audio tracks
      pc.ontrack = (event) => {
        console.log('SimplifiedAudioShare: Received audio track from', fromPeerId);
        const remoteStream = event.streams[0];
        this.playRemoteAudio(fromPeerId, remoteStream);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && this.signaling) {
          this.signaling.sendSignal('ice-candidate', event.candidate, fromPeerId);
        }
      };

      // Store peer connection
      this.peers.set(fromPeerId, { id: fromPeerId, connection: pc });

      // Set remote description and create answer
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send answer
      await this.signaling.sendSignal('answer', answer, fromPeerId);
    } catch (error) {
      console.error('SimplifiedAudioShare: Error handling offer:', error);
    }
  }

  private playRemoteAudio(peerId: string, stream: MediaStream): void {
    try {
      const audio = new Audio();
      audio.srcObject = stream;
      audio.autoplay = true;
      audio.volume = 0.8;
      
      audio.play().catch(error => {
        console.error('SimplifiedAudioShare: Error playing remote audio:', error);
      });

      // Store audio element with peer
      const peer = this.peers.get(peerId);
      if (peer) {
        peer.audio = audio;
      }

      console.log('SimplifiedAudioShare: Playing audio from peer', peerId);
    } catch (error) {
      console.error('SimplifiedAudioShare: Error setting up remote audio:', error);
    }
  }

  updateParticipants(participantIds: string[]): void {
    // Connect to new participants
    participantIds.forEach(participantId => {
      if (participantId !== this.userId && !this.peers.has(participantId)) {
        this.connectToPeer(participantId);
      }
    });

    // Remove disconnected participants
    this.peers.forEach((peer, peerId) => {
      if (!participantIds.includes(peerId)) {
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
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
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
    console.log('SimplifiedAudioShare: Disposed');
  }

  isCurrentlySharing(): boolean {
    return this.isSharing && this.localStream !== null;
  }

  getConnectedPeersCount(): number {
    return this.peers.size;
  }
}

export default SimplifiedAudioShare;
