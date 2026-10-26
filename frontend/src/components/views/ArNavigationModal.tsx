import React, { useState } from 'react';
import {
  Glasses,
  X,
  Compass,
  ArrowUp,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Camera,
  Layers,
  MapPin,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ArNavigationModal: React.FC = () => {
  const {
    isArModalOpen,
    setIsArModalOpen,
    activeRoute,
    destinationPoiId,
    building,
    currentStepIndex,
  } = useAppStore();

  const [simulatedCompassAngle, setSimulatedCompassAngle] = useState(45);
  const [cameraActive, setCameraActive] = useState(false);

  if (!isArModalOpen) return null;

  const currentStep = activeRoute && activeRoute.turn_by_turn[currentStepIndex]
    ? activeRoute.turn_by_turn[currentStepIndex]
    : {
        step_number: 1,
        instruction: 'Proceed straight along Central Foyer Corridor',
        distance_meters: 12.0,
        turn_type: 'straight' as const,
        floor_id: 1,
      };

  const destinationPoi = building.pois.find((p) => p.id === destinationPoiId) || building.pois[2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface-card border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[640px]">
        {/* Header HUD */}
        <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-elevated/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Glasses className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">AR Spatial Guidance HUD</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                  SIMULATED AR
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                WebXR / Computer Vision Pose Tracking Ready
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsArModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Simulated Camera / AR View */}
        <div className="flex-1 relative bg-slate-950 overflow-hidden flex items-center justify-center">
          {/* Simulated Camera Video Stream / Interior Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-950/90 to-slate-950 flex items-center justify-center">
            {/* Perspective grid floor */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at center, rgba(0, 242, 254, 0.4) 0%, transparent 70%), linear-gradient(to right, #00f2fe 1px, transparent 1px), linear-gradient(to bottom, #00f2fe 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                transform: 'perspective(500px) rotateX(60deg) translateY(120px)',
              }}
            />
          </div>

          {/* AR Floating Directional Waypoint Arrow */}
          <div className="relative z-10 flex flex-col items-center animate-bounce">
            {/* Holographic Glowing 3D Arrow */}
            <div className="w-24 h-24 rounded-full bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center shadow-cyan-glow">
              {currentStep.turn_type === 'left' ? (
                <ArrowLeft className="w-12 h-12 text-cyan-400 stroke-[3]" />
              ) : currentStep.turn_type === 'right' ? (
                <ArrowRight className="w-12 h-12 text-cyan-400 stroke-[3]" />
              ) : (
                <ArrowUp className="w-12 h-12 text-cyan-400 stroke-[3]" />
              )}
            </div>

            {/* Distance Callout Badge */}
            <div className="mt-3 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/60 text-sm font-mono font-bold text-cyan-300 shadow-lg">
              {currentStep.distance_meters > 0 ? `${currentStep.distance_meters} meters` : 'Arrival'}
            </div>
          </div>

          {/* Top AR Status Banner */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-surface-border text-xs font-mono text-cyan-300 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>HEADING: {simulatedCompassAngle}° N</span>
            </div>

            <div className="px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-surface-border text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>POSE TRACKED (6-DoF)</span>
            </div>
          </div>

          {/* AR Target Destination Marker in distance */}
          <div className="absolute top-1/4 right-1/4 flex flex-col items-center opacity-85">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400 flex items-center justify-center text-violet-300 shadow-violet-glow">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-violet-300 border border-violet-500/30">
              {destinationPoi.name}
            </span>
          </div>
        </div>

        {/* Bottom Turn-by-Turn Telemetry HUD */}
        <div className="p-4 bg-surface-card border-t border-surface-border space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              CURRENT STEP {currentStep.step_number} OF {activeRoute?.turn_by_turn.length || 6}
            </span>
            <span className="text-cyan-400 font-bold">
              DESTINATION: {destinationPoi.name}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-white">
                {currentStep.instruction}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Floor {currentStep.floor_id} • Accessible Route Active
              </div>
            </div>

            <button
              onClick={() => setIsArModalOpen(false)}
              className="py-2 px-4 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-cyan-glow flex-shrink-0"
            >
              Back to 3D Twin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
