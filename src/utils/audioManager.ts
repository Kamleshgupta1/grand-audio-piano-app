
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
  private activeSamples: Map<string, HTMLAudioElement[]> = new Map();

  constructor() {
    this.initializeAudioContext();
    this.preloadSamples();
  }

  private async initializeAudioContext() {
    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }
      
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
      this.gainNode.gain.value = this.volume;

      await this.createAdvancedReverb();
    } catch (error) {
      console.warn('Web Audio API not supported, falling back to HTML5 audio');
    }
  }

  private async createAdvancedReverb() {
    if (!this.context) return;

    this.reverbNode = this.context.createConvolver();
    
    const length = this.context.sampleRate * 2.5;
    const impulse = this.context.createBuffer(2, length, this.context.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const n = length - i;
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
      const fileName = note.replace('#', 's'); // Convert C# to Cs for filename
      const audio = new Audio(`/audio/piano/${fileName}.mp3`);
      
      audio.preload = 'auto';
      audio.volume = this.volume;
      
      // Handle loading events
      audio.addEventListener('canplaythrough', () => {
        const sample = this.samples.get(note);
        if (sample) {
          sample.loaded = true;
        }
      });

      audio.addEventListener('error', () => {
        console.warn(`Failed to load audio sample for ${note}, falling back to synthesized sound`);
        // Fallback to synthesized sound if sample fails to load
      });
      
      this.samples.set(note, {
        note,
        frequency,
        audio,
        loaded: false
      });
    });
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
    if (this.recording) {
      this.recordingData.push({
        note,
        timestamp: Date.now() - this.recordingStartTime,
        velocity
      });
    }

    const sample = this.samples.get(note);
    if (!sample) return;

    try {
      // Clone the audio element to allow multiple simultaneous plays
      const audioClone = sample.audio.cloneNode() as HTMLAudioElement;
      audioClone.volume = velocity * this.volume;
      audioClone.currentTime = 0;
      
      // Store active samples for cleanup
      if (!this.activeSamples.has(note)) {
        this.activeSamples.set(note, []);
      }
      this.activeSamples.get(note)!.push(audioClone);
      
      // Play the sample
      const playPromise = audioClone.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Audio playback failed:', error);
          // Fallback to synthesized sound
          this.playSynthesizedNote(note, velocity);
        });
      }

      // Clean up when audio ends
      audioClone.addEventListener('ended', () => {
        const samples = this.activeSamples.get(note);
        if (samples) {
          const index = samples.indexOf(audioClone);
          if (index > -1) {
            samples.splice(index, 1);
          }
        }
      });

      if (this.sustainActive) {
        this.sustainedNotes.add(note);
      }

    } catch (error) {
      console.error('Error playing note:', error);
      this.playSynthesizedNote(note, velocity);
    }
  }

  private async playSynthesizedNote(note: string, velocity: number = 0.8): Promise<void> {
    if (!this.context) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    const filterNode = this.context.createBiquadFilter();
    
    const frequency = this.getFrequency(note);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(frequency * 4, this.context.currentTime);
    filterNode.Q.setValueAtTime(1.2, this.context.currentTime);
    
    gainNode.gain.setValueAtTime(0, this.context.currentTime);
    gainNode.gain.linearRampToValueAtTime(velocity * this.volume, this.context.currentTime + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(velocity * this.volume * 0.7, this.context.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 4);
    
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.gainNode!);
    
    oscillator.start();
    oscillator.stop(this.context.currentTime + 4);
  }

  stopNote(note: string): void {
    if (this.sustainActive && this.sustainedNotes.has(note)) {
      return;
    }
    
    const samples = this.activeSamples.get(note);
    if (samples) {
      samples.forEach(audio => {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
      this.activeSamples.set(note, []);
    }
  }

  setSustain(active: boolean): void {
    this.sustainActive = active;
    if (!active) {
      this.sustainedNotes.forEach(note => {
        this.stopNote(note);
      });
      this.sustainedNotes.clear();
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode && this.context) {
      this.gainNode.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.1);
    }
    
    // Update volume for all samples
    this.samples.forEach(sample => {
      sample.audio.volume = this.volume;
    });
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
