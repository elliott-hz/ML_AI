import { useState, useEffect } from 'react';

/**
 * useThemeMode — shared hook for reading the current theme (dark/light).
 *
 * Listens to:
 *   - Custom 'qwen-theme-change' event (dispatched by App.jsx toggleTheme)
 *   - 'storage' event (cross-tab sync)
 * Falls back to reading localStorage on mount.
 */
export function useThemeMode() {
  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem('themeMode') || 'dark'
  );

  useEffect(() => {
    // Sync from localStorage on mount
    setThemeMode(localStorage.getItem('themeMode') || 'dark');

    // Listen for same-tab theme toggle (dispatched by App.jsx)
    const onThemeChange = (e) => {
      setThemeMode(e.detail);
    };

    // Listen for cross-tab storage changes
    const onStorage = () => {
      setThemeMode(localStorage.getItem('themeMode') || 'dark');
    };

    window.addEventListener('qwen-theme-change', onThemeChange);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('qwen-theme-change', onThemeChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return themeMode;
}
