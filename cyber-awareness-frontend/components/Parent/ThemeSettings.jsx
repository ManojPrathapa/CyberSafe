"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../../src/app/contexts/ThemeContext";

export default function ThemeSettings() {
  const { currentTheme, updateTheme, loading: themeLoading } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const themes = [
    { value: 'system', label: 'System', icon: '🖥️', description: 'Follows your system preference' },
    { value: 'light', label: 'Light', icon: '☀️', description: 'Light background with dark text' },
    { value: 'dark', label: 'Dark', icon: '🌙', description: 'Dark background with light text' }
  ];



  const handleThemeChange = async (theme) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Changing theme to:', theme);
      await updateTheme(theme);
      console.log('Theme changed successfully to:', theme);
      
    } catch (error) {
      console.error('Error updating theme:', error);
      setError('Failed to update theme. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-purple-700 mb-2">🌙 Theme Settings</h3>
        <p className="text-gray-600">Choose your preferred theme for the application</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {themes.map((theme) => (
          <div
            key={theme.value}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              currentTheme === theme.value
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25'
            }`}
            onClick={() => handleThemeChange(theme.value)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <input
                  type="radio"
                  name="theme"
                  value={theme.value}
                  checked={currentTheme === theme.value}
                  onChange={() => handleThemeChange(theme.value)}
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{theme.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{theme.label}</h4>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </div>
              </div>
              
              {currentTheme === theme.value && (
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Active
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {(loading || themeLoading) && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 text-sm text-purple-700 bg-purple-100 rounded-lg">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {themeLoading ? 'Loading theme...' : 'Updating theme...'}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Preview</h4>
        <p className="text-sm text-gray-600">
          The theme will be applied immediately. You can see the changes in the background color and text contrast.
        </p>
      </div>
    </div>
  );
} 