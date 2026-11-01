import React, { useRef, useEffect, useState, Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Maximize2,
  RotateCcw,
  Upload,
  Eye,
  Footprints,
  Loader2,
  Layers,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { BuildingMesh } from './BuildingMesh';

/* ── Error Boundary to prevent 3D Canvas crash ── */
interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
  onError?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('3D Scan model load issue; falling back to Procedural Twin CAD:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError();
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/* ── Prebuilt GLB Model Loader ── */
const PrebuiltModel: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Auto-center and auto-scale the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 20 / maxDim; // normalize to ~20 units
    scene.scale.setScalar(scale);
    scene.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
  }, [scene]);

  return <primitive ref={ref} object={scene} />;
};

/* ── Loading Fallback ── */
const LoadingFallback = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3 text-cyan-400 bg-[#0B0F19]/90 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-cyan-500/40 shadow-2xl">
      <Loader2 className="w-8 h-8 animate-spin" />
      <span className="text-xs font-mono font-bold tracking-wider">Loading TrityaLok 3D Scan...</span>
    </div>
  </Html>
);

/* ── WASD & Touch First Person Walk Controller ── */
interface WalkControlsProps {
  enabled: boolean;
  touchState: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
  };
}

const WalkControls: React.FC<WalkControlsProps> = ({ enabled, touchState }) => {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const speed = 0.25;

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => { keys.current[e.code] = true; };
    const onUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  useFrame(() => {
    if (!enabled) return;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    const right = new THREE.Vector3().crossVectors(direction, camera.up).normalize();

    const isForward = keys.current['KeyW'] || keys.current['ArrowUp'] || touchState.forward;
    const isBackward = keys.current['KeyS'] || keys.current['ArrowDown'] || touchState.backward;
    const isLeft = keys.current['KeyA'] || keys.current['ArrowLeft'] || touchState.left;
    const isRight = keys.current['KeyD'] || keys.current['ArrowRight'] || touchState.right;

    if (isForward) camera.position.addScaledVector(direction, speed);
    if (isBackward) camera.position.addScaledVector(direction, -speed);
    if (isLeft) camera.position.addScaledVector(right, -speed);
    if (isRight) camera.position.addScaledVector(right, speed);
  });

  return null;
};

/* ── Camera Auto-Fit ── */
const CameraSetup: React.FC = () => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(15, 12, 20);
    camera.lookAt(0, 2, 0);
  }, [camera]);
  return null;
};

