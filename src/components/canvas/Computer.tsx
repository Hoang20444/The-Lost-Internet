import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';

export const Computer: React.FC = () => {
  const ledRef = useRef<THREE.Mesh>(null);
  const activeInteractable = useGameStore((state) => state.activeInteractable);
  const isTargeted = activeInteractable?.id === 'computer';

  useFrame(({ clock }) => {
    if (ledRef.current) {
      // Subtle blinking HDD activity LED
      const t = clock.getElapsedTime();
      const blink = Math.sin(t * 8) > 0.4 || Math.sin(t * 19) > 0.6;
      (ledRef.current.material as THREE.MeshBasicMaterial).color.set(
        blink ? '#22c55e' : '#052e16'
      );
    }
  });

  return (
    <group position={[-2.7, 0, -3.2]}>
      {/* ================= CRT MONITOR ================= */}
      <group position={[-0.1, 0.82, 0.05]}>
        {/* Monitor Base Stand */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <boxGeometry args={[0.38, 0.05, 0.35]} />
          <meshStandardMaterial color="#c2beab" roughness={0.7} />
        </mesh>
        {/* Swivel neck */}
        <mesh position={[0, 0.09, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.08, 10]} />
          <meshStandardMaterial color="#948f7f" roughness={0.8} />
        </mesh>
        {/* Main Monitor Beige Casing (CRT bulbous back) */}
        <mesh position={[0, 0.38, -0.06]} castShadow receiveShadow>
          <boxGeometry args={[0.74, 0.58, 0.52]} />
          <meshStandardMaterial
            color="#d4d0be"
            roughness={0.65}
            emissive={isTargeted ? '#00f0ff' : '#000000'}
            emissiveIntensity={isTargeted ? 0.15 : 0}
          />
        </mesh>
        {/* CRT Front Bezel */}
        <mesh position={[0, 0.38, 0.2]} castShadow>
          <boxGeometry args={[0.7, 0.54, 0.04]} />
          <meshStandardMaterial color="#bcb8a5" roughness={0.6} />
        </mesh>
        {/* CRT Glowing Screen */}
        <mesh position={[0, 0.39, 0.222]}>
          <planeGeometry args={[0.58, 0.42]} />
          <meshStandardMaterial
            color="#042f2e"
            emissive="#00f0ff"
            emissiveIntensity={0.85}
            roughness={0.2}
          />
        </mesh>

        {/* Brand badge & power button on monitor bezel */}
        <mesh position={[-0.22, 0.16, 0.223]}>
          <boxGeometry args={[0.08, 0.02, 0.01]} />
          <meshStandardMaterial color="#57534e" />
        </mesh>
        <mesh position={[0.26, 0.16, 0.223]}>
          <boxGeometry args={[0.025, 0.025, 0.01]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>

      {/* ================= KEYBOARD & MOUSE ================= */}
      {/* Keyboard body */}
      <mesh position={[-0.1, 0.835, 0.42]} rotation={[-0.06, 0, 0]} castShadow>
        <boxGeometry args={[0.62, 0.03, 0.24]} />
        <meshStandardMaterial color="#cac6b4" roughness={0.7} />
      </mesh>
      {/* Keyboard keys plate */}
      <mesh position={[-0.1, 0.852, 0.42]} rotation={[-0.06, 0, 0]}>
        <boxGeometry args={[0.56, 0.015, 0.18]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* Mousepad */}
      <mesh position={[0.38, 0.825, 0.42]} receiveShadow>
        <boxGeometry args={[0.24, 0.005, 0.28]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* Retro Mouse with ball curve */}
      <mesh position={[0.38, 0.845, 0.42]} castShadow>
        <boxGeometry args={[0.09, 0.035, 0.14]} />
        <meshStandardMaterial color="#d4d0be" roughness={0.65} />
      </mesh>

      {/* ================= CPU TOWER ON FLOOR ================= */}
      <group position={[0.85, 0.32, -0.2]}>
        {/* Tower beige case */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.26, 0.62, 0.54]} />
          <meshStandardMaterial color="#cec9b6" roughness={0.7} />
        </mesh>
        {/* Floppy drive slot */}
        <mesh position={[0.01, 0.18, 0.272]}>
          <boxGeometry args={[0.18, 0.04, 0.01]} />
          <meshStandardMaterial color="#44403c" />
        </mesh>
        {/* CD-ROM drive */}
        <mesh position={[0.01, 0.08, 0.272]}>
          <boxGeometry args={[0.2, 0.06, 0.01]} />
          <meshStandardMaterial color="#57534e" />
        </mesh>
        {/* Power switch */}
        <mesh position={[-0.06, -0.12, 0.272]}>
          <boxGeometry args={[0.035, 0.035, 0.01]} />
          <meshStandardMaterial color="#292524" />
        </mesh>
        {/* Blinking HDD LED */}
        <mesh ref={ledRef} position={[0.06, -0.12, 0.272]}>
          <boxGeometry args={[0.018, 0.018, 0.01]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>
    </group>
  );
};
