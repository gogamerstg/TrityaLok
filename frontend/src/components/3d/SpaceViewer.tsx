import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  Maximize2,
  Compass,
  Layers,
  User,
  RotateCcw,
  Navigation,
  AlertTriangle,
  Grid,
  Eye,
  Scan,
  Radio
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { BuildingMesh } from './BuildingMesh';
import { PoiMarkers } from './PoiMarkers';
import { NavigationPath3D } from './NavigationPath3D';
import { SpatialOverlays3D } from './SpatialOverlays3D';
import { FirstPersonControls } from './FirstPersonControls';
import { AnimatedAvatar } from './AnimatedAvatar';

const CameraDirector: React.FC = () => {
  const { viewMode, selectedPoi, controlsMode } = useAppStore();
  const { camera } = useThree();

  useEffect(() => {
    if (controlsMode === 'firstPerson') return;

    if (viewMode === 'floorplan') {
      // Top down
      camera.position.set(0, 52, 0.01);
      camera.lookAt(0, 0, 0);
    } else if (viewMode === 'inspection' && selectedPoi) {
      // Focus on POI
      const p = selectedPoi.coordinates;
      camera.position.set(p.x + 9, p.y + 8, p.z + 11);
      camera.lookAt(p.x, p.y + 1, p.z);
    } else if (viewMode === 'explore') {
      // Default isometric
      camera.position.set(34, 30, 40);
      camera.lookAt(0, 2, 0);
    }
  }, [viewMode, selectedPoi, controlsMode, camera]);

  return null;
};

