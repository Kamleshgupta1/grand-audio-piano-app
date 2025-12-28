import React, { ReactNode, memo, useEffect } from 'react';
import SEOHead from '../SEO/SEOHead';
import HowToSchema from '../SEO/HowToSchema';
import { HelmetProvider } from 'react-helmet-async';
import MusicToolbar from './MusicToolbar';
import { usePersistentGamification } from '@/hooks/usePersistentGamification';
import { usePersistentFavorites } from '@/hooks/usePersistentFavorites';
import { motion } from 'framer-motion';

interface InstrumentPageWrapperProps { 
  children: ReactNode;
  title: string;
  description: string;
  instrumentType: string;
  borderColor?: string;
  route?: string;
  showMusicToolbar?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
}

// Generate HowTo steps for instrument tutorials
const generateHowToSteps = (instrumentType: string) => [
  {
    name: `Open the ${instrumentType} Interface`,
    text: `Navigate to the ${instrumentType.toLowerCase()} page on HarmonyHub to access the interactive virtual ${instrumentType.toLowerCase()}.`
  },
  {
    name: 'Familiarize with Controls',
    text: `Explore the ${instrumentType.toLowerCase()} controls including volume, settings, and any available sound variations.`
  },
  {
    name: 'Start Playing',
    text: `Click on the ${instrumentType.toLowerCase()} elements or use your keyboard to play notes and create music.`
  },
  {
    name: 'Use Music Tools',
    text: 'Access the metronome for timing, tuner for pitch accuracy, and scale reference for learning music theory.'
  },
  {
    name: 'Record Your Performance',
    text: 'Use the recording feature to capture your performance and share it with others.'
  }
];

// Instrument-specific gradient themes
const getInstrumentTheme = (instrumentType: string) => {
  const themes: Record<string, { from: string; to: string; border: string; glow: string }> = {
    'Piano': { from: 'from-violet-950', to: 'to-indigo-950', border: 'border-violet-500/30', glow: 'shadow-violet-500/20' },
    'Guitar': { from: 'from-amber-950', to: 'to-orange-950', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
    'Drums': { from: 'from-red-950', to: 'to-rose-950', border: 'border-red-500/30', glow: 'shadow-red-500/20' },
    'Violin': { from: 'from-amber-950', to: 'to-yellow-950', border: 'border-amber-400/30', glow: 'shadow-amber-400/20' },
    'Flute': { from: 'from-sky-950', to: 'to-cyan-950', border: 'border-sky-500/30', glow: 'shadow-sky-500/20' },
    'Saxophone': { from: 'from-yellow-950', to: 'to-amber-950', border: 'border-yellow-500/30', glow: 'shadow-yellow-500/20' },
    'Harmonica': { from: 'from-blue-950', to: 'to-indigo-950', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
    'Xylophone': { from: 'from-pink-950', to: 'to-purple-950', border: 'border-pink-500/30', glow: 'shadow-pink-500/20' },
    'Veena': { from: 'from-orange-950', to: 'to-red-950', border: 'border-orange-500/30', glow: 'shadow-orange-500/20' },
    'Sitar': { from: 'from-orange-950', to: 'to-amber-950', border: 'border-orange-400/30', glow: 'shadow-orange-400/20' },
    'Harp': { from: 'from-teal-950', to: 'to-emerald-950', border: 'border-teal-500/30', glow: 'shadow-teal-500/20' },
    'Trumpet': { from: 'from-yellow-950', to: 'to-orange-950', border: 'border-yellow-600/30', glow: 'shadow-yellow-600/20' },
    'Banjo': { from: 'from-amber-950', to: 'to-yellow-950', border: 'border-amber-600/30', glow: 'shadow-amber-600/20' },
    'Tabla': { from: 'from-orange-950', to: 'to-red-950', border: 'border-orange-600/30', glow: 'shadow-orange-600/20' },
    'Kalimba': { from: 'from-emerald-950', to: 'to-teal-950', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
    'Marimba': { from: 'from-rose-950', to: 'to-pink-950', border: 'border-rose-500/30', glow: 'shadow-rose-500/20' },
    'Theremin': { from: 'from-purple-950', to: 'to-fuchsia-950', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
  };
  return themes[instrumentType] || { from: 'from-slate-950', to: 'to-gray-950', border: 'border-primary/30', glow: 'shadow-primary/20' };
};

const InstrumentPageWrapper = memo(({
  children,
  title,
  description,
  instrumentType,
  borderColor,
  route = '/',
  showMusicToolbar = true,
  gradientFrom,
  gradientTo
}: InstrumentPageWrapperProps) => {
  const howToSteps = generateHowToSteps(instrumentType);
  const theme = getInstrumentTheme(instrumentType);
  const { recordPractice } = usePersistentGamification();
  const { addToRecent } = usePersistentFavorites();

  // Track instrument usage
  useEffect(() => {
    const instrumentId = instrumentType.toLowerCase().replace(/\s+/g, '-');
    addToRecent(instrumentId);
    
    // Record practice after 30 seconds
    const practiceTimer = setTimeout(() => {
      recordPractice(instrumentId, 1);
    }, 30000);

    return () => clearTimeout(practiceTimer);
  }, [instrumentType, addToRecent, recordPractice]);

  return (
    <HelmetProvider>
      <SEOHead
        title={title}
        description={description}
        instrumentType={instrumentType}
        route={route}
        keywords={`virtual ${instrumentType.toLowerCase()}, online ${instrumentType.toLowerCase()}, ${instrumentType.toLowerCase()} simulator, play ${instrumentType.toLowerCase()} online, music instrument`}
      />
      
      <HowToSchema
        name={`How to Play Virtual ${instrumentType} Online`}
        description={`Learn how to play the virtual ${instrumentType.toLowerCase()} on HarmonyHub. This interactive tutorial guides you through the controls and features.`}
        steps={howToSteps}
        totalTime="PT10M"
        tool={['Web browser', 'Speakers or headphones']}
      />
      
      <div className={`min-h-screen bg-gradient-to-br ${gradientFrom || theme.from} ${gradientTo || theme.to} relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/3 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <main className="container relative z-10 px-4 pt-10 pb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`max-w-5xl mx-auto border-2 rounded-2xl p-6 backdrop-blur-sm bg-background/5 ${borderColor || theme.border} shadow-2xl ${theme.glow}`}
          >
            {children}
            
            {/* Music Toolbar with Metronome, Tuner, Scale Reference */}
            {showMusicToolbar && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8"
              >
                <MusicToolbar />
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </HelmetProvider>
  );
});

// Add display name for better debugging
InstrumentPageWrapper.displayName = 'InstrumentPageWrapper';

export default InstrumentPageWrapper;
