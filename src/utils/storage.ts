import type { Clue } from '../types/clues';
import { CLUE_CATALOG } from '../config/clues';

const STORAGE_KEY = 'lost_net_archive_save_v1';

export interface PersistentProgress {
  version: 1;
  discoveredClueIds: string[];
  lampOn: boolean;
  clockTime: { hours: number; minutes: number };
  clockSolved: boolean;
  doorLocked: boolean;
  inspectedLamp: boolean;
  adjustedClock: boolean;
  accessedTerminal: boolean;
  unlockedDoor: boolean;
}

/**
 * Validates and loads saved game state from localStorage.
 * Gracefully recovers from missing, corrupted, or outdated payloads.
 */
export function loadSavedGameState(): PersistentProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;

    // Validate discoveredClueIds array
    const discoveredClueIds: string[] = Array.isArray(data.discoveredClueIds)
      ? data.discoveredClueIds.filter((id: unknown) => typeof id === 'string')
      : [];

    // Validate clock hours and minutes
    const hours =
      typeof data.clockTime?.hours === 'number' &&
      data.clockTime.hours >= 0 &&
      data.clockTime.hours < 24
        ? Math.floor(data.clockTime.hours)
        : 2;

    const minutes =
      typeof data.clockTime?.minutes === 'number' &&
      data.clockTime.minutes >= 0 &&
      data.clockTime.minutes < 60
        ? Math.floor(data.clockTime.minutes)
        : 20;

    return {
      version: 1,
      discoveredClueIds,
      lampOn: typeof data.lampOn === 'boolean' ? data.lampOn : true,
      clockTime: { hours, minutes },
      clockSolved:
        typeof data.clockSolved === 'boolean' ? data.clockSolved : hours === 4 && minutes === 4,
      doorLocked: typeof data.doorLocked === 'boolean' ? data.doorLocked : true,
      inspectedLamp: typeof data.inspectedLamp === 'boolean' ? data.inspectedLamp : false,
      adjustedClock: typeof data.adjustedClock === 'boolean' ? data.adjustedClock : false,
      accessedTerminal: typeof data.accessedTerminal === 'boolean' ? data.accessedTerminal : false,
      unlockedDoor: typeof data.unlockedDoor === 'boolean' ? data.unlockedDoor : false,
    };
  } catch (err) {
    console.warn('[Storage] Error loading saved game state, starting clean session:', err);
    return null;
  }
}

/**
 * Persists current gameplay progress and clue collection to localStorage.
 */
export function saveGameState(state: PersistentProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[Storage] Error persisting game state:', err);
  }
}

/**
 * Clears saved game state from localStorage.
 */
export function clearSavedGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[Storage] Error clearing saved game state:', err);
  }
}

/**
 * Helper to hydrate full Clue objects from stored Clue IDs using catalog.
 */
export function hydrateClues(clueIds: string[]): Clue[] {
  const result: Clue[] = [];
  for (const id of clueIds) {
    const def = CLUE_CATALOG.find((c) => c.id === id);
    if (def) {
      result.push({
        ...def,
        discoveredAt: 'ARCHIVE_INDEX_VERIFIED',
      });
    }
  }
  return result;
}
