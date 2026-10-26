import React, { useState } from 'react';
import {
  Upload,
  Video,
  Camera,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  FileText,
  Play,
  RotateCw,
  Box,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ScanSpaceView: React.FC = () => {
  const {
    jobs,
    activeJob,
    startReconstructionJob,
    setActiveSection,
    setSelectedFloorId,
  } = useAppStore();

  const [selectedMethod, setSelectedMethod] = useState<'video' | 'images' | 'camera' | 'sample'>('video');
  const [venueName, setVenueName] = useState('IIT Bombay - Computer Science Foyer');
  const [fileCount, setFileCount] = useState(120);
  const [checklist, setChecklist] = useState({
    slowMovement: true,
    overlappingViews: true,
    avoidShakes: true,
    entrancesCaptured: true,
    furnitureObstacles: true,
    sufficientLighting: true,
  });

  const allChecked = Object.values(checklist).every(Boolean);

  const handleStartScan = () => {
    startReconstructionJob(venueName, selectedMethod === 'camera' ? 'video' : selectedMethod, fileCount);
  };

  const currentJob = activeJob || jobs[0];

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Photogrammetry & NeRF / Gaussian Splatting
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Scan Space • <span className="text-gradient-cyan">Smartphone 3D Reconstruction</span>
        </h1>
        <p className="text-sm text-slate-400">
          Capture indoor environments using everyday mobile video and convert them into
          centimeter-accurate 3D digital twins with automated camera pose estimation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Step 1 & Step 2 */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: CHOOSE CAPTURE METHOD */}
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Step 1: Choose Capture Method
              </span>
              <span className="text-[11px] font-mono text-slate-500">4K / 1080p Recommended</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Method 1: Upload Video */}
              <button
                onClick={() => setSelectedMethod('video')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedMethod === 'video'
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-200 shadow-cyan-glow'
                    : 'bg-surface-elevated border-surface-border text-slate-300 hover:border-slate-500'
                }`}
              >
                <Video className="w-5 h-5 text-cyan-400 mb-2" />
                <div className="text-sm font-bold">Upload Video</div>
                <div className="text-xs text-slate-400 mt-1">
                  Single continuous walk-through video (.mp4, .mov)
                </div>
              </button>

              {/* Method 2: Upload Photos */}
              <button
                onClick={() => setSelectedMethod('images')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedMethod === 'images'
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-200 shadow-cyan-glow'
                    : 'bg-surface-elevated border-surface-border text-slate-300 hover:border-slate-500'
                }`}
              >
                <Upload className="w-5 h-5 text-cyan-400 mb-2" />
                <div className="text-sm font-bold">Upload Photos</div>
                <div className="text-xs text-slate-400 mt-1">
                  60-300 overlapping photos taken at 60%+ overlap
                </div>
              </button>

              {/* Method 3: Live Mobile Camera */}
              <button
                onClick={() => setSelectedMethod('camera')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedMethod === 'camera'
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-200 shadow-cyan-glow'
                    : 'bg-surface-elevated border-surface-border text-slate-300 hover:border-slate-500'
                }`}
              >
                <Camera className="w-5 h-5 text-cyan-400 mb-2" />
                <div className="text-sm font-bold">Phone Camera</div>
                <div className="text-xs text-slate-400 mt-1">
                  Direct browser camera capture with gyro feedback
                </div>
              </button>

              {/* Method 4: Load Sample Environment */}
              <button
                onClick={() => setSelectedMethod('sample')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedMethod === 'sample'
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-200 shadow-cyan-glow'
                    : 'bg-surface-elevated border-surface-border text-slate-300 hover:border-slate-500'
                }`}
              >
                <Box className="w-5 h-5 text-cyan-400 mb-2" />
                <div className="text-sm font-bold">Preloaded Dataset</div>
                <div className="text-xs text-slate-400 mt-1">
                  IIT Bombay Innovation Hub benchmark scan
                </div>
              </button>
            </div>

            {/* Input Venue Name */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-mono text-slate-400">VENUE / BUILDING NAME</label>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-surface-border text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* STEP 2: CAPTURE GUIDANCE CHECKLIST */}
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">
                Step 2: Interactive Capture Guidance
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Essential for SfM Convergence
              </span>
            </div>

            {/* Visual Trajectory Diagram */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border/60 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-200">Recommended Walk Pattern</div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  Walk in an inward-facing lawnmower serpentine loop, capturing high, eye-level, and low angles.
                </div>
              </div>
              <div className="w-28 h-16 rounded-lg border border-cyan-500/30 bg-slate-950/60 p-2 relative flex items-center justify-center">
                <div className="w-full h-full border border-dashed border-cyan-400/50 rounded flex items-center justify-center">
                  <span className="text-[9px] font-mono text-cyan-300">LOOP PATH</span>
                </div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2">
              {[
                { key: 'slowMovement', label: 'Move slowly around the room (avoid motion blur)' },
                { key: 'overlappingViews', label: 'Capture overlapping views (minimum 60% overlap between frames)' },
                { key: 'avoidShakes', label: 'Hold phone steady with smooth, sweeping camera panning' },
                { key: 'entrancesCaptured', label: 'Capture entrances, doorways, and connecting corridors' },
                { key: 'furnitureObstacles', label: 'Capture major furniture, partitions, and permanent obstacles' },
                { key: 'sufficientLighting', label: 'Ensure uniform indoor lighting; avoid extreme glare or pitch darkness' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-elevated hover:bg-slate-800/60 transition-colors cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.key as keyof typeof checklist]}
                    onChange={(e) =>
                      setChecklist({ ...checklist, [item.key]: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                  <span className="text-slate-300 font-medium">{item.label}</span>
                </label>
              ))}
            </div>

            {/* Launch Button */}
            <button
              onClick={handleStartScan}
              disabled={!allChecked}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                allChecked
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-cyan-glow hover:brightness-110'
                  : 'bg-surface-elevated text-slate-500 cursor-not-allowed border border-surface-border'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch 3D Reconstruction Pipeline</span>
            </button>
          </div>
        </div>

        {/* Right Column: Step 3 - Reconstruction Pipeline Live Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Step 3: 9-Stage Reconstruction Pipeline
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                {currentJob.status}
              </span>
            </div>

            {/* Progress Bar & Stage Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">{currentJob.current_stage}</span>
                <span className="text-cyan-400 font-bold">{currentJob.progress_percentage}%</span>
              </div>
              <div className="h-2.5 w-full bg-surface-elevated rounded-full overflow-hidden border border-surface-border">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500 rounded-full"
                  style={{ width: `${currentJob.progress_percentage}%` }}
                />
              </div>
            </div>

            {/* Pipeline Stage Checklist */}
            <div className="space-y-1.5 text-xs font-mono">
              {[
                { stage: 'Image ingestion', done: currentJob.progress_percentage >= 10 },
                { stage: 'Image quality validation', done: currentJob.progress_percentage >= 20 },
                { stage: 'Camera pose estimation (COLMAP)', done: currentJob.progress_percentage >= 35 },
                { stage: 'Feature matching', done: currentJob.progress_percentage >= 50 },
                { stage: 'Point-cloud generation (Open3D)', done: currentJob.progress_percentage >= 65 },
                { stage: 'Surface reconstruction (Poisson)', done: currentJob.progress_percentage >= 75 },
                { stage: 'Texture generation', done: currentJob.progress_percentage >= 85 },
                { stage: '3D optimization & Draco compression', done: currentJob.progress_percentage >= 95 },
                { stage: 'Digital twin publication', done: currentJob.progress_percentage >= 100 },
              ].map((s, idx) => (
                <div
                  key={s.stage}
                  className={`flex items-center justify-between p-1.5 rounded ${
                    s.done ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-600">0{idx + 1}.</span>
                    <span>{s.stage}</span>
                  </span>
                  {s.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>
              ))}
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 bg-surface-elevated rounded-xl border border-surface-border">
              <div>
                <span className="text-slate-500 block">KEYFRAMES</span>
                <span className="text-slate-200 font-bold">{currentJob.file_count}</span>
              </div>
              <div>
                <span className="text-slate-500 block">POINT CLOUD</span>
                <span className="text-slate-200 font-bold">
                  {currentJob.point_cloud_count ? currentJob.point_cloud_count.toLocaleString() : 'Processing...'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">MESH VERTICES</span>
                <span className="text-slate-200 font-bold">
                  {currentJob.mesh_vertex_count ? currentJob.mesh_vertex_count.toLocaleString() : 'Processing...'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">ELAPSED TIME</span>
                <span className="text-cyan-400 font-bold">{Math.round(currentJob.elapsed_seconds)}s</span>
              </div>
            </div>

            {/* Terminal Log Console */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>RECONSTRUCTION TELEMETRY LOG</span>
                <span className="text-emerald-400">STREAMING ACTIVE</span>
              </div>
              <div className="h-40 p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 overflow-y-auto space-y-1 border border-surface-border">
                {currentJob.logs.map((log, i) => (
                  <div key={i} className="leading-snug">
                    <span className="text-cyan-400">{log.substring(0, 7)}</span>
                    <span className="text-slate-300">{log.substring(7)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action to Open Completed Model */}
            {currentJob.status === 'completed' && (
              <button
                onClick={() => {
                  setSelectedFloorId(1);
                  setActiveSection('twin');
                }}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Box className="w-4 h-4 text-emerald-400" />
                <span>Open Digital Twin in 3D Viewport</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
