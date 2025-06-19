
import React, { useState, useEffect } from 'react';
import { PianoKeyboard } from '@/components/PianoKeyboard';
import { ControlPanel } from '@/components/ControlPanel';
import { AudioManager } from '@/utils/audioManager';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Piano, Music, Volume2, Settings, Play, Pause, Square } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [audioManager] = useState(() => new AudioManager());
  const [sustainActive, setSustainActive] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [recording, setRecording] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const initializeAudio = () => {
      setIsInitialized(true);
      toast.success('Virtual Piano Ready!');
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header - VirtualPiano.net style */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Piano className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Virtual Piano</h1>
                <p className="text-sm text-gray-600">Play piano in your browser</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowControls(!showControls)}
              >
                <Settings className="w-4 h-4 mr-2" />
                {showControls ? 'Hide' : 'Show'} Controls
              </Button>
              
              {recording && (
                <Badge variant="destructive" className="animate-pulse">
                  <Square className="w-3 h-3 mr-1" />
                  REC
                </Badge>
              )}
              
              {sustainActive && (
                <Badge variant="secondary">
                  <Volume2 className="w-3 h-3 mr-1" />
                  Sustain
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {!isInitialized && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-blue-900 font-medium">Click to Start Playing</p>
                  <p className="text-blue-700 text-sm">
                    Click anywhere or press any key to initialize audio and start playing piano
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Control Panel - Collapsible */}
        {showControls && (
          <div className="mb-6">
            <ControlPanel
              audioManager={audioManager}
              sustainActive={sustainActive}
              onSustainToggle={setSustainActive}
              showLabels={showLabels}
              onShowLabelsToggle={setShowLabels}
              recording={recording}
              onRecordingToggle={handleRecordingToggle}
            />
          </div>
        )}

        {/* Piano Keyboard - Main focus */}
        <div className="mb-8">
          <PianoKeyboard
            audioManager={audioManager}
            showLabels={showLabels}
            sustainActive={sustainActive}
          />
        </div>

        {/* Simple Instructions - VirtualPiano style */}
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Keyboard Shortcuts</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>White Keys:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">Z X C V B N M</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Black Keys:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">S D G H J</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Sustain:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">Spacebar</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Upper Keys:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">Q W E R T Y U I O P</code>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Realistic Salamander Grand Piano samples</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Record and playback your performances</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Sustain pedal support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Volume control and audio settings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Export/import recordings</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer - Clean and minimal */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p>Virtual Piano - High Quality Online Piano Instrument</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
