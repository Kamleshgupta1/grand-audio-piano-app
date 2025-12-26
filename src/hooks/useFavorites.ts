import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'harmonyhub_favorites';
const RECENT_KEY = 'harmonyhub_recent';
const MAX_RECENT = 10;

interface UseFavoritesReturn {
  favorites: string[];
  recentInstruments: string[];
  isFavorite: (instrumentId: string) => boolean;
  toggleFavorite: (instrumentId: string) => void;
  addToRecent: (instrumentId: string) => void;
  clearRecent: () => void;
}

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentInstruments, setRecentInstruments] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      const storedRecent = localStorage.getItem(RECENT_KEY);
      
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      if (storedRecent) {
        setRecentInstruments(JSON.parse(storedRecent));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  // Save recent to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentInstruments));
    } catch (error) {
      console.error('Error saving recent to localStorage:', error);
    }
  }, [recentInstruments]);

  const isFavorite = useCallback((instrumentId: string): boolean => {
    return favorites.includes(instrumentId);
  }, [favorites]);

  const toggleFavorite = useCallback((instrumentId: string): void => {
    setFavorites((prev) => {
      if (prev.includes(instrumentId)) {
        return prev.filter((id) => id !== instrumentId);
      }
      return [...prev, instrumentId];
    });
  }, []);

  const addToRecent = useCallback((instrumentId: string): void => {
    setRecentInstruments((prev) => {
      const filtered = prev.filter((id) => id !== instrumentId);
      const updated = [instrumentId, ...filtered];
      return updated.slice(0, MAX_RECENT);
    });
  }, []);

  const clearRecent = useCallback((): void => {
    setRecentInstruments([]);
  }, []);

  return {
    favorites,
    recentInstruments,
    isFavorite,
    toggleFavorite,
    addToRecent,
    clearRecent,
  };
};

export default useFavorites;
