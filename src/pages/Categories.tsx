
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import SectionTitle from '@/components/ui-components/SectionTitle';
import CategoryCard from '@/components/layout/CategoryCard';
import { ChevronRight, Music } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface CategoryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  icon2: string;
  imageUrl: string;
  to: string;
  color: string;
  instruments: Array<{ name: string; link: string }>;
  featured?: { name: string; description: string; link: string };
}

const Categories = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const allCategories: CategoryItem[] = [
    {
      id: 'strings',
      title: 'String Instruments',
      description: 'Explore violins, guitars, and more',
      icon: '🎻',
      imageUrl: '/images/guitar/OnlineVirtualGuitarInstrument2.png',
      to: '/categories/strings',
      color: 'bg-amber-100 dark:bg-amber-950',
      icon2: '🎻',
      instruments: [
        { name: 'Violin', link: '/instruments/violin' },
        { name: 'Guitar', link: '/instruments/guitar' },
        { name: 'Harp', link: '/instruments/harp' },
        { name: 'Sitar', link: '/instruments/sitar' },
        { name: 'Veena', link: '/instruments/vina' },
        { name: 'Banjo', link: '/instruments/banjo' }
      ],
      featured: {
        name: 'Guitar',
        description: 'Strum the virtual guitar 🎸',
        link: '/guitar' 
      }
    },
    {
      id: 'wind',
      title: 'Wind Instruments',
      description: 'Discover flutes, saxophones, and more',
      icon: '🎺',
      imageUrl: '/images/saxophone/OnlineVirtualSaxophoneInstrument3.png',
      to: '/categories/wind',
      color: 'bg-blue-100 dark:bg-blue-950',
      icon2: '🎷',
      instruments: [
        { name: 'Flute', link: '/flute' },
        { name: 'Saxophone', link: '/instruments/saxophone' },
        { name: 'Trumpet', link: '/instruments/trumpet' },
        { name: 'Harmonica', link: '/instruments/harmonica' },
      ]
    },
    {
      id: 'percussion',
      title: 'Percussion Instruments',
      description: 'Find drums, xylophones, and more',
      icon: '🥁',
      imageUrl: '/images/tabla/OnlineVirtualTablaInstrument3.png',
      to: '/categories/percussion',
      color: 'bg-red-100 dark:bg-red-950',
      icon2: '🥁',
      instruments: [
        { name: 'Drum Kit', link: '/instruments/drums' },
        { name: 'Xylophone', link: '/instruments/xylophone' },
        { name: 'Kalimba', link: '/instruments/kalimba' },
        { name: 'Marimba', link: '/instruments/marimba' },
        { name: 'Theremin', link: '/instruments/theremin' },
        { name: 'Tabla', link: '/instruments/tabla' },
      ]
    },
    {
      id: 'keyboard',
      title: 'Keyboard Instruments',
      description: 'Browse pianos, synths, and more',
      icon: '🎹',
      imageUrl: '/images/piano/OnlineVirtualPianoInstrument3.png',
      to: '/categories/keyboard',
      color: 'bg-purple-100 dark:bg-purple-950',
      icon2: '🎹',
      instruments: [
        { name: 'Piano', link: '/piano' },
      ],
      featured: {
        name: 'Piano',
        description: 'Play our interactive virtual piano 🎹',
        link: '/piano' 
      }
    },
    {
      id: 'electronic',
      title: 'Electronic Instruments',
      description: 'Play drum machine, chord progression, and more',
      icon: '🧩',
      imageUrl: '/images/drummachine/OnlineVirtualDrumMachineInstrument.png',
      to: '/categories/electronic',
      color: 'bg-purple-100 dark:bg-purple-950',
      icon2: '🧩',
      instruments: [
        { name: 'Theremin', link: '/instruments/theremin' },
        { name: 'Drum Machine', link: '/drummachine' },
        { name: 'Chord Progression Player', link: '/chordprogression' }
      ],
    },
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <AppLayout>
      <div className='bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/5 dark:from-primary/8 dark:via-secondary/5 dark:to-accent/3'>
      {/* Header Section - Consistent with other pages */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 ">
        <SectionTitle
          title="Browse All Categories"
          subtitle="Discover our comprehensive collection of musical instruments organized by families and types"
        />
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {allCategories.map((category) => (
            <div key={category.id} className="group h-full flex flex-col">
              {/* Main Category Card - Fixed height */}
                <CategoryCard
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  imageUrl={category.imageUrl}
                  to={category.to}
                  color=""
                  icon2={category.icon2}
                  id={category.id}
                />

              {/* Instruments Toggle Button */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="mt-3 w-full px-4 py-3 rounded-lg bg-card dark:bg-card/60 border border-border dark:border-border/60 hover:bg-card/50 dark:hover:bg-card/40 transition-all duration-300 flex items-center justify-between group/btn hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {category.instruments.length} Instruments
                  </span>
                </div>
                <ChevronRight 
                  className="w-5 h-5 text-primary transition-transform duration-300"
                  style={{
                    transform: expandedCategory === category.id ? 'rotate(90deg)' : 'rotate(0deg)'
                  }}
                />
              </button>

              {/* Expandable Instruments List - Positioned to not affect card height */}
              {expandedCategory === category.id && (
                <div className="mt-3 p-4 rounded-lg bg-gradient-to-br from-primary/8 to-secondary/8 dark:from-primary/15 dark:to-secondary/15 border border-primary/20 dark:border-primary/30 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {category.instruments.map((instrument, index) => (
                    <Link
                      key={index}
                      to={instrument.link}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-foreground dark:text-muted-foreground bg-card/50 dark:bg-card/40 hover:bg-card/60 dark:hover:bg-card/30 hover:text-primary dark:hover:text-primary/80 transition-all duration-200 group/item"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover/item:bg-primary transition-all" />
                        <span>{instrument.name}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Featured Instrument Card */}
              {category.featured && (
                <div className="mt-3 p-4 rounded-lg bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent dark:from-primary/15 dark:via-secondary/8 border border-primary/30 dark:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/60 dark:hover:border-primary/70 group/featured">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-primary flex items-center gap-1.5 mb-1">
                        ⭐ {category.featured.name}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{category.featured.description}</p>
                    </div>
                    <Link
                      to={category.featured.link}
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary dark:text-primary/80 dark:hover:text-white text-xs font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-1"
                    >
                      Play
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>


          {/* Bottom CTA Section */}

        <div className="mt-16 sm:mt-24 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/15 dark:to-secondary/15 border border-primary/25 dark:border-primary/35 text-center">

          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Ready to Play?</h3>

          <p className="text-muted-foreground mb-4">Select a category above or explore all instruments</p>

          <Link

            to="/explore"

            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 hover:scale-105"

          >

            Explore All Instruments

            <ChevronRight className="w-5 h-5" />

          </Link>

        </div>
      </div>

      
      </div>
    </AppLayout>
  );
};

export default Categories;
