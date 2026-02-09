import React, { createContext, useContext, useState, ReactNode } from 'react';

export const lightTheme = {
  background: '#0a0a0f',
  surface: 'rgba(20, 25, 40, 0.8)',
  primary: '#00ffff',
  secondary: '#ff00ff',
  accent: '#ffff00',
  text: '#ffffff',
  textSecondary: '#00ffff',
  textMuted: '#888888',
  border: '#00ffff',
  cardBackground: 'rgba(10, 15, 30, 0.9)',
  tabBarBackground: '#0a0a0f',
  headerBackground: '#0a0a0f',
  income: '#00ff88',
  expense: '#ff0088',
  backgroundImage: require('@/assets/bg/bg-light.png'),
  glow: '#00ffff',
  shadow: 'rgba(0, 255, 255, 0.3)',
};

export const darkTheme = {
  background: '#000008',
  surface: 'rgba(5, 10, 25, 0.9)',
  primary: '#00ccff',
  secondary: '#cc00ff',
  accent: '#ffcc00',
  text: '#ffffff',
  textSecondary: '#00ccff',
  textMuted: '#666666',
  border: '#00ccff',
  cardBackground: 'rgba(5, 5, 20, 0.95)',
  tabBarBackground: '#000008',
  headerBackground: '#000008',
  income: '#00ff66',
  expense: '#ff0066',
  backgroundImage: require('@/assets/bg/bg-dark.png'),
  glow: '#00ccff',
  shadow: 'rgba(0, 204, 255, 0.4)',
};

interface ThemeContextType {
  theme: typeof lightTheme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true); // Default to dark for cyberpunk feel
  
  const toggleTheme = () => setIsDark(!isDark);
  
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}