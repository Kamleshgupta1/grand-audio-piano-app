import { db } from '@/utils/firebase/config';
import { collection, doc, addDoc, onSnapshot, deleteDoc, query, where, getDocs } from 'firebase/firestore';

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate';
  data: any;
  from: string;
  to: string;
  roomId: string;
  timestamp: number;
  signalId?: string;
  ttl?: number;
}

class WebRTCSignaling {
  private roomId: string;
  private userId: string;
  private unsubscribes: (() => void)[] = [];
  private processedSignals: Set<string> = new Set();
  private cleanupInterval?: NodeJS.Timeout;
  private readonly SIGNAL_TTL = 60000; // 1 minute TTL for signals
  private readonly CLEANUP_INTERVAL = 30000; // Clean up every 30 seconds

  constructor(roomId: string, userId: string) {
    this.roomId = roomId;
    this.userId = userId;
    this.startCleanupTask();
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

  private generateSignalId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private startCleanupTask(): void {
    // Start periodic cleanup of old signals
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldSignals();
    }, this.CLEANUP_INTERVAL);
  }

  private async cleanupOldSignals(): Promise<void> {
    try {
      const signalRef = collection(db, 'webrtc-signals');
      const cutoffTime = Date.now() - this.SIGNAL_TTL;
      
      // Query for old signals in this room
      const q = query(
        signalRef,
        where('roomId', '==', this.roomId),
        where('timestamp', '<', cutoffTime)
      );

      const snapshot = await getDocs(q);
      const deletePromises: Promise<void>[] = [];
      
      snapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });

      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        console.log(`WebRTC: Cleaned up ${deletePromises.length} old signals`);
      }
    } catch (error) {
      console.error('WebRTC: Error cleaning up old signals:', error);
    }
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
      
      // Generate unique signal ID for deduplication
      const signalId = this.generateSignalId();
      
      await addDoc(signalRef, {
        type,
        data: serializedData,
        from: this.userId,
        to: targetUserId,
        roomId: this.roomId,
        timestamp: Date.now(),
        signalId,
        ttl: this.SIGNAL_TTL
      });
      console.log(`WebRTC: Sent ${type} to ${targetUserId} with ID ${signalId}`);
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
          
          // Skip if signal already processed (deduplication)
          const signalKey = signal.signalId || `${signal.from}-${signal.type}-${signal.timestamp}`;
          if (this.processedSignals.has(signalKey)) {
            console.log('WebRTC: Skipping duplicate signal:', signalKey);
            return;
          }
          
          // Mark signal as processed
          this.processedSignals.add(signalKey);
          
          // Clean up old processed signals (keep only last 100)
          if (this.processedSignals.size > 100) {
            const signalsArray = Array.from(this.processedSignals);
            const toDelete = signalsArray.slice(0, signalsArray.length - 50);
            toDelete.forEach(id => this.processedSignals.delete(id));
          }
          
          // Deserialize ICE candidates
          if (signal.type === 'ice-candidate') {
            signal.data = this.deserializeIceCandidate(signal.data);
            console.log('WebRTC: Deserialized ICE candidate:', signal.data);
          }
          
          console.log('WebRTC: Processing signal:', signal.type, 'from', signal.from, 'ID:', signalKey);
          onSignal(signal);
          
          // Clean up the signal after processing
          try {
            await deleteDoc(change.doc.ref);
            console.log('WebRTC: Deleted processed signal:', signalKey);
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
    console.log('WebRTC: Cleaning up signaling');
    
    // Stop cleanup task
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
    
    this.unsubscribes.forEach(unsubscribe => unsubscribe());
    this.unsubscribes = [];
    this.processedSignals.clear();
  }
}

export default WebRTCSignaling;
