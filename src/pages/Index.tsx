import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/ui-components/HeroSection';
import CategoryCard from '@/components/layout/CategoryCard';
import InstrumentCard from '@/components/layout/InstrumentCard';
import QuickAccessPanel from '@/components/ui-components/QuickAccessPanel';
import FloatingMusicNotes from '@/components/ui-components/FloatingMusicNotes';
import GamificationPanel from '@/components/ui-components/GamificationPanel';
import InstrumentComparison from '@/components/ui-components/InstrumentComparison';
import SkeletonCard from '@/components/ui-components/SkeletonCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useGamification } from '@/hooks/useGamification';

import { Button } from '@/components/ui/button';
import { Wind, Music2, Mic, Volume2, Piano, Guitar, Music, FileMusic, Drum, MicVocal, ArrowRight, Trophy, BadgeDollarSign, ShieldCheck, Headphones, GemIcon, Star } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const premiumFeatures = [
  {
    icon: <Trophy className="h-5 w-5 text-yellow-400" />,
    title: 'Exclusive Instrument Collection',
    description: 'Access our library of 500+ premium instruments with studio-quality sound samples'
  },
  {
    icon: <BadgeDollarSign className="h-5 w-5 text-yellow-400" />,
    title: 'Advanced Recording Studio',
    description: 'Professional-grade recording tools with unlimited storage and advanced mixing capabilities'
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-yellow-400" />,
    title: 'Expert-Led Masterclasses',
    description: 'Weekly live workshops and on-demand tutorials from Grammy-winning musicians'
  },
  {
    icon: <Headphones className="h-5 w-5 text-yellow-400" />,
    title: 'Priority Support',
    description: '24/7 access to our team of music experts for personalized guidance and technical help'
  }
];

const categories = [
  {
    id: 'strings',
    title: 'String Instruments',
    description: 'Guitars, violins, cellos and more',
    icon: <Guitar size={20} />,
    to: '/categories/strings',
    color: 'bg-amber-100 dark:bg-amber-950',
    icon2: '🎻',
  },
  {
    id: 'keyboard',
    title: 'Keyboard Instruments',
    description: 'Pianos, keyboards, synthesizers',
    icon: <Piano size={20} />,
    to: '/categories/keyboard',
    color: 'bg-blue-100 dark:bg-blue-950',
    icon2: '🎹',
  },
  {
    id: 'percussion',
    title: 'Percussion Instruments',
    description: 'Drums, cymbals and more',
    icon: <Drum size={20} />,
    to: '/categories/percussion',
    color: 'bg-red-100 dark:bg-red-950',
    icon2: '🥁',
  },
  {
    id: 'wind',
    title: 'Wind Instruments',
    description: 'Microphones and vocal processors',
    icon: <MicVocal size={20} />,
    to: '/categories/wind',
    color: 'bg-purple-100 dark:bg-purple-950',
    icon2: '🎤',
  }
];

const featuredInstruments = [
  {
    id: 'piano',
    name: 'Grand Piano',
    category: 'Keyboard',
    imageUrl: '/images/piano/OnlineVirtualPianoInstrument3.png',
    isFeatured: true,
  },
  {
    id: 'guitar',
    name: 'Acoustic Guitar',
    category: 'String',
    imageUrl: '/images/guitar/OnlineVirtualGuitarInstrument2.png',
    isFeatured: true,
  },
  {
    id: 'drums',
    name: 'Professional Drum Kit',
    category: 'Percussion',
    imageUrl: '/images/drums/OnlineVirtualDrumsInstrument2.png',
    isFeatured: true
  }
];

