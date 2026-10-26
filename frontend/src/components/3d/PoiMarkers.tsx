import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { POI, POICategory } from '../../types';

const CATEGORY_COLORS: Record<POICategory, string> = {
  Laboratory: '#00C8FF',
  Classroom: '#9055FF',
  Reception: '#00F2FE',
  'Faculty Room': '#B794F4',
  Washroom: '#06B6D4',
  Elevator: '#10B981',
  Staircase: '#F59E0B',
  Entrance: '#10B981',
  'Emergency Exit': '#EF4444',
  Cafeteria: '#F59E0B',
  'Study Area': '#63B3ED',
};

interface SinglePoiMarkerProps {
  poi: POI;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  showLabels: boolean;
}

const SinglePoiMarker: React.FC<SinglePoiMarkerProps> = ({
  poi,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  showLabels,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const color = CATEGORY_COLORS[poi.category] || '#00F2FE';

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating hover animation
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = poi.coordinates.y + 1.8 + Math.sin(t * 2.5 + poi.coordinates.x) * 0.15;
      meshRef.current.rotation.y = t * 1.2;
    }
  });

  const scale = isSelected ? 1.4 : isHovered ? 1.2 : 1.0;

  return (
    <group position={[poi.coordinates.x, 0, poi.coordinates.z]}>
      {/* Ground Projection Ring */}
      <mesh
        position={[0, poi.coordinates.y + 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.5, 0.7, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.9 : 0.4}
        />
      </mesh>

      {/* Floating Hologram Pin */}
      <group
        ref={meshRef}
        scale={[scale, scale, scale]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Diamond Core */}
        <mesh>
          <octahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isSelected ? 0.8 : 0.4}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Orbiting Halo Ring */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[0.6, 0.68, 24]} />
          <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* HTML Holographic Label Tag */}
      {showLabels && (
        <Html
          position={[0, poi.coordinates.y + 2.8, 0]}
          center
          distanceFactor={32}
          style={{ pointerEvents: 'auto' }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`cursor-pointer px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap backdrop-blur-md transition-all duration-200 border flex items-center gap-1.5 select-none shadow-lg ${
              isSelected
                ? 'bg-cyan-500/90 text-black border-cyan-300 scale-110 shadow-cyan-500/50'
                : isHovered
                ? 'bg-slate-900/90 text-cyan-300 border-cyan-400 scale-105'
                : 'bg-slate-950/80 text-slate-200 border-white/20 hover:border-cyan-400'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: color }}
            />
            <span>{poi.name}</span>
            {poi.room_number && (
              <span className="text-[10px] px-1 py-0.5 rounded bg-white/10 text-slate-300">
                {poi.room_number}
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

export const PoiMarkers: React.FC = () => {
  const {
    building,
    selectedFloorId,
    selectedPoi,
    setSelectedPoi,
    hoveredPoi,
    setHoveredPoi,
    showPoiLabels,
  } = useAppStore();

  const visiblePois = building.pois.filter((poi) => {
    if (selectedFloorId === 'all') return true;
    return poi.floor_id === selectedFloorId;
  });

  return (
    <group name="PoiMarkersLayer">
      {visiblePois.map((poi) => (
        <SinglePoiMarker
          key={poi.id}
          poi={poi}
          isSelected={selectedPoi?.id === poi.id}
          isHovered={hoveredPoi?.id === poi.id}
          onSelect={() => setSelectedPoi(poi)}
          onHover={(hovered) => setHoveredPoi(hovered ? poi : null)}
          showLabels={showPoiLabels}
        />
      ))}
    </group>
  );
};
