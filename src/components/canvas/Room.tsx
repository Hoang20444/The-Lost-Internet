import React from 'react';

export const Room: React.FC = () => {
  return (
    <group>
      {/* ================= FLOOR ================= */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[10.2, 0.1, 10.2]} />
        <meshStandardMaterial color="#1a2035" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Decorative floor parquet lines/insets */}
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[9.8, 9.8]} />
        <meshStandardMaterial
          color="#202742"
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>

      {/* Center rug under work area */}
      <mesh position={[-0.5, 0.015, -0.8]} receiveShadow>
        <planeGeometry args={[5.2, 4.2]} />
        <meshStandardMaterial color="#2d2857" roughness={0.8} />
      </mesh>
      {/* Rug border */}
      <mesh position={[-0.5, 0.018, -0.8]} receiveShadow>
        <planeGeometry args={[5.0, 4.0]} />
        <meshStandardMaterial color="#37306b" roughness={0.85} />
      </mesh>

      {/* ================= CEILING DETAILS & ARCHITECTURAL BEAMS ================= */}
      {/* Architectural ceiling beams */}
      {[-3, 0, 3].map((z, idx) => (
        <mesh key={`beam-z-${idx}`} position={[0, 4.4, z]}>
          <boxGeometry args={[10, 0.24, 0.38]} />
          <meshStandardMaterial color="#2c344e" roughness={0.7} />
        </mesh>
      ))}

      {[-3, 0, 3].map((x, idx) => (
        <mesh key={`beam-x-${idx}`} position={[x, 4.4, 0]}>
          <boxGeometry args={[0.38, 0.24, 10]} />
          <meshStandardMaterial color="#2c344e" roughness={0.7} />
        </mesh>
      ))}

      {/* ================= NORTH WALL (Z = -5.0) ================= */}
      <mesh position={[0, 2.1, -5.05]} receiveShadow>
        <boxGeometry args={[10.2, 4.2, 0.1]} />
        <meshStandardMaterial color="#242c47" roughness={0.75} />
      </mesh>

      {/* North Wall Acoustic Panels / Trim */}
      <mesh position={[-2.5, 2.2, -4.98]}>
        <boxGeometry args={[3.2, 1.8, 0.04]} />
        <meshStandardMaterial color="#313c5e" roughness={0.65} />
      </mesh>

      <mesh position={[2.5, 2.2, -4.98]}>
        <boxGeometry args={[3.2, 1.8, 0.04]} />
        <meshStandardMaterial color="#313c5e" roughness={0.65} />
      </mesh>

      {/* Framed Retro Network Schematic poster */}
      <group position={[-2.5, 2.3, -4.95]}>
        <mesh>
          <boxGeometry args={[1.6, 1.1, 0.04]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[1.45, 0.95]} />
          <meshStandardMaterial
            color="#0369a1"
            emissive="#0284c7"
            emissiveIntensity={0.4}
            roughness={0.5}
          />
        </mesh>
      </group>

      {/* ================= SOUTH WALL (Cutaway architecture) ================= */}
      <mesh position={[0, 0.4, 5.05]} receiveShadow>
        <boxGeometry args={[10.2, 0.8, 0.1]} />
        <meshStandardMaterial color="#1b2238" roughness={0.8} />
      </mesh>

      {/* ================= WEST WALL (X = -5.0) (With Window) ================= */}
      {/* West wall left section */}
      <mesh position={[-5.05, 2.1, -3.2]} receiveShadow>
        <boxGeometry args={[0.1, 4.2, 3.8]} />
        <meshStandardMaterial color="#222a44" roughness={0.75} />
      </mesh>
      {/* West wall right section */}
      <mesh position={[-5.05, 2.1, 3.2]} receiveShadow>
        <boxGeometry args={[0.1, 4.2, 3.8]} />
        <meshStandardMaterial color="#222a44" roughness={0.75} />
      </mesh>
      {/* West wall bottom section under window */}
      <mesh position={[-5.05, 0.6, 0]} receiveShadow>
        <boxGeometry args={[0.1, 1.2, 2.6]} />
        <meshStandardMaterial color="#222a44" roughness={0.75} />
      </mesh>
      {/* West wall top section above window */}
      <mesh position={[-5.05, 3.65, 0]} receiveShadow>
        <boxGeometry args={[0.1, 1.1, 2.6]} />
        <meshStandardMaterial color="#222a44" roughness={0.75} />
      </mesh>

      {/* ================= EAST WALL (X = +5.0) (With Door) ================= */}
      {/* East wall top section */}
      <mesh position={[5.05, 3.5, 0]} receiveShadow>
        <boxGeometry args={[0.1, 1.4, 10.2]} />
        <meshStandardMaterial color="#222a44" roughness={0.75} />
      </mesh>
      {/* East wall North section */}
      <mesh position={[5.05, 1.4, -3.1]} receiveShadow>
        <boxGeometry args={[0.1, 2.8, 4.0]} />
        <meshStandardMaterial color="#222a44" roughness={0.75} />
      </mesh>
      {/* East wall South section */}
      <mesh position={[5.05, 1.4, 3.1]} receiveShadow>
        <boxGeometry args={[0.1, 2.8, 4.0]} />
        <meshStandardMaterial color="#222a44" roughness={0.75} />
      </mesh>

      {/* Baseboards around room perimeter */}
      <mesh position={[0, 0.08, -4.95]}>
        <boxGeometry args={[9.9, 0.16, 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.08, 4.95]}>
        <boxGeometry args={[9.9, 0.16, 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
      <mesh position={[-4.95, 0.08, 0]}>
        <boxGeometry args={[0.04, 0.16, 9.9]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
      <mesh position={[4.95, 0.08, 0]}>
        <boxGeometry args={[0.04, 0.16, 9.9]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
    </group>
  );
};
