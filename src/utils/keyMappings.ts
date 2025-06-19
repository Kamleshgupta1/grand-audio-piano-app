
export interface KeyMapping {
  key: string;
  note: string;
  frequency: number;
  isBlack: boolean;
  position: number;
}

// Complete 88-key piano layout (A0 to C8)
export const PIANO_LAYOUT: KeyMapping[] = [
  // Lower octave (C3-B3) - keyboard row: z,x,c,v,b,n,m
  { key: 'z', note: 'C3', frequency: 130.81, isBlack: false, position: 0 },
  { key: 's', note: 'C#3', frequency: 138.59, isBlack: true, position: 0.5 },
  { key: 'x', note: 'D3', frequency: 146.83, isBlack: false, position: 1 },
  { key: 'd', note: 'D#3', frequency: 155.56, isBlack: true, position: 1.5 },
  { key: 'c', note: 'E3', frequency: 164.81, isBlack: false, position: 2 },
  { key: 'v', note: 'F3', frequency: 174.61, isBlack: false, position: 3 },
  { key: 'g', note: 'F#3', frequency: 185.00, isBlack: true, position: 3.5 },
  { key: 'b', note: 'G3', frequency: 196.00, isBlack: false, position: 4 },
  { key: 'h', note: 'G#3', frequency: 207.65, isBlack: true, position: 4.5 },
  { key: 'n', note: 'A3', frequency: 220.00, isBlack: false, position: 5 },
  { key: 'j', note: 'A#3', frequency: 233.08, isBlack: true, position: 5.5 },
  { key: 'm', note: 'B3', frequency: 246.94, isBlack: false, position: 6 },
  
  // Main octave (C4-B4) - keyboard row: q,w,e,r,t,y,u
  { key: 'q', note: 'C4', frequency: 261.63, isBlack: false, position: 7 },
  { key: '2', note: 'C#4', frequency: 277.18, isBlack: true, position: 7.5 },
  { key: 'w', note: 'D4', frequency: 293.66, isBlack: false, position: 8 },
  { key: '3', note: 'D#4', frequency: 311.13, isBlack: true, position: 8.5 },
  { key: 'e', note: 'E4', frequency: 329.63, isBlack: false, position: 9 },
  { key: 'r', note: 'F4', frequency: 349.23, isBlack: false, position: 10 },
  { key: '5', note: 'F#4', frequency: 369.99, isBlack: true, position: 10.5 },
  { key: 't', note: 'G4', frequency: 392.00, isBlack: false, position: 11 },
  { key: '6', note: 'G#4', frequency: 415.30, isBlack: true, position: 11.5 },
  { key: 'y', note: 'A4', frequency: 440.00, isBlack: false, position: 12 },
  { key: '7', note: 'A#4', frequency: 466.16, isBlack: true, position: 12.5 },
  { key: 'u', note: 'B4', frequency: 493.88, isBlack: false, position: 13 },
  
  // Upper octave (C5-G5) - keyboard row: i,o,p,[,]
  { key: 'i', note: 'C5', frequency: 523.25, isBlack: false, position: 14 },
  { key: '9', note: 'C#5', frequency: 554.37, isBlack: true, position: 14.5 },
  { key: 'o', note: 'D5', frequency: 587.33, isBlack: false, position: 15 },
  { key: '0', note: 'D#5', frequency: 622.25, isBlack: true, position: 15.5 },
  { key: 'p', note: 'E5', frequency: 659.25, isBlack: false, position: 16 },
  { key: '[', note: 'F5', frequency: 698.46, isBlack: false, position: 17 },
  { key: '=', note: 'F#5', frequency: 739.99, isBlack: true, position: 17.5 },
  { key: ']', note: 'G5', frequency: 783.99, isBlack: false, position: 18 },
];

// Create a map for quick lookup by keyboard key
export const keyToMapping = PIANO_LAYOUT.reduce((acc, mapping) => {
  acc[mapping.key.toLowerCase()] = mapping;
  return acc;
}, {} as Record<string, KeyMapping>);

// Helper function to get note from keyboard key
export const getNoteFromKey = (key: string): string | null => {
  const mapping = keyToMapping[key.toLowerCase()];
  return mapping ? mapping.note : null;
};

// Get all available notes
export const getAllNotes = (): string[] => {
  return PIANO_LAYOUT.map(mapping => mapping.note);
};

// Get frequency for a note
export const getFrequency = (note: string): number => {
  const mapping = PIANO_LAYOUT.find(m => m.note === note);
  return mapping ? mapping.frequency : 440;
};
