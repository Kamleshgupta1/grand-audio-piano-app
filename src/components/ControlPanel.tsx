
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  Download, 
  Upload, 
  Volume2, 
  Piano,
  Settings,
  Keyboard,
  RotateCcw
} from 'lucide-react';
import { AudioManager, RecordingNote } from '@/utils/audioManager';
import { toast } from 'sonner';

interface ControlPanelProps {
  audioManager: AudioManager;
  sustainActive: boolean;
  onSustainToggle: (active: boolean) => void;
  showLabels: boolean;
  onShowLabelsToggle: (show: boolean) => void;
  recording: boolean;
  onRecordingToggle: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  audioManager,
  sustainActive,
  onSustainToggle,
  showLabels,
  onShowLabelsToggle,
  recording,
  onRecordingToggle
}) => {
  const [volume, setVolume] = useState(70);
  const [savedRecording, setSavedRecording] = useState<RecordingNote[] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    audioManager.setVolume(newVolume / 100);
  };

  const handleExportRecording = () => {
    if (!savedRecording) {
      toast.error('No recording to export');
      return;
    }

    const data = audioManager.exportRecording(savedRecording);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `piano-recording-${new Date().toISOString().slice(0, 19)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Recording exported successfully');
  };

  const handleImportRecording = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          const recording = audioManager.importRecording(data);
          setSavedRecording(recording);
          toast.success('Recording imported successfully');
        } catch (error) {
          toast.error('Failed to import recording');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handlePlayRecording = async () => {
    if (!savedRecording) {
      toast.error('No recording to play');
      return;
    }

    setIsPlaying(true);
    await audioManager.playRecording(savedRecording);
    
    // Calculate recording duration and stop playing indicator
    const duration = Math.max(...savedRecording.map(note => note.timestamp)) + 1000;
    setTimeout(() => setIsPlaying(false), duration);
    
    toast.success('Playing recording...');
  };

  const handleStopRecording = () => {
    if (recording) {
      const recordingData = audioManager.stopRecording();
      setSavedRecording(recordingData);
      toast.success(`Recording saved! ${recordingData.length} notes recorded.`);
    }
    onRecordingToggle();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Volume & Audio Controls */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Audio Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Volume</span>
              <span>{volume}%</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Sustain Pedal</span>
            <Switch
              checked={sustainActive}
              onCheckedChange={onSustainToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Key Labels</span>
            <Switch
              checked={showLabels}
              onCheckedChange={onShowLabelsToggle}
            />
          </div>
          
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">
              Press Space for sustain, or use keyboard shortcuts
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Piano className="w-4 h-4" />
            Recording
            {recording && (
              <Badge variant="destructive" className="ml-2 animate-pulse">
                REC
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant={recording ? "destructive" : "default"}
            size="sm"
            onClick={recording ? handleStopRecording : onRecordingToggle}
            className="w-full"
          >
            {recording ? (
              <>
                <Square className="w-3 h-3 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-2" />
                Start Recording
              </>
            )}
          </Button>

          {savedRecording && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayRecording}
              disabled={isPlaying}
              className="w-full"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 mr-2" />
                  Playing...
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-2" />
                  Play Recording
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* File Operations */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Keyboard className="w-4 h-4" />
            Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportRecording}
            disabled={!savedRecording}
            className="w-full"
          >
            <Download className="w-3 h-3 mr-2" />
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleImportRecording}
            className="w-full"
          >
            <Upload className="w-3 h-3 mr-2" />
            Import
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSavedRecording(null);
              toast.success('Recording cleared');
            }}
            disabled={!savedRecording}
            className="w-full"
          >
            <RotateCcw className="w-3 h-3 mr-2" />
            Clear
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
