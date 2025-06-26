
import React, { useEffect, useState, useCallback } from 'react';
import { useRoom } from './RoomContext';
import SimpleInstrument from './SimpleInstrument';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RoomInstrument: React.FC = () => {
  const { room, userInfo } = useRoom();
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  
  // Handle user interaction to enable audio context
  const handleUserInteraction = useCallback(async () => {
    setUserInteracted(true);
    setAudioError(null);
  }, []);

  const handleMicrophoneToggle = useCallback(async () => {
    try {
      if (!microphoneEnabled) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        setMediaStream(stream);
        setMicrophoneEnabled(true);
        console.log('RoomInstrument: Microphone enabled for room collaboration');
      } else {
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
          setMediaStream(null);
        }
        setMicrophoneEnabled(false);
        console.log('RoomInstrument: Microphone disabled');
      }
    } catch (error) {
      console.error('RoomInstrument: Error toggling microphone:', error);
      setAudioError('Failed to access microphone. Please check browser permissions.');
    }
  }, [microphoneEnabled, mediaStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);
  
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
      {/* Audio status and controls */}
      <div className="flex items-center justify-between gap-2 mb-2 text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-green-600">
            <Volume2 className="h-3 w-3" />
            <span>Audio Ready - System audio will be shared</span>
          </div>
        </div>
        
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
      </div>

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