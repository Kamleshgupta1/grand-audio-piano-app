import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  instrumentId: string;
  instrumentName: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'ghost' | 'outline';
}

const FavoriteButton = ({
  instrumentId,
  instrumentName,
  className,
  size = 'icon',
  variant = 'ghost',
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(instrumentId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(instrumentId);
    
    if (!favorite) {
      toast.success(`Added ${instrumentName} to favorites!`, {
        icon: '❤️',
        duration: 2000,
      });
    } else {
      toast.info(`Removed ${instrumentName} from favorites`, {
        duration: 2000,
      });
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleClick}
      className={cn(
        "transition-all duration-300",
        favorite && "text-red-500 hover:text-red-600",
        className
      )}
      aria-label={favorite ? `Remove ${instrumentName} from favorites` : `Add ${instrumentName} to favorites`}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all duration-300",
          favorite && "fill-current scale-110"
        )}
      />
    </Button>
  );
};

export default FavoriteButton;
