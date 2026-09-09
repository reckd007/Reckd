import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useFavorites } from './hooks/useFavorites';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { LandingPage } from './components/LandingPage';
import { ToolsDirectoryPage } from './components/ToolsDirectoryPage';

export default function App() {
  const { theme } = useTheme();
  const { favorites, toggleFavorite, markUsed } = useFavorites();

  // Navigation view state: always starts on the home/landing page upon load or reload
  const [currentView, setCurrentView] = useState<'landing' | 'tools'>('landing');

  const [initialSelectedToolId, setInitialSelectedToolId] = useState<string | null>(null);
  const [initialSelectedCategoryId, setInitialSelectedCategoryId] = useState<string | null>(null);

  // On page load/reload, ensure clean landing page view and strip any lingering #tools hash
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#tools')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  // Sync with browser hash for seamless back/forward navigation during browsing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#tools')) {
        setCurrentView('tools');
        const params = new URLSearchParams(hash.replace('#tools', '').replace(/^\?/, ''));
        const tool = params.get('tool');
        const cat = params.get('category');
        setInitialSelectedToolId(tool || null);
        setInitialSelectedCategoryId(cat || null);
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToTools = (categoryId?: string, toolId?: string) => {
    setInitialSelectedToolId(toolId || null);
    setInitialSelectedCategoryId(categoryId || null);
    if (toolId) {
      markUsed(toolId);
      window.location.hash = `#tools?tool=${toolId}${categoryId ? `&category=${categoryId}` : ''}`;
    } else if (categoryId) {
      window.location.hash = `#tools?category=${categoryId}`;
    } else {
      window.location.hash = '#tools';
    }
    setCurrentView('tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="min-h-screen relative font-sans selection:bg-[#ff6b00] selection:text-white bg-[#0a0a0a] text-white"
    >
      {currentView === 'landing' ? (
        <div className="relative">
          {/* Infinite Interactive Starfield Canvas with Parallax and Scroll Split */}
          <StarfieldCanvas theme="dark" />

          {/* Landing Page Content */}
          <LandingPage
            theme="dark"
            onNavigateToTools={navigateToTools}
          />
        </div>
      ) : (
        /* Dedicated Full Tools Page */
        <ToolsDirectoryPage
          theme="dark"
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onNavigateHome={navigateToHome}
          initialToolId={initialSelectedToolId}
          initialCategoryId={initialSelectedCategoryId}
        />
      )}
    </div>
  );
}
