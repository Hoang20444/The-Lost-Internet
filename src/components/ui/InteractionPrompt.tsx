import React from 'react';
import { useGameStore } from '../../state/gameStore';

export const InteractionPrompt: React.FC = () => {
  const activeInteractable = useGameStore((state) => state.activeInteractable);
  const activeModal = useGameStore((state) => state.activeModal);
  const isPaused = useGameStore((state) => state.isPaused);
  const interact = useGameStore((state) => state.interact);
  const lampOn = useGameStore((state) => state.lampOn);
  const clockSolved = useGameStore((state) => state.clockSolved);
  const doorLocked = useGameStore((state) => state.doorLocked);
  const accessedTerminal = useGameStore((state) => state.accessedTerminal);

  if (!activeInteractable || activeModal !== null || isPaused) {
    return null;
  }

  // Dynamic contextual action description that stays strictly synchronized with actual world state
  let actionDesc = activeInteractable.actionText;
  if (activeInteractable.id === 'lamp') {
    actionDesc = lampOn ? 'Switch Off Lighting' : 'Switch On Lighting';
  } else if (activeInteractable.id === 'door') {
    actionDesc = doorLocked ? 'Inspect Security Lock' : 'Examine Disengaged Airlock';
  } else if (activeInteractable.id === 'clock') {
    actionDesc = clockSolved ? 'Examine Synchronized Time (04:04)' : 'Inspect & Adjust Time';
  } else if (activeInteractable.id === 'computer') {
    actionDesc = accessedTerminal ? 'Resume Terminal Session' : 'Access System';
  }

  return (
    <div
      className="interaction-cue-pill"
      onClick={interact}
      role="button"
      tabIndex={0}
      title="Press E or click to interact"
    >
      <kbd className="interaction-keycap">E</kbd>
      <div className="interaction-text-group">
        <span className="interaction-object-name">{activeInteractable.name}</span>
        <span className="interaction-action-desc">{actionDesc}</span>
      </div>
    </div>
  );
};
