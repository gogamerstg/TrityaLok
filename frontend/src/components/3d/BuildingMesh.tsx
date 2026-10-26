import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

export const BuildingMesh: React.FC = () => {
  const { building, selectedFloorId, showObstacles } = useAppStore();

  const isF1Visible = selectedFloorId === 'all' || selectedFloorId === 1;
  const isF2Visible = selectedFloorId === 'all' || selectedFloorId === 2;
  const isF2Ghost = selectedFloorId === 1;

  // Server rack blinking lights animation
  const serverLightRef1 = useRef<THREE.PointLight>(null);
  const serverLightRef2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (serverLightRef1.current) {
      serverLightRef1.current.intensity = Math.sin(t * 8) > 0.2 ? 1.8 : 0.4;
    }
    if (serverLightRef2.current) {
      serverLightRef2.current.intensity = Math.cos(t * 10) > 0 ? 1.8 : 0.3;
    }
  });

  return (
    <group name="BuildingComplex">
      {/* ================================================================ */}
      {/* GROUND LEVEL (FLOOR 1) */}
      {/* ================================================================ */}
      <group name="Floor1_Group" visible={isF1Visible}>
        {/* Main Floor Slab (High-tech dark polished terrazzo) */}
        <mesh position={[0, -0.15, 0]} receiveShadow>
          <boxGeometry args={[66, 0.3, 54]} />
          <meshStandardMaterial
            color="#0A0F1D"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>

        {/* Polished Floor Grid Lines */}
        <gridHelper
          args={[64, 32, '#00C8FF', '#1E293B']}
          position={[0, 0.015, 0]}
        />

        {/* Neon Floor Guide Tracks (Corridor glowing centerlines) */}
        {/* Main North-South Corridor Line */}
        <mesh position={[0, 0.02, 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 38]} />
          <meshBasicMaterial color="#00F2FE" transparent opacity={0.25} />
        </mesh>
        {/* East-West Central Hallway Line */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[44, 0.3]} />
          <meshBasicMaterial color="#00F2FE" transparent opacity={0.25} />
        </mesh>

        {/* Grand Central Atrium Floor Feature Ring */}
        <group position={[0, 0.02, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[6.5, 7.2, 48]} />
            <meshBasicMaterial color="#00F2FE" transparent opacity={0.5} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[4.0, 4.3, 36]} />
            <meshBasicMaterial color="#9055FF" transparent opacity={0.4} />
          </mesh>
          {/* Techfest Logo Compass Rose on Atrium Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.8, 4]} />
            <meshBasicMaterial color="#00C8FF" wireframe />
          </mesh>
        </group>

        {/* Outer Architectural Glass Curtain Walls (Ground Floor) */}
        {/* South Entrance Glass Façade */}
        <mesh position={[0, 2.0, 26]}>
          <boxGeometry args={[64, 4.0, 0.2]} />
          <meshPhysicalMaterial
            color="#00C8FF"
            transparent
            opacity={0.12}
            roughness={0.05}
            transmission={0.9}
            thickness={0.2}
          />
        </mesh>
        {/* North Wall */}
        <mesh position={[0, 2.0, -26]}>
          <boxGeometry args={[64, 4.0, 0.3]} />
          <meshStandardMaterial color="#0B132B" roughness={0.7} />
        </mesh>
        {/* East Exterior Wall */}
        <mesh position={[32, 2.0, 0]}>
          <boxGeometry args={[0.3, 4.0, 52]} />
          <meshStandardMaterial color="#0B132B" roughness={0.7} />
        </mesh>
        {/* West Exterior Wall */}
        <mesh position={[-32, 2.0, 0]}>
          <boxGeometry args={[0.3, 4.0, 52]} />
          <meshStandardMaterial color="#0B132B" roughness={0.7} />
        </mesh>

        {/* ========================================================== */}
        {/* ROOM 1: Main Reception & Visitor Hub (Z: 12 to 24) */}
        {/* ========================================================== */}
        <group position={[0, 0, 16]}>
          {/* Curved Reception Counter Desk */}
          <mesh position={[0, 0.6, -1]} castShadow receiveShadow>
            <boxGeometry args={[7.0, 1.2, 1.2]} />
            <meshStandardMaterial color="#0284C7" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Desk Top Glowing Slab */}
          <mesh position={[0, 1.22, -1]}>
            <boxGeometry args={[7.2, 0.06, 1.4]} />
            <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.3} roughness={0.1} />
          </mesh>
          {/* Digital Twin Kiosk Displays */}
          <group position={[-2.2, 1.6, -0.9]}>
            <mesh>
              <boxGeometry args={[1.2, 0.7, 0.08]} />
              <meshStandardMaterial color="#0B0F19" />
            </mesh>
            <mesh position={[0, 0, 0.045]}>
              <planeGeometry args={[1.15, 0.65]} />
              <meshBasicMaterial color="#00F2FE" />
            </mesh>
          </group>
          <group position={[2.2, 1.6, -0.9]}>
            <mesh>
              <boxGeometry args={[1.2, 0.7, 0.08]} />
              <meshStandardMaterial color="#0B0F19" />
            </mesh>
            <mesh position={[0, 0, 0.045]}>
              <planeGeometry args={[1.15, 0.65]} />
              <meshBasicMaterial color="#00F2FE" />
            </mesh>
          </group>
          {/* Visitor Lounge Sofas */}
          <mesh position={[-5, 0.4, 3]} castShadow>
            <boxGeometry args={[3.2, 0.8, 1.4]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>
          <mesh position={[5, 0.4, 3]} castShadow>
            <boxGeometry args={[3.2, 0.8, 1.4]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>
          {/* RFID Security Turnstiles at Main Entrance (Z=23) */}
          {[-2.5, -0.8, 0.8, 2.5].map((tx, idx) => (
            <mesh key={`turnstile_${idx}`} position={[tx, 0.5, 6]} castShadow>
              <boxGeometry args={[0.2, 1.0, 1.2]} />
              <meshStandardMaterial color="#38BDF8" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
        </group>

        {/* ========================================================== */}
        {/* ROOM 2: Robotics & Autonomous Systems Lab (West Wing F1) */}
        {/* ========================================================== */}
        <group position={[-20, 0, 0]}>
          {/* Room Boundaries & Partitions */}
          <mesh position={[0, 1.8, -10]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#111827" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.8, 10]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#111827" roughness={0.6} />
          </mesh>
          {/* Glass Wall Facing Central Hallway (with entrance door cutout at Z=0) */}
          <mesh position={[8, 1.8, -5.5]}>
            <boxGeometry args={[0.2, 3.6, 9]} />
            <meshPhysicalMaterial color="#10B981" transparent opacity={0.3} roughness={0.1} transmission={0.7} />
          </mesh>
          <mesh position={[8, 1.8, 5.5]}>
            <boxGeometry args={[0.2, 3.6, 9]} />
            <meshPhysicalMaterial color="#10B981" transparent opacity={0.3} roughness={0.1} transmission={0.7} />
          </mesh>
          {/* Robotics Workbench & Hardware Stations */}
          <mesh position={[-3, 0.5, -4]} castShadow>
            <boxGeometry args={[7, 1.0, 2.2]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[-3, 0.5, 4]} castShadow>
            <boxGeometry args={[7, 1.0, 2.2]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Quadrotor Indoor Flight Arena Cage (Holographic Wireframe) */}
          <mesh position={[2, 1.5, 0]}>
            <boxGeometry args={[6, 3.0, 6]} />
            <meshBasicMaterial color="#10B981" wireframe transparent opacity={0.4} />
          </mesh>
          {/* Mobile Robot Platform */}
          <mesh position={[2, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 0.4, 16]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* ========================================================== */}
        {/* ROOM 3: Aryabhata Seminar Auditorium (East Wing F1) */}
        {/* ========================================================== */}
        <group position={[20, 0, 0]}>
          <mesh position={[0, 1.8, -10]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#111827" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.8, 10]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#111827" roughness={0.6} />
          </mesh>
          {/* Glass Partition Facing Hallway */}
          <mesh position={[-8, 1.8, -5.5]}>
            <boxGeometry args={[0.2, 3.6, 9]} />
            <meshPhysicalMaterial color="#9055FF" transparent opacity={0.3} roughness={0.1} transmission={0.7} />
          </mesh>
          <mesh position={[-8, 1.8, 5.5]}>
            <boxGeometry args={[0.2, 3.6, 9]} />
            <meshPhysicalMaterial color="#9055FF" transparent opacity={0.3} roughness={0.1} transmission={0.7} />
          </mesh>
          {/* Tiered Seating Rows */}
          <mesh position={[1, 0.35, -4]} castShadow>
            <boxGeometry args={[9, 0.7, 1.6]} />
            <meshStandardMaterial color="#4C1D95" roughness={0.6} />
          </mesh>
          <mesh position={[1, 0.7, 0]} castShadow>
            <boxGeometry args={[9, 1.4, 1.6]} />
            <meshStandardMaterial color="#4C1D95" roughness={0.6} />
          </mesh>
          <mesh position={[1, 1.05, 4]} castShadow>
            <boxGeometry args={[9, 2.1, 1.6]} />
            <meshStandardMaterial color="#4C1D95" roughness={0.6} />
          </mesh>
          {/* Presentation Stage & Huge 4K Screen */}
          <mesh position={[-5, 0.3, 0]}>
            <boxGeometry args={[2.8, 0.6, 12]} />
            <meshStandardMaterial color="#1E1B4B" roughness={0.4} />
          </mesh>
          {/* Main Laser Projection Screen */}
          <mesh position={[-7.4, 2.1, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[8.5, 2.8]} />
            <meshBasicMaterial color="#8B5CF6" />
          </mesh>
          {/* Speaker Podium */}
          <mesh position={[-4.5, 0.9, -2]} castShadow>
            <boxGeometry args={[0.8, 1.2, 0.8]} />
            <meshStandardMaterial color="#6D28D9" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* ========================================================== */}
        {/* ROOM 4: Techfest Student Cafe (South-East F1) */}
        {/* ========================================================== */}
        <group position={[19, 0, 18]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[1.4, 1.4, 1.0, 24]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.6} />
          </mesh>
          {[-3.5, 3.5].map((cx, i) => (
            <mesh key={`cafe_tab_${i}`} position={[cx, 0.45, 0]} castShadow>
              <cylinderGeometry args={[1.0, 1.0, 0.9, 16]} />
              <meshStandardMaterial color="#B45309" roughness={0.3} />
            </mesh>
          ))}
          {/* Espresso Bar Back Wall */}
          <mesh position={[0, 1.8, 5.5]}>
            <boxGeometry args={[12, 3.6, 0.3]} />
            <meshStandardMaterial color="#78350F" roughness={0.6} />
          </mesh>
        </group>

        {/* ========================================================== */}
        {/* ROOM 5: Accessible Restrooms (South-West F1) */}
        {/* ========================================================== */}
        <group position={[-19, 0, 16]}>
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[14, 3.6, 8]} />
            <meshStandardMaterial color="#0E7490" roughness={0.8} />
          </mesh>
          {/* Restroom Door Entry Sign */}
          <mesh position={[7.1, 2.0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.5, 0.8]} />
            <meshBasicMaterial color="#06B6D4" />
          </mesh>
        </group>

        {/* Architectural Structural Columns (Ground Floor) */}
        {[
          [-8, -8], [8, -8],
          [-8, 0], [8, 0],
          [-8, 10], [8, 10],
          [0, -18], [0, 20]
        ].map(([cx, cz], idx) => (
          <group key={`f1_col_${idx}`} position={[cx, 1.8, cz]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.4, 0.4, 3.6, 24]} />
              <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.2} />
            </mesh>
            {/* Column Accent Light Ring */}
            <mesh position={[0, 1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.42, 0.48, 24]} />
              <meshBasicMaterial color="#00F2FE" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================================================================ */}
      {/* CENTRAL ELEVATOR TOWER (Connecting Floor 1 & Floor 2) */}
      {/* ================================================================ */}
      <group position={[0, 2.0, 6]}>
        {/* Transparent Glass Shaft */}
        <mesh>
          <boxGeometry args={[3.4, 4.6, 3.4]} />
          <meshPhysicalMaterial
            color="#00C8FF"
            transparent
            opacity={0.25}
            roughness={0.05}
            transmission={0.9}
            thickness={0.4}
          />
        </mesh>
        {/* Polished Stainless Steel Vertical Trusses */}
        {[
          [-1.65, -1.65], [1.65, -1.65],
          [-1.65, 1.65], [1.65, 1.65]
        ].map(([px, pz], idx) => (
          <mesh key={`elev_col_${idx}`} position={[px, 0, pz]}>
            <boxGeometry args={[0.18, 4.6, 0.18]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}
        {/* Elevator Cabin (Positions dynamically based on active level) */}
        <mesh position={[0, selectedFloorId === 2 ? 1.0 : -1.0, 0]} castShadow>
          <boxGeometry args={[2.7, 2.2, 2.7]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Glowing Interior Cabin Ceiling & Floor */}
        <mesh position={[0, selectedFloorId === 2 ? 2.05 : 0.05, 0]}>
          <boxGeometry args={[2.6, 0.05, 2.6]} />
          <meshBasicMaterial color="#00F2FE" />
        </mesh>
        <mesh position={[0, selectedFloorId === 2 ? -0.05 : -2.05, 0]}>
          <boxGeometry args={[2.6, 0.05, 2.6]} />
          <meshBasicMaterial color="#00F2FE" />
        </mesh>
      </group>

      {/* ================================================================ */}
      {/* GRAND ARCHITECTURAL STAIRCASE (Spanning F1 to F2 at Z = -12) */}
      {/* ================================================================ */}
      <group position={[0, 0, -12]}>
        {Array.from({ length: 18 }).map((_, stepIdx) => {
          const stepY = (stepIdx / 17) * 3.85;
          const stepZ = (stepIdx / 17) * 5.4 - 2.7;
          return (
            <mesh key={`stair_step_${stepIdx}`} position={[0, stepY, stepZ]} castShadow>
              <boxGeometry args={[3.8, 0.22, 0.38]} />
              <meshStandardMaterial
                color={stepIdx % 2 === 0 ? '#1E293B' : '#334155'}
                roughness={0.3}
                metalness={0.4}
              />
            </mesh>
          );
        })}
        {/* Floating Glass Handrails with Cyan Illumination */}
        <mesh position={[-1.95, 2.0, 0]} rotation={[Math.atan2(3.85, 5.4), 0, 0]}>
          <boxGeometry args={[0.08, 0.9, 6.6]} />
          <meshPhysicalMaterial color="#00F2FE" transparent opacity={0.4} roughness={0.1} />
        </mesh>
        <mesh position={[1.95, 2.0, 0]} rotation={[Math.atan2(3.85, 5.4), 0, 0]}>
          <boxGeometry args={[0.08, 0.9, 6.6]} />
          <meshPhysicalMaterial color="#00F2FE" transparent opacity={0.4} roughness={0.1} />
        </mesh>
      </group>

      {/* ================================================================ */}
      {/* SECOND FLOOR (LEVEL 2) */}
      {/* ================================================================ */}
      <group
        name="Floor2_Group"
        position={[0, 4.0, 0]}
        visible={isF2Visible}
      >
        {/* Floor 2 Mezzanine Slabs with Grand Atrium Opening */}
        {/* East Wing Slab */}
        <mesh position={[18, -0.15, 0]} receiveShadow>
          <boxGeometry args={[28, 0.3, 54]} />
          <meshStandardMaterial
            color="#0A0F1D"
            roughness={0.4}
            metalness={0.6}
            transparent={isF2Ghost}
            opacity={isF2Ghost ? 0.35 : 1.0}
          />
        </mesh>
        {/* West Wing Slab */}
        <mesh position={[-18, -0.15, 0]} receiveShadow>
          <boxGeometry args={[28, 0.3, 54]} />
          <meshStandardMaterial
            color="#0A0F1D"
            roughness={0.4}
            metalness={0.6}
            transparent={isF2Ghost}
            opacity={isF2Ghost ? 0.35 : 1.0}
          />
        </mesh>
        {/* North Mezzanine Overlook Bridge */}
        <mesh position={[0, -0.15, -18]} receiveShadow>
          <boxGeometry args={[10, 0.3, 18]} />
          <meshStandardMaterial
            color="#0A0F1D"
            roughness={0.4}
            metalness={0.6}
            transparent={isF2Ghost}
            opacity={isF2Ghost ? 0.35 : 1.0}
          />
        </mesh>
        {/* South Mezzanine Overlook Bridge */}
        <mesh position={[0, -0.15, 16]} receiveShadow>
          <boxGeometry args={[10, 0.3, 20]} />
          <meshStandardMaterial
            color="#0A0F1D"
            roughness={0.4}
            metalness={0.6}
            transparent={isF2Ghost}
            opacity={isF2Ghost ? 0.35 : 1.0}
          />
        </mesh>

        {/* Level 2 Grid Helper */}
        <gridHelper
          args={[64, 32, '#9055FF', '#1E293B']}
          position={[0, 0.015, 0]}
        />

        {/* Atrium Glass Balustrades */}
        <mesh position={[-4.5, 0.5, 0]}>
          <boxGeometry args={[0.1, 1.0, 16]} />
          <meshPhysicalMaterial color="#00F2FE" transparent opacity={0.4} roughness={0.1} />
        </mesh>
        <mesh position={[4.5, 0.5, 0]}>
          <boxGeometry args={[0.1, 1.0, 16]} />
          <meshPhysicalMaterial color="#00F2FE" transparent opacity={0.4} roughness={0.1} />
        </mesh>

        {/* ========================================================== */}
        {/* ROOM 6: Computer Lab 204 (AI & 3D Vision) - East Wing F2 */}
        {/* ========================================================== */}
        <group position={[20, 0, 0]}>
          {/* Walls */}
          <mesh position={[0, 1.8, -10]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#111827" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.8, 10]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#111827" roughness={0.6} />
          </mesh>
          <mesh position={[8, 1.8, 0]}>
            <boxGeometry args={[0.3, 3.6, 20]} />
            <meshStandardMaterial color="#0B132B" roughness={0.8} />
          </mesh>
          {/* Glass Partition with Entrance Door */}
          <mesh position={[-8, 1.8, -5.5]}>
            <boxGeometry args={[0.2, 3.6, 9]} />
            <meshPhysicalMaterial color="#00C8FF" transparent opacity={0.35} roughness={0.1} />
          </mesh>
          <mesh position={[-8, 1.8, 5.5]}>
            <boxGeometry args={[0.2, 3.6, 9]} />
            <meshPhysicalMaterial color="#00C8FF" transparent opacity={0.35} roughness={0.1} />
          </mesh>

          {/* High-Performance 3D Vision Workstations */}
          {[-5, 0, 5].map((zPos, rowIdx) => (
            <group key={`workstation_row_${rowIdx}`} position={[1, 0, zPos]}>
              <mesh position={[0, 0.45, 0]} castShadow>
                <boxGeometry args={[9.5, 0.9, 1.5]} />
                <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.6} />
              </mesh>
              {/* Dual Curved Monitors & Keyboards */}
              {[-3.2, -1.1, 1.1, 3.2].map((mX, mIdx) => (
                <group key={`mon_${mIdx}`} position={[mX, 1.15, 0]}>
                  <mesh>
                    <boxGeometry args={[0.85, 0.52, 0.06]} />
                    <meshStandardMaterial color="#070A0F" />
                  </mesh>
                  {/* Glowing 3D NeRF / Splatting Screen */}
                  <mesh position={[0, 0, 0.035]}>
                    <planeGeometry args={[0.8, 0.48]} />
                    <meshBasicMaterial color="#00F2FE" />
                  </mesh>
                </group>
              ))}
            </group>
          ))}

          {/* AI Server Rack Cluster in Corner */}
          <group position={[6.2, 1.4, -7]}>
            <mesh castShadow>
              <boxGeometry args={[1.8, 2.8, 3.2]} />
              <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Blinking Activity LEDs on Server Racks */}
            <mesh position={[-0.92, 0.4, 0]}>
              <boxGeometry args={[0.02, 0.1, 2.8]} />
              <meshBasicMaterial color="#00F2FE" />
            </mesh>
            <mesh position={[-0.92, -0.4, 0]}>
              <boxGeometry args={[0.02, 0.1, 2.8]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
            <pointLight ref={serverLightRef1} position={[-1.2, 0.5, 0]} color="#00F2FE" distance={3} />
            <pointLight ref={serverLightRef2} position={[-1.2, -0.5, 0]} color="#10B981" distance={3} />
          </group>
        </group>

        {/* ========================================================== */}
        {/* ROOM 7: Faculty Research & Mentors Cabin (West North F2) */}
        {/* ========================================================== */}
        <group position={[-20, 0, -2]}>
          <mesh position={[0, 1.8, -8]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[0, 1.8, 8]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[8, 1.8, 0]}>
            <boxGeometry args={[0.2, 3.6, 12]} />
            <meshPhysicalMaterial color="#B794F4" transparent opacity={0.35} roughness={0.1} />
          </mesh>
          {/* Executive Conference Table */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[6.5, 0.9, 2.8]} />
            <meshStandardMaterial color="#581C87" roughness={0.3} />
          </mesh>
        </group>

        {/* ========================================================== */}
        {/* ROOM 8: Smart Classroom 201 (West South F2) */}
        {/* ========================================================== */}
        <group position={[-20, 0, 16]}>
          <mesh position={[0, 1.8, -8]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[0, 1.8, 8]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[8, 1.8, 0]}>
            <boxGeometry args={[0.2, 3.6, 12]} />
            <meshPhysicalMaterial color="#63B3ED" transparent opacity={0.35} roughness={0.1} />
          </mesh>
          {/* Interactive Smart Whiteboard Screen */}
          <mesh position={[0, 1.9, 7.8]}>
            <planeGeometry args={[7.5, 2.4]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
        </group>
      </group>

      {/* ================================================================ */}
      {/* DYNAMIC OBSTACLE VISUALIZATION (Maintenance cones & hazard barriers) */}
      {/* ================================================================ */}
      {showObstacles &&
        building.obstacles.map((obs) => {
          if (!obs.active) return null;
          return (
            <group
              key={obs.id}
              position={[obs.coordinates.x, obs.coordinates.y + obs.dimensions.y / 2, obs.coordinates.z]}
            >
              {/* Striped Danger Barrier */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[obs.dimensions.x, obs.dimensions.y, obs.dimensions.z]} />
                <meshStandardMaterial
                  color="#EF4444"
                  emissive="#7F1D1D"
                  roughness={0.2}
                  metalness={0.5}
                />
              </mesh>
              {/* Warning Strobe Light Dome */}
              <mesh position={[0, obs.dimensions.y / 2 + 0.35, 0]}>
                <sphereGeometry args={[0.35, 16, 16]} />
                <meshBasicMaterial color="#F59E0B" />
              </mesh>
              <pointLight
                position={[0, obs.dimensions.y / 2 + 0.5, 0]}
                color="#EF4444"
                intensity={3.5}
                distance={6}
              />
            </group>
          );
        })}
    </group>
  );
};
