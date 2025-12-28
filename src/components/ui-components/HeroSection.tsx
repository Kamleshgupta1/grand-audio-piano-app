import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgImageUrl?: string;
  imageUrl?: string;
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
  const backgroundImage = bgImageUrl || imageUrl;
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollY } = useScroll();
  
  // Parallax transforms for different layers
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const contentY = useTransform(scrollY, [0, 500], [0, -50]);
  const orb1Y = useTransform(scrollY, [0, 500], [0, 100]);
  const orb2Y = useTransform(scrollY, [0, 500], [0, 80]);
  const orb3Y = useTransform(scrollY, [0, 500], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  
  // Handle mouse movement for interactive parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x, y });
    };
    
    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    return () => container?.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <section 
      ref={containerRef}
      className="relative h-[50vh] md:h-[80vh] min-h-[300px] md:min-h-[600px] flex items-center overflow-hidden"
    >
      {/* Parallax Background Layer */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        style={{ y: backgroundY }}
      >
        <motion.img 
          src={backgroundImage} 
          alt={`${title} - HarmonyHub Virtual Instruments`}
          className="w-full h-[120%] object-cover transition-transform duration-[30s] hover:scale-110" 
          loading="eager"
          style={{
            x: mousePosition.x * -20,
            y: mousePosition.y * -20,
          }}
        />
        {/* Multi-layer gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
      </motion.div>
      
      {/* Animated depth layers - Floating orbs with parallax */}
      <motion.div 
        className="absolute top-1/4 right-[10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        style={{ 
          y: orb1Y,
          x: mousePosition.x * 30,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 left-[5%] w-72 h-72 bg-accent/20 rounded-full blur-3xl"
        style={{ 
          y: orb2Y,
          x: mousePosition.x * -25,
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
        style={{ 
          y: orb3Y,
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      {/* Musical notes floating effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10 text-4xl md:text-6xl"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [-5, 5, -5],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
          >
            ♪
          </motion.div>
        ))}
      </div>
      
      {/* Content Layer with parallax */}
      <motion.div 
        className="container mx-auto px-6 relative z-10"
        style={{ y: contentY, opacity }}
      >
        <div className="max-w-3xl">
          <motion.h1 
            className="text-3xl md:text-5xl lg:text-7xl font-heading font-bold text-white leading-tight drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {title}
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-gray-50 mt-4 md:mt-6 max-w-2xl drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {subtitle}
          </motion.p>
          
          <motion.div 
            className="mt-8 md:mt-12 flex gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
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
          </motion.div>
        </div>
      </motion.div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <motion.div 
            className="w-1.5 h-3 bg-white/50 rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
