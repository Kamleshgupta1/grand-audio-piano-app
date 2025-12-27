import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  Timer, 
  Music2, 
  Scale,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Metronome from './Metronome';
import Tuner from './Tuner';
import ScaleReference from './ScaleReference';

type ToolType = 'metronome' | 'tuner' | 'scales' | null;

interface MusicToolbarProps {
  className?: string;
  defaultOpen?: boolean;
}

const MusicToolbar: React.FC<MusicToolbarProps> = ({ 
  className,
  defaultOpen = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
  const [activeTool, setActiveTool] = useState<ToolType>(null);

  const tools = [
    { id: 'metronome' as const, label: 'Metronome', icon: Timer, color: 'text-orange-500' },
    { id: 'tuner' as const, label: 'Tuner', icon: Music2, color: 'text-blue-500' },
    { id: 'scales' as const, label: 'Scales', icon: Scale, color: 'text-green-500' },
  ];

  const handleToolClick = (toolId: ToolType) => {
    if (activeTool === toolId) {
      setActiveTool(null);
    } else {
      setActiveTool(toolId);
      if (!isExpanded) setIsExpanded(true);
    }
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Toolbar Header */}
      <div className="flex items-center justify-between bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border rounded-t-xl px-4 py-2">
        <div className="flex items-center gap-2">
          <Music2 className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">Music Tools</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Tool buttons */}
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => handleToolClick(tool.id)}
              className={cn(
                "gap-1.5 text-xs",
                activeTool === tool.id && "shadow-md"
              )}
            >
              <tool.icon className={cn("w-4 h-4", activeTool !== tool.id && tool.color)} />
              <span className="hidden sm:inline">{tool.label}</span>
            </Button>
          ))}
          
          {/* Expand/Collapse button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && activeTool && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-card/60 dark:bg-card/40 backdrop-blur-sm border-x border-b border-border rounded-b-xl p-4 relative">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => setActiveTool(null)}
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Tool Components */}
              <AnimatePresence mode="wait">
                {activeTool === 'metronome' && (
                  <motion.div
                    key="metronome"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Metronome />
                  </motion.div>
                )}
                
                {activeTool === 'tuner' && (
                  <motion.div
                    key="tuner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Tuner />
                  </motion.div>
                )}
                
                {activeTool === 'scales' && (
                  <motion.div
                    key="scales"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ScaleReference />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicToolbar;
