import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Star, 
  Award,
  TrendingUp,
  X,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { usePersistentGamification } from '@/hooks/usePersistentGamification';
import { Link } from 'react-router-dom';

interface GamificationPanelProps {
  className?: string;
  compact?: boolean;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ 
  className,
  compact = false 
}) => {
  const {
    practiceStreak,
    totalPracticeMinutes,
    instrumentsPlayed,
    achievements,
    allAchievements,
    newAchievements,
    clearNewAchievements,
    getProgress,
    isAuthenticated,
  } = usePersistentGamification();

  const progress = getProgress();

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="flex items-center gap-1.5 text-sm">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-medium text-foreground">{practiceStreak}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-medium text-foreground">Lv.{progress.level}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">{achievements.length}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Achievement Notification */}
      <AnimatePresence>
        {newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 text-white/80 hover:text-white hover:bg-white/20"
              onClick={clearNewAchievements}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="text-3xl">{newAchievements[0].icon}</div>
              <div>
                <p className="text-xs font-medium opacity-80">Achievement Unlocked!</p>
                <p className="font-bold">{newAchievements[0].name}</p>
                <p className="text-xs opacity-80">{newAchievements[0].description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Panel */}
      <div className={cn("bg-card border border-border rounded-xl p-5 space-y-5", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Your Progress
          </h3>
          <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">Level {progress.level}</span>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Experience</span>
            <span className="text-foreground font-medium">{progress.currentXp} / {progress.requiredXp} XP</span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg p-3 text-center border border-orange-500/20">
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{practiceStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-3 text-center border border-blue-500/20">
            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{formatTime(totalPracticeMinutes)}</p>
            <p className="text-xs text-muted-foreground">Practice Time</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-3 text-center border border-purple-500/20">
            <Award className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{instrumentsPlayed.length}</p>
            <p className="text-xs text-muted-foreground">Instruments</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Achievements ({achievements.length}/{allAchievements.length})
          </h4>
          
          <div className="grid grid-cols-5 gap-2">
            {allAchievements.map((achievement) => {
              const isUnlocked = achievements.some(a => a.id === achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={cn(
                    "aspect-square rounded-lg flex items-center justify-center text-2xl transition-all duration-300",
                    isUnlocked
                      ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 shadow-sm"
                      : "bg-muted/50 opacity-40 grayscale"
                  )}
                  title={`${achievement.name}: ${achievement.description}`}
                >
                  {achievement.icon}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default GamificationPanel;
