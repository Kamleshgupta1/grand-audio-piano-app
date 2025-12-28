
import React, { ReactNode, memo } from 'react';
import SEOHead from '../SEO/SEOHead';
import HowToSchema from '../SEO/HowToSchema';
import { HelmetProvider } from 'react-helmet-async';
import MusicToolbar from './MusicToolbar';

interface InstrumentPageWrapperProps { 
  children: ReactNode;
  title: string;
  description: string;
  instrumentType: string;
  borderColor?: string;
  route?: string;
  showMusicToolbar?: boolean;
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

const InstrumentPageWrapper = memo(({
  children,
  title,
  description,
  instrumentType,
  borderColor = 'border-primary',
  route = '/',
  showMusicToolbar = true
}: InstrumentPageWrapperProps) => {
  const howToSteps = generateHowToSteps(instrumentType);

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
      
      <div className="bg-gradient-to-b from-background to-background/95">
        <main className="container px-4 pt-10 pb-10">
          <div className={`max-w-5xl mx-auto border-2 rounded-xl p-6 ${borderColor}`}>
            {children}
            
            {/* Music Toolbar with Metronome, Tuner, Scale Reference */}
            {showMusicToolbar && (
              <div className="mt-8">
                <MusicToolbar />
              </div>
            )}
          </div>
        </main>
      </div>
    </HelmetProvider>
  );
});

// Add display name for better debugging
InstrumentPageWrapper.displayName = 'InstrumentPageWrapper';

export default InstrumentPageWrapper;
