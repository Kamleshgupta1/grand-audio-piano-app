import React, { lazy, Suspense, useEffect, useState } from "react";
import { Music, ChevronDown } from "lucide-react";
import InstrumentInterlink from '@/components/instruments/InstrumentInterlink';
import AppLayout from '@/components/layout/AppLayout';
import EnhancedSEO from '@/components/SEO/EnhancedSEO';
import { getInstrumentSEOData } from '@/utils/seo/instrumentSEO';

interface InstrumentVariant {
  id: string;
  label: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  componentProps?: Record<string, any>;
}

interface InstrumentPageLayoutProps {
  instrumentName: string;
  instrumentId: string;
  variants: InstrumentVariant[];
  defaultVariant?: string;
  accentColor?: string;
  features?: string[];
}

const InstrumentPageLayout: React.FC<InstrumentPageLayoutProps> = ({
  instrumentName,
  instrumentId,
  variants,
  defaultVariant,
  accentColor = 'from-primary to-accent',
  features = ['Interactive', 'Realistic Sounds']
}) => {
  const [selected, setSelected] = useState(defaultVariant || variants[0]?.id || '');
  
  // Get SEO data
  const seoData = getInstrumentSEOData(instrumentName.toLowerCase());

  useEffect(() => {
    // Track page view for analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'page_view', {
        page_title: `${instrumentName} - Virtual ${instrumentName} Experience`,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  }, [instrumentName]);

  const scrollToInstrument = () => {
    document.getElementById(`${instrumentId}-app`)?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectedVariant = variants.find(v => v.id === selected);

  return (
    <>
      {seoData && (
        <EnhancedSEO
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          structuredData={seoData.structuredData}
          ogImage={seoData.ogImage}
          ogType="website"
          tags={features}
        />
      )}
      
      <AppLayout>
        <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 overflow-x-hidden bg-gradient-to-b from-background via-background to-muted/30 dark:from-background dark:via-background dark:to-muted/10">
          <div className="w-full max-w-screen-xl mx-auto space-y-8">
            {/* Header Section */}
            <header className="text-center mb-6 md:mb-12">
              {/* Badge */}
              <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full text-xs font-medium text-primary animate-fade-in border border-primary/20">
                Virtual {instrumentName} Experience
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-fade-in flex items-center justify-center gap-3" style={{ animationDelay: '0.1s' }}>
                <span className="text-foreground">{instrumentName}</span>
                <span className={`bg-gradient-to-r ${accentColor} bg-clip-text text-transparent`}>Studio</span>
                <Music className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-primary animate-pulse" />
              </h1>
              
              {/* Description */}
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
                Play, customize, and master the {instrumentName.toLowerCase()} with our interactive virtual instrument
              </p>
              
              {/* Feature Tags */}
              <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center text-sm text-muted-foreground bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-sm px-4 py-2 rounded-full border border-border/50 hover:border-primary/30 transition-all duration-300"
                  >
                    <Music className="w-4 h-4 mr-2 text-primary" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Scroll Button */}
              <div className="flex justify-center mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <button 
                  onClick={scrollToInstrument}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                  aria-label={`Start playing ${instrumentName}`}
                >
                  Start Playing
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                </button>
              </div>
              
              {/* Design Variant Selector */}
              {variants.length > 1 && (
                <div className="flex flex-wrap gap-3 justify-center mt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelected(variant.id);
                        scrollToInstrument();
                      }}
                      className={`
                        px-5 py-2.5 rounded-full font-medium text-sm
                        transition-all duration-300 ease-out
                        border-2 
                        ${selected === variant.id 
                          ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25' 
                          : 'bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted'
                        }
                        active:scale-95
                      `}
                    >
                      {variant.label}
                    </button>
                  ))}
                </div>
              )}
            </header>

            {/* Instrument Component */}
            <main id={`${instrumentId}-app`} className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <Suspense fallback={
                <div className="flex justify-center p-8">
                  <div className="h-96 w-full max-w-4xl bg-card/50 dark:bg-card/30 rounded-2xl flex flex-col items-center justify-center gap-4 border border-border/50 backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground text-sm">Loading {instrumentName.toLowerCase()}...</p>
                  </div>
                </div>
              }>
                {selectedVariant && (
                  <selectedVariant.component {...(selectedVariant.componentProps || {})} />
                )}
              </Suspense>
            </main>
          </div>
        </div>

        {/* Instrument Interlink */}
        <InstrumentInterlink currentInstrument={instrumentName} />
      </AppLayout>
    </>
  );
};

export default InstrumentPageLayout;
