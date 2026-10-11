import { create } from 'zustand';
import { soundManager } from '../audio/soundManager';
import type { InteractableObject, ModalType } from '../types/game';
import type { Clue } from '../types/clues';
import { CLUE_CATALOG } from '../config/clues';
import {
  loadSavedGameState,
  saveGameState,
  clearSavedGameState,
  hydrateClues,
} from '../utils/storage';

interface GameState {
  // Player state
  player: {
    position: [number, number, number];
    rotation: number;
    isMoving: boolean;
  };
  setPlayerPosition: (pos: [number, number, number]) => void;
  setPlayerRotation: (rot: number) => void;
  setPlayerMoving: (moving: boolean) => void;
  resetPlayerPosition: () => void;

  // Lamp state
  lampOn: boolean;
  toggleLamp: () => void;

  // Clock state
  clockTime: { hours: number; minutes: number };
  clockSolved: boolean;
  adjustClock: (deltaHours: number, deltaMinutes: number) => void;
  setClockTime: (hours: number, minutes: number) => void;

  // Door state
  doorLocked: boolean;
  unlockDoor: () => void;
  lockDoor: () => void;

  // Terminal state
  terminalLogs: string[];
  terminalHistory: string[];
  historyIndex: number;
  terminalPower: boolean;
  executeTerminalCommand: (cmd: string) => void;

  // Interaction & UI modals
  activeInteractable: InteractableObject | null;
  setActiveInteractable: (interactable: InteractableObject | null) => void;
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  interact: () => void;

  // Phase 2.2 — Memory Archive Clues & Inventory
  discoveredClues: Clue[];
  selectedClueId: string | null;
  setSelectedClueId: (id: string | null) => void;
  discoverClue: (clueId: string) => void;
  toggleJournal: () => void;
  persistProgress: () => void;
  clearSavedGame: () => void;

  // Game Settings & Pause
  soundEnabled: boolean;
  toggleSound: () => void;
  bloomParticles: boolean;
  toggleParticles: () => void;
  shadowsEnabled: boolean;
  toggleShadows: () => void;
  isPaused: boolean;
  setPaused: (paused: boolean) => void;

  // Objectives tracking
  inspectedLamp: boolean;
  adjustedClock: boolean;
  accessedTerminal: boolean;
  unlockedDoor: boolean;
}

const INITIAL_TERMINAL_LOGS = [
  '=== ARCHIVAL NODE 404 - LOST-NET OS v1.0.4 ===',
  'Timestamp: 2004-10-11 // Emergency Protocol Active',
  'Host: ARCHIVE-TERMINAL-09 // Status: OFFLINE ISOLATION',
  '',
  'Type "help" for a list of valid commands.',
  'System hint: Synchronize the analog wall clock with packet failure time (04:04).',
  ''
];

// Module-level timestamp to debounce rapid repeated interaction events
let lastInteractTimestamp = 0;

// Load persisted state if available
const savedState = loadSavedGameState();

