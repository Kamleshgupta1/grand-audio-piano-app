
import React, { useState, useEffect } from 'react';
import { PianoKeyboard } from '@/components/PianoKeyboard';
import { ControlPanel } from '@/components/ControlPanel';
import { AudioManager } from '@/utils/audioManager';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Piano, Music, Headphones, Info } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [audioManager] = useState(() => new AudioManager());
  const [sustainActive, setSustainActive] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [recording, setRecording] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initializeAudio = () => {
      setIsInitialized(true);
      toast.success('Virtual Piano initialized! Ready to play.');
      document.removeEventListener('click', initializeAudio);
      document.removeEventListener('keydown', initializeAudio);
    };

    document.addEventListener('click', initializeAudio);
    document.addEventListener('keydown', initializeAudio);

    return () => {
      document.removeEventListener('click', initializeAudio);
      document.removeEventListener('keydown', initializeAudio);
    };
  }, []);

  useEffect(() => {
    // Handle sustain pedal with spacebar
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ' && !event.repeat) {
        event.preventDefault();
        setSustainActive(true);
        audioManager.setSustain(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault();
        setSustainActive(false);
        audioManager.setSustain(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [audioManager]);

  const handleRecordingToggle = () => {
    if (recording) {
      audioManager.stopRecording();
    } else {
      audioManager.startRecording();
    }
    setRecording(!recording);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Piano className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Virtual Piano
              </h1>
            </div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Professional online piano with realistic sound, recording capabilities, and advanced features.
              Play with your mouse, keyboard, or touch device.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Music className="w-3 h-3" />
                88 Keys
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Headphones className="w-3 h-3" />
                HQ Audio
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Piano className="w-3 h-3" />
                Recording
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isInitialized && (
          <Card className="mb-6 bg-blue-900/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-blue-100 font-medium">Ready to Play</p>
                  <p className="text-blue-200/80 text-sm">
                    Click anywhere or press any key to initialize the audio system and start playing!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Control Panel */}
        <ControlPanel
          audioManager={audioManager}
          sustainActive={sustainActive}
          onSustainToggle={setSustainActive}
          showLabels={showLabels}
          onShowLabelsToggle={setShowLabels}
          recording={recording}
          onRecordingToggle={handleRecordingToggle}
        />

        {/* Piano Keyboard */}
        <div className="mb-8">
          <PianoKeyboard
            audioManager={audioManager}
            showLabels={showLabels}
            sustainActive={sustainActive}
          />
        </div>

        {/* Instructions */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              How to Play
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-white mb-2">Keyboard Shortcuts:</h4>
                <ul className="space-y-1">
                  <li><code className="bg-gray-800 px-1 rounded">Z-M</code> - White keys (C4-B4)</li>
                  <li><code className="bg-gray-800 px-1 rounded">S,D,G,H,J</code> - Black keys</li>
                  <li><code className="bg-gray-800 px-1 rounded">Space</code> - Sustain pedal</li>
                  <li><code className="bg-gray-800 px-1 rounded">Q-Y</code> - Upper octave</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Features:</h4>
                <ul className="space-y-1">
                  <li>🎹 Professional piano sound</li>
                  <li>🎵 Recording and playback</li>
                  <li>🎚️ Volume and sustain controls</li>
                  <li>💾 Export/import recordings</li>
                  <li>📱 Mobile and touch support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>Virtual Piano - Professional Online Piano Instrument</p>
            <p className="mt-1">Play, record, and share your music creations</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
