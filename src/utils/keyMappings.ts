
export interface KeyMapping {
  key: string;
  note: string;
  octave: number;
  isBlack: boolean;
  position: number;
}

export const KEYBOARD_MAPPINGS: { [key: string]: string } = {
  // First octave (C3-B3)
  'Tab': 'C3',
  '1': 'C#3',
  'q': 'D3',
  '2': 'D#3',
  'w': 'E3',
  'e': 'F3',
  '4': 'F#3',
  'r': 'G3',
  '5': 'G#3',
  't': 'A3',
  '6': 'A#3',
  'y': 'B3',
  
  // Second octave (C4-B4) - Main octave
  'u': 'C4',
  '8': 'C#4',
  'i': 'D4',
  '9': 'D#4',
  'o': 'E4',
  'p': 'F4',
  '-': 'F#4',
  '[': 'G4',
  '=': 'G#4',
  ']': 'A4',
  'Backspace': 'A#4',
  '\\': 'B4',
  
  // Third octave (C5-B5)
  'CapsLock': 'C5',
  's': 'C#5',
  'a': 'D5',
  'd': 'D#5',
  's': 'E5',
  'f': 'F5',
  'g': 'F#5',
  'h': 'G5',
  'j': 'G#5',
  'k': 'A5',
  'l': 'A#5',
  ';': 'B5',
  
  // Lower octave using ZXCV row
  'z': 'C4',
  's': 'C#4',
  'x': 'D4',
  'd': 'D#4',
  'c': 'E4',
  'v': 'F4',
  'g': 'F#4',
  'b': 'G4',
  'h': 'G#4',
  'n': 'A4',
  'j': 'A#4',
  'm': 'B4',
  ',': 'C5',
  'l': 'C#5',
  '.': 'D5',
  ';': 'D#5',
  '/': 'E5',
};

export const PIANO_LAYOUT: KeyMapping[] = [
  // C3 octave
  { key: 'Tab', note: 'C3', octave: 3, isBlack: false, position: 0 },
  { key: '1', note: 'C#3', octave: 3, isBlack: true, position: 0.5 },
  { key: 'q', note: 'D3', octave: 3, isBlack: false, position: 1 },
  { key: '2', note: 'D#3', octave: 3, isBlack: true, position: 1.5 },
  { key: 'w', note: 'E3', octave: 3, isBlack: false, position: 2 },
  { key: 'e', note: 'F3', octave: 3, isBlack: false, position: 3 },
  { key: '4', note: 'F#3', octave: 3, isBlack: true, position: 3.5 },
  { key: 'r', note: 'G3', octave: 3, isBlack: false, position: 4 },
  { key: '5', note: 'G#3', octave: 3, isBlack: true, position: 4.5 },
  { key: 't', note: 'A3', octave: 3, isBlack: false, position: 5 },
  { key: '6', note: 'A#3', octave: 3, isBlack: true, position: 5.5 },
  { key: 'y', note: 'B3', octave: 3, isBlack: false, position: 6 },
  
  // C4 octave (middle C)
  { key: 'z', note: 'C4', octave: 4, isBlack: false, position: 7 },
  { key: 's', note: 'C#4', octave: 4, isBlack: true, position: 7.5 },
  { key: 'x', note: 'D4', octave: 4, isBlack: false, position: 8 },
  { key: 'd', note: 'D#4', octave: 4, isBlack: true, position: 8.5 },
  { key: 'c', note: 'E4', octave: 4, isBlack: false, position: 9 },
  { key: 'v', note: 'F4', octave: 4, isBlack: false, position: 10 },
  { key: 'g', note: 'F#4', octave: 4, isBlack: true, position: 10.5 },
  { key: 'b', note: 'G4', octave: 4, isBlack: false, position: 11 },
  { key: 'h', note: 'G#4', octave: 4, isBlack: true, position: 11.5 },
  { key: 'n', note: 'A4', octave: 4, isBlack: false, position: 12 },
  { key: 'j', note: 'A#4', octave: 4, isBlack: true, position: 12.5 },
  { key: 'm', note: 'B4', octave: 4, isBlack: false, position: 13 },
  
  // C5 octave
  { key: ',', note: 'C5', octave: 5, isBlack: false, position: 14 },
  { key: 'l', note: 'C#5', octave: 5, isBlack: true, position: 14.5 },
  { key: '.', note: 'D5', octave: 5, isBlack: false, position: 15 },
  { key: ';', note: 'D#5', octave: 5, isBlack: true, position: 15.5 },
  { key: '/', note: 'E5', octave: 5, isBlack: false, position: 16 },
];

export const getNoteFromKey = (key: string): string | null => {
  return KEYBOARD_MAPPINGS[key.toLowerCase()] || null;
};

export const getKeyFromNote = (note: string): string | null => {
  const entry = Object.entries(KEYBOARD_MAPPINGS).find(([_, n]) => n === note);
  return entry ? entry[0] : null;
};

export const isBlackKey = (note: string): boolean => {
  return note.includes('#');
};

export const getOctaveFromNote = (note: string): number => {
  return parseInt(note.slice(-1));
};

export const getNoteNameFromNote = (note: string): string => {
  return note.slice(0, -1);
};
