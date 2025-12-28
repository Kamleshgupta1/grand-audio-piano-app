import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Share2, 
  Heart, 
  Flame,
  Clock,
  Star,
  UserPlus,
  UserMinus,
  Music,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useSocialFeatures, PublicStreak } from '@/hooks/useSocialFeatures';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

interface SocialPanelProps {
  className?: string;
  compact?: boolean;
}

const SocialPanel: React.FC<SocialPanelProps> = ({ className, compact = false }) => {
  const { user } = useAuth();
  const { 
    profile, 
    publicStreaks, 
    loading, 
    isAuthenticated,
    followUser,
    unfollowUser,
    isFollowing 
  } = useSocialFeatures();
  const [expanded, setExpanded] = useState(false);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h` : `${minutes}m`;
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1.5"
          onClick={() => setExpanded(!expanded)}
        >
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{profile?.followers?.length || 0}</span>
        </Button>
        <div className="flex items-center gap-1.5 text-sm">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="font-medium">#{publicStreaks.findIndex(s => s.uid === user?.uid) + 1 || '-'}</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={cn("bg-card border border-border rounded-xl p-6", className)}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Join the Community</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sign in to follow musicians, share recordings, and compete on leaderboards
            </p>
          </div>
          <Button className="gap-2">
            <LogIn className="w-4 h-4" />
            Sign In to Connect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-card border border-border rounded-xl overflow-hidden", className)}>
      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-border bg-muted/30">
          <TabsTrigger value="leaderboard" className="gap-1.5 text-xs sm:text-sm">
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Leaderboard</span>
          </TabsTrigger>
          <TabsTrigger value="following" className="gap-1.5 text-xs sm:text-sm">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Following</span>
          </TabsTrigger>
          <TabsTrigger value="recordings" className="gap-1.5 text-xs sm:text-sm">
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline">Shared</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="p-4 space-y-3 max-h-80 overflow-y-auto">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-orange-500" />
            Practice Streak Leaderboard
          </h4>
          
          {publicStreaks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No public streaks yet. Be the first!
            </p>
          ) : (
            <div className="space-y-2">
              {publicStreaks.slice(0, expanded ? 20 : 5).map((streak, index) => (
                <motion.div
                  key={streak.uid}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-colors",
                    streak.uid === user?.uid 
                      ? "bg-primary/10 border border-primary/20" 
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    index === 0 && "bg-yellow-500 text-yellow-900",
                    index === 1 && "bg-gray-300 text-gray-700",
                    index === 2 && "bg-amber-600 text-amber-100",
                    index > 2 && "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={streak.photoURL} alt={streak.displayName} />
                    <AvatarFallback>{streak.displayName[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {streak.displayName}
                      {streak.uid === user?.uid && (
                        <span className="text-xs text-primary ml-1">(You)</span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3" /> Lv.{streak.level}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {formatTime(streak.totalPracticeMinutes)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-orange-500">
                    <Flame className="w-4 h-4" />
                    <span className="font-bold">{streak.practiceStreak}</span>
                  </div>
                  
                  {streak.uid !== user?.uid && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => isFollowing(streak.uid) ? unfollowUser(streak.uid) : followUser(streak.uid)}
                    >
                      {isFollowing(streak.uid) ? (
                        <UserMinus className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <UserPlus className="w-4 h-4 text-primary" />
                      )}
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
          
          {publicStreaks.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>Show Less <ChevronUp className="w-4 h-4 ml-1" /></>
              ) : (
                <>Show More <ChevronDown className="w-4 h-4 ml-1" /></>
              )}
            </Button>
          )}
        </TabsContent>

        <TabsContent value="following" className="p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Following ({profile?.following?.length || 0})
          </h4>
          
          {!profile?.following?.length ? (
            <div className="text-center py-6">
              <Users className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                You're not following anyone yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Follow musicians from the leaderboard to see their progress
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Following {profile.following.length} musicians
            </p>
          )}
        </TabsContent>

        <TabsContent value="recordings" className="p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Shared Recordings ({profile?.sharedRecordings?.length || 0})
          </h4>
          
          {!profile?.sharedRecordings?.length ? (
            <div className="text-center py-6">
              <Music className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                No shared recordings yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Record and share your music to appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {profile.sharedRecordings.slice(0, 5).map((recording) => (
                <div key={recording.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                    <Music className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{recording.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Heart className="w-3 h-3" /> {recording.likes?.length || 0}
                      </span>
                      <span>{recording.plays} plays</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialPanel;
