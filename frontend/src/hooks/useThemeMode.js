import { useState, useEffect } from 'react';

/**
 * useThemeMode — shared hook for reading the current theme (dark/light).
 *
 * Listens to the 'storage' event (cross-tab) and reads localStorage
 * on mount (same-tab changes committed by window.toggleTheme).
 */
export function useThemeMode() {
  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem('themeMode') || 'dark'
  );

  useEffect(() => {
    // Sync on mount in case another tab changed it
    setThemeMode(localStorage.getItem('themeMode') || 'dark');

    const onStorage = () => {
      setThemeMode(localStorage.getItem('themeMode') || 'dark');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return themeMode;
}
