
import React, { useEffect, useState, useCallback } from 'react';
import { useRoom } from './RoomContext';
import SimpleInstrument from './SimpleInstrument';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SystemAudioShare from '@/utils/audio/systemAudioShare';

const RoomInstrument: React.FC = () => {
  const { room, userInfo } = useRoom();
  const [isAudioSharing, setIsAudioSharing] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const audioShare = SystemAudioShare.getInstance();

  // Handle user interaction to enable audio context
  const handleUserInteraction = useCallback(async () => {
    if (!userInteracted) {
      setUserInteracted(true);
      setAudioError(null);
      
      // Initialize system audio
      const initialized = await audioShare.initializeSystemAudio();
      if (!initialized) {
        setAudioError('Failed to initialize audio system');
      }
    }
  }, [userInteracted, audioShare]);

  const handleAudioToggle = useCallback(async () => {
    try {
      if (!isAudioSharing) {
        const success = await audioShare.startSystemAudioSharing();
        if (success) {
          setIsAudioSharing(true);
          setAudioError(null);
          console.log('RoomInstrument: System audio sharing enabled');
        } else {
          setAudioError('Failed to start audio sharing. Please allow microphone/system audio access.');
        }
      } else {
        audioShare.stopSystemAudioSharing();
        setIsAudioSharing(false);
        setAudioLevel(0);
        console.log('RoomInstrument: System audio sharing disabled');
      }
    } catch (error) {
      console.error('RoomInstrument: Error toggling audio sharing:', error);
      setAudioError('Audio sharing failed. Please check browser permissions.');
      setIsAudioSharing(false);
    }
  }, [isAudioSharing, audioShare]);

  // Monitor audio level when sharing
  useEffect(() => {
    if (!isAudioSharing) return;

    const interval = setInterval(() => {
      const level = audioShare.getAudioLevel();
      setAudioLevel(level);
    }, 100);

    return () => clearInterval(interval);
  }, [isAudioSharing, audioShare]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioShare.stopSystemAudioSharing();
    };
  }, [audioShare]);
  
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

  return (
    <div className="flex flex-col h-full" onClick={handleUserInteraction}>
      {/* Audio sharing controls */}
      <div className="flex items-center justify-between gap-2 mb-2 text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 ${isAudioSharing ? 'text-green-600' : 'text-gray-500'}`}>
            <Volume2 className="h-3 w-3" />
            <span>{isAudioSharing ? 'Audio Sharing Active' : 'Audio Ready'}</span>
            {isAudioSharing && (
              <div className="flex items-center gap-1 ml-2">
                <div className="h-2 w-8 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-100"
                    style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Button
          onClick={handleAudioToggle}
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
        >
          {isAudioSharing ? (
            <>
              <Mic className="h-3 w-3 mr-1" />
              Stop Sharing
            </>
          ) : (
            <>
              <MicOff className="h-3 w-3 mr-1" />
              Share Audio
            </>
          )}
        </Button>
      </div>

      {isAudioSharing && (
        <div className="text-xs text-blue-600 mb-2 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
          <Mic className="h-3 w-3" />
          Your audio is being shared - others can hear your instrument sounds
        </div>
      )}

      <SimpleInstrument type={userInfo.instrument} />
    </div>
  );
};

export default RoomInstrument;
