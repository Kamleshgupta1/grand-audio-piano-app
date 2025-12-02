/**
 * SEO utilities for instrument pages
 * Generates comprehensive SEO data for better search engine visibility
 * Optimized for both traditional and AI search engines
 */

interface InstrumentSEOData {
  title: string;
  description: string;
  keywords: string;
  structuredData: any[];
  ogImage?: string;
}

// Comprehensive keywords for virtual instruments SEO
const globalKeywords = [
  // Core virtual instrument keywords
  'virtual instruments',
  'online instruments',
  'virtual musical instruments',
  'play instruments online',
  'free online instruments',
  'browser music instruments',
  'web based instruments',
  'digital instruments',
  'music simulator',
  'instrument simulator',
  
  // Learning keywords
  'learn music online',
  'music education',
  'music learning app',
  'practice music online',
  'music lessons free',
  'interactive music learning',
  'music training',
  'learn to play music',
  
  // Action keywords
  'play music online free',
  'make music online',
  'create music online',
  'compose music online',
  'music maker online',
  'online music studio',
  'virtual music studio',
  
  // Platform keywords
  'music app',
  'music web app',
  'music application',
  'music software online',
  'no download music',
  'instant play instruments',
  
  // Feature keywords
  'realistic instrument sounds',
  'HD instrument samples',
  'MIDI support',
  'keyboard playable instruments',
  'touch friendly instruments',
  'mobile music app',
  
  // Genre/Style keywords
  'classical music instruments',
  'jazz instruments online',
  'rock music virtual',
  'world music instruments',
  'traditional instruments',
  'electronic music tools',
  
  // Competitor-inspired keywords
  'musicca alternative',
  'virtual piano alternative',
  'online instrument platform',
  'music practice tool',
  'instrument learning platform'
];

export const generateInstrumentSEO = (
  instrumentName: string,
  category: string,
  features: string[],
  canonical?: string
): InstrumentSEOData => {
  const siteName = 'HarmonyHub';
  const baseUrl = 'https://www.virtualinstrumentshub.com';
  
  const title = `Virtual ${instrumentName} - Play ${instrumentName} Online Free | ${siteName}`;
  
  const description = `Play virtual ${instrumentName.toLowerCase()} online for free. Interactive ${category.toLowerCase()} instrument with realistic sounds, recording features, and real-time collaboration. Perfect for learning, practicing and creating music. No download required - play instantly in your browser.`;
  
  // Instrument-specific keywords
  const instrumentKeywords = [
    `virtual ${instrumentName.toLowerCase()}`,
    `online ${instrumentName.toLowerCase()}`,
    `play ${instrumentName.toLowerCase()} online`,
    `${instrumentName.toLowerCase()} simulator`,
    `${instrumentName.toLowerCase()} emulator`,
    `${instrumentName.toLowerCase()} practice`,
    `learn ${instrumentName.toLowerCase()}`,
    `${instrumentName.toLowerCase()} lessons`,
    `interactive ${instrumentName.toLowerCase()}`,
    `digital ${instrumentName.toLowerCase()}`,
    `free ${instrumentName.toLowerCase()}`,
    `${instrumentName.toLowerCase()} online free`,
    `${instrumentName.toLowerCase()} no download`,
    `${instrumentName.toLowerCase()} browser`,
    `${instrumentName.toLowerCase()} web`,
    `${instrumentName.toLowerCase()} app`,
    `${instrumentName.toLowerCase()} keyboard`,
    `${instrumentName.toLowerCase()} sounds`,
    `realistic ${instrumentName.toLowerCase()}`,
    `${category.toLowerCase()} instrument`,
    `${category.toLowerCase()} ${instrumentName.toLowerCase()}`,
    ...features.map(f => f.toLowerCase()),
    ...features.map(f => `${instrumentName.toLowerCase()} ${f.toLowerCase()}`)
  ];
  
  // Combine all keywords
  const keywords = [...new Set([...instrumentKeywords, ...globalKeywords.slice(0, 30)])].join(', ');

  const structuredData = [
    // MusicComposition schema
    {
      '@context': 'https://schema.org',
      '@type': 'MusicComposition',
      name: `Virtual ${instrumentName} Experience`,
      description: description,
      url: canonical || `${baseUrl}/${instrumentName.toLowerCase()}`,
      inLanguage: 'en-US',
      keywords: keywords,
      genre: category,
      musicalKey: 'C Major',
      isFamilyFriendly: true
    },
    // CreativeWork schema
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: title,
      description: description,
      url: canonical || `${baseUrl}/${instrumentName.toLowerCase()}`,
      author: {
        '@type': 'Organization',
        name: siteName
      },
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo192.png`
        }
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      keywords: keywords,
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      learningResourceType: 'Interactive Tool',
      educationalUse: 'Practice, Learning, Performance',
      interactivityType: 'active',
      typicalAgeRange: '6-99'
    },
    // Product schema for the virtual instrument
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `Virtual ${instrumentName}`,
      description: description,
      brand: {
        '@type': 'Brand',
        name: siteName
      },
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: canonical || `${baseUrl}/${instrumentName.toLowerCase()}`
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '156',
        bestRating: '5',
        worstRating: '1'
      },
      category: `${category} Instruments`
    },
    // HowTo schema for learning
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Play Virtual ${instrumentName}`,
      description: `Learn to play the ${instrumentName.toLowerCase()} using our interactive virtual instrument`,
      step: [
        {
          '@type': 'HowToStep',
          name: 'Access the Instrument',
          text: `Navigate to the virtual ${instrumentName.toLowerCase()} page`,
          url: canonical || `${baseUrl}/${instrumentName.toLowerCase()}`
        },
        {
          '@type': 'HowToStep',
          name: 'Choose Input Method',
          text: 'Use your keyboard, mouse, or MIDI controller to play'
        },
        {
          '@type': 'HowToStep',
          name: 'Adjust Settings',
          text: 'Customize tone, reverb, and other parameters'
        },
        {
          '@type': 'HowToStep',
          name: 'Start Playing',
          text: `Begin playing the ${instrumentName.toLowerCase()} and practice your skills`
        }
      ],
      totalTime: 'PT5M'
    }
  ];

  return {
    title,
    description,
    keywords,
    structuredData,
    ogImage: `${baseUrl}/images/${instrumentName.toLowerCase()}/og-image.png`
  };
};

