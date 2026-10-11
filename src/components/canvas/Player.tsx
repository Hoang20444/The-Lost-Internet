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
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const coatTailsRef = useRef<THREE.Group>(null);
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

      // Walking leg animation & coordinated natural arm swing
      footstepTimerRef.current += delta * 11;
      const legSwing = Math.sin(footstepTimerRef.current) * 0.42;
      const armSwing = Math.sin(footstepTimerRef.current) * 0.36;

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = legSwing;
        rightLegRef.current.rotation.x = -legSwing;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -armSwing;
        rightArmRef.current.rotation.x = armSwing;
      }
      if (coatTailsRef.current) {
        coatTailsRef.current.rotation.x = 0.12 + Math.abs(legSwing) * 0.18;
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
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.damp(leftArmRef.current.rotation.x, 0, 10, delta);
        rightArmRef.current.rotation.x = THREE.MathUtils.damp(rightArmRef.current.rotation.x, 0, 10, delta);
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
      {/* ================= COHERENT STYLIZED LOW-POLY EXPLORER ================= */}

      {/* 1. Pelvis / Hip Core */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[0.26, 0.12, 0.18]} />
        <meshStandardMaterial color="#211e2d" roughness={0.75} />
      </mesh>

      {/* 2. Lower Torso & Belt */}
      <mesh position={[0, 0.63, 0]} castShadow>
        <boxGeometry args={[0.3, 0.14, 0.2]} />
        <meshStandardMaterial color="#2b273b" roughness={0.7} />
      </mesh>
      {/* Leather Field Belt with Brass Buckle */}
      <mesh position={[0, 0.59, 0.01]} castShadow>
        <boxGeometry args={[0.31, 0.04, 0.21]} />
        <meshStandardMaterial color="#3a281c" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.59, 0.118]}>
        <boxGeometry args={[0.07, 0.05, 0.015]} />
        <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* 3. Upper Torso: Field Duster Coat */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <boxGeometry args={[0.36, 0.28, 0.22]} />
        <meshStandardMaterial color="#2b273b" roughness={0.7} />
      </mesh>

      {/* Folded Coat Lapels & Neck Cowl */}
      <mesh position={[0, 0.94, 0.02]} castShadow>
        <boxGeometry args={[0.28, 0.1, 0.21]} />
        <meshStandardMaterial color="#3c3652" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.88, 0.112]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.16, 0.16, 0.02]} />
        <meshStandardMaterial color="#221e30" roughness={0.8} />
      </mesh>

      {/* Diagonal Cross-Chest Leather Satchel Strap */}
      <mesh position={[0, 0.8, 0.02]} rotation={[0, 0, 0.62]}>
        <boxGeometry args={[0.05, 0.38, 0.23]} />
        <meshStandardMaterial color="#3a281c" roughness={0.65} />
      </mesh>

      {/* 4. Split Dynamic Coat Tails */}
      <group ref={coatTailsRef} position={[0, 0.5, 0]}>
        {/* Left coat tail */}
        <mesh position={[-0.08, -0.11, -0.01]} castShadow>
          <boxGeometry args={[0.14, 0.22, 0.2]} />
          <meshStandardMaterial color="#242033" roughness={0.75} />
        </mesh>
        {/* Right coat tail */}
        <mesh position={[0.08, -0.11, -0.01]} castShadow>
          <boxGeometry args={[0.14, 0.22, 0.2]} />
          <meshStandardMaterial color="#242033" roughness={0.75} />
        </mesh>
      </group>

      {/* 5. Left Arm & Field Scanner Datapad */}
      <group ref={leftArmRef} position={[-0.22, 0.93, 0]}>
        {/* Shoulder Epaulet */}
        <mesh position={[0, -0.04, 0]} castShadow>
          <boxGeometry args={[0.11, 0.1, 0.14]} />
          <meshStandardMaterial color="#332c45" roughness={0.7} />
        </mesh>
        {/* Upper Arm Sleeve */}
        <mesh position={[0, -0.16, 0]} castShadow>
          <boxGeometry args={[0.09, 0.18, 0.11]} />
          <meshStandardMaterial color="#2b273b" roughness={0.7} />
        </mesh>
        {/* Forearm & Cuff */}
        <mesh position={[0, -0.32, 0.02]} castShadow>
          <boxGeometry args={[0.085, 0.16, 0.1]} />
          <meshStandardMaterial color="#221e30" roughness={0.75} />
        </mesh>
        {/* Archival Wrist Scanner / Datapad */}
        <mesh position={[-0.035, -0.31, 0.03]}>
          <boxGeometry args={[0.03, 0.09, 0.07]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-0.052, -0.31, 0.03]}>
          <boxGeometry args={[0.008, 0.06, 0.045]} />
          <meshStandardMaterial
            color="#0891b2"
            emissive="#00f0ff"
            emissiveIntensity={1.1}
            roughness={0.2}
          />
        </mesh>
        {/* Gloved Hand */}
        <mesh position={[0, -0.42, 0.03]} castShadow>
          <boxGeometry args={[0.075, 0.09, 0.08]} />
          <meshStandardMaterial color="#1a1824" roughness={0.8} />
        </mesh>
      </group>

      {/* 6. Right Arm */}
      <group ref={rightArmRef} position={[0.22, 0.93, 0]}>
        {/* Shoulder Epaulet */}
        <mesh position={[0, -0.04, 0]} castShadow>
          <boxGeometry args={[0.11, 0.1, 0.14]} />
          <meshStandardMaterial color="#332c45" roughness={0.7} />
        </mesh>
        {/* Upper Arm Sleeve */}
        <mesh position={[0, -0.16, 0]} castShadow>
          <boxGeometry args={[0.09, 0.18, 0.11]} />
          <meshStandardMaterial color="#2b273b" roughness={0.7} />
        </mesh>
        {/* Forearm & Cuff */}
        <mesh position={[0, -0.32, 0.02]} castShadow>
          <boxGeometry args={[0.085, 0.16, 0.1]} />
          <meshStandardMaterial color="#221e30" roughness={0.75} />
        </mesh>
        {/* Gloved Hand */}
        <mesh position={[0, -0.42, 0.03]} castShadow>
          <boxGeometry args={[0.075, 0.09, 0.08]} />
          <meshStandardMaterial color="#1a1824" roughness={0.8} />
        </mesh>
      </group>

      {/* 7. Explorer Archival Field Pack */}
      <group position={[0, 0.82, -0.14]}>
        {/* Main Canvas Pack Body */}
        <mesh castShadow>
          <boxGeometry args={[0.25, 0.28, 0.12]} />
          <meshStandardMaterial color="#1c1926" roughness={0.85} />
        </mesh>
        {/* Top Flap */}
        <mesh position={[0, 0.12, 0.01]} castShadow>
          <boxGeometry args={[0.26, 0.08, 0.13]} />
          <meshStandardMaterial color="#2a2338" roughness={0.8} />
        </mesh>
        {/* Rolled Canvas Bedroll / Archive Tube on Top */}
        <mesh position={[0, 0.18, -0.01]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.042, 0.042, 0.27, 8]} />
          <meshStandardMaterial color="#3f374e" roughness={0.8} />
        </mesh>
        {/* Brass Buckle Accents */}
        {[-0.06, 0.06].map((xPos, idx) => (
          <mesh key={`buckle-${idx}`} position={[xPos, 0.04, -0.065]}>
            <boxGeometry args={[0.035, 0.045, 0.01]} />
            <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
          </mesh>
        ))}
      </group>

      {/* 8. Stylized Head, Neck & Explorer Visor */}
      {/* Sleek Neck */}
      <mesh position={[0, 1.02, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.075, 0.09, 8]} />
        <meshStandardMaterial color="#221e30" roughness={0.8} />
      </mesh>
      {/* Faceted Head */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.2, 0.22, 0.2]} />
        <meshStandardMaterial color="#dfd7c8" roughness={0.65} />
      </mesh>
      {/* Stylized Explorer Cowl / Hood */}
      <mesh position={[0, 1.22, -0.02]} castShadow>
        <boxGeometry args={[0.22, 0.14, 0.22]} />
        <meshStandardMaterial color="#1e1a2b" roughness={0.75} />
      </mesh>
      {/* Low-Poly Retro Cyan Visor */}
      <mesh position={[0, 1.15, 0.106]}>
        <boxGeometry args={[0.18, 0.048, 0.02]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#00f0ff"
          emissiveIntensity={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* 9. Left Leg, Knee Joint & Contoured Field Boot */}
      <group ref={leftLegRef} position={[-0.09, 0.47, 0]}>
        {/* Tapered Thigh Trouser */}
        <mesh position={[0, -0.13, 0]} castShadow>
          <boxGeometry args={[0.11, 0.26, 0.12]} />
          <meshStandardMaterial color="#1e1b29" roughness={0.8} />
        </mesh>
        {/* Knee Joint Fabric Patch */}
        <mesh position={[0, -0.27, 0.01]} castShadow>
          <boxGeometry args={[0.105, 0.06, 0.115]} />
          <meshStandardMaterial color="#282336" roughness={0.75} />
        </mesh>
        {/* Lower Leg Boot Shaft */}
        <mesh position={[0, -0.36, 0.01]} castShadow>
          <boxGeometry args={[0.1, 0.14, 0.12]} />
          <meshStandardMaterial color="#16131f" roughness={0.7} />
        </mesh>
        {/* Contoured Leather Boot & Sole */}
        <mesh position={[0, -0.44, 0.03]} castShadow>
          <boxGeometry args={[0.105, 0.08, 0.17]} />
          <meshStandardMaterial color="#120f1a" roughness={0.65} />
        </mesh>
      </group>

      {/* 10. Right Leg, Knee Joint & Contoured Field Boot */}
      <group ref={rightLegRef} position={[0.09, 0.47, 0]}>
        {/* Tapered Thigh Trouser */}
        <mesh position={[0, -0.13, 0]} castShadow>
          <boxGeometry args={[0.11, 0.26, 0.12]} />
          <meshStandardMaterial color="#1e1b29" roughness={0.8} />
        </mesh>
        {/* Knee Joint Fabric Patch */}
        <mesh position={[0, -0.27, 0.01]} castShadow>
          <boxGeometry args={[0.105, 0.06, 0.115]} />
          <meshStandardMaterial color="#282336" roughness={0.75} />
        </mesh>
        {/* Lower Leg Boot Shaft */}
        <mesh position={[0, -0.36, 0.01]} castShadow>
          <boxGeometry args={[0.1, 0.14, 0.12]} />
          <meshStandardMaterial color="#16131f" roughness={0.7} />
        </mesh>
        {/* Contoured Leather Boot & Sole */}
        <mesh position={[0, -0.44, 0.03]} castShadow>
          <boxGeometry args={[0.105, 0.08, 0.17]} />
          <meshStandardMaterial color="#120f1a" roughness={0.65} />
        </mesh>
      </group>

      {/* 11. Soft Contact Ground AO Shadow Decal */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.38} />
      </mesh>
    </group>
  );
};
