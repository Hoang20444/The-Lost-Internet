import React from 'react';
import { useGameStore } from '../../state/gameStore';

export const Lamp: React.FC = () => {
  const lampOn = useGameStore((state) => state.lampOn);
  const toggleLamp = useGameStore((state) => state.toggleLamp);
  const activeInteractable = useGameStore((state) => state.activeInteractable);
  const isTargeted = activeInteractable?.id === 'lamp';

  return (
    <group
      position={[-0.45, 0.82, -2.2]}
      onClick={(e) => {
        e.stopPropagation();
        toggleLamp();
      }}
    >
      {/* Weighted Brass / Dark Metal Base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.04, 16]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.7}
          roughness={0.3}
          emissive={isTargeted ? '#ffb347' : '#000000'}
          emissiveIntensity={isTargeted ? 0.35 : 0}
        />
      </mesh>

      {/* Rocker switch on base */}
      <mesh position={[0.05, 0.042, 0.04]} castShadow>
        <boxGeometry args={[0.025, 0.015, 0.035]} />
        <meshStandardMaterial color={lampOn ? '#f59e0b' : '#0f172a'} />
      </mesh>

      {/* Articulated Lower Arm (Angled slightly back and inward) */}
      <group position={[0, 0.04, 0]} rotation={[0.35, 0.15, -0.15]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.44, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Brass Knurled Elbow Joint */}
        <mesh position={[0, 0.44, 0]} castShadow>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Articulated Upper Arm (Angled down over the desk) */}
        <group position={[0, 0.44, 0]} rotation={[-0.85, -0.1, 0.1]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.25} />
          </mesh>

          {/* Lampshade Pivot Socket */}
          <group position={[0, 0.4, 0]} rotation={[0.6, 0, 0]}>
            {/* Dark Forest Green / Vintage Enamel Metal Shade */}
            <mesh position={[0, 0.05, 0]} rotation={[Math.PI, 0, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.065, 0.16, 16, 1, true]} />
              <meshStandardMaterial
                color="#064e3b"
                metalness={0.5}
                roughness={0.4}
                side={2}
                emissive={isTargeted ? '#d97706' : '#000000'}
                emissiveIntensity={isTargeted ? 0.22 : 0}
              />
            </mesh>

            {/* Brass Shade Top Cap */}
            <mesh position={[0, 0.14, 0]}>
              <cylinderGeometry args={[0.06, 0.065, 0.035, 16]} />
              <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
            </mesh>

            {/* Glowing Incandescent Lightbulb */}
            <mesh position={[0, 0.03, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial
                color={lampOn ? '#fffbeb' : '#1e293b'}
                emissive={lampOn ? '#ffdf7a' : '#000000'}
                emissiveIntensity={lampOn ? 3.5 : 0}
                roughness={lampOn ? 0.1 : 0.9}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
