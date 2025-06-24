
import { useEffect, useCallback } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getDatabase, ref, onDisconnect, set, onValue, serverTimestamp } from 'firebase/database';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/utils/firebase/config';

export const useRoomPresence = (roomId: string | undefined, isParticipant: boolean) => {
  const { user } = useAuth();

  const updateFirestorePresence = useCallback(async (isOnline: boolean) => {
    if (!roomId || !user || !isParticipant) return;

    try {
      const roomRef = doc(db, 'musicRooms', roomId);
      const now = new Date().toISOString();
      const timestamp = Date.now();
      
      console.log(`useRoomPresence: Updating presence for user ${user.uid} - online: ${isOnline}`);
      
      // Fix: Use getDoc instead of roomRef.get()
      const roomSnap = await getDoc(roomRef);
      if (roomSnap.exists()) {
        const roomData = roomSnap.data();
        const participants = roomData.participants || [];
        
        const updatedParticipants = participants.map((p: any) => {
          if (p.id === user.uid) {
            return {
              ...p,
              lastSeen: now,
              heartbeatTimestamp: timestamp,
              status: isOnline ? 'active' : p.status,
              isInRoom: isOnline
            };
          }
          return p;
        });
        
        await updateDoc(roomRef, {
          participants: updatedParticipants,
          lastActivity: now
        });
        
        console.log(`useRoomPresence: Updated presence for user ${user.uid} with heartbeat ${timestamp}`);
      }
    } catch (error) {
      console.error('Error updating Firestore presence:', error);
    }
  }, [roomId, user, isParticipant]);

  useEffect(() => {
    if (!roomId || !user || !isParticipant) return;

    console.log('useRoomPresence: Setting up presence for user:', user.uid, 'in room:', roomId);

    const rtdb = getDatabase();
    const userStatusRef = ref(rtdb, `status/${roomId}/${user.uid}`);
    const connectedRef = ref(rtdb, '.info/connected');

    // Immediately update presence when component mounts
    updateFirestorePresence(true);

    const cleanup = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) return;

      // Set up disconnect handler
      onDisconnect(userStatusRef)
        .set({ state: 'disconnected', lastChanged: serverTimestamp() })
        .then(() => {
          // Set user as connected
          set(userStatusRef, { state: 'connected', lastChanged: serverTimestamp() });
          updateFirestorePresence(true);
        });
    });

    // Set up heartbeat interval to maintain presence
    const heartbeatInterval = setInterval(() => {
      console.log(`useRoomPresence: Sending heartbeat for user ${user.uid}`);
      updateFirestorePresence(true);
    }, 15000); // Every 15 seconds

    return () => {
      console.log('useRoomPresence: Cleaning up presence for user:', user.uid);
      clearInterval(heartbeatInterval);
      cleanup();
      // Update presence to offline when leaving
      updateFirestorePresence(false);
    };
  }, [roomId, user, isParticipant, updateFirestorePresence]);

  return { updateFirestorePresence };
};
