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
  Sliders
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
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-background">
      {/* 3D Viewport container fills entire area */}
      <div className="flex-1 w-full h-full relative">
        <SpaceViewer height="100%" />

        {/* FLOATING TOP-LEFT TITLE & MODE PILLS */}
        <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-none">
          <div className="bg-surface-card/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-surface-border pointer-events-auto shadow-xl inline-block">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-100">
                {building.name}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              Level: {selectedFloorId === 'all' ? 'All Floors (Composite)' : currentFloorData.name}
            </div>
          </div>

          {/* View Modes Selector */}
          <div className="flex items-center gap-1.5 bg-surface-card/90 backdrop-blur-md p-1 rounded-xl border border-surface-border pointer-events-auto shadow-xl w-fit">
            <button
              onClick={() => setViewMode('explore')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'explore'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Roam
            </button>
            <button
              onClick={() => setViewMode('floorplan')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'floorplan'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2D Floor Plan
            </button>
            <button
              onClick={() => {
                if (selectedPoi) setViewMode('inspection');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'inspection'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              POI Focus
            </button>
          </div>
        </div>

        {/* FLOATING INSPECTION PANEL (If POI selected) */}
        {selectedPoi && (
          <div className="absolute top-4 right-4 z-10 w-80 max-w-[calc(100vw-2rem)] bg-surface-card/95 backdrop-blur-xl p-4 rounded-2xl border border-cyan-500/30 shadow-2xl pointer-events-auto space-y-3 animate-in fade-in slide-in-from-right duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                  {selectedPoi.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedPoi.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPoi(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-surface-elevated text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedPoi.description}
            </p>

            <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-surface-border">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">FLOOR LEVEL</span>
                <span className="text-cyan-400 font-bold">
                  {selectedPoi.floor_id === 1 ? 'Level 1 (Ground)' : 'Level 2 (Upper)'}
                </span>
              </div>
              {selectedPoi.room_number && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">ROOM NUMBER</span>
                  <span className="text-slate-200 font-bold">{selectedPoi.room_number}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">ACCESSIBILITY</span>
                <span className="text-emerald-400 font-bold">
                  {selectedPoi.accessibility ? 'Wheelchair Step-Free' : 'Staircase Only'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">STATUS</span>
                <span className="text-slate-200 font-bold">{selectedPoi.current_status}</span>
              </div>
            </div>

            {selectedPoi.related_facilities.length > 0 && (
              <div className="pt-2 border-t border-surface-border">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  AMENITIES & RIGS
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedPoi.related_facilities.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-elevated text-slate-300 border border-surface-border"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleRouteToPoi}
              className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-cyan-glow"
            >
              <Route className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Calculate A* Route Here</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
