import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { soundManager } from '../../audio/soundManager';
import { INTERACTABLES, OBSTACLES } from '../../config/interactables';

export const Player: React.FC = () => {
  const { camera } = useThree();
  const playerGroupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const footstepTimerRef = useRef<number>(0);

  // Keyboard input state
  const keysRef = useRef<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
  }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // State store hooks
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setPlayerRotation = useGameStore((state) => state.setPlayerRotation);
  const setPlayerMoving = useGameStore((state) => state.setPlayerMoving);
  const setActiveInteractable = useGameStore((state) => state.setActiveInteractable);
  const activeModal = useGameStore((state) => state.activeModal);
  const isPaused = useGameStore((state) => state.isPaused);
  const doorLocked = useGameStore((state) => state.doorLocked);

  // Setup keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture WASD if typing in terminal
      if (activeModal === 'terminal') return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeModal]);

  // Collision checking helper
  const checkCollision = (x: number, z: number, playerRadius: number = 0.35): boolean => {
    // Room perimeter walls
    const minWall = -4.3;
    const maxWall = 4.3;
    if (
      x - playerRadius < minWall ||
      x + playerRadius > maxWall ||
      z - playerRadius < minWall ||
      z + playerRadius > maxWall
    ) {
      return true;
    }

    // Furniture obstacles
    for (const obs of OBSTACLES) {
      if (
        x + playerRadius > obs.minX &&
        x - playerRadius < obs.maxX &&
        z + playerRadius > obs.minZ &&
        z - playerRadius < obs.maxZ
      ) {
        return true;
      }
    }

    // Door collision: if locked, block doorway on East wall
    if (doorLocked) {
      const doorZone = { minX: 4.1, maxX: 4.8, minZ: -1.2, maxZ: 1.2 };
      if (
        x + playerRadius > doorZone.minX &&
        x - playerRadius < doorZone.maxX &&
        z + playerRadius > doorZone.minZ &&
        z - playerRadius < doorZone.maxZ
      ) {
        return true;
      }
    }

    return false;
  };

  useFrame((_, delta) => {
    if (!playerGroupRef.current) return;
    if (isPaused || activeModal) {
      setPlayerMoving(false);
      return;
    }

    const { forward, backward, left, right } = keysRef.current;
    const speed = 4.0; // units per second

    let moveX = 0;
    let moveZ = 0;

    if (forward) moveZ -= 1;
    if (backward) moveZ += 1;
    if (left) moveX -= 1;
    if (right) moveX += 1;

    const isMoving = moveX !== 0 || moveZ !== 0;
    setPlayerMoving(isMoving);

    const currentX = playerGroupRef.current.position.x;
    const currentZ = playerGroupRef.current.position.z;

    if (isMoving) {
      // Normalize movement vector
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      const dirX = (moveX / length) * speed * delta;
      const dirZ = (moveZ / length) * speed * delta;

      // Smooth rotation towards movement direction
      const targetAngle = Math.atan2(moveX, moveZ);
      playerGroupRef.current.rotation.y = THREE.MathUtils.damp(
        playerGroupRef.current.rotation.y,
        targetAngle,
        14,
        delta
      );
      setPlayerRotation(playerGroupRef.current.rotation.y);

      // Slide collision: test X and Z separately
      let nextX = currentX;
      let nextZ = currentZ;

      if (!checkCollision(currentX + dirX, currentZ)) {
        nextX += dirX;
      }
      if (!checkCollision(nextX, currentZ + dirZ)) {
        nextZ += dirZ;
      }

      playerGroupRef.current.position.x = nextX;
      playerGroupRef.current.position.z = nextZ;

      // Bobbing walking leg animation
      footstepTimerRef.current += delta * 12;
      const legSwing = Math.sin(footstepTimerRef.current) * 0.45;
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = legSwing;
        rightLegRef.current.rotation.x = -legSwing;
      }

      // Footstep sound triggers
      if (Math.sin(footstepTimerRef.current) > 0.95) {
        soundManager.playFootstep();
      }

      setPlayerPosition([nextX, playerGroupRef.current.position.y, nextZ]);
    } else {
      // Reset legs when standing
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = THREE.MathUtils.damp(leftLegRef.current.rotation.x, 0, 10, delta);
        rightLegRef.current.rotation.x = THREE.MathUtils.damp(rightLegRef.current.rotation.x, 0, 10, delta);
      }
    }

    // ================= SMOOTH CAMERA FOLLOW WITHOUT WALL CLIPPING =================
    // Camera sits behind and above player, looking down into the room
    const targetCamX = THREE.MathUtils.clamp(
      playerGroupRef.current.position.x * 0.7,
      -2.8,
      2.8
    );
    const targetCamY = 2.8;
    const targetCamZ = THREE.MathUtils.clamp(
      playerGroupRef.current.position.z * 0.4 + 3.8,
      1.5,
      4.4
    );

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4.0, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4.0, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4.0, delta);

    // Look at player waist/chest and slightly ahead into the room
    const lookTarget = new THREE.Vector3(
      playerGroupRef.current.position.x * 0.6,
      0.9,
      playerGroupRef.current.position.z * 0.6 - 1.0
    );
    camera.lookAt(lookTarget);

    // ================= CONTEXTUAL INTERACTION RANGE CHECK =================
    const px = playerGroupRef.current.position.x;
    const pz = playerGroupRef.current.position.z;

    let closest: (typeof INTERACTABLES)[0] | null = null;
    let closestDist = Infinity;

    for (const item of INTERACTABLES) {
      const dx = px - item.position[0];
      const dz = pz - item.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= item.radius && dist < closestDist) {
        closest = item;
        closestDist = dist;
      }
    }

    setActiveInteractable(closest);
  });

  return (
    <group ref={playerGroupRef} position={[0, 0, 0]}>
      {/* Player character visual mesh */}
      {/* Torso / Jacket */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.38, 0.46, 0.24]} />
        <meshStandardMaterial color="#312e81" roughness={0.7} />
      </mesh>

      {/* Explorer Backpack */}
      <mesh position={[0, 0.74, -0.16]} castShadow>
        <boxGeometry args={[0.28, 0.32, 0.14]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.8} />
      </mesh>
      {/* Backpack cyan LED strip */}
      <mesh position={[0, 0.8, -0.235]}>
        <boxGeometry args={[0.16, 0.04, 0.01]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.12, 0]} castShadow>
        <boxGeometry args={[0.26, 0.26, 0.26]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.6} />
      </mesh>

      {/* Retro Cybergoggles / Visor */}
      <mesh position={[0, 1.14, 0.135]}>
        <boxGeometry args={[0.24, 0.08, 0.04]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#00f0ff"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Headset / Antenna */}
      <mesh position={[0.14, 1.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0.14, 1.28, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.2, 6]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* Left Leg */}
      <group position={[-0.11, 0.48, 0]}>
        <mesh ref={leftLegRef} position={[0, -0.24, 0]} castShadow>
          <boxGeometry args={[0.13, 0.46, 0.14]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.11, 0.48, 0]}>
        <mesh ref={rightLegRef} position={[0, -0.24, 0]} castShadow>
          <boxGeometry args={[0.13, 0.46, 0.14]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>

      {/* Player Proximity Soft Foot Shadow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.34, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
};
