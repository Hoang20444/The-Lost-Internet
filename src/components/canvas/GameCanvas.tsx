import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './Scene';
import { useGameStore } from '../../state/gameStore';

export const GameCanvas: React.FC = () => {
  const shadowsEnabled = useGameStore((state) => state.shadowsEnabled);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas
        shadows={shadowsEnabled}
        camera={{
          fov: 46,
          near: 0.1,
          far: 50,
          position: [0.1, 3.8, 4.6],
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#080c18']} />
        <Scene />
      </Canvas>
    </div>
  );
};
