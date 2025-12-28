import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { db } from '@/utils/auth/firebase';
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

const LOCAL_KEY = 'harmonyhub_gamification';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

interface GamificationData {
  practiceStreak: number;
  lastPracticeDate: string | null;
  totalPracticeMinutes: number;
  instrumentsPlayed: string[];
  achievements: Achievement[];
  level: number;
  xp: number;
}

const DEFAULT_DATA: GamificationData = {
  practiceStreak: 0,
  lastPracticeDate: null,
  totalPracticeMinutes: 0,
  instrumentsPlayed: [],
  achievements: [],
  level: 1,
  xp: 0,
};

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_note', name: 'First Note', description: 'Play your first instrument', icon: '🎵' },
  { id: 'explorer', name: 'Explorer', description: 'Try 3 different instruments', icon: '🔍' },
  { id: 'collector', name: 'Collector', description: 'Try 5 different instruments', icon: '🎭' },
  { id: 'master', name: 'Master', description: 'Try all available instruments', icon: '👑' },
  { id: 'streak_3', name: 'Getting Started', description: 'Practice for 3 days in a row', icon: '🔥' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Practice for 7 days in a row', icon: '⚡' },
  { id: 'streak_30', name: 'Monthly Master', description: 'Practice for 30 days in a row', icon: '🏆' },
  { id: 'practice_60', name: 'Dedicated', description: 'Practice for 60 minutes total', icon: '⏱️' },
  { id: 'practice_300', name: 'Committed', description: 'Practice for 5 hours total', icon: '🎯' },
  { id: 'practice_600', name: 'Virtuoso', description: 'Practice for 10 hours total', icon: '🌟' },
  { id: 'social_share', name: 'Sharer', description: 'Share your first recording', icon: '📤' },
  { id: 'first_follower', name: 'Rising Star', description: 'Get your first follower', icon: '⭐' },
];

const XP_PER_MINUTE = 10;
const XP_PER_LEVEL = 500;

