import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

export const SpatialOverlays3D: React.FC = () => {
  const {
    building,
    selectedFloorId,
    showWalkableMesh,
    showObstacleHeatmap,
    showScannerCoverage,
  } = useAppStore();

  // 1. Walkable Mesh Lines
  const walkableLines = useMemo(() => {
    if (!showWalkableMesh) return null;
    const positions: number[] = [];
    const nodeMap = new Map(building.nodes.map((n) => [n.id, n]));

    for (const edge of building.edges) {
      if (selectedFloorId !== 'all' && edge.floor_id !== selectedFloorId) continue;
      const u = nodeMap.get(edge.source_node_id);
      const v = nodeMap.get(edge.target_node_id);
      if (u && v && !edge.is_blocked) {
        positions.push(u.coordinates.x, u.coordinates.y + 0.08, u.coordinates.z);
        positions.push(v.coordinates.x, v.coordinates.y + 0.08, v.coordinates.z);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [building, selectedFloorId, showWalkableMesh]);

  // 2. Synthetic Scanner Coverage Point-Cloud (Sample photogrammetry capture density)
  const coveragePoints = useMemo(() => {
    if (!showScannerCoverage) return null;
    const count = 3500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const floor = i % 2 === 0 ? 0 : 4.0;
      if (selectedFloorId !== 'all') {
        if (selectedFloorId === 1 && floor !== 0) continue;
        if (selectedFloorId === 2 && floor === 0) continue;
      }

      const x = (Math.random() - 0.5) * 56;
      const z = (Math.random() - 0.5) * 44;
      const y = floor + Math.random() * 2.8;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Quality rating: green (high density), cyan (good), amber (sparse)
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter < 18) {
        // High density
        colors[i * 3] = 0.06;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.6;
      } else if (distFromCenter < 28) {
        // Medium density
        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 0.78;
        colors[i * 3 + 2] = 1.0;
      } else {
        // Low density / border
        colors[i * 3] = 0.96;
        colors[i * 3 + 1] = 0.62;
        colors[i * 3 + 2] = 0.1;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [selectedFloorId, showScannerCoverage]);

  return (
    <group name="SpatialOverlaysLayer">
      {/* Walkable Mesh Wireframe Overlay */}
      {showWalkableMesh && walkableLines && (
        <lineSegments geometry={walkableLines}>
          <lineBasicMaterial color="#38EF7D" linewidth={2} transparent opacity={0.6} />
        </lineSegments>
      )}

      {/* Obstacle Danger Heatmap Disks */}
      {showObstacleHeatmap &&
        building.obstacles.map((obs) => {
          if (!obs.active) return null;
          return (
            <group
              key={`heatmap_${obs.id}`}
              position={[obs.coordinates.x, obs.coordinates.y + 0.04, obs.coordinates.z]}
            >
              {/* Inner Danger Zone */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.2, 2.5, 32]} />
                <meshBasicMaterial
                  color="#EF4444"
                  transparent
                  opacity={0.65}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Outer Caution Zone */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2.5, 4.8, 32]} />
                <meshBasicMaterial
                  color="#F59E0B"
                  transparent
                  opacity={0.3}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          );
        })}

      {/* Scanner Coverage Points */}
      {showScannerCoverage && coveragePoints && (
        <points geometry={coveragePoints}>
          <pointsMaterial
            size={0.12}
            vertexColors
            transparent
            opacity={0.7}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
};
