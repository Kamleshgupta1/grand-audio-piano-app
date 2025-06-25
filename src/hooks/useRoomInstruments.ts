
import { useCallback, useEffect, useRef } from 'react';
import { useInstrumentBroadcast } from './rooms/useInstrumentBroadcast';
import { useRemoteNotePlayer } from './rooms/useRemoteNotePlayer';
import { useInstrumentListener } from './rooms/useInstrumentListener';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ToneAudioEngine from '@/utils/audio/toneAudioEngine';
import { InstrumentNote } from '@/types/InstrumentNote';

export const useRoomInstruments = (
  room: any, 
  setLastActivityTime: (time: number) => void, 
  updateInstrumentPlayTime: () => void
) => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  
  const audioInitializedRef = useRef<boolean>(false);

  const {
    remotePlaying,
    activeNotes,
    playRemoteNote,
    setRemotePlayingWithCleanup,
    mountedRef,
    echoPreventionRef
  } = useRemoteNotePlayer(roomId, user?.uid);

  const { broadcastInstrumentNote } = useInstrumentBroadcast(room, setLastActivityTime);

  // Initialize Tone.js audio system when component mounts
  useEffect(() => {
    const initAudio = async () => {
      if (!audioInitializedRef.current) {
        try {
          console.log('useRoomInstruments: Initializing Tone.js audio system');
          const audioEngine = ToneAudioEngine.getInstance();
          await audioEngine.initialize();
          audioEngine.setMasterVolume(0.8);
          
          audioInitializedRef.current = true;
          console.log('useRoomInstruments: Tone.js audio system ready for collaboration');
        } catch (error) {
          console.error('useRoomInstruments: Failed to initialize Tone.js audio system:', error);
        }
      }
    };

    initAudio();
  }, []);

  useInstrumentListener(
    playRemoteNote,
    setRemotePlayingWithCleanup,
    updateInstrumentPlayTime,
    mountedRef
  );

  // Periodic cleanup of echo prevention cache
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      if (mountedRef.current && echoPreventionRef.current.size > 100) {
        console.log('useRoomInstruments: Cleaning echo prevention cache');
        echoPreventionRef.current.clear();
      }
    }, 30000);

    return () => clearInterval(cleanupInterval);
  }, [mountedRef, echoPreventionRef]);

  // Enhanced broadcast function with audio initialization check
  const enhancedBroadcastNote = useCallback(async (note: InstrumentNote): Promise<void> => {
    // Ensure audio is initialized before broadcasting
    if (!audioInitializedRef.current) {
      try {
        const audioEngine = ToneAudioEngine.getInstance();
        await audioEngine.initialize();
        audioInitializedRef.current = true;
      } catch (error) {
        console.error('useRoomInstruments: Failed to initialize audio before broadcast:', error);
      }
    }

    await broadcastInstrumentNote(note);
  }, [broadcastInstrumentNote]);

  return {
    remotePlaying,
    broadcastInstrumentNote: enhancedBroadcastNote,
    activeNotes,
    audioInitialized: audioInitializedRef.current
  };
};
