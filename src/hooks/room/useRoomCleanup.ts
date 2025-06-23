
import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { deleteRoomFromFirestore } from '@/utils/firebase';

export const useRoomCleanup = (roomId: string | undefined) => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const destructionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleRoomDestruction = useCallback(async (currentRoom: any) => {
    if (!roomId || !currentRoom) return;

    // Clear any existing timeout
    if (destructionTimeoutRef.current) {
      clearTimeout(destructionTimeoutRef.current);
      destructionTimeoutRef.current = null;
    }

    // Check for truly active participants (not just presence)
    const activeParticipants = currentRoom.participants.filter((p: any) => {
      // Consider a participant active if they have recent heartbeat (within last 30 seconds)
      const heartbeatTime = p.heartbeatTimestamp || 0;
      const now = Date.now();
      const isRecentlyActive = (now - heartbeatTime) < 30000; // 30 seconds
      
      return p.status === 'active' && p.isInRoom !== false && isRecentlyActive;
    });

    console.log(`useRoomCleanup: Room ${roomId} has ${activeParticipants.length} truly active participants`);

    if (activeParticipants.length === 0) {
      console.log('useRoomCleanup: No truly active participants, scheduling destruction');
      
      destructionTimeoutRef.current = setTimeout(async () => {
        try {
          console.log('useRoomCleanup: Executing room destruction');
          await deleteRoomFromFirestore(roomId);
          navigate('/music-rooms');
          addNotification({
            title: "Room Closed",
            message: "Room was closed due to inactivity",
            type: "info"
          });
        } catch (error) {
          console.error('useRoomCleanup: Error destroying empty room:', error);
        }
      }, 15000); // 15 second delay to prevent premature destruction
    }
  }, [roomId, navigate, addNotification]);

  const clearDestruction = useCallback(() => {
    if (destructionTimeoutRef.current) {
      clearTimeout(destructionTimeoutRef.current);
      destructionTimeoutRef.current = null;
    }
  }, []);

  return { scheduleRoomDestruction, clearDestruction };
};
