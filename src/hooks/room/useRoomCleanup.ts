
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

    // Prevent too frequent cleanup checks (minimum 5 seconds between checks)
    const now = Date.now();
    if (now - lastCleanupCheckRef.current < 5000) {
      console.log('useRoomCleanup: Skipping cleanup check - too frequent');
      return;
    }
    lastCleanupCheckRef.current = now;

    // Clear any existing timeout
    if (destructionTimeoutRef.current) {
      clearTimeout(destructionTimeoutRef.current);
      destructionTimeoutRef.current = null;
    }

    // Get current participants and filter for truly active ones
    const participants = currentRoom.participants || [];
    const participantIds = currentRoom.participantIds || [];
    
    // Check for active participants more strictly
    const activeParticipants = participants.filter((p: any) => {
      if (!p.id || !participantIds.includes(p.id)) return false;
      
      // Consider participant active if:
      // 1. Status is active AND isInRoom is not false
      // 2. Has recent heartbeat (within 2 minutes) OR joined recently (within 1 minute)
      const isStatusActive = p.status === 'active' && p.isInRoom !== false;
      const heartbeatTime = p.heartbeatTimestamp || 0;
      const joinTime = p.joinedAt ? new Date(p.joinedAt).getTime() : 0;
      const currentTime = Date.now();
      
      const hasRecentHeartbeat = (currentTime - heartbeatTime) < 120000; // 2 minutes
      const joinedRecently = (currentTime - joinTime) < 60000; // 1 minute
      
      return isStatusActive && (hasRecentHeartbeat || joinedRecently);
    });

    console.log(`useRoomCleanup: Room ${roomId} cleanup analysis:`);
    console.log(`- Total participants: ${participants.length}`);
    console.log(`- Participant IDs: ${participantIds.length}`);
    console.log(`- Active participants: ${activeParticipants.length}`);

    // Only destroy if there are truly no active participants
    if (activeParticipants.length === 0 && participantIds.length === 0) {
      console.log('useRoomCleanup: No active participants detected, scheduling destruction in 10 seconds');
      
      destructionTimeoutRef.current = setTimeout(async () => {
        try {
          console.log('useRoomCleanup: Executing room destruction due to inactivity');
          await deleteRoomFromFirestore(roomId);
          navigate('/music-rooms');
          addNotification({
            title: "Room Closed",
            message: "Room was automatically closed as all participants have left",
            type: "info"
          });
        } catch (error) {
          console.error('useRoomCleanup: Error destroying empty room:', error);
        }
      }, 10000); // 10 seconds delay to allow for reconnections
    } else {
      console.log(`useRoomCleanup: Room has ${activeParticipants.length} active participants, not scheduling destruction`);
    }
  }, [roomId, navigate, addNotification]);

  const clearDestruction = useCallback(() => {
    if (destructionTimeoutRef.current) {
      console.log('useRoomCleanup: Clearing scheduled room destruction');
      clearTimeout(destructionTimeoutRef.current);
      destructionTimeoutRef.current = null;
    }
  }, []);

  return { scheduleRoomDestruction, clearDestruction };
};
