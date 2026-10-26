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
  Sparkles,
  Accessibility
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
    if (selectedCat !== 'All' && poi.category !== selectedCat) return false;
    if (selectedFloorFilter !== 'All' && poi.floor_id !== selectedFloorFilter) return false;
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              CAMPUS SPATIAL DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
            Explore Points of Interest • <span className="text-gradient-cyan">Campus Facilities</span>
          </h1>
        </div>

        <div className="text-xs font-mono text-slate-400">
          INDEXED: <span className="text-cyan-400 font-extrabold">{filteredPois.length}</span> of {building.pois.length} POIs
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, room number, or tag (e.g. Lab 204, Robotics, Restrooms, Cafe)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111827] border border-[#1F293D] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Floor Filter Buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setSelectedFloorFilter('All')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedFloorFilter === 'All'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
                  : 'bg-[#111827] text-slate-400 hover:text-white border border-[#1F293D]'
              }`}
            >
              All Floors
            </button>
            <button
              onClick={() => setSelectedFloorFilter(1)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedFloorFilter === 1
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
                  : 'bg-[#111827] text-slate-400 hover:text-white border border-[#1F293D]'
              }`}
            >
              Floor 1
            </button>
            <button
              onClick={() => setSelectedFloorFilter(2)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedFloorFilter === 2
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50 shadow-violet-glow'
                  : 'bg-[#111827] text-slate-400 hover:text-white border border-[#1F293D]'
              }`}
            >
              Floor 2
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-cyan-glow'
                  : 'bg-[#111827] text-slate-400 hover:text-slate-200 border border-[#1F293D]'
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
            className="p-5 rounded-3xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 group shadow-xl"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold uppercase border border-cyan-500/40">
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

            <div className="space-y-3 pt-3 border-t border-[#1F293D]">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>STATUS: <span className="text-emerald-400 font-semibold">{poi.current_status}</span></span>
                <span className={poi.accessibility ? 'text-emerald-400' : 'text-slate-400'}>
                  {poi.accessibility ? '♿ Step-Free' : 'Stairs Only'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleInspectPoi(poi)}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#111827] hover:bg-[#172033] text-slate-200 transition-colors flex items-center justify-center gap-1.5 border border-[#1F293D]"
                >
                  <span>3D View</span>
                </button>
                <button
                  onClick={() => handleRouteToPoi(poi)}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center justify-center gap-1.5 shadow-cyan-glow"
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
