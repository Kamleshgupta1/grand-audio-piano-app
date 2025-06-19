
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
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    if (isPressed) {
      setShowNoteIndicator(true);
      const timer = setTimeout(() => setShowNoteIndicator(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [isPressed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMouseDown(true);
    onPress(mapping.note);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMouseDown(false);
    onRelease(mapping.note);
  };

  const handleMouseLeave = () => {
    if (isMouseDown) {
      setIsMouseDown(false);
      onRelease(mapping.note);
    }
  };

  const keyClasses = cn(
    'relative flex items-end justify-center transition-all duration-75 ease-out',
    'select-none outline-none focus:outline-none cursor-pointer',
    'border-l border-r border-gray-300',
    mapping.isBlack
      ? cn(
          'piano-key-black',
          'h-32 w-8 -mx-1 z-20 rounded-b-md',
          'bg-gradient-to-b from-gray-800 via-gray-900 to-black',
          'border-gray-700 shadow-lg',
          (isPressed || isMouseDown) && 'transform translate-y-1 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900'
        )
      : cn(
          'piano-key-white',
          'h-40 w-12 rounded-b-lg',
          'bg-gradient-to-b from-white via-gray-50 to-gray-100',
          'border-gray-300 shadow-md',
          (isPressed || isMouseDown) && 'transform translate-y-1 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300'
        )
  );

  return (
    <div
      className={keyClasses}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        position: mapping.isBlack ? 'absolute' : 'relative',
        left: mapping.isBlack ? `${(mapping.position - 0.5) * 48 + 16}px` : undefined,
      }}
      role="button"
      tabIndex={0}
      aria-label={`Piano key ${mapping.note}`}
      aria-pressed={isPressed}
    >
      {/* Note indicator with enhanced animation */}
      {showNoteIndicator && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
            {mapping.note}
          </div>
        </div>
      )}

      {/* Enhanced key labels */}
      {showLabels && (
        <div className={cn(
          'absolute bottom-2 left-1/2 transform -translate-x-1/2',
          'text-xs font-medium pointer-events-none select-none',
          'px-1.5 py-0.5 rounded-md backdrop-blur-sm',
          mapping.isBlack 
            ? 'bg-white/90 text-gray-800' 
            : 'bg-gray-800/80 text-white'
        )}>
          {mapping.key.toUpperCase()}
        </div>
      )}

      {/* Pressed effect with gradient overlay */}
      {(isPressed || isMouseDown) && (
        <div className={cn(
          'absolute inset-0 pointer-events-none rounded-b-lg',
          mapping.isBlack 
            ? 'bg-gradient-to-b from-blue-400/40 to-purple-400/40' 
            : 'bg-gradient-to-b from-blue-300/30 to-purple-300/30'
        )} />
      )}

      {/* Subtle inner shadow for depth */}
      <div className={cn(
        'absolute inset-0 pointer-events-none rounded-b-lg',
        mapping.isBlack
          ? 'shadow-inner'
          : 'shadow-inner'
      )} />

      {/* Reflection effect on white keys */}
      {!mapping.isBlack && (
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-lg" />
      )}
    </div>
  );
};
