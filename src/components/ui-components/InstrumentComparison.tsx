import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  ArrowLeftRight,
  Music,
  Layers,
  Volume2,
  Users,
  Zap,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface InstrumentData {
  id: string;
  name: string;
  category: string;
  difficulty: number;
  popularity: number;
  versatility: number;
  learning_curve: string;
  sound_range: string;
  portability: string;
  price_range: string;
  best_for: string[];
  description: string;
}

const instrumentsData: InstrumentData[] = [
  {
    id: 'piano',
    name: 'Piano',
    category: 'Keyboard',
    difficulty: 3,
    popularity: 5,
    versatility: 5,
    learning_curve: 'Moderate',
    sound_range: 'Wide (88 keys)',
    portability: 'Low',
    price_range: '$$-$$$$',
    best_for: ['Classical', 'Jazz', 'Pop', 'Composition'],
    description: 'The king of instruments with unmatched versatility and expression.'
  },
  {
    id: 'guitar',
    name: 'Guitar',
    category: 'String',
    difficulty: 3,
    popularity: 5,
    versatility: 5,
    learning_curve: 'Moderate',
    sound_range: 'Medium (6 strings)',
    portability: 'High',
    price_range: '$-$$$',
    best_for: ['Rock', 'Pop', 'Folk', 'Blues'],
    description: 'Versatile and portable, perfect for any musical style.'
  },
  {
    id: 'drums',
    name: 'Drums',
    category: 'Percussion',
    difficulty: 3,
    popularity: 4,
    versatility: 4,
    learning_curve: 'Moderate',
    sound_range: 'Wide (rhythm focus)',
    portability: 'Low',
    price_range: '$$-$$$',
    best_for: ['Rock', 'Jazz', 'Pop', 'Metal'],
    description: 'The heartbeat of any band, essential for rhythm.'
  },
  {
    id: 'violin',
    name: 'Violin',
    category: 'String',
    difficulty: 5,
    popularity: 4,
    versatility: 4,
    learning_curve: 'Steep',
    sound_range: 'Medium (4 strings)',
    portability: 'High',
    price_range: '$$-$$$$',
    best_for: ['Classical', 'Orchestra', 'Folk', 'Film'],
    description: 'Expressive and emotional, a classical masterpiece.'
  },
  {
    id: 'flute',
    name: 'Flute',
    category: 'Wind',
    difficulty: 3,
    popularity: 3,
    versatility: 3,
    learning_curve: 'Moderate',
    sound_range: 'High register',
    portability: 'High',
    price_range: '$-$$$',
    best_for: ['Classical', 'Orchestra', 'Jazz', 'World'],
    description: 'Light and airy, perfect for melodic expression.'
  },
  {
    id: 'saxophone',
    name: 'Saxophone',
    category: 'Wind',
    difficulty: 3,
    popularity: 4,
    versatility: 4,
    learning_curve: 'Moderate',
    sound_range: 'Wide (multiple types)',
    portability: 'Medium',
    price_range: '$$-$$$',
    best_for: ['Jazz', 'Blues', 'R&B', 'Pop'],
    description: 'Smooth and soulful, the voice of jazz.'
  },
];

interface InstrumentComparisonProps {
  className?: string;
}

const InstrumentComparison: React.FC<InstrumentComparisonProps> = ({ className }) => {
  const [instrument1, setInstrument1] = useState<string>('piano');
  const [instrument2, setInstrument2] = useState<string>('guitar');

  const getInstrument = (id: string) => instrumentsData.find(i => i.id === id);
  
  const inst1 = getInstrument(instrument1);
  const inst2 = getInstrument(instrument2);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
    );
  };

  const ComparisonRow = ({ 
    label, 
    value1, 
    value2, 
    icon: Icon,
    isRating = false 
  }: { 
    label: string; 
    value1: string | number; 
    value2: string | number;
    icon: React.ElementType;
    isRating?: boolean;
  }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-border/50 last:border-0">
      <div className="flex items-center justify-center">
        {isRating ? renderStars(value1 as number) : (
          <span className="text-sm font-medium text-foreground">{value1}</span>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center justify-center">
        {isRating ? renderStars(value2 as number) : (
          <span className="text-sm font-medium text-foreground">{value2}</span>
        )}
      </div>
    </div>
  );

  if (!inst1 || !inst2) return null;

  return (
    <div className={cn("bg-card border border-border rounded-xl p-6", className)}>
      <div className="flex items-center justify-center gap-2 mb-6">
        <Scale className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Compare Instruments</h3>
      </div>

      {/* Instrument Selectors */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Select value={instrument1} onValueChange={setInstrument1}>
          <SelectTrigger>
            <SelectValue placeholder="Select instrument" />
          </SelectTrigger>
          <SelectContent>
            {instrumentsData.map((inst) => (
              <SelectItem key={inst.id} value={inst.id} disabled={inst.id === instrument2}>
                {inst.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-center">
          <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
        </div>

        <Select value={instrument2} onValueChange={setInstrument2}>
          <SelectTrigger>
            <SelectValue placeholder="Select instrument" />
          </SelectTrigger>
          <SelectContent>
            {instrumentsData.map((inst) => (
              <SelectItem key={inst.id} value={inst.id} disabled={inst.id === instrument1}>
                {inst.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Instrument Headers */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <motion.div 
          key={inst1.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20"
        >
          <h4 className="font-bold text-foreground">{inst1.name}</h4>
          <p className="text-xs text-muted-foreground">{inst1.category}</p>
        </motion.div>
        
        <div className="flex items-center justify-center">
          <span className="text-xs text-muted-foreground font-medium">VS</span>
        </div>
        
        <motion.div 
          key={inst2.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20"
        >
          <h4 className="font-bold text-foreground">{inst2.name}</h4>
          <p className="text-xs text-muted-foreground">{inst2.category}</p>
        </motion.div>
      </div>

      {/* Comparison Grid */}
      <div className="bg-muted/30 rounded-lg p-4">
        <ComparisonRow label="Difficulty" value1={inst1.difficulty} value2={inst2.difficulty} icon={Zap} isRating />
        <ComparisonRow label="Popularity" value1={inst1.popularity} value2={inst2.popularity} icon={Users} isRating />
        <ComparisonRow label="Versatility" value1={inst1.versatility} value2={inst2.versatility} icon={Layers} isRating />
        <ComparisonRow label="Learning Curve" value1={inst1.learning_curve} value2={inst2.learning_curve} icon={Music} />
        <ComparisonRow label="Sound Range" value1={inst1.sound_range} value2={inst2.sound_range} icon={Volume2} />
        <ComparisonRow label="Portability" value1={inst1.portability} value2={inst2.portability} icon={Scale} />
        <ComparisonRow label="Price Range" value1={inst1.price_range} value2={inst2.price_range} icon={Star} />
      </div>

      {/* Best For Tags */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Best for:</p>
          <div className="flex flex-wrap gap-1">
            {inst1.best_for.map((genre) => (
              <span key={genre} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {genre}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2">Best for:</p>
          <div className="flex flex-wrap gap-1">
            {inst2.best_for.map((genre) => (
              <span key={genre} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentComparison;
