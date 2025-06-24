
import { useState, useCallback, useRef, useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { playRealtimeNote, initializeRealtimeAudio } from '@/utils/audio/realtimeAudio';

interface InstrumentNote {
  note: string;
  instrument: string;
  userId: string;
  userName: string;
  timestamp?: string;
  velocity?: number;
  duration?: number;
  sessionId?: string;
  serverTimestamp?: number;
  clientId?: string;
  roomId?: string;
}

export const useRemoteNotePlayer = (roomId?: string, userId?: string) => {
  const [remotePlaying, setRemotePlaying] = useState<InstrumentNote | null>(null);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const { handleAsyncError } = useErrorHandler();
  
  const echoPreventionRef = useRef<Set<string>>(new Set());
  const mountedRef = useRef<boolean>(true);
  const audioInitializedRef = useRef<boolean>(false);

  // Initialize real-time audio on mount
  useEffect(() => {
    const initAudio = async () => {
      if (!audioInitializedRef.current) {
        try {
          await initializeRealtimeAudio();
          audioInitializedRef.current = true;
          console.log('useRemoteNotePlayer: Real-time audio initialized');
        } catch (error) {
          console.error('useRemoteNotePlayer: Failed to initialize audio:', error);
        }
      }
    };
    
    initAudio();
  }, []);

  const convertNoteToFrequency = useCallback((noteString: string): number => {
    const noteParts = noteString.split(':');
    if (noteParts.length < 2) {
      console.warn('useRemoteNotePlayer: Invalid note format:', noteString);
      return 440; // Default to A4
    }

    const [note, octave] = noteParts;
    const noteMap: { [key: string]: number } = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
      'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };

    const noteIndex = noteMap[note];
    if (noteIndex === undefined) {
      console.warn('useRemoteNotePlayer: Unknown note:', note);
      return 440;
    }

    const octaveNum = parseInt(octave, 10);
    if (isNaN(octaveNum)) {
      console.warn('useRemoteNotePlayer: Invalid octave:', octave);
      return 440;
    }

    // Calculate frequency using A4 = 440Hz as reference
    const A4 = 440;
    const A4_KEY = 69; // A4 is MIDI key 69
    const midiKey = (octaveNum + 1) * 12 + noteIndex;
    return A4 * Math.pow(2, (midiKey - A4_KEY) / 12);
  }, []);

  const playRemoteNote = useCallback(async (noteData: InstrumentNote) => {
    if (!mountedRef.current || !audioInitializedRef.current) return;
    
    try {
      console.log('useRemoteNotePlayer: Processing remote note:', noteData);
      
      if (!noteData?.note || typeof noteData.note !== 'string' || !noteData.instrument) {
        console.warn('useRemoteNotePlayer: Invalid note data', noteData);
        return;
      }

      const frequency = convertNoteToFrequency(noteData.note);
      const velocity = Math.min(Math.max(noteData.velocity || 0.7, 0.1), 1.0);
      const duration = Math.min(Math.max(noteData.duration || 500, 100), 3000);
      
      // Enhanced echo prevention
      const noteKey = `${noteData.userId}-${noteData.note}-${noteData.sessionId || 'default'}`;
      const timeKey = `${noteData.userId}-${noteData.note}-${Math.floor(Date.now() / 200)}`;
      
      if (echoPreventionRef.current.has(noteKey) || echoPreventionRef.current.has(timeKey)) {
        console.log('useRemoteNotePlayer: Preventing echo for note:', noteData.note);
        return;
      }
      
      echoPreventionRef.current.add(noteKey);
      echoPreventionRef.current.add(timeKey);
      setTimeout(() => {
        if (mountedRef.current) {
          echoPreventionRef.current.delete(noteKey);
          echoPreventionRef.current.delete(timeKey);
        }
      }, 300);

      const activeKey = `${noteData.note}-${noteData.userId}`;
      if (activeNotes.has(activeKey)) {
        console.log('useRemoteNotePlayer: Note already active, skipping:', activeKey);
        return;
      }

      // Use real-time audio system for better quality and synchronization
      const noteId = `${noteData.userId}-${noteData.note}-${Date.now()}`;
      await playRealtimeNote(
        noteId,
        frequency,
        noteData.instrument,
        noteData.userId,
        velocity,
        duration
      );

      if (mountedRef.current) {
        setActiveNotes(prev => new Set(prev).add(activeKey));
        setTimeout(() => {
          if (mountedRef.current) {
            setActiveNotes(prev => {
              const newSet = new Set(prev);
              newSet.delete(activeKey);
              return newSet;
            });
          }
        }, duration + 100);
      }

      console.log('useRemoteNotePlayer: Successfully played remote note with real-time audio');
    } catch (error) {
      console.error("useRemoteNotePlayer: Error playing remote note:", error);
      if (mountedRef.current) {
        handleAsyncError(error as Error, 'play remote note', userId || '', roomId || '');
      }
    }
  }, [handleAsyncError, activeNotes, roomId, userId, convertNoteToFrequency]);

  const setRemotePlayingWithCleanup = useCallback((noteData: InstrumentNote | null) => {
    if (!mountedRef.current) return;
    
    setRemotePlaying(noteData);
    if (noteData) {
      setTimeout(() => {
        if (mountedRef.current) {
          setRemotePlaying(null);
        }
      }, 300);
    }
  }, []);

  return {
    remotePlaying,
    activeNotes: Array.from(activeNotes),
    playRemoteNote,
    setRemotePlayingWithCleanup,
    mountedRef,
    echoPreventionRef
  };
};
