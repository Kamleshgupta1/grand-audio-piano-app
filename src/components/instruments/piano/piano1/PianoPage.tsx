
import { useState } from 'react';
import InstrumentPageWrapper from '@/components/instruments/InstrumentPageWrapper';
import Piano from '@/components/instruments/piano/piano1/Piano';
import { lockToLandscape } from "@/components/landscapeMode/lockToLandscape";
import LandscapeInstrumentModal from '@/components/landscapeMode/LandscapeInstrumentModal';

const PianoPage = () => {
  const [open, setOpen] = useState(false);
  
  const handleOpen = async () => {
    await lockToLandscape();
    setOpen(true);
  };

  return (
    <InstrumentPageWrapper
      title="Virtual Piano"
      description="Play piano online with this interactive virtual instrument. Learn piano notes and create beautiful melodies."
      route="/piano"
      instrumentType="Piano"
      borderColor="border-blue-600"
    >
      <div className="text-center mb-2">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 animate-fade-in">Virtual Piano</h1>
        <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <div className="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-2 p-2 rounded-md mb-2">
            <p>Play the piano by clicking on the keys or using your computer keyboard.</p>
          </div>
          <div className="landscape-warning text-center text-xs text-muted-foreground bg-purple-100 p-2 border border-purple-400 dark:bg-white/5 p-2 rounded-md mb-6">
            <p>For the best experience, expand to full screen.
              <strong onClick={handleOpen} className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] cursor-pointer">
                Click here to expand
              </strong>
            </p>
            <LandscapeInstrumentModal isOpen={open} onClose={() => setOpen(false)}>
              <Piano />
            </LandscapeInstrumentModal>
          </div>
        </div>
      </div>

      <div className="w-full bg-white animate-scale-in" style={{ animationDelay: '200ms' }}>
        <Piano />
      </div>
    </InstrumentPageWrapper>
  );
};

export default PianoPage;
