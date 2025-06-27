class SystemAudioShare {
  private static instance: SystemAudioShare;
  private localStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private isSharing = false;
  private isInitialized = false;
  private roomParticipants: string[] = [];
  private peerConnections: Map<string, RTCPeerConnection> = new Map();

  private constructor() {}

  public static getInstance(): SystemAudioShare {
    if (!SystemAudioShare.instance) {
      SystemAudioShare.instance = new SystemAudioShare();
    }
    return SystemAudioShare.instance;
  }

  public async initializeSystemAudio(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        console.log('SystemAudioShare: Already initialized');
        return true;
      }

      // Initialize audio context for system audio capture
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isInitialized = true;
      console.log('SystemAudioShare: Audio context initialized successfully');
      return true;
    } catch (error) {
      console.error('SystemAudioShare: Failed to initialize audio context:', error);
      this.isInitialized = false;
      return false;
    }
  }

  public async startSystemAudioSharing(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initializeSystemAudio();
        if (!initialized) {
          return false;
        }
      }

      if (this.isSharing) {
        console.log('SystemAudioShare: Already sharing system audio');
        return true;
      }

      // First try to get system audio directly
      try {
        this.localStream = await navigator.mediaDevices.getDisplayMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 44100,
            channelCount: 2
          },
          video: false
        });
        
        if (this.localStream && this.localStream.getAudioTracks().length > 0) {
          this.isSharing = true;
          console.log('SystemAudioShare: System audio capture enabled successfully');
          
          // Set up track ended handler
          this.localStream.getAudioTracks()[0].addEventListener('ended', () => {
            console.log('SystemAudioShare: System audio track ended');
            this.stopSystemAudioSharing();
          });
          
          // Share with room participants
          this.shareWithParticipants();
          return true;
        }
      } catch (displayError) {
        console.log('SystemAudioShare: System audio not available, falling back to microphone');
      }

      // Fallback to microphone audio
      try {
        const constraints = {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 44100,
            channelCount: 2
          },
          video: false
        };

        this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (this.localStream) {
          this.isSharing = true;
          console.log('SystemAudioShare: Microphone audio sharing started as fallback');
          this.shareWithParticipants();
          return true;
        }
      } catch (micError) {
        console.error('SystemAudioShare: Failed to access microphone:', micError);
      }

      return false;
    } catch (error) {
      console.error('SystemAudioShare: Failed to start system audio sharing:', error);
      this.isSharing = false;
      return false;
    }
  }

  public stopSystemAudioSharing(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
        console.log('SystemAudioShare: Stopped audio track:', track.kind);
      });
      this.localStream = null;
    }

    // Close all peer connections
    this.peerConnections.forEach((pc, participantId) => {
      pc.close();
      console.log('SystemAudioShare: Closed peer connection for participant:', participantId);
    });
    this.peerConnections.clear();

    this.isSharing = false;
    console.log('SystemAudioShare: System audio sharing stopped');
  }

  public updateRoomParticipants(participants: string[]): void {
    console.log('SystemAudioShare: Updating room participants:', participants);
    this.roomParticipants = participants;
    
    if (this.isSharing) {
      this.shareWithParticipants();
    }
  }

  private async shareWithParticipants(): Promise<void> {
    if (!this.localStream || this.roomParticipants.length === 0) return;

    for (const participantId of this.roomParticipants) {
      if (!this.peerConnections.has(participantId)) {
        await this.createPeerConnection(participantId);
      }
    }

    // Remove connections for participants who left
    for (const [participantId, pc] of this.peerConnections) {
      if (!this.roomParticipants.includes(participantId)) {
        pc.close();
        this.peerConnections.delete(participantId);
        console.log('SystemAudioShare: Removed peer connection for left participant:', participantId);
      }
    }
  }

 private async createPeerConnection(participantId: string): Promise<void> {
  try {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // ✅ Handle ICE candidate
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to the other peer via Firebase/WebSocket signaling
      }
    };

    // ✅ Play incoming audio
    pc.ontrack = (event) => {
      const remoteStream = new MediaStream();
      remoteStream.addTrack(event.track);
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.autoplay = true;
      audio.play().catch(console.warn);
      console.log(`SystemAudioShare: Playing audio from ${participantId}`);
    };

    // ✅ Send local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!);
      });
    }

    this.peerConnections.set(participantId, pc);

    // ✅ Simulate offer-answer exchange (replace with real signaling backend)
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const answer = await this.fakeSignalExchange(offer); // Simulated exchange
    await pc.setRemoteDescription(new RTCSessionDescription(answer));

    console.log('SystemAudioShare: Created peer connection and exchanged SDP with', participantId);
  } catch (error) {
    console.error('SystemAudioShare: Failed to create peer connection for participant:', participantId, error);
  }
}


  // Simulate offer/answer exchange (replace with actual signaling backend)
  private async fakeSignalExchange(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    const tempPc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    let localStream = this.localStream;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        tempPc.addTrack(track, localStream);
      });
    }

    await tempPc.setRemoteDescription(offer);
    const answer = await tempPc.createAnswer();
    await tempPc.setLocalDescription(answer);

    return answer;
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  public isCurrentlySharing(): boolean {
    return this.isSharing && this.localStream !== null;
  }

  public getAudioLevel(): number {
    if (!this.localStream || !this.audioContext) return 0;
    
    try {
      const source = this.audioContext.createMediaStreamSource(this.localStream);
      const analyser = this.audioContext.createAnalyser();
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      return average / 255;
    } catch (error) {
      console.error('SystemAudioShare: Error getting audio level:', error);
      return 0;
    }
  }

  public dispose(): void {
    this.stopSystemAudioSharing();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isInitialized = false;
    this.roomParticipants = [];
    console.log('SystemAudioShare: Disposed');
  }
}

export default SystemAudioShare;
