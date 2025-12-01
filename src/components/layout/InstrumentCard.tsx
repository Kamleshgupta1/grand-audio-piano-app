import { Link } from 'react-router-dom';

interface InstrumentCardProps {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  isFeatured?: boolean; 
}

const InstrumentCard = ({ id, name, category, imageUrl, isFeatured }: InstrumentCardProps) => {
  return (
    <Link to={`/${id}`} className="block group">
      <article className="relative bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 interactive-element">
        {isFeatured && (
          <div className="absolute top-4 right-4 z-10 bg-gradient-bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse">
            Featured
          </div>
        )}
        
        <div className={`w-full ${isFeatured ? 'h-64' : 'h-48'} overflow-hidden relative`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          <img 
            src={imageUrl} 
            alt={`${name} - Virtual ${category} Instrument`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
            loading="lazy"
          />
        </div>
        
        <div className="p-5 bg-card">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-2 bg-primary/10 px-2 py-1 rounded">
            {category}
          </span>
          <h3 className="text-lg font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
              Explore instrument →
            </span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover:text-primary-foreground transition-colors duration-300">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default InstrumentCard;
