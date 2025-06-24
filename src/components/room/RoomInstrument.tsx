
import React, { useEffect, useState } from 'react';
import { useRoom } from './RoomContext';
import SimpleInstrument from './SimpleInstrument';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { initializeRealtimeAudio, setMasterVolume } from '@/utils/audio/realtimeAudio';

const RoomInstrument: React.FC = () => {
  const { room, userInfo, remotePlaying } = useRoom();
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  // Initialize audio on component mount
  useEffect(() => {
    const initAudio = async () => {
      try {
        console.log('RoomInstrument: Initializing audio for room collaboration');
        await initializeRealtimeAudio();
        setMasterVolume(0.8); // Set good volume for hearing others
        setAudioInitialized(true);
        setAudioError(null);
        console.log('RoomInstrument: Audio system ready');
      } catch (error) {
        console.error('RoomInstrument: Failed to initialize audio:', error);
        setAudioError('Failed to initialize audio system. Please check your browser permissions.');
      }
    };

    initAudio();
  }, []);

  // Handle user interaction to ensure audio context starts
  const handleUserInteraction = async () => {
    if (!audioInitialized) {
      try {
        await initializeRealtimeAudio();
        setAudioInitialized(true);
        setAudioError(null);
      } catch (error) {
        console.error('RoomInstrument: Failed to start audio on user interaction:', error);
      }
    }
  };
  
  if (!room || !userInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Loading instrument or connecting to room...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (audioError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive">
          <VolumeX className="h-4 w-4" />
          <AlertDescription>
            {audioError}
            <button 
              onClick={handleUserInteraction}
              className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry Audio
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const showRemotePlaying = remotePlaying && 
                           remotePlaying.userId !== userInfo.id && 
                           remotePlaying.userName;

  return (
    <div className="flex flex-col h-full" onClick={handleUserInteraction}>
      {/* Audio status indicator */}
      <div className="flex items-center gap-2 mb-2 text-xs">
        {audioInitialized ? (
          <div className="flex items-center gap-1 text-green-600">
            <Volume2 className="h-3 w-3" />
            <span>Audio Ready - You can hear others</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-orange-600">
            <VolumeX className="h-3 w-3" />
            <span>Click to enable audio</span>
          </div>
        )}
      </div>

      {showRemotePlaying && (
        <div className="text-xs text-purple-600 animate-pulse mt-1 flex items-center gap-1">
          <Volume2 className="h-3 w-3" />
          {remotePlaying.userName} is playing {remotePlaying.instrument}
        </div>
      )}

      <SimpleInstrument type={userInfo.instrument} />
    </div>
  );
};

export default RoomInstrument;
