
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
    
    if (key === ' ') {
      event.preventDefault();
      return;
    }
    
    const note = getNoteFromKey(key);
    if (note) {
      event.preventDefault();
      setPressedKeys(prev => new Set(prev).add(key));
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

  useEffect(() => {
    if (!sustainActive) {
      setPressedNotes(new Set());
    }
  }, [sustainActive]);

  const whiteKeys = PIANO_LAYOUT.filter(key => !key.isBlack);
  const blackKeys = PIANO_LAYOUT.filter(key => key.isBlack);

  return (
    <div className="piano-container w-full max-w-5xl mx-auto">      
      <div className="relative flex items-end justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8 rounded-xl shadow-2xl border border-gray-200">
        {/* Piano body gradient */}
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-gray-300/30 to-transparent rounded-b-xl" />
        
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
        <div className="absolute top-8 z-20">
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
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              {Array.from(pressedNotes).join(' • ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