const Index = () => {
  const { addToRecent } = useFavorites();
  const { recordPractice } = useGamification();

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'HarmonyHub - Virtual Musical Instruments',
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen relative">
        {/* Floating Music Notes Background */}
        <FloatingMusicNotes count={12} />
        
        <HeroSection
          title="Discover the World of Music"
          subtitle="Explore, play, and master musical instruments from around the globe"
          ctaText="Explore Instruments"
          ctaLink="/explore"
          secondaryCtaText="Try Piano"
          secondaryCtaLink="/piano"
          imageUrl="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1920&q=80"
        />

        {/* Quick Access & Gamification Section */}
        <section className="py-8 px-4 bg-background">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Access Panel - Takes 2 columns */}
              <div className="lg:col-span-2">
                <QuickAccessPanel />
              </div>
              
              {/* Gamification Panel - Sidebar */}
              <div className="lg:col-span-1">
                <GamificationPanel />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto">
            <div className="mb-10 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">Featured Instruments</h2>
              <p className="text-lg text-muted-foreground">Top picks and popular instruments to explore</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredInstruments.map((instrument) => (
                <InstrumentCard
                  key={instrument.id}
                  id={instrument.id}
                  name={instrument.name}
                  category={instrument.category}
                  imageUrl={instrument.imageUrl}
                  isFeatured={instrument.isFeatured}
                />
              ))}
            </div>
            
            <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/explore">
                <Button variant="outline" size="lg" className="group hover-scale shadow-md hover:shadow-xl">
                  Explore All Instruments
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-muted/30 dark:bg-muted/20">
          <div className="container mx-auto">
            <div className="mb-10 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">Browse by Category</h2>
              <p className="text-lg text-muted-foreground">Explore instruments by category and find the perfect match for your musical journey</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  to={category.to}
                  color={category.color}
                  icon2={category.icon2}
                  
                />
              ))}
            </div>
            
            <div className="mt-8 mb-5 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Link to="/categories">
                <Button variant="outline" size="lg" className="group hover-scale shadow-md hover:shadow-xl">
                  View All Categories
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2 animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                  Try Our Interactive Piano
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Experience music hands-on with our interactive piano. Play, record, and share your creations directly from your browser.
                </p>
                <Link to="/piano">
                  <Button size="lg" className="hover-scale shadow-lg hover:shadow-xl">
                    Go to Piano
                    <Piano className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <h2 className="mt-8 text-2xl font-heading font-bold text-foreground mb-4">
                  Try Other Interesting Instruments
                </h2>
     <div className="mt-4 mb-4 mr-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
  <Link to="/violin">
    <Button className="w-full justify-between bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:scale-105 transition-transform shadow-lg">
      <span className="flex items-center gap-2">
        <Music className="h-4 w-4" /> Violin
      </span>
    </Button>
  </Link>

  <Link to="/flute">
    <Button className="w-full justify-between bg-gradient-to-r from-blue-400 to-indigo-500 text-white hover:scale-105 transition-transform shadow-lg">
      <span className="flex items-center gap-2">
        <Wind className="h-4 w-4" /> Flute
      </span>
    </Button>
  </Link>

  <Link to="/veena">
    <Button className="w-full justify-between bg-gradient-to-r from-indigo-400 to-violet-500 text-white hover:scale-105 transition-transform shadow-lg">
      <span className="flex items-center gap-2">
        <Music2 className="h-4 w-4" /> Veena
      </span>
    </Button>
  </Link>

  <Link to="/harmonica">
    <Button className="w-full justify-between bg-gradient-to-r from-violet-400 to-purple-500 text-white hover:scale-105 transition-transform shadow-lg">
      <span className="flex items-center gap-2">
        <Mic className="h-4 w-4" /> Harmonica
      </span>
    </Button>
  </Link>

  <Link to="/saxophone">
    <Button className="w-full justify-between bg-gradient-to-r from-purple-400 to-fuchsia-500 text-white hover:scale-105 transition-transform shadow-lg">
      <span className="flex items-center gap-2">
        <Volume2 className="h-4 w-4" /> Saxophone
      </span>
    </Button>
  </Link>

  <Link to="/xylophone">
    <Button className="w-full justify-between bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 transition-transform shadow-lg">
      <span className="flex items-center gap-2">
        <Drum className="h-4 w-4" /> Xylophone
      </span>
    </Button>
  </Link>
</div>

              </div>
              <div className="md:w-1/2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl hover-lift">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=800&q=80" 
                    alt="Interactive Virtual Piano - Play music online" 
                    className="rounded-2xl shadow-xl hover:scale-105 transition-transform duration-700 w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Index;
