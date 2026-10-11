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
      // If unlocked, swing open outwards (-1.35 radians), otherwise shut (0 radians)
      const targetRotation = doorLocked ? 0 : -1.35;
      doorHingeRef.current.rotation.y = THREE.MathUtils.damp(
        doorHingeRef.current.rotation.y,
        targetRotation,
        3.5,
        delta
      );
    }
  });

  return (
    <group position={[4.95, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Outer Door Frame - Metal Archway */}
      {/* Left frame jamb */}
      <mesh position={[-1.05, 1.4, 0]} castShadow>
        <boxGeometry args={[0.15, 2.8, 0.28]} />
        <meshStandardMaterial color="#1e2433" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Right frame jamb */}
      <mesh position={[1.05, 1.4, 0]} castShadow>
        <boxGeometry args={[0.15, 2.8, 0.28]} />
        <meshStandardMaterial color="#1e2433" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Header frame */}
      <mesh position={[0, 2.85, 0]} castShadow>
        <boxGeometry args={[2.25, 0.16, 0.28]} />
        <meshStandardMaterial color="#1e2433" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Threshold step */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[2.25, 0.08, 0.28]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Electronic Keypad / Status Pillar on right frame */}
      <group position={[1.2, 1.45, 0.14]}>
        {/* Terminal panel backing */}
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.42, 0.06]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive={isTargeted ? '#ff3366' : '#000000'}
            emissiveIntensity={isTargeted ? 0.2 : 0}
          />
        </mesh>
        {/* Status LED Light */}
        <mesh position={[0, 0.12, 0.035]}>
          <boxGeometry args={[0.1, 0.04, 0.015]} />
          <meshStandardMaterial
            color={doorLocked ? '#ef4444' : '#10b981'}
            emissive={doorLocked ? '#ff1e56' : '#00ff99'}
            emissiveIntensity={1.8}
            roughness={0.1}
          />
        </mesh>
        {/* Keypad mini buttons */}
        {[-0.04, 0, 0.04].map((btnY, i) => (
          <mesh key={`btn-${i}`} position={[0, btnY - 0.04, 0.034]}>
            <boxGeometry args={[0.09, 0.024, 0.01]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ================= HINGED DOOR SLAB ================= */}
      {/* Hinge anchor positioned at left edge */}
      <group ref={doorHingeRef} position={[-0.95, 0, 0]}>
        {/* Main heavy door slab (offset so pivot is on the edge) */}
        <group position={[0.95, 1.4, 0]}>
          {/* Main heavy metal slab */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.9, 2.7, 0.12]} />
            <meshStandardMaterial
              color="#2a334a"
              metalness={0.65}
              roughness={0.4}
              emissive={isTargeted ? '#3b82f6' : '#000000'}
              emissiveIntensity={isTargeted ? 0.1 : 0}
            />
          </mesh>

          {/* Heavy diagonal reinforcement ribs */}
          <mesh position={[0, 0.65, 0.065]}>
            <boxGeometry args={[1.7, 0.08, 0.03]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.65, 0.065]}>
            <boxGeometry args={[1.7, 0.08, 0.03]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.065]}>
            <boxGeometry args={[1.7, 0.08, 0.03]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>

          {/* Heavy industrial handle */}
          <group position={[0.72, 0, 0.08]}>
            <mesh position={[0, 0, 0.04]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
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

          {/* Door warning stencil badge */}
          <mesh position={[0, 0.32, 0.065]}>
            <planeGeometry args={[0.6, 0.2]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive={doorLocked ? '#dc2626' : '#059669'}
              emissiveIntensity={0.4}
              roughness={0.8}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
