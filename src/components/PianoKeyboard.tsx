
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

  const handleNotePress = useCallback((note: string) => {
    if (pressedNotes.has(note)) return;
    
    setPressedNotes(prev => new Set(prev).add(note));
    audioManager.playNote(note, 0.8);
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
      handleNotePress(note);
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
    <div className="piano-container">
      {/* Audio visualizer */}
      <div className={`visualizer ${pressedNotes.size > 0 ? 'active' : ''}`} />
      
      <div className="relative flex items-end justify-center perspective-1000">
        {/* White keys */}
        <div className="flex">
          {whiteKeys.map((mapping) => (
            <PianoKey
              key={mapping.note}
              mapping={mapping}
              isPressed={pressedNotes.has(mapping.note)}
              showLabels={showLabels}
              onPress={handleNotePress}
              onRelease={handleNoteRelease}
            />
          ))}
        </div>
        
        {/* Black keys */}
        <div className="absolute top-0">
          {blackKeys.map((mapping) => (
            <PianoKey
              key={mapping.note}
              mapping={mapping}
              isPressed={pressedNotes.has(mapping.note)}
              showLabels={showLabels}
              onPress={handleNotePress}
              onRelease={handleNoteRelease}
            />
          ))}
        </div>
      </div>
      
      {/* Currently playing notes indicator */}
      {pressedNotes.size > 0 && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
          <div className="text-xs font-medium mb-1">Playing:</div>
          <div className="text-sm font-bold">
            {Array.from(pressedNotes).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};
