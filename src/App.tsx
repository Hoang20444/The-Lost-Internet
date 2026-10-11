import React, { useEffect } from 'react';
import { GameCanvas } from './components/canvas/GameCanvas';
import { HUD } from './components/ui/HUD';
import { InteractionPrompt } from './components/ui/InteractionPrompt';
import { TerminalModal } from './components/ui/TerminalModal';
import { ClockModal } from './components/ui/ClockModal';
import { DoorModal } from './components/ui/DoorModal';
import { WindowModal } from './components/ui/WindowModal';
import { NotesModal } from './components/ui/NotesModal';
import { PauseModal } from './components/ui/PauseModal';
import { JournalModal } from './components/ui/JournalModal';
import { useGameStore } from './state/gameStore';
import { soundManager } from './audio/soundManager';
import './App.css';

export const App: React.FC = () => {
  const interact = useGameStore((state) => state.interact);
  const activeModal = useGameStore((state) => state.activeModal);
  const setActiveModal = useGameStore((state) => state.setActiveModal);
  const isPaused = useGameStore((state) => state.isPaused);
  const setPaused = useGameStore((state) => state.setPaused);

  // Global key bindings for Interact (E), Archive (Tab), and Escape (Pause/Close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept game shortcuts if user is typing into input/textarea
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if (e.code === 'KeyE' && !isInput && !e.repeat) {
        e.preventDefault();
        interact();
      } else if (e.code === 'Tab' && !isInput && !e.repeat) {
        e.preventDefault();
        if (!isPaused) {
          if (activeModal === 'journal') {
            setActiveModal(null);
          } else if (activeModal === null) {
            setActiveModal('journal');
          }
        }
      } else if (e.code === 'Escape') {
        e.preventDefault();
        if (activeModal) {
          setActiveModal(null);
        } else {
          setPaused(!isPaused);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [interact, activeModal, setActiveModal, isPaused, setPaused]);

  // Start procedural ambient sound on first user gesture
  useEffect(() => {
    const handleFirstGesture = () => {
      soundManager.resume();
      soundManager.startAmbient();
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  return (
    <div className="game-wrapper">
      {/* 3D WebGL Canvas */}
      <GameCanvas />

      {/* Head-Up Display (HUD) */}
      <HUD />

      {/* Dynamic Contextual Interaction Prompt */}
      <InteractionPrompt />

      {/* In-Game UI Modals */}
      <TerminalModal />
      <ClockModal />
      <DoorModal />
      <WindowModal />
      <NotesModal />
      <JournalModal />
      <PauseModal />
    </div>
  );
};

export default App;
