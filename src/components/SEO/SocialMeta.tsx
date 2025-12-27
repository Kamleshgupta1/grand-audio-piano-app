import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SocialMetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'music.song' | 'video.other';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SocialMeta: React.FC<SocialMetaProps> = ({
  title,
  description,
  image = 'https://lovable.dev/opengraph-image-p98pqg.png',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  twitterCard = 'summary_large_image',
  twitterSite = '@harmonyhub',
  twitterCreator,
  author = 'HarmonyHub',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
}) => {
  return (
    <Helmet>
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="HarmonyHub" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}

      {/* LinkedIn */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Pinterest */}
      <meta name="pinterest-rich-pin" content="true" />
    </Helmet>
  );
};

export default SocialMeta;
