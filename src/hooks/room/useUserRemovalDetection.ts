
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

export const useUserRemovalDetection = (room: any, wasParticipant: boolean) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const wasParticipantRef = useRef(wasParticipant);
  const hasBeenRemovedRef = useRef(false);
  const roomIdRef = useRef(room?.id);

  // Update refs when values change
  useEffect(() => {
    wasParticipantRef.current = wasParticipant;
  }, [wasParticipant]);

  useEffect(() => {
    if (room?.id !== roomIdRef.current) {
      roomIdRef.current = room?.id;
      hasBeenRemovedRef.current = false; // Reset for new room
    }
  }, [room?.id]);

  useEffect(() => {
    if (!room || !user || hasBeenRemovedRef.current) return;

    const isCurrentlyParticipant = room.participants?.some((p: any) => p.id === user.uid);
    
    console.log('useUserRemovalDetection: Checking removal status:', {
      userId: user.uid,
      wasParticipant: wasParticipantRef.current,
      isCurrentlyParticipant,
      participantCount: room.participants?.length || 0,
      hasBeenRemoved: hasBeenRemovedRef.current
    });
    
    // If user was a participant but is no longer in the room, they were removed
    if (wasParticipantRef.current && !isCurrentlyParticipant && room.participants?.length > 0) {
      console.log('useUserRemovalDetection: User was removed from room, redirecting...');
      
      hasBeenRemovedRef.current = true; // Prevent multiple redirections
      
      addNotification({
        title: "Removed from Room",
        message: "You have been removed from the room by the host",
        type: "warning"
      });
      
      // Use setTimeout to ensure state updates complete before navigation
      setTimeout(() => {
        navigate('/music-rooms', { replace: true });
      }, 100);
    }
  }, [room, user, navigate, addNotification]);

  // Reset removal flag when room changes
  useEffect(() => {
    if (room?.id && room.id !== roomIdRef.current) {
      hasBeenRemovedRef.current = false;
    }
  }, [room?.id]);
};
