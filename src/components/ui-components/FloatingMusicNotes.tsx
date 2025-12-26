import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Music2, Music3, Music4 } from 'lucide-react';

interface FloatingMusicNotesProps {
  count?: number;
  className?: string;
}

const musicIcons = [Music, Music2, Music3, Music4];

const FloatingMusicNotes = ({ count = 5, className }: FloatingMusicNotesProps) => {
  const [notes, setNotes] = useState<Array<{ id: number; x: number; delay: number; icon: number }>>([]);

  useEffect(() => {
    const newNotes = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      icon: Math.floor(Math.random() * musicIcons.length),
    }));
    setNotes(newNotes);
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <AnimatePresence>
        {notes.map((note) => {
          const Icon = musicIcons[note.icon];
          return (
            <motion.div
              key={note.id}
              className="absolute text-primary/20 dark:text-primary/10"
              initial={{ 
                x: `${note.x}%`, 
                y: '100%', 
                opacity: 0, 
                scale: 0.5,
                rotate: 0 
              }}
              animate={{ 
                y: '-10%', 
                opacity: [0, 0.5, 0.5, 0],
                scale: [0.5, 1, 1, 0.8],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 8,
                delay: note.delay,
                repeat: Infinity,
                repeatDelay: note.delay,
                ease: 'easeOut',
              }}
            >
              <Icon className="w-6 h-6 md:w-8 md:h-8" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default FloatingMusicNotes;
