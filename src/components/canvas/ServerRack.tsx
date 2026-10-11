import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';

export const ServerRack: React.FC = () => {
  const activeInteractable = useGameStore((state) => state.activeInteractable);
  const isTargeted = activeInteractable?.id === 'notes';

  const reel1Ref = useRef<THREE.Group>(null);
  const reel2Ref = useRef<THREE.Group>(null);
  const ledsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (reel1Ref.current) reel1Ref.current.rotation.z = t * 1.4;
    if (reel2Ref.current) reel2Ref.current.rotation.z = -t * 1.6;

    if (ledsRef.current) {
      ledsRef.current.children.forEach((child, idx) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        const blink = Math.sin(t * (3.5 + idx * 1.4)) > 0.15;
        mat.color.set(blink ? (idx % 2 === 0 ? '#38bdf8' : '#818cf8') : '#1e1b4b');
      });
    }
  });

  return (
    <group position={[2.6, 0, -3.0]}>
      {/* Outer Industrial Steel Cabinet */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 2.5, 0.75]} />
        <meshStandardMaterial
          color="#1c212e"
          metalness={0.7}
          roughness={0.35}
          emissive={isTargeted ? '#a78bfa' : '#000000'}
          emissiveIntensity={isTargeted ? 0.25 : 0}
        />
      </mesh>

      {/* Recessed Equipment Bay */}
      <mesh position={[0, 1.25, 0.36]}>
        <boxGeometry args={[1.04, 2.34, 0.08]} />
        <meshStandardMaterial color="#0b0e16" roughness={0.8} />
      </mesh>

      {/* Top Section: Dual Magnetic Tape Drive */}
      <group position={[0, 1.95, 0.41]}>
        {/* Left Tape Reel */}
        <group ref={reel1Ref} position={[-0.24, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.02, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.015]}>
            <circleGeometry args={[0.07, 12]} />
            <meshBasicMaterial color="#94a3b8" />
          </mesh>
        </group>

        {/* Right Tape Reel */}
        <group ref={reel2Ref} position={[0.24, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.02, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.015]}>
            <circleGeometry args={[0.07, 12]} />
            <meshBasicMaterial color="#94a3b8" />
          </mesh>
        </group>
      </group>

      {/* Middle Section: Blinking LED matrix */}
      <group ref={ledsRef} position={[0, 1.35, 0.41]}>
        {[-0.35, -0.21, -0.07, 0.07, 0.21, 0.35].map((x, i) => (
          <mesh key={`rack-led-${i}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.04, 0.04, 0.01]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        ))}
      </group>

      {/* Bottom Section: Ventilation slots & drive bays */}
      <group position={[0, 0.7, 0.41]}>
        {[-0.2, 0, 0.2].map((y, idx) => (
          <mesh key={`bay-${idx}`} position={[0, y, 0]}>
            <boxGeometry args={[0.9, 0.12, 0.02]} />
            <meshStandardMaterial color="#171e2c" metalness={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
