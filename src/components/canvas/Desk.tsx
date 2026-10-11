import React from 'react';

export const Desk: React.FC = () => {
  return (
    <group position={[-1.2, 0, -2.4]}>
      {/* Desk Main Tabletop (Solid walnut with chamfer) */}
      <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.08, 1.4]} />
        <meshStandardMaterial
          color="#38291f"
          roughness={0.5}
          metalness={0.08}
        />
      </mesh>

      {/* Desk Tabletop Leather Mat */}
      <mesh position={[-0.1, 0.825, 0.08]} receiveShadow>
        <boxGeometry args={[1.5, 0.01, 0.85]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.88} />
      </mesh>

      {/* Desk Left Drawer Pedestal */}
      <mesh position={[-0.95, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.72, 1.3]} />
        <meshStandardMaterial color="#2d2017" roughness={0.65} />
      </mesh>
      {/* Drawer brass drop handles */}
      {[-0.15, 0.1, 0.35].map((y, idx) => (
        <group key={`handle-${idx}`} position={[-0.95, y, 0.66]}>
          <mesh>
            <boxGeometry args={[0.18, 0.03, 0.02]} />
            <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.02, 0.01]}>
            <boxGeometry args={[0.12, 0.04, 0.015]} />
            <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* Desk Right Legs (Black industrial welded steel) */}
      <mesh position={[1.1, 0.38, -0.55]} castShadow>
        <boxGeometry args={[0.06, 0.72, 0.06]} />
        <meshStandardMaterial color="#1e222d" metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh position={[1.1, 0.38, 0.55]} castShadow>
        <boxGeometry args={[0.06, 0.72, 0.06]} />
        <meshStandardMaterial color="#1e222d" metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh position={[1.1, 0.05, 0]} castShadow>
        <boxGeometry args={[0.06, 0.05, 1.15]} />
        <meshStandardMaterial color="#1e222d" metalness={0.8} roughness={0.35} />
      </mesh>

      {/* Modesty Panel with realistic dark wood */}
      <mesh position={[0.1, 0.45, -0.58]} castShadow>
        <boxGeometry args={[1.5, 0.55, 0.03]} />
        <meshStandardMaterial color="#271c14" roughness={0.7} />
      </mesh>

      {/* Floppy Disk Storage Box on right corner of desk */}
      <group position={[0.92, 0.88, -0.3]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.26, 0.14, 0.34]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Floppy disk labels inside open tray */}
        {[-0.08, -0.02, 0.04, 0.1].map((zPos, idx) => (
          <mesh key={`floppy-${idx}`} position={[0, 0.04, zPos]}>
            <boxGeometry args={[0.22, 0.08, 0.015]} />
            <meshStandardMaterial
              color={['#0284c7', '#dc2626', '#16a34a', '#ca8a04'][idx % 4]}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Cable bundle running from desk to PC tower */}
      <mesh position={[0.45, 0.4, -0.45]} rotation={[0.4, 0, 0.2]}>
        <cylinderGeometry args={[0.018, 0.018, 0.7, 6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Vintage Ergonomic Office Chair */}
      <group position={[-0.1, 0, 0.85]}>
        {/* Padded Seat Cushion */}
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.56, 0.09, 0.52]} />
          <meshStandardMaterial color="#3b2b4d" roughness={0.75} />
        </mesh>
        {/* Curved Backrest */}
        <mesh position={[0, 0.84, 0.24]} castShadow>
          <boxGeometry args={[0.5, 0.54, 0.08]} />
          <meshStandardMaterial color="#3b2b4d" roughness={0.75} />
        </mesh>
        {/* Armrests */}
        {[-0.27, 0.27].map((xArm, i) => (
          <group key={`armrest-${i}`} position={[xArm, 0.65, 0.05]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 0.03, 0.32]} />
              <meshStandardMaterial color="#1e222d" roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.12, 0.08]}>
              <boxGeometry args={[0.03, 0.24, 0.04]} />
              <meshStandardMaterial color="#1e222d" metalness={0.8} />
            </mesh>
          </group>
        ))}
        {/* Support Rod & Hydraulic Cylinder */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.4, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* 5-Star Caster Base */}
        {[0, 1.256, 2.513, 3.769, 5.026].map((rotAngle, i) => (
          <mesh key={`star-leg-${i}`} position={[0, 0.04, 0]} rotation={[0, rotAngle, 0]}>
            <boxGeometry args={[0.48, 0.04, 0.05]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
