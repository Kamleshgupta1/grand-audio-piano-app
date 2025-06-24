
import { useCallback, useEffect, useRef } from 'react';
import { useInstrumentBroadcast } from './rooms/useInstrumentBroadcast';
import { useRemoteNotePlayer } from './rooms/useRemoteNotePlayer';
import { useInstrumentListener } from './rooms/useInstrumentListener';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { initializeRealtimeAudio, setMasterVolume } from '@/utils/audio/realtimeAudio';

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

  // Initialize audio system when component mounts
  useEffect(() => {
    const initAudio = async () => {
      if (!audioInitializedRef.current) {
        try {
          console.log('useRoomInstruments: Initializing real-time audio system');
          await initializeRealtimeAudio();
          
          // Set appropriate volume for room collaboration
          setMasterVolume(0.7);
          
          audioInitializedRef.current = true;
          console.log('useRoomInstruments: Audio system ready for collaboration');
        } catch (error) {
          console.error('useRoomInstruments: Failed to initialize audio system:', error);
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
        await initializeRealtimeAudio();
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
