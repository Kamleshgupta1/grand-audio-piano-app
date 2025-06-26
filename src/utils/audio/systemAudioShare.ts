
class SystemAudioShare {
  private static instance: SystemAudioShare;
  private localStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private isSharing = false;

  private constructor() {}

  public static getInstance(): SystemAudioShare {
    if (!SystemAudioShare.instance) {
      SystemAudioShare.instance = new SystemAudioShare();
    }
    return SystemAudioShare.instance;
  }

  public async initializeSystemAudio(): Promise<boolean> {
    try {
      // Initialize audio context for system audio capture
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      console.log('SystemAudioShare: Audio context initialized');
      return true;
    } catch (error) {
      console.error('SystemAudioShare: Failed to initialize audio context:', error);
      return false;
    }
  }

  public async startSystemAudioSharing(): Promise<boolean> {
    try {
      if (this.isSharing) {
        console.log('SystemAudioShare: Already sharing system audio');
        return true;
      }

      // Request system audio capture (works in Chrome with user gesture)
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
        console.log('SystemAudioShare: System audio sharing started');
        
        // For system audio, we would typically use getDisplayMedia with audio: true
        // but this requires user interaction and permission
        try {
          const systemStream = await navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: false
          });
          
          if (systemStream.getAudioTracks().length > 0) {
            console.log('SystemAudioShare: System audio capture enabled');
            // Replace the microphone audio with system audio
            const audioTrack = systemStream.getAudioTracks()[0];
            this.localStream.removeTrack(this.localStream.getAudioTracks()[0]);
            this.localStream.addTrack(audioTrack);
          }
        } catch (displayError) {
          console.log('SystemAudioShare: System audio capture not available, using microphone');
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('SystemAudioShare: Failed to start system audio sharing:', error);
      return false;
    }
  }

  public stopSystemAudioSharing(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    this.isSharing = false;
    console.log('SystemAudioShare: System audio sharing stopped');
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  public isCurrentlySharing(): boolean {
    return this.isSharing;
  }

  public dispose(): void {
    this.stopSystemAudioSharing();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export default SystemAudioShare;
