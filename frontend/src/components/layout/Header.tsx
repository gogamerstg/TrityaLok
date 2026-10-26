import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Building as BuildingIcon,
  Glasses,
  Zap,
  MapPin,
  ChevronDown,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { POI } from '../../types';

export const Header: React.FC = () => {
  const {
    building,
    searchQuery,
    setSearchQuery,
    setSelectedPoi,
    setActiveSection,
    setIsArModalOpen,
    setIsLiveDemoModalOpen,
    activeRoute,
  } = useAppStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPois = searchQuery.trim()
    ? building.pois.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.room_number && p.room_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSelectPoi = (poi: POI) => {
    setSelectedPoi(poi);
    setIsSearchOpen(false);
    setSearchQuery('');
    setActiveSection('twin');
  };

  return (
    <header className="h-16 bg-surface border-b border-surface-border px-4 sm:px-6 flex items-center justify-between gap-4 z-10">
      {/* Search Bar with Auto-Suggestions */}
      <div ref={searchRef} className="relative flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search POI (e.g. Computer Lab 204, Robotics, Washroom, Cafe)..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-card border border-surface-border text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
          />
        </div>

        {/* Dropdown Auto-Suggestions */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-surface-card border border-surface-border rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
            <div className="p-2 border-b border-surface-border text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>{filteredPois.length} MATCHING DESTINATIONS FOUND</span>
              <span className="text-cyan-400">PRESS TO INSPECT & NAVIGATE</span>
            </div>
            {filteredPois.length > 0 ? (
              <div className="divide-y divide-surface-border/50">
                {filteredPois.map((poi) => (
                  <button
                    key={poi.id}
                    onClick={() => handleSelectPoi(poi)}
                    className="w-full text-left p-3 hover:bg-surface-elevated transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                          {poi.name}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-cyan-400">
                            {poi.floor_id === 1 ? 'Ground Floor (L1)' : 'Upper Level (L2)'}
                          </span>
                          <span>•</span>
                          <span>{poi.category}</span>
                          {poi.room_number && (
                            <>
                              <span>•</span>
                              <span>Room {poi.room_number}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-slate-400">
                No matching POI found for <span className="text-cyan-300">"{searchQuery}"</span>. Try searching for "Lab", "Auditorium", or "Elevator".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls & Status Indicator */}
      <div className="flex items-center gap-3">
        {/* Building Selector Chip */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-xs font-mono text-slate-300">
          <BuildingIcon className="w-4 h-4 text-cyan-400" />
          <span>IIT Bombay Complex</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* AR Navigation Button */}
        <button
          onClick={() => setIsArModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all shadow-sm"
          title="Launch AR Navigation Preview"
        >
          <Glasses className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">AR Mode</span>
        </button>

        {/* Quick Demo Button */}
        <button
          onClick={() => setIsLiveDemoModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-400 transition-all"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="hidden sm:inline">Quick Demo</span>
        </button>

        {/* Team & Competition Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-surface-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-cyan-glow">
            NS
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">Team Nexus</div>
            <div className="text-[10px] font-mono text-cyan-400 leading-tight">Namma Space 2026</div>
          </div>
        </div>
      </div>
    </header>
  );
};
