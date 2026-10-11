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
    if (reel1Ref.current) reel1Ref.current.rotation.z = t * 1.5;
    if (reel2Ref.current) reel2Ref.current.rotation.z = -t * 1.8;

    if (ledsRef.current) {
      ledsRef.current.children.forEach((child, idx) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        const blink = Math.sin(t * (4 + idx * 1.7)) > 0.1;
        mat.color.set(blink ? (idx % 2 === 0 ? '#38bdf8' : '#a855f7') : '#1e1b4b');
      });
    }
  });

  return (
    <group position={[3.4, 0, -3.4]}>
      {/* Outer steel cabinet */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 2.5, 0.8]} />
        <meshStandardMaterial
          color="#1e2230"
          metalness={0.7}
          roughness={0.35}
          emissive={isTargeted ? '#a78bfa' : '#000000'}
          emissiveIntensity={isTargeted ? 0.25 : 0}
        />
      </mesh>

      {/* Front Recessed Equipment Bay */}
      <mesh position={[0, 1.25, 0.38]}>
        <boxGeometry args={[1.04, 2.34, 0.08]} />
        <meshStandardMaterial color="#0c0e17" roughness={0.8} />
      </mesh>

      {/* Top Section: Magnetic Tape Reels */}
      <group position={[0, 1.95, 0.43]}>
        {/* Left Tape Reel */}
        <group ref={reel1Ref} position={[-0.24, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.015]}>
            <circleGeometry args={[0.07, 12]} />
            <meshBasicMaterial color="#94a3b8" />
          </mesh>
        </group>

        {/* Right Tape Reel */}
        <group ref={reel2Ref} position={[0.24, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.015]}>
            <circleGeometry args={[0.07, 12]} />
            <meshBasicMaterial color="#94a3b8" />
          </mesh>
        </group>
      </group>

      {/* Middle Section: Blinking LED diagnostic matrix */}
      <group ref={ledsRef} position={[0, 1.35, 0.43]}>
        {[-0.35, -0.2, -0.05, 0.1, 0.25, 0.35].map((x, i) => (
          <mesh key={`led-${i}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.04, 0.04, 0.01]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        ))}
      </group>

      {/* Bottom Section: Disk units and ventilation slots */}
      <group position={[0, 0.7, 0.43]}>
        {[-0.2, 0, 0.2].map((y, idx) => (
          <mesh key={`slot-${idx}`} position={[0, y, 0]}>
            <boxGeometry args={[0.9, 0.12, 0.02]} />
            <meshStandardMaterial color="#1a202c" metalness={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
