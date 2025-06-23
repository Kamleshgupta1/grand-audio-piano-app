
import { useEffect, useCallback } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
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
      
      // Only update presence, don't change participant status
      await updateDoc(roomRef, {
        [`participants.${user.uid}.lastSeen`]: now,
        [`participants.${user.uid}.heartbeatTimestamp`]: Date.now(),
        ...(isOnline ? {
          [`participants.${user.uid}.status`]: 'active'
        } : {})
      });
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

    const cleanup = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) return;

      // Set up disconnect handler - but don't remove user from participants
      onDisconnect(userStatusRef)
        .set({ state: 'disconnected', lastChanged: serverTimestamp() })
        .then(() => {
          // Set user as connected
          set(userStatusRef, { state: 'connected', lastChanged: serverTimestamp() });
          updateFirestorePresence(true);
        });
    });

    // Initial presence update
    updateFirestorePresence(true);

    return () => {
      console.log('useRoomPresence: Cleaning up presence for user:', user.uid);
      cleanup();
      // Don't call updateFirestorePresence(false) here as it might trigger auto-removal
    };
  }, [roomId, user, isParticipant, updateFirestorePresence]);

  return { updateFirestorePresence };
};
