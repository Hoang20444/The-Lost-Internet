import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';

export const Door: React.FC = () => {
  const doorLocked = useGameStore((state) => state.doorLocked);
  const activeInteractable = useGameStore((state) => state.activeInteractable);
  const isTargeted = activeInteractable?.id === 'door';

  const doorHingeRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (doorHingeRef.current) {
      // Smooth, weighty pneumatic swing: 0 rad when locked, -1.3 rad when unlocked
      const targetRotation = doorLocked ? 0 : -1.3;
      doorHingeRef.current.rotation.y = THREE.MathUtils.damp(
        doorHingeRef.current.rotation.y,
        targetRotation,
        3.0,
        delta
      );
    }
  });

  return (
    <group position={[4.26, 0, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
      {/* ================= REINFORCED AIRLOCK FRAME ================= */}
      {/* Left jamb */}
      <mesh position={[-1.02, 1.4, 0]} castShadow>
        <boxGeometry args={[0.16, 2.8, 0.26]} />
        <meshStandardMaterial color="#1e2430" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Right jamb */}
      <mesh position={[1.02, 1.4, 0]} castShadow>
        <boxGeometry args={[0.16, 2.8, 0.26]} />
        <meshStandardMaterial color="#1e2430" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Header lintel */}
      <mesh position={[0, 2.84, 0]} castShadow>
        <boxGeometry args={[2.2, 0.16, 0.26]} />
        <meshStandardMaterial color="#1e2430" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Heavy threshold plate */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.08, 0.26]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Electronic Keypad / Status Pillar on right jamb */}
      <group position={[1.18, 1.45, 0.14]}>
        {/* Enclosure casing */}
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.42, 0.06]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive={isTargeted ? '#ff3366' : '#000000'}
            emissiveIntensity={isTargeted ? 0.25 : 0}
          />
        </mesh>
        {/* Dual-State Status LED Bar */}
        <mesh position={[0, 0.12, 0.035]}>
          <boxGeometry args={[0.1, 0.035, 0.012]} />
          <meshStandardMaterial
            color={doorLocked ? '#ef4444' : '#10b981'}
            emissive={doorLocked ? '#ff1e56' : '#00ff99'}
            emissiveIntensity={2.0}
            roughness={0.1}
          />
        </mesh>
        {/* Rubberized Keypad Buttons */}
        {[-0.04, 0, 0.04].map((btnY, i) => (
          <mesh key={`keypad-row-${i}`} position={[0, btnY - 0.04, 0.034]}>
            <boxGeometry args={[0.09, 0.024, 0.01]} />
            <meshStandardMaterial color="#475569" roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* ================= HINGED BLAST DOOR SLAB ================= */}
      {/* Pivot anchor positioned at left jamb inner edge */}
      <group ref={doorHingeRef} position={[-0.92, 0, 0]}>
        {/* Door slab centered on pivot offset */}
        <group position={[0.92, 1.4, 0]}>
          {/* Main heavy armor plate */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.84, 2.68, 0.12]} />
            <meshStandardMaterial
              color="#2a3346"
              metalness={0.65}
              roughness={0.4}
              emissive={isTargeted ? '#3b82f6' : '#000000'}
              emissiveIntensity={isTargeted ? 0.12 : 0}
            />
          </mesh>

          {/* Heavy reinforcement crossbars */}
          <mesh position={[0, 0.65, 0.065]}>
            <boxGeometry args={[1.65, 0.08, 0.03]} />
            <meshStandardMaterial color="#1e2736" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.65, 0.065]}>
            <boxGeometry args={[1.65, 0.08, 0.03]} />
            <meshStandardMaterial color="#1e2736" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.065]}>
            <boxGeometry args={[1.65, 0.08, 0.03]} />
            <meshStandardMaterial color="#1e2736" metalness={0.8} />
          </mesh>

          {/* Mechanical locking deadbolt cylinders */}
          <mesh position={[0.9, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          <mesh position={[0.9, -0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>

          {/* Heavy industrial grab handle */}
          <group position={[0.68, 0, 0.08]}>
            <mesh position={[0, 0, 0.04]} castShadow>
              <cylinderGeometry args={[0.018, 0.018, 0.28, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.12, 0.02]}>
              <boxGeometry args={[0.03, 0.04, 0.04]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.12, 0.02]}>
              <boxGeometry args={[0.03, 0.04, 0.04]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
          </group>

          {/* Stenciled Hazard Warning Badge */}
          <mesh position={[0, 0.32, 0.066]}>
            <planeGeometry args={[0.55, 0.18]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive={doorLocked ? '#dc2626' : '#059669'}
              emissiveIntensity={0.35}
              roughness={0.8}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
