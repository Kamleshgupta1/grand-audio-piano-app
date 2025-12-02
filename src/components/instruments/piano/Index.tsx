import React, { useEffect } from 'react';
import { lazy, Suspense } from "react";
import { Piano, ChevronDown } from "lucide-react";
import InstrumentInterlink from '@/components/instruments/InstrumentInterlink';
import InstrumentFeatures from '@/components/instruments/InstrumentFeatures';
import AppLayout from '@/components/layout/AppLayout';

const LazyVirtualPianoComponent = lazy(() => 
  import("@/components/instruments/piano/piano1/Piano")
);

const Index = () => {
  useEffect(() => {
    // Track page view for analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Piano - Virtual Piano Experience',
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  }, []);

  return (
    <AppLayout
      title="Virtual Piano - Interactive Piano Experience"
      description="Play, learn and create music with HarmonyHub's virtual piano. Realistic sounds, recording features, and real-time collaboration."
      keywords="virtual piano, online piano, piano simulator, learn piano, acoustic piano"
      instrumentType="Piano"
    >
      <div className="min-h-screen flex flex-col items-center justify-center py-8 overflow-x-hidden bg-gradient-to-b from-background to-muted/30 border-8 border-primary/20 border-double rounded-2xl m-4">
        <div className="w-full max-w-screen-xl mx-auto space-y-8">
          <header className="text-center mt-6 md:mb-12">
            <div className="inline-block mb-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-medium animate-fade-in text-primary">
              Virtual Piano Experience
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-3 animate-fade-in flex items-center justify-center gap-2 text-foreground" style={{ animationDelay: '0.1s' }}>
              Piano<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Studio</span>
              <Piano className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 ml-2 text-primary animate-pulse" />
            </h1>
            
            <div className="flex justify-center mt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <button 
                onClick={() => document.getElementById('piano-app')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
                aria-label="Scroll to piano app"
              >
                Start Playing
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </header>
          
          <main id="piano-app" className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <Suspense fallback={
              <div className="flex justify-center p-8 animate-pulse">
                <div className="h-96 w-full max-w-4xl bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                  Loading piano...
                </div>
              </div>
            }>
              <LazyVirtualPianoComponent />
            </Suspense>
          </main>
        </div>
      </div>

      <InstrumentFeatures instrumentName="Piano" />
      <InstrumentInterlink currentInstrument="Piano" />
    </AppLayout>
  );
};

export default Index;
