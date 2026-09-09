import { useEffect } from 'react';
import { ThemeMode } from '../types';

export function useTheme() {
  const theme: ThemeMode = 'dark';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    localStorage.setItem('reckd-theme', 'dark');
  }, []);

  return { theme };
}
