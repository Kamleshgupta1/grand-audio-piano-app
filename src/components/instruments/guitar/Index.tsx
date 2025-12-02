import React, { useState, useEffect } from 'react';
import { lazy, Suspense } from "react";
import { Music, Guitar, ChevronDown } from "lucide-react";
import InstrumentInterlink from '@/components/instruments/InstrumentInterlink';
import InstrumentFeatures from '@/components/instruments/InstrumentFeatures';
import AppLayout from '@/components/layout/AppLayout';

const LazyVirtualGuitarComponent = lazy(() => import("./VirtualGuitarComponent"));
const LazyVirtualGuitar2Component = lazy(() => import("./Guitar2/VirtualGuitar"));
const LazyVirtualGuitar3Component = lazy(() => import("./guitar3/GuitarPage"));

const Index = () => {
  const [selected, setSelected] = useState('Guitar 1');
  
  useEffect(() => {    
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Guitar - Virtual Guitar Experience',
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  }, []);

  return (
    <AppLayout
      title="Virtual Guitar - Interactive Guitar Experience"
      description="Play, learn and create music with HarmonyHub's virtual guitar. Multiple guitar types with realistic sounds and recording features."
      keywords="virtual guitar, online guitar, guitar simulator, learn guitar, acoustic guitar, electric guitar"
      instrumentType="Guitar"
    >
      <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 overflow-x-hidden bg-gradient-to-b from-background to-muted/30 border-8 border-primary/20 border-double rounded-2xl m-4">
        <div className="w-full max-w-screen-xl mx-auto space-y-8">
          <header className="text-center mb-6 md:mb-12">
            <div className="inline-block mb-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-medium animate-fade-in text-primary">
              Virtual Guitar Experience
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-3 animate-fade-in flex items-center justify-center gap-2 text-foreground" style={{ animationDelay: '0.1s' }}>
              Guitar<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">scape</span>
              <Guitar className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 ml-2 text-primary animate-pulse" />
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Explore the world of music with our digital instrument. Play, learn, and create beautiful melodies.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center text-sm text-muted-foreground bg-card shadow-sm px-3 py-1.5 rounded-full border border-border">
                <Music className="w-4 h-4 mr-1.5 text-primary" />
                Interactive
              </div>
              <div className="flex items-center text-sm text-muted-foreground bg-card shadow-sm px-3 py-1.5 rounded-full border border-border">
                <Guitar className="w-4 h-4 mr-1.5 text-primary" />
                Multiple Guitar Types
              </div>
            </div>

            <div className="flex justify-center mt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <button 
                onClick={() => document.getElementById('guitar-app')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
                aria-label="Scroll to guitar app"
              >
                Start Playing
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
            
            <div className="flex gap-3 justify-center mt-3">
              {['Guitar 1', 'Guitar 2', 'Guitar 3'].map((option) => (
                <label 
                  key={option}
                  className={`px-5 py-2 border-2 rounded-full font-medium cursor-pointer transition-all duration-300 select-none ${
                    selected === option 
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                      : 'bg-card text-card-foreground border-border hover:bg-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="instrument"
                    value={option}
                    className="hidden"
                    onClick={() => document.getElementById('guitar-app')?.scrollIntoView({ behavior: 'smooth' })}
                    checked={selected === option}
                    onChange={() => setSelected(option)}
                  />
                  Design {option.split(' ')[1]}
                </label>
              ))}
            </div>
          </header>
          
          <main id="guitar-app" className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <Suspense fallback={
              <div className="flex justify-center p-8 animate-pulse">
                <div className="h-96 w-full max-w-4xl bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                  Loading guitar...
                </div>
              </div>
            }>
              {selected === 'Guitar 1' && <LazyVirtualGuitarComponent />}
              {selected === 'Guitar 2' && <LazyVirtualGuitar2Component />}
              {selected === 'Guitar 3' && <LazyVirtualGuitar3Component />}
            </Suspense>
          </main>
        </div>
      </div>

      <InstrumentFeatures instrumentName="Guitar" />
      <InstrumentInterlink currentInstrument="Guitar" />
    </AppLayout>
  );
};

export default Index;
