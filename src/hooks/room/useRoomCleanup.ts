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

    // Get the inactivity timeout from room settings (default 2 minutes if auto-close enabled, 10 minutes if disabled)
    const inactivityTimeoutMinutes = currentRoom.autoCloseAfterInactivity 
      ? (currentRoom.inactivityTimeout || 2) 
      : 10;
    
    const inactivityTimeoutMs = inactivityTimeoutMinutes * 60 * 1000;

    // Check for truly active participants with more lenient criteria
    const activeParticipants = currentRoom.participants.filter((p: any) => {
      const heartbeatTime = p.heartbeatTimestamp || 0;
      const joinTime = p.joinedAt ? new Date(p.joinedAt).getTime() : 0;
      const now = Date.now();
      
      const hasRecentHeartbeat = (now - heartbeatTime) < 90000; // 1.5 minutes
      const joinedRecently = (now - joinTime) < 180000; // 3 minutes
      
      return p.status === 'active' && 
             p.isInRoom !== false && 
             (hasRecentHeartbeat || joinedRecently);
    });

    console.log(`useRoomCleanup: Room ${roomId} has ${activeParticipants.length} truly active participants`);
    console.log(`useRoomCleanup: Inactivity timeout set to ${inactivityTimeoutMinutes} minutes`);

    if (activeParticipants.length === 0) {
      console.log(`useRoomCleanup: No truly active participants, scheduling destruction in ${inactivityTimeoutMinutes} minutes`);
      
      destructionTimeoutRef.current = setTimeout(async () => {
        try {
          console.log('useRoomCleanup: Executing room destruction');
          await deleteRoomFromFirestore(roomId);
          navigate('/music-rooms');
          addNotification({
            title: "Room Closed",
            message: `Room was closed due to ${inactivityTimeoutMinutes} minutes of inactivity`,
            type: "info"
          });
        } catch (error) {
          console.error('useRoomCleanup: Error destroying empty room:', error);
        }
      }, inactivityTimeoutMs);
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
