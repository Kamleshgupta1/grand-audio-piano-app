
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
      const timer = setTimeout(() => setShowNoteIndicator(false), 800);
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
    'relative flex items-end justify-center transition-all duration-100 ease-out',
    'select-none outline-none focus:outline-none cursor-pointer',
    'border border-gray-300',
    mapping.isBlack
      ? cn(
          'piano-key-black',
          'h-32 w-8 -mx-1 z-20 rounded-b-md',
          'bg-gradient-to-b from-gray-800 to-gray-900',
          'border-gray-700 shadow-xl',
          'hover:from-gray-700 hover:to-gray-800',
          (isPressed || isMouseDown) && 'transform translate-y-1 from-gray-900 to-black scale-95'
        )
      : cn(
          'piano-key-white',
          'h-40 w-12 rounded-b-lg',
          'bg-gradient-to-b from-white to-gray-50',
          'border-gray-300 shadow-lg',
          'hover:from-gray-50 hover:to-gray-100',
          (isPressed || isMouseDown) && 'transform translate-y-1 from-gray-100 to-gray-200 scale-98'
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
      {/* Note indicator */}
      {showNoteIndicator && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg animate-bounce">
            {mapping.note}
          </div>
        </div>
      )}

      {/* Key labels - VirtualPiano style */}
      {showLabels && (
        <div className={cn(
          'absolute bottom-3 left-1/2 transform -translate-x-1/2',
          'text-xs font-medium pointer-events-none select-none',
          'px-1.5 py-0.5 rounded-sm',
          mapping.isBlack 
            ? 'bg-white/90 text-gray-800 shadow-sm' 
            : 'bg-gray-800/75 text-white shadow-sm'
        )}>
          {mapping.key.toUpperCase()}
        </div>
      )}

      {/* Pressed effect */}
      {(isPressed || isMouseDown) && (
        <div className={cn(
          'absolute inset-0 pointer-events-none rounded-b-lg',
          mapping.isBlack 
            ? 'bg-gradient-to-b from-blue-500/30 to-blue-600/30' 
            : 'bg-gradient-to-b from-blue-400/20 to-blue-500/20'
        )} />
      )}

      {/* Subtle inner shadow for depth */}
      <div className="absolute inset-0 pointer-events-none rounded-b-lg shadow-inner opacity-30" />

      {/* Reflection effect on white keys */}
      {!mapping.isBlack && (
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/50 to-transparent pointer-events-none rounded-t-lg" />
      )}
    </div>
  );
};
