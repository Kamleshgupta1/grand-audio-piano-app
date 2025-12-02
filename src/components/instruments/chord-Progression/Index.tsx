import { lazy, Suspense, useEffect } from "react";
import { Music, ChevronDown } from "lucide-react";
import InstrumentInterlink from '@/components/instruments/InstrumentInterlink';
import AppLayout from '@/components/layout/AppLayout';
import EnhancedSEO from '@/components/SEO/EnhancedSEO';
import { getInstrumentSEOData } from '@/utils/seo/instrumentSEO';

const LazyChordProgressionPlayerComponent = lazy(() => import("./ChordProgressionPage"));

const Index = () => {
  const seoData = getInstrumentSEOData('chord progression');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Chord Progression - Virtual Chord Progression Experience',
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  }, []);

  return (
    <>
      {seoData && (
        <EnhancedSEO
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          structuredData={seoData.structuredData}
          ogType="website"
          tags={['Chord Builder', 'Progressions', 'Music Theory']}
        />
      )}

      <AppLayout>
        <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 overflow-x-hidden bg-gradient-to-b from-background via-background to-muted/30 dark:from-background dark:via-background dark:to-muted/10">
          <div className="w-full max-w-screen-xl mx-auto space-y-8">
            <header className="text-center mb-6 md:mb-8">
              <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full text-xs font-medium text-primary animate-fade-in border border-primary/20">
                Virtual Chord Progression Experience
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 animate-fade-in flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '0.1s' }}>
                <span className="text-foreground">Chord Progression</span>
                <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">Studio</span>
                <Music className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-primary animate-pulse" />
              </h1>
              
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
                Build and explore chord progressions with our interactive music theory tool
              </p>
              
              <div className="flex justify-center mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <button 
                  onClick={() => document.getElementById('chord-app')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                >
                  Start Playing
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                </button>
              </div>
            </header>

            <main id="chord-app" className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <Suspense fallback={
                <div className="flex justify-center p-8">
                  <div className="h-96 w-full max-w-4xl bg-card/50 dark:bg-card/30 rounded-2xl flex flex-col items-center justify-center gap-4 border border-border/50">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground text-sm">Loading chord progression player...</p>
                  </div>
                </div>
              }>
                <LazyChordProgressionPlayerComponent />
              </Suspense>
            </main>
          </div>
        </div>
        <InstrumentInterlink currentInstrument="Chord Progression" />
      </AppLayout>
    </>
  );
};

export default Index;
