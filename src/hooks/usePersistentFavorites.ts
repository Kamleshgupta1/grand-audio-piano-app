import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { db } from '@/utils/auth/firebase';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

const LOCAL_FAVORITES_KEY = 'harmonyhub_favorites';
const LOCAL_RECENT_KEY = 'harmonyhub_recent';
const MAX_RECENT = 10;

interface UsePersistentFavoritesReturn {
  favorites: string[];
  recentInstruments: string[];
  isFavorite: (instrumentId: string) => boolean;
  toggleFavorite: (instrumentId: string) => void;
  addToRecent: (instrumentId: string) => void;
  clearRecent: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export const usePersistentFavorites = (): UsePersistentFavoritesReturn => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentInstruments, setRecentInstruments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data - from Firebase if logged in, otherwise localStorage
  useEffect(() => {
    if (user?.uid) {
      const userFavoritesRef = doc(db, 'userFavorites', user.uid);
      
      const unsubscribe = onSnapshot(userFavoritesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setFavorites(data.favorites || []);
          setRecentInstruments(data.recentInstruments || []);
        } else {
          // Migrate localStorage data to Firebase
          const localFavorites = localStorage.getItem(LOCAL_FAVORITES_KEY);
          const localRecent = localStorage.getItem(LOCAL_RECENT_KEY);
          const favs = localFavorites ? JSON.parse(localFavorites) : [];
          const recent = localRecent ? JSON.parse(localRecent) : [];
          
          setDoc(userFavoritesRef, { 
            favorites: favs, 
            recentInstruments: recent,
            updatedAt: serverTimestamp() 
          });
          setFavorites(favs);
          setRecentInstruments(recent);
        }
        setLoading(false);
      });
      
      return () => unsubscribe();
    } else {
      // Use localStorage for non-authenticated users
      try {
        const storedFavorites = localStorage.getItem(LOCAL_FAVORITES_KEY);
        const storedRecent = localStorage.getItem(LOCAL_RECENT_KEY);
        
        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
        if (storedRecent) setRecentInstruments(JSON.parse(storedRecent));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
      setLoading(false);
    }
  }, [user?.uid]);

  // Save data
  const saveData = useCallback(async (favs: string[], recent: string[]) => {
    if (user?.uid) {
      const userFavoritesRef = doc(db, 'userFavorites', user.uid);
      await setDoc(userFavoritesRef, { 
        favorites: favs, 
        recentInstruments: recent,
        updatedAt: serverTimestamp() 
      });
    } else {
      localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favs));
      localStorage.setItem(LOCAL_RECENT_KEY, JSON.stringify(recent));
    }
  }, [user?.uid]);

  const isFavorite = useCallback((instrumentId: string): boolean => {
    return favorites.includes(instrumentId);
  }, [favorites]);

  const toggleFavorite = useCallback((instrumentId: string): void => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(instrumentId)
        ? prev.filter((id) => id !== instrumentId)
        : [...prev, instrumentId];
      
      saveData(newFavorites, recentInstruments);
      return newFavorites;
    });
  }, [saveData, recentInstruments]);

  const addToRecent = useCallback((instrumentId: string): void => {
    setRecentInstruments((prev) => {
      const filtered = prev.filter((id) => id !== instrumentId);
      const updated = [instrumentId, ...filtered].slice(0, MAX_RECENT);
      
      saveData(favorites, updated);
      return updated;
    });
  }, [saveData, favorites]);

  const clearRecent = useCallback((): void => {
    setRecentInstruments([]);
    saveData(favorites, []);
  }, [saveData, favorites]);

  return {
    favorites,
    recentInstruments,
    isFavorite,
    toggleFavorite,
    addToRecent,
    clearRecent,
    loading,
    isAuthenticated: !!user,
  };
};

export default usePersistentFavorites;
