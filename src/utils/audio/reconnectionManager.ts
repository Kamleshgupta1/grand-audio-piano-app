export class ReconnectionManager {
  private reconnectAttempts: Map<string, number> = new Map();
  private maxAttempts: number;
  private baseDelay: number;
  private maxDelay: number;

  constructor(maxAttempts = 5, baseDelay = 2000, maxDelay = 30000) {
    this.maxAttempts = maxAttempts;
    this.baseDelay = baseDelay;
    this.maxDelay = maxDelay;
  }

  shouldReconnect(peerId: string): boolean {
    const attempts = this.reconnectAttempts.get(peerId) || 0;
    return attempts < this.maxAttempts;
  }

  getReconnectDelay(peerId: string): number {
    const attempts = this.reconnectAttempts.get(peerId) || 0;
    // Exponential backoff: delay * (2 ^ attempts)
    const delay = Math.min(this.baseDelay * Math.pow(2, attempts), this.maxDelay);
    return delay;
  }

  incrementAttempt(peerId: string): number {
    const current = this.reconnectAttempts.get(peerId) || 0;
    const newValue = current + 1;
    this.reconnectAttempts.set(peerId, newValue);
    return newValue;
  }

  resetAttempts(peerId: string): void {
    this.reconnectAttempts.delete(peerId);
  }

  getAttempts(peerId: string): number {
    return this.reconnectAttempts.get(peerId) || 0;
  }

  clear(): void {
    this.reconnectAttempts.clear();
  }
}
