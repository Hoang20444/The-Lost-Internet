export type InteractableId = 'lamp' | 'computer' | 'clock' | 'door' | 'window' | 'notes';

export interface InteractableObject {
  id: InteractableId;
  name: string;
  actionText: string;
  position: [number, number, number];
  radius: number;
  highlightColor?: string;
}

export interface BoundingBox2D {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface RoomTime {
  hours: number;
  minutes: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  bloomParticles: boolean;
  shadowsEnabled: boolean;
}

export type ModalType = 'terminal' | 'clock' | 'door' | 'window' | 'notes' | 'pause' | 'journal' | null;
