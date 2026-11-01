import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Maximize2,
  RotateCcw,
  Upload,
  Eye,
  Footprints,
  Loader2
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

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
    <div className="flex flex-col items-center gap-3 text-cyan-400">
      <Loader2 className="w-10 h-10 animate-spin" />
      <span className="text-xs font-mono font-bold">Loading 3D Scan...</span>
    </div>
  </Html>
);

/* ── WASD First Person Walk Controller ── */
const WalkControls: React.FC<{ enabled: boolean }> = ({ enabled }) => {
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

    if (keys.current['KeyW'] || keys.current['ArrowUp']) camera.position.addScaledVector(direction, speed);
    if (keys.current['KeyS'] || keys.current['ArrowDown']) camera.position.addScaledVector(direction, -speed);
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) camera.position.addScaledVector(right, -speed);
    if (keys.current['KeyD'] || keys.current['ArrowRight']) camera.position.addScaledVector(right, speed);
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

  // Default: load the prebuilt scan from public/models/
  const [modelUrl, setModelUrl] = useState<string>('/models/trityalok_scan.glb');
  const [walkMode, setWalkMode] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setModelUrl(url);
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
      {/* Hidden file input for swapping GLB */}
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

        {/* Lighting */}
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

        {/* WASD walk mode */}
        <WalkControls enabled={walkMode} />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#0A0F1D" roughness={0.8} />
        </mesh>
        <gridHelper args={[100, 50, '#00C8FF', '#1E293B']} position={[0, 0.01, 0]} />

        {/* The actual 3D scan model */}
        <Suspense fallback={<LoadingFallback />}>
          <PrebuiltModel url={modelUrl} />
        </Suspense>
      </Canvas>

      {/* ── TOP LEFT HUD ── */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <div className="flex items-center gap-2 bg-[#0B0F19]/90 backdrop-blur-2xl px-3.5 py-2 rounded-2xl border border-[#1F293D] shadow-2xl">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-200">
            TrityaLok 3D Scan • {building.name}
          </span>
        </div>
      </div>

      {/* ── TOP RIGHT CONTROLS ── */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <div className="flex items-center gap-1.5 bg-[#0B0F19]/90 backdrop-blur-2xl p-1.5 rounded-2xl border border-[#1F293D] shadow-2xl">
          {/* Walk / Orbit toggle */}
          <button
            onClick={() => setWalkMode(!walkMode)}
            title={walkMode ? 'Switch to Orbit' : 'Switch to Walk (WASD)'}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              walkMode
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white hover:bg-[#172033]'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span className="hidden sm:inline">{walkMode ? 'Walking' : 'Walk'}</span>
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

          {/* Hidden upload - only shows small icon */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Load Different 3D Model"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-400 hover:bg-[#172033] transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Walk mode instructions */}
      {walkMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0B0F19]/90 backdrop-blur-2xl px-5 py-2.5 rounded-2xl border border-cyan-500/40 shadow-2xl z-10">
          <span className="text-xs font-mono text-cyan-300 font-bold">
            WASD / Arrow Keys to walk • Mouse to look around • Click Walk button to exit
          </span>
        </div>
      )}
    </div>
  );
};
