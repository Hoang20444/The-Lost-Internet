import React from 'react';
import { useGameStore } from '../../state/gameStore';

export const Lighting: React.FC = () => {
  const lampOn = useGameStore((state) => state.lampOn);
  const shadowsEnabled = useGameStore((state) => state.shadowsEnabled);
  const doorLocked = useGameStore((state) => state.doorLocked);

  return (
    <>
      {/* Rich indie atmospheric hemisphere light (Sky cyan / Ground indigo) */}
      <hemisphereLight args={['#bae6fd', '#1e1b4b', 1.4]} />

      {/* Atmospheric ambient base */}
      <ambientLight color="#94a3b8" intensity={0.8} />

      {/* Main room ceiling key light casting soft shadows */}
      <directionalLight
        position={[2, 7, 3]}
        color="#e0e7ff"
        intensity={1.5}
        castShadow={shadowsEnabled}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0005}
      />

      {/* Moonlight streaming in from the West window */}
      <pointLight
        position={[-4.7, 2.2, 0]}
        color="#38bdf8"
        intensity={2.8}
        distance={10}
        decay={2}
      />

      {/* Desk Workstation Area Light: Dynamic based on Lamp switch */}
      {lampOn && (
        <>
          <pointLight
            position={[-2.4, 2.0, -3.0]}
            color="#fed7aa"
            intensity={4.5}
            distance={8.5}
            decay={2}
            castShadow={shadowsEnabled}
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
            shadow-bias={-0.001}
          />
          <pointLight
            position={[-1.75, 1.7, -3.0]}
            color="#ffedd5"
            intensity={3.0}
            distance={4.5}
            decay={2}
          />
        </>
      )}

      {/* CRT Terminal Screen ambient glow */}
      <pointLight
        position={[-2.8, 1.45, -2.7]}
        color="#00f0ff"
        intensity={2.2}
        distance={4.5}
        decay={2}
      />

      {/* Wall Chronometer Clock dedicated accent illumination */}
      <pointLight
        position={[-0.2, 2.5, -4.3]}
        color="#f1f5f9"
        intensity={2.0}
        distance={4.5}
        decay={2}
      />

      {/* Blast Door security illumination */}
      <pointLight
        position={[4.2, 2.0, 0]}
        color={doorLocked ? '#ff1e56' : '#10b981'}
        intensity={2.4}
        distance={5.0}
        decay={2}
      />

      {/* Server rack archival equipment illumination */}
      <pointLight
        position={[3.4, 2.0, -3.0]}
        color="#a78bfa"
        intensity={1.8}
        distance={5.0}
        decay={2}
      />
    </>
  );
};
