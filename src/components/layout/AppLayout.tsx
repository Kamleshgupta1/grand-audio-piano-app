import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import EnhancedSEO from '../SEO/EnhancedSEO';
import Breadcrumbs from '../ui-components/Breadcrumbs';
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
  showBreadcrumbs?: boolean;
}

const AppLayout = ({ 
  children,
  title = "HarmonyHub - Virtual Musical Instruments",
  description = "Play various musical instruments online in this interactive virtual music studio.",
  canonical,
  image,
  type = 'website',
  keywords = "virtual instruments, online music, play music, interactive instruments",
  instrumentType,
  showBreadcrumbs = true
}: AppLayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Get instrument-specific SEO data if instrumentType is provided
  const instrumentSEOData = instrumentType ? getInstrumentSEOData(instrumentType) : null;
  
  const seoTitle = instrumentSEOData?.title || title;
  const seoDescription = instrumentSEOData?.description || description;
  const seoKeywords = instrumentSEOData?.keywords || keywords;
  const structuredData = instrumentSEOData?.structuredData || [];

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
          {/* Breadcrumbs - show on all pages except home */}
          {showBreadcrumbs && !isHomePage && (
            <div className="container mx-auto px-4 py-2">
              <Breadcrumbs />
            </div>
          )}
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AppLayout;
