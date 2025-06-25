
import React, { useEffect, useState, useCallback } from 'react';
import { useRoom } from './RoomContext';
import SimpleInstrument from './SimpleInstrument';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import SimpleRealtimeAudio from '@/utils/audio/simpleRealtimeAudio';
import { Button } from '@/components/ui/button';

const RoomInstrument: React.FC = () => {
  const { room, userInfo, remotePlaying } = useRoom();
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  
  // Initialize audio on component mount
  useEffect(() => {
    const initAudio = async () => {
      try {
        console.log('RoomInstrument: Initializing simplified audio system');
        const audioEngine = SimpleRealtimeAudio.getInstance();
        await audioEngine.initialize();
        setAudioInitialized(true);
        setAudioError(null);
        console.log('RoomInstrument: Audio system ready');
      } catch (error) {
        console.error('RoomInstrument: Failed to initialize audio:', error);
        setAudioError('Audio initialization failed. Please click to enable audio.');
      }
    };

    initAudio();
  }, []);

  // Handle user interaction to ensure audio context starts
  const handleUserInteraction = useCallback(async () => {
    setUserInteracted(true);
    if (!audioInitialized || audioError) {
      try {
        console.log('RoomInstrument: User interaction - initializing audio');
        const audioEngine = SimpleRealtimeAudio.getInstance();
        await audioEngine.initialize();
        setAudioInitialized(true);
        setAudioError(null);
      } catch (error) {
        console.error('RoomInstrument: Failed to start audio on user interaction:', error);
        setAudioError('Failed to enable audio. Please check browser permissions.');
      }
    }
  }, [audioInitialized, audioError]);

  const handleMicrophoneToggle = useCallback(async () => {
    try {
      const audioEngine = SimpleRealtimeAudio.getInstance();
      if (!microphoneEnabled) {
        const success = await audioEngine.enableMicrophone();
        setMicrophoneEnabled(success);
        if (success) {
          console.log('RoomInstrument: Microphone enabled for room collaboration');
        }
      } else {
        setMicrophoneEnabled(false);
        console.log('RoomInstrument: Microphone disabled');
      }
    } catch (error) {
      console.error('RoomInstrument: Error toggling microphone:', error);
    }
  }, [microphoneEnabled]);
  
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

  if (audioError && !userInteracted) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive">
          <VolumeX className="h-4 w-4" />
          <AlertDescription>
            {audioError}
            <Button 
              onClick={handleUserInteraction}
              className="ml-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Enable Audio
            </Button>
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
      {/* Audio status and controls */}
      <div className="flex items-center justify-between gap-2 mb-2 text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
        <div className="flex items-center gap-2">
          {audioInitialized ? (
            <div className="flex items-center gap-1 text-green-600">
              <Volume2 className="h-3 w-3" />
              <span>Audio Ready</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-orange-600">
              <VolumeX className="h-3 w-3" />
              <span>Click to enable audio</span>
            </div>
          )}
        </div>
        
        {audioInitialized && (
          <Button
            onClick={handleMicrophoneToggle}
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
          >
            {microphoneEnabled ? (
              <>
                <Mic className="h-3 w-3 mr-1" />
                Mic On
              </>
            ) : (
              <>
                <MicOff className="h-3 w-3 mr-1" />
                Enable Mic
              </>
            )}
          </Button>
        )}
      </div>

      {showRemotePlaying && (
        <div className="text-xs text-purple-600 animate-pulse mt-1 flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
          <Volume2 className="h-3 w-3" />
          {remotePlaying.userName} is playing {remotePlaying.instrument}
        </div>
      )}

      {microphoneEnabled && (
        <div className="text-xs text-blue-600 mb-2 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
          <Mic className="h-3 w-3" />
          Microphone active - others can hear your voice and system audio
        </div>
      )}

      <SimpleInstrument type={userInfo.instrument} />
    </div>
  );
};

export default RoomInstrument;
