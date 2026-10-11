import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';

export const Computer: React.FC = () => {
  const ledRef = useRef<THREE.Mesh>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const activeInteractable = useGameStore((state) => state.activeInteractable);
  const isTargeted = activeInteractable?.id === 'computer';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Subtle realistic HDD blink
    if (ledRef.current) {
      const blink = (Math.sin(t * 7.5) > 0.45 && Math.cos(t * 13) > 0.2) || Math.sin(t * 22) > 0.7;
      (ledRef.current.material as THREE.MeshBasicMaterial).color.set(
        blink ? '#22c55e' : '#052e16'
      );
    }

    // Subtle phosphor scanline flicker on CRT screen
    if (screenRef.current) {
      const flicker = 0.95 + Math.sin(t * 30) * 0.05 + (Math.random() - 0.5) * 0.02;
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.85 * flicker;
    }
  });

  return (
    <group position={[-1.3, 0, -2.4]}>
      {/* ================= VINTAGE CRT MONITOR ================= */}
      <group position={[-0.1, 0.82, 0.05]}>
        {/* Swivel Base Stand */}
        <mesh position={[0, 0.025, 0]} castShadow>
          <boxGeometry args={[0.36, 0.04, 0.34]} />
          <meshStandardMaterial color="#c5beaa" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.06, 12]} />
          <meshStandardMaterial color="#9c9582" roughness={0.7} />
        </mesh>

        {/* CRT Bulbous Back Casing */}
        <mesh position={[0, 0.36, -0.08]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.56, 0.5]} />
          <meshStandardMaterial
            color="#d6cebc"
            roughness={0.6}
            emissive={isTargeted ? '#00f0ff' : '#000000'}
            emissiveIntensity={isTargeted ? 0.2 : 0}
          />
        </mesh>

        {/* Cooling vent louvers on top of monitor */}
        {[-0.16, -0.08, 0, 0.08, 0.16].map((xVent, i) => (
          <mesh key={`vent-${i}`} position={[xVent, 0.642, -0.1]}>
            <boxGeometry args={[0.04, 0.005, 0.26]} />
            <meshStandardMaterial color="#645e50" roughness={0.8} />
          </mesh>
        ))}

        {/* CRT Beveled Front Screen Frame */}
        <mesh position={[0, 0.36, 0.18]} castShadow>
          <boxGeometry args={[0.68, 0.52, 0.04]} />
          <meshStandardMaterial color="#c2bbaa" roughness={0.55} />
        </mesh>

        {/* Curved Glass CRT Screen Surface with Phosphor Glow */}
        <mesh ref={screenRef} position={[0, 0.37, 0.202]}>
          <planeGeometry args={[0.56, 0.4]} />
          <meshStandardMaterial
            color="#042f2e"
            emissive="#00f0ff"
            emissiveIntensity={0.85}
            roughness={0.15}
          />
        </mesh>

        {/* Brand badge & Controls */}
        <mesh position={[-0.22, 0.14, 0.204]}>
          <boxGeometry args={[0.08, 0.02, 0.005]} />
          <meshStandardMaterial color="#57534e" />
        </mesh>
        {/* Green Power LED on monitor */}
        <mesh position={[0.26, 0.14, 0.204]}>
          <boxGeometry args={[0.02, 0.02, 0.005]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>

      {/* ================= MECHANICAL KEYBOARD & MOUSE ================= */}
      {/* Keyboard Case */}
      <mesh position={[-0.1, 0.835, 0.44]} rotation={[-0.07, 0, 0]} castShadow>
        <boxGeometry args={[0.64, 0.028, 0.24]} />
        <meshStandardMaterial color="#cec6b4" roughness={0.65} />
      </mesh>
      {/* Stepped Keycap bed */}
      <mesh position={[-0.1, 0.85, 0.44]} rotation={[-0.07, 0, 0]}>
        <boxGeometry args={[0.58, 0.014, 0.18]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* Mousepad */}
      <mesh position={[0.38, 0.825, 0.44]} receiveShadow>
        <boxGeometry args={[0.24, 0.005, 0.28]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* Retro 2-button mouse */}
      <mesh position={[0.38, 0.845, 0.44]} castShadow>
        <boxGeometry args={[0.085, 0.032, 0.13]} />
        <meshStandardMaterial color="#d6cebc" roughness={0.6} />
      </mesh>

      {/* ================= CPU TOWER ON FLOOR ================= */}
      <group position={[0.85, 0.32, -0.2]}>
        {/* Tower Chassis */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.25, 0.62, 0.52]} />
          <meshStandardMaterial color="#cdc5b2" roughness={0.65} />
        </mesh>
        {/* 3.5" Floppy Slot */}
        <mesh position={[0.01, 0.18, 0.262]}>
          <boxGeometry args={[0.18, 0.035, 0.01]} />
          <meshStandardMaterial color="#44403c" />
        </mesh>
        {/* CD-ROM Drive with tray seam */}
        <mesh position={[0.01, 0.08, 0.262]}>
          <boxGeometry args={[0.19, 0.055, 0.01]} />
          <meshStandardMaterial color="#57534e" />
        </mesh>
        {/* Power button */}
        <mesh position={[-0.06, -0.12, 0.262]}>
          <boxGeometry args={[0.035, 0.035, 0.01]} />
          <meshStandardMaterial color="#292524" />
        </mesh>
        {/* Blinking HDD LED */}
        <mesh ref={ledRef} position={[0.06, -0.12, 0.262]}>
          <boxGeometry args={[0.016, 0.016, 0.01]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>
    </group>
  );
};
