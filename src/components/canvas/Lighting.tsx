import React from 'react';
import { useGameStore } from '../../state/gameStore';

export const Lighting: React.FC = () => {
  const lampOn = useGameStore((state) => state.lampOn);
  const shadowsEnabled = useGameStore((state) => state.shadowsEnabled);
  const doorLocked = useGameStore((state) => state.doorLocked);

  return (
    <>
      {/* 1. Cool Subdued Ambient & Hemisphere Fill: Preserves readability on laptop screens */}
      <hemisphereLight args={['#7dd3fc', '#1e1b4b', 1.35]} />
      <ambientLight color="#94a3b8" intensity={0.9} />

      {/* 2. Soft Ceiling Key Light for Architectural Room Depth & Soft Contact Shadows */}
      <directionalLight
        position={[2.0, 7.0, 2.5]}
        color="#e0e7ff"
        intensity={1.4}
        castShadow={shadowsEnabled}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0003}
      />

      {/* 3. North Wall Architectural Wash: Ensures blueprint board, clock, and wainscoting are readable */}
      <pointLight
        position={[-0.5, 3.0, -2.6]}
        color="#93c5fd"
        intensity={1.5}
        distance={6.5}
        decay={2}
      />

      {/* 4. PRIMARY LOCAL LIGHT: Warm Amber Desk Lamp */}
      {lampOn && (
        <>
          <pointLight
            position={[-0.9, 1.8, -2.1]}
            color="#fed7aa"
            intensity={5.2}
            distance={8.0}
            decay={2}
            castShadow={shadowsEnabled}
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
            shadow-bias={-0.001}
          />
          <pointLight
            position={[-0.45, 1.5, -2.1]}
            color="#fef3c7"
            intensity={2.8}
            distance={4.5}
            decay={2}
          />
        </>
      )}

      {/* 5. CRT Phosphor Screen Cyan Illumination (Active even when lamp is off) */}
      <pointLight
        position={[-1.4, 1.35, -2.0]}
        color="#00f0ff"
        intensity={2.4}
        distance={4.5}
        decay={2}
      />

      {/* 6. Wall Chronometer Accent Illumination */}
      <pointLight
        position={[0.8, 2.3, -3.2]}
        color="#fef3c7"
        intensity={1.8}
        distance={3.8}
        decay={2}
      />

      {/* 7. SECONDARY FOCAL LIGHT: Chamber Blast Door Status Glow */}
      <pointLight
        position={[3.8, 1.8, -0.5]}
        color={doorLocked ? '#ef4444' : '#10b981'}
        intensity={2.8}
        distance={5.5}
        decay={2}
      />

      {/* 8. Rainy Window Cyan Moonlight Fill */}
      <pointLight
        position={[-4.0, 2.0, -0.5]}
        color="#38bdf8"
        intensity={2.4}
        distance={7.5}
        decay={2}
      />

      {/* 9. Server Rack Subtle Diagnostic Glow */}
      <pointLight
        position={[2.6, 1.8, -2.7]}
        color="#a78bfa"
        intensity={1.4}
        distance={4.0}
        decay={2}
      />
    </>
  );
};
