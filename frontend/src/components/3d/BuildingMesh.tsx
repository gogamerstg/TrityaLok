import React from 'react';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

export const BuildingMesh: React.FC = () => {
  const { building, selectedFloorId, showObstacles } = useAppStore();

  const isF1Visible = selectedFloorId === 'all' || selectedFloorId === 1;
  const isF2Visible = selectedFloorId === 'all' || selectedFloorId === 2;
  const isF2Ghost = selectedFloorId === 1;

  return (
    <group name="BuildingComplex">
      {/* GROUND LEVEL (FLOOR 1) */}
      <group name="Floor1_Group" visible={isF1Visible}>
        {/* Main Floor Slab */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[64, 0.2, 52]} />
          <meshStandardMaterial
            color="#0E1626"
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>

        {/* Polished Floor Grid Lines Accent */}
        <gridHelper
          args={[60, 30, '#00C8FF', '#1E293B']}
          position={[0, 0.01, 0]}
        />

        {/* Outer Perimeter Foundation Border */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[64.4, 0.4, 52.4]} />
          <meshStandardMaterial color="#1E293B" wireframe />
        </mesh>

        {/* Central Atrium Floor Ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.5, 7.5, 32]} />
          <meshBasicMaterial color="#00F2FE" transparent opacity={0.15} />
        </mesh>

        {/* === ROOM WALLS (FLOOR 1) === */}

        {/* 1. Reception & Lobby Desk Zone */}
        <group position={[0, 0, 16]}>
          {/* Curved Reception Counter Desk */}
          <mesh position={[0, 0.6, -1]} castShadow receiveShadow>
            <boxGeometry args={[6.0, 1.2, 1.2]} />
            <meshStandardMaterial color="#00C8FF" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 1.22, -1]}>
            <boxGeometry args={[6.2, 0.05, 1.4]} />
            <meshStandardMaterial color="#E0F2FE" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Waiting Couches */}
          <mesh position={[-4, 0.35, 2]}>
            <boxGeometry args={[2.5, 0.7, 1.0]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[4, 0.35, 2]}>
            <boxGeometry args={[2.5, 0.7, 1.0]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>

        {/* 2. Robotics & Autonomous Systems Lab (West Wing F1) */}
        <group position={[-20, 0, 0]}>
          {/* Lab Enclosure Walls */}
          {/* North Wall */}
          <mesh position={[0, 1.8, -10]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} />
          </mesh>
          {/* South Wall */}
          <mesh position={[0, 1.8, 10]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} />
          </mesh>
          {/* West Exterior Wall */}
          <mesh position={[-8, 1.8, 0]}>
            <boxGeometry args={[0.3, 3.6, 20]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>
          {/* East Glass Partition (With Doorway opening at z=0) */}
          <mesh position={[8, 1.8, -5.5]}>
            <boxGeometry args={[0.2, 3.6, 9]} />
            <meshPhysicalMaterial
              color="#38EF7D"
              transparent
              opacity={0.35}
              roughness={0.1}
              transmission={0.8}
            />
          </mesh>
          <mesh position={[8, 1.8, 5.5]}>
            <boxGeometry args={[0.2, 3.6, 9]} />
            <meshPhysicalMaterial
              color="#38EF7D"
              transparent
              opacity={0.35}
              roughness={0.1}
              transmission={0.8}
            />
          </mesh>
          {/* Lab Benches & Robotics Rig */}
          <mesh position={[-3, 0.5, -4]}>
            <boxGeometry args={[6, 1.0, 2]} />
            <meshStandardMaterial color="#475569" roughness={0.4} />
          </mesh>
          <mesh position={[-3, 0.5, 4]}>
            <boxGeometry args={[6, 1.0, 2]} />
            <meshStandardMaterial color="#475569" roughness={0.4} />
          </mesh>
          {/* Drone Landing Pad on Floor */}
          <mesh position={[1, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.0, 16]} />
            <meshBasicMaterial color="#10B981" wireframe />
          </mesh>
        </group>

        {/* 3. Aryabhata Seminar Auditorium (East Wing F1) */}
        <group position={[20, 0, 0]}>
          {/* North Wall */}
          <mesh position={[0, 1.8, -10]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} />
          </mesh>
          {/* South Wall */}
          <mesh position={[0, 1.8, 10]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} />
          </mesh>
          {/* East Wall */}
          <mesh position={[8, 1.8, 0]}>
            <boxGeometry args={[0.3, 3.6, 20]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>
          {/* West Wall with Entrance Gap */}
          <mesh position={[-8, 1.8, -5.5]}>
            <boxGeometry args={[0.2, 3.6, 9]} />
            <meshPhysicalMaterial
              color="#9055FF"
              transparent
              opacity={0.35}
              roughness={0.1}
              transmission={0.8}
            />
          </mesh>
          <mesh position={[-8, 1.8, 5.5]}>
            <boxGeometry args={[0.2, 3.6, 9]} />
            <meshPhysicalMaterial
              color="#9055FF"
              transparent
              opacity={0.35}
              roughness={0.1}
              transmission={0.8}
            />
          </mesh>
          {/* Tiered Seating Rows */}
          <mesh position={[1, 0.4, -4]}>
            <boxGeometry args={[8, 0.8, 1.5]} />
            <meshStandardMaterial color="#581C87" />
          </mesh>
          <mesh position={[1, 0.7, 0]}>
            <boxGeometry args={[8, 1.4, 1.5]} />
            <meshStandardMaterial color="#581C87" />
          </mesh>
          <mesh position={[1, 1.0, 4]}>
            <boxGeometry args={[8, 2.0, 1.5]} />
            <meshStandardMaterial color="#581C87" />
          </mesh>
          {/* Auditorium Stage & Presentation Screen */}
          <mesh position={[-5, 0.3, 0]}>
            <boxGeometry args={[2.5, 0.6, 10]} />
            <meshStandardMaterial color="#312E81" />
          </mesh>
          <mesh position={[-6.8, 2.0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[7, 2.2]} />
            <meshBasicMaterial color="#A78BFA" />
          </mesh>
        </group>

        {/* 4. Techfest Student Cafe (South-East F1) */}
        <group position={[19, 0, 18]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 1.0, 16]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.3} />
          </mesh>
          <mesh position={[-4, 0.5, 0]}>
            <cylinderGeometry args={[1.0, 1.0, 1.0, 16]} />
            <meshStandardMaterial color="#B45309" roughness={0.3} />
          </mesh>
          <mesh position={[4, 0.5, 0]}>
            <cylinderGeometry args={[1.0, 1.0, 1.0, 16]} />
            <meshStandardMaterial color="#B45309" roughness={0.3} />
          </mesh>
        </group>

        {/* 5. Restrooms (South-West F1) */}
        <group position={[-19, 0, 16]}>
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[14, 3.6, 8]} />
            <meshStandardMaterial color="#1E293B" roughness={0.8} />
          </mesh>
        </group>

        {/* 6. Main Architectural Columns (Ground Floor) */}
        {[
          [-8, -8], [8, -8],
          [-8, 0], [8, 0],
          [-8, 10], [8, 10],
          [0, -18], [0, 20]
        ].map(([cx, cz], idx) => (
          <mesh key={`f1_col_${idx}`} position={[cx, 1.8, cz]}>
            <cylinderGeometry args={[0.35, 0.35, 3.6, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* CENTRAL ELEVATOR SHAFT (Spanning F1 & F2) */}
      <group position={[0, 2.0, 6]}>
        {/* Transparent Glass Shaft */}
        <mesh>
          <boxGeometry args={[3.2, 4.4, 3.2]} />
          <meshPhysicalMaterial
            color="#00C8FF"
            transparent
            opacity={0.25}
            roughness={0.05}
            transmission={0.9}
            thickness={0.5}
          />
        </mesh>
        {/* Steel Corner Pillars */}
        {[
          [-1.5, -1.5], [1.5, -1.5],
          [-1.5, 1.5], [1.5, 1.5]
        ].map(([px, pz], idx) => (
          <mesh key={`elev_col_${idx}`} position={[px, 0, pz]}>
            <boxGeometry args={[0.15, 4.4, 0.15]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Elevator Cabin (Hovering between floors) */}
        <mesh position={[0, selectedFloorId === 2 ? 1.0 : -1.0, 0]}>
          <boxGeometry args={[2.6, 2.2, 2.6]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Glowing Cabin Floor */}
        <mesh position={[0, selectedFloorId === 2 ? 0.05 : -1.95, 0]}>
          <boxGeometry args={[2.5, 0.05, 2.5]} />
          <meshBasicMaterial color="#00F2FE" />
        </mesh>
      </group>

      {/* ARCHITECTURAL STAIRCASE (Spanning F1 to F2 at Z = -12) */}
      <group position={[0, 0, -12]}>
        {/* Stair Treads */}
        {Array.from({ length: 16 }).map((_, stepIdx) => {
          const stepY = (stepIdx / 15) * 3.8;
          const stepZ = (stepIdx / 15) * 5.0 - 2.5;
          return (
            <mesh key={`stair_step_${stepIdx}`} position={[0, stepY, stepZ]}>
              <boxGeometry args={[3.6, 0.22, 0.4]} />
              <meshStandardMaterial
                color={stepIdx % 2 === 0 ? '#1E293B' : '#334155'}
                roughness={0.4}
                metalness={0.3}
              />
            </mesh>
          );
        })}
        {/* Left & Right Glass Handrails */}
        <mesh position={[-1.85, 2.0, 0]} rotation={[Math.atan2(3.8, 5.0), 0, 0]}>
          <boxGeometry args={[0.08, 0.9, 6.2]} />
          <meshPhysicalMaterial
            color="#00F2FE"
            transparent
            opacity={0.35}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[1.85, 2.0, 0]} rotation={[Math.atan2(3.8, 5.0), 0, 0]}>
          <boxGeometry args={[0.08, 0.9, 6.2]} />
          <meshPhysicalMaterial
            color="#00F2FE"
            transparent
            opacity={0.35}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* SECOND FLOOR (LEVEL 2) */}
      <group
        name="Floor2_Group"
        position={[0, 4.0, 0]}
        visible={isF2Visible}
      >
        {/* Floor 2 Slab with Open Atrium Cutout */}
        {/* East Wing Slab */}
        <mesh position={[18, -0.1, 0]} receiveShadow>
          <boxGeometry args={[28, 0.2, 52]} />
          <meshStandardMaterial
            color="#0E1626"
            roughness={0.7}
            metalness={0.2}
            transparent={isF2Ghost}
            opacity={isF2Ghost ? 0.3 : 1.0}
          />
        </mesh>
        {/* West Wing Slab */}
        <mesh position={[-18, -0.1, 0]} receiveShadow>
          <boxGeometry args={[28, 0.2, 52]} />
          <meshStandardMaterial
            color="#0E1626"
            roughness={0.7}
            metalness={0.2}
            transparent={isF2Ghost}
            opacity={isF2Ghost ? 0.3 : 1.0}
          />
        </mesh>
        {/* North Connecting Bridge Slab */}
        <mesh position={[0, -0.1, -18]} receiveShadow>
          <boxGeometry args={[10, 0.2, 16]} />
          <meshStandardMaterial
            color="#0E1626"
            roughness={0.7}
            transparent={isF2Ghost}
            opacity={isF2Ghost ? 0.3 : 1.0}
          />
        </mesh>
        {/* South Connecting Bridge Slab */}
        <mesh position={[0, -0.1, 16]} receiveShadow>
          <boxGeometry args={[10, 0.2, 20]} />
          <meshStandardMaterial
            color="#0E1626"
            roughness={0.7}
            transparent={isF2Ghost}
            opacity={isF2Ghost ? 0.3 : 1.0}
          />
        </mesh>

        {/* Level 2 Grid Helper */}
        <gridHelper
          args={[60, 30, '#9055FF', '#1E293B']}
          position={[0, 0.01, 0]}
        />

        {/* Atrium Glass Balustrades (Around the central floor cutout) */}
        <mesh position={[-4, 0.5, 0]}>
          <boxGeometry args={[0.1, 1.0, 14]} />
          <meshPhysicalMaterial
            color="#00F2FE"
            transparent
            opacity={0.4}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[4, 0.5, 0]}>
          <boxGeometry args={[0.1, 1.0, 14]} />
          <meshPhysicalMaterial
            color="#00F2FE"
            transparent
            opacity={0.4}
            roughness={0.1}
          />
        </mesh>

        {/* === ROOM WALLS (FLOOR 2) === */}

        {/* 1. Computer Lab 204 (AI & 3D Vision - East Wing F2) */}
        <group position={[20, 0, 0]}>
          {/* North Wall */}
          <mesh position={[0, 1.8, -10]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} />
          </mesh>
          {/* South Wall */}
          <mesh position={[0, 1.8, 10]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} />
          </mesh>
          {/* East Wall */}
          <mesh position={[8, 1.8, 0]}>
            <boxGeometry args={[0.3, 3.6, 20]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>
          {/* West Wall with Lab 204 Door opening */}
          <mesh position={[-8, 1.8, -5.5]}>
            <boxGeometry args={[0.2, 3.6, 9]} />
            <meshPhysicalMaterial
              color="#00C8FF"
              transparent
              opacity={0.35}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[-8, 1.8, 5.5]}>
            <boxGeometry args={[0.2, 3.6, 9]} />
            <meshPhysicalMaterial
              color="#00C8FF"
              transparent
              opacity={0.35}
              roughness={0.1}
            />
          </mesh>
          {/* Computer Workstation Desks (Rows of 3D workstations) */}
          {[-5, 0, 5].map((zPos, rowIdx) => (
            <group key={`workstation_row_${rowIdx}`} position={[1, 0, zPos]}>
              <mesh position={[0, 0.45, 0]}>
                <boxGeometry args={[9, 0.9, 1.4]} />
                <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.5} />
              </mesh>
              {/* Dual Monitors on Desks */}
              {[-3, -1, 1, 3].map((mX, mIdx) => (
                <group key={`mon_${mIdx}`} position={[mX, 1.1, 0]}>
                  <mesh>
                    <boxGeometry args={[0.8, 0.5, 0.05]} />
                    <meshStandardMaterial color="#0B0F19" />
                  </mesh>
                  {/* Glowing Screen */}
                  <mesh position={[0, 0, 0.03]}>
                    <planeGeometry args={[0.75, 0.45]} />
                    <meshBasicMaterial color="#00F2FE" />
                  </mesh>
                </group>
              ))}
            </group>
          ))}
          {/* Server Rack Cluster in corner */}
          <mesh position={[6, 1.3, -7]}>
            <boxGeometry args={[1.6, 2.6, 3.0]} />
            <meshStandardMaterial color="#0284C7" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* 2. Faculty Cabins & Mentors Lounge (West Wing North F2) */}
        <group position={[-20, 0, -2]}>
          <mesh position={[0, 1.8, -8]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <mesh position={[0, 1.8, 8]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <mesh position={[-8, 1.8, 0]}>
            <boxGeometry args={[0.3, 3.6, 16]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[8, 1.8, 0]}>
            <boxGeometry args={[0.2, 3.6, 12]} />
            <meshPhysicalMaterial
              color="#B794F4"
              transparent
              opacity={0.35}
              roughness={0.1}
            />
          </mesh>
          {/* Executive Conference Table */}
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[6, 0.9, 2.5]} />
            <meshStandardMaterial color="#4C1D95" roughness={0.3} />
          </mesh>
        </group>

        {/* 3. Smart Classroom 201 (West Wing South F2) */}
        <group position={[-20, 0, 16]}>
          <mesh position={[0, 1.8, -8]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <mesh position={[0, 1.8, 8]}>
            <boxGeometry args={[16, 3.6, 0.3]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <mesh position={[-8, 1.8, 0]}>
            <boxGeometry args={[0.3, 3.6, 16]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[8, 1.8, 0]}>
            <boxGeometry args={[0.2, 3.6, 12]} />
            <meshPhysicalMaterial
              color="#63B3ED"
              transparent
              opacity={0.35}
              roughness={0.1}
            />
          </mesh>
          {/* Smart Whiteboard Screen */}
          <mesh position={[0, 1.8, 7.8]}>
            <planeGeometry args={[7, 2.2]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
        </group>
      </group>

      {/* DYNAMIC OBSTACLE OBJECTS (If active and enabled) */}
      {showObstacles &&
        building.obstacles.map((obs) => {
          if (!obs.active) return null;
          return (
            <group
              key={obs.id}
              position={[obs.coordinates.x, obs.coordinates.y + obs.dimensions.y / 2, obs.coordinates.z]}
            >
              {/* Striped Danger Barrier Cube */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[obs.dimensions.x, obs.dimensions.y, obs.dimensions.z]} />
                <meshStandardMaterial
                  color="#EF4444"
                  emissive="#7F1D1D"
                  roughness={0.3}
                  wireframe={false}
                />
              </mesh>
              {/* Pulsing Warning Dome */}
              <mesh position={[0, obs.dimensions.y / 2 + 0.3, 0]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial color="#F59E0B" />
              </mesh>
            </group>
          );
        })}
    </group>
  );
};
