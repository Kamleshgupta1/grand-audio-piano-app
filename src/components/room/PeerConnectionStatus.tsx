import React, { useEffect, useState } from 'react';
import { Users, Volume2, VolumeX, Signal, SignalHigh, SignalLow, SignalMedium, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface PeerStatus {
  id: string;
  name: string;
  connected: boolean;
  connectionState: RTCPeerConnectionState;
  iceConnectionState: RTCIceConnectionState;
  audioLevel: number;
  muted: boolean;
  latency?: number;
}

interface PeerConnectionStatusProps {
  peers: PeerStatus[];
  onMutePeer: (peerId: string) => void;
}

const PeerConnectionStatus: React.FC<PeerConnectionStatusProps> = ({ peers, onMutePeer }) => {
  const getConnectionStrengthIcon = (state: RTCIceConnectionState) => {
    switch (state) {
      case 'connected':
      case 'completed':
        return <SignalHigh className="h-3 w-3 text-green-500" />;
      case 'checking':
        return <SignalMedium className="h-3 w-3 text-yellow-500" />;
      case 'disconnected':
        return <SignalLow className="h-3 w-3 text-orange-500" />;
      case 'failed':
        return <Signal className="h-3 w-3 text-red-500" />;
      default:
        return <Loader2 className="h-3 w-3 animate-spin text-gray-400" />;
    }
  };

  const getConnectionStateText = (state: RTCPeerConnectionState) => {
    switch (state) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'failed':
        return 'Failed';
      case 'closed':
        return 'Closed';
      default:
        return 'New';
    }
  };

  const getConnectionStateColor = (state: RTCPeerConnectionState) => {
    switch (state) {
      case 'connected':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'connecting':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'disconnected':
        return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  if (peers.length === 0) {
    return (
      <Card className="p-3 bg-muted/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>No other participants connected</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
        <Users className="h-3 w-3" />
        <span>Connected Participants ({peers.length})</span>
      </div>
      
      <div className="space-y-2">
        {peers.map((peer) => (
          <Card key={peer.id} className="p-3 bg-card">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getConnectionStrengthIcon(peer.iceConnectionState)}
                  <span className="text-sm font-medium truncate">{peer.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getConnectionStateColor(peer.connectionState)}`}
                  >
                    {getConnectionStateText(peer.connectionState)}
                  </Badge>
                </div>
                
                {/* Audio Level Visualizer */}
                {peer.connected && !peer.muted && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-3 w-3 text-muted-foreground" />
                      <Progress 
                        value={peer.audioLevel * 100} 
                        className="h-1.5 flex-1"
                      />
                      <span className="text-xs text-muted-foreground w-8">
                        {Math.round(peer.audioLevel * 100)}%
                      </span>
                    </div>
                    {peer.latency !== undefined && (
                      <div className="text-xs text-muted-foreground">
                        Latency: {peer.latency}ms
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Mute Button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => onMutePeer(peer.id)}
                disabled={!peer.connected}
              >
                {peer.muted ? (
                  <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PeerConnectionStatus;
