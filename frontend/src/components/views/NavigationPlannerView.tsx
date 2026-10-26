import React, { useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Route,
  ArrowRight,
  Shield,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Footprints,
  Clock,
  CheckCircle2,
  CornerDownRight,
  ChevronRight,
  Flame,
  Zap,
  Sliders,
  Compass
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SpaceViewer } from '../3d/SpaceViewer';

export const NavigationPlannerView: React.FC = () => {
  const {
    building,
    startNodeId,
    setStartNodeId,
    destinationPoiId,
    setDestinationPoiId,
    accessibleOnly,
    setAccessibleOnly,
    avoidStairs,
    setAvoidStairs,
    activeRoute,
    calculateCurrentRoute,
    isNavigating,
    setIsNavigating,
    isPlayingAnimation,
    setIsPlayingAnimation,
    animationProgress,
    setAnimationProgress,
    currentStepIndex,
    setCurrentStepIndex,
    toggleObstacle,
  } = useAppStore();

  useEffect(() => {
    if (!activeRoute) {
      calculateCurrentRoute();
    }
  }, []);

  const handleStartNavigation = () => {
    setIsNavigating(true);
    setIsPlayingAnimation(true);
    setAnimationProgress(0);
    setCurrentStepIndex(0);
  };

  const handleReplayAnimation = () => {
    setAnimationProgress(0);
    setIsPlayingAnimation(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              A* GRAPH TRAVERSAL • OBSTACLE RESILIENT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
            Smart Navigation Planner • <span className="text-gradient-cyan">Route Engine</span>
          </h1>
        </div>

        {/* Dynamic Obstacle Injector Pill */}
        <div className="flex flex-wrap items-center gap-2">
          {building.obstacles.map((obs) => (
            <button
              key={obs.id}
              onClick={() => toggleObstacle(obs.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border flex items-center gap-2 transition-all shadow-sm ${
                obs.active
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-[#111827] border-[#1F293D] text-slate-400 hover:text-white hover:border-slate-600'
              }`}
              title="Click to toggle indoor physical obstacle and observe dynamic A* rerouting in real time"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{obs.name.split(' ')[2]} {obs.active ? '(BLOCKED)' : '(CLEAR)'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls & Turn-by-Turn (Left) + 3D Viewport (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Planner Controls & Waypoints */}
        <div className="lg:col-span-5 space-y-5">
          {/* Route Config Card */}
          <div className="p-5 rounded-3xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] space-y-4 shadow-xl">
            <div className="space-y-3">
              {/* Origin Selection */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5 font-bold">
                  START ORIGIN
                </label>
                <select
                  value={startNodeId}
                  onChange={(e) => {
                    setStartNodeId(e.target.value);
                    setTimeout(calculateCurrentRoute, 50);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#1F293D] text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-sans"
                >
                  {building.nodes
                    .filter((n) => n.walkable)
                    .map((n) => (
                      <option key={n.id} value={n.id}>
                        [L{n.floor_id}] {n.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Destination Selection */}
              <div>
                <label className="text-xs font-mono text-cyan-400 block mb-1.5 font-bold">
                  TARGET DESTINATION POI
                </label>
                <select
                  value={destinationPoiId || ''}
                  onChange={(e) => {
                    setDestinationPoiId(e.target.value);
                    setTimeout(calculateCurrentRoute, 50);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-cyan-500/40 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-sans font-bold text-cyan-200"
                >
                  {building.pois.map((p) => (
                    <option key={p.id} value={p.id}>
                      [L{p.floor_id}] {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Constraints Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1F293D]">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#111827] text-xs cursor-pointer hover:bg-[#172033] transition-colors border border-transparent hover:border-[#1F293D]">
                <input
                  type="checkbox"
                  checked={accessibleOnly}
                  onChange={(e) => {
                    setAccessibleOnly(e.target.checked);
                    setTimeout(calculateCurrentRoute, 50);
                  }}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span className="font-semibold text-slate-200">Step-Free Only</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#111827] text-xs cursor-pointer hover:bg-[#172033] transition-colors border border-transparent hover:border-[#1F293D]">
                <input
                  type="checkbox"
                  checked={avoidStairs}
                  onChange={(e) => {
                    setAvoidStairs(e.target.checked);
                    setTimeout(calculateCurrentRoute, 50);
                  }}
                  className="w-4 h-4 rounded text-violet-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span className="font-semibold text-slate-200">Avoid Stairs</span>
              </label>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateCurrentRoute}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:brightness-110 shadow-cyan-glow transition-all flex items-center justify-center gap-2"
            >
              <Route className="w-4 h-4 stroke-[2.5]" />
              <span>Calculate Shortest Route (A*)</span>
            </button>
          </div>

          {/* Route Result Summary & Replay Card */}
          {activeRoute && activeRoute.success && (
            <div className="p-5 rounded-3xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] space-y-4 shadow-xl">
              {/* Reroute Alert Banner */}
              {activeRoute.rerouted_around_obstacle && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2.5 font-mono shadow-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
                  <span>Corridor blocked! Safely rerouted through Grand Atrium bypass.</span>
                </div>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-xs font-mono text-center">
                <div className="p-3 rounded-2xl bg-[#111827]">
                  <div className="text-slate-500 text-[10px]">DISTANCE</div>
                  <div className="text-cyan-300 font-extrabold text-base mt-0.5">
                    {activeRoute.total_distance_meters}m
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-[#111827]">
                  <div className="text-slate-500 text-[10px]">EST. TIME</div>
                  <div className="text-violet-300 font-extrabold text-base mt-0.5">
                    {activeRoute.estimated_time_seconds}s
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-[#111827]">
                  <div className="text-slate-500 text-[10px]">TRANSIT</div>
                  <div className="text-emerald-300 font-extrabold text-xs mt-0.5">
                    {activeRoute.requires_transit ? activeRoute.transit_type_used?.toUpperCase() : 'SAME FLOOR'}
                  </div>
                </div>
              </div>

              {/* Animation Progress & Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleStartNavigation}
                  className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-cyan-glow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isPlayingAnimation ? 'Navigating in 3D...' : 'Follow 3D Route'}</span>
                </button>
                <button
                  onClick={handleReplayAnimation}
                  className="p-2.5 rounded-xl bg-[#111827] hover:bg-[#172033] text-slate-300 transition-colors"
                  title="Replay Route Animation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Turn-by-Turn Instruction List */}
              <div className="space-y-2 pt-2 border-t border-[#1F293D]">
                <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span className="font-bold">TURN-BY-TURN INSTRUCTIONS ({activeRoute.turn_by_turn.length} STEPS)</span>
                  <span className="text-cyan-400 font-semibold">WAYPOINTS</span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {activeRoute.turn_by_turn.map((step, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentStepIndex(idx)}
                      className={`p-3 rounded-xl text-xs transition-all cursor-pointer flex items-start gap-3 border ${
                        idx === currentStepIndex
                          ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200 shadow-cyan-glow'
                          : 'bg-[#111827] border-[#1F293D] hover:bg-[#172033] text-slate-300'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#070A0F] border border-[#1F293D] flex items-center justify-center text-[10px] font-mono font-bold text-cyan-400 flex-shrink-0">
                        {step.step_number}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold leading-snug">{step.instruction}</div>
                        {step.distance_meters > 0 && (
                          <div className="text-[10px] font-mono text-slate-400 mt-1">
                            Continue for {step.distance_meters}m • Level {step.floor_id}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 3D Digital Twin Navigation Viewport */}
        <div className="lg:col-span-7 h-[620px] rounded-3xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#1F293D] overflow-hidden shadow-2xl relative">
          <SpaceViewer height="100%" />
        </div>
      </div>
    </div>
  );
};