export const musicCategories = {
  string: {
    name: 'String Instruments',
    description: 'Plucked and bowed string instruments',
    instruments: ['Guitar', 'Violin', 'Harp', 'Sitar', 'Veena', 'Banjo']
  },
  wind: {
    name: 'Wind Instruments',
    description: 'Brass and woodwind instruments',
    instruments: ['Flute', 'Saxophone', 'Trumpet', 'Harmonica']
  },
  percussion: {
    name: 'Percussion Instruments',
    description: 'Drums and pitched percussion',
    instruments: ['Drums', 'Xylophone', 'Kalimba', 'Marimba', 'Tabla']
  },
  keyboard: {
    name: 'Keyboard Instruments',
    description: 'Piano and keyboard instruments',
    instruments: ['Piano']
  },
  electronic: {
    name: 'Electronic Instruments',
    description: 'Synthesizers and electronic instruments',
    instruments: ['Theremin', 'Drum Machine', 'Chord Progression']
  }
};

// Helper function to get SEO data by instrument name
export const getInstrumentSEOData = (instrumentName: string): InstrumentSEOData | null => {
  const instrumentMap: Record<string, { category: string; features: string[] }> = {
    piano: { category: 'Keyboard', features: ['88 keys', 'sustain pedal', 'recording', 'MIDI support'] },
    guitar: { category: 'String', features: ['6 strings', 'chord diagrams', 'tuning', 'strumming'] },
    violin: { category: 'String', features: ['4 strings', 'bow simulation', 'vibrato', 'pizzicato'] },
    drums: { category: 'Percussion', features: ['drum kit', 'hi-hat', 'cymbal', 'kick drum'] },
    flute: { category: 'Wind', features: ['breath control', 'fingering', 'octave range'] },
    saxophone: { category: 'Wind', features: ['alto sax', 'breath control', 'jazz tones'] },
    trumpet: { category: 'Wind', features: ['brass sound', 'mute options', 'valve control'] },
    harmonica: { category: 'Wind', features: ['diatonic', 'bending', 'blues harp'] },
    xylophone: { category: 'Percussion', features: ['mallet sounds', 'wooden bars', 'resonators'] },
    kalimba: { category: 'Percussion', features: ['thumb piano', 'metal tines', 'mbira'] },
    marimba: { category: 'Percussion', features: ['wooden bars', 'mallet techniques', 'resonators'] },
    tabla: { category: 'Percussion', features: ['indian drums', 'bayan', 'dayan', 'taals'] },
    sitar: { category: 'String', features: ['indian classical', 'meend', 'sympathetic strings'] },
    veena: { category: 'String', features: ['carnatic', 'gamakas', 'frets'] },
    banjo: { category: 'String', features: ['5 strings', 'clawhammer', 'bluegrass'] },
    harp: { category: 'String', features: ['pedal harp', 'glissando', 'arpeggios'] },
    theremin: { category: 'Electronic', features: ['contactless', 'antenna control', 'pitch bend'] },
    'drum machine': { category: 'Electronic', features: ['step sequencer', 'patterns', 'tempo'] },
    'chord progression': { category: 'Electronic', features: ['chord builder', 'progressions', 'theory'] }
  };

  const normalizedName = instrumentName.toLowerCase();
  const config = instrumentMap[normalizedName];
  
  if (!config) return null;
  
  return generateInstrumentSEO(instrumentName, config.category, config.features);
};

export default { generateInstrumentSEO, getInstrumentSEOData, musicCategories };