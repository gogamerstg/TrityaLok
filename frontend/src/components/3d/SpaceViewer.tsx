import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  Maximize2,
  Minimize2,
  Compass,
  Layers,
  Eye,
  User,
  RotateCcw,
  Navigation,
  AlertTriangle,
  Grid
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
      camera.position.set(0, 50, 0.01);
      camera.lookAt(0, 0, 0);
    } else if (viewMode === 'inspection' && selectedPoi) {
      // Focus on POI
      const p = selectedPoi.coordinates;
      camera.position.set(p.x + 8, p.y + 7, p.z + 10);
      camera.lookAt(p.x, p.y + 1, p.z);
    } else if (viewMode === 'explore') {
      // Default isometric
      camera.position.set(32, 28, 38);
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
    showObstacleHeatmap,
    setShowObstacleHeatmap,
    showScannerCoverage,
    setShowScannerCoverage,
    selectedPoi,
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
      className="relative w-full overflow-hidden bg-background border border-surface-border rounded-xl shadow-2xl"
      style={{ height }}
    >
      {/* 3D Canvas Viewport */}
      <Canvas
        shadows
        camera={{ position: [32, 28, 38], fov: 48 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <color attach="background" args={['#070A0F']} />
        <fog attach="fog" args={['#070A0F', 40, 110]} />

        {/* Ambient & Accent Lights */}
        <ambientLight intensity={0.65} color="#C8D6E5" />
        <directionalLight
          position={[30, 45, 25]}
          intensity={1.2}
          color="#F8FAFC"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={120}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
        />
        <pointLight position={[-15, 12, 10]} intensity={1.5} color="#00F2FE" distance={35} />
        <pointLight position={[15, 12, -10]} intensity={1.5} color="#9055FF" distance={35} />

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
            maxDistance={90}
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
        <div className="pointer-events-auto flex items-center gap-2 bg-surface-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-surface-border shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-glow animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-300">
            IITB-NC-01
          </span>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedFloorId('all')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                selectedFloorId === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setSelectedFloorId(1)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                selectedFloorId === 1
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              L1 (Ground)
            </button>
            <button
              onClick={() => setSelectedFloorId(2)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                selectedFloorId === 2
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              L2 (Upper)
            </button>
          </div>
        </div>

        {/* Right: Camera Mode & View Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-surface-card/90 backdrop-blur-md p-1 rounded-lg border border-surface-border shadow-lg">
          {/* 3D Orbit vs Top-Down Floorplan */}
          <button
            onClick={() => {
              setViewMode(viewMode === 'floorplan' ? 'explore' : 'floorplan');
              setControlsMode('orbit');
            }}
            title="Toggle Top-Down Floorplan"
            className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 ${
              viewMode === 'floorplan'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">2D / 3D</span>
          </button>

          {/* First Person Roaming Mode */}
          <button
            onClick={() => {
              setControlsMode(controlsMode === 'firstPerson' ? 'orbit' : 'firstPerson');
              if (controlsMode === 'orbit') setViewMode('explore');
            }}
            title="First-Person Roaming (WASD + Mouse)"
            className={`p-1.5 rounded transition-colors text-xs flex items-center gap-1 ${
              controlsMode === 'firstPerson'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">FPS Walk</span>
          </button>

          {/* Reset View */}
          <button
            onClick={resetCamera}
            title="Reset Camera View"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title="Fullscreen Toggle"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BOTTOM-LEFT: LAYER TOGGLE BADGES */}
      <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2 pointer-events-auto z-10">
        <button
          onClick={() => setShowPoiLabels(!showPoiLabels)}
          className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium border flex items-center gap-1.5 transition-all backdrop-blur-md ${
            showPoiLabels
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
              : 'bg-surface-card/80 border-surface-border text-slate-500 hover:text-slate-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          POIs
        </button>

        <button
          onClick={() => setShowNavigationPath(!showNavigationPath)}
          className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium border flex items-center gap-1.5 transition-all backdrop-blur-md ${
            showNavigationPath
              ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
              : 'bg-surface-card/80 border-surface-border text-slate-500 hover:text-slate-300'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          Route Path
        </button>

        <button
          onClick={() => setShowObstacles(!showObstacles)}
          className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium border flex items-center gap-1.5 transition-all backdrop-blur-md ${
            showObstacles
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : 'bg-surface-card/80 border-surface-border text-slate-500 hover:text-slate-300'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Obstacles
        </button>

        <button
          onClick={() => setShowWalkableMesh(!showWalkableMesh)}
          className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium border flex items-center gap-1.5 transition-all backdrop-blur-md ${
            showWalkableMesh
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-surface-card/80 border-surface-border text-slate-500 hover:text-slate-300'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          NavMesh
        </button>
      </div>

      {/* BOTTOM-RIGHT TELEMETRY HUD */}
      <div className="absolute bottom-4 right-4 bg-surface-card/90 backdrop-blur-md px-3 py-2 rounded-lg border border-surface-border text-right text-[11px] font-mono text-slate-400 select-none pointer-events-none hidden sm:block z-10">
        <div className="flex items-center justify-end gap-2 text-cyan-300 font-semibold mb-0.5">
          <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          <span>NE 042°</span>
        </div>
        <div>LATENCY: 12ms | 60 FPS</div>
        <div>
          ACTIVE ROUTE: {activeRoute?.success ? `${activeRoute.total_distance_meters}m` : 'STANDBY'}
        </div>
      </div>

      {/* FIRST PERSON CROSSHAIR & HELPER TEXT */}
      {controlsMode === 'firstPerson' && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-20">
          <div className="w-4 h-4 border border-cyan-400/80 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-cyan-400 rounded-full" />
          </div>
          <div className="mt-4 bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-lg">
            Click Canvas to Lock Mouse • WASD to Walk • SHIFT to Run • ESC to Release
          </div>
        </div>
      )}
    </div>
  );
};
