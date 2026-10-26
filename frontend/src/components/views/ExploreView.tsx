import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Route,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { POI, POICategory } from '../../types';

const CATEGORIES: Array<POICategory | 'All'> = [
  'All',
  'Laboratory',
  'Classroom',
  'Reception',
  'Faculty Room',
  'Washroom',
  'Elevator',
  'Staircase',
  'Entrance',
  'Emergency Exit',
  'Cafeteria',
];

export const ExploreView: React.FC = () => {
  const {
    building,
    selectedPoi,
    setSelectedPoi,
    setActiveSection,
    setStartNodeId,
    setDestinationPoiId,
    calculateCurrentRoute,
  } = useAppStore();

  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<POICategory | 'All'>('All');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<'All' | 1 | 2>('All');

  const filteredPois = building.pois.filter((poi) => {
    // Category match
    if (selectedCat !== 'All' && poi.category !== selectedCat) return false;
    // Floor match
    if (selectedFloorFilter !== 'All' && poi.floor_id !== selectedFloorFilter) return false;
    // Search query match
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchesName = poi.name.toLowerCase().includes(q);
      const matchesDesc = poi.description.toLowerCase().includes(q);
      const matchesRoom = poi.room_number ? poi.room_number.toLowerCase().includes(q) : false;
      const matchesTag = poi.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesName && !matchesDesc && !matchesRoom && !matchesTag) return false;
    }
    return true;
  });

  const handleInspectPoi = (poi: POI) => {
    setSelectedPoi(poi);
    setActiveSection('twin');
  };

  const handleRouteToPoi = (poi: POI) => {
    setStartNodeId('n_f1_entrance');
    setDestinationPoiId(poi.id);
    calculateCurrentRoute();
    setActiveSection('navigation');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              POI Spatial Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Explore Points of Interest • <span className="text-gradient-cyan">Campus Directory</span>
          </h1>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing <span className="text-cyan-400 font-bold">{filteredPois.length}</span> of {building.pois.length} POIs
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, room number, or keyword (e.g. GPU, Seminar, Restroom)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Floor Filter Buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setSelectedFloorFilter('All')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedFloorFilter === 'All'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-surface-elevated text-slate-400 hover:text-white'
              }`}
            >
              All Floors
            </button>
            <button
              onClick={() => setSelectedFloorFilter(1)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedFloorFilter === 1
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-surface-elevated text-slate-400 hover:text-white'
              }`}
            >
              Floor 1
            </button>
            <button
              onClick={() => setSelectedFloorFilter(2)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedFloorFilter === 2
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                  : 'bg-surface-elevated text-slate-400 hover:text-white'
              }`}
            >
              Floor 2
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-cyan-glow'
                  : 'bg-surface-elevated text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* POI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPois.map((poi) => (
          <div
            key={poi.id}
            className="p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                  {poi.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Level {poi.floor_id} {poi.room_number ? `• Rm ${poi.room_number}` : ''}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {poi.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {poi.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-surface-border">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>STATUS: <span className="text-emerald-400 font-semibold">{poi.current_status}</span></span>
                <span>{poi.accessibility ? '♿ Accessible' : 'Stairs Only'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleInspectPoi(poi)}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-surface-elevated hover:bg-slate-800 text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>3D Twin View</span>
                </button>
                <button
                  onClick={() => handleRouteToPoi(poi)}
                  className="py-2 px-3 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center justify-center gap-1.5 shadow-cyan-glow"
                  title="Calculate Route"
                >
                  <Route className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Navigate</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
