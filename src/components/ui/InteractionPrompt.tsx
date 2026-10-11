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
      className="interaction-prompt-container"
      onClick={interact}
      role="button"
      tabIndex={0}
      title="Click or press E to interact"
    >
      <div className="interaction-key-badge">
        <span>E</span>
      </div>
      <div className="interaction-info">
        <span className="interaction-title">{activeInteractable.name}</span>
        <span className="interaction-action">{activeInteractable.actionText}</span>
      </div>
    </div>
  );
};
