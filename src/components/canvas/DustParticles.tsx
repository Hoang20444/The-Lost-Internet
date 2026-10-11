import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';

export const DustParticles: React.FC = () => {
  const bloomParticles = useGameStore((state) => state.bloomParticles);
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = 75;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8.5; // X: -4.2 to 4.2
      pos[i * 3 + 1] = 0.5 + Math.random() * 3.2; // Y: 0.5 to 3.7
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8.5; // Z: -4.2 to 4.2
    }
    return pos;
  }, [particleCount]);

  useFrame(({ clock }) => {
    if (!bloomParticles || !pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Gentle floating oscillation
      posArray[idx + 1] += Math.sin(t * 0.8 + i) * 0.002;
      posArray[idx] += Math.cos(t * 0.5 + i) * 0.0015;

      // Wrap vertically
      if (posArray[idx + 1] > 3.9) posArray[idx + 1] = 0.4;
      if (posArray[idx + 1] < 0.3) posArray[idx + 1] = 3.8;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!bloomParticles) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#a5f3fc"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
