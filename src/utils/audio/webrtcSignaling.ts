
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

  private serializeIceCandidate(candidate: RTCIceCandidate): any {
    return {
      candidate: candidate.candidate,
      sdpMLineIndex: candidate.sdpMLineIndex,
      sdpMid: candidate.sdpMid,
      usernameFragment: candidate.usernameFragment
    };
  }

  private deserializeIceCandidate(data: any): RTCIceCandidate {
    return new RTCIceCandidate({
      candidate: data.candidate,
      sdpMLineIndex: data.sdpMLineIndex,
      sdpMid: data.sdpMid,
      usernameFragment: data.usernameFragment
    });
  }

  async sendSignal(type: 'offer' | 'answer' | 'ice-candidate', data: any, targetUserId: string) {
    try {
      const signalRef = collection(db, 'webrtc-signals');
      
      // Serialize RTCIceCandidate objects for Firebase
      let serializedData = data;
      if (type === 'ice-candidate' && data instanceof RTCIceCandidate) {
        serializedData = this.serializeIceCandidate(data);
        console.log('WebRTC: Serialized ICE candidate:', serializedData);
      }
      
      await addDoc(signalRef, {
        type,
        data: serializedData,
        from: this.userId,
        to: targetUserId,
        roomId: this.roomId,
        timestamp: Date.now()
      });
      console.log(`WebRTC: Sent ${type} to ${targetUserId}`);
    } catch (error) {
      console.error('WebRTC: Error sending signal:', error);
      throw error;
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
          
          // Deserialize ICE candidates
          if (signal.type === 'ice-candidate') {
            signal.data = this.deserializeIceCandidate(signal.data);
            console.log('WebRTC: Deserialized ICE candidate:', signal.data);
          }
          
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