export const useGameStore = create<GameState>((set, get) => ({
  player: {
    position: [0, 0, 0],
    rotation: 0,
    isMoving: false,
  },
  setPlayerPosition: (position) =>
    set((state) => ({ player: { ...state.player, position } })),
  setPlayerRotation: (rotation) =>
    set((state) => ({ player: { ...state.player, rotation } })),
  setPlayerMoving: (isMoving) =>
    set((state) => ({ player: { ...state.player, isMoving } })),
  resetPlayerPosition: () =>
    set((state) => ({
      player: { ...state.player, position: [0, 0, 0], rotation: 0, isMoving: false },
    })),

  lampOn: savedState ? savedState.lampOn : true,
  toggleLamp: () => {
    const next = !get().lampOn;
    soundManager.playSwitch(next);
    set({ lampOn: next, inspectedLamp: true });
    get().persistProgress();
  },

  clockTime: savedState ? savedState.clockTime : { hours: 2, minutes: 20 },
  clockSolved: savedState ? savedState.clockSolved : false,
  adjustClock: (deltaHours: number, deltaMinutes: number) => {
    const current = get().clockTime;
    let newMinutes = current.minutes + deltaMinutes;
    let newHours = current.hours + deltaHours;

    while (newMinutes >= 60) {
      newMinutes -= 60;
      newHours += 1;
    }
    while (newMinutes < 0) {
      newMinutes += 60;
      newHours -= 1;
    }
    while (newHours >= 24) {
      newHours -= 24;
    }
    while (newHours < 0) {
      newHours += 24;
    }

    soundManager.playClockTick();
    const isTarget = newHours === 4 && newMinutes === 4;
    if (isTarget && !get().clockSolved) {
      soundManager.playDoorUnlock();
    }

    set({
      clockTime: { hours: newHours, minutes: newMinutes },
      clockSolved: isTarget,
      adjustedClock: true,
    });
    get().persistProgress();
  },
  setClockTime: (hours: number, minutes: number) => {
    const isTarget = hours === 4 && minutes === 4;
    soundManager.playClockTick(true);
    set({
      clockTime: { hours, minutes },
      clockSolved: isTarget,
      adjustedClock: true,
    });
    get().persistProgress();
  },

  doorLocked: savedState ? savedState.doorLocked : true,
  unlockDoor: () => {
    if (get().doorLocked) {
      soundManager.playDoorUnlock();
      set({ doorLocked: false, unlockedDoor: true });
      get().persistProgress();
    }
  },
  lockDoor: () => {
    soundManager.playSwitch(false);
    set({ doorLocked: true });
    get().persistProgress();
  },

  terminalLogs: INITIAL_TERMINAL_LOGS,
  terminalHistory: [],
  historyIndex: -1,
  terminalPower: true,
  executeTerminalCommand: (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    soundManager.playTerminalKey();
    const args = trimmed.split(' ');
    const command = args[0].toLowerCase();
    const state = get();
    const newLogs = [...state.terminalLogs, `guest@lost-net:~$ ${trimmed}`];

    switch (command) {
      case 'help':
        newLogs.push(
          'Available commands:',
          '  help               - Show this list of commands',
          '  status             - Show room power and door lockdown diagnostics',
          '  clock              - Inspect synchronized system clock',
          '  logs               - List discovered network archive files',
          '  cat <filename>     - Read archive file (e.g. "cat lore.txt")',
          '  lamp               - Toggle room workstation lamp',
          '  unlock <passcode>  - Submit door override passcode',
          '  clear              - Clear console screen',
          '  exit               - Close terminal interface'
        );
        break;

      case 'status':
        newLogs.push(
          '=== DIAGNOSTIC REPORT ===',
          `Main Lighting:     ${state.lampOn ? '[ACTIVE - AMBER]' : '[OFFLINE]'}`,
          `Room Clock Sync:   [${String(state.clockTime.hours).padStart(2, '0')}:${String(state.clockTime.minutes).padStart(2, '0')}] ${state.clockSolved ? '(SYNCHRONIZED - 404 MATCH)' : '(DESYNC)'}`,
          `Blast Door:        ${state.doorLocked ? '[LOCKED - CODE REQUIRED]' : '[UNLOCKED - CLEARANCE GRANTED]'}`,
          `Terminal Node:     [ISOLATED FROM OUTER WEB]`
        );
        break;

      case 'clock':
        newLogs.push(
          `System clock reading: ${String(state.clockTime.hours).padStart(2, '0')}:${String(state.clockTime.minutes).padStart(2, '0')}`,
          state.clockSolved
            ? '>> TIMESTAMPS MATCH: Passcode unlocked: "NET-404"'
            : '>> Warning: Target timestamp is 04:04 (The moment the lost internet went cold).'
        );
        break;

      case 'logs':
        newLogs.push(
          'Archival Files in /var/log/archive/:',
          '  - lore.txt        (The Great Blackout)',
          '  - protocol.txt    (Chamber security protocols)',
          '  - passkey.txt     (Door authorization guide)'
        );
        break;

      case 'cat':
      case 'read': {
        const file = args[1]?.toLowerCase();
        if (file === 'lore.txt') {
          newLogs.push(
            '--- lore.txt ---',
            'October 11, 2004.',
            'They said the web would last forever. But node by node, the hyperlinks withered.',
            'Geocities vanished into static. BBS boards went silent. Forums drowned in 404s.',
            'This room is one of the final offline repositories containing the early web.',
            'To step outside into the night, enter code "NET-404" or align the clock to 04:04.'
          );
        } else if (file === 'protocol.txt') {
          newLogs.push(
            '--- protocol.txt ---',
            'Chamber 404 Lockdown Protocol:',
            '1. In case of isolation, door lock engages automatically.',
            '2. Command "unlock NET-404" releases the pneumatic bolt.',
            '3. Alternatively, aligning the clock to 04:04 will transmit the override pulse.'
          );
        } else if (file === 'passkey.txt') {
          newLogs.push(
            '--- passkey.txt ---',
            state.clockSolved
              ? 'PASSKEY GRANTED: Code is "NET-404". Run command: unlock NET-404'
              : 'ENCRYPTED: Requires analog clock synchronization to 04:04 first.'
          );
        } else {
          newLogs.push(`cat: ${args[1] || 'filename'}: No such file. Type 'logs' to list files.`);
        }
        break;
      }

      case 'lamp':
        state.toggleLamp();
        newLogs.push(`Workstation lamp is now ${get().lampOn ? 'ON' : 'OFF'}.`);
        break;

      case 'unlock': {
        const code = args[1]?.toUpperCase();
        if (code === 'NET-404' || (code === '404' && state.clockSolved)) {
          state.unlockDoor();
          newLogs.push('>> [SECURITY OVERRIDE ACCEPTED]: Pneumatic door locks DISENGAGED.');
        } else {
          newLogs.push(`>> [DENIED]: Invalid passcode "${args[1] || ''}". Check passkey.txt or synchronize clock to 04:04.`);
        }
        break;
      }

      case 'clear':
        set({ terminalLogs: [] });
        return;

      case 'exit':
        set({ activeModal: null });
        return;

      default:
        newLogs.push(`Command not recognized: "${trimmed}". Type "help" for instructions.`);
    }

    set({
      terminalLogs: newLogs,
      terminalHistory: [...state.terminalHistory, trimmed],
      accessedTerminal: true,
    });
  },

  activeInteractable: null,
  setActiveInteractable: (activeInteractable) => set({ activeInteractable }),

  activeModal: null,
  setActiveModal: (activeModal) => {
    soundManager.resume();
    soundManager.playInteract();
    set({ activeModal });
  },

  // Phase 2.2 — Memory Archive Clues & Inventory
  discoveredClues: savedState ? hydrateClues(savedState.discoveredClueIds) : [],
  selectedClueId:
    savedState && savedState.discoveredClueIds.length > 0 ? savedState.discoveredClueIds[0] : null,
  setSelectedClueId: (selectedClueId) => set({ selectedClueId }),

  discoverClue: (clueId: string) => {
    const { discoveredClues } = get();
    // Do not store duplicate clues
    if (discoveredClues.some((c) => c.id === clueId)) return;

    const def = CLUE_CATALOG.find((c) => c.id === clueId);
    if (!def) return;

    const clock = get().clockTime;
    const timeStamp = `10/11/04 // ${String(clock.hours).padStart(2, '0')}:${String(clock.minutes).padStart(2, '0')}`;

    const newClue: Clue = {
      ...def,
      discoveredAt: timeStamp,
    };

    const nextClues = [...discoveredClues, newClue];
    set((state) => ({
      discoveredClues: nextClues,
      selectedClueId: state.selectedClueId || newClue.id,
    }));

    get().persistProgress();
  },

  toggleJournal: () => {
    const { activeModal, setActiveModal, isPaused } = get();
    if (isPaused) return;

    if (activeModal === 'journal') {
      setActiveModal(null);
    } else if (activeModal === null) {
      setActiveModal('journal');
    }
  },

  persistProgress: () => {
    const s = get();
    saveGameState({
      version: 1,
      discoveredClueIds: s.discoveredClues.map((c) => c.id),
      lampOn: s.lampOn,
      clockTime: s.clockTime,
      clockSolved: s.clockSolved,
      doorLocked: s.doorLocked,
      inspectedLamp: s.inspectedLamp,
      adjustedClock: s.adjustedClock,
      accessedTerminal: s.accessedTerminal,
      unlockedDoor: s.unlockedDoor,
    });
  },

  clearSavedGame: () => {
    clearSavedGameState();
    set({
      discoveredClues: [],
      selectedClueId: null,
      lampOn: true,
      clockTime: { hours: 2, minutes: 20 },
      clockSolved: false,
      doorLocked: true,
      inspectedLamp: false,
      adjustedClock: false,
      accessedTerminal: false,
      unlockedDoor: false,
    });
  },

  interact: () => {
    const { activeInteractable, activeModal, isPaused, toggleLamp, discoverClue } = get();

    // 1. Guard against interactions while paused or when a modal is active
    if (isPaused || activeModal) return;

    // 2. Guard against missing interactable
    if (!activeInteractable) return;

    // 3. Prevent duplicate activation while an interaction is being processed (250ms cooldown)
    const now = Date.now();
    if (now - lastInteractTimestamp < 250) return;
    lastInteractTimestamp = now;

    soundManager.resume();
    soundManager.playInteract();

    switch (activeInteractable.id) {
      case 'lamp':
        toggleLamp();
        break;
      case 'computer':
        set({ activeModal: 'terminal', accessedTerminal: true });
        discoverClue('unknown-signal');
        get().persistProgress();
        break;
      case 'clock':
        set({ activeModal: 'clock' });
        discoverClue('clock-0404');
        break;
      case 'door':
        set({ activeModal: 'door' });
        discoverClue('door-lockdown');
        break;
      case 'window':
        set({ activeModal: 'window' });
        discoverClue('window-skyline');
        break;
      case 'notes':
        set({ activeModal: 'notes' });
        discoverClue('archive-04');
        break;
    }
  },

  soundEnabled: true,
  toggleSound: () => {
    const next = !get().soundEnabled;
    soundManager.setEnabled(next);
    set({ soundEnabled: next });
  },

  bloomParticles: true,
  toggleParticles: () => set((s) => ({ bloomParticles: !s.bloomParticles })),

  shadowsEnabled: true,
  toggleShadows: () => set((s) => ({ shadowsEnabled: !s.shadowsEnabled })),

  isPaused: false,
  setPaused: (isPaused) => {
    soundManager.playInteract();
    set({ isPaused });
  },

  inspectedLamp: savedState ? savedState.inspectedLamp : false,
  adjustedClock: savedState ? savedState.adjustedClock : false,
  accessedTerminal: savedState ? savedState.accessedTerminal : false,
  unlockedDoor: savedState ? savedState.unlockedDoor : false,
}));
