
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgImageUrl?: string;
  imageUrl?: string;  // Added to support either naming convention
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const HeroSection = ({ 
  title, 
  subtitle, 
  ctaText, 
  ctaLink, 
  bgImageUrl, 
  imageUrl,
  secondaryCtaText,
  secondaryCtaLink
}: HeroSectionProps) => {
  // Use either bgImageUrl or imageUrl (for backward compatibility)
  const backgroundImage = bgImageUrl || imageUrl;
  
  return (
    <section className="relative h-[50vh] md:h-[80vh] min-h-[300px] md:min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={backgroundImage} 
          alt={`${title} - HarmonyHub Virtual Instruments`}
          className="w-full h-full object-cover transition-transform duration-[30s] hover:scale-110" 
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-heading font-bold text-white leading-tight animate-fade-in drop-shadow-2xl">
            {title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-50 mt-4 md:mt-6 max-w-2xl animate-fade-in drop-shadow-lg" style={{ animationDelay: '0.2s' }}>
            {subtitle}
          </p>
          <div className="mt-8 md:mt-12 animate-fade-in flex gap-4 flex-wrap" style={{ animationDelay: '0.4s' }}>
            <Link to={ctaLink}>
              <Button className="rounded-xl text-base md:text-lg px-6 md:px-8 py-3 md:py-7 flex items-center gap-3 group hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl bg-gradient-bg-primary hover:opacity-90">
                {ctaText}
                <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
              </Button>
            </Link>
            
            {secondaryCtaText && secondaryCtaLink && (
              <Link to={secondaryCtaLink}>
                <Button 
                  variant="outline" 
                  className="rounded-xl text-base md:text-lg px-6 md:px-8 py-3 md:py-7 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  {secondaryCtaText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Animated accent elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
      <div className="absolute top-1/4 right-[10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow"></div>
      <div className="absolute bottom-1/3 left-[5%] w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-glow" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }}></div>
    </section>
  );
};

export default HeroSection;
