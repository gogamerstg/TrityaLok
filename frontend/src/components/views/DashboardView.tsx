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
  ChevronRight,
  Compass,
  Cpu,
  Radio,
  Eye,
  Sliders
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Hero Spatial Telemetry Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/50 via-[#0B0F19] to-violet-950/40 border border-cyan-500/30 p-7 shadow-2xl">
        {/* Glow Orb in Corner */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                TECHFEST IIT BOMBAY • NAMMA SPACE 2026
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE • 60 FPS
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Spatial Digital Twin & <span className="text-gradient-cyan">Navigation Command</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Convert raw smartphone video into interactive 3D digital twins.
              Search rooms and laboratories, plan obstacle-free $A^*$ routes, and roam seamlessly in first-person WebGL.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveSection('scan')}
              className="px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:brightness-110 shadow-cyan-glow transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create New Twin (Scan)</span>
            </button>
            <button
              onClick={() => setIsLiveDemoModalOpen(true)}
              className="px-5 py-3 rounded-2xl font-bold text-xs bg-[#111827] text-amber-300 border border-amber-500/50 hover:bg-amber-500/10 shadow-amber-glow transition-all flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Live Demo Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Buildings Scanned */}
        <div className="p-5 rounded-2xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] hover:border-cyan-500/50 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Buildings Scanned</span>
            <Building2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono">
            01 <span className="text-xs font-sans text-slate-500 font-normal">/ 03 Ready</span>
          </div>
          <div className="mt-1 text-[11px] text-cyan-400 font-mono flex items-center gap-1 font-semibold">
            <span>IITB Innovation Hub</span>
          </div>
        </div>

        {/* Rooms Mapped */}
        <div className="p-5 rounded-2xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] hover:border-violet-500/50 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Rooms Mapped</span>
            <Box className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono">
            09 <span className="text-xs font-sans text-slate-500 font-normal">Enclosures</span>
          </div>
          <div className="mt-1 text-[11px] text-violet-400 font-mono flex items-center gap-1 font-semibold">
            <span>Multi-Floor (L1 + L2)</span>
          </div>
        </div>

        {/* POIs Indexed */}
        <div className="p-5 rounded-2xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] hover:border-emerald-500/50 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Indexed POIs</span>
            <MapPin className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono">
            {building.pois.length} <span className="text-xs font-sans text-slate-500 font-normal">Waypoints</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono flex items-center gap-1 font-semibold">
            <span>100% Searchable</span>
          </div>
        </div>

        {/* Pathfinding Efficiency */}
        <div className="p-5 rounded-2xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] hover:border-amber-500/50 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">A* Path Accuracy</span>
            <Route className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono">
            100% <span className="text-xs font-sans text-slate-500 font-normal">Obstacle-Free</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-400 font-mono flex items-center gap-1 font-semibold">
            <span>Dynamic Rerouting Active</span>
          </div>
        </div>
      </div>

      {/* FEATURED 3D DIGITAL TWIN PREVIEW SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3D Interactive Viewport Card */}
        <div className="lg:col-span-8 rounded-3xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-[#1F293D] flex items-center justify-between bg-[#111827]/70">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Interactive 3D Viewport: {building.name}</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Multi-Floor Digital Twin • Orbit / Pan / FPS Roam
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveSection('twin')}
              className="text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-sm"
            >
              <span>Full Viewport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive 3D Canvas */}
          <div className="h-[420px] w-full relative">
            <SpaceViewer height="100%" />
          </div>
        </div>

        {/* Right: Quick Launch & Venue Highlights */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Blueprint Card */}
          <div className="p-5 rounded-3xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-extrabold">
                VENUE SPECIFICATIONS
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40">
                RECONSTRUCTED
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-100">
                Techfest Innovation Complex
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                2 Floors with central glass elevator, computer vision labs, auditoriums, and step-free navigation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#1F293D]">
              <div className="p-2.5 rounded-xl bg-[#111827]">
                <div className="text-slate-500 text-[10px]">3D VERTICES</div>
                <div className="text-slate-200 font-bold">384,000</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#111827]">
                <div className="text-slate-500 text-[10px]">GAUSSIAN SPLATS</div>
                <div className="text-slate-200 font-bold">850,000</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#111827]">
                <div className="text-slate-500 text-[10px]">WHEELCHAIR ACCESS</div>
                <div className="text-emerald-400 font-bold">Glass Elevator</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#111827]">
                <div className="text-slate-500 text-[10px]">WAYPOINTS</div>
                <div className="text-cyan-400 font-bold">{building.nodes.length} Nodes</div>
              </div>
            </div>

            <button
              onClick={handleQuickLabRoute}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:brightness-110 shadow-cyan-glow transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-slate-950 fill-current" />
              <span>1-Click Route to Computer Lab 204</span>
            </button>
          </div>

          {/* Key POI Quick Access List */}
          <div className="p-5 rounded-3xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="font-bold">FREQUENT DESTINATIONS</span>
              <button
                onClick={() => setActiveSection('explore')}
                className="text-cyan-400 hover:underline"
              >
                All ({building.pois.length}) →
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
                  className="w-full p-2.5 rounded-xl hover:bg-[#172033] transition-colors flex items-center justify-between text-left group border border-transparent hover:border-[#1F293D]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-cyan-glow" />
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
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
    </div>
  );
};
