import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';

export const WindowView: React.FC = () => {
  const rainRef = useRef<THREE.Points>(null);
  const activeInteractable = useGameStore((state) => state.activeInteractable);
  const isTargeted = activeInteractable?.id === 'window';

  // Rain particles outside window
  const rainCount = 140;
  const rainPositions = useMemo(() => {
    const pos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      pos[i * 3] = -4.5 - Math.random() * 2.0;
      pos[i * 3 + 1] = Math.random() * 4.5;
      pos[i * 3 + 2] = -0.5 + (Math.random() - 0.5) * 3.0;
    }
    return pos;
  }, [rainCount]);

  useFrame((_, delta) => {
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= delta * 7.0;
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 4.5;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Skyscraper silhouettes in background
  const buildings = useMemo(() => {
    return [
      { x: -9.5, z: -2.4, width: 1.4, height: 6.2, depth: 1.4, color: '#090d18', neon: '#0284c7' },
      { x: -10.5, z: -0.8, width: 1.8, height: 7.8, depth: 1.6, color: '#070b14', neon: '#7c3aed' },
      { x: -9.2, z: 0.6, width: 1.2, height: 5.2, depth: 1.2, color: '#090e1a', neon: '#0ea5e9' },
      { x: -11.0, z: 1.8, width: 1.9, height: 6.5, depth: 1.7, color: '#060910', neon: '#0284c7' },
    ];
  }, []);

  return (
    <group position={[-4.26, 1.9, -0.5]}>
      {/* Outer steel window sill */}
      <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.12, 2.5]} />
        <meshStandardMaterial color="#1a1e29" roughness={0.7} />
      </mesh>
      {/* Outer top header */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.22, 0.12, 2.5]} />
        <meshStandardMaterial color="#1a1e29" roughness={0.7} />
      </mesh>
      {/* Outer side jambs */}
      <mesh position={[0, 0, -1.2]}>
        <boxGeometry args={[0.22, 2.4, 0.12]} />
        <meshStandardMaterial color="#1a1e29" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 1.2]}>
        <boxGeometry args={[0.22, 2.4, 0.12]} />
        <meshStandardMaterial color="#1a1e29" roughness={0.7} />
      </mesh>

      {/* Center cross mullions */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.1, 2.3, 0.05]} />
        <meshStandardMaterial color="#141824" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.1, 0.05, 2.35]} />
        <meshStandardMaterial color="#141824" roughness={0.6} />
      </mesh>

      {/* Glass Pane facing inward onto room */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.36, 2.3]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.35}
          emissive={isTargeted ? '#38bdf8' : '#000000'}
          emissiveIntensity={isTargeted ? 0.22 : 0}
        />
      </mesh>

      {/* Distant moon */}
      <mesh position={[-6.8, 3.4, -1.5]}>
        <circleGeometry args={[0.55, 32]} />
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
          opacity={0.6}
        />
      </points>

      {/* Cyberpunk Skyscraper Silhouettes */}
      {buildings.map((b, idx) => (
        <group key={`window-bldg-${idx}`} position={[b.x + 4.2, b.height / 2 - 2.2, b.z]}>
          <mesh>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial color={b.color} roughness={0.9} />
          </mesh>
          {/* Subtle glowing neon window bands */}
          {[-0.8, 0.3, 1.2].map((hOffset, bandIdx) => (
            <mesh key={`window-band-${bandIdx}`} position={[0.62, hOffset, 0]}>
              <boxGeometry args={[0.05, 0.1, b.depth * 0.7]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive={b.neon}
                emissiveIntensity={1.2}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Distant city fog glow */}
      <mesh position={[-7.5, -1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 5]} />
        <meshBasicMaterial
          color="#082f49"
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
};
