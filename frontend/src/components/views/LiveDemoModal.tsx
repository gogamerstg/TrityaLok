import React from 'react';
import {
  Flame,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  Route,
  Accessibility,
  ArrowRight,
  Sparkles,
  Zap,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../../store/useAppStore';

export const LiveDemoModal: React.FC = () => {
  const {
    isLiveDemoModalOpen,
    setIsLiveDemoModalOpen,
    building,
    setStartNodeId,
    setDestinationPoiId,
    setAccessibleOnly,
    setAvoidStairs,
    calculateCurrentRoute,
    toggleObstacle,
    setActiveSection,
    setIsNavigating,
    setIsPlayingAnimation,
    setAnimationProgress,
    setCurrentStepIndex,
    setSelectedFloorId,
  } = useAppStore();

  if (!isLiveDemoModalOpen) return null;

  // Scenario 1: Find Computer Lab 204
  const runScenario1 = () => {
    const obs = building.obstacles.find((o) => o.id === 'obs_f2_lab_renovation');
    if (obs && obs.active) toggleObstacle('obs_f2_lab_renovation');

    setStartNodeId('n_f1_entrance');
    setDestinationPoiId('poi_computer_lab');
    setAccessibleOnly(false);
    setAvoidStairs(false);
    setSelectedFloorId('all');

    calculateCurrentRoute();
    setIsNavigating(true);
    setIsPlayingAnimation(true);
    setAnimationProgress(0);
    setCurrentStepIndex(0);

    setIsLiveDemoModalOpen(false);
    setActiveSection('navigation');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  // Scenario 2: Blocked Corridor Dynamic Reroute
  const runScenario2 = () => {
    const obs = building.obstacles.find((o) => o.id === 'obs_f1_spill_east');
    if (obs && !obs.active) {
      toggleObstacle('obs_f1_spill_east');
    }

    setStartNodeId('n_f1_entrance');
    setDestinationPoiId('poi_seminar_hall');
    setAccessibleOnly(false);
    setAvoidStairs(false);
    setSelectedFloorId(1);

    calculateCurrentRoute();
    setIsNavigating(true);
    setIsPlayingAnimation(true);
    setAnimationProgress(0);
    setCurrentStepIndex(0);

    setIsLiveDemoModalOpen(false);
    setActiveSection('navigation');

    confetti({
      particleCount: 70,
      spread: 80,
      colors: ['#F59E0B', '#EF4444', '#00F2FE'],
      origin: { y: 0.8 },
    });
  };

  // Scenario 3: Accessible Multi-Floor Route via Elevator
  const runScenario3 = () => {
    setStartNodeId('n_f1_entrance');
    setDestinationPoiId('poi_classroom_201');
    setAccessibleOnly(true);
    setAvoidStairs(true);
    setSelectedFloorId('all');

    calculateCurrentRoute();
    setIsNavigating(true);
    setIsPlayingAnimation(true);
    setAnimationProgress(0);
    setCurrentStepIndex(0);

    setIsLiveDemoModalOpen(false);
    setActiveSection('navigation');

    confetti({
      particleCount: 80,
      spread: 100,
      colors: ['#10B981', '#00C8FF', '#9055FF'],
      origin: { y: 0.8 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070A0F]/85 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0B0F19] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setIsLiveDemoModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#172033] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              1-CLICK JUDGE SCENARIOS • TECHFEST IIT BOMBAY
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Live Demonstration Presets
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select any scenario below to immediately execute an automated end-to-end demonstration.
          </p>
        </div>

        {/* Scenario Cards */}
        <div className="space-y-3.5">
          {/* SCENARIO 1 */}
          <div
            onClick={runScenario1}
            className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#1F293D] hover:border-cyan-400 transition-all cursor-pointer group flex items-center justify-between gap-4 shadow-lg"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-500/40">
                  SCENARIO 01
                </span>
                <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Find Computer Lab 204
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated search for GPU & 3D Vision Lab, computes A* trajectory from Main Entrance, highlights destination beacon, and begins animated drone navigation.
              </p>
            </div>
            <button className="p-3.5 rounded-2xl bg-cyan-500 text-slate-950 group-hover:bg-cyan-400 transition-colors shadow-cyan-glow flex-shrink-0">
              <Play className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* SCENARIO 2 */}
          <div
            onClick={runScenario2}
            className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#1F293D] hover:border-amber-400 transition-all cursor-pointer group flex items-center justify-between gap-4 shadow-lg"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40">
                  SCENARIO 02
                </span>
                <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Dynamic Obstacle Rerouting
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulates an active floor maintenance spill in the East Corridor. The engine detects the blockage and dynamically reroutes travelers through the Grand Atrium bypass.
              </p>
            </div>
            <button className="p-3.5 rounded-2xl bg-amber-500 text-slate-950 group-hover:bg-amber-400 transition-colors shadow-amber-glow flex-shrink-0">
              <Play className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* SCENARIO 3 */}
          <div
            onClick={runScenario3}
            className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#1F293D] hover:border-emerald-400 transition-all cursor-pointer group flex items-center justify-between gap-4 shadow-lg"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40">
                  SCENARIO 03
                </span>
                <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Accessible Step-Free Multi-Floor Route
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enforces strict wheelchair accessibility constraints. Bypasses the architectural staircase and navigates seamlessly via the Central Glass Elevator to Level 2.
              </p>
            </div>
            <button className="p-3.5 rounded-2xl bg-emerald-500 text-slate-950 group-hover:bg-emerald-400 transition-colors shadow-emerald-glow flex-shrink-0">
              <Play className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        {/* Competition Footer Pill */}
        <div className="p-3.5 rounded-2xl bg-[#070A0F] border border-[#1F293D] flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>TARGET: Techfest Namma Space Round 1/2/3</span>
          <span className="text-cyan-400 font-bold">100% IN-BROWSER READY</span>
        </div>
      </div>
    </div>
  );
};
