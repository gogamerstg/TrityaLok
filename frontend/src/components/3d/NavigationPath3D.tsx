import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

export const NavigationPath3D: React.FC = () => {
  const { activeRoute, showNavigationPath, selectedFloorId } = useAppStore();
  const pulseSphereRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    if (!activeRoute || !activeRoute.success || activeRoute.path_coordinates.length < 2) {
      return [];
    }
    return activeRoute.path_coordinates.map(
      (c) => new THREE.Vector3(c.x, c.y + 0.18, c.z)
    );
  }, [activeRoute]);

  const curve = useMemo(() => {
    if (points.length < 2) return null;
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.15);
  }, [points]);

  const tubeGeometry = useMemo(() => {
    if (!curve) return null;
    return new THREE.TubeGeometry(curve, points.length * 12, 0.12, 8, false);
  }, [curve]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (curve && pulseSphereRef.current) {
      // Loop moving light along curve
      const loopTime = 4.0;
      const progress = (t % loopTime) / loopTime;
      const pos = curve.getPointAt(progress);
      pulseSphereRef.current.position.copy(pos);
    }

    if (beaconRef.current) {
      beaconRef.current.rotation.y = t * 2.0;
    }
  });

  if (!showNavigationPath || !activeRoute || !activeRoute.success || points.length < 2) {
    return null;
  }

  const destinationPoint = points[points.length - 1];
  const startPoint = points[0];

  return (
    <group name="NavigationPathLayer">
      {/* 3D Glowing Path Tube */}
      {tubeGeometry && (
        <mesh geometry={tubeGeometry}>
          <meshStandardMaterial
            color="#00F2FE"
            emissive="#00C8FF"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.5}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}

      {/* Moving Pulsing Orb along the spline */}
      {curve && (
        <mesh ref={pulseSphereRef}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
          <pointLight color="#00F2FE" intensity={3} distance={5} />
        </mesh>
      )}

      {/* Turn Waypoint Dots */}
      {points.map((pt, idx) => (
        <mesh key={`waypoint_${idx}`} position={[pt.x, pt.y, pt.z]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 16]} />
          <meshBasicMaterial
            color={idx === 0 ? '#10B981' : idx === points.length - 1 ? '#00F2FE' : '#9055FF'}
          />
        </mesh>
      ))}

      {/* Start Location Beacon */}
      <group position={[startPoint.x, startPoint.y, startPoint.z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.65, 24]} />
          <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 1.2, 12]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Destination Target Beacon (Pulsing concentric holographic beacon) */}
      <group
        ref={beaconRef}
        position={[destinationPoint.x, destinationPoint.y, destinationPoint.z]}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.1, 32]} />
          <meshBasicMaterial color="#00F2FE" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.5, 32]} />
          <meshBasicMaterial color="#7928CA" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.02, 0.8, 2.4, 16, 1, true]} />
          <meshBasicMaterial
            color="#00F2FE"
            side={THREE.DoubleSide}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
};
