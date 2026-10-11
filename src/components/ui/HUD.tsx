import React from 'react';
import { useGameStore } from '../../state/gameStore';
import { Volume2, VolumeX, Pause, CheckCircle2, Circle } from 'lucide-react';

export const HUD: React.FC = () => {
  const isPaused = useGameStore((state) => state.isPaused);
  const setPaused = useGameStore((state) => state.setPaused);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);

  const inspectedLamp = useGameStore((state) => state.inspectedLamp);
  const clockSolved = useGameStore((state) => state.clockSolved);
  const accessedTerminal = useGameStore((state) => state.accessedTerminal);
  const doorLocked = useGameStore((state) => state.doorLocked);

  return (
    <div className="hud-overlay">
      {/* Top Left: Title and Room badge */}
      <div className="hud-top-left">
        <div className="hud-badge">
          <span className="hud-glow-dot" />
          <span className="hud-tag">ROOM 404</span>
        </div>
        <h1 className="hud-title">THE LOST INTERNET</h1>
      </div>

      {/* Top Right: Settings & Sound quick actions */}
      <div className="hud-top-right">
        <button
          className="hud-icon-btn"
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <button
          className="hud-icon-btn"
          onClick={() => setPaused(!isPaused)}
          title="Pause / Controls Guide (ESC)"
        >
          <Pause size={18} />
          <span className="hud-btn-key">ESC</span>
        </button>
      </div>

      {/* Bottom Left: Objectives Tracker */}
      <div className="hud-bottom-left">
        <div className="objective-panel">
          <span className="objective-panel-header">PHASE 1 OBJECTIVES</span>
          <div className="objective-list">
            <div className={`objective-item ${inspectedLamp ? 'completed' : ''}`}>
              {inspectedLamp ? <CheckCircle2 size={13} /> : <Circle size={13} />}
              <span>Toggle workstation lamp</span>
            </div>
            <div className={`objective-item ${clockSolved ? 'completed' : ''}`}>
              {clockSolved ? <CheckCircle2 size={13} /> : <Circle size={13} />}
              <span>Sync chronometer (04:04)</span>
            </div>
            <div className={`objective-item ${accessedTerminal ? 'completed' : ''}`}>
              {accessedTerminal ? <CheckCircle2 size={13} /> : <Circle size={13} />}
              <span>Access computer terminal</span>
            </div>
            <div className={`objective-item ${!doorLocked ? 'completed' : ''}`}>
              {!doorLocked ? <CheckCircle2 size={13} /> : <Circle size={13} />}
              <span>Unlock chamber blast door</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right: Controls Hint */}
      <div className="hud-bottom-right">
        <div className="controls-hint-bar">
          <span className="hint-chip">
            <kbd>WASD</kbd> Move
          </span>
          <span className="hint-chip">
            <kbd>E</kbd> Interact
          </span>
          <span className="hint-chip">
            <kbd>ESC</kbd> Pause
          </span>
        </div>
      </div>
    </div>
  );
};
