/**
 * SEO utilities for instrument pages
 * Generates comprehensive SEO data for better search engine visibility
 */

interface InstrumentSEOData {
  title: string;
  description: string;
  keywords: string;
  structuredData: any[];
  ogImage?: string;
}

export const generateInstrumentSEO = (
  instrumentName: string,
  category: string,
  features: string[],
  canonical?: string
): InstrumentSEOData => {
  const siteName = 'HarmonyHub';
  const baseUrl = 'https://www.virtualinstrumentshub.com';
  
  const title = `Virtual ${instrumentName} - Play ${instrumentName} Online | ${siteName}`;
  
  const description = `Play virtual ${instrumentName.toLowerCase()} online for free. Interactive ${category.toLowerCase()} instrument with realistic sounds, recording features, and real-time collaboration. Perfect for learning and practice.`;
  
  const keywords = [
    `virtual ${instrumentName.toLowerCase()}`,
    `online ${instrumentName.toLowerCase()}`,
    `play ${instrumentName.toLowerCase()} online`,
    `${instrumentName.toLowerCase()} simulator`,
    `${instrumentName.toLowerCase()} practice`,
    `learn ${instrumentName.toLowerCase()}`,
    `interactive ${instrumentName.toLowerCase()}`,
    `digital ${instrumentName.toLowerCase()}`,
    `${category.toLowerCase()} instrument`,
    'music learning',
    'virtual instruments',
    'online music',
    ...features.map(f => f.toLowerCase())
  ].join(', ');

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

export default { generateInstrumentSEO, musicCategories };