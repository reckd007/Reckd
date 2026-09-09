import React, { useState, useMemo } from 'react';
import { toolCategories, allTools, CATEGORY_EMOJIS } from '../data/toolsData';
import { ToolItem } from '../types';
import { ToolRunner } from './ToolRunner';
import {
  Search,
  Heart,
  ArrowLeft,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface ToolsDirectoryPageProps {
  theme: 'dark' | 'light';
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onNavigateHome: () => void;
  initialToolId?: string | null;
  initialCategoryId?: string | null;
}

export const ToolsDirectoryPage: React.FC<ToolsDirectoryPageProps> = ({
  theme,
  favorites,
  toggleFavorite,
  onNavigateHome,
  initialToolId,
  initialCategoryId,
}) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Active running tool (only active when explicitly selected/launched)
  const [activeToolId, setActiveToolId] = useState<string | null>(initialToolId || null);

  // Synchronize when initial props change
  React.useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategory(initialCategoryId);
      setShowOnlyFavorites(false);
      setActiveToolId(null);
    }
  }, [initialCategoryId]);

  React.useEffect(() => {
    if (initialToolId) {
      setActiveToolId(initialToolId);
    }
  }, [initialToolId]);

  const activeTool = useMemo(() => {
    return allTools.find((t) => t.id === activeToolId) || null;
  }, [activeToolId]);

  // Determine if active tool belongs to current filter context
  const isToolVisible = useMemo(() => {
    if (!activeTool) return false;
    if (showOnlyFavorites && !favorites.includes(activeTool.id)) return false;
    if (selectedCategory !== 'all' && activeTool.category !== selectedCategory) return false;
    if (selectedTag && !activeTool.tags.includes(selectedTag)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = activeTool.name.toLowerCase().includes(q);
      const matchDesc = activeTool.description.toLowerCase().includes(q);
      const matchCat = activeTool.category.toLowerCase().includes(q);
      const matchTags = activeTool.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchCat && !matchTags) return false;
    }
    return true;
  }, [activeTool, showOnlyFavorites, favorites, selectedCategory, selectedTag, searchQuery]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    allTools.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).slice(0, 15);
  }, []);

  // Filtered tools: strictly enforce exclusive category, favorites, tag, and search
  const filteredTools = useMemo(() => {
    return allTools.filter((t) => {
      // 1. Favorites filter: when in favorites mode, ONLY favorited tools are shown
      if (showOnlyFavorites && !favorites.includes(t.id)) {
        return false;
      }
      // 2. Category filter: when a category is chosen, ONLY tools in that category are shown
      if (selectedCategory !== 'all' && t.category !== selectedCategory) {
        return false;
      }
      // 3. Tag filter
      if (selectedTag && !t.tags.includes(selectedTag)) {
        return false;
      }
      // 4. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = t.name.toLowerCase().includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        const matchCat = t.category.toLowerCase().includes(q);
        const matchTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchTags && !matchCat) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory, showOnlyFavorites, selectedTag, favorites]);

  // Category select handler - resets conflicting active tool
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowOnlyFavorites(false);
    setSelectedTag(null);
    if (activeTool && activeTool.category !== categoryId && categoryId !== 'all') {
      setActiveToolId(null);
    }
  };

  // Toggle Favorites handler - resets conflicting active tool
  const handleToggleFavorites = () => {
    const nextState = !showOnlyFavorites;
    setShowOnlyFavorites(nextState);
    if (nextState) {
      setSelectedCategory('all');
      setSelectedTag(null);
      if (activeTool && !favorites.includes(activeTool.id)) {
        setActiveToolId(null);
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#f8f9fa] text-zinc-900'}`}>
      {/* Top Sticky Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
          isDark ? 'bg-[#0a0a0a]/80 border-zinc-800' : 'bg-white/80 border-zinc-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                isDark
                  ? 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 bg-zinc-900/50'
                  : 'border-zinc-300 text-zinc-600 hover:text-black hover:border-zinc-400 bg-zinc-50'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </button>

            <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
              <img
                src="/ReckdLogo.png"
                alt="RECKD"
                className="h-7 w-auto object-contain drop-shadow-[0_2px_8px_rgba(255,107,0,0.3)]"
                referrerPolicy="no-referrer"
              />
              <span className="text-[#ff6b00] text-[10px] font-mono uppercase font-bold tracking-widest hidden sm:inline border-l border-zinc-700/60 pl-2.5">
                Tools Suite
              </span>
            </div>
          </div>

          {/* Search Box in Header */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 100+ utilities..."
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border transition ${
                  isDark
                    ? 'bg-zinc-900/80 border-zinc-800 text-white placeholder-zinc-500 focus:border-[#ff6b00]'
                    : 'bg-zinc-100 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-[#ff6b00]'
                }`}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleFavorites}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                showOnlyFavorites
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                  : isDark
                  ? 'border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900/50'
                  : 'border-zinc-300 text-zinc-600 hover:text-black bg-zinc-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-white' : ''}`} />
              <span className="hidden sm:inline">Favorites</span> ({favorites.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main Directory Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Active Tool Workspace Section (When explicitly opened and matches current filters) */}
        {activeTool && isToolVisible && (
          <section id="active-tool-workspace" className="scroll-mt-24">
            <ToolRunner
              tool={activeTool}
              theme={theme}
              isFavorite={favorites.includes(activeTool.id)}
              onToggleFavorite={toggleFavorite}
              onClose={() => setActiveToolId(null)}
            />
          </section>
        )}

        {/* Directory Controls & Categories Header */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight flex items-center gap-3">
                {showOnlyFavorites
                  ? 'Favorite Utilities'
                  : selectedCategory !== 'all'
                  ? `${toolCategories.find((c) => c.id === selectedCategory)?.emoji || ''} ${toolCategories.find((c) => c.id === selectedCategory)?.name || 'Category Tools'}`
                  : 'Dedicated Tools Directory'}
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/20">
                  {filteredTools.length} {showOnlyFavorites ? 'Saved' : 'Available'}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {showOnlyFavorites
                  ? 'Your saved tools for quick daily access. Click any tool to launch.'
                  : selectedCategory !== 'all'
                  ? `Showing all tools in the ${toolCategories.find((c) => c.id === selectedCategory)?.name || selectedCategory} category.`
                  : 'Browse our complete suite of 100+ high-speed browser utilities with client-side privacy.'}
              </p>
            </div>

            {/* Mobile Search input */}
            <div className="relative md:hidden w-full">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all 100+ utilities..."
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-white'
                    : 'bg-zinc-100 border-zinc-300 text-zinc-900'
                }`}
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
            {/* All Tools Tab */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setShowOnlyFavorites(false);
                setSelectedTag(null);
              }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === 'all' && !showOnlyFavorites
                  ? 'bg-[#ff6b00] text-white shadow-lg shadow-[#ff6b00]/20 font-bold'
                  : isDark
                  ? 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200'
              }`}
            >
              All Categories ({allTools.length})
            </button>

            {/* Favorites Category Tab */}
            <button
              onClick={handleToggleFavorites}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition ${
                showOnlyFavorites
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 font-bold'
                  : isDark
                  ? 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-white text-white' : 'text-rose-500'}`} />
              Favorites ({favorites.length})
            </button>

            {/* Individual Categories */}
            {toolCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id && !showOnlyFavorites;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#ff6b00] text-white shadow-lg shadow-[#ff6b00]/20 font-bold'
                      : isDark
                      ? 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
                      : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200'
                  }`}
                >
                  <span className="text-sm">{cat.emoji}</span>
                  <span>{cat.name}</span>
                  <span className="opacity-70">({cat.tools.length})</span>
                </button>
              );
            })}
          </div>

          {/* Tag filter pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-medium text-zinc-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Quick Tags:
            </span>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30"
              >
                Clear #{selectedTag} ×
              </button>
            )}
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition ${
                  selectedTag === tag
                    ? 'bg-[#ff6b00] text-white'
                    : isDark
                    ? 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    : 'bg-zinc-100 text-zinc-600 hover:text-zinc-800 border border-zinc-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>

        {/* Tools Grid */}
        <section>
          {filteredTools.length === 0 ? (
            <div
              className={`p-16 text-center rounded-3xl border ${
                isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
              }`}
            >
              {showOnlyFavorites ? (
                <>
                  <Heart className="w-10 h-10 text-rose-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold font-display">No favorite utilities saved yet</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                    Click the heart icon on any tool card in any category to save it here for fast instant access.
                  </p>
                  <button
                    onClick={() => {
                      setShowOnlyFavorites(false);
                      setSelectedCategory('all');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#ff6b00] text-white text-xs font-semibold hover:bg-[#e05e00] transition"
                  >
                    Browse All Utilities
                  </button>
                </>
              ) : (
                <>
                  <Sparkles className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold font-display">No matching tools found</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                    Try clearing your search query, filters, or category selection to see more utilities.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedTag(null);
                      setShowOnlyFavorites(false);
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#ff6b00] text-white text-xs font-semibold hover:bg-[#e05e00] transition"
                  >
                    Reset All Filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => {
                const isFav = favorites.includes(tool.id);
                const isActive = activeToolId === tool.id;

                return (
                  <div
                    key={tool.id}
                    className={`p-5 rounded-2xl border transition-all duration-300 group flex flex-col justify-between ${
                      isActive
                        ? 'border-[#ff6b00] shadow-lg shadow-[#ff6b00]/15'
                        : isDark
                        ? 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                        : 'bg-white border-zinc-200/80 hover:border-zinc-300 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/20 flex items-center justify-center text-base select-none shrink-0">
                            {tool.emoji || (tool.category ? CATEGORY_EMOJIS[tool.category] : null) || '⚡'}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/20 font-mono">
                            {tool.category}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                          className={`p-1.5 rounded-lg transition ${
                            isFav ? 'text-rose-500' : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                        </button>
                      </div>

                      <h3 className="font-bold font-display text-base group-hover:text-[#ff6b00] transition">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>

                      {/* Tag list */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {tool.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className={`text-[10px] px-2 py-0.5 rounded-md ${
                              isDark ? 'bg-zinc-800/60 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-5 mt-4 border-t border-zinc-800/40 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-zinc-500">Zero Latency</span>
                      <button
                        onClick={() => {
                          setActiveToolId(tool.id);
                          const el = document.getElementById('active-tool-workspace');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/20'
                            : 'bg-[#ff6b00]/15 text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white'
                        }`}
                      >
                        {isActive ? 'Active Now' : 'Launch Tool'}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
