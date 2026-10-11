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
  const stepTriggeredRef = useRef<boolean>(false);
  const lookTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.22, -1.05));

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

  // Helper to reset all movement keys
  const clearKeys = () => {
    keysRef.current = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };
  };

  // Reset keys whenever paused or when modal state changes
  useEffect(() => {
    if (isPaused || activeModal) {
      clearKeys();
      setPlayerMoving(false);
    }
  }, [isPaused, activeModal, setPlayerMoving]);

  // Setup robust keyboard and window focus event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore movement if game is paused or any modal is active
      if (isPaused || activeModal) return;

      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

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
      // Always allow key releases to clear state cleanly regardless of modal/pause
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

    // Robust focus loss handlers: clear all keys when window loses focus or document is hidden
    const handleBlur = () => {
      clearKeys();
      setPlayerMoving(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearKeys();
        setPlayerMoving(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeModal, isPaused, setPlayerMoving]);

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
      stepTriggeredRef.current = false;
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

      // Smooth shortest-arc turning towards movement direction (prevents 360 wrap-around spins)
      const targetAngle = Math.atan2(moveX, moveZ);
      const currentRot = playerGroupRef.current.rotation.y;
      let angleDiff = (targetAngle - currentRot) % (Math.PI * 2);
      if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

      const newRot = currentRot + angleDiff * (1 - Math.exp(-14 * delta));
      playerGroupRef.current.rotation.y = newRot;
      setPlayerRotation(newRot);

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

      // Walking gait: coordinated natural leg swing and opposing arm swing
      footstepTimerRef.current += delta * 10;
      const sinWave = Math.sin(footstepTimerRef.current);
      const legSwing = sinWave * 0.38;
      const armSwing = sinWave * 0.32;

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = legSwing;
        rightLegRef.current.rotation.x = -legSwing;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -armSwing;
        rightArmRef.current.rotation.x = armSwing;
      }
      if (coatTailsRef.current) {
        coatTailsRef.current.rotation.x = 0.12 + Math.abs(legSwing) * 0.22;
      }

      // Single-trigger footstep sound with latch hysteresis (prevents rapid audio machine-gunning)
      if (sinWave > 0.85 && !stepTriggeredRef.current) {
        soundManager.playFootstep();
        stepTriggeredRef.current = true;
      } else if (sinWave < 0.2) {
        stepTriggeredRef.current = false;
      }

      setPlayerPosition([nextX, playerGroupRef.current.position.y, nextZ]);
    } else {
      // Return smoothly to balanced neutral stance
      stepTriggeredRef.current = false;
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

    // ================= CINEMATIC THREE-QUARTER ISOMETRIC CAMERA =================
    // Moderately elevated, closer to player, framing the room's 3 key focal points
    const px = playerGroupRef.current.position.x;
    const pz = playerGroupRef.current.position.z;

    // Follow player smoothly while staying bounded within the room's cinematic envelope
    const targetCamX = THREE.MathUtils.clamp(px * 0.45 + 0.1, -1.65, 1.65);
    const targetCamY = 3.75;
    const targetCamZ = THREE.MathUtils.clamp(pz * 0.42 + 4.4, 3.5, 4.9);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 3.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 3.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 3.5, delta);

    // Smoothly damped look-at target framing the player and room focal points
    const desiredLookX = px * 0.42 - 0.1;
    const desiredLookY = 1.22;
    const desiredLookZ = pz * 0.35 - 1.05;

    lookTargetRef.current.x = THREE.MathUtils.damp(lookTargetRef.current.x, desiredLookX, 4.0, delta);
    lookTargetRef.current.y = THREE.MathUtils.damp(lookTargetRef.current.y, desiredLookY, 4.0, delta);
    lookTargetRef.current.z = THREE.MathUtils.damp(lookTargetRef.current.z, desiredLookZ, 4.0, delta);

    camera.lookAt(lookTargetRef.current);

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
      {/* ================= COHESIVE SCULPTED LOW-POLY EXPLORER ================= */}

      {/* 1. Pelvis & Hip Core (Continuous anatomical connection to legs) */}
      <mesh position={[0, 0.54, 0]} castShadow>
        <boxGeometry args={[0.26, 0.12, 0.18]} />
        <meshStandardMaterial color="#1e1b2a" roughness={0.78} />
      </mesh>

      {/* 2. Tapered Explorer Duster Coat & Torso */}
      {/* Lower Waist Coat with Leather Belt */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.3, 0.14, 0.2]} />
        <meshStandardMaterial color="#262838" roughness={0.72} />
      </mesh>
      {/* Leather Field Belt with Brass Hardware */}
      <mesh position={[0, 0.60, 0.01]} castShadow>
        <boxGeometry args={[0.31, 0.045, 0.21]} />
        <meshStandardMaterial color="#382519" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.60, 0.118]}>
        <boxGeometry args={[0.065, 0.045, 0.015]} />
        <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Inverted Tapered Chest / Jacket (Broad shoulders tapering to waist) */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <boxGeometry args={[0.35, 0.26, 0.22]} />
        <meshStandardMaterial color="#262838" roughness={0.72} />
      </mesh>

      {/* Folded Coat Collar & High Cowl (Seamless transition to neck/head) */}
      <mesh position={[0, 0.96, 0.015]} castShadow>
        <boxGeometry args={[0.27, 0.09, 0.2]} />
        <meshStandardMaterial color="#35374d" roughness={0.75} />
      </mesh>

      {/* Diagonal Field Satchel Strap across chest */}
      <mesh position={[0, 0.79, 0.02]} rotation={[0, 0, 0.58]}>
        <boxGeometry args={[0.048, 0.36, 0.23]} />
        <meshStandardMaterial color="#382519" roughness={0.65} />
      </mesh>

      {/* 3. Dynamic Split Coat Tails (Pivoting at waist, sways backward during movement) */}
      <group ref={coatTailsRef} position={[0, 0.53, 0]}>
        {/* Left coat tail flap */}
        <mesh position={[-0.08, -0.11, -0.01]} castShadow>
          <boxGeometry args={[0.13, 0.22, 0.2]} />
          <meshStandardMaterial color="#202230" roughness={0.75} />
        </mesh>
        {/* Right coat tail flap */}
        <mesh position={[0.08, -0.11, -0.01]} castShadow>
          <boxGeometry args={[0.13, 0.22, 0.2]} />
          <meshStandardMaterial color="#202230" roughness={0.75} />
        </mesh>
      </group>

      {/* 4. Left Arm with True Shoulder Pivot & Integrated Forearm Datapad */}
      <group ref={leftArmRef} position={[-0.19, 0.94, 0]}>
        {/* Shoulder Joint Socket (Pivots seamlessly with zero visible gap) */}
        <mesh castShadow>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshStandardMaterial color="#2a2c3d" roughness={0.7} />
        </mesh>
        {/* Tapered Coat Sleeve */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.095, 0.32, 0.11]} />
          <meshStandardMaterial color="#262838" roughness={0.72} />
        </mesh>
        {/* Forearm Archival Datapad */}
        <mesh position={[-0.035, -0.24, 0.02]}>
          <boxGeometry args={[0.025, 0.1, 0.065]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Restrained Cyan Datapad Status Light */}
        <mesh position={[-0.05, -0.24, 0.02]}>
          <boxGeometry args={[0.006, 0.06, 0.035]} />
          <meshStandardMaterial
            color="#0891b2"
            emissive="#00f0ff"
            emissiveIntensity={0.85}
            roughness={0.2}
          />
        </mesh>
        {/* Gloved Hand */}
        <mesh position={[0, -0.4, 0.02]} castShadow>
          <boxGeometry args={[0.075, 0.09, 0.08]} />
          <meshStandardMaterial color="#1a1824" roughness={0.8} />
        </mesh>
      </group>

      {/* 5. Right Arm with True Shoulder Pivot */}
      <group ref={rightArmRef} position={[0.19, 0.94, 0]}>
        {/* Shoulder Joint Socket */}
        <mesh castShadow>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshStandardMaterial color="#2a2c3d" roughness={0.7} />
        </mesh>
        {/* Tapered Coat Sleeve */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.095, 0.32, 0.11]} />
          <meshStandardMaterial color="#262838" roughness={0.72} />
        </mesh>
        {/* Gloved Hand */}
        <mesh position={[0, -0.4, 0.02]} castShadow>
          <boxGeometry args={[0.075, 0.09, 0.08]} />
          <meshStandardMaterial color="#1a1824" roughness={0.8} />
        </mesh>
      </group>

      {/* 6. Compact Archival Field Satchel on Back */}
      <group position={[0, 0.81, -0.14]}>
        {/* Canvas Pack Body */}
        <mesh castShadow>
          <boxGeometry args={[0.25, 0.28, 0.12]} />
          <meshStandardMaterial color="#1d1b26" roughness={0.85} />
        </mesh>
        {/* Rolled Archive Map Cylinder on Top */}
        <mesh position={[0, 0.17, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.26, 8]} />
          <meshStandardMaterial color="#3e384c" roughness={0.8} />
        </mesh>
      </group>

      {/* 7. Stylized Faceted Explorer Head, Cowl & Forward-Facing Cyan Visor */}
      {/* Neck Stem */}
      <mesh position={[0, 1.02, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.075, 0.08, 8]} />
        <meshStandardMaterial color="#221e30" roughness={0.8} />
      </mesh>
      {/* Faceted Head Core */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.2, 0.22, 0.2]} />
        <meshStandardMaterial color="#ded7c8" roughness={0.65} />
      </mesh>
      {/* Stylized Explorer Cowl / Hood */}
      <mesh position={[0, 1.22, -0.015]} castShadow>
        <boxGeometry args={[0.22, 0.13, 0.22]} />
        <meshStandardMaterial color="#1c1926" roughness={0.75} />
      </mesh>
      {/* Restrained Forward-Facing Cyan Visor Band (+Z local face) */}
      <mesh position={[0, 1.15, 0.106]}>
        <boxGeometry args={[0.18, 0.048, 0.02]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#00f0ff"
          emissiveIntensity={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* 8. Left Leg with True Hip Pivot & Contoured Field Boot */}
      <group ref={leftLegRef} position={[-0.09, 0.49, 0]}>
        {/* Hip Joint Socket Ball */}
        <mesh castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#1a1824" roughness={0.8} />
        </mesh>
        {/* Tapered Trouser Thigh */}
        <mesh position={[0, -0.16, 0]} castShadow>
          <boxGeometry args={[0.11, 0.28, 0.12]} />
          <meshStandardMaterial color="#1a1824" roughness={0.8} />
        </mesh>
        {/* Contoured Leather Field Boot & Sole */}
        <mesh position={[0, -0.38, 0.025]} castShadow>
          <boxGeometry args={[0.105, 0.16, 0.17]} />
          <meshStandardMaterial color="#120f1a" roughness={0.65} />
        </mesh>
      </group>

      {/* 9. Right Leg with True Hip Pivot & Contoured Field Boot */}
      <group ref={rightLegRef} position={[0.09, 0.49, 0]}>
        {/* Hip Joint Socket Ball */}
        <mesh castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#1a1824" roughness={0.8} />
        </mesh>
        {/* Tapered Trouser Thigh */}
        <mesh position={[0, -0.16, 0]} castShadow>
          <boxGeometry args={[0.11, 0.28, 0.12]} />
          <meshStandardMaterial color="#1a1824" roughness={0.8} />
        </mesh>
        {/* Contoured Leather Field Boot & Sole */}
        <mesh position={[0, -0.38, 0.025]} castShadow>
          <boxGeometry args={[0.105, 0.16, 0.17]} />
          <meshStandardMaterial color="#120f1a" roughness={0.65} />
        </mesh>
      </group>

      {/* 10. Soft Contact Ground AO Shadow Decal */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.38} />
      </mesh>
    </group>
  );
};
