import React from 'react';
import {
  Compass,
  Layers,
  MapPin,
  Route,
  Info,
  Maximize2,
  ChevronRight,
  ShieldCheck,
  Eye,
  Sliders,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SpaceViewer } from '../3d/SpaceViewer';

export const DigitalTwinView: React.FC = () => {
  const {
    building,
    selectedFloorId,
    setSelectedFloorId,
    viewMode,
    setViewMode,
    selectedPoi,
    setSelectedPoi,
    hoveredPoi,
    activeRoute,
    setActiveSection,
    setStartNodeId,
    setDestinationPoiId,
    calculateCurrentRoute,
    showPoiLabels,
    setShowPoiLabels,
    showObstacles,
    setShowObstacles,
    showWalkableMesh,
    setShowWalkableMesh,
  } = useAppStore();

  const handleRouteToPoi = () => {
    if (!selectedPoi) return;
    setStartNodeId('n_f1_entrance');
    setDestinationPoiId(selectedPoi.id);
    calculateCurrentRoute();
    setActiveSection('navigation');
  };

  const currentFloorData = building.floors.find((f) => f.id === selectedFloorId) || building.floors[0];

  return (
    <div className="relative w-full h-[calc(100vh-4.5rem)] flex flex-col overflow-hidden bg-[#070A0F]">
      {/* 3D Viewport container fills entire area */}
      <div className="flex-1 w-full h-full relative">
        <SpaceViewer height="100%" />

        {/* FLOATING TOP-LEFT TITLE & MODE PILLS */}
        <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-none">
          <div className="bg-[#0B0F19]/90 backdrop-blur-2xl px-4 py-2.5 rounded-2xl border border-[#1F293D] pointer-events-auto shadow-2xl inline-block">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-cyan-glow" />
              <span className="text-xs font-mono font-bold text-slate-100">
                {building.name}
              </span>
            </div>
            <div className="text-[11px] font-mono text-cyan-400 mt-0.5 font-semibold">
              Level: {selectedFloorId === 'all' ? 'All Floors (Composite)' : currentFloorData.name}
            </div>
          </div>

          {/* View Modes Selector */}
          <div className="flex items-center gap-1.5 bg-[#0B0F19]/90 backdrop-blur-2xl p-1.5 rounded-2xl border border-[#1F293D] pointer-events-auto shadow-2xl w-fit">
            <button
              onClick={() => setViewMode('explore')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'explore'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Roam
            </button>
            <button
              onClick={() => setViewMode('floorplan')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'floorplan'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2D Plan
            </button>
            <button
              onClick={() => {
                if (selectedPoi) setViewMode('inspection');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'inspection'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50 shadow-violet-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              POI Focus
            </button>
          </div>
        </div>

        {/* FLOATING INSPECTION PANEL (If POI selected) */}
        {selectedPoi && (
          <div className="absolute top-4 right-4 z-10 w-84 max-w-[calc(100vw-2rem)] bg-[#0B0F19]/95 backdrop-blur-2xl p-5 rounded-3xl border border-cyan-500/40 shadow-2xl pointer-events-auto space-y-3.5 animate-in fade-in slide-in-from-right duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold uppercase border border-cyan-500/40">
                  {selectedPoi.category}
                </span>
                <h3 className="text-base font-extrabold text-white mt-1.5">
                  {selectedPoi.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPoi(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#172033] text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {selectedPoi.description}
            </p>

            <div className="space-y-2 text-xs font-mono pt-2 border-t border-[#1F293D]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">FLOOR LEVEL</span>
                <span className="text-cyan-400 font-extrabold">
                  {selectedPoi.floor_id === 1 ? 'Floor 1 (Ground)' : 'Floor 2 (Upper)'}
                </span>
              </div>
              {selectedPoi.room_number && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">ROOM NUMBER</span>
                  <span className="text-slate-200 font-bold">{selectedPoi.room_number}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">ACCESSIBILITY</span>
                <span className="text-emerald-400 font-bold">
                  {selectedPoi.accessibility ? 'Step-Free Wheelchair' : 'Staircase Only'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">STATUS</span>
                <span className="text-emerald-400 font-bold">{selectedPoi.current_status}</span>
              </div>
            </div>

            {selectedPoi.related_facilities.length > 0 && (
              <div className="pt-2 border-t border-[#1F293D]">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1.5">
                  FACILITIES & HARDWARE
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPoi.related_facilities.map((f, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#111827] text-slate-300 border border-[#1F293D]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleRouteToPoi}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:brightness-110 shadow-cyan-glow transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Route className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Calculate A* Route to POI</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
