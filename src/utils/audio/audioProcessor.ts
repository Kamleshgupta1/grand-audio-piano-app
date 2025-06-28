
export class AudioProcessor {
  private audioContext: AudioContext;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private outputStream: MediaStream | null = null;
  private noiseGate: AudioWorkletNode | null = null;
  private compressor: DynamicsCompressorNode;
  private highPassFilter: BiquadFilterNode;
  private lowPassFilter: BiquadFilterNode;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    
    // Create audio processing chain
    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime);
    this.compressor.knee.setValueAtTime(30, this.audioContext.currentTime);
    this.compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);

    // High-pass filter to remove low-frequency noise
    this.highPassFilter = this.audioContext.createBiquadFilter();
    this.highPassFilter.type = 'highpass';
    this.highPassFilter.frequency.setValueAtTime(80, this.audioContext.currentTime);
    this.highPassFilter.Q.setValueAtTime(0.7, this.audioContext.currentTime);

    // Low-pass filter to remove high-frequency noise
    this.lowPassFilter = this.audioContext.createBiquadFilter();
    this.lowPassFilter.type = 'lowpass';
    this.lowPassFilter.frequency.setValueAtTime(8000, this.audioContext.currentTime);
    this.lowPassFilter.Q.setValueAtTime(0.7, this.audioContext.currentTime);
  }

  async processStream(inputStream: MediaStream): Promise<MediaStream> {
    try {
      this.sourceNode = this.audioContext.createMediaStreamSource(inputStream);
      
      // Create destination for processed audio
      const destination = this.audioContext.createMediaStreamDestination();
      
      // Connect processing chain: source -> highpass -> lowpass -> compressor -> destination
      this.sourceNode
        .connect(this.highPassFilter)
        .connect(this.lowPassFilter)
        .connect(this.compressor)
        .connect(destination);
      
      this.outputStream = destination.stream;
      
      // Add noise gate if available
      try {
        await this.addNoiseGate();
      } catch (error) {
        console.log('AudioProcessor: Noise gate not available, using basic processing');
      }
      
      return this.outputStream;
    } catch (error) {
      console.error('AudioProcessor: Error processing stream:', error);
      return inputStream; // Fallback to original stream
    }
  }

  private async addNoiseGate(): Promise<void> {
    try {
      // Load noise gate worklet
      await this.audioContext.audioWorklet.addModule('/audio-worklets/noise-gate-processor.js');
      
      this.noiseGate = new AudioWorkletNode(this.audioContext, 'noise-gate-processor', {
        parameterData: {
          threshold: -40, // dB threshold for noise gate
          ratio: 10,
          attack: 0.01,
          release: 0.1
        }
      });
      
      // Insert noise gate between highpass and lowpass filters
      this.sourceNode?.disconnect();
      this.sourceNode
        ?.connect(this.highPassFilter)
        .connect(this.noiseGate)
        .connect(this.lowPassFilter);
    } catch (error) {
      console.warn('AudioProcessor: Could not load noise gate worklet:', error);
    }
  }

  adjustSettings(settings: {
    noiseGateThreshold?: number;
    compressorThreshold?: number;
    highPassFreq?: number;
    lowPassFreq?: number;
  }) {
    const now = this.audioContext.currentTime;
    
    if (settings.compressorThreshold !== undefined) {
      this.compressor.threshold.setValueAtTime(settings.compressorThreshold, now);
    }
    
    if (settings.highPassFreq !== undefined) {
      this.highPassFilter.frequency.setValueAtTime(settings.highPassFreq, now);
    }
    
    if (settings.lowPassFreq !== undefined) {
      this.lowPassFilter.frequency.setValueAtTime(settings.lowPassFreq, now);
    }
    
    if (settings.noiseGateThreshold !== undefined && this.noiseGate) {
      this.noiseGate.parameters.get('threshold')?.setValueAtTime(settings.noiseGateThreshold, now);
    }
  }

  dispose() {
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    
    if (this.noiseGate) {
      this.noiseGate.disconnect();
      this.noiseGate = null;
    }
    
    this.compressor.disconnect();
    this.highPassFilter.disconnect();
    this.lowPassFilter.disconnect();
    
    this.outputStream = null;
  }
}
