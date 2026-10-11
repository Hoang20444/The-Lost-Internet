import React from 'react';

export const Room: React.FC = () => {
  return (
    <group>
      {/* ================= FLOOR ================= */}
      {/* Base parquet wood floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[8.8, 0.1, 7.4]} />
        <meshStandardMaterial
          color="#1e1c26"
          roughness={0.65}
          metalness={0.12}
        />
      </mesh>

      {/* Decorative floor parquet insets */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.4, 7.0]} />
        <meshStandardMaterial
          color="#242130"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Archival wool rug beneath workstation */}
      <mesh position={[-1.0, 0.015, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.8, 2.8]} />
        <meshStandardMaterial
          color="#35294a"
          roughness={0.88}
        />
      </mesh>
      {/* Rug woven border */}
      <mesh position={[-1.0, 0.018, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.6, 2.6]} />
        <meshStandardMaterial
          color="#2a203d"
          roughness={0.92}
        />
      </mesh>
      {/* Inner rug accent line */}
      <mesh position={[-1.0, 0.02, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.3, 2.3]} />
        <meshStandardMaterial
          color="#221933"
          roughness={0.95}
        />
      </mesh>

      {/* ================= NORTH WALL (Z = -3.7) ================= */}
      {/* Main plaster wall */}
      <mesh position={[0, 1.9, -3.72]} receiveShadow>
        <boxGeometry args={[8.8, 3.8, 0.1]} />
        <meshStandardMaterial
          color="#2f3b52"
          roughness={0.75}
        />
      </mesh>

      {/* Dark mahogany wainscoting along bottom of North wall */}
      <mesh position={[0, 0.55, -3.65]} receiveShadow>
        <boxGeometry args={[8.7, 1.1, 0.05]} />
        <meshStandardMaterial
          color="#1e2536"
          roughness={0.55}
        />
      </mesh>
      {/* Wainscoting chair rail moulding */}
      <mesh position={[0, 1.12, -3.63]}>
        <boxGeometry args={[8.75, 0.06, 0.07]} />
        <meshStandardMaterial
          color="#38455e"
          roughness={0.45}
        />
      </mesh>

      {/* Large Technical Schematic Board above desk */}
      <group position={[-1.2, 2.3, -3.64]}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[2.2, 1.3, 0.04]} />
          <meshStandardMaterial color="#1a1e29" roughness={0.7} />
        </mesh>
        {/* Board Surface - Dark blueprint grid */}
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[2.08, 1.18]} />
          <meshStandardMaterial
            color="#0f2638"
            emissive="#0284c7"
            emissiveIntensity={0.25}
            roughness={0.6}
          />
        </mesh>
        {/* Pinned archival notes / papers */}
        <mesh position={[-0.6, 0.25, 0.035]}>
          <planeGeometry args={[0.45, 0.35]} />
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
        </mesh>
        <mesh position={[0.55, -0.2, 0.035]}>
          <planeGeometry args={[0.4, 0.3]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.9} />
        </mesh>
        <mesh position={[0.1, 0.3, 0.035]}>
          <planeGeometry args={[0.35, 0.25]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
      </group>

      {/* Wall conduit pipe running horizontally along North wall */}
      <mesh position={[0, 3.2, -3.64]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 8.6, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* ================= WEST WALL (X = -4.3) (With Window) ================= */}
      {/* Wall lower panel */}
      <mesh position={[-4.32, 0.55, 0]} receiveShadow>
        <boxGeometry args={[0.1, 1.1, 7.4]} />
        <meshStandardMaterial color="#1a1e2b" roughness={0.6} />
      </mesh>
      {/* Wall upper sections around window */}
      <mesh position={[-4.32, 2.2, -2.4]} receiveShadow>
        <boxGeometry args={[0.1, 2.2, 2.6]} />
        <meshStandardMaterial color="#222838" roughness={0.8} />
      </mesh>
      <mesh position={[-4.32, 2.2, 1.6]} receiveShadow>
        <boxGeometry args={[0.1, 2.2, 2.6]} />
        <meshStandardMaterial color="#222838" roughness={0.8} />
      </mesh>
      <mesh position={[-4.32, 3.4, -0.5]} receiveShadow>
        <boxGeometry args={[0.1, 0.8, 2.2]} />
        <meshStandardMaterial color="#222838" roughness={0.8} />
      </mesh>

      {/* Bookshelf along West wall */}
      <group position={[-3.85, 0.7, 2.2]}>
        {/* Shelf structure */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.45, 1.4, 1.6]} />
          <meshStandardMaterial color="#261b14" roughness={0.7} />
        </mesh>
        {/* Books / archive binders */}
        {[-0.5, -0.2, 0.1, 0.4].map((zPos, i) => (
          <mesh key={`binder-${i}`} position={[0.05, 0.35, zPos]} castShadow>
            <boxGeometry args={[0.3, 0.45, 0.2]} />
            <meshStandardMaterial
              color={['#1e3a8a', '#831843', '#064e3b', '#475569'][i % 4]}
              roughness={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* ================= EAST WALL (X = +4.3) (With Blast Door) ================= */}
      {/* Lower wainscoting */}
      <mesh position={[4.32, 0.55, 0]} receiveShadow>
        <boxGeometry args={[0.1, 1.1, 7.4]} />
        <meshStandardMaterial color="#1a1e2b" roughness={0.6} />
      </mesh>
      {/* Upper wall sections */}
      <mesh position={[4.32, 2.2, -2.4]} receiveShadow>
        <boxGeometry args={[0.1, 2.2, 2.6]} />
        <meshStandardMaterial color="#222838" roughness={0.8} />
      </mesh>
      <mesh position={[4.32, 2.2, 1.6]} receiveShadow>
        <boxGeometry args={[0.1, 2.2, 2.6]} />
        <meshStandardMaterial color="#222838" roughness={0.8} />
      </mesh>
      <mesh position={[4.32, 3.4, -0.5]} receiveShadow>
        <boxGeometry args={[0.1, 0.8, 2.2]} />
        <meshStandardMaterial color="#222838" roughness={0.8} />
      </mesh>

      {/* Archive Crates stacked in South-East corner */}
      <group position={[3.3, 0.4, 2.4]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color="#57412f" roughness={0.8} />
        </mesh>
        <mesh position={[0.05, 0.55, -0.05]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.5, 0.55]} />
          <meshStandardMaterial color="#6b513a" roughness={0.85} />
        </mesh>
        {/* Archive label on top crate */}
        <mesh position={[0.05, 0.55, 0.23]}>
          <planeGeometry args={[0.25, 0.15]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
      </group>

      {/* ================= SOUTH THRESHOLD (Diorama cutaway) ================= */}
      <mesh position={[0, 0.2, 3.52]} receiveShadow>
        <boxGeometry args={[8.8, 0.4, 0.1]} />
        <meshStandardMaterial color="#181c26" roughness={0.7} />
      </mesh>

      {/* Baseboard trims around floor */}
      <mesh position={[0, 0.06, -3.64]}>
        <boxGeometry args={[8.6, 0.12, 0.03]} />
        <meshStandardMaterial color="#0f131c" roughness={0.5} />
      </mesh>
      <mesh position={[-4.24, 0.06, 0]}>
        <boxGeometry args={[0.03, 0.12, 7.1]} />
        <meshStandardMaterial color="#0f131c" roughness={0.5} />
      </mesh>
      <mesh position={[4.24, 0.06, 0]}>
        <boxGeometry args={[0.03, 0.12, 7.1]} />
        <meshStandardMaterial color="#0f131c" roughness={0.5} />
      </mesh>

      {/* ================= CEILING RAFTERS (High up, atmospheric) ================= */}
      {[-2.2, 0, 2.2].map((z, idx) => (
        <mesh key={`beam-${idx}`} position={[0, 4.1, z]} castShadow={false}>
          <boxGeometry args={[8.6, 0.2, 0.3]} />
          <meshStandardMaterial color="#202636" roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
};
