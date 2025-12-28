import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { db } from '@/utils/auth/firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { toast } from '@/components/ui/use-toast';

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  followers: string[];
  following: string[];
  sharedRecordings: SharedRecording[];
  practiceStreak: number;
  totalPracticeMinutes: number;
  isPublicProfile: boolean;
}

export interface SharedRecording {
  id: string;
  title: string;
  instrumentId: string;
  duration: number;
  createdAt: string;
  likes: string[];
  plays: number;
}

export interface PublicStreak {
  uid: string;
  displayName: string;
  photoURL: string;
  practiceStreak: number;
  totalPracticeMinutes: number;
  level: number;
}

export const useSocialFeatures = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [publicStreaks, setPublicStreaks] = useState<PublicStreak[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize or load user profile
  useEffect(() => {
    if (!user?.uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const profileRef = doc(db, 'userProfiles', user.uid);
    
    const unsubscribe = onSnapshot(profileRef, async (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as UserProfile);
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || 'Musician',
          photoURL: user.photoURL || '',
          bio: '',
          followers: [],
          following: [],
          sharedRecordings: [],
          practiceStreak: 0,
          totalPracticeMinutes: 0,
          isPublicProfile: true,
        };
        await setDoc(profileRef, { ...newProfile, createdAt: serverTimestamp() });
        setProfile(newProfile);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, user?.displayName, user?.photoURL]);

  // Load public practice streaks leaderboard
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const q = query(
          collection(db, 'userProfiles'),
          where('isPublicProfile', '==', true),
          orderBy('practiceStreak', 'desc'),
          limit(20)
        );
        
        const snapshot = await getDocs(q);
        const streaks: PublicStreak[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            uid: doc.id,
            displayName: data.displayName || 'Anonymous',
            photoURL: data.photoURL || '',
            practiceStreak: data.practiceStreak || 0,
            totalPracticeMinutes: data.totalPracticeMinutes || 0,
            level: Math.floor((data.xp || 0) / 500) + 1,
          };
        });
        
        setPublicStreaks(streaks);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      }
    };

    loadLeaderboard();
  }, []);

  // Follow a user
  const followUser = useCallback(async (targetUserId: string) => {
    if (!user?.uid || !profile) {
      toast({ description: 'Please sign in to follow users' });
      return false;
    }

    if (targetUserId === user.uid) {
      toast({ description: "You can't follow yourself" });
      return false;
    }

    try {
      // Update current user's following
      const currentUserRef = doc(db, 'userProfiles', user.uid);
      await updateDoc(currentUserRef, {
        following: arrayUnion(targetUserId)
      });

      // Update target user's followers
      const targetUserRef = doc(db, 'userProfiles', targetUserId);
      await updateDoc(targetUserRef, {
        followers: arrayUnion(user.uid)
      });

      toast({ description: 'Successfully followed!' });
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      toast({ description: 'Failed to follow user' });
      return false;
    }
  }, [user?.uid, profile]);

  // Unfollow a user
  const unfollowUser = useCallback(async (targetUserId: string) => {
    if (!user?.uid) return false;

    try {
      const currentUserRef = doc(db, 'userProfiles', user.uid);
      await updateDoc(currentUserRef, {
        following: arrayRemove(targetUserId)
      });

      const targetUserRef = doc(db, 'userProfiles', targetUserId);
      await updateDoc(targetUserRef, {
        followers: arrayRemove(user.uid)
      });

      toast({ description: 'Unfollowed successfully' });
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
  }, [user?.uid]);

  // Share a recording
  const shareRecording = useCallback(async (recording: Omit<SharedRecording, 'id' | 'createdAt' | 'likes' | 'plays'>) => {
    if (!user?.uid || !profile) {
      toast({ description: 'Please sign in to share recordings' });
      return null;
    }

    try {
      const newRecording: SharedRecording = {
        ...recording,
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        likes: [],
        plays: 0,
      };

      const profileRef = doc(db, 'userProfiles', user.uid);
      await updateDoc(profileRef, {
        sharedRecordings: arrayUnion(newRecording)
      });

      toast({ description: 'Recording shared successfully!' });
      return newRecording.id;
    } catch (error) {
      console.error('Error sharing recording:', error);
      toast({ description: 'Failed to share recording' });
      return null;
    }
  }, [user?.uid, profile]);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user?.uid) return false;

    try {
      const profileRef = doc(db, 'userProfiles', user.uid);
      await updateDoc(profileRef, { ...updates, updatedAt: serverTimestamp() });
      toast({ description: 'Profile updated!' });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ description: 'Failed to update profile' });
      return false;
    }
  }, [user?.uid]);

  // Sync gamification data with profile
  const syncGamificationData = useCallback(async (streak: number, totalMinutes: number) => {
    if (!user?.uid) return;

    try {
      const profileRef = doc(db, 'userProfiles', user.uid);
      await updateDoc(profileRef, {
        practiceStreak: streak,
        totalPracticeMinutes: totalMinutes,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error syncing gamification:', error);
    }
  }, [user?.uid]);

  // Check if following a user
  const isFollowing = useCallback((targetUserId: string): boolean => {
    return profile?.following?.includes(targetUserId) || false;
  }, [profile?.following]);

  // Get user profile by ID
  const getUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const profileRef = doc(db, 'userProfiles', userId);
      const snapshot = await getDoc(profileRef);
      return snapshot.exists() ? snapshot.data() as UserProfile : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }, []);

  return {
    profile,
    following,
    followers,
    publicStreaks,
    loading,
    isAuthenticated: !!user,
    followUser,
    unfollowUser,
    shareRecording,
    updateProfile,
    syncGamificationData,
    isFollowing,
    getUserProfile,
  };
};

export default useSocialFeatures;
