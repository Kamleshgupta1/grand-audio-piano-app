import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonCardProps {
  variant?: 'instrument' | 'category' | 'featured';
}

const SkeletonCard = ({ variant = 'instrument' }: SkeletonCardProps) => {
  if (variant === 'featured') {
    return (
      <div className="relative bg-card rounded-xl overflow-hidden shadow-md animate-pulse">
        <Skeleton className="w-full h-64" />
        <div className="p-5 space-y-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-3/4" />
          <div className="flex justify-between items-center mt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'category') {
    return (
      <div className="rounded-2xl overflow-hidden bg-card shadow-md animate-pulse">
        <Skeleton className="h-56 md:h-60 w-full" />
        <div className="p-4 md:p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-card rounded-xl overflow-hidden shadow-md animate-pulse">
      <Skeleton className="w-full h-48" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
