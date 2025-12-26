
import { useState, useEffect, useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import SectionTitle from '@/components/ui-components/SectionTitle';
import InstrumentCard from '@/components/layout/InstrumentCard';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';


const allInstruments = [
  {
    id: 'violin',
    name: 'Classical Violin',
    category: 'String',
    imageUrl: '/images/violin/OnlineVirtualViolinInstrument3.png'
  },
  {
    id: 'piano',
    name: 'Grand Piano',
    category: 'Keyboard',
    imageUrl: '/images/piano/OnlineVirtualPianoInstrument3.png'
  },
  {
    id: 'saxophone',
    name: 'Professional Saxophone',
    category: 'Wind',
    imageUrl: '/images/saxophone/OnlineVirtualSaxophoneInstrument3.png'
  },
  {
    id: 'guitar',
    name: 'Acoustic Guitar',
    category: 'String',
    imageUrl: '/images/guitar/OnlineVirtualGuitarInstrument2.png'
  },
  {
    id: 'drums',
    name: 'Drum Kit',
    category: 'Percussion',
    imageUrl: '/images/drums/OnlineVirtualDrumsInstrument2.png'
  },
  {
    id: 'trumpet',
    name: 'Trumpet',
    category: 'Wind',
    imageUrl: '/images/trumpet/OnlineVirtualTrumpetInstrument1.png'
  },
  {
    id: 'veena',
    name: 'Veena',
    category: 'String',
    imageUrl: '/images/veena/OnlineVirtualVeenaInstrument1.png'
  },
  {
    id: 'banjo',
    name: 'Banjo',
    category: 'String',
    imageUrl: '/images/banjo/OnlineVirtualBanjoInstrument3.png'
  },
  {
    id: 'xylophone',
    name: 'Xylophone',
    category: 'Percussion',
    imageUrl: '/images/xylophone/OnlineVirtualXylophoneInstrument2.png'
  },
  {
    id: 'flute',
    name: 'Flute',
    category: 'Wind',
    imageUrl: '/images/flute/OnlineVirtualFluteInstrument2.png'
  },
  {
    id: 'sitar',
    name: 'Sitar',
    category: 'String',
    imageUrl: '/images/sitar/OnlineVirtualSitarInstrument1.png'
  },
  {
    id: 'harmonica',
    name: 'Harmonica',
    category: 'Wind',
    imageUrl: '/images/harmonica/OnlineVirtualHarmonicaInstrument1.png'
  },
  {
    id: 'harp',
    name: 'Harp',
    category: 'String',
    imageUrl: '/images/harp/OnlineVirtualHarpInstrument3.png'
  },
  {
    id: 'kalimba',
    name: 'Kalimba',
    category: 'Percussion',
    imageUrl: '/images/kalimba/OnlineVirtualKalimbaInstrument1.png'
  },
  {
    id: 'marimba',
    name: 'Marimba',
    category: 'Percussion',
    imageUrl: '/images/marimba/OnlineVirtualMarimbaInstrument1.png'
  },
  {
    id: 'tabla',
    name: 'Tabla',
    category: 'Percussion',
    imageUrl: '/images/tabla/OnlineVirtualTablaInstrument3.png'
  },
  {
    id: 'theremin',
    name: 'Theremin',
    category: 'electronic',
    imageUrl: '/images/theremin/OnlineVirtualThereminInstrument3.png'
  },
  {
    id: 'drummachine',
    name: 'Drum Machine',
    category: 'electronic',
    imageUrl: '/images/drummachine/OnlineVirtualDrumMachineInstrument.png'
  },
  {
    id: 'chordprogression',
    name: 'Chord Progression Player',
    category: 'electronic',
    imageUrl: '/images/chordprogression/OnlineVirtualChordProgressionInstrument.png'
  },
 
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'string', label: 'String' },
  { value: 'wind', label: 'Wind' },
  { value: 'percussion', label: 'Percussion' },
  { value: 'keyboard', label: 'Keyboard' },
  { value: 'electronic', label: 'Electronic' },
];

const sortOptions = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' }
];

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');

  // Debounce search input for better UX and performance
  useEffect(() => {
    setIsSearching(true);
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const filteredInstruments = useMemo(() => {
    const filtered = allInstruments
      .filter((instrument) => {
        const matchesSearch = instrument.name.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesCategory = selectedCategory === 'all' ||
          instrument.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        return b.name.localeCompare(a.name);
      });
    return filtered;
  }, [debouncedSearch, selectedCategory, sortBy]);
  
  return (
    <AppLayout>
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <SectionTitle 
          title="Explore Instruments"
          subtitle="Browse through our extensive collection of musical instruments"
        />
        
        <div className="bg-card dark:bg-card/60 rounded-xl shadow-sm p-4 sm:p-6 mb-10 transition-colors duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Search instruments..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isSearching ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse p-2">
                  <div className="h-36 bg-muted/30 dark:bg-muted/50 rounded-lg mb-3" />
                  <div className="h-4 bg-muted/30 dark:bg-muted/50 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted/30 dark:bg-muted/50 rounded w-1/2" />
                </div>
              ))}
          </div>
        ) : filteredInstruments.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredInstruments.map((instrument) => (
              <InstrumentCard 
                key={instrument.id}
                id={instrument.id}
                name={instrument.name}
                category={instrument.category}
                imageUrl={instrument.imageUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No instruments found matching your criteria.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Explore;
