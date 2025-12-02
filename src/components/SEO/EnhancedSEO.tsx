import React from 'react';
import { Helmet } from 'react-helmet-async';

interface EnhancedSEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'music.song' | 'music.album' | 'music.playlist' | 'video.other';
  structuredData?: Record<string, any>[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

// Comprehensive global SEO keywords for virtual instruments
const globalSEOKeywords = [
  // Core virtual instrument keywords
  'virtual instruments online',
  'play instruments online free',
  'online musical instruments',
  'virtual music instruments',
  'free online instruments',
  'browser music instruments',
  'web based instruments',
  'digital instruments',
  'music simulator',
  'instrument simulator',
  'virtual instrument platform',
  
  // Learning & Education
  'learn music online free',
  'music education app',
  'music learning platform',
  'practice music online',
  'music lessons free',
  'interactive music learning',
  'music training tool',
  'learn to play music',
  'music for beginners',
  'music theory practice',
  
  // Action keywords
  'play music online free',
  'make music online',
  'create music online',
  'compose music online',
  'music maker online',
  'online music studio',
  'virtual music studio',
  'instant play instruments',
  
  // Platform keywords
  'music app free',
  'music web app',
  'no download music',
  'browser music player',
  'touch friendly instruments',
  'mobile music app',
  
  // Feature keywords
  'realistic instrument sounds',
  'HD instrument samples',
  'MIDI support',
  'keyboard playable',
  'recording feature',
  'music collaboration',
  
  // Genre keywords
  'classical instruments online',
  'world music instruments',
  'traditional instruments',
  'electronic music tools',
  'percussion instruments',
  'string instruments',
  'wind instruments',
  'keyboard instruments'
];

/**
 * Enhanced SEO component with comprehensive meta tags and structured data
 * Optimized for both traditional search engines and AI search engines
 */
const EnhancedSEO: React.FC<EnhancedSEOProps> = ({
  title,
  description,
  keywords = '',
  canonical = typeof window !== 'undefined' ? window.location.href : '',
  ogImage = 'https://lovable.dev/opengraph-image-p98pqg.png',
  ogType = 'website',
  structuredData = [],
  author = 'HarmonyHub Team',
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  const siteName = 'HarmonyHub - Virtual Musical Instruments';
  const formattedTitle = title.includes('HarmonyHub') ? title : `${title} | HarmonyHub`;
  
  // Enhanced keywords combining provided keywords with global SEO keywords
  const enhancedKeywords = [
    keywords,
    ...globalSEOKeywords.slice(0, 20)
  ].filter(Boolean).join(', ');

  // Base structured data for the website
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: formattedTitle,
    description: description,
    url: canonical,
    image: ogImage,
    author: {
      '@type': 'Organization',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/logo192.png`
      }
    },
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
    ...(section && { articleSection: section }),
    ...(tags.length > 0 && { keywords: tags.join(', ') })
  };

  // Combine base structured data with additional structured data
  const allStructuredData = [baseStructuredData, ...structuredData];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="title" content={formattedTitle} />
      <meta name="description" content={description} />
      {enhancedKeywords && <meta name="keywords" content={enhancedKeywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={canonical} />
      
      {/* Language and Geographic */}
      <meta name="language" content="English" />
      <meta httpEquiv="content-language" content="en-US" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Additional Meta Tags for Better Indexing */}
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content="HarmonyHub" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Schema.org Structured Data */}
      {allStructuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
      
      {/* Breadcrumb Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${window.location.origin}`
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: title,
              item: canonical
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default EnhancedSEO;