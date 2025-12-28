import { Link } from 'react-router-dom';
import { Clock, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePersistentFavorites } from '@/hooks/usePersistentFavorites';
import { cn } from '@/lib/utils';

interface QuickAccessPanelProps {
  className?: string;
}

const instrumentNames: Record<string, string> = {
  piano: 'Piano',
  guitar: 'Guitar',
  drums: 'Drums',
  violin: 'Violin',
  flute: 'Flute',
  saxophone: 'Saxophone',
  trumpet: 'Trumpet',
  harp: 'Harp',
  xylophone: 'Xylophone',
  harmonica: 'Harmonica',
  sitar: 'Sitar',
  veena: 'Veena',
  banjo: 'Banjo',
  kalimba: 'Kalimba',
  marimba: 'Marimba',
  tabla: 'Tabla',
  theremin: 'Theremin',
  'drum-machine': 'Drum Machine',
  'chord-progression': 'Chord Progression',
};

const QuickAccessPanel = ({ className }: QuickAccessPanelProps) => {
  const { favorites, recentInstruments, clearRecent, toggleFavorite } = usePersistentFavorites();

  const hasContent = favorites.length > 0 || recentInstruments.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-semibold text-foreground">Favorites</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites.map((instrumentId) => (
              <div key={instrumentId} className="flex items-center gap-1">
                <Link to={`/${instrumentId}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {instrumentNames[instrumentId] || instrumentId}
                  </Button>
                </Link>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-muted-foreground hover:text-red-500"
                  onClick={() => toggleFavorite(instrumentId)}
                >
                  <Heart className="h-3 w-3 fill-current" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Instruments Section */}
      {recentInstruments.length > 0 && (
        <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Recent</h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 text-xs text-muted-foreground hover:text-destructive"
              onClick={clearRecent}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentInstruments.slice(0, 5).map((instrumentId) => (
              <Link key={instrumentId} to={`/${instrumentId}`}>
                <Button
                  size="sm"
                  variant="secondary"
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {instrumentNames[instrumentId] || instrumentId}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickAccessPanel;
