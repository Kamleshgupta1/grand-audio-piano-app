
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'custom';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  customColors: CustomColors;
  setCustomColors: (colors: CustomColors) => void;
}

interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

const defaultCustomColors: CustomColors = {
  primary: '#646cff',
  secondary: '#535bf2',
  accent: '#747bff',
  background: '#242424',
};

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  setMode: () => {},
  customColors: defaultCustomColors,
  setCustomColors: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [customColors, setCustomColors] = useState<CustomColors>(defaultCustomColors);

  useEffect(() => {
    // Load saved theme from localStorage
    try {
      const savedMode = localStorage.getItem('themeMode') as ThemeMode;
      const savedColors = localStorage.getItem('customColors');
      
      if (savedMode && ['light', 'dark', 'custom'].includes(savedMode)) {
        setMode(savedMode);
      }
      
      if (savedColors) {
        const parsedColors = JSON.parse(savedColors);
        setCustomColors(parsedColors);
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    // Save theme preferences
    try {
      localStorage.setItem('themeMode', mode);
      localStorage.setItem('customColors', JSON.stringify(customColors));
      
      // Apply theme to document
      const root = document.documentElement;
      
      if (mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      if (mode === 'custom') {
        // Apply custom colors
        root.style.setProperty('--primary', customColors.primary);
        root.style.setProperty('--secondary', customColors.secondary);
        root.style.setProperty('--accent', customColors.accent);
        root.style.setProperty('--background', customColors.background);
        
        document.body.style.backgroundColor = customColors.background;
        document.body.style.color = getContrastingTextColor(customColors.background);
      } else {
        // Clear custom properties
        root.style.removeProperty('--primary');
        root.style.removeProperty('--secondary');
        root.style.removeProperty('--accent');
        root.style.removeProperty('--background');
        
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      }
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
  }, [mode, customColors]);
  
  function getContrastingTextColor(hexColor: string): string {
    try {
      const hex = hexColor.replace(/^#/, '');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? '#000000' : '#ffffff';
    } catch (error) {
      return '#000000';
    }
  }

  const value = {
    mode,
    setMode,
    customColors,
    setCustomColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
