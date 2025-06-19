
import React, { useState, useEffect, useCallback } from 'react';
import { PianoKey } from './PianoKey';
import { PIANO_LAYOUT, getNoteFromKey } from '@/utils/keyMappings';
import { AudioManager } from '@/utils/audioManager';

interface PianoKeyboardProps {
  audioManager: AudioManager;
  showLabels: boolean;
  sustainActive: boolean;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  audioManager,
  showLabels,
  sustainActive
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [pressedNotes, setPressedNotes] = useState<Set<string>>(new Set());

  const handleNotePress = useCallback((note: string, velocity: number = 0.8) => {
    if (pressedNotes.has(note)) return;
    
    setPressedNotes(prev => new Set(prev).add(note));
    audioManager.playNote(note, velocity);
  }, [audioManager, pressedNotes]);

  const handleNoteRelease = useCallback((note: string) => {
    if (sustainActive) return;
    
    setPressedNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
    audioManager.stopNote(note);
  }, [audioManager, sustainActive]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.repeat) return;
    
    const key = event.key.toLowerCase();
    if (pressedKeys.has(key)) return;
    
    // Handle sustain pedal (space bar)
    if (key === ' ') {
      event.preventDefault();
      return;
    }
    
    const note = getNoteFromKey(key);
    if (note) {
      event.preventDefault();
      setPressedKeys(prev => new Set(prev).add(key));
      // Add velocity based on timing (simulate piano touch sensitivity)
      const velocity = 0.7 + Math.random() * 0.3;
      handleNotePress(note, velocity);
    }
  }, [pressedKeys, handleNotePress]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    
    if (key === ' ') {
      event.preventDefault();
      return;
    }
    
    const note = getNoteFromKey(key);
    if (note) {
      event.preventDefault();
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
      handleNoteRelease(note);
    }
  }, [handleNoteRelease]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Clear pressed notes when sustain is released
  useEffect(() => {
    if (!sustainActive) {
      setPressedNotes(new Set());
    }
  }, [sustainActive]);

  const whiteKeys = PIANO_LAYOUT.filter(key => !key.isBlack);
  const blackKeys = PIANO_LAYOUT.filter(key => key.isBlack);

  return (
    <div className="piano-container w-full max-w-6xl mx-auto">
      {/* Visual feedback bar */}
      <div className="mb-4 h-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ${
            pressedNotes.size > 0 ? 'animate-pulse' : 'w-0'
          }`}
          style={{ width: pressedNotes.size > 0 ? '100%' : '0%' }}
        />
      </div>
      
      <div className="relative flex items-end justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-6 rounded-lg shadow-2xl">
        {/* Piano body shadow */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/20 to-transparent rounded-b-lg" />
        
        {/* White keys */}
        <div className="flex relative z-10">
          {whiteKeys.map((mapping) => (
            <PianoKey
              key={mapping.note}
              mapping={mapping}
              isPressed={pressedNotes.has(mapping.note)}
              showLabels={showLabels}
              onPress={(note) => handleNotePress(note, 0.8)}
              onRelease={handleNoteRelease}
            />
          ))}
        </div>
        
        {/* Black keys */}
        <div className="absolute top-6 z-20">
          {blackKeys.map((mapping) => (
            <PianoKey
              key={mapping.note}
              mapping={mapping}
              isPressed={pressedNotes.has(mapping.note)}
              showLabels={showLabels}
              onPress={(note) => handleNotePress(note, 0.9)}
              onRelease={handleNoteRelease}
            />
          ))}
        </div>
      </div>
      
      {/* Currently playing notes display */}
      {pressedNotes.size > 0 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-black/80 text-white px-4 py-2 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              Playing: {Array.from(pressedNotes).join(' • ')}
            </span>
          </div>
        </div>
      )}

      {/* Keyboard mapping hint */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Use your keyboard: <span className="font-mono bg-gray-100 px-1 rounded">Z-M</span> for lower octave, <span className="font-mono bg-gray-100 px-1 rounded">Q-U</span> for middle octave, <span className="font-mono bg-gray-100 px-1 rounded">I-]</span> for upper octave</p>
        <p className="mt-1">Hold <span className="font-mono bg-gray-100 px-1 rounded">Space</span> for sustain pedal</p>
      </div>
    </div>
  );
};
