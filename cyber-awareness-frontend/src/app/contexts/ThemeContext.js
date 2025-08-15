"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { apiHelpers, getUserId } from '../utils/apiConfig';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('system');
  const [loading, setLoading] = useState(true);

  // Load theme from backend on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    console.log('ThemeContext: Applying theme', currentTheme);
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Apply initial theme on mount
  useEffect(() => {
    console.log('ThemeContext: Initial theme application');
    applyTheme(currentTheme);
  }, []);

  const loadTheme = async () => {
    try {
      const userId = getUserId();
      if (userId) {
        const response = await apiHelpers.get(`/prefs/theme/${userId}`);
        setCurrentTheme(response.theme || 'system');
      } else {
        setCurrentTheme('system');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      setCurrentTheme('system');
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    const body = document.body;
    
    console.log('Applying theme:', theme);
    
    // Remove existing theme classes from both html and body
    root.classList.remove('theme-light', 'theme-dark', 'theme-system');
    body.classList.remove('theme-light', 'theme-dark', 'theme-system');
    
    // Add new theme class to both html and body
    root.classList.add(`theme-${theme}`);
    body.classList.add(`theme-${theme}`);
    
    console.log('Applied classes - html:', root.className, 'body:', body.className);
    
    // Update CSS custom properties based on theme
    if (theme === 'light') {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#171717');
    } else if (theme === 'dark') {
      root.style.setProperty('--background', '#0a0a0a');
      root.style.setProperty('--foreground', '#ededed');
    } else {
      // system theme - let CSS handle it
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
    }
    
    // Force a reflow to ensure styles are applied
    root.offsetHeight;
  };

  const updateTheme = async (theme) => {
    try {
      const userId = getUserId();
      if (userId) {
        await apiHelpers.post('/prefs/theme', {
          user_id: userId,
          theme: theme
        });
      }
      setCurrentTheme(theme);
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  };

  const value = {
    currentTheme,
    updateTheme,
    loading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 