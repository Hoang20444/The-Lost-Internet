import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';

export const Clock: React.FC = () => {
  const clockTime = useGameStore((state) => state.clockTime);
  const activeInteractable = useGameStore((state) => state.activeInteractable);
  const clockSolved = useGameStore((state) => state.clockSolved);
  const isTargeted = activeInteractable?.id === 'clock';

  const secondHandRef = useRef<THREE.Group>(null);

  // Compute angles for hours and minutes
  const hourAngle = -((clockTime.hours % 12) + clockTime.minutes / 60) * ((Math.PI * 2) / 12);
  const minuteAngle = -(clockTime.minutes / 60) * (Math.PI * 2);

  useFrame(({ clock }) => {
    if (secondHandRef.current) {
      const elapsed = clock.getElapsedTime();
      // Tick per second
      const seconds = Math.floor(elapsed % 60);
      secondHandRef.current.rotation.z = -seconds * ((Math.PI * 2) / 60);
    }
  });

  return (
    <group position={[-0.2, 2.5, -4.96]} rotation={[0, 0, 0]}>
      {/* Outer Wooden/Brass Bezel */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.54, 0.54, 0.08, 32]} />
        <meshStandardMaterial
          color="#3f2e1e"
          roughness={0.5}
          metalness={0.3}
          emissive={isTargeted ? '#e0b0ff' : '#000000'}
          emissiveIntensity={isTargeted ? 0.25 : 0}
        />
      </mesh>

      {/* Inner Brass Rim */}
      <mesh position={[0, 0, 0.042]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.02, 32]} />
        <meshStandardMaterial color="#c5a059" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Clock Dial Face */}
      <mesh position={[0, 0, 0.054]}>
        <circleGeometry args={[0.47, 32]} />
        <meshStandardMaterial
          color={clockSolved ? '#f3e8ff' : '#faf5ed'}
          roughness={0.9}
        />
      </mesh>

      {/* 12 Hour tick markers around dial */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const isMajor = i % 3 === 0;
        const r = 0.4;
        const x = Math.sin(angle) * r;
        const y = Math.cos(angle) * r;
        return (
          <mesh
            key={`tick-${i}`}
            position={[x, y, 0.058]}
            rotation={[0, 0, -angle]}
          >
            <boxGeometry args={[0.02, isMajor ? 0.07 : 0.04, 0.005]} />
            <meshStandardMaterial color={clockSolved ? '#9333ea' : '#1e293b'} />
          </mesh>
        );
      })}

      {/* Center Brass Pivot */}
      <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.03, 16]} />
        <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Hour Hand */}
      <group position={[0, 0, 0.062]} rotation={[0, 0, hourAngle]}>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.032, 0.24, 0.006]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
      </group>

      {/* Minute Hand */}
      <group position={[0, 0, 0.066]} rotation={[0, 0, minuteAngle]}>
        <mesh position={[0, 0.17, 0]}>
          <boxGeometry args={[0.022, 0.34, 0.006]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
      </group>

      {/* Second Hand (Ticking) */}
      <group ref={secondHandRef} position={[0, 0, 0.072]}>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.008, 0.38, 0.004]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>
    </group>
  );
};
