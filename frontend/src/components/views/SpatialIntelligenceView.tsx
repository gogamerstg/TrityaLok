import React from 'react';
import {
  Grid,
  AlertTriangle,
  Layers,
  Sparkles,
  PieChart,
  BarChart3,
  Shield,
  Compass,
  CheckCircle2,
  Scan
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SpaceViewer } from '../3d/SpaceViewer';

export const SpatialIntelligenceView: React.FC = () => {
  const {
    building,
    showWalkableMesh,
    setShowWalkableMesh,
    showObstacleHeatmap,
    setShowObstacleHeatmap,
    showScannerCoverage,
    setShowScannerCoverage,
    showPoiLabels,
    setShowPoiLabels,
    showObstacles,
    setShowObstacles,
  } = useAppStore();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Spatial Analytics & NavMesh Geometry
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Spatial Intelligence • <span className="text-gradient-cyan">Coverage & Hazard Analytics</span>
        </h1>
        <p className="text-sm text-slate-400">
          Analyze walkable navigation topologies, photogrammetry scan completeness, and dynamic obstacle heatmaps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Overlays Controller & Analytics */}
        <div className="lg:col-span-5 space-y-5">
          {/* Layer Overlay Controls */}
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xl">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              3D Spatial Layer Controls
            </span>

            <div className="space-y-2.5">
              {/* 1. Walkable Mesh Grid */}
              <div
                onClick={() => setShowWalkableMesh(!showWalkableMesh)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  showWalkableMesh
                    ? 'bg-emerald-500/10 border-emerald-400 text-emerald-200 shadow-sm'
                    : 'bg-surface-elevated border-surface-border text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Grid className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold">Walkable NavMesh Wireframe</div>
                    <div className="text-[11px] text-slate-400">
                      Topological corridor graph with 32 connections
                    </div>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full ${showWalkableMesh ? 'bg-emerald-400' : 'bg-slate-700'}`} />
              </div>

              {/* 2. Obstacle Danger Heatmap */}
              <div
                onClick={() => setShowObstacleHeatmap(!showObstacleHeatmap)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  showObstacleHeatmap
                    ? 'bg-amber-500/10 border-amber-400 text-amber-200 shadow-sm'
                    : 'bg-surface-elevated border-surface-border text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold">Obstacle Proximity Heatmap</div>
                    <div className="text-[11px] text-slate-400">
                      Radial clearance caution zones around hazards
                    </div>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full ${showObstacleHeatmap ? 'bg-amber-400' : 'bg-slate-700'}`} />
              </div>

              {/* 3. Photogrammetry Scanner Coverage */}
              <div
                onClick={() => setShowScannerCoverage(!showScannerCoverage)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  showScannerCoverage
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-200 shadow-sm'
                    : 'bg-surface-elevated border-surface-border text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Scan className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-xs font-bold">Photogrammetry Point Density</div>
                    <div className="text-[11px] text-slate-400">
                      3,500 sample spatial camera ray samples
                    </div>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full ${showScannerCoverage ? 'bg-cyan-400' : 'bg-slate-700'}`} />
              </div>
            </div>
          </div>

          {/* Building Coverage & Scan Metrics */}
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xl">
            <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider block">
              Scan Completeness Assessment
            </span>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Ground Floor (Level 1) Coverage</span>
                  <span className="text-cyan-400 font-bold">96.8%</span>
                </div>
                <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '96.8%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Level 2 (Upper Mezzanine) Coverage</span>
                  <span className="text-violet-400 font-bold">92.4%</span>
                </div>
                <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-violet-400 rounded-full" style={{ width: '92.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">Central Staircase Transition Coverage</span>
                  <span className="text-emerald-400 font-bold">89.0%</span>
                </div>
                <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '89%' }} />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated border border-surface-border text-xs text-slate-400 space-y-1">
              <div className="text-slate-200 font-semibold">Recommended Rescan Areas:</div>
              <div>• North Emergency Exit corridor (low light sensor readings)</div>
              <div>• Upper Mezzanine Glass Balustrade corners</div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Visualization */}
        <div className="lg:col-span-7 h-[600px] rounded-2xl bg-surface-card border border-surface-border overflow-hidden shadow-2xl relative">
          <SpaceViewer height="100%" />
        </div>
      </div>
    </div>
  );
};
