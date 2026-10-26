import React from 'react';
import {
  Cpu,
  X,
  Layers,
  Box,
  Compass,
  Route,
  Bot,
  Glasses,
  CheckCircle2,
  FileCode,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const TechSpecsDrawer: React.FC = () => {
  const { isTechSpecsOpen, setIsTechSpecsOpen } = useAppStore();

  if (!isTechSpecsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-surface-card border border-surface-border rounded-3xl shadow-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setIsTechSpecsOpen(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-surface-elevated transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              System Architecture & Competition Documentation
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <span>NEXUS SPACE Technical Specifications</span>
          </h2>
          <p className="text-xs text-slate-400">
            Engineered for Techfest IIT Bombay — Namma Space 3D Indoor Digital Twin Challenge.
          </p>
        </div>

        {/* Competition Rounds Alignment */}
        <div className="p-4 rounded-2xl bg-surface-elevated border border-surface-border space-y-3">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
            Competition Rounds Roadmap Compliance
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-surface-border space-y-1">
              <div className="text-cyan-400 font-bold font-mono">ROUND 1 (Oct 2026)</div>
              <div className="font-semibold text-slate-200">3D Reconstruction + Roaming</div>
              <div className="text-[11px] text-slate-400">
                Working WebGL 3D viewer, free FPS/Orbit exploration, procedural multi-floor building model, submission abstract.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-surface-border space-y-1">
              <div className="text-violet-400 font-bold font-mono">ROUND 2</div>
              <div className="font-semibold text-slate-200">POI Search + Obstacle A*</div>
              <div className="text-[11px] text-slate-400">
                12 searchable POIs, dynamic corridor blockages, real-time A* pathfinding, multi-floor transitions via stairs & elevator.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-surface-border space-y-1">
              <div className="text-emerald-400 font-bold font-mono">ROUND 3 (IIT Bombay)</div>
              <div className="font-semibold text-slate-200">Live Venue Capture + Q&A</div>
              <div className="text-[11px] text-slate-400">
                On-site smartphone video capture, fast 9-stage reconstruction telemetry, live AR navigation HUD, AI spatial assistant.
              </div>
            </div>
          </div>
        </div>

        {/* Technical Architecture Stack */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            Architectural Modules & Data Pipelines
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* 1. 3D Graphics & Engine */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <Box className="w-4 h-4 text-cyan-400" />
                <span>Frontend 3D Digital Twin Viewer</span>
              </div>
              <ul className="text-slate-400 space-y-1 text-[11px]">
                <li>• React 19 + TypeScript + Vite + Tailwind CSS</li>
                <li>• Three.js + @react-three/fiber + @react-three/drei</li>
                <li>• First-person WASD + pointer-lock mouse look</li>
                <li>• 2D Top-down orthographic floor plan toggle</li>
                <li>• Multi-floor layer culling (Ground Floor vs Level 2)</li>
              </ul>
            </div>

            {/* 2. Reconstruction Pipeline */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <Layers className="w-4 h-4 text-violet-400" />
                <span>Modular 3D Reconstruction Core</span>
              </div>
              <ul className="text-slate-400 space-y-1 text-[11px]">
                <li>• COLMAP Structure from Motion (SfM) camera pose estimation</li>
                <li>• Open3D dense stereo point-cloud generation</li>
                <li>• 3D Gaussian Splatting (30,000 optimization iterations)</li>
                <li>• Screened Poisson surface reconstruction & texture atlas</li>
                <li>• Draco-compressed glTF/GLB web distribution</li>
              </ul>
            </div>

            {/* 3. Obstacle-Aware Pathfinding */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <Route className="w-4 h-4 text-emerald-400" />
                <span>Obstacle-Aware Graph Pathfinding</span>
              </div>
              <ul className="text-slate-400 space-y-1 text-[11px]">
                <li>• Topological Navigation Graph (Nodes & Directed Edges)</li>
                <li>• A* Algorithm with 3D Euclidean heuristic function</li>
                <li>• Dynamic edge blockage detection (maintenance hazards)</li>
                <li>• Multi-floor vertical transitions (stairs vs elevator)</li>
                <li>• Turn-by-turn angle calculation in XZ plane</li>
              </ul>
            </div>

            {/* 4. AI & AR Interface */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <Bot className="w-4 h-4 text-amber-400" />
                <span>AI Assistant & Simulated AR</span>
              </div>
              <ul className="text-slate-400 space-y-1 text-[11px]">
                <li>• NEXUS Natural-language spatial intent parser</li>
                <li>• Web Speech API speech-to-text & speech synthesis</li>
                <li>• Grounded building knowledge base (zero hallucinations)</li>
                <li>• Simulated WebXR 6-DoF camera HUD with turn arrows</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setIsTechSpecsOpen(false)}
            className="py-2.5 px-6 rounded-xl font-bold text-xs bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-cyan-glow"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
