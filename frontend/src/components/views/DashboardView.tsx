import React from 'react';
import {
  Building2,
  Box,
  MapPin,
  Route,
  Plus,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  Zap,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SpaceViewer } from '../3d/SpaceViewer';

export const DashboardView: React.FC = () => {
  const {
    building,
    setActiveSection,
    setSelectedPoi,
    setIsLiveDemoModalOpen,
    setSelectedFloorId,
    startReconstructionJob,
    calculateCurrentRoute,
    setStartNodeId,
    setDestinationPoiId,
  } = useAppStore();

  const handleQuickLabRoute = () => {
    setStartNodeId('n_f1_entrance');
    setDestinationPoiId('poi_computer_lab');
    calculateCurrentRoute();
    setActiveSection('navigation');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/40 via-surface-card to-violet-950/30 border border-surface-border p-6 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Techfest IIT Bombay • Namma Space 2026
              </span>
              <span className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Engine Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Spatial Command Center • <span className="text-gradient-cyan">NEXUS SPACE</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Transform smartphone indoor video into photorealistic, interactive 3D digital twins.
              Search waypoints, calculate obstacle-aware routes, and inspect environments in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveSection('scan')}
              className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:brightness-110 shadow-cyan-glow transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Create New Digital Twin
            </button>
            <button
              onClick={() => setIsLiveDemoModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-surface-elevated text-amber-300 border border-amber-500/40 hover:bg-amber-500/10 transition-all flex items-center gap-2 shadow-sm"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              Live Demo Mode
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Buildings Scanned */}
        <div className="p-4 rounded-xl bg-surface-card border border-surface-border relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Buildings Scanned
            </span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono">
            01 <span className="text-xs font-sans text-slate-500 font-normal">/ 03 Ready</span>
          </div>
          <div className="mt-1 text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
            <span>IITB Techfest Venue</span>
          </div>
        </div>

        {/* Rooms Mapped */}
        <div className="p-4 rounded-xl bg-surface-card border border-surface-border relative overflow-hidden group hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Rooms Mapped
            </span>
            <Box className="w-4 h-4 text-violet-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono">
            09 <span className="text-xs font-sans text-slate-500 font-normal">Enclosures</span>
          </div>
          <div className="mt-1 text-[11px] text-violet-400 flex items-center gap-1 font-mono">
            <span>2 Levels (Ground + L2)</span>
          </div>
        </div>

        {/* POIs Indexed */}
        <div className="p-4 rounded-xl bg-surface-card border border-surface-border relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Indexed POIs
            </span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {building.pois.length} <span className="text-xs font-sans text-slate-500 font-normal">Markers</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <span>100% Searchable</span>
          </div>
        </div>

        {/* Routes Calculated */}
        <div className="p-4 rounded-xl bg-surface-card border border-surface-border relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              A* Route Calculations
            </span>
            <Route className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono">
            100% <span className="text-xs font-sans text-slate-500 font-normal">Obstacle-Free</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-400 flex items-center gap-1 font-mono">
            <span>Dynamic Rerouting Enabled</span>
          </div>
        </div>
      </div>

      {/* FEATURED 3D DIGITAL TWIN PREVIEW SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 3D Interactive Viewport Card */}
        <div className="lg:col-span-2 rounded-2xl bg-surface-card border border-surface-border overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-elevated/50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Active Digital Twin: {building.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Coordinates: 19.1334° N, 72.9133° E • Multi-Floor Architectural Model
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveSection('twin')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 transition-colors"
            >
              <span>Full Viewport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive 3D Canvas Preview */}
          <div className="h-96 w-full relative">
            <SpaceViewer height="100%" />
          </div>
        </div>

        {/* Right: Quick Launch & Venue Highlights */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Active Model Status Card */}
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                Venue Blueprint
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-semibold">
                RECONSTRUCTED
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-bold text-slate-100">
                Techfest Innovation Complex
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contains Computer Lab 204, Robotics Systems Lab, Aryabhata Auditorium,
                Accessible Elevator, Restrooms, and Student Breakout Cafe.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-surface-border">
              <div className="p-2 rounded-lg bg-surface-elevated">
                <div className="text-slate-500">VERTICES</div>
                <div className="text-slate-200 font-bold">384,000</div>
              </div>
              <div className="p-2 rounded-lg bg-surface-elevated">
                <div className="text-slate-500">3D GAUSSIANS</div>
                <div className="text-slate-200 font-bold">850,000</div>
              </div>
              <div className="p-2 rounded-lg bg-surface-elevated">
                <div className="text-slate-500">ACCESSIBILITY</div>
                <div className="text-emerald-400 font-bold">Step-Free Elevator</div>
              </div>
              <div className="p-2 rounded-lg bg-surface-elevated">
                <div className="text-slate-500">NAVIGATION NODES</div>
                <div className="text-cyan-400 font-bold">{building.nodes.length} Waypoints</div>
              </div>
            </div>

            {/* Quick 1-Click Action */}
            <button
              onClick={handleQuickLabRoute}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 border border-cyan-500/40 hover:border-cyan-300 flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>1-Click Route to Computer Lab 204</span>
            </button>
          </div>

          {/* Key POI Quick Access List */}
          <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>FREQUENT DESTINATIONS</span>
              <button
                onClick={() => setActiveSection('explore')}
                className="text-cyan-400 hover:underline"
              >
                View all ({building.pois.length})
              </button>
            </div>

            <div className="space-y-1.5">
              {building.pois.slice(1, 5).map((poi) => (
                <button
                  key={poi.id}
                  onClick={() => {
                    setSelectedPoi(poi);
                    setActiveSection('twin');
                  }}
                  className="w-full p-2 rounded-lg hover:bg-surface-elevated transition-colors flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {poi.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {poi.floor_id === 1 ? 'Floor 1' : 'Floor 2'} • {poi.category}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT SCANS & ACTIVITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scans Pipeline Telemetry */}
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>3D Reconstruction Activity</span>
            </h3>
            <button
              onClick={() => setActiveSection('scan')}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              Scan New Space →
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-elevated border border-surface-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                IIT Bombay Academic Complex (4K 60fps Scan)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                COMPLETED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              1,420 keyframes processed with COLMAP SfM, Open3D point clouds, and 3D Gaussian Splatting.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
              <span>Elapsed: 8m 00s</span>
              <span>Quality Score: 98.4%</span>
            </div>
          </div>
        </div>

        {/* Live Navigation Activity */}
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Route className="w-4 h-4 text-violet-400" />
              <span>Autonomous Route Planning Engine</span>
            </h3>
            <button
              onClick={() => setActiveSection('navigation')}
              className="text-xs font-mono text-violet-400 hover:underline"
            >
              Route Planner →
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-elevated border border-surface-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                Main Entrance → Computer Lab 204
              </span>
              <span className="text-[10px] font-mono text-cyan-400">A* Optimal</span>
            </div>
            <p className="text-xs text-slate-400">
              Multi-floor transition via Central Elevator (step-free wheelchair accessible), avoiding corridor maintenance hazards.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
              <span>Distance: 53.0 meters</span>
              <span>Est. Walking Time: 44 sec</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
