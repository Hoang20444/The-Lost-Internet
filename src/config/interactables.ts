import type { InteractableObject } from '../types/game';

export const INTERACTABLES: InteractableObject[] = [
  {
    id: 'lamp',
    name: 'Workstation Lamp',
    actionText: 'Toggle Lighting',
    position: [-1.8, 1.2, -3.0],
    radius: 2.1,
    highlightColor: '#ffb347',
  },
  {
    id: 'computer',
    name: 'Retro Terminal',
    actionText: 'Access System',
    position: [-2.8, 1.2, -3.0],
    radius: 2.2,
    highlightColor: '#00f0ff',
  },
  {
    id: 'clock',
    name: 'Wall Chronometer',
    actionText: 'Inspect & Adjust Time',
    position: [-0.2, 2.5, -4.6],
    radius: 2.2,
    highlightColor: '#e0b0ff',
  },
  {
    id: 'door',
    name: 'Chamber Blast Door',
    actionText: 'Inspect Door Lock',
    position: [4.4, 1.2, 0.0],
    radius: 2.2,
    highlightColor: '#ff3366',
  },
  {
    id: 'window',
    name: 'Rain-slicked Window',
    actionText: 'Gaze Outside',
    position: [-4.6, 1.8, 0.0],
    radius: 2.4,
    highlightColor: '#38bdf8',
  },
  {
    id: 'notes',
    name: 'Archival Server Rack',
    actionText: 'Read Archive Records',
    position: [3.4, 1.2, -3.2],
    radius: 2.2,
    highlightColor: '#a78bfa',
  },
];

export const OBSTACLES = [
  // Desk and chair zone
  { id: 'desk', minX: -4.4, maxX: -1.3, minZ: -4.4, maxZ: -2.0 },
  // Server rack
  { id: 'server', minX: 2.4, maxX: 4.4, minZ: -4.4, maxZ: -2.2 },
  // Cozy small plant / side table in southeast corner
  { id: 'plant', minX: 3.2, maxX: 4.4, minZ: 3.2, maxZ: 4.4 },
  // Wall boundaries (handled directly with room bounding box)
];
