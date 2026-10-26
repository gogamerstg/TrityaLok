import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

export const AnimatedAvatar: React.FC = () => {
  const {
    activeRoute,
    isNavigating,
    isPlayingAnimation,
    setIsPlayingAnimation,
    animationProgress,
    setAnimationProgress,
    currentStepIndex,
    setCurrentStepIndex,
  } = useAppStore();

  const avatarRef = useRef<THREE.Group>(null);
  const rotorRef1 = useRef<THREE.Mesh>(null);
  const rotorRef2 = useRef<THREE.Mesh>(null);
  const rotorRef3 = useRef<THREE.Mesh>(null);
  const rotorRef4 = useRef<THREE.Mesh>(null);

  const points = useMemo(() => {
    if (!activeRoute || !activeRoute.success || activeRoute.path_coordinates.length < 2) {
      return [];
    }
    return activeRoute.path_coordinates.map(
      (c) => new THREE.Vector3(c.x, c.y + 0.8, c.z)
    );
  }, [activeRoute]);

  const curve = useMemo(() => {
    if (points.length < 2) return null;
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.15);
  }, [points]);

  useFrame((state, delta) => {
    // Spin drone rotors
    const rotorSpeed = 25.0 * delta;
    if (rotorRef1.current) rotorRef1.current.rotation.y += rotorSpeed;
    if (rotorRef2.current) rotorRef2.current.rotation.y -= rotorSpeed;
    if (rotorRef3.current) rotorRef3.current.rotation.y += rotorSpeed;
    if (rotorRef4.current) rotorRef4.current.rotation.y -= rotorSpeed;

    if (!curve || !avatarRef.current) return;

    if (isPlayingAnimation) {
      // Speed calibrated to route distance (e.g. completes full route in ~12 seconds)
      const travelSpeed = 0.08 * delta;
      const newProgress = Math.min(1.0, animationProgress + travelSpeed);
      setAnimationProgress(newProgress);

      const pos = curve.getPointAt(newProgress);
      avatarRef.current.position.copy(pos);

      // Orientation / look ahead
      if (newProgress < 0.99) {
        const lookTarget = curve.getPointAt(Math.min(1.0, newProgress + 0.02));
        avatarRef.current.lookAt(lookTarget);
      }

      // Update current step index based on distance to waypoints
      if (activeRoute && activeRoute.turn_by_turn.length > 0) {
        const stepIdx = Math.min(
          activeRoute.turn_by_turn.length - 1,
          Math.floor(newProgress * activeRoute.turn_by_turn.length)
        );
        if (stepIdx !== currentStepIndex) {
          setCurrentStepIndex(stepIdx);
        }
      }

      // Check destination reached
      if (newProgress >= 1.0) {
        setIsPlayingAnimation(false);
      }
    } else if (curve && points.length > 0) {
      // Place at current progress
      const pos = curve.getPointAt(Math.min(1.0, Math.max(0.0, animationProgress)));
      avatarRef.current.position.copy(pos);
      if (animationProgress < 0.99) {
        const lookTarget = curve.getPointAt(Math.min(1.0, animationProgress + 0.02));
        avatarRef.current.lookAt(lookTarget);
      }
    }
  });

  if (!isNavigating && !isPlayingAnimation) {
    return null;
  }

  if (!curve) return null;

  return (
    <group ref={avatarRef} name="NavigatingAvatarDrone">
      {/* Central Drone Chassis */}
      <mesh castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#0284C7" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Cyber Visor Eye */}
      <mesh position={[0, 0.05, 0.28]}>
        <boxGeometry args={[0.32, 0.12, 0.1]} />
        <meshBasicMaterial color="#00F2FE" />
      </mesh>

      {/* Quadrotor Arms & Props */}
      {[
        [-0.45, 0.45, rotorRef1],
        [0.45, 0.45, rotorRef2],
        [-0.45, -0.45, rotorRef3],
        [0.45, -0.45, rotorRef4],
      ].map(([rx, rz, ref], idx) => (
        <group key={`prop_${idx}`} position={[rx as number, 0.1, rz as number]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh ref={ref as React.RefObject<THREE.Mesh>}>
            <boxGeometry args={[0.4, 0.02, 0.06]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.8} />
          </mesh>
        </group>
      ))}

      {/* Downward Navigation Scanner Beam */}
      <mesh position={[0, -0.4, 0]}>
        <coneGeometry args={[0.5, 0.8, 16, 1, true]} />
        <meshBasicMaterial
          color="#00F2FE"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Altitude Light */}
      <pointLight color="#00F2FE" intensity={2} distance={4} />
    </group>
  );
};
