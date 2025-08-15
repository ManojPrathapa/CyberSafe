"use client";

import { useState, useEffect } from "react";

export default function SimpleThemeTest() {
  const [currentTheme, setCurrentTheme] = useState('system');

  const themes = [
    { value: 'system', label: 'System', icon: '🖥️' },
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' }
  ];

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
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  useEffect(() => {
    applyTheme(currentTheme);
  }, []);

  return (
    <div className="p-8 min-h-screen transition-colors duration-300">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Simple Theme Test</h1>
        
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-sm">Current theme: <strong>{currentTheme}</strong></p>
          <p className="text-xs">Look for theme indicator in top-right corner</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Theme Options</h2>
          
          <div className="space-y-3">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => handleThemeChange(theme.value)}
                className={`w-full p-3 rounded-lg border-2 transition-all ${
                  currentTheme === theme.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{theme.icon}</span>
                  <span className="font-medium">{theme.label}</span>
                  {currentTheme === theme.value && (
                    <span className="ml-auto text-purple-600">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              This page tests theme switching without authentication. You should see a theme indicator in the top-right corner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 