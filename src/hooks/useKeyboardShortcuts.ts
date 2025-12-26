import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'h',
      alt: true,
      action: () => navigate('/'),
      description: 'Go to Home',
    },
    {
      key: 'e',
      alt: true,
      action: () => navigate('/explore'),
      description: 'Go to Explore',
    },
    {
      key: 'p',
      alt: true,
      action: () => navigate('/piano'),
      description: 'Go to Piano',
    },
    {
      key: 'g',
      alt: true,
      action: () => navigate('/guitar'),
      description: 'Go to Guitar',
    },
    {
      key: 'd',
      alt: true,
      action: () => navigate('/drums'),
      description: 'Go to Drums',
    },
    {
      key: 't',
      alt: true,
      action: () => setMode(mode === 'dark' ? 'light' : 'dark'),
      description: 'Toggle Theme',
    },
    {
      key: '/',
      ctrl: true,
      action: () => {
        // Focus search if exists, or show shortcuts modal
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: 'Focus Search',
    },
  ];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && altMatch && shiftMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts };
};

export default useKeyboardShortcuts;
