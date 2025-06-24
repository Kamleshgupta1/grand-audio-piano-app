
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

export const useUserRemovalDetection = (room: any, wasParticipant: boolean) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const wasParticipantRef = useRef(wasParticipant);

  useEffect(() => {
    wasParticipantRef.current = wasParticipant;
  }, [wasParticipant]);

  useEffect(() => {
    if (!room || !user) return;

    const isCurrentlyParticipant = room.participants?.some((p: any) => p.id === user.uid);
    
    // If user was a participant but is no longer in the room, they were removed
    if (wasParticipantRef.current && !isCurrentlyParticipant && room.participants?.length > 0) {
      console.log('useUserRemovalDetection: User was removed from room, redirecting...');
      
      addNotification({
        title: "Removed from Room",
        message: "You have been removed from the room by the host",
        type: "warning"
      });
      
      // Add a small delay to ensure the notification is seen
      setTimeout(() => {
        navigate('/music-rooms');
      }, 1500);
    }
  }, [room, user, navigate, addNotification]);
};
