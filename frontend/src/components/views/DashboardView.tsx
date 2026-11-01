import React from 'react';
import {
  Building2,
  Box,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Radio,
  Eye,
  Code2,
  Smartphone
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SpaceViewer } from '../3d/SpaceViewer';
import { TrityaLokLogo } from '../common/TrityaLokLogo';

export const DashboardView: React.FC = () => {
  const {
    building,
    setActiveSection,
  } = useAppStore();

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Hero Spatial Telemetry Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/50 via-[#0B0F19] to-violet-950/40 border border-cyan-500/30 p-6 sm:p-7 shadow-2xl">
        {/* Glow Orbs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                TRITYALOK • 3D SPATIAL DIGITAL TWIN
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE • 60 FPS WEBGL
              </span>
            </div>

            <div className="flex items-center gap-4">
              <TrityaLokLogo size={56} showText={false} />
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  TRITYALOK
                </h1>
                <div className="text-sm font-bold text-gradient-cyan">
                  3D Reconstruction & Free-Roaming Digital Twin Engine
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              TrityaLok converts smartphone captures into interactive, photorealistic 3D digital twins.
              Engineered with a 9-stage Structure-from-Motion (SfM) pipeline, sub-centimeter laser metric accuracy,
              and low-latency first-person WebGL free-roaming across indoor spaces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveSection('scan')}
              className="px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:brightness-110 shadow-cyan-glow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Launch 3D Scan Pipeline</span>
            </button>
            <button
              onClick={() => setActiveSection('twin')}
              className="px-5 py-3 rounded-2xl font-bold text-xs bg-[#111827] text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/10 shadow-cyan-glow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Box className="w-4 h-4 text-cyan-400" />
              <span>Explore 3D Walkthrough</span>
            </button>
          </div>
        </div>
      </div>

      {/* CORE METRIC KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Model Accuracy */}
        <div className="p-5 rounded-2xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] hover:border-cyan-500/50 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Mesh Accuracy</span>
            <Box className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono">
            0.62 <span className="text-xs font-sans text-slate-500 font-normal">cm MAE</span>
          </div>
          <div className="mt-1 text-[11px] text-cyan-400 font-mono flex items-center gap-1 font-semibold">
            <span>Laser Rangefinder Calibrated</span>
          </div>
        </div>

        {/* SOP Overlap Density */}
        <div className="p-5 rounded-2xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] hover:border-violet-500/50 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Keyframe Overlap</span>
            <Layers className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono">
            78.4% <span className="text-xs font-sans text-slate-500 font-normal">Coverage</span>
          </div>
          <div className="mt-1 text-[11px] text-violet-400 font-mono flex items-center gap-1 font-semibold">
            <span>Serpentine Trajectory Track</span>
          </div>
        </div>

        {/* Web Viewer Performance */}
        <div className="p-5 rounded-2xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] hover:border-emerald-500/50 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Web Roaming FPS</span>
            <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono">
            60 <span className="text-xs font-sans text-slate-500 font-normal">FPS Solid</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono flex items-center gap-1 font-semibold">
            <span>Draco Geometric Compression</span>
          </div>
        </div>

        {/* Rooms Mapped */}
        <div className="p-5 rounded-2xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] hover:border-amber-500/50 transition-all shadow-lg group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Rooms Mapped</span>
            <Building2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono">
            06 <span className="text-xs font-sans text-slate-500 font-normal">Enclosures</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-400 font-mono flex items-center gap-1 font-semibold">
            <span>Living, Bed, Kitchen, Balcony</span>
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
                  <span>Interactive 3D Walkthrough: {building.name}</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Multi-Room Digital Twin • Orbit / Pan / FPS Roam (WASD + Touch D-Pad)
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveSection('twin')}
              className="text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-sm cursor-pointer"
            >
              <span>Full Viewport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive 3D Canvas */}
          <div className="h-[300px] sm:h-[420px] w-full relative">
            <SpaceViewer height="100%" />
          </div>
        </div>

        {/* Right: Venue Specifications & Interactive Spatial Explorer */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Blueprint Card */}
          <div className="p-5 rounded-3xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-extrabold">
                VENUE SPECIFICATIONS
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40">
                CALIBRATED
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-100">
                {building.name}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Monocular smartphone video reconstructed with high-density polygonal mesh, PBR textures, and free-roaming collision boundaries.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#1F293D]">
              <div className="p-2.5 rounded-xl bg-[#111827]">
                <div className="text-slate-500 text-[10px]">3D VERTICES</div>
                <div className="text-slate-200 font-bold">148,500</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#111827]">
                <div className="text-slate-500 text-[10px]">FRAME RATE</div>
                <div className="text-slate-200 font-bold">60 FPS</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#111827]">
                <div className="text-slate-500 text-[10px]">FRAME OVERLAP</div>
                <div className="text-emerald-400 font-bold">78.4%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#111827]">
                <div className="text-slate-500 text-[10px]">LASER ACCURACY</div>
                <div className="text-cyan-400 font-bold">0.62 cm MAE</div>
              </div>
            </div>

            <button
              onClick={() => setActiveSection('twin')}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:brightness-110 shadow-cyan-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Box className="w-4 h-4 text-slate-950 fill-current" />
              <span>Launch 3D Free-Roaming Walkthrough</span>
            </button>
          </div>

          {/* Quick Rooms Tour Card */}
          <div className="p-5 rounded-3xl bg-[#0B0F19]/90 backdrop-blur-xl border border-cyan-500/30 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-cyan-400">EXPLORE ROOMS IN 3D</span>
              <span className="text-[10px] text-slate-400">DIRECT ACCESS</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveSection('twin')}
                className="w-full p-2.5 rounded-xl bg-[#111827] hover:bg-[#172033] border border-[#1F293D] hover:border-cyan-500/50 transition-colors flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                      Living Room & Foyer
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Floor 1 • 24.5 sq.m • Smart TV & Lounge
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
              </button>

              <button
                onClick={() => setActiveSection('twin')}
                className="w-full p-2.5 rounded-xl bg-[#111827] hover:bg-[#172033] border border-[#1F293D] hover:border-violet-500/50 transition-colors flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-violet-300">
                      Bedroom & Balcony Terrace
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Floor 1 • 18.2 sq.m • Garden View
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400" />
              </button>

              <button
                onClick={() => setActiveSection('scan')}
                className="w-full p-2.5 rounded-xl bg-[#111827] hover:bg-[#172033] border border-[#1F293D] hover:border-cyan-500/50 transition-colors flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                      Scan Space (9-Stage SfM)
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Smartphone Video to 3D Mesh
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FEATURE HIGHLIGHTS ROW */}
      <div className="pt-1">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#0B0F19]/80 backdrop-blur-xl border border-[#1F293D] shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-cyan-glow" />
            <span>TRITYALOK 3D RECONSTRUCTION ENGINE:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-bold bg-[#111827] text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 hover:border-cyan-400 transition-all cursor-default shadow-sm">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>9-STAGE SFM/NERF PIPELINE</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-bold bg-[#111827] text-violet-300 border border-violet-500/30 flex items-center gap-1.5 hover:border-violet-400 transition-all cursor-default shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>3D GAUSSIAN SPLATS READY</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-bold bg-[#111827] text-amber-300 border border-amber-500/30 flex items-center gap-1.5 hover:border-amber-400 transition-all cursor-default shadow-sm">
              <Box className="w-3.5 h-3.5 text-amber-400" />
              <span>0.62cm LASER GROUND-TRUTH</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-bold bg-[#111827] text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 hover:border-emerald-400 transition-all cursor-default shadow-sm">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>MOBILE TOUCH D-PAD ROAMING</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
