import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const lightColors = {
  background: '#f0f2f5',
  surface: '#ffffff',
  text: '#1a1a40',
  textSecondary: '#636e72',
  border: '#e9ecef',
  primary: '#667eea',
  gradient: ['#667eea', '#764ba2'],
  secondaryButton: '#fff',
  secondaryButtonText: '#2d3436',
  cardShadow: 'rgba(0,0,0,0.04)',
};

const darkColors = {
  background: '#0a0a23',
  surface: '#151538',
  text: '#ffffff',
  textSecondary: '#a5b1c2',
  border: '#2c3e50',
  primary: '#667eea',
  gradient: ['#667eea', '#764ba2'],
  secondaryButton: '#151538',
  secondaryButtonText: '#ffffff',
  cardShadow: 'rgba(0,0,0,0.5)',
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('sf_mb_theme');
      if (savedTheme === 'dark') {
        setIsDark(true);
      }
    } catch (e) {
      console.log('Failed to load theme', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('sf_mb_theme', newTheme ? 'dark' : 'light');
    } catch (e) {
      console.log('Failed to save theme', e);
    }
  };

  const themeColors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors: themeColors, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};
