import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

export const HomeApartmentMesh: React.FC = () => {
  const { showObstacles, building } = useAppStore();
  const robotRef = useRef<THREE.Group>(null);
  const strobeRef = useRef<THREE.PointLight>(null);

  // Subtle hovering/cleaning animation for robot vacuum
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (robotRef.current) {
      robotRef.current.position.x = Math.sin(t * 0.8) * 0.4;
      robotRef.current.position.z = 3.0 + Math.cos(t * 0.8) * 0.2;
    }
    if (strobeRef.current) {
      strobeRef.current.intensity = Math.sin(t * 12) > 0 ? 2.5 : 0.2;
    }
  });

  return (
    <group name="HomeApartmentComplex">
      {/* ================================================================ */}
      {/* APARTMENT FLOOR SLAB & TEXTURED TILES */}
      {/* ================================================================ */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[32, 0.3, 30]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Grid Floor Lines */}
      <gridHelper args={[32, 32, '#00C8FF', '#1E293B']} position={[0, 0.015, 0]} />

      {/* ================================================================ */}
      {/* EXTERIOR BOUNDARY WALLS */}
      {/* ================================================================ */}
      {/* South Wall (Front Entrance with door opening) */}
      <mesh position={[-7, 1.6, 14]}>
        <boxGeometry args={[14, 3.2, 0.3]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} />
      </mesh>
      <mesh position={[7, 1.6, 14]}>
        <boxGeometry args={[14, 3.2, 0.3]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} />
      </mesh>
      {/* North Wall */}
      <mesh position={[0, 1.6, -14]}>
        <boxGeometry args={[30, 3.2, 0.3]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} />
      </mesh>
      {/* West Wall */}
      <mesh position={[-15, 1.6, 0]}>
        <boxGeometry args={[0.3, 3.2, 28]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} />
      </mesh>
      {/* East Wall */}
      <mesh position={[15, 1.6, 0]}>
        <boxGeometry args={[0.3, 3.2, 28]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} />
      </mesh>

      {/* ================================================================ */}
      {/* ROOM 1: LIVING ROOM & DINING AREA (Center Front) */}
      {/* ================================================================ */}
      <group position={[0, 0, 6]}>
        {/* Soft Contemporary Sofa */}
        <group position={[0, 0.45, 8.5]}>
          <mesh castShadow>
            <boxGeometry args={[5.2, 0.7, 1.8]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.65, 0.7]}>
            <boxGeometry args={[5.2, 0.8, 0.4]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
        </group>

        {/* Coffee Table */}
        <mesh position={[0, 0.3, 6.2]} castShadow>
          <boxGeometry args={[3.2, 0.4, 1.4]} />
          <meshStandardMaterial color="#0F172A" metalness={0.7} roughness={0.2} />
        </mesh>

        {/* Entertainment TV Console on Partition Wall */}
        <group position={[0, 1.4, 2.2]}>
          <mesh>
            <boxGeometry args={[4.2, 2.2, 0.1]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          {/* Glowing OLED TV Display */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[3.8, 1.8]} />
            <meshBasicMaterial color="#00F2FE" />
          </mesh>
        </group>
      </group>

      {/* ================================================================ */}
      {/* ROOM 2: MASTER BEDROOM (East Wing) */}
      {/* ================================================================ */}
      <group position={[10, 0, -3]}>
        {/* Partition Wall separating Bedroom */}
        <mesh position={[-4, 1.6, 0]}>
          <boxGeometry args={[0.3, 3.2, 10]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>

        {/* King Bed */}
        <group position={[0, 0.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.6, 0.6, 4.2]} />
            <meshStandardMaterial color="#475569" roughness={0.7} />
          </mesh>
          {/* Headboard */}
          <mesh position={[0, 0.8, -2.0]}>
            <boxGeometry args={[3.8, 1.2, 0.3]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          {/* Pillows */}
          <mesh position={[-0.9, 0.45, -1.4]}>
            <boxGeometry args={[1.2, 0.2, 0.8]} />
            <meshStandardMaterial color="#F8FAFC" />
          </mesh>
          <mesh position={[0.9, 0.45, -1.4]}>
            <boxGeometry args={[1.2, 0.2, 0.8]} />
            <meshStandardMaterial color="#F8FAFC" />
          </mesh>
        </group>

        {/* Nightstand with Warm Lamp */}
        <group position={[-2.4, 0.35, -1.9]}>
          <mesh>
            <boxGeometry args={[0.8, 0.7, 0.8]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <pointLight position={[0, 0.7, 0]} color="#FDE047" intensity={1.2} distance={5} />
        </group>
      </group>

      {/* ================================================================ */}
      {/* ROOM 3: HOME OFFICE / STUDY (North Center) */}
      {/* ================================================================ */}
      <group position={[0, 0, -5]}>
        {/* Partition Wall */}
        <mesh position={[-3.5, 1.6, 0]}>
          <boxGeometry args={[0.3, 3.2, 8]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        {/* Executive Standing Desk */}
        <mesh position={[0, 0.45, -1]} castShadow>
          <boxGeometry args={[3.2, 0.8, 1.4]} />
          <meshStandardMaterial color="#334155" roughness={0.3} />
        </mesh>
        {/* Dual Curved Displays */}
        <mesh position={[0, 1.25, -1]}>
          <boxGeometry args={[1.8, 0.6, 0.1]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
        {/* Office Chair */}
        <mesh position={[0, 0.5, 0.4]}>
          <cylinderGeometry args={[0.4, 0.4, 0.8, 16]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
      </group>

      {/* ================================================================ */}
      {/* ROOM 4: MODULAR KITCHEN (West Wing) */}
      {/* ================================================================ */}
      <group position={[-8, 0, -3]}>
        {/* Island Counter */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[4.5, 1.0, 1.6]} />
          <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.6} />
        </mesh>
        {/* Refrigerator */}
        <mesh position={[-5.5, 1.2, -2.5]}>
          <boxGeometry args={[1.4, 2.4, 1.2]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ================================================================ */}
      {/* ROOM 5: ENSUITE WASHROOM (East Front) */}
      {/* ================================================================ */}
      <group position={[11, 0, 7]}>
        {/* Frosted Glass Wall */}
        <mesh position={[-3, 1.6, 0]}>
          <boxGeometry args={[0.2, 3.2, 6]} />
          <meshPhysicalMaterial color="#38BDF8" transparent opacity={0.3} roughness={0.1} />
        </mesh>
        {/* Vanity Counter */}
        <mesh position={[1, 0.45, 0]}>
          <boxGeometry args={[2.0, 0.9, 1.2]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.1} />
        </mesh>
      </group>

      {/* ================================================================ */}
      {/* ROOM 6: BALCONY TERRACE (North Balcony) */}
      {/* ================================================================ */}
      <group position={[0, 0, -11]}>
        {/* Balcony Railing (Glass & Steel) */}
        <mesh position={[0, 0.6, -2.5]}>
          <boxGeometry args={[7, 1.2, 0.1]} />
          <meshPhysicalMaterial color="#00C8FF" transparent opacity={0.4} roughness={0.05} />
        </mesh>
        <mesh position={[-3.5, 0.6, 0]}>
          <boxGeometry args={[0.1, 1.2, 5]} />
          <meshPhysicalMaterial color="#00C8FF" transparent opacity={0.4} roughness={0.05} />
        </mesh>
        <mesh position={[3.5, 0.6, 0]}>
          <boxGeometry args={[0.1, 1.2, 5]} />
          <meshPhysicalMaterial color="#00C8FF" transparent opacity={0.4} roughness={0.05} />
        </mesh>
      </group>

      {/* ================================================================ */}
      {/* DYNAMIC OBSTACLE: ROBOT VACUUM CLEANER */}
      {/* ================================================================ */}
      {showObstacles && (
        <group ref={robotRef} position={[0, 0.15, 3]}>
          {/* Main Disc Body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.55, 0.55, 0.22, 32]} />
            <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Top LiDAR Puck */}
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.1, 24]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          {/* Pulsing Warning Strobe */}
          <mesh position={[0, 0.24, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>
          <pointLight ref={strobeRef} position={[0, 0.4, 0]} color="#F59E0B" distance={4} />
          {/* Safety Hazard Ring on Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
            <ringGeometry args={[0.7, 0.85, 32]} />
            <meshBasicMaterial color="#F59E0B" transparent opacity={0.6} />
          </mesh>
        </group>
      )}
    </group>
  );
};
