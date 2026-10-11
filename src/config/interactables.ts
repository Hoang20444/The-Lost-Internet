import type { InteractableObject } from '../types/game';

/**
 * Thoughtfully composed coordinates for Room 404:
 * Room bounds: X [-4.2, 4.2], Z [-3.8, 3.4]
 * - Desk & Computer: Primary focal point at X: -1.2, Z: -2.2
 * - Wall Chronometer: Background focal point mounted on North wall at X: 0.8, Z: -3.7
 * - Chamber Blast Door: Secondary focal point at X: 3.9, Z: -0.5
 * - Rainy Window: Atmospheric light source on West wall at X: -4.1, Z: -0.5
 * - Archival Tape Rack: North-East archival storage at X: 2.6, Z: -3.2
 */
export const INTERACTABLES: InteractableObject[] = [
  {
    id: 'lamp',
    name: 'Workstation Lamp',
    actionText: 'Toggle Lighting',
    position: [-0.4, 1.15, -2.1],
    radius: 1.8,
    highlightColor: '#ffb347',
  },
  {
    id: 'computer',
    name: 'Retro Terminal',
    actionText: 'Access System',
    position: [-1.3, 1.15, -2.1],
    radius: 2.0,
    highlightColor: '#00f0ff',
  },
  {
    id: 'clock',
    name: 'Wall Chronometer',
    actionText: 'Inspect & Adjust Time',
    position: [0.8, 2.2, -3.5],
    radius: 2.0,
    highlightColor: '#e0b0ff',
  },
  {
    id: 'door',
    name: 'Chamber Blast Door',
    actionText: 'Inspect Security Lock',
    position: [3.8, 1.2, -0.5],
    radius: 2.1,
    highlightColor: '#ff3366',
  },
  {
    id: 'window',
    name: 'Rain-slicked Window',
    actionText: 'Gaze Outside',
    position: [-3.9, 1.6, -0.5],
    radius: 2.2,
    highlightColor: '#38bdf8',
  },
  {
    id: 'notes',
    name: 'Archival Server Rack',
    actionText: 'Read Archive Records',
    position: [2.6, 1.2, -3.0],
    radius: 2.0,
    highlightColor: '#a78bfa',
  },
];

export const OBSTACLES = [
  // Desk and chair zone (centered-left)
  { id: 'desk', minX: -2.5, maxX: 0.1, minZ: -3.6, maxZ: -1.4 },
  // Archival server rack (north-east corner)
  { id: 'server', minX: 1.8, maxX: 3.4, minZ: -3.6, maxZ: -2.4 },
  // Archive crates / side storage in southeast corner
  { id: 'crates', minX: 2.8, maxX: 3.9, minZ: 1.8, maxZ: 3.2 },
  // Cozy bookshelf along southwest wall
  { id: 'shelf', minX: -3.9, maxX: -2.6, minZ: 1.8, maxZ: 3.2 },
];
