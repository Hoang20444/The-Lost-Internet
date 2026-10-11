import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { soundManager } from '../../audio/soundManager';
import { INTERACTABLES, OBSTACLES } from '../../config/interactables';

export const Player: React.FC = () => {
  const { camera } = useThree();
  const playerGroupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const coatTailsRef = useRef<THREE.Mesh>(null);
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
  const checkCollision = (x: number, z: number, playerRadius: number = 0.32): boolean => {
    // Room perimeter walls: X [-3.8, 3.8], Z [-3.3, 3.0]
    const minX = -3.8;
    const maxX = 3.8;
    const minZ = -3.3;
    const maxZ = 3.0;

    if (
      x - playerRadius < minX ||
      x + playerRadius > maxX ||
      z - playerRadius < minZ ||
      z + playerRadius > maxZ
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

    // Door collision: if locked, block doorway threshold on East wall
    if (doorLocked) {
      const doorZone = { minX: 3.5, maxX: 4.1, minZ: -1.4, maxZ: 0.4 };
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
    const speed = 3.8;

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

      // Smooth turning towards movement direction
      const targetAngle = Math.atan2(moveX, moveZ);
      playerGroupRef.current.rotation.y = THREE.MathUtils.damp(
        playerGroupRef.current.rotation.y,
        targetAngle,
        14,
        delta
      );
      setPlayerRotation(playerGroupRef.current.rotation.y);

      // Slide collision: test X and Z independently
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

      // Walking leg animation & subtle coat sway
      footstepTimerRef.current += delta * 11;
      const legSwing = Math.sin(footstepTimerRef.current) * 0.42;
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = legSwing;
        rightLegRef.current.rotation.x = -legSwing;
      }
      if (coatTailsRef.current) {
        coatTailsRef.current.rotation.x = 0.15 + Math.abs(legSwing) * 0.2;
      }

      // Footstep sound triggers
      if (Math.sin(footstepTimerRef.current) > 0.95) {
        soundManager.playFootstep();
      }

      setPlayerPosition([nextX, playerGroupRef.current.position.y, nextZ]);
    } else {
      // Return to neutral stance
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = THREE.MathUtils.damp(leftLegRef.current.rotation.x, 0, 10, delta);
        rightLegRef.current.rotation.x = THREE.MathUtils.damp(rightLegRef.current.rotation.x, 0, 10, delta);
      }
      if (coatTailsRef.current) {
        coatTailsRef.current.rotation.x = THREE.MathUtils.damp(coatTailsRef.current.rotation.x, 0.05, 8, delta);
      }
    }

    // ================= ART-DIRECTED CINEMATIC CAMERA COMPOSITION =================
    // Camera is elevated in a cinematic 3/4 isometric perspective framing the workstation, door, and player
    const px = playerGroupRef.current.position.x;
    const pz = playerGroupRef.current.position.z;

    const targetCamX = THREE.MathUtils.clamp(px * 0.45 + 0.2, -1.5, 1.5);
    const targetCamY = 3.1;
    const targetCamZ = THREE.MathUtils.clamp(pz * 0.4 + 4.1, 2.6, 4.8);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 3.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 3.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 3.5, delta);

    // Look at point that keeps the workstation & player centered
    const lookTarget = new THREE.Vector3(
      px * 0.35 - 0.25,
      1.0,
      pz * 0.35 - 1.3
    );
    camera.lookAt(lookTarget);

    // ================= CONTEXTUAL INTERACTION PROXIMITY CHECK =================
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
    <group ref={playerGroupRef} position={[0.2, 0, 0.8]} rotation={[0, Math.PI, 0]}>
      {/* ================= STYLIZED INDIE EXPLORER MODEL ================= */}
      {/* Torso: Field Explorer Jacket */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <boxGeometry args={[0.34, 0.42, 0.22]} />
        <meshStandardMaterial color="#2c283d" roughness={0.7} />
      </mesh>

      {/* Jacket Collar / Scarf */}
      <mesh position={[0, 0.98, 0.02]} castShadow>
        <boxGeometry args={[0.26, 0.08, 0.2]} />
        <meshStandardMaterial color="#403856" roughness={0.75} />
      </mesh>

      {/* Field Jacket Lower Tails */}
      <mesh ref={coatTailsRef} position={[0, 0.54, -0.01]} castShadow>
        <boxGeometry args={[0.32, 0.16, 0.2]} />
        <meshStandardMaterial color="#242033" roughness={0.75} />
      </mesh>

      {/* Explorer Field Satchel / Backpack */}
      <mesh position={[0, 0.82, -0.14]} castShadow>
        <boxGeometry args={[0.26, 0.28, 0.12]} />
        <meshStandardMaterial color="#1a1724" roughness={0.8} />
      </mesh>
      {/* Satchel brass buckle */}
      <mesh position={[0, 0.8, -0.205]}>
        <boxGeometry args={[0.06, 0.03, 0.01]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} />
      </mesh>

      {/* Refined Stylized Head */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.22, 0.24, 0.22]} />
        <meshStandardMaterial color="#ded7c8" roughness={0.65} />
      </mesh>
      {/* Stylized Hair / Explorer Cap */}
      <mesh position={[0, 1.25, -0.02]} castShadow>
        <boxGeometry args={[0.23, 0.08, 0.23]} />
        <meshStandardMaterial color="#1c1926" roughness={0.75} />
      </mesh>

      {/* Discreet Retro-Futuristic Visor Monocle */}
      <mesh position={[0, 1.16, 0.115]}>
        <boxGeometry args={[0.2, 0.05, 0.025]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#00f0ff"
          emissiveIntensity={1.0}
          roughness={0.2}
        />
      </mesh>

      {/* Left Leg & Field Boot */}
      <group ref={leftLegRef} position={[-0.09, 0.5, 0]}>
        {/* Tapered trouser */}
        <mesh position={[0, -0.16, 0]} castShadow>
          <boxGeometry args={[0.11, 0.32, 0.12]} />
          <meshStandardMaterial color="#1f1c29" roughness={0.8} />
        </mesh>
        {/* Leather boot */}
        <mesh position={[0, -0.38, 0.02]} castShadow>
          <boxGeometry args={[0.11, 0.14, 0.16]} />
          <meshStandardMaterial color="#13111a" roughness={0.65} />
        </mesh>
      </group>

      {/* Right Leg & Field Boot */}
      <group ref={rightLegRef} position={[0.09, 0.5, 0]}>
        {/* Tapered trouser */}
        <mesh position={[0, -0.16, 0]} castShadow>
          <boxGeometry args={[0.11, 0.32, 0.12]} />
          <meshStandardMaterial color="#1f1c29" roughness={0.8} />
        </mesh>
        {/* Leather boot */}
        <mesh position={[0, -0.38, 0.02]} castShadow>
          <boxGeometry args={[0.11, 0.14, 0.16]} />
          <meshStandardMaterial color="#13111a" roughness={0.65} />
        </mesh>
      </group>

      {/* Soft Contact Ground AO Shadow */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
};
