import React from 'react';
import { useGameStore } from '../../state/gameStore';

export const InteractionPrompt: React.FC = () => {
  const activeInteractable = useGameStore((state) => state.activeInteractable);
  const activeModal = useGameStore((state) => state.activeModal);
  const isPaused = useGameStore((state) => state.isPaused);
  const interact = useGameStore((state) => state.interact);

  if (!activeInteractable || activeModal !== null || isPaused) {
    return null;
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
        <span className="interaction-action-desc">{activeInteractable.actionText}</span>
      </div>
    </div>
  );
};
