import { useState } from 'react';
import { Music, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ScaleReferenceProps {
  className?: string;
  compact?: boolean;
}

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const scalePatterns: Record<string, number[]> = {
  'Major': [0, 2, 4, 5, 7, 9, 11],
  'Natural Minor': [0, 2, 3, 5, 7, 8, 10],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  'Melodic Minor': [0, 2, 3, 5, 7, 9, 11],
  'Pentatonic Major': [0, 2, 4, 7, 9],
  'Pentatonic Minor': [0, 3, 5, 7, 10],
  'Blues': [0, 3, 5, 6, 7, 10],
  'Dorian': [0, 2, 3, 5, 7, 9, 10],
  'Phrygian': [0, 1, 3, 5, 7, 8, 10],
  'Lydian': [0, 2, 4, 6, 7, 9, 11],
  'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
  'Locrian': [0, 1, 3, 5, 6, 8, 10],
};

const chordPatterns: Record<string, number[]> = {
  'Major': [0, 4, 7],
  'Minor': [0, 3, 7],
  'Diminished': [0, 3, 6],
  'Augmented': [0, 4, 8],
  'Major 7th': [0, 4, 7, 11],
  'Minor 7th': [0, 3, 7, 10],
  'Dominant 7th': [0, 4, 7, 10],
  'Sus2': [0, 2, 7],
  'Sus4': [0, 5, 7],
  'Add9': [0, 4, 7, 14],
};

const ScaleReference = ({ className, compact = false }: ScaleReferenceProps) => {
  const [rootNote, setRootNote] = useState('C');
  const [selectedScale, setSelectedScale] = useState('Major');
  const [selectedChord, setSelectedChord] = useState('Major');
  const [mode, setMode] = useState<'scales' | 'chords'>('scales');

  const getScaleNotes = (root: string, pattern: number[]): string[] => {
    const rootIndex = notes.indexOf(root);
    return pattern.map((interval) => notes[(rootIndex + interval) % 12]);
  };

  const currentPattern = mode === 'scales' ? scalePatterns[selectedScale] : chordPatterns[selectedChord];
  const displayNotes = getScaleNotes(rootNote, currentPattern);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 p-2 rounded-lg bg-card border border-border", className)}>
        <Music className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{rootNote} {mode === 'scales' ? selectedScale : selectedChord}:</span>
        <div className="flex gap-1">
          {displayNotes.map((note, i) => (
            <span
              key={i}
              className={cn(
                "px-1.5 py-0.5 text-xs rounded font-mono",
                i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {note}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-4 rounded-xl bg-card border border-border shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Music className="h-4 w-4" />
          Scale & Chord Reference
        </h3>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant={mode === 'scales' ? 'default' : 'outline'}
          onClick={() => setMode('scales')}
          className="flex-1"
        >
          Scales
        </Button>
        <Button
          size="sm"
          variant={mode === 'chords' ? 'default' : 'outline'}
          onClick={() => setMode('chords')}
          className="flex-1"
        >
          Chords
        </Button>
      </div>

      {/* Root Note Selector */}
      <div className="mb-4">
        <label className="text-xs text-muted-foreground mb-2 block">Root Note</label>
        <div className="grid grid-cols-6 gap-1">
          {notes.map((note) => (
            <Button
              key={note}
              size="sm"
              variant={rootNote === note ? 'default' : 'outline'}
              onClick={() => setRootNote(note)}
              className="text-xs px-2"
            >
              {note}
            </Button>
          ))}
        </div>
      </div>

      {/* Scale/Chord Selector */}
      <div className="mb-4">
        <label className="text-xs text-muted-foreground mb-2 block">
          {mode === 'scales' ? 'Scale Type' : 'Chord Type'}
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {mode === 'scales' ? selectedScale : selectedChord}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
            {Object.keys(mode === 'scales' ? scalePatterns : chordPatterns).map((name) => (
              <DropdownMenuItem
                key={name}
                onClick={() => mode === 'scales' ? setSelectedScale(name) : setSelectedChord(name)}
              >
                {name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Display Notes */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <div className="text-sm font-medium text-foreground mb-2">
          {rootNote} {mode === 'scales' ? selectedScale : selectedChord}
        </div>
        <div className="flex flex-wrap gap-2">
          {displayNotes.map((note, i) => (
            <div
              key={i}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold transition-all",
                i === 0
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background text-foreground border border-border"
              )}
            >
              {note}
            </div>
          ))}
        </div>
        {mode === 'scales' && (
          <div className="text-xs text-muted-foreground mt-2">
            Intervals: {currentPattern.map((i, idx) => {
              const names = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
              return names[i];
            }).join(' - ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScaleReference;
