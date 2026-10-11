import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';

export const WindowView: React.FC = () => {
  const rainRef = useRef<THREE.Points>(null);
  const activeInteractable = useGameStore((state) => state.activeInteractable);
  const isTargeted = activeInteractable?.id === 'window';

  // Rain particles outside the window
  const rainCount = 180;
  const rainPositions = useMemo(() => {
    const pos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      pos[i * 3] = -5.2 - Math.random() * 2.2; // X outside window
      pos[i * 3 + 1] = Math.random() * 5.0; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3.6; // Z
    }
    return pos;
  }, [rainCount]);

  useFrame((_, delta) => {
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= delta * 7.5; // fall speed
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 5.0;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Skyscraper silhouettes in background
  const buildings = useMemo(() => {
    return [
      { x: -10.5, z: -2.2, width: 1.4, height: 6.5, depth: 1.4, color: '#090d1a', neon: '#06b6d4' },
      { x: -11.5, z: -0.6, width: 1.8, height: 8.2, depth: 1.6, color: '#070b16', neon: '#a855f7' },
      { x: -9.8, z: 0.8, width: 1.2, height: 5.4, depth: 1.2, color: '#090e1c', neon: '#3b82f6' },
      { x: -12.0, z: 2.0, width: 2.0, height: 7.0, depth: 1.8, color: '#060912', neon: '#06b6d4' },
      { x: -10.2, z: -3.4, width: 1.5, height: 4.8, depth: 1.5, color: '#0b0f1f', neon: '#8b5cf6' },
    ];
  }, []);

  return (
    <group position={[-4.98, 2.1, 0]}>
      {/* ================= WINDOW FRAME ================= */}
      {/* Outer wooden sill */}
      <mesh position={[0, -1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.12, 2.7]} />
        <meshStandardMaterial color="#1e2230" roughness={0.7} />
      </mesh>
      {/* Outer top header */}
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[0.26, 0.12, 2.7]} />
        <meshStandardMaterial color="#1e2230" roughness={0.7} />
      </mesh>
      {/* Outer side jambs */}
      <mesh position={[0, 0, -1.3]}>
        <boxGeometry args={[0.26, 2.5, 0.12]} />
        <meshStandardMaterial color="#1e2230" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 1.3]}>
        <boxGeometry args={[0.26, 2.5, 0.12]} />
        <meshStandardMaterial color="#1e2230" roughness={0.7} />
      </mesh>

      {/* Center cross mullions */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.12, 2.4, 0.06]} />
        <meshStandardMaterial color="#171a26" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.12, 0.06, 2.5]} />
        <meshStandardMaterial color="#171a26" roughness={0.6} />
      </mesh>

      {/* ================= GLASS PANE ================= */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[0.01, 2.4]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.3}
          emissive={isTargeted ? '#38bdf8' : '#000000'}
          emissiveIntensity={isTargeted ? 0.2 : 0}
        />
      </mesh>

      {/* ================= EXTERIOR NIGHT WORLD ================= */}
      <group position={[-0.5, 0, 0]}>
        {/* Distant moon */}
        <mesh position={[-7.5, 3.8, -1.8]}>
          <circleGeometry args={[0.65, 32]} />
          <meshBasicMaterial color="#e0f2fe" />
        </mesh>

        {/* Rain Particles outside */}
        <points ref={rainRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[rainPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.035}
            color="#7dd3fc"
            transparent
            opacity={0.65}
          />
        </points>

        {/* Cyberpunk Skyscraper Silhouettes */}
        {buildings.map((b, idx) => (
          <group key={`bldg-${idx}`} position={[b.x + 5.0, b.height / 2 - 2.5, b.z]}>
            <mesh>
              <boxGeometry args={[b.width, b.height, b.depth]} />
              <meshStandardMaterial color={b.color} roughness={0.9} />
            </mesh>
            {/* Glowing neon window bands on skyscraper */}
            {[-1.0, 0.2, 1.4].map((hOffset, bandIdx) => (
              <mesh key={`band-${bandIdx}`} position={[0.68, hOffset, 0]}>
                <boxGeometry args={[0.06, 0.12, b.depth * 0.7]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive={b.neon}
                  emissiveIntensity={1.4}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* Distant city fog glow */}
        <mesh position={[-8, -1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[14, 6]} />
          <meshBasicMaterial
            color="#082f49"
            transparent
            opacity={0.25}
          />
        </mesh>
      </group>
    </group>
  );
};
