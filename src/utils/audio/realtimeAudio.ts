
// Real-time audio system for live music collaboration
let audioContext: AudioContext | null = null;
let masterGainNode: GainNode | null = null;
let isInitialized = false;

// Active oscillators for note management
const activeOscillators = new Map<string, { oscillator: OscillatorNode; gainNode: GainNode; startTime: number }>();

export const initializeRealtimeAudio = async (): Promise<void> => {
  if (isInitialized && audioContext && audioContext.state !== 'closed') {
    console.log('realtimeAudio: Audio already initialized');
    return;
  }

  try {
    console.log('realtimeAudio: Initializing audio context');
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Resume audio context if suspended
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Create master gain node
    masterGainNode = audioContext.createGain();
    masterGainNode.connect(audioContext.destination);
    masterGainNode.gain.setValueAtTime(0.7, audioContext.currentTime);

    isInitialized = true;
    console.log('realtimeAudio: Audio system initialized successfully');
  } catch (error) {
    console.error('realtimeAudio: Failed to initialize audio:', error);
    throw error;
  }
};

export const setMasterVolume = (volume: number): void => {
  if (masterGainNode && audioContext) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    masterGainNode.gain.setTargetAtTime(clampedVolume, audioContext.currentTime, 0.1);
    console.log(`realtimeAudio: Master volume set to ${clampedVolume}`);
  }
};

export const playRealtimeNote = async (
  noteId: string,
  frequency: number,
  instrument: string,
  userId: string,
  velocity: number = 0.7,
  duration: number = 500
): Promise<void> => {
  if (!audioContext || !masterGainNode) {
    console.warn('realtimeAudio: Audio not initialized, attempting to initialize');
    await initializeRealtimeAudio();
    if (!audioContext || !masterGainNode) {
      throw new Error('Failed to initialize audio context');
    }
  }

  try {
    // Stop any existing note with the same ID
    stopRealtimeNote(noteId);

    console.log(`realtimeAudio: Playing note ${noteId} at ${frequency}Hz for ${userId}`);

    // Create oscillator and gain nodes
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();

    // Configure oscillator based on instrument
    const instrumentConfig = getInstrumentConfig(instrument);
    oscillator.type = instrumentConfig.waveform;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Configure filter for instrument character
    filterNode.type = instrumentConfig.filterType;
    filterNode.frequency.setValueAtTime(instrumentConfig.filterFreq, audioContext.currentTime);
    filterNode.Q.setValueAtTime(instrumentConfig.filterQ, audioContext.currentTime);

    // Configure gain with ADSR envelope
    const adjustedVelocity = Math.max(0.1, Math.min(1, velocity)) * instrumentConfig.baseVolume;
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);

    // Attack
    gainNode.gain.linearRampToValueAtTime(
      adjustedVelocity,
      audioContext.currentTime + instrumentConfig.attack
    );

    // Decay to sustain
    gainNode.gain.exponentialRampToValueAtTime(
      adjustedVelocity * instrumentConfig.sustain,
      audioContext.currentTime + instrumentConfig.attack + instrumentConfig.decay
    );

    // Connect audio nodes
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(masterGainNode);

    // Start oscillator
    oscillator.start(audioContext.currentTime);

    // Store active oscillator
    activeOscillators.set(noteId, {
      oscillator,
      gainNode,
      startTime: audioContext.currentTime
    });

    // Schedule note stop
    setTimeout(() => {
      stopRealtimeNote(noteId);
    }, duration);

  } catch (error) {
    console.error('realtimeAudio: Error playing note:', error);
    throw error;
  }
};

export const stopRealtimeNote = (noteId: string): void => {
  const activeNote = activeOscillators.get(noteId);
  if (activeNote && audioContext) {
    try {
      const { oscillator, gainNode } = activeNote;
      
      // Quick fade out to prevent clicks
      gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.05);
      
      // Stop oscillator after fade
      setTimeout(() => {
        try {
          oscillator.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      }, 100);

      activeOscillators.delete(noteId);
    } catch (error) {
      console.warn('realtimeAudio: Error stopping note:', error);
      activeOscillators.delete(noteId);
    }
  }
};

// Instrument-specific audio configurations
const getInstrumentConfig = (instrument: string) => {
  const configs: { [key: string]: any } = {
    piano: {
      waveform: 'triangle' as OscillatorType,
      filterType: 'lowpass' as BiquadFilterType,
      filterFreq: 2000,
      filterQ: 1,
      attack: 0.01,
      decay: 0.3,
      sustain: 0.8,
      release: 1.0,
      baseVolume: 0.6
    },
    guitar: {
      waveform: 'sawtooth' as OscillatorType,
      filterType: 'bandpass' as BiquadFilterType,
      filterFreq: 1500,
      filterQ: 2,
      attack: 0.05,
      decay: 0.2,
      sustain: 0.6,
      release: 2.0,
      baseVolume: 0.5
    },
    violin: {
      waveform: 'sawtooth' as OscillatorType,
      filterType: 'highpass' as BiquadFilterType,
      filterFreq: 800,
      filterQ: 1.5,
      attack: 0.1,
      decay: 0.1,
      sustain: 0.9,
      release: 1.5,
      baseVolume: 0.4
    },
    flute: {
      waveform: 'sine' as OscillatorType,
      filterType: 'lowpass' as BiquadFilterType,
      filterFreq: 3000,
      filterQ: 0.5,
      attack: 0.05,
      decay: 0.1,
      sustain: 0.7,
      release: 1.0,
      baseVolume: 0.5
    },
    drums: {
      waveform: 'triangle' as OscillatorType,
      filterType: 'lowpass' as BiquadFilterType,
      filterFreq: 500,
      filterQ: 3,
      attack: 0.001,
      decay: 0.1,
      sustain: 0.1,
      release: 0.5,
      baseVolume: 0.8
    }
  };

  return configs[instrument.toLowerCase()] || configs.piano;
};

// Cleanup function
export const cleanupRealtimeAudio = (): void => {
  console.log('realtimeAudio: Cleaning up audio system');
  
  // Stop all active notes
  activeOscillators.forEach((_, noteId) => stopRealtimeNote(noteId));
  activeOscillators.clear();

  // Close audio context
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close();
  }

  audioContext = null;
  masterGainNode = null;
  isInitialized = false;
};

// Get audio context state for debugging
export const getAudioState = () => ({
  isInitialized,
  contextState: audioContext?.state,
  activeNotes: activeOscillators.size
});
