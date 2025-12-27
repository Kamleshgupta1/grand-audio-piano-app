import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FavoriteButton from '@/components/ui-components/FavoriteButton';
import { cn } from '@/lib/utils';

interface InstrumentCardProps {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  isFeatured?: boolean; 
}

const InstrumentCard = ({ id, name, category, imageUrl, isFeatured }: InstrumentCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, rotateY: 2 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="perspective-1000"
    >
      <Link
        to={`/${id}`}
        className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-xl"
        aria-labelledby={`instrument-${id}-title`}
        aria-label={`Open ${name} instrument`}
      >
        <article className="relative bg-card rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform-gpu preserve-3d">
          {/* Featured Badge */}
          {isFeatured && (
            <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse">
              ✨ Featured
            </div>
          )}
          
          {/* Favorite Button */}
          <div className="absolute top-4 right-4 z-20">
            <FavoriteButton
              instrumentId={id}
              instrumentName={name}
              variant="ghost"
              className="bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-md"
            />
          </div>
          
          {/* Image Container with 3D Effect */}
          <div className={cn(
            "w-full overflow-hidden relative",
            isFeatured ? 'h-64' : 'h-48'
          )}> 
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            <img
              src={imageUrl}
              alt={`${name} - Virtual ${category} Instrument`}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
            
            {/* Shimmer Effect on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>
          
          {/* Content */}
          <div className="p-5 relative">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-2 bg-primary/10 px-2.5 py-1 rounded-full">
              {category}
            </span>
            <h3 
              id={`instrument-${id}-title`} 
              className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300"
            >
              {name}
            </h3>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300 flex items-center gap-1">
                Play now
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.3)]" />
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

export default InstrumentCard;