export const SpaceViewer: React.FC<{ height?: string }> = ({ height = '100%' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<any>(null);

  const {
    controlsMode,
    setControlsMode,
    viewMode,
    setViewMode,
    selectedFloorId,
    setSelectedFloorId,
    showPoiLabels,
    setShowPoiLabels,
    showNavigationPath,
    setShowNavigationPath,
    showObstacles,
    setShowObstacles,
    showWalkableMesh,
    setShowWalkableMesh,
    activeRoute,
  } = useAppStore();

  const resetCamera = () => {
    if (orbitRef.current) {
      orbitRef.current.reset();
      orbitRef.current.target.set(0, 2, 0);
    }
    setViewMode('explore');
    setControlsMode('orbit');
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#070A0F] border border-[#1F293D] rounded-3xl shadow-2xl"
      style={{ height }}
    >
      {/* 3D Canvas Viewport */}
      <Canvas
        shadows
        camera={{ position: [34, 30, 40], fov: 48 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <color attach="background" args={['#070A0F']} />
        <fog attach="fog" args={['#070A0F', 45, 115]} />

        {/* Lighting Atmosphere */}
        <ambientLight intensity={0.7} color="#D1D5DB" />
        <directionalLight
          position={[32, 48, 28]}
          intensity={1.3}
          color="#F8FAFC"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={120}
          shadow-camera-left={-42}
          shadow-camera-right={42}
          shadow-camera-top={42}
          shadow-camera-bottom={-42}
        />
        <pointLight position={[-16, 14, 12]} intensity={1.8} color="#00F2FE" distance={40} />
        <pointLight position={[16, 14, -12]} intensity={1.8} color="#9055FF" distance={40} />

        {/* Camera Director */}
        <CameraDirector />

        {/* Orbit Controls (when not first person) */}
        {controlsMode === 'orbit' && (
          <OrbitControls
            ref={orbitRef}
            enableDamping
            dampingFactor={0.06}
            maxPolarAngle={viewMode === 'floorplan' ? 0.05 : Math.PI / 2.05}
            minDistance={4}
            maxDistance={95}
            target={[0, 2, 0]}
          />
        )}

        {/* First Person Controls */}
        <FirstPersonControls />

        {/* Building 3D Mesh */}
        <BuildingMesh />

        {/* POI Hologram Markers */}
        <PoiMarkers />

        {/* Glowing Navigation Spline */}
        <NavigationPath3D />

        {/* Autonomous Navigating Avatar Drone */}
        <AnimatedAvatar />

        {/* Spatial Intelligence Overlays (Heatmaps, Mesh, Points) */}
        <SpatialOverlays3D />
      </Canvas>

      {/* TOP FLOATING HUD BAR */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none select-none z-10">
        {/* Left: Building & Level Indicator */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-[#0B0F19]/90 backdrop-blur-2xl px-3.5 py-2 rounded-2xl border border-[#1F293D] shadow-2xl">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-cyan-glow" />
          <span className="text-xs font-mono font-bold text-slate-200">
            IITB-NC-01
          </span>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedFloorId('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedFloorId === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Floors
            </button>
            <button
              onClick={() => setSelectedFloorId(1)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedFloorId === 1
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              L1 (Ground)
            </button>
            <button
              onClick={() => setSelectedFloorId(2)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedFloorId === 2
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50 shadow-violet-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              L2 (Upper)
            </button>
          </div>
        </div>

        {/* Right: Camera Mode & View Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0B0F19]/90 backdrop-blur-2xl p-1.5 rounded-2xl border border-[#1F293D] shadow-2xl">
          {/* 3D Orbit vs Top-Down Floorplan */}
          <button
            onClick={() => {
              setViewMode(viewMode === 'floorplan' ? 'explore' : 'floorplan');
              setControlsMode('orbit');
            }}
            title="Toggle Top-Down Floorplan"
            className={`px-3 py-1.5 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 ${
              viewMode === 'floorplan'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2D Plan</span>
          </button>

          {/* First Person Roaming Mode */}
          <button
            onClick={() => {
              setControlsMode(controlsMode === 'firstPerson' ? 'orbit' : 'firstPerson');
              if (controlsMode === 'orbit') setViewMode('explore');
            }}
            title="First-Person Roaming (WASD + Mouse)"
            className={`px-3 py-1.5 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 ${
              controlsMode === 'firstPerson'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-emerald-glow animate-pulse'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">FPS Walk</span>
          </button>

          {/* Reset View */}
          <button
            onClick={resetCamera}
            title="Reset Camera View"
            className="p-2 text-slate-400 hover:text-white hover:bg-[#172033] rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title="Fullscreen Toggle"
            className="p-2 text-slate-400 hover:text-white hover:bg-[#172033] rounded-xl transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BOTTOM-LEFT: LAYER TOGGLE BADGES */}
      <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2 pointer-events-auto z-10">
        <button
          onClick={() => setShowPoiLabels(!showPoiLabels)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 transition-all backdrop-blur-2xl ${
            showPoiLabels
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-cyan-glow'
              : 'bg-[#0B0F19]/80 border-[#1F293D] text-slate-500 hover:text-slate-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>POIs</span>
        </button>

        <button
          onClick={() => setShowNavigationPath(!showNavigationPath)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 transition-all backdrop-blur-2xl ${
            showNavigationPath
              ? 'bg-violet-500/20 border-violet-500/50 text-violet-300 shadow-violet-glow'
              : 'bg-[#0B0F19]/80 border-[#1F293D] text-slate-500 hover:text-slate-300'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Path</span>
        </button>

        <button
          onClick={() => setShowObstacles(!showObstacles)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 transition-all backdrop-blur-2xl ${
            showObstacles
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-sm'
              : 'bg-[#0B0F19]/80 border-[#1F293D] text-slate-500 hover:text-slate-300'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Obstacles</span>
        </button>

        <button
          onClick={() => setShowWalkableMesh(!showWalkableMesh)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 transition-all backdrop-blur-2xl ${
            showWalkableMesh
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-emerald-glow'
              : 'bg-[#0B0F19]/80 border-[#1F293D] text-slate-500 hover:text-slate-300'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>NavMesh</span>
        </button>
      </div>

      {/* BOTTOM-RIGHT TELEMETRY HUD */}
      <div className="absolute bottom-4 right-4 bg-[#0B0F19]/90 backdrop-blur-2xl px-4 py-2.5 rounded-2xl border border-[#1F293D] text-right text-[11px] font-mono text-slate-400 select-none pointer-events-none hidden sm:block z-10 shadow-2xl">
        <div className="flex items-center justify-end gap-2 text-cyan-300 font-extrabold mb-0.5">
          <Compass className="w-3.5 h-3.5 animate-spin-slow text-cyan-400" />
          <span>AZIMUTH 042° • ELEV 2.0m</span>
        </div>
        <div className="text-slate-400">FRAME LATENCY: 14ms | 60 FPS</div>
        <div className="text-slate-300 font-semibold">
          ACTIVE A* ROUTE: {activeRoute?.success ? `${activeRoute.total_distance_meters}m` : 'STANDBY'}
        </div>
      </div>

      {/* FIRST PERSON CROSSHAIR & HELPER TEXT */}
      {controlsMode === 'firstPerson' && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-20">
          <div className="w-6 h-6 border-2 border-cyan-400/80 rounded-full flex items-center justify-center shadow-cyan-glow">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
          </div>
          <div className="mt-5 bg-[#070A0F]/90 backdrop-blur-2xl px-5 py-2 rounded-full border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300 shadow-cyan-glow">
            Click Canvas to Lock Mouse • WASD to Walk • SHIFT to Run • ESC to Exit
          </div>
        </div>
      )}
    </div>
  );
};
