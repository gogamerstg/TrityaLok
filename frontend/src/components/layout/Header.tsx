import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Building as BuildingIcon,
  Glasses,
  Zap,
  MapPin,
  ArrowRight,
  Sparkles,
  Command,
  X
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
  } = useAppStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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
    <header className="h-18 bg-[#070A0F]/90 backdrop-blur-2xl border-b border-[#1F293D] px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
      {/* Search Bar with Auto-Suggestions */}
      <div ref={searchRef} className="relative flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search POI (e.g. Computer Lab 204, Robotics Lab, Washroom, Cafe)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#111827]/90 border border-[#1F293D] text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 shadow-inner transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Auto-Suggestions */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-[#0B0F19]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-84 overflow-y-auto">
            <div className="p-3 border-b border-[#1F293D] text-[10px] font-mono text-slate-400 flex items-center justify-between bg-[#111827]/60">
              <span className="font-semibold">{filteredPois.length} DESTINATIONS IDENTIFIED</span>
              <span className="text-cyan-400 font-bold">CLICK TO INSPECT & FLY CAMERA</span>
            </div>
            {filteredPois.length > 0 ? (
              <div className="divide-y divide-[#1F293D]/50">
                {filteredPois.map((poi) => (
                  <button
                    key={poi.id}
                    onClick={() => handleSelectPoi(poi)}
                    className="w-full text-left p-3.5 hover:bg-[#172033] transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:bg-cyan-500/20 transition-all shadow-sm">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                          {poi.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                          <span className="text-cyan-400 font-semibold">
                            {poi.floor_id === 1 ? 'Floor 1 (Ground)' : 'Floor 2 (Upper)'}
                          </span>
                          <span>•</span>
                          <span>{poi.category}</span>
                          {poi.room_number && (
                            <>
                              <span>•</span>
                              <span className="text-slate-300">Room {poi.room_number}</span>
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
              <div className="p-6 text-center text-xs text-slate-400">
                No matching location for <span className="text-cyan-300 font-bold">"{searchQuery}"</span>. Try searching for "Computer", "Robotics", "Auditorium", or "Elevator".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Building Selector Chip */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#111827]/80 border border-[#1F293D] text-xs font-mono text-slate-300 shadow-sm">
          <BuildingIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>IIT Bombay Complex</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* AR Mode Shortcut */}
        <button
          onClick={() => setIsArModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-sm"
          title="Launch Simulated AR Navigation HUD"
        >
          <Glasses className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">AR Mode</span>
        </button>

        {/* Live Demo Quick Action */}
        <button
          onClick={() => setIsLiveDemoModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/40 hover:border-amber-300 transition-all shadow-amber-glow"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="hidden sm:inline">Live Demo</span>
        </button>

        {/* Team Nexus Emblem */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#1F293D]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-xs font-extrabold text-white shadow-cyan-glow">
            NS
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-200 leading-tight">Team Nexus</div>
            <div className="text-[10px] font-mono text-cyan-400 leading-tight">Techfest 2026</div>
          </div>
        </div>
      </div>
    </header>
  );
};