/* ══════════════════════════════════════════════════════
   MAIN SPACE VIEWER
══════════════════════════════════════════════════════ */
export const SpaceViewer: React.FC<{ height?: string }> = ({ height = '100%' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { building } = useAppStore();

  // Model Source: 'scan' (26.5MB GLB) or 'cad' (Instant Procedural Mesh)
  const [modelType, setModelType] = useState<'scan' | 'cad'>('scan');
  const [modelUrl, setModelUrl] = useState<string>('/models/trityalok_scan.glb');
  const [walkMode, setWalkMode] = useState(false);
  const [hasScanError, setHasScanError] = useState(false);

  // Touch Virtual D-Pad state
  const [touchState, setTouchState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setModelUrl(url);
    setModelType('scan');
    setHasScanError(false);
  };

  const resetCamera = () => {
    if (orbitRef.current) {
      orbitRef.current.reset();
      orbitRef.current.target.set(0, 2, 0);
    }
    setWalkMode(false);
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
      {/* Hidden file input for custom GLB upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".glb,.gltf"
        className="hidden"
      />

      <Canvas
        shadows
        camera={{ position: [15, 12, 20], fov: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <color attach="background" args={['#070A0F']} />
        <fog attach="fog" args={['#070A0F', 50, 120]} />

        {/* Lighting Setup */}
        <ambientLight intensity={0.8} color="#D1D5DB" />
        <directionalLight position={[30, 45, 25]} intensity={1.5} color="#F8FAFC" castShadow />
        <pointLight position={[-15, 12, 10]} intensity={1.5} color="#00F2FE" distance={45} />
        <pointLight position={[15, 12, -10]} intensity={1.5} color="#9055FF" distance={45} />

        <CameraSetup />

        {/* Orbit controls when not walking */}
        {!walkMode && (
          <OrbitControls
            ref={orbitRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={2}
            maxDistance={100}
            target={[0, 2, 0]}
          />
        )}

        {/* WASD & Touch walk mode */}
        <WalkControls enabled={walkMode} touchState={touchState} />

        {/* Ground plane & grid */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#0A0F1D" roughness={0.8} />
        </mesh>
        <gridHelper args={[100, 50, '#00C8FF', '#1E293B']} position={[0, 0.01, 0]} />

        {/* 3D Model Rendering with Error Boundary Fallback */}
        <ModelErrorBoundary
          fallback={<BuildingMesh />}
          onError={() => {
            setHasScanError(true);
            setModelType('cad');
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            {modelType === 'scan' && !hasScanError ? (
              <PrebuiltModel url={modelUrl} />
            ) : (
              <BuildingMesh />
            )}
          </Suspense>
        </ModelErrorBoundary>
      </Canvas>

      {/* ── TOP LEFT HUD ── */}
      <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#0B0F19]/90 backdrop-blur-2xl px-3.5 py-2 rounded-2xl border border-[#1F293D] shadow-2xl pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-cyan-glow" />
          <span className="text-xs font-mono font-bold text-slate-200">
            {modelType === 'scan' ? '3D Scan Mesh' : 'Digital Twin CAD'} • {building.name}
          </span>
        </div>
      </div>

      {/* ── TOP RIGHT CONTROLS ── */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <div className="flex items-center gap-1.5 bg-[#0B0F19]/90 backdrop-blur-2xl p-1.5 rounded-2xl border border-[#1F293D] shadow-2xl">
          {/* Model Type Selector Toggle */}
          <button
            onClick={() => setModelType(modelType === 'scan' ? 'cad' : 'scan')}
            title="Toggle between Photogrammetric Mesh and Procedural CAD Twin"
            className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold text-slate-300 hover:text-cyan-300 hover:bg-[#172033] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">
              {modelType === 'scan' ? 'Scan Mesh' : 'CAD Twin'}
            </span>
          </button>

          <div className="w-[1px] h-5 bg-[#1F293D] mx-0.5" />

          {/* Walk / Orbit toggle */}
          <button
            onClick={() => setWalkMode(!walkMode)}
            title={walkMode ? 'Switch to Orbit Controls' : 'Switch to First-Person Roaming'}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              walkMode
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
                : 'text-slate-400 hover:text-white hover:bg-[#172033]'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span className="hidden sm:inline">{walkMode ? 'Free-Roaming' : 'Orbit'}</span>
          </button>

          <button
            onClick={resetCamera}
            title="Reset View"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#172033] transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            title="Fullscreen"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#172033] transition-all cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Load Custom GLB */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload Custom .GLB 3D Scan"
            className="p-2 rounded-xl text-slate-500 hover:text-cyan-300 hover:bg-[#172033] transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── WALK MODE INSTRUCTIONS BANNER ── */}
      {walkMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-[#0B0F19]/90 backdrop-blur-2xl px-4 py-2 rounded-2xl border border-cyan-500/40 shadow-2xl z-10 pointer-events-none">
          <span className="text-[11px] sm:text-xs font-mono text-cyan-300 font-bold">
            WASD / Arrow Keys or Virtual D-Pad to walk • Mouse / Swipe to look
          </span>
        </div>
      )}

      {/* ── VIRTUAL TOUCH D-PAD FOR MOBILE / TOUCH SCREENS ── */}
      {walkMode && (
        <div className="absolute bottom-20 left-6 z-30 md:hidden select-none">
          <div className="relative w-32 h-32 rounded-full bg-[#0B0F19]/80 backdrop-blur-xl border border-cyan-500/30 p-2 shadow-2xl">
            {/* Forward Button */}
            <button
              onMouseDown={() => setTouchState((prev) => ({ ...prev, forward: true }))}
              onMouseUp={() => setTouchState((prev) => ({ ...prev, forward: false }))}
              onTouchStart={() => setTouchState((prev) => ({ ...prev, forward: true }))}
              onTouchEnd={() => setTouchState((prev) => ({ ...prev, forward: false }))}
              className="absolute top-1 left-1/2 -translate-x-1/2 w-9 h-9 rounded-xl bg-cyan-500/20 active:bg-cyan-500/40 text-cyan-300 border border-cyan-500/40 flex items-center justify-center cursor-pointer shadow-cyan-glow"
              aria-label="Walk Forward"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            {/* Backward Button */}
            <button
              onMouseDown={() => setTouchState((prev) => ({ ...prev, backward: true }))}
              onMouseUp={() => setTouchState((prev) => ({ ...prev, backward: false }))}
              onTouchStart={() => setTouchState((prev) => ({ ...prev, backward: true }))}
              onTouchEnd={() => setTouchState((prev) => ({ ...prev, backward: false }))}
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-9 h-9 rounded-xl bg-cyan-500/20 active:bg-cyan-500/40 text-cyan-300 border border-cyan-500/40 flex items-center justify-center cursor-pointer shadow-cyan-glow"
              aria-label="Walk Backward"
            >
              <ChevronDown className="w-5 h-5" />
            </button>

            {/* Left Button */}
            <button
              onMouseDown={() => setTouchState((prev) => ({ ...prev, left: true }))}
              onMouseUp={() => setTouchState((prev) => ({ ...prev, left: false }))}
              onTouchStart={() => setTouchState((prev) => ({ ...prev, left: true }))}
              onTouchEnd={() => setTouchState((prev) => ({ ...prev, left: false }))}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-cyan-500/20 active:bg-cyan-500/40 text-cyan-300 border border-cyan-500/40 flex items-center justify-center cursor-pointer shadow-cyan-glow"
              aria-label="Strafe Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Button */}
            <button
              onMouseDown={() => setTouchState((prev) => ({ ...prev, right: true }))}
              onMouseUp={() => setTouchState((prev) => ({ ...prev, right: false }))}
              onTouchStart={() => setTouchState((prev) => ({ ...prev, right: true }))}
              onTouchEnd={() => setTouchState((prev) => ({ ...prev, right: false }))}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-cyan-500/20 active:bg-cyan-500/40 text-cyan-300 border border-cyan-500/40 flex items-center justify-center cursor-pointer shadow-cyan-glow"
              aria-label="Strafe Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Center Eye */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Eye className="w-3 h-3 text-cyan-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
