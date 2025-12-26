import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const routeLabels: Record<string, string> = {
  '': 'Home',
  'explore': 'Explore',
  'categories': 'Categories',
  'piano': 'Piano',
  'guitar': 'Guitar',
  'drums': 'Drums',
  'violin': 'Violin',
  'flute': 'Flute',
  'saxophone': 'Saxophone',
  'trumpet': 'Trumpet',
  'harp': 'Harp',
  'xylophone': 'Xylophone',
  'harmonica': 'Harmonica',
  'sitar': 'Sitar',
  'veena': 'Veena',
  'banjo': 'Banjo',
  'kalimba': 'Kalimba',
  'marimba': 'Marimba',
  'tabla': 'Tabla',
  'theremin': 'Theremin',
  'drum-machine': 'Drum Machine',
  'chord-progression': 'Chord Progression',
  'music-rooms': 'Music Rooms',
  'about': 'About',
  'help': 'Help & FAQ',
  'privacy': 'Privacy Policy',
  'contact': 'Contact',
  'strings': 'String Instruments',
  'keyboard': 'Keyboard Instruments',
  'percussion': 'Percussion Instruments',
  'wind': 'Wind Instruments',
};

const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  const location = useLocation();

  // Generate breadcrumbs from current path if items not provided
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = items || [
    { label: 'Home', href: '/' },
    ...pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      return { label, href: index === pathSegments.length - 1 ? undefined : href };
    }),
  ];

  // Don't show breadcrumbs on home page
  if (pathSegments.length === 0) {
    return null;
  }

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      'item': item.href ? `https://www.virtualinstrumentshub.com${item.href}` : undefined,
    })),
  };

  return (
    <>
      {/* Structured data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      <nav
        aria-label="Breadcrumb"
        className={cn(
          "flex items-center gap-1 text-sm text-muted-foreground py-2 px-4 md:px-0",
          className
        )}
      >
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" aria-hidden />
            )}
            {index === 0 && (
              <Home className="h-4 w-4 mr-1" aria-hidden />
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="hover:text-foreground transition-colors duration-200 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
};

export default Breadcrumbs;
