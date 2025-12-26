
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'custom';

interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  customColors: CustomColors;
  setCustomColors: (c: CustomColors) => void;
}

const defaultCustomColors: CustomColors = {
  primary: '#646cff',
  secondary: '#535bf2',
  accent: '#747bff',
  background: '#242424',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('themeMode') as ThemeMode | null;
      return saved || 'light';
    } catch (e) {
      return 'light';
    }
  });

  const [customColors, setCustomColors] = useState<CustomColors>(() => {
    try {
      const s = localStorage.getItem('customColors');
      return s ? JSON.parse(s) : defaultCustomColors;
    } catch (e) {
      return defaultCustomColors;
    }
  });

  // persist settings
  useEffect(() => {
    try {
      localStorage.setItem('themeMode', mode);
      localStorage.setItem('customColors', JSON.stringify(customColors));
    } catch (e) {
      // ignore
    }
  }, [mode, customColors]);

  // apply theme to document
  useEffect(() => {
    const root = typeof document !== 'undefined' ? document.documentElement : null;
    if (!root) return;

    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (mode === 'custom') {
      const hexToHSL = (hex: string) => {
        hex = hex.replace(/^#/, '');
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0,
          s = 0,
          l = (max + min) / 2;
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h = Math.round(h * 60);
        }
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        return `${h} ${s}% ${l}%`;
      };

      root.style.setProperty('--primary', customColors.primary);
      root.style.setProperty('--secondary', customColors.secondary);
      root.style.setProperty('--accent', customColors.accent);
      root.style.setProperty('--background', customColors.background);

      root.style.setProperty('--primary-hsl', hexToHSL(customColors.primary));
      root.style.setProperty('--secondary-hsl', hexToHSL(customColors.secondary));
      root.style.setProperty('--accent-hsl', hexToHSL(customColors.accent));
      root.style.setProperty('--background-hsl', hexToHSL(customColors.background));

      if (typeof document !== 'undefined' && document.body) {
        document.body.style.backgroundColor = customColors.background;
        document.body.style.color = getContrastingTextColor(customColors.background);
      }
    } else {
      root.style.removeProperty('--primary');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--background');
      root.style.removeProperty('--primary-hsl');
      root.style.removeProperty('--secondary-hsl');
      root.style.removeProperty('--accent-hsl');
      root.style.removeProperty('--background-hsl');
      if (typeof document !== 'undefined' && document.body) {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      }
    }
  }, [mode, customColors]);

  const value = useMemo(
    () => ({ mode, setMode, customColors, setCustomColors }),
    [mode, customColors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

function getContrastingTextColor(hexColor: string) {
  const hex = hexColor.replace(/^#/, '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
