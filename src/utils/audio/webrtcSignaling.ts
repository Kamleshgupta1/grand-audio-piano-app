
import { db } from '@/utils/firebase/config';
import { collection, doc, addDoc, onSnapshot, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate';
  data: any;
  from: string;
  to: string;
  roomId: string;
  timestamp: number;
}

class WebRTCSignaling {
  private roomId: string;
  private userId: string;
  private unsubscribes: (() => void)[] = [];

  constructor(roomId: string, userId: string) {
    this.roomId = roomId;
    this.userId = userId;
  }

  async sendSignal(type: 'offer' | 'answer' | 'ice-candidate', data: any, targetUserId: string) {
    try {
      const signalRef = collection(db, 'webrtc-signals');
      await addDoc(signalRef, {
        type,
        data,
        from: this.userId,
        to: targetUserId,
        roomId: this.roomId,
        timestamp: Date.now()
      });
      console.log(`WebRTC: Sent ${type} to ${targetUserId}`);
    } catch (error) {
      console.error('WebRTC: Error sending signal:', error);
    }
  }

  listenForSignals(onSignal: (signal: SignalingMessage) => void) {
    const signalRef = collection(db, 'webrtc-signals');
    const q = query(
      signalRef,
      where('to', '==', this.userId),
      where('roomId', '==', this.roomId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const signal = change.doc.data() as SignalingMessage;
          onSignal(signal);
          
          // Clean up the signal after processing
          try {
            await deleteDoc(change.doc.ref);
          } catch (error) {
            console.error('WebRTC: Error deleting signal:', error);
          }
        }
      });
    });

    this.unsubscribes.push(unsubscribe);
    return unsubscribe;
  }

  cleanup() {
    this.unsubscribes.forEach(unsubscribe => unsubscribe());
    this.unsubscribes = [];
  }
}

export default WebRTCSignaling;
