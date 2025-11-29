/**
 * AudioProcessor - Handles audio processing for live room audio sharing
 * Implements noise suppression, compression, and frequency filtering
 */

interface AudioProcessorConfig {
  noiseGateThreshold: number; // -50 to 0 dB
  compressionRatio: number; // 1 to 20
  lowCutFrequency: number; // Hz
  highCutFrequency: number; // Hz
  enableNoiseGate: boolean;
  enableCompression: boolean;
  enableFiltering: boolean;
}

class AudioProcessor {
  private audioContext: AudioContext;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private destinationStream: MediaStream | null = null;
  private config: AudioProcessorConfig;
  
  // Audio nodes
  private noiseGateNode: AudioWorkletNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private lowPassNode: BiquadFilterNode | null = null;
  private highPassNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  
  constructor(audioContext: AudioContext, config?: Partial<AudioProcessorConfig>) {
    this.audioContext = audioContext;
    this.config = {
      noiseGateThreshold: -40, // dB
      compressionRatio: 4,
      lowCutFrequency: 80, // Hz - cuts low rumble
      highCutFrequency: 12000, // Hz - keeps instrument range
      enableNoiseGate: true,
      enableCompression: true,
      enableFiltering: true,
      ...config
    };
  }

  async initialize(): Promise<void> {
    try {
      // Load audio worklet for noise gate
      if (this.config.enableNoiseGate) {
        try {
          await this.audioContext.audioWorklet.addModule('/audio-worklets/noise-gate-processor.js');
          console.log('AudioProcessor: Noise gate worklet loaded');
        } catch (error) {
          console.warn('AudioProcessor: Failed to load noise gate worklet, continuing without it:', error);
          this.config.enableNoiseGate = false;
        }
      }
    } catch (error) {
      console.error('AudioProcessor: Initialization error:', error);
      throw error;
    }
  }

  async processStream(inputStream: MediaStream): Promise<MediaStream> {
    try {
      console.log('AudioProcessor: Processing audio stream with config:', this.config);
      
      // Create source from input stream
      this.sourceNode = this.audioContext.createMediaStreamSource(inputStream);
      let currentNode: AudioNode = this.sourceNode;

      // 1. High-pass filter (remove low frequency rumble)
      if (this.config.enableFiltering) {
        this.highPassNode = this.audioContext.createBiquadFilter();
        this.highPassNode.type = 'highpass';
        this.highPassNode.frequency.value = this.config.lowCutFrequency;
        this.highPassNode.Q.value = 0.7;
        currentNode.connect(this.highPassNode);
        currentNode = this.highPassNode;
        console.log('AudioProcessor: High-pass filter enabled at', this.config.lowCutFrequency, 'Hz');
      }

      // 2. Noise gate (remove background noise)
      if (this.config.enableNoiseGate && this.audioContext.audioWorklet) {
        try {
          this.noiseGateNode = new AudioWorkletNode(this.audioContext, 'noise-gate-processor', {
            parameterData: {
              threshold: this.config.noiseGateThreshold
            }
          });
          currentNode.connect(this.noiseGateNode);
          currentNode = this.noiseGateNode;
          console.log('AudioProcessor: Noise gate enabled at', this.config.noiseGateThreshold, 'dB');
        } catch (error) {
          console.warn('AudioProcessor: Noise gate creation failed:', error);
        }
      }

      // 3. Compressor (smooth out dynamics)
      if (this.config.enableCompression) {
        this.compressorNode = this.audioContext.createDynamicsCompressor();
        this.compressorNode.threshold.value = -24;
        this.compressorNode.knee.value = 30;
        this.compressorNode.ratio.value = this.config.compressionRatio;
        this.compressorNode.attack.value = 0.003;
        this.compressorNode.release.value = 0.25;
        currentNode.connect(this.compressorNode);
        currentNode = this.compressorNode;
        console.log('AudioProcessor: Compressor enabled with ratio', this.config.compressionRatio);
      }

      // 4. Low-pass filter (remove high frequency hiss)
      if (this.config.enableFiltering) {
        this.lowPassNode = this.audioContext.createBiquadFilter();
        this.lowPassNode.type = 'lowpass';
        this.lowPassNode.frequency.value = this.config.highCutFrequency;
        this.lowPassNode.Q.value = 0.7;
        currentNode.connect(this.lowPassNode);
        currentNode = this.lowPassNode;
        console.log('AudioProcessor: Low-pass filter enabled at', this.config.highCutFrequency, 'Hz');
      }

      // 5. Gain control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1.0;
      currentNode.connect(this.gainNode);
      currentNode = this.gainNode;

      // Create destination stream
      const destinationNode = this.audioContext.createMediaStreamDestination();
      currentNode.connect(destinationNode);
      this.destinationStream = destinationNode.stream;

      console.log('AudioProcessor: Stream processing pipeline created successfully');
      return this.destinationStream;
      
    } catch (error) {
      console.error('AudioProcessor: Error processing stream:', error);
      throw error;
    }
  }

  updateConfig(newConfig: Partial<AudioProcessorConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Update active filters
    if (this.highPassNode && this.config.enableFiltering) {
      this.highPassNode.frequency.value = this.config.lowCutFrequency;
    }
    
    if (this.lowPassNode && this.config.enableFiltering) {
      this.lowPassNode.frequency.value = this.config.highCutFrequency;
    }
    
    if (this.compressorNode && this.config.enableCompression) {
      this.compressorNode.ratio.value = this.config.compressionRatio;
    }
    
    if (this.noiseGateNode && this.config.enableNoiseGate) {
      const thresholdParam = this.noiseGateNode.parameters.get('threshold');
      if (thresholdParam) {
        thresholdParam.value = this.config.noiseGateThreshold;
      }
    }
    
    console.log('AudioProcessor: Config updated:', this.config);
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(2, volume));
    }
  }

  getConfig(): AudioProcessorConfig {
    return { ...this.config };
  }

  dispose(): void {
    console.log('AudioProcessor: Disposing audio nodes');
    
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    
    if (this.noiseGateNode) {
      this.noiseGateNode.disconnect();
      this.noiseGateNode = null;
    }
    
    if (this.compressorNode) {
      this.compressorNode.disconnect();
      this.compressorNode = null;
    }
    
    if (this.highPassNode) {
      this.highPassNode.disconnect();
      this.highPassNode = null;
    }
    
    if (this.lowPassNode) {
      this.lowPassNode.disconnect();
      this.lowPassNode = null;
    }
    
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    
    this.destinationStream = null;
  }
}

export default AudioProcessor;
export type { AudioProcessorConfig };
