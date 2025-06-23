
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { joinRoomWithCode, requestToJoinRoom } from '@/utils/firebase/room-joining';
import { listenToRoomData } from '@/utils/firebase/rooms';

export const useRoomJoin = (roomId: string | undefined) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [roomExists, setRoomExists] = useState<boolean | null>(null);
  const [hasAttemptedJoin, setHasAttemptedJoin] = useState(false);

  console.log(`useRoomJoin: Hook initialized for room ${roomId}, user: ${user?.uid}`);

  const attemptJoin = async (joinCode?: string) => {
    if (!roomId || !user || isJoining) {
      console.log(`useRoomJoin: Cannot join - roomId: ${roomId}, user: ${!!user}, isJoining: ${isJoining}`);
      return false;
    }

    console.log(`useRoomJoin: Starting join attempt for room ${roomId} with user ${user.uid}`);
    setIsJoining(true);
    setJoinError(null);

    try {
      const joinSuccess = await joinRoomWithCode(roomId, user, joinCode);
      
      if (joinSuccess) {
        console.log(`useRoomJoin: Successfully joined room ${roomId}`);
        setIsJoining(false);
        setHasAttemptedJoin(true);
        return true;
      } else {
        console.error('useRoomJoin: Failed to join room');
        setJoinError("Failed to join room");
        setIsJoining(false);
        return false;
      }
    } catch (error) {
      console.error('useRoomJoin: Error joining room:', error);
      setJoinError("Failed to access room");
      setIsJoining(false);
      return false;
    }
  };

  const requestJoin = async (joinCode?: string) => {
    if (!roomId || !user) {
      console.log('useRoomJoin: Cannot request join - missing roomId or user');
      return;
    }

    console.log(`useRoomJoin: Requesting to join room ${roomId} with user ${user.uid}`);

    try {
      if (joinCode) {
        console.log(`useRoomJoin: Requesting join with code`);
        await joinRoomWithCode(roomId, user, joinCode);
      } else {
        console.log(`useRoomJoin: Sending join request to host`);
        await requestToJoinRoom(roomId, user.uid);
      }
    } catch (error) {
      console.error("useRoomJoin: Error requesting to join:", error);
      addNotification({
        title: "Error",
        message: "Failed to process join request",
        type: "error"
      });
    }
  };

  // Auto-attempt join when room ID and user are available
  useEffect(() => {
    if (!roomId || !user || hasAttemptedJoin) {
      console.log(`useRoomJoin: Skipping auto-join - roomId: ${roomId}, user: ${!!user}, hasAttempted: ${hasAttemptedJoin}`);
      return;
    }

    console.log(`useRoomJoin: Setting up auto-join for room ${roomId}`);

    const handleAutoJoin = async () => {
      // Listen to room data to check if it exists
      const unsubscribe = listenToRoomData(
        roomId,
        async (roomData) => {
          console.log('useRoomJoin: Room data received, room exists');
          setRoomExists(true);
          
          // Check if user is already a participant
          const isAlreadyParticipant = roomData.participantIds?.includes(user.uid);
          
          if (isAlreadyParticipant) {
            console.log('useRoomJoin: User is already a participant');
            setIsJoining(false);
            setHasAttemptedJoin(true);
            unsubscribe();
            return;
          }
          
          // Attempt to join if not already a participant
          console.log('useRoomJoin: Attempting auto-join');
          const joinResult = await attemptJoin();
          
          if (joinResult) {
            unsubscribe();
          }
        },
        (error) => {
          console.error('useRoomJoin: Error getting room data:', error);
          setRoomExists(false);
          setJoinError("Room not found");
          setIsJoining(false);
          navigate('/music-rooms');
        }
      );
    };

    handleAutoJoin();
  }, [roomId, user?.uid, hasAttemptedJoin]);

  return {
    isJoining,
    joinError,
    roomExists,
    attemptJoin,
    requestJoin
  };
};
