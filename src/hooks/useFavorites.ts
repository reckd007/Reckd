import { useEffect, useState } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('reckd-favorites');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['qr-code-generator', 'currency-converter', 'json-formatter'];
  });

  const [recentTools, setRecentTools] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('reckd-recents');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['currency-converter', 'password-generator', 'qr-code-generator'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('reckd-favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('reckd-recents', JSON.stringify(recentTools));
    } catch (e) {
      console.error(e);
    }
  }, [recentTools]);

  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  const markUsed = (toolId: string) => {
    setRecentTools((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      return [toolId, ...filtered].slice(0, 10);
    });
  };

  return {
    favorites,
    recentTools,
    toggleFavorite,
    isFavorite,
    markUsed,
  };
}
