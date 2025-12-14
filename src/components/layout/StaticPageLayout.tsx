import React from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import EnhancedSEO from "@/components/SEO/EnhancedSEO";
import { LucideIcon } from "lucide-react";

interface StaticPageLayoutProps {
  title: string;
  description: string;
  keywords?: string[];
  heroTitle: string;
  heroSubtitle: string;
  heroIcon?: LucideIcon;
  heroBackground?: string;
  children: React.ReactNode;
  showBackgroundImage?: boolean;
  backgroundImageUrl?: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({
  title,
  description,
  keywords = [],
  heroTitle,
  heroSubtitle,
  heroIcon: HeroIcon,
  heroBackground = "from-primary/10 via-accent/5 to-transparent",
  children,
  showBackgroundImage = false,
  backgroundImageUrl
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "isPartOf": {
      "@type": "WebSite",
      "name": "HarmonyHub - Virtual Music Instruments",
      "url": "https://www.virtualinstrumentshub.com"
    }
  };

  return (
    <AppLayout>
      <EnhancedSEO
        title={title}
        description={description}
        keywords={keywords.join(', ')}
        structuredData={[structuredData]}
        ogType="website"
      />

      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-b ${heroBackground}`}>
        {showBackgroundImage && backgroundImageUrl && (
          <div
            className="absolute inset-0 -z-10 opacity-15 dark:opacity-10"
            style={{
              backgroundImage: `url("${backgroundImageUrl}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}

        <motion.div
          className="container mx-auto px-4 py-16 md:py-24 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {HeroIcon && (
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 dark:bg-primary/20 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <HeroIcon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </motion.div>
          )}
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-fade-in">
            {heroTitle}
          </h1>
          
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {heroSubtitle}
          </p>
        </motion.div>
      </section>

      {/* Content Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="container mx-auto px-4 py-8 md:py-16"
      >
        <motion.div variants={fadeIn}>
          {children}
        </motion.div>
      </motion.div>
    </AppLayout>
  );
};

export { StaticPageLayout, fadeIn, staggerContainer };
export default StaticPageLayout;
