
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

    // Check for truly active participants with more lenient criteria
    const activeParticipants = currentRoom.participants.filter((p: any) => {
      // Consider a participant active if:
      // 1. They have active status
      // 2. They are marked as in room
      // 3. They have recent heartbeat OR they joined recently (within 2 minutes)
      const heartbeatTime = p.heartbeatTimestamp || 0;
      const joinTime = p.joinedAt ? new Date(p.joinedAt).getTime() : 0;
      const now = Date.now();
      
      const hasRecentHeartbeat = (now - heartbeatTime) < 60000; // 1 minute
      const joinedRecently = (now - joinTime) < 120000; // 2 minutes
      
      return p.status === 'active' && 
             p.isInRoom !== false && 
             (hasRecentHeartbeat || joinedRecently);
    });

    console.log(`useRoomCleanup: Room ${roomId} has ${activeParticipants.length} truly active participants`);
    console.log('useRoomCleanup: Active participants:', activeParticipants.map(p => ({
      id: p.id,
      name: p.name,
      hasRecentHeartbeat: (Date.now() - (p.heartbeatTimestamp || 0)) < 60000,
      joinedRecently: (Date.now() - new Date(p.joinedAt || 0).getTime()) < 120000
    })));

    if (activeParticipants.length === 0) {
      console.log('useRoomCleanup: No truly active participants, scheduling destruction in 30 seconds');
      
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
      }, 30000); // Increased to 30 seconds to give more time
    } else {
      console.log(`useRoomCleanup: Room has ${activeParticipants.length} active participants, not destroying`);
    }
  }, [roomId, navigate, addNotification]);

  const clearDestruction = useCallback(() => {
    if (destructionTimeoutRef.current) {
      console.log('useRoomCleanup: Clearing scheduled destruction');
      clearTimeout(destructionTimeoutRef.current);
      destructionTimeoutRef.current = null;
    }
  }, []);

  return { scheduleRoomDestruction, clearDestruction };
};
