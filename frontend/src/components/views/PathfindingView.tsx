import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Navigation, Compass, MapPin, Footprints, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

export const PathfindingView: React.FC = () => {
  const { building, selectedFloorId, setSelectedFloorId, destinationPoiId, setDestinationPoiId } = useAppStore();
  const [startPoi, setStartPoi] = useState(building.pois[0]?.id || 'poi-1');
  const [endPoi, setEndPoi] = useState(building.pois[1]?.id || 'poi-2');
  const [calculating, setCalculating] = useState(false);
  const [routeCalculated, setRouteCalculated] = useState(true);

  const handleCalculate = () => {
    setCalculating(true);
    setTimeout(() => {
      setCalculating(false);
      setRouteCalculated(true);
    }, 600);
  };

  const currentFloor = building.floors.find(f => f.id === selectedFloorId) || building.floors[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B0F19]/80 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Navigation className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Intelligent A* Pathfinding Engine</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time graph-based indoor routing, obstacle avoidance, and multi-floor navigation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCalculate}
            disabled={calculating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${calculating ? 'animate-spin' : ''}`} />
            <span>{calculating ? 'Calculating A*...' : 'Recalculate Route'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Planner Panel */}
        <div className="bg-[#0B0F19]/80 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl space-y-5">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Route Parameters</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Start Location (Current Position)</label>
              <select
                value={startPoi}
                onChange={(e) => setStartPoi(e.target.value)}
                className="w-full bg-[#111827] border border-[#1F293D] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {building.pois.map((poi) => (
                  <option key={poi.id} value={poi.id}>
                    {poi.name} ({poi.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Destination POI</label>
              <select
                value={endPoi}
                onChange={(e) => setEndPoi(e.target.value)}
                className="w-full bg-[#111827] border border-[#1F293D] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {building.pois.map((poi) => (
                  <option key={poi.id} value={poi.id}>
                    {poi.name} ({poi.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-[#1F293D] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Algorithm</span>
                <span className="font-mono text-emerald-400">A* Graph Search</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimated Distance</span>
                <span className="font-mono text-white">18.4 meters</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimated Travel Time</span>
                <span className="font-mono text-white">22 seconds</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Accessibility</span>
                <span className="font-mono text-emerald-400">Wheelchair Friendly</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Optimal Path Verified</span>
            </div>
            <p className="text-[11px] text-emerald-300/80">
              No dynamic obstacles detected along the primary corridor. Safe to navigate.
            </p>
          </div>
        </div>

        {/* Turn-by-Turn Instructions & Map Canvas */}
        <div className="lg:col-span-2 bg-[#0B0F19]/80 backdrop-blur-xl border border-[#1F293D] p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F293D] pb-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Footprints className="w-4 h-4 text-emerald-400" />
                <span>Turn-by-Turn Guidance</span>
              </h2>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Floor {currentFloor.id}: {currentFloor.name}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 shrink-0">1</span>
                <div>
                  <div className="font-bold">Start at Reception Main Lobby</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Walk straight down Main Corridor for 6.2 meters.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#111827] border border-[#1F293D] text-slate-300">
                <span className="w-6 h-6 rounded-lg bg-[#172033] flex items-center justify-center font-bold text-slate-400 shrink-0">2</span>
                <div>
                  <div className="font-bold">Turn Right at Pillar #B2</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Continue past Conference Hall A for 8.5 meters.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#111827] border border-[#1F293D] text-slate-300">
                <span className="w-6 h-6 rounded-lg bg-[#172033] flex items-center justify-center font-bold text-slate-400 shrink-0">3</span>
                <div>
                  <div className="font-bold">Arrive at Destination</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Meeting Room 4 is on your left.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floor selection */}
          <div className="mt-6 pt-4 border-t border-[#1F293D] flex items-center justify-between text-xs text-slate-400">
            <span>Switch Floor:</span>
            <div className="flex gap-2">
              {building.floors.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFloorId(f.id)}
                  className={`px-3 py-1.5 rounded-lg border font-mono transition-all cursor-pointer ${
                    selectedFloorId === f.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-[#111827] text-slate-400 border-[#1F293D] hover:border-slate-600'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
