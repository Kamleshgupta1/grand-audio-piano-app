
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categoryData } from '@/pages/categories/CategoryPage';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  to: string;
  color: string;
  icon2: string;
  imageUrl?: string;
  id?: string;
}

const CategoryCard = ({ title, description, icon, to, color, icon2, imageUrl, id }: CategoryCardProps) => {
  // Get the instruments for this category if id is provided
  const instruments = id && categoryData[id as keyof typeof categoryData]?.instruments;

  // Create a mapping of instrument types to colors and icons
const instrumentStyles: Record<string, { color: string; icon: string }> = {

  // 🎻 String Instruments (Sky → Blue → Indigo)
  Violin: {
    color: `
      bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-100 text-slate-800
      hover:from-sky-100 hover:via-blue-100 hover:to-indigo-200
      dark:from-indigo-900 dark:via-blue-900 dark:to-slate-900 dark:text-indigo-100
      dark:hover:from-indigo-800 dark:hover:via-blue-800 dark:hover:to-slate-800
    `,
    icon: '🎻'
  },
  Guitar: {
    color: `
      bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-100 text-slate-800
      hover:from-blue-100 hover:via-indigo-100 hover:to-violet-200
      dark:from-blue-900 dark:via-indigo-900 dark:to-violet-900 dark:text-violet-100
      dark:hover:from-blue-800 dark:hover:via-indigo-800 dark:hover:to-violet-800
    `,
    icon: '🎸'
  },
  Harp: {
    color: `
      bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-100 text-slate-800
      hover:from-sky-100 hover:via-cyan-100 hover:to-blue-200
      dark:from-sky-900 dark:via-cyan-900 dark:to-blue-900 dark:text-cyan-100
      dark:hover:from-sky-800 dark:hover:via-cyan-800 dark:hover:to-blue-800
    `,
    icon: '🎼'
  },
  Sitar: {
    color: `
      bg-gradient-to-r from-indigo-50 via-purple-50 to-violet-100 text-slate-800
      hover:from-indigo-100 hover:via-purple-100 hover:to-violet-200
      dark:from-indigo-900 dark:via-purple-900 dark:to-violet-900 dark:text-purple-100
      dark:hover:from-indigo-800 dark:hover:via-purple-800 dark:hover:to-violet-800
    `,
    icon: '🪕'
  },
  Veena: {
    color: `
      bg-gradient-to-r from-blue-50 via-violet-50 to-purple-100 text-slate-800
      hover:from-blue-100 hover:via-violet-100 hover:to-purple-200
      dark:from-blue-900 dark:via-violet-900 dark:to-purple-900 dark:text-purple-100
      dark:hover:from-blue-800 dark:hover:via-violet-800 dark:hover:to-purple-800
    `,
    icon: '🪕'
  },
  Banjo: {
    color: `
      bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-100 text-slate-800
      hover:from-sky-100 hover:via-indigo-100 hover:to-blue-200
      dark:from-sky-900 dark:via-indigo-900 dark:to-blue-900 dark:text-indigo-100
      dark:hover:from-sky-800 dark:hover:via-indigo-800 dark:hover:to-blue-800
    `,
    icon: '🪕'
  },

  // 🎷 Wind Instruments (Ocean → Sky → Blue)
  Flute: {
    color: `
      bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-100 text-slate-800
      hover:from-cyan-100 hover:via-sky-100 hover:to-blue-200
      dark:from-cyan-900 dark:via-sky-900 dark:to-blue-900 dark:text-cyan-100
      dark:hover:from-cyan-800 dark:hover:via-sky-800 dark:hover:to-blue-800
    `,
    icon: '🎶'
  },
  Saxophone: {
    color: `
      bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-100 text-slate-800
      hover:from-sky-100 hover:via-blue-100 hover:to-indigo-200
      dark:from-sky-900 dark:via-blue-900 dark:to-indigo-900 dark:text-sky-100
      dark:hover:from-sky-800 dark:hover:via-blue-800 dark:hover:to-indigo-800
    `,
    icon: '🎷'
  },
  Trumpet: {
    color: `
      bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-100 text-slate-800
      hover:from-blue-100 hover:via-indigo-100 hover:to-violet-200
      dark:from-blue-900 dark:via-indigo-900 dark:to-violet-900 dark:text-indigo-100
      dark:hover:from-blue-800 dark:hover:via-indigo-800 dark:hover:to-violet-800
    `,
    icon: '🎺'
  },
  Harmonica: {
    color: `
      bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-100 text-slate-800
      hover:from-cyan-100 hover:via-blue-100 hover:to-indigo-200
      dark:from-cyan-900 dark:via-blue-900 dark:to-indigo-900 dark:text-cyan-100
      dark:hover:from-cyan-800 dark:hover:via-blue-800 dark:hover:to-indigo-800
    `,
    icon: '🎵'
  },

  // 🥁 Percussion (Indigo → Purple → Violet)
  DrumKit: {
    color: `
      bg-gradient-to-r from-indigo-50 via-purple-50 to-violet-100 text-slate-800
      hover:from-indigo-100 hover:via-purple-100 hover:to-violet-200
      dark:from-indigo-900 dark:via-purple-900 dark:to-violet-900 dark:text-purple-100
      dark:hover:from-indigo-800 dark:hover:via-purple-800 dark:hover:to-violet-800
    `,
    icon: '🥁'
  },
  Xylophone: {
    color: `
      bg-gradient-to-r from-blue-50 via-violet-50 to-indigo-100 text-slate-800
      hover:from-blue-100 hover:via-violet-100 hover:to-indigo-200
      dark:from-blue-900 dark:via-violet-900 dark:to-indigo-900 dark:text-violet-100
      dark:hover:from-blue-800 dark:hover:via-violet-800 dark:hover:to-indigo-800
    `,
    icon: '🪘'
  },

  // 🎹 Keyboard / Electronic (Navy → Violet → Purple)
  GrandPiano: {
    color: `
      bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-100 text-slate-800
      hover:from-indigo-100 hover:via-violet-100 hover:to-purple-200
      dark:from-indigo-900 dark:via-violet-900 dark:to-purple-900 dark:text-violet-100
      dark:hover:from-indigo-800 dark:hover:via-violet-800 dark:hover:to-purple-800
    `,
    icon: '🎹'
  },
  Theremin: {
    color: `
      bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-100 text-slate-800
      hover:from-blue-100 hover:via-indigo-100 hover:to-violet-200
      dark:from-blue-900 dark:via-indigo-900 dark:to-violet-900 dark:text-indigo-100
      dark:hover:from-blue-800 dark:hover:via-indigo-800 dark:hover:to-violet-800
    `,
    icon: '📡'
  },
  DrumMachine: {
    color: `
      bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-100 text-slate-800
      hover:from-indigo-100 hover:via-purple-100 hover:to-blue-200
      dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 dark:text-purple-100
      dark:hover:from-indigo-800 dark:hover:via-purple-800 dark:hover:to-blue-800
    `,
    icon: '🎛️'
  },
  ChordProgression: {
    color: `
      bg-gradient-to-r from-sky-50 via-blue-50 to-violet-100 text-slate-800
      hover:from-sky-100 hover:via-blue-100 hover:to-violet-200
      dark:from-sky-900 dark:via-blue-900 dark:to-violet-900 dark:text-blue-100
      dark:hover:from-sky-800 dark:hover:via-blue-800 dark:hover:to-violet-800
    `,
    icon: '🎧'
  }
};


  return (
  <Link to={to} className="block group" aria-label={`Browse ${title} category`}>
    <article role="article" tabIndex={0} className="rounded-2xl overflow-hidden bg-card shadow-md transition-transform duration-300 transform-gpu group-hover:-translate-y-1 group-hover:scale-[1.02] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 relative border border-border/50">
      {instruments && instruments.length > 0 && (
        <div className="absolute top-2 right-2 z-30">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                   <Button
  variant="outline"
  size="icon"
  aria-label={`Browse ${title} instruments`}
  aria-haspopup="menu"
  className="
    rounded-full
    bg-gradient-to-r from-primary to-secondary text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 hover:scale-105

  "
>
  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
</Button>

                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-2">
                    {instruments.map(instrument => (
                      <DropdownMenuItem key={instrument.id} asChild className={instrumentStyles[instrument.name]?.color || "bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"}>
                        <Link to={`/${instrument.id}`} className="flex items-center gap-2 cursor-pointer  mt-1 mb-1">
                          <span className="text-lg">
                            {instrumentStyles[instrument.name]?.icon || '🎵'}
                          </span>
                          {instrument.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Browse {title} Instruments</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <div className="relative h-56 md:h-60 overflow-hidden">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          {imageUrl ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <img
                src={imageUrl}
                alt={`${title} - Browse ${title.toLowerCase()}`}
                className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 will-change-transform"
                loading="lazy"
              />
            </>
          ) : (
            <div className={`${color} absolute inset-0 flex items-center justify-center text-6xl z-10 group-hover:text-7xl transition-all duration-500`}>
              {icon2}
            </div>
          )}

            <div className="absolute bottom-0 px-6 py-4 w-full z-20 bg-gradient-to-t from-black/60 via-black/30 to-transparent dark:from-black/40 dark:via-black/10">
              <h3 className="text-lg md:text-xl font-semibold text-white group-hover:scale-105 transition-transform duration-300">
              {title}
            </h3>
          </div>
        </div>
      </div>
        <div className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-transform duration-300 group-hover:scale-105 text-xl">
              {icon}
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                {title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
          <ChevronRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform duration-300" size={20} aria-hidden />
        </div>
      </div>
    </article>
  </Link>
);
};

export default CategoryCard;
