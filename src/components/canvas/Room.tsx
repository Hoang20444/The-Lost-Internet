import React from 'react';

export const Room: React.FC = () => {
  return (
    <group>
      {/* ================= FLOOR & PARQUET WOOD CRAFTSMANSHIP ================= */}
      {/* Structural floor foundation */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[8.8, 0.1, 7.4]} />
        <meshStandardMaterial
          color="#18151f"
          roughness={0.7}
          metalness={0.08}
        />
      </mesh>

      {/* Segmented Parquet Wood Inset with Alternating Tonal Grain Planks */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.4, 7.0]} />
        <meshStandardMaterial
          color="#221e28"
          roughness={0.62}
          metalness={0.08}
        />
      </mesh>
      {/* Parquet subtle plank seam stripes */}
      {[-2.8, -1.4, 0, 1.4, 2.8].map((xSeam, i) => (
        <mesh key={`floor-seam-${i}`} position={[xSeam, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.015, 6.95]} />
          <meshStandardMaterial color="#14111a" roughness={0.9} />
        </mesh>
      ))}

      {/* Archival Wool Rug beneath workstation with textured woven borders */}
      <mesh position={[-1.0, 0.015, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.8, 2.8]} />
        <meshStandardMaterial
          color="#302444"
          roughness={0.88}
        />
      </mesh>
      {/* Rug aged brass / gold woven border */}
      <mesh position={[-1.0, 0.018, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.6, 2.6]} />
        <meshStandardMaterial
          color="#523924"
          roughness={0.92}
        />
      </mesh>
      {/* Inner plush archival field */}
      <mesh position={[-1.0, 0.02, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.3, 2.3]} />
        <meshStandardMaterial
          color="#231a33"
          roughness={0.94}
        />
      </mesh>
      {/* Rug fringe details at North and South ends */}
      {[-3.2, -0.4].map((zFringe, i) => (
        <mesh key={`fringe-${i}`} position={[-1.0, 0.016, zFringe]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.7, 0.04]} />
          <meshStandardMaterial color="#c2bba8" roughness={0.9} />
        </mesh>
      ))}

      {/* ================= NORTH WALL (Z = -3.7) ================= */}
      {/* Main architectural muted blue-grey plaster wall */}
      <mesh position={[0, 1.9, -3.72]} receiveShadow>
        <boxGeometry args={[8.8, 3.8, 0.1]} />
        <meshStandardMaterial
          color="#2f3b52"
          roughness={0.78}
          metalness={0.04}
        />
      </mesh>

      {/* Dark stained wainscoting along bottom of North wall */}
      <mesh position={[0, 0.55, -3.65]} receiveShadow>
        <boxGeometry args={[8.7, 1.1, 0.05]} />
        <meshStandardMaterial
          color="#1c2230"
          roughness={0.55}
          metalness={0.06}
        />
      </mesh>
      {/* Wainscoting recessed panel relief strips */}
      {[-3.0, -1.5, 0, 1.5, 3.0].map((xPanel, i) => (
        <mesh key={`wainscot-rail-${i}`} position={[xPanel, 0.55, -3.62]}>
          <boxGeometry args={[0.04, 0.95, 0.02]} />
          <meshStandardMaterial color="#161b26" roughness={0.5} />
        </mesh>
      ))}
      {/* Wainscoting chair rail moulding */}
      <mesh position={[0, 1.12, -3.63]}>
        <boxGeometry args={[8.75, 0.06, 0.07]} />
        <meshStandardMaterial
          color="#38455e"
          roughness={0.45}
          metalness={0.1}
        />
      </mesh>

      {/* ================= PHYSICAL INVESTIGATION EVIDENCE BOARD ================= */}
      <group position={[-1.2, 2.3, -3.64]}>
        {/* Frame with brushed dark bronze & industrial corner brackets */}
        <mesh castShadow>
          <boxGeometry args={[2.3, 1.34, 0.04]} />
          <meshStandardMaterial color="#1e2430" roughness={0.65} metalness={0.4} />
        </mesh>
        {/* Inner cork / archival dark felt backing */}
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[2.18, 1.22]} />
          <meshStandardMaterial
            color="#0f1926"
            emissive="#0284c7"
            emissiveIntensity={0.12}
            roughness={0.82}
          />
        </mesh>

        {/* 1. Main Network Topology Map Blueprint (Center-Left) */}
        <mesh position={[-0.45, 0.08, 0.032]}>
          <planeGeometry args={[0.96, 0.68]} />
          <meshStandardMaterial
            color="#083344"
            emissive="#0284c7"
            emissiveIntensity={0.28}
            roughness={0.55}
          />
        </mesh>
        {/* Blueprint Title Header Strip */}
        <mesh position={[-0.45, 0.365, 0.036]}>
          <planeGeometry args={[0.88, 0.055]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.85} />
        </mesh>
        {/* Blueprint Subnet Grid Lines */}
        <mesh position={[-0.45, 0.06, 0.034]}>
          <planeGeometry args={[0.84, 0.48]} />
          <meshStandardMaterial color="#0c4a6e" roughness={0.6} />
        </mesh>

        {/* Major Network Backbone Hubs & Connection Vectors */}
        {/* Gateway Hub */}
        <mesh position={[-0.72, 0.18, 0.038]}>
          <circleGeometry args={[0.035, 12]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.0} />
        </mesh>
        {/* Root DNS Hub */}
        <mesh position={[-0.45, 0.14, 0.038]}>
          <circleGeometry args={[0.04, 12]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.9} />
        </mesh>
        {/* Node 404 Hub (Target) */}
        <mesh position={[-0.2, 0.02, 0.038]}>
          <circleGeometry args={[0.038, 12]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.3} />
        </mesh>
        {/* Disconnected Satellite Hub */}
        <mesh position={[-0.65, -0.08, 0.038]}>
          <circleGeometry args={[0.03, 12]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        {/* Printed Vector Lines between nodes on blueprint */}
        <mesh position={[-0.58, 0.16, 0.036]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.26, 0.005, 0.002]} />
          <meshStandardMaterial color="#7dd3fc" />
        </mesh>
        <mesh position={[-0.32, 0.08, 0.036]} rotation={[0, 0, -0.42]}>
          <boxGeometry args={[0.28, 0.005, 0.002]} />
          <meshStandardMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[-0.55, 0.03, 0.036]} rotation={[0, 0, 0.95]}>
          <boxGeometry args={[0.22, 0.004, 0.002]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>

        {/* 2. RECOGNIZABLE FOCAL DETAIL: The 04:04 Incident Note */}
        <mesh position={[0.45, 0.28, 0.035]}>
          <planeGeometry args={[0.56, 0.4]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.85} />
        </mesh>
        {/* Red Alert Header Banner */}
        <mesh position={[0.45, 0.435, 0.038]}>
          <planeGeometry args={[0.52, 0.06]} />
          <meshStandardMaterial color="#dc2626" roughness={0.7} />
        </mesh>
        {/* High-Contrast "04:04" Timestamp Callout Box */}
        <mesh position={[0.45, 0.32, 0.039]}>
          <planeGeometry args={[0.38, 0.11]} />
          <meshStandardMaterial color="#1e1b2e" roughness={0.6} />
        </mesh>
        {/* Inner Luminous Timestamp Block */}
        <mesh position={[0.45, 0.32, 0.041]}>
          <planeGeometry args={[0.32, 0.07]} />
          <meshStandardMaterial
            color="#fee2e2"
            emissive="#ef4444"
            emissiveIntensity={0.65}
            roughness={0.3}
          />
        </mesh>
        {/* Archival Red Ink Stamp Seal in Corner of note */}
        <mesh position={[0.62, 0.18, 0.039]}>
          <circleGeometry args={[0.042, 12]} />
          <meshStandardMaterial color="#991b1b" roughness={0.8} />
        </mesh>

        {/* 3. Archival Packet Log Index Card (Lower Right) */}
        <mesh position={[0.5, -0.22, 0.034]}>
          <planeGeometry args={[0.48, 0.34]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.88} />
        </mesh>
        {/* Simulated dot-matrix text lines on index card */}
        {[-0.14, -0.2, -0.26, -0.32].map((yLine, i) => (
          <mesh key={`dotmatrix-${i}`} position={[0.5, yLine, 0.037]}>
            <planeGeometry args={[0.4, 0.015]} />
            <meshStandardMaterial color="#475569" roughness={0.85} />
          </mesh>
        ))}

        {/* 4. Sepia / Monochrome Archival Photo Card (Lower Left) */}
        <mesh position={[-0.48, -0.32, 0.034]}>
          <planeGeometry args={[0.44, 0.28]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.85} />
        </mesh>
        {/* Mainframe Tape Photo Surface with grey tonal print */}
        <mesh position={[-0.48, -0.32, 0.036]}>
          <planeGeometry args={[0.38, 0.22]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>

        {/* 5. Physical Investigation Thread Strings Linking Evidence */}
        {/* Crimson String: links Root DNS on blueprint directly to 04:04 Incident Note */}
        <mesh position={[0.0, 0.22, 0.044]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.66, 0.007, 0.005]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} />
        </mesh>
        {/* Cyan String: links Node 404 on blueprint to Packet Log */}
        <mesh position={[0.15, -0.1, 0.044]} rotation={[0, 0, -0.55]}>
          <boxGeometry args={[0.58, 0.007, 0.005]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
        </mesh>

        {/* 6. 3D Machined Brass Pushpins with Heads */}
        {[
          [-0.88, 0.38],
          [-0.02, 0.38],
          [0.21, 0.44],
          [0.69, 0.44],
          [0.28, -0.07],
          [0.72, -0.07],
          [-0.67, -0.2],
          [-0.28, -0.2],
        ].map(([px, py], i) => (
          <group key={`pin-brass-${i}`} position={[px, py, 0.048]}>
            <mesh castShadow>
              <sphereGeometry args={[0.016, 8, 8]} />
              <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Wall conduit pipe running horizontally along North wall */}
      <mesh position={[0, 3.2, -3.64]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 8.6, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Wall Junction Box with Diagnostic Indicator */}
      <group position={[-2.8, 3.2, -3.63]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.22, 0.06]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[0.14, 0.08]} />
          <meshStandardMaterial color="#eab308" roughness={0.6} />
        </mesh>
      </group>

      {/* ================= WEST WALL (X = -4.3) (With Window & Bookshelf) ================= */}
      {/* Wall lower panel */}
      <mesh position={[-4.32, 0.55, 0]} receiveShadow>
        <boxGeometry args={[0.1, 1.1, 7.4]} />
        <meshStandardMaterial color="#1c2230" roughness={0.55} />
      </mesh>
      {/* Wall upper sections around window */}
      <mesh position={[-4.32, 2.2, -2.4]} receiveShadow>
        <boxGeometry args={[0.1, 2.2, 2.6]} />
        <meshStandardMaterial color="#2f3b52" roughness={0.78} />
      </mesh>
      <mesh position={[-4.32, 2.2, 1.6]} receiveShadow>
        <boxGeometry args={[0.1, 2.2, 2.6]} />
        <meshStandardMaterial color="#2f3b52" roughness={0.78} />
      </mesh>
      <mesh position={[-4.32, 3.4, -0.5]} receiveShadow>
        <boxGeometry args={[0.1, 0.8, 2.2]} />
        <meshStandardMaterial color="#2f3b52" roughness={0.78} />
      </mesh>

      {/* Archival Bookshelf along West wall */}
      <group position={[-3.85, 0.7, 2.2]}>
        {/* Solid Walnut Shelf structure with bevelled cornice */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.45, 1.4, 1.6]} />
          <meshStandardMaterial color="#322217" roughness={0.6} />
        </mesh>
        {/* Middle shelf divider */}
        <mesh position={[0.02, 0, 0]}>
          <boxGeometry args={[0.42, 0.04, 1.56]} />
          <meshStandardMaterial color="#2a1c13" roughness={0.65} />
        </mesh>
        {/* Top shelf archive binders with labelled spines */}
        {[-0.55, -0.32, -0.1, 0.12, 0.35, 0.55].map((zPos, i) => (
          <group key={`binder-group-${i}`} position={[0.05, 0.35, zPos]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.44, 0.16]} />
              <meshStandardMaterial
                color={['#1e3a5f', '#5c1d24', '#19432d', '#334155', '#475569', '#1e293b'][i % 6]}
                roughness={0.65}
              />
            </mesh>
            {/* White paper spine label */}
            <mesh position={[0.152, 0, 0]}>
              <boxGeometry args={[0.005, 0.25, 0.09]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
            </mesh>
          </group>
        ))}
        {/* Lower shelf stacked technical manuals & tape reel box */}
        <group position={[0.05, -0.4, 0.2]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[0.32, 0.12, 0.44]} />
            <meshStandardMaterial color="#3f2e22" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.04, 0]} castShadow>
            <boxGeometry args={[0.29, 0.1, 0.38]} />
            <meshStandardMaterial color="#573f2c" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ================= EAST WALL (X = +4.3) (With Blast Door & Signage) ================= */}
      {/* Lower wainscoting */}
      <mesh position={[4.32, 0.55, 0]} receiveShadow>
        <boxGeometry args={[0.1, 1.1, 7.4]} />
        <meshStandardMaterial color="#1c2230" roughness={0.55} />
      </mesh>
      {/* Upper wall sections */}
      <mesh position={[4.32, 2.2, -2.4]} receiveShadow>
        <boxGeometry args={[0.1, 2.2, 2.6]} />
        <meshStandardMaterial color="#2f3b52" roughness={0.78} />
      </mesh>
      <mesh position={[4.32, 2.2, 1.6]} receiveShadow>
        <boxGeometry args={[0.1, 2.2, 2.6]} />
        <meshStandardMaterial color="#2f3b52" roughness={0.78} />
      </mesh>
      <mesh position={[4.32, 3.4, -0.5]} receiveShadow>
        <boxGeometry args={[0.1, 0.8, 2.2]} />
        <meshStandardMaterial color="#2f3b52" roughness={0.78} />
      </mesh>

      {/* Stenciled archival signage above blast door */}
      <group position={[4.28, 3.0, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Industrial backplate */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.5, 0.22]} />
          <meshStandardMaterial color="#1c2230" roughness={0.8} />
        </mesh>
        {/* Brushed aluminum sign face */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[1.42, 0.16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Yellow hazard warning stripe */}
        <mesh position={[0, -0.065, 0.008]}>
          <planeGeometry args={[1.36, 0.025]} />
          <meshStandardMaterial color="#eab308" roughness={0.6} />
        </mesh>
      </group>

      {/* Stacked Archive Crates in South-East corner with iron corner brackets */}
      <group position={[3.3, 0.4, 2.4]}>
        {/* Bottom crate */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.72, 0.72]} />
          <meshStandardMaterial color="#4d3929" roughness={0.8} />
        </mesh>
        {/* Top crate, slightly turned for organic staging */}
        <mesh position={[0.04, 0.58, -0.04]} rotation={[0, 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.58, 0.52, 0.58]} />
          <meshStandardMaterial color="#5e4632" roughness={0.82} />
        </mesh>
        {/* Archive Requisition Label on top crate */}
        <mesh position={[0.05, 0.58, 0.255]}>
          <planeGeometry args={[0.26, 0.16]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
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
