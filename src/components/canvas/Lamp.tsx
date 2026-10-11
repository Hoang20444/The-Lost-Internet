import React from 'react';
import { useGameStore } from '../../state/gameStore';

export const Lamp: React.FC = () => {
  const lampOn = useGameStore((state) => state.lampOn);
  const toggleLamp = useGameStore((state) => state.toggleLamp);
  const activeInteractable = useGameStore((state) => state.activeInteractable);
  const isTargeted = activeInteractable?.id === 'lamp';

  return (
    <group
      position={[-1.75, 0.82, -3.0]}
      onClick={(e) => {
        e.stopPropagation();
        toggleLamp();
      }}
    >
      {/* Weighted Lamp Base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.15, 0.04, 16]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.7}
          roughness={0.3}
          emissive={isTargeted ? '#ffb347' : '#000000'}
          emissiveIntensity={isTargeted ? 0.3 : 0}
        />
      </mesh>

      {/* Switch button on base */}
      <mesh position={[0.06, 0.045, 0.05]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
        <meshStandardMaterial color={lampOn ? '#f59e0b' : '#1e293b'} metalness={0.8} />
      </mesh>

      {/* Lower Arm (angled back) */}
      <group position={[0, 0.04, 0]} rotation={[0.4, 0.2, -0.2]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Elbow Joint */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Upper Arm (angled forward towards the desk) */}
        <group position={[0, 0.5, 0]} rotation={[-0.9, -0.1, 0.1]}>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.44, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Lamp Shade Socket */}
          <group position={[0, 0.44, 0]} rotation={[0.6, 0, 0]}>
            {/* Lampshade metal cone */}
            <mesh position={[0, 0.06, 0]} rotation={[Math.PI, 0, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.07, 0.18, 16, 1, true]} />
              <meshStandardMaterial
                color="#0f766e"
                metalness={0.6}
                roughness={0.4}
                side={2}
              />
            </mesh>

            {/* Lampshade top cap */}
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.065, 0.07, 0.04, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>

            {/* Glowing Lightbulb */}
            <mesh position={[0, 0.04, 0]}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshStandardMaterial
                color={lampOn ? '#fffbeb' : '#1e293b'}
                emissive={lampOn ? '#ffdf7a' : '#000000'}
                emissiveIntensity={lampOn ? 3.0 : 0}
                roughness={lampOn ? 0.1 : 0.9}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
