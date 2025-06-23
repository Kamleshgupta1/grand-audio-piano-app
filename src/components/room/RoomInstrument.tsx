
import React from 'react';
import { useRoom } from './RoomContext';
import SimpleInstrument from './SimpleInstrument';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Music } from 'lucide-react';

const RoomInstrument: React.FC = () => {
  const { room, userInfo, remotePlaying, isLoading } = useRoom();
  
  console.log('RoomInstrument: Current state', { 
    hasRoom: !!room, 
    hasUserInfo: !!userInfo, 
    isLoading,
    userInfoId: userInfo?.id,
    roomId: room?.id 
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Room not found or failed to load.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are not a participant in this room. Please join the room first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const showRemotePlaying = remotePlaying && 
                           remotePlaying.userId !== userInfo.id && 
                           remotePlaying.userName;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Music className="h-5 w-5 text-purple-500" />
        <h3 className="font-semibold">Your Instrument: {userInfo.instrument}</h3>
      </div>

      {showRemotePlaying && (
        <div className="text-xs text-purple-600 animate-pulse mb-2 p-2 bg-purple-50 rounded">
          🎵 {remotePlaying.userName} is playing {remotePlaying.instrument}
        </div>
      )}

      <div className="flex-1">
        <SimpleInstrument type={userInfo.instrument} />
      </div>
    </div>
  );
};

export default RoomInstrument;
