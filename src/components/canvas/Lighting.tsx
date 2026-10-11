import React from 'react';
import { useGameStore } from '../../state/gameStore';

export const Lighting: React.FC = () => {
  const lampOn = useGameStore((state) => state.lampOn);
  const shadowsEnabled = useGameStore((state) => state.shadowsEnabled);
  const doorLocked = useGameStore((state) => state.doorLocked);

  return (
    <>
      {/* 1. Balanced Nighttime Ambient & Hemisphere Fill: Preserves shadow readability across laptop displays */}
      <hemisphereLight args={['#93c5fd', '#1e2433', 1.5]} />
      <ambientLight color="#94a3b8" intensity={0.95} />

      {/* 2. Soft Ceiling Key Light for Architectural Room Depth & Soft Contact Shadows */}
      <directionalLight
        position={[2.0, 7.0, 2.5]}
        color="#e2e8f0"
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

      {/* 3. North Wall Architectural Wash: Ensures blueprint board, clock, and wainscoting are clearly legible */}
      <pointLight
        position={[-0.5, 3.0, -2.6]}
        color="#93c5fd"
        intensity={1.6}
        distance={6.5}
        decay={2}
      />

      {/* 4. West Side Ambient Moonlight Bounce: Illuminates bookshelf and rain-slicked window side */}
      <pointLight
        position={[-3.6, 2.3, 0.8]}
        color="#7dd3fc"
        intensity={1.6}
        distance={7.0}
        decay={2}
      />

      {/* 5. East Side Architectural Ambient Fill: Illuminates storage crates and blast door threshold */}
      <pointLight
        position={[3.2, 2.2, 1.2]}
        color="#cbd5e1"
        intensity={1.5}
        distance={6.5}
        decay={2}
      />

      {/* 6. PRIMARY LOCAL LIGHT: Warm Amber Desk Lamp */}
      {lampOn && (
        <>
          <pointLight
            position={[-0.9, 1.8, -2.1]}
            color="#fed7aa"
            intensity={5.4}
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

      {/* 7. CRT Phosphor Screen Cyan Illumination (Active even when lamp is off) */}
      <pointLight
        position={[-1.4, 1.35, -2.0]}
        color="#00f0ff"
        intensity={2.6}
        distance={4.8}
        decay={2}
      />

      {/* 8. Wall Chronometer & Investigation Board Accent Illumination */}
      <pointLight
        position={[0.8, 2.3, -3.2]}
        color="#fef3c7"
        intensity={2.0}
        distance={4.2}
        decay={2}
      />

      {/* 9. SECONDARY FOCAL LIGHT: Chamber Blast Door Status Glow (Signals danger when locked) */}
      <pointLight
        position={[3.8, 1.8, -0.5]}
        color={doorLocked ? '#ef4444' : '#10b981'}
        intensity={3.2}
        distance={5.8}
        decay={2}
      />

      {/* 10. Exterior Rainy Window Moonlight Stream */}
      <pointLight
        position={[-4.2, 2.0, -0.5]}
        color="#38bdf8"
        intensity={2.2}
        distance={7.5}
        decay={2}
      />

      {/* 11. Server Rack Archival Diagnostics */}
      <pointLight
        position={[2.6, 1.8, -2.7]}
        color="#a78bfa"
        intensity={1.4}
        distance={4.0}
        decay={2}
      />

      {/* 12. Soft Central Floor Navigation Fill: Softens deep shadows in movement corridor */}
      <pointLight
        position={[0, 1.5, 0.5]}
        color="#64748b"
        intensity={0.9}
        distance={7.0}
        decay={2}
      />
    </>
  );
};
