
import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { deleteRoomFromFirestore } from '@/utils/firebase';

export const useRoomCleanup = (roomId: string | undefined) => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const destructionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCleanupCheckRef = useRef<number>(0);

  const scheduleRoomDestruction = useCallback(async (currentRoom: any) => {
    if (!roomId || !currentRoom) return;

    // Prevent too frequent cleanup checks (minimum 30 seconds between checks)
    const now = Date.now();
    if (now - lastCleanupCheckRef.current < 30000) {
      console.log('useRoomCleanup: Skipping cleanup check - too frequent');
      return;
    }
    lastCleanupCheckRef.current = now;

    // Clear any existing timeout
    if (destructionTimeoutRef.current) {
      clearTimeout(destructionTimeoutRef.current);
      destructionTimeoutRef.current = null;
    }

    // Get the inactivity timeout from room settings
    const autoCloseEnabled = currentRoom.autoCloseAfterInactivity ?? false;
    const inactivityTimeoutMinutes = autoCloseEnabled 
      ? (currentRoom.inactivityTimeout || 2) 
      : 10; // Default 10 minutes if auto-close is disabled
    
    const inactivityTimeoutMs = inactivityTimeoutMinutes * 60 * 1000;

    // Enhanced active participant detection
    const activeParticipants = currentRoom.participants.filter((p: any) => {
      const heartbeatTime = p.heartbeatTimestamp || 0;
      const joinTime = p.joinedAt ? new Date(p.joinedAt).getTime() : 0;
      const currentTime = Date.now();
      
      // More lenient criteria for active participants
      const hasRecentHeartbeat = (currentTime - heartbeatTime) < 120000; // 2 minutes
      const joinedRecently = (currentTime - joinTime) < 300000; // 5 minutes
      const isActiveStatus = p.status === 'active';
      const isInRoom = p.isInRoom !== false;
      
      return isActiveStatus && isInRoom && (hasRecentHeartbeat || joinedRecently);
    });

    console.log(`useRoomCleanup: Room ${roomId} cleanup check:`);
    console.log(`- Total participants: ${currentRoom.participants.length}`);
    console.log(`- Active participants: ${activeParticipants.length}`);
    console.log(`- Auto-close enabled: ${autoCloseEnabled}`);
    console.log(`- Inactivity timeout: ${inactivityTimeoutMinutes} minutes`);

    if (activeParticipants.length === 0) {
      console.log(`useRoomCleanup: No active participants, scheduling destruction in ${inactivityTimeoutMinutes} minutes`);
      
      destructionTimeoutRef.current = setTimeout(async () => {
        try {
          console.log('useRoomCleanup: Executing room destruction due to inactivity');
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
      console.log(`useRoomCleanup: Room has ${activeParticipants.length} active participants, not scheduling destruction`);
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
