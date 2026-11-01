import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Building as BuildingIcon,
  Box,
  ArrowRight,
  X,
  Menu
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { TrityaLokLogo } from '../common/TrityaLokLogo';
import { AVAILABLE_BUILDINGS } from '../../data/sampleBuildingData';

export const Header: React.FC = () => {
  const {
    building,
    setBuilding,
    searchQuery,
    setSearchQuery,
    setActiveSection,
    setIsMobileDrawerOpen,
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

  // Filter rooms and spaces in building for Round 1 free-roaming
  const filteredRooms = searchQuery.trim()
    ? building.floors.flatMap((f) =>
        f.rooms.filter(
          (r) =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];

  const handleSelectRoom = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setActiveSection('twin');
  };

  return (
    <header className="h-16 sm:h-18 bg-[#070A0F]/90 backdrop-blur-2xl border-b border-[#1F293D] px-3 sm:px-6 flex items-center justify-between gap-2.5 sm:gap-4 z-20">
      {/* Mobile Menu Button & Compact Logo (< md screens) */}
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="p-2 rounded-xl bg-[#111827] border border-[#1F293D] text-slate-300 hover:text-white"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 text-cyan-400" />
        </button>
        <TrityaLokLogo size={32} showText={false} />
      </div>

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
            placeholder="Search reconstructed rooms (e.g. Living Room, Workstation, Balcony)..."
            className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 rounded-xl bg-[#111827]/90 border border-[#1F293D] text-[11px] sm:text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 shadow-inner transition-all"
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
              <span className="font-semibold">{filteredRooms.length} ROOMS LOCATED</span>
              <span className="text-cyan-400 font-bold">CLICK TO EXPLORE IN 3D</span>
            </div>
            {filteredRooms.length > 0 ? (
              <div className="divide-y divide-[#1F293D]/50">
                {filteredRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={handleSelectRoom}
                    className="w-full text-left p-3.5 hover:bg-[#172033] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:bg-cyan-500/20 transition-all shadow-sm">
                        <Box className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                          {room.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                          <span className="text-cyan-400 font-semibold">{room.category}</span>
                          {room.area_sqm > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-slate-300">{room.area_sqm} sq.m</span>
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
                No matching room found for <span className="text-cyan-300 font-bold">"{searchQuery}"</span>. Try searching for "Living Room", "Bed Room", "Kitchen", or "Workstation".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Building Selector Dropdown (Resident Home Space vs IITB Complex) */}
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#111827]/90 border border-cyan-500/30 text-[11px] sm:text-xs font-mono text-slate-200 shadow-sm max-w-[140px] sm:max-w-[220px] md:max-w-none">
          <BuildingIcon className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <select
            value={building.id}
            onChange={(e) => {
              const selected = AVAILABLE_BUILDINGS.find((b) => b.id === e.target.value);
              if (selected) setBuilding(selected);
            }}
            aria-label="Select Active Building Environment"
            className="bg-transparent text-[11px] sm:text-xs font-semibold text-cyan-300 focus:outline-none cursor-pointer border-none truncate"
          >
            {AVAILABLE_BUILDINGS.map((b) => (
              <option key={b.id} value={b.id} className="bg-[#0B0F19] text-slate-200 font-sans">
                {b.name}
              </option>
            ))}
          </select>
          <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" title="Digital Twin Active" />
        </div>

        {/* Team Marg Darshak Emblem */}
        <div className="hidden sm:flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#1F293D]">
          <TrityaLokLogo size={32} showText={false} />
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-200 leading-tight">Marg Darshak</div>
            <div className="text-[10px] font-mono text-cyan-400 leading-tight">Techfest IIT Bombay</div>
          </div>
        </div>
      </div>
    </header>
  );
};
