
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { KeyMapping } from '@/utils/keyMappings';

interface PianoKeyProps {
  mapping: KeyMapping;
  isPressed: boolean;
  showLabels: boolean;
  onPress: (note: string) => void;
  onRelease: (note: string) => void;
}

export const PianoKey: React.FC<PianoKeyProps> = ({
  mapping,
  isPressed,
  showLabels,
  onPress,
  onRelease
}) => {
  const [showNoteIndicator, setShowNoteIndicator] = useState(false);

  useEffect(() => {
    if (isPressed) {
      setShowNoteIndicator(true);
      const timer = setTimeout(() => setShowNoteIndicator(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isPressed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onPress(mapping.note);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    onRelease(mapping.note);
  };

  const handleMouseLeave = () => {
    onRelease(mapping.note);
  };

  const keyClasses = cn(
    'relative flex items-end justify-center transition-all duration-75 ease-out',
    'hover:z-10 active:z-20 user-select-none outline-none focus:outline-none',
    mapping.isBlack
      ? cn(
          'piano-key-black',
          'h-32 w-8 -mx-1 z-10',
          isPressed && 'pressed transform translate-y-1'
        )
      : cn(
          'piano-key-white',
          'h-48 w-12',
          isPressed && 'pressed transform translate-y-1'
        )
  );

  return (
    <div
      className={keyClasses}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        zIndex: mapping.isBlack ? 20 : 10,
        position: mapping.isBlack ? 'absolute' : 'relative',
        left: mapping.isBlack ? `${(mapping.position - 0.5) * 48 + 16}px` : undefined,
      }}
      role="button"
      tabIndex={0}
      aria-label={`Piano key ${mapping.note}`}
      aria-pressed={isPressed}
    >
      {/* Note indicator */}
      {showNoteIndicator && (
        <div className="note-indicator">
          {mapping.note}
        </div>
      )}

      {/* Key label */}
      {showLabels && (
        <div className={cn(
          'key-label',
          mapping.isBlack ? 'text-white' : 'text-gray-600'
        )}>
          {mapping.key}
        </div>
      )}

      {/* Pressed effect overlay */}
      {isPressed && (
        <div className={cn(
          'absolute inset-0 pointer-events-none',
          mapping.isBlack 
            ? 'bg-blue-400 opacity-30' 
            : 'bg-blue-200 opacity-40'
        )} />
      )}

      {/* Hover glow effect */}
      <div className={cn(
        'absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-200',
        'hover:opacity-100',
        mapping.isBlack 
          ? 'bg-gradient-to-b from-blue-500/20 to-transparent' 
          : 'bg-gradient-to-b from-blue-300/20 to-transparent'
      )} />
    </div>
  );
};
