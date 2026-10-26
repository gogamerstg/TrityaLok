import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

export const FirstPersonControls: React.FC = () => {
  const { camera, gl } = useThree();
  const { controlsMode, selectedFloorId } = useAppStore();

  const keys = useRef<{ [key: string]: boolean }>({});
  const moveSpeed = 8.0;
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const isPointerLocked = useRef(false);

  useEffect(() => {
    if (controlsMode !== 'firstPerson') return;

    // Reset camera height to human eye level (1.7m)
    const baseY = selectedFloorId === 2 ? 5.7 : 1.7;
    camera.position.set(0, baseY, 20);
    camera.lookAt(0, baseY, 0);
    euler.current.setFromQuaternion(camera.quaternion);

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current) return;
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      euler.current.y -= movementX * 0.0025;
      euler.current.x -= movementY * 0.0025;
      euler.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    };

    const handleClick = () => {
      if (controlsMode === 'firstPerson' && !isPointerLocked.current) {
        gl.domElement.requestPointerLock();
      }
    };

    const handleLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === gl.domElement;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handleLockChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handleLockChange);
      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock();
      }
    };
  }, [camera, controlsMode, gl, selectedFloorId]);

  useFrame((_, delta) => {
    if (controlsMode !== 'firstPerson') return;

    const moveDirection = new THREE.Vector3();
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    if (keys.current['KeyW'] || keys.current['ArrowUp']) moveDirection.add(forward);
    if (keys.current['KeyS'] || keys.current['ArrowDown']) moveDirection.sub(forward);
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveDirection.sub(right);
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveDirection.add(right);

    if (moveDirection.lengthSq() > 0) {
      moveDirection.normalize();
      const speed = keys.current['ShiftLeft'] || keys.current['ShiftRight'] ? moveSpeed * 1.8 : moveSpeed;
      camera.position.addScaledVector(moveDirection, speed * delta);

      // Clamp within building bounds
      camera.position.x = Math.max(-28, Math.min(28, camera.position.x));
      camera.position.z = Math.max(-23, Math.min(23, camera.position.z));
    }
  });

  return null;
};