export const usePersistentGamification = () => {
  const { user } = useAuth();
  const [data, setData] = useState<GamificationData>(DEFAULT_DATA);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data - from Firebase if logged in, otherwise localStorage
  useEffect(() => {
    if (user?.uid) {
      const userGamificationRef = doc(db, 'userGamification', user.uid);
      
      const unsubscribe = onSnapshot(userGamificationRef, (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.data() as GamificationData);
        } else {
          // Migrate localStorage data to Firebase
          const localData = localStorage.getItem(LOCAL_KEY);
          if (localData) {
            const parsed = JSON.parse(localData);
            setDoc(userGamificationRef, { ...parsed, updatedAt: serverTimestamp() });
            setData(parsed);
          }
        }
        setLoading(false);
      });
      
      return () => unsubscribe();
    } else {
      // Use localStorage for non-authenticated users
      try {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (stored) {
          setData(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading gamification data:', error);
      }
      setLoading(false);
    }
  }, [user?.uid]);

  // Save data
  const saveData = useCallback(async (newData: GamificationData) => {
    if (user?.uid) {
      const userGamificationRef = doc(db, 'userGamification', user.uid);
      await setDoc(userGamificationRef, { ...newData, updatedAt: serverTimestamp() });
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(newData));
    }
  }, [user?.uid]);

  const checkAchievements = useCallback((currentData: GamificationData): Achievement[] => {
    const newUnlocked: Achievement[] = [];
    const unlockedIds = currentData.achievements.map(a => a.id);

    if (!unlockedIds.includes('first_note') && currentData.instrumentsPlayed.length >= 1) {
      newUnlocked.push({ ...ACHIEVEMENTS.find(a => a.id === 'first_note')!, unlockedAt: new Date().toISOString() });
    }

    if (!unlockedIds.includes('explorer') && currentData.instrumentsPlayed.length >= 3) {
      newUnlocked.push({ ...ACHIEVEMENTS.find(a => a.id === 'explorer')!, unlockedAt: new Date().toISOString() });
    }

    if (!unlockedIds.includes('collector') && currentData.instrumentsPlayed.length >= 5) {
      newUnlocked.push({ ...ACHIEVEMENTS.find(a => a.id === 'collector')!, unlockedAt: new Date().toISOString() });
    }

    if (!unlockedIds.includes('streak_3') && currentData.practiceStreak >= 3) {
      newUnlocked.push({ ...ACHIEVEMENTS.find(a => a.id === 'streak_3')!, unlockedAt: new Date().toISOString() });
    }

    if (!unlockedIds.includes('streak_7') && currentData.practiceStreak >= 7) {
      newUnlocked.push({ ...ACHIEVEMENTS.find(a => a.id === 'streak_7')!, unlockedAt: new Date().toISOString() });
    }

    if (!unlockedIds.includes('streak_30') && currentData.practiceStreak >= 30) {
      newUnlocked.push({ ...ACHIEVEMENTS.find(a => a.id === 'streak_30')!, unlockedAt: new Date().toISOString() });
    }

    if (!unlockedIds.includes('practice_60') && currentData.totalPracticeMinutes >= 60) {
      newUnlocked.push({ ...ACHIEVEMENTS.find(a => a.id === 'practice_60')!, unlockedAt: new Date().toISOString() });
    }

    if (!unlockedIds.includes('practice_300') && currentData.totalPracticeMinutes >= 300) {
      newUnlocked.push({ ...ACHIEVEMENTS.find(a => a.id === 'practice_300')!, unlockedAt: new Date().toISOString() });
    }

    if (!unlockedIds.includes('practice_600') && currentData.totalPracticeMinutes >= 600) {
      newUnlocked.push({ ...ACHIEVEMENTS.find(a => a.id === 'practice_600')!, unlockedAt: new Date().toISOString() });
    }

    return newUnlocked;
  }, []);

  const recordPractice = useCallback((instrumentId: string, minutes: number = 1) => {
    setData((prev) => {
      const today = new Date().toDateString();
      const lastDate = prev.lastPracticeDate;
      
      let newStreak = prev.practiceStreak;
      
      if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate === yesterday.toDateString()) {
          newStreak = prev.practiceStreak + 1;
        } else if (lastDate !== today) {
          newStreak = 1;
        }
      }

      const newInstruments = prev.instrumentsPlayed.includes(instrumentId)
        ? prev.instrumentsPlayed
        : [...prev.instrumentsPlayed, instrumentId];

      const newXp = prev.xp + (minutes * XP_PER_MINUTE);
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

      const updatedData: GamificationData = {
        ...prev,
        practiceStreak: newStreak,
        lastPracticeDate: today,
        totalPracticeMinutes: prev.totalPracticeMinutes + minutes,
        instrumentsPlayed: newInstruments,
        xp: newXp,
        level: newLevel,
      };

      const newUnlocked = checkAchievements(updatedData);
      if (newUnlocked.length > 0) {
        updatedData.achievements = [...prev.achievements, ...newUnlocked];
        setNewAchievements(newUnlocked);
      }

      saveData(updatedData);
      return updatedData;
    });
  }, [checkAchievements, saveData]);

  const unlockAchievement = useCallback((achievementId: string) => {
    setData((prev) => {
      if (prev.achievements.some(a => a.id === achievementId)) return prev;
      
      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (!achievement) return prev;
      
      const unlockedAchievement = { ...achievement, unlockedAt: new Date().toISOString() };
      const updatedData = {
        ...prev,
        achievements: [...prev.achievements, unlockedAchievement]
      };
      
      setNewAchievements([unlockedAchievement]);
      saveData(updatedData);
      return updatedData;
    });
  }, [saveData]);

  const clearNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  const getProgress = useCallback(() => {
    const xpInCurrentLevel = data.xp % XP_PER_LEVEL;
    return {
      level: data.level,
      currentXp: xpInCurrentLevel,
      requiredXp: XP_PER_LEVEL,
      percentage: (xpInCurrentLevel / XP_PER_LEVEL) * 100,
    };
  }, [data.level, data.xp]);

  return {
    ...data,
    allAchievements: ACHIEVEMENTS,
    newAchievements,
    recordPractice,
    unlockAchievement,
    clearNewAchievements,
    getProgress,
    loading,
    isAuthenticated: !!user,
  };
};

export default usePersistentGamification;
