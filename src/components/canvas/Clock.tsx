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

  // Compute rotational angles for clock hands (clockwise is negative Z in this orientation)
  const hourAngle = -((clockTime.hours % 12) + clockTime.minutes / 60) * ((Math.PI * 2) / 12);
  const minuteAngle = -(clockTime.minutes / 60) * (Math.PI * 2);

  useFrame(({ clock }) => {
    if (secondHandRef.current) {
      const elapsed = clock.getElapsedTime();
      const seconds = Math.floor(elapsed % 60);
      secondHandRef.current.rotation.z = -seconds * ((Math.PI * 2) / 60);
    }
  });

  return (
    <group position={[0.8, 2.3, -3.64]} rotation={[0, 0, 0]}>
      {/* Outer Polished Mahogany Wooden Bezel */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.52, 0.52, 0.07, 32]} />
        <meshStandardMaterial
          color="#38291f"
          roughness={0.4}
          metalness={0.2}
          emissive={isTargeted ? '#e0b0ff' : '#000000'}
          emissiveIntensity={isTargeted ? 0.3 : 0}
        />
      </mesh>

      {/* Inner Stepped Brass Rim */}
      <mesh position={[0, 0, 0.038]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.02, 32]} />
        <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Aged Ivory / Cream Dial Face */}
      <mesh position={[0, 0, 0.049]}>
        <circleGeometry args={[0.45, 32]} />
        <meshStandardMaterial
          color={clockSolved ? '#f3e8ff' : '#faf6ef'}
          roughness={0.85}
        />
      </mesh>

      {/* 12 Hour tick markings */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const isMajor = i % 3 === 0;
        const r = 0.38;
        const x = Math.sin(angle) * r;
        const y = Math.cos(angle) * r;
        return (
          <mesh
            key={`hour-tick-${i}`}
            position={[x, y, 0.052]}
            rotation={[0, 0, -angle]}
          >
            <boxGeometry args={[0.022, isMajor ? 0.07 : 0.035, 0.005]} />
            <meshStandardMaterial color={clockSolved ? '#9333ea' : '#1e293b'} />
          </mesh>
        );
      })}

      {/* Center Brass Hub */}
      <mesh position={[0, 0, 0.065]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.03, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Hour Hand */}
      <group position={[0, 0, 0.058]} rotation={[0, 0, hourAngle]}>
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[0.03, 0.22, 0.006]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
      </group>

      {/* Minute Hand */}
      <group position={[0, 0, 0.062]} rotation={[0, 0, minuteAngle]}>
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.02, 0.32, 0.006]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
      </group>

      {/* Second Hand (Ticking) */}
      <group ref={secondHandRef} position={[0, 0, 0.068]}>
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.008, 0.34, 0.004]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>
    </group>
  );
};
