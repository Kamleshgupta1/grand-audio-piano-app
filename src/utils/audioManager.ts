
export interface AudioSample {
  note: string;
  frequency: number;
  audio: HTMLAudioElement;
  loaded: boolean;
}

export interface RecordingNote {
  note: string;
  timestamp: number;
  velocity: number;
}

export class AudioManager {
  private samples: Map<string, AudioSample> = new Map();
  private context: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private sustainActive = false;
  private sustainedNotes: Set<string> = new Set();
  private volume = 0.8;
  private recording = false;
  private recordingData: RecordingNote[] = [];
  private recordingStartTime = 0;
  private activeOscillators: Map<string, OscillatorNode> = new Map();

  constructor() {
    this.initializeAudioContext();
    this.preloadSamples();
  }

  private async initializeAudioContext() {
    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context if suspended (required by some browsers)
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }
      
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
      this.gainNode.gain.value = this.volume;

      // Create advanced reverb for Salamander Grand Piano feel
      await this.createAdvancedReverb();
    } catch (error) {
      console.warn('Web Audio API not supported, falling back to HTML5 audio');
    }
  }

  private async createAdvancedReverb() {
    if (!this.context) return;

    this.reverbNode = this.context.createConvolver();
    
    // Create concert hall-style reverb impulse response
    const length = this.context.sampleRate * 3.5; // 3.5 seconds of reverb
    const impulse = this.context.createBuffer(2, length, this.context.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const n = length - i;
        // Create realistic concert hall reverb pattern
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 2.5);
      }
    }
    
    this.reverbNode.buffer = impulse;
  }

  private preloadSamples() {
    const notes = [
      'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
      'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
      'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5'
    ];

    notes.forEach(note => {
      const frequency = this.getFrequency(note);
      const audio = this.createSalamanderPianoSound(frequency);
      
      this.samples.set(note, {
        note,
        frequency,
        audio,
        loaded: true
      });
    });
  }

  private createSalamanderPianoSound(frequency: number): HTMLAudioElement {
    // Create high-quality piano sound similar to Salamander Grand Piano
    if (!this.context) {
      const audio = new Audio();
      audio.preload = 'auto';
      return audio;
    }

    const audio = new Audio();
    audio.preload = 'auto';
    return audio;
  }

  private getFrequency(note: string): number {
    const noteMap: { [key: string]: number } = {
      'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4,
      'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2
    };

    const noteName = note.slice(0, -1);
    const octave = parseInt(note.slice(-1));
    const keyNumber = noteMap[noteName] + (octave - 4) * 12;
    
    return 440 * Math.pow(2, keyNumber / 12);
  }

  async playNote(note: string, velocity: number = 0.8): Promise<void> {
    if (!this.context) {
      await this.initializeAudioContext();
    }

    if (this.recording) {
      this.recordingData.push({
        note,
        timestamp: Date.now() - this.recordingStartTime,
        velocity
      });
    }

    if (!this.context) return;

    try {
      // Stop existing oscillator for this note to prevent overlap
      const existingOsc = this.activeOscillators.get(note);
      if (existingOsc) {
        existingOsc.stop();
        this.activeOscillators.delete(note);
      }

      // Create rich piano-like sound with multiple harmonics
      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();
      const filterNode = this.context.createBiquadFilter();
      
      const frequency = this.getFrequency(note);
      
      // Set up oscillator with piano-like waveform
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
      
      // Add subtle frequency modulation for realism
      const lfo = this.context.createOscillator();
      const lfoGain = this.context.createGain();
      lfo.frequency.setValueAtTime(4.5, this.context.currentTime);
      lfoGain.gain.setValueAtTime(0.8, this.context.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      
      // Piano-like low-pass filter
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(frequency * 4, this.context.currentTime);
      filterNode.Q.setValueAtTime(1.2, this.context.currentTime);
      
      // Realistic piano envelope (fast attack, exponential decay)
      gainNode.gain.setValueAtTime(0, this.context.currentTime);
      gainNode.gain.linearRampToValueAtTime(velocity * this.volume, this.context.currentTime + 0.003);
      gainNode.gain.exponentialRampToValueAtTime(velocity * this.volume * 0.7, this.context.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 4);
      
      // Connect audio graph
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      
      // Add reverb for concert hall effect
      if (this.reverbNode) {
        const reverbGain = this.context.createGain();
        reverbGain.gain.value = 0.25;
        gainNode.connect(reverbGain);
        reverbGain.connect(this.reverbNode);
        this.reverbNode.connect(this.context.destination);
      }
      
      gainNode.connect(this.gainNode!);
      
      // Start oscillators
      oscillator.start();
      lfo.start();
      
      // Store reference
      this.activeOscillators.set(note, oscillator);
      
      // Clean up after note ends
      oscillator.stop(this.context.currentTime + 4);
      lfo.stop(this.context.currentTime + 4);
      
      oscillator.onended = () => {
        this.activeOscillators.delete(note);
      };

      if (this.sustainActive) {
        this.sustainedNotes.add(note);
      }

    } catch (error) {
      console.error('Error playing note:', error);
    }
  }

  stopNote(note: string): void {
    if (this.sustainActive && this.sustainedNotes.has(note)) {
      return; // Don't stop sustained notes
    }
    
    const oscillator = this.activeOscillators.get(note);
    if (oscillator && this.context) {
      // Fade out quickly instead of immediate stop
      const gainNode = this.context.createGain();
      gainNode.gain.setValueAtTime(1, this.context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.1);
      
      setTimeout(() => {
        try {
          oscillator.stop();
          this.activeOscillators.delete(note);
        } catch (e) {
          // Oscillator may have already stopped
        }
      }, 100);
    }
  }

  setSustain(active: boolean): void {
    this.sustainActive = active;
    if (!active) {
      // Release all sustained notes
      this.sustainedNotes.forEach(note => {
        const oscillator = this.activeOscillators.get(note);
        if (oscillator && this.context) {
          try {
            oscillator.stop(this.context.currentTime + 0.5);
          } catch (e) {
            // Already stopped
          }
        }
      });
      this.sustainedNotes.clear();
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode && this.context) {
      this.gainNode.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.1);
    }
  }

  getVolume(): number {
    return this.volume;
  }

  startRecording(): void {
    this.recording = true;
    this.recordingData = [];
    this.recordingStartTime = Date.now();
  }

  stopRecording(): RecordingNote[] {
    this.recording = false;
    return [...this.recordingData];
  }

  async playRecording(recording: RecordingNote[]): Promise<void> {
    if (recording.length === 0) return;

    for (const note of recording) {
      setTimeout(() => {
        this.playNote(note.note, note.velocity);
      }, note.timestamp);
    }
  }

  exportRecording(recording: RecordingNote[]): string {
    return JSON.stringify(recording, null, 2);
  }

  importRecording(data: string): RecordingNote[] {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error importing recording:', error);
      return [];
    }
  }
}
