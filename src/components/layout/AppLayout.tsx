import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import EnhancedSEO from '../SEO/EnhancedSEO';
import instrumentSEO from '@/utils/seo/instrumentSEO';

const { getInstrumentSEOData } = instrumentSEO;

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'music.song' | 'music.album' | 'music.playlist' | 'video.other';
  keywords?: string;
  instrumentType?: string;
}

const AppLayout = ({ 
  children,
  title = "HarmonyHub - Virtual Musical Instruments",
  description = "Play various musical instruments online in this interactive virtual music studio.",
  canonical,
  image,
  type = 'website',
  keywords = "virtual instruments, online music, play music, interactive instruments",
  instrumentType
}: AppLayoutProps) => {
  // Get instrument-specific SEO data if instrumentType is provided
  const instrumentSEO = instrumentType ? getInstrumentSEOData(instrumentType) : null;
  
  const seoTitle = instrumentSEO?.title || title;
  const seoDescription = instrumentSEO?.description || description;
  const seoKeywords = instrumentSEO?.keywords || keywords;
  const structuredData = instrumentSEO?.structuredData || [];

  return (
    <>
      <EnhancedSEO 
        title={seoTitle}
        description={seoDescription}
        canonical={canonical}
        ogImage={image}
        ogType={type}
        keywords={seoKeywords}
        structuredData={structuredData}
      />
      
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AppLayout;
