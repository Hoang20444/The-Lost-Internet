import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';

export const DustParticles: React.FC = () => {
  const bloomParticles = useGameStore((state) => state.bloomParticles);
  const lampOn = useGameStore((state) => state.lampOn);
  const pointsRef = useRef<THREE.Points>(null);

  // Localized subtle dust motes floating gently in workstation light & window beam
  const particleCount = 45;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      if (i < 30) {
        // Pool around workstation desk lamp
        pos[i * 3] = -1.2 + (Math.random() - 0.5) * 1.8;
        pos[i * 3 + 1] = 0.8 + Math.random() * 1.5;
        pos[i * 3 + 2] = -2.2 + (Math.random() - 0.5) * 1.4;
      } else {
        // Pool along window moonlight shaft
        pos[i * 3] = -3.2 + (Math.random() - 0.5) * 1.2;
        pos[i * 3 + 1] = 1.0 + Math.random() * 1.8;
        pos[i * 3 + 2] = -0.5 + (Math.random() - 0.5) * 1.5;
      }
    }
    return pos;
  }, [particleCount]);

  useFrame(({ clock }) => {
    if (!bloomParticles || !pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Very slow, organic drift
      posArray[idx + 1] += Math.sin(t * 0.4 + i) * 0.0012;
      posArray[idx] += Math.cos(t * 0.3 + i) * 0.0008;

      // Wrap subtly around workstation bounds
      if (posArray[idx + 1] > 2.6) posArray[idx + 1] = 0.8;
      if (posArray[idx + 1] < 0.7) posArray[idx + 1] = 2.5;
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
        size={0.035}
        color={lampOn ? '#fef08a' : '#7dd3fc'}
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
