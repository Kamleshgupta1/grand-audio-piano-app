
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

  useEffect(() => {
    wasParticipantRef.current = wasParticipant;
  }, [wasParticipant]);

  useEffect(() => {
    if (!room || !user || hasBeenRemovedRef.current) return;

    const isCurrentlyParticipant = room.participants?.some((p: any) => p.id === user.uid);
    
    // If user was a participant but is no longer in the room, they were removed
    if (wasParticipantRef.current && !isCurrentlyParticipant && room.participants?.length > 0) {
      console.log('useUserRemovalDetection: User was removed from room, redirecting immediately...');
      
      hasBeenRemovedRef.current = true; // Prevent multiple redirections
      
      addNotification({
        title: "Removed from Room",
        message: "You have been removed from the room by the host",
        type: "warning"
      });
      
      // Immediate redirect
      navigate('/music-rooms', { replace: true });
    }
  }, [room, user, navigate, addNotification]);

  // Reset removal flag when room changes
  useEffect(() => {
    hasBeenRemovedRef.current = false;
  }, [room?.id]);
};
