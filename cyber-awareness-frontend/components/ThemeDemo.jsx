"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../src/app/contexts/ThemeContext";

export default function ThemeDemo() {
  const { currentTheme, updateTheme } = useTheme();

  useEffect(() => {
    console.log('ThemeDemo: Current theme is', currentTheme);
    console.log('ThemeDemo: HTML classes:', document.documentElement.className);
    console.log('ThemeDemo: Body classes:', document.body.className);
  }, [currentTheme]);

  const themes = [
    { value: 'system', label: 'System', icon: '🖥️' },
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' }
  ];

  return (
    <div className="p-8 min-h-screen transition-colors duration-300">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Theme Demo</h1>
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-sm">Current theme: <strong>{currentTheme}</strong></p>
          <p className="text-xs">Check browser console for theme application logs</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Current Theme: {currentTheme}</h2>
          
          <div className="space-y-3">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => updateTheme(theme.value)}
                className={`w-full p-3 rounded-lg border-2 transition-all ${
                  currentTheme === theme.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{theme.icon}</span>
                  <span className="font-medium">{theme.label}</span>
                  {currentTheme === theme.value && (
                    <span className="ml-auto text-purple-600 dark:text-purple-400">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This demo shows how the theme switching works. The background and text colors should change immediately when you select a different theme.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 