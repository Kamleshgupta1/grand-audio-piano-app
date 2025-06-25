import React, { useState, useEffect, useCallback } from 'react';
import { lazy, Suspense } from "react";
import { useRoom } from './RoomContext';
import { playInstrumentNote } from '@/utils/instruments/instrumentUtils';
import { InstrumentNote } from '@/types/InstrumentNote';

// Instrument Pages - grouped by instrument type for better code splitting
const AllInstruments: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  Piano: lazy(() => import("@/components/instruments/piano/piano1/Piano")),

  Guitar: lazy(() => import("@/components/instruments/guitar/VirtualGuitarComponent")),
  Violin: lazy(() => import("@/components/instruments/violin/violin2/Violin")),  
  Veena: lazy(() => import("@/components/instruments/veena/Veena1/Veena")),

  Flute: lazy(() => import("@/components/instruments/flute/flute2/index")),
  Saxophone: lazy(() => import("@/components/instruments/saxophone/saxophone1/Saxophone")),
  Trumpet: lazy(() => import("@/components/instruments/trumpet/trumpet1/Trumpet")),

  Drums: lazy(() => import("@/components/instruments/drum/drums1/Drums")),
  Xylophone: lazy(() => import("@/components/instruments/xylophone/xylophone1/Xylophone")),
  Kalimba: lazy(() => import("@/components/instruments/Kalimba/kalimba2/Kalimba")),
  Marimba: lazy(() => import("@/components/instruments/Marimba/marimba2/Marimba")),

  DrumMachine: lazy(() => import("@/components/instruments/drum-machine/DrumMachine")),
  ChordProgression: lazy(() => import("@/components/instruments/chord-Progression/ChordProgressionPlayer")),
  Sitar: lazy(() => import("@/components/instruments/sitar/Sitar1/Sitar")),
};

// Helper function to get the instrument component
const getInstrumentComponent = (instrumentType: string) => {
  const key = Object.keys(AllInstruments).find(k => 
    k.toLowerCase() === instrumentType.toLowerCase() || 
    k.toLowerCase().startsWith(instrumentType.toLowerCase())
  );
  return key ? AllInstruments[key] : null;
};

interface SimpleInstrumentProps {
  type: string;
}

const SimpleInstrument: React.FC<SimpleInstrumentProps> = ({ type }) => {
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const { broadcastInstrumentNote, room, userInfo, remotePlaying } = useRoom();

  const InstrumentComponent = getInstrumentComponent(type);

  // Convert note to frequency for better audio synchronization
  const noteToFrequency = useCallback((note: string): number => {
    const [noteName, octaveStr] = note.includes(':') ? note.split(':') : [note, '4'];
    const octave = parseInt(octaveStr) || 4;
    
    const noteMap: { [key: string]: number } = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
      'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };

    const noteIndex = noteMap[noteName] || 9; // Default to A
    const A4 = 440;
    const A4_KEY = 69;
    const midiKey = (octave + 1) * 12 + noteIndex;
    return A4 * Math.pow(2, (midiKey - A4_KEY) / 12);
  }, []);

  const handlePlayNote = useCallback(async (note: string) => {
    if (!note || typeof note !== 'string') {
      console.error('SimpleInstrument: Invalid note received:', note);
      return;
    }
    
    console.log(`SimpleInstrument: Playing note ${note} on ${type}`);
    
    const [noteName, octaveStr] = note.includes(':') ? note.split(':') : [note, '4'];
    const octave = parseInt(octaveStr) || 4;
    const frequency = noteToFrequency(note);
    const velocity = Math.random() * 0.3 + 0.5; // Random velocity between 0.5-0.8
    
    try {
      // Play local sound immediately for responsiveness
      await playInstrumentNote(type, noteName, octave, 500, velocity);
      
      // Local state update for visual feedback
      setIsPlaying(prev => ({ ...prev, [note]: true }));
      
      // Broadcast the note with frequency data to other users in the room
      if (room && userInfo) {
        const noteEvent: InstrumentNote = {
          note,
          instrument: type,
          userId: userInfo.id,
          userName: userInfo.displayName || userInfo.name || 'Anonymous',
          frequency,
          velocity,
          duration: 500,
          timestamp: new Date().toISOString(),
          sessionId: `${userInfo.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        await broadcastInstrumentNote(noteEvent);
      }
      
    } catch (error) {
      console.error('SimpleInstrument: Error playing note:', error);
    }
    
    // Reset local visual feedback after a delay
    setTimeout(() => {
      setIsPlaying(prev => ({ ...prev, [note]: false }));
    }, 500);
  }, [type, room, userInfo, broadcastInstrumentNote, noteToFrequency]);

  // Listen for remote notes being played by other users
  useEffect(() => {
    if (remotePlaying && 
        remotePlaying.instrument === type && 
        remotePlaying.note &&
        remotePlaying.userId !== userInfo?.id) {
      
      console.log(`SimpleInstrument: Received remote note ${remotePlaying.note} from ${remotePlaying.userName}`);
      
      // Update local state to show visual feedback for remote notes
      setIsPlaying(prev => ({ ...prev, [remotePlaying.note]: true }));
      
      setTimeout(() => {
        setIsPlaying(prev => ({ ...prev, [remotePlaying.note]: false }));
      }, 500);
    }
  }, [remotePlaying, type, userInfo?.id]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-4">
        <span className="font-medium">Playing: {type.charAt(0).toUpperCase() + type.slice(1)}</span>
        {remotePlaying && remotePlaying.instrument === type && remotePlaying.userId !== userInfo?.id && (
          <div className="text-xs text-purple-600 mt-1">
            {remotePlaying.userName} is playing
          </div>
        )}
      </div>

      {InstrumentComponent ? (
        <Suspense fallback={<div>Loading {type}...</div>}> 
          <InstrumentComponent 
            onPlayNote={handlePlayNote} 
            isPlaying={isPlaying}
            remoteNotes={remotePlaying?.instrument === type ? remotePlaying : null}
          />
        </Suspense>
      ) : (
        <p className="text-red-500">Instrument "{type}" not found.</p>
      )}
    </div>
  );
};

export default SimpleInstrument;
