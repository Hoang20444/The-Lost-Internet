import React from 'react';

export const Desk: React.FC = () => {
  return (
    <group position={[-2.6, 0, -3.2]}>
      {/* Desk Main Tabletop */}
      <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.08, 1.4]} />
        <meshStandardMaterial color="#453225" roughness={0.55} metalness={0.1} />
      </mesh>

      {/* Desk Tabletop Leather Mat */}
      <mesh position={[-0.2, 0.825, 0.05]} receiveShadow>
        <boxGeometry args={[1.6, 0.01, 0.9]} />
        <meshStandardMaterial color="#1a202c" roughness={0.85} />
      </mesh>

      {/* Desk Left Drawer Unit */}
      <mesh position={[-0.95, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.72, 1.3]} />
        <meshStandardMaterial color="#3a281c" roughness={0.65} />
      </mesh>
      {/* Drawer handles */}
      {[-0.15, 0.1, 0.35].map((y, idx) => (
        <mesh key={`handle-${idx}`} position={[-0.95, y, 0.66]}>
          <boxGeometry args={[0.2, 0.03, 0.03]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Desk Right Legs (metal frame style) */}
      <mesh position={[1.1, 0.38, -0.55]} castShadow>
        <boxGeometry args={[0.07, 0.72, 0.07]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[1.1, 0.38, 0.55]} castShadow>
        <boxGeometry args={[0.07, 0.72, 0.07]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[1.1, 0.06, 0]} castShadow>
        <boxGeometry args={[0.07, 0.06, 1.15]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Cable organizer / rear modesty panel */}
      <mesh position={[0.1, 0.45, -0.6]} castShadow>
        <boxGeometry args={[1.5, 0.55, 0.04]} />
        <meshStandardMaterial color="#2d1f16" roughness={0.7} />
      </mesh>

      {/* Vintage Desk Chair */}
      <group position={[0, 0, 0.85]}>
        {/* Chair seat */}
        <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.08, 0.52]} />
          <meshStandardMaterial color="#4338ca" roughness={0.7} />
        </mesh>
        {/* Chair backrest */}
        <mesh position={[0, 0.82, 0.23]} castShadow>
          <boxGeometry args={[0.52, 0.55, 0.07]} />
          <meshStandardMaterial color="#4338ca" roughness={0.7} />
        </mesh>
        {/* Chair back support rod */}
        <mesh position={[0, 0.62, 0.22]}>
          <boxGeometry args={[0.06, 0.35, 0.04]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Chair center pole */}
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.42, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Chair caster base legs */}
        {[0, 1.25, 2.5, 3.75, 5].map((angle, idx) => (
          <mesh key={`caster-${idx}`} position={[0, 0.04, 0]} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.48, 0.04, 0.04]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
