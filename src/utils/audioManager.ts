
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
  private volume = 0.7;
  private recording = false;
  private recordingData: RecordingNote[] = [];
  private recordingStartTime = 0;

  constructor() {
    this.initializeAudioContext();
    this.preloadSamples();
  }

  private async initializeAudioContext() {
    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
      this.gainNode.gain.value = this.volume;

      // Create reverb
      await this.createReverb();
    } catch (error) {
      console.warn('Web Audio API not supported, falling back to HTML5 audio');
    }
  }

  private async createReverb() {
    if (!this.context) return;

    this.reverbNode = this.context.createConvolver();
    
    // Create artificial reverb impulse response
    const length = this.context.sampleRate * 2; // 2 seconds
    const impulse = this.context.createBuffer(2, length, this.context.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    
    this.reverbNode.buffer = impulse;
  }

  private preloadSamples() {
    const notes = [
      'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
      'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
      'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
      'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6'
    ];

    notes.forEach(note => {
      const frequency = this.getFrequency(note);
      // Create synthetic audio for each note using Web Audio API
      const audio = this.createSyntheticAudio(frequency);
      
      this.samples.set(note, {
        note,
        frequency,
        audio,
        loaded: true
      });
    });
  }

  private createSyntheticAudio(frequency: number): HTMLAudioElement {
    // Create a synthetic piano-like sound using Web Audio API
    if (!this.context) {
      // Fallback: create a simple audio element
      const audio = new Audio();
      audio.preload = 'auto';
      return audio;
    }

    // Generate audio buffer with piano-like harmonics
    const duration = 3; // 3 seconds
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      // Piano-like sound with harmonics and envelope
      const envelope = Math.exp(-t * 1.5); // Decay envelope
      
      let sample = 0;
      // Fundamental and harmonics
      sample += Math.sin(2 * Math.PI * frequency * t) * 0.5;
      sample += Math.sin(2 * Math.PI * frequency * 2 * t) * 0.25;
      sample += Math.sin(2 * Math.PI * frequency * 3 * t) * 0.125;
      sample += Math.sin(2 * Math.PI * frequency * 4 * t) * 0.0625;
      
      data[i] = sample * envelope * 0.3;
    }

    // Convert buffer to blob and create audio element
    const audioBuffer = buffer;
    const offlineContext = new OfflineAudioContext(1, audioBuffer.length, sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();

    return new Audio();
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

  async playNote(note: string, velocity: number = 1): Promise<void> {
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

    const sample = this.samples.get(note);
    if (!sample || !this.context) return;

    try {
      // Create oscillator for immediate playback
      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();
      
      oscillator.frequency.setValueAtTime(sample.frequency, this.context.currentTime);
      oscillator.type = 'triangle'; // Piano-like waveform
      
      // Create envelope
      gainNode.gain.setValueAtTime(0, this.context.currentTime);
      gainNode.gain.linearRampToValueAtTime(velocity * this.volume, this.context.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 2);
      
      oscillator.connect(gainNode);
      
      if (this.reverbNode) {
        const reverbGain = this.context.createGain();
        reverbGain.gain.value = 0.3;
        gainNode.connect(reverbGain);
        reverbGain.connect(this.reverbNode);
        this.reverbNode.connect(this.context.destination);
      }
      
      gainNode.connect(this.gainNode!);
      
      oscillator.start();
      oscillator.stop(this.context.currentTime + 2);

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
    
    // Note will naturally decay due to envelope
  }

  setSustain(active: boolean): void {
    this.sustainActive = active;
    if (!active) {
      this.sustainedNotes.clear();
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(this.volume, this.context!.currentTime);
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
