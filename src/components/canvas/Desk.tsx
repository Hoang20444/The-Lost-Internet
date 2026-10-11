import React from 'react';

export const Desk: React.FC = () => {
  return (
    <group position={[-1.2, 0, -2.4]}>
      {/* ================= SOLID WALNUT WORKSTATION TABLETOP ================= */}
      {/* Main Walnut Tabletop */}
      <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.08, 1.4]} />
        <meshStandardMaterial
          color="#3c2a1c"
          roughness={0.48}
          metalness={0.06}
        />
      </mesh>

      {/* Tabletop Edge Bevel Banding */}
      <mesh position={[0, 0.78, 0.702]} castShadow>
        <boxGeometry args={[2.52, 0.076, 0.008]} />
        <meshStandardMaterial color="#322216" roughness={0.52} />
      </mesh>
      <mesh position={[0, 0.78, -0.702]}>
        <boxGeometry args={[2.52, 0.076, 0.008]} />
        <meshStandardMaterial color="#322216" roughness={0.52} />
      </mesh>

      {/* Front Chamfer Arm-Rest Wear Patina (Lighter rubbed lacquer where forearms rest) */}
      <mesh position={[-0.1, 0.822, 0.68]}>
        <boxGeometry args={[1.6, 0.005, 0.035]} />
        <meshStandardMaterial color="#543c2a" roughness={0.58} />
      </mesh>

      {/* Tabletop Brass Cable Pass-Through Grommet */}
      <group position={[0.7, 0.822, -0.45]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.008, 16]} />
          <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.002, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.008, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>

      {/* Desk Tabletop Fine Leather Blotter Mat with Brass Corner Guards */}
      <group position={[-0.1, 0.825, 0.08]}>
        {/* Leather Mat Body */}
        <mesh receiveShadow>
          <boxGeometry args={[1.52, 0.01, 0.86]} />
          <meshStandardMaterial color="#14161c" roughness={0.88} />
        </mesh>
        {/* Subtle Gold Tooling Inset Line */}
        <mesh position={[0, 0.006, 0]}>
          <boxGeometry args={[1.46, 0.002, 0.8]} />
          <meshStandardMaterial color="#78552b" roughness={0.7} />
        </mesh>
        {/* Brass Corner Protectors */}
        {[
          [-0.74, 0.41],
          [0.74, 0.41],
          [-0.74, -0.41],
          [0.74, -0.41],
        ].map(([cx, cz], i) => (
          <mesh key={`mat-corner-${i}`} position={[cx, 0.007, cz]}>
            <boxGeometry args={[0.04, 0.004, 0.04]} />
            <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
          </mesh>
        ))}
      </group>

      {/* ================= LEFT DRAWER PEDESTAL ================= */}
      {/* Pedestal Casing */}
      <mesh position={[-0.95, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.72, 1.3]} />
        <meshStandardMaterial color="#2d1f15" roughness={0.62} />
      </mesh>
      {/* 3 Inset Drawer Front Panels with Brass Cup Handles */}
      {[-0.18, 0.07, 0.32].map((y, idx) => (
        <group key={`drawer-${idx}`} position={[-0.95, y, 0.655]}>
          {/* Recessed Drawer Face */}
          <mesh castShadow>
            <boxGeometry args={[0.44, 0.21, 0.015]} />
            <meshStandardMaterial color="#352419" roughness={0.58} />
          </mesh>
          {/* Brass Cup Pull Handle */}
          <mesh position={[0, 0, 0.014]}>
            <boxGeometry args={[0.16, 0.035, 0.018]} />
            <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.018, 0.018]}>
            <boxGeometry args={[0.12, 0.02, 0.012]} />
            <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Keyhole on top drawer */}
          {idx === 2 && (
            <mesh position={[0, 0.065, 0.01]}>
              <cylinderGeometry args={[0.006, 0.006, 0.01, 8]} />
              <meshStandardMaterial color="#1c1917" metalness={0.9} />
            </mesh>
          )}
        </group>
      ))}

      {/* ================= RIGHT INDUSTRIAL STEEL LEGS ================= */}
      {/* Heavy tubular welded steel legs */}
      <mesh position={[1.1, 0.38, -0.55]} castShadow>
        <boxGeometry args={[0.06, 0.72, 0.06]} />
        <meshStandardMaterial color="#20242e" metalness={0.82} roughness={0.32} />
      </mesh>
      <mesh position={[1.1, 0.38, 0.55]} castShadow>
        <boxGeometry args={[0.06, 0.72, 0.06]} />
        <meshStandardMaterial color="#20242e" metalness={0.82} roughness={0.32} />
      </mesh>
      {/* Base Stretcher Bar with floor glides */}
      <mesh position={[1.1, 0.05, 0]} castShadow>
        <boxGeometry args={[0.06, 0.05, 1.16]} />
        <meshStandardMaterial color="#20242e" metalness={0.82} roughness={0.32} />
      </mesh>
      {[-0.55, 0.55].map((zGlide, i) => (
        <mesh key={`glide-${i}`} position={[1.1, 0.015, zGlide]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
          <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}

      {/* Modesty Panel with dark walnut backing */}
      <mesh position={[0.1, 0.45, -0.58]} castShadow>
        <boxGeometry args={[1.5, 0.55, 0.03]} />
        <meshStandardMaterial color="#271a12" roughness={0.7} />
      </mesh>

      {/* ================= ARCHIVAL WORKSTATION ACCESSORIES ================= */}
      {/* 1. Open Archival Field Logbook on Left Desk Corner */}
      <group position={[-0.72, 0.83, 0.28]} rotation={[0, 0.12, 0]}>
        {/* Leather Binding Cover */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[0.34, 0.015, 0.24]} />
          <meshStandardMaterial color="#301f14" roughness={0.75} />
        </mesh>
        {/* Ivory Pages */}
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <boxGeometry args={[0.32, 0.012, 0.22]} />
          <meshStandardMaterial color="#faf2d6" roughness={0.88} />
        </mesh>
        {/* Center Crease & Red Silk Ribbon Bookmark */}
        <mesh position={[0, 0.018, 0]}>
          <boxGeometry args={[0.008, 0.005, 0.26]} />
          <meshStandardMaterial color="#991b1b" roughness={0.5} />
        </mesh>
        {/* Simulated handwritten ink ruling lines */}
        {[-0.08, -0.04, 0, 0.04, 0.08].map((zLine, i) => (
          <mesh key={`ink-${i}`} position={[0, 0.017, zLine]}>
            <planeGeometry args={[0.26, 0.008]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* 2. Ceramic Archive Coffee Mug with Dipped Glaze Rim */}
      <group position={[-0.92, 0.83, -0.2]}>
        {/* Mug Body */}
        <mesh position={[0, 0.055, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.042, 0.11, 14]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.45} />
        </mesh>
        {/* Dipped Brown Rim Accent */}
        <mesh position={[0, 0.106, 0]}>
          <cylinderGeometry args={[0.046, 0.045, 0.012, 14]} />
          <meshStandardMaterial color="#573f2c" roughness={0.5} />
        </mesh>
        {/* Dark Coffee Surface Inside */}
        <mesh position={[0, 0.096, 0]}>
          <circleGeometry args={[0.038, 12]} />
          <meshStandardMaterial color="#2d1a10" roughness={0.3} />
        </mesh>
        {/* Handle */}
        <mesh position={[-0.054, 0.055, 0]}>
          <boxGeometry args={[0.02, 0.065, 0.016]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.45} />
        </mesh>
      </group>

      {/* 3. Floppy Disk Storage Caddy with Labelled 3.5" Disks */}
      <group position={[0.92, 0.88, -0.3]}>
        {/* Smoke-tinted acrylic caddy tray */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.26, 0.14, 0.34]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Disks inside caddy with sliding metal shutter */}
        {[-0.08, -0.02, 0.04, 0.1].map((zPos, idx) => (
          <group key={`floppy-disk-${idx}`} position={[0, 0.04, zPos]}>
            {/* Plastic disk sleeve */}
            <mesh>
              <boxGeometry args={[0.22, 0.08, 0.014]} />
              <meshStandardMaterial
                color={['#0284c7', '#dc2626', '#16a34a', '#ca8a04'][idx % 4]}
                roughness={0.5}
              />
            </mesh>
            {/* Sliding metal shutter */}
            <mesh position={[0, 0.03, 0.008]}>
              <boxGeometry args={[0.09, 0.025, 0.004]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 4. Cable bundle routed through grommet into PC tower with zip ties */}
      <mesh position={[0.55, 0.5, -0.35]} rotation={[0.45, 0, 0.25]}>
        <cylinderGeometry args={[0.018, 0.018, 0.65, 6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      {[-0.12, 0.12].map((offset, i) => (
        <mesh key={`desk-ziptie-${i}`} position={[0.55 + offset * 0.18, 0.5 + offset * 0.12, -0.35]}>
          <cylinderGeometry args={[0.022, 0.022, 0.018, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} />
        </mesh>
      ))}

      {/* ================= VINTAGE ERGONOMIC OFFICE CHAIR ================= */}
      <group position={[-0.1, 0, 0.85]}>
        {/* Aubergine / Charcoal Archival Fabric Seat Pan with stitched piping */}
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.56, 0.09, 0.52]} />
          <meshStandardMaterial color="#352642" roughness={0.78} />
        </mesh>
        {/* Contoured Backrest with Lumbar Support */}
        <mesh position={[0, 0.84, 0.24]} castShadow>
          <boxGeometry args={[0.5, 0.54, 0.08]} />
          <meshStandardMaterial color="#352642" roughness={0.78} />
        </mesh>
        {/* Armrests on Industrial Steel Brackets */}
        {[-0.27, 0.27].map((xArm, i) => (
          <group key={`chair-arm-${i}`} position={[xArm, 0.65, 0.05]}>
            <mesh castShadow>
              <boxGeometry args={[0.065, 0.03, 0.32]} />
              <meshStandardMaterial color="#1a1c24" roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.12, 0.08]}>
              <boxGeometry args={[0.028, 0.24, 0.038]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}
        {/* Pneumatic Cylinder Column & Tilt Mechanism */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.4, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* 5-Star Steel Caster Base */}
        {[0, 1.256, 2.513, 3.769, 5.026].map((rotAngle, i) => (
          <group key={`caster-star-${i}`} position={[0, 0.04, 0]} rotation={[0, rotAngle, 0]}>
            <mesh>
              <boxGeometry args={[0.48, 0.04, 0.05]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Twin-Wheel Nylon Caster at leg tip */}
            <mesh position={[0.22, -0.02, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.025, 8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
