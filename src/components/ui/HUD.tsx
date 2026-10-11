import React from 'react';
import { useGameStore } from '../../state/gameStore';
import { Volume2, VolumeX, Check } from 'lucide-react';

export const HUD: React.FC = () => {
  const isPaused = useGameStore((state) => state.isPaused);
  const setPaused = useGameStore((state) => state.setPaused);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);

  const inspectedLamp = useGameStore((state) => state.inspectedLamp);
  const clockSolved = useGameStore((state) => state.clockSolved);
  const accessedTerminal = useGameStore((state) => state.accessedTerminal);
  const doorLocked = useGameStore((state) => state.doorLocked);

  const completedCount =
    (inspectedLamp ? 1 : 0) +
    (clockSolved ? 1 : 0) +
    (accessedTerminal ? 1 : 0) +
    (!doorLocked ? 1 : 0);
  const totalCount = 4;

  return (
    <div className="hud-overlay">
      {/* Top Left: Discreet indie game title & archival node stamp */}
      <div className="hud-top-left">
        <div className="hud-meta-badge">
          <span className="meta-pulse-dot" />
          <span className="meta-code">NODE 404</span>
          <span className="meta-divider">//</span>
          <span className="meta-title">OFFLINE ARCHIVE</span>
        </div>
        <div className="hud-game-subtitle">THE LOST INTERNET</div>
      </div>

      {/* Top Right: Unobtrusive system controls */}
      <div className="hud-top-right">
        <button
          className="hud-subtle-btn"
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        <button
          className="hud-subtle-btn"
          onClick={() => setPaused(!isPaused)}
          title="Pause / Settings (ESC)"
        >
          <span className="btn-text">PAUSE</span>
          <kbd className="hud-kbd">ESC</kbd>
        </button>
      </div>

      {/* Bottom Left: Compact, elegant objective tracker */}
      <div className="hud-bottom-left">
        <div className="objective-card">
          <div className="objective-header-row">
            <span className="objective-header">RECOVERY PROTOCOL</span>
            <span className="objective-progress">{completedCount}/{totalCount}</span>
          </div>
          <div className="objective-rows">
            <div className={`objective-row ${inspectedLamp ? 'done' : ''}`}>
              <span className={`pip-box ${inspectedLamp ? 'done' : ''}`}>
                {inspectedLamp ? <Check size={11} className="pip-check-icon" /> : <span className="pip-dot" />}
              </span>
              <span className="objective-text">Toggle workstation lamp</span>
            </div>
            <div className={`objective-row ${clockSolved ? 'done' : ''}`}>
              <span className={`pip-box ${clockSolved ? 'done' : ''}`}>
                {clockSolved ? <Check size={11} className="pip-check-icon" /> : <span className="pip-dot" />}
              </span>
              <span className="objective-text">Synchronize chronometer (04:04)</span>
            </div>
            <div className={`objective-row ${accessedTerminal ? 'done' : ''}`}>
              <span className={`pip-box ${accessedTerminal ? 'done' : ''}`}>
                {accessedTerminal ? <Check size={11} className="pip-check-icon" /> : <span className="pip-dot" />}
              </span>
              <span className="objective-text">Access archival terminal</span>
            </div>
            <div className={`objective-row ${!doorLocked ? 'done' : ''}`}>
              <span className={`pip-box ${!doorLocked ? 'done' : ''}`}>
                {!doorLocked ? <Check size={11} className="pip-check-icon" /> : <span className="pip-dot" />}
              </span>
              <span className="objective-text">Disengage blast airlock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right: Restrained keyboard guide */}
      <div className="hud-bottom-right">
        <div className="hud-nav-guide">
          <span className="nav-item">
            <kbd className="hud-kbd">W A S D</kbd>
            <span className="nav-label">Move</span>
          </span>
          <span className="nav-item">
            <kbd className="hud-kbd">E</kbd>
            <span className="nav-label">Interact</span>
          </span>
          <span className="nav-item">
            <kbd className="hud-kbd">ESC</kbd>
            <span className="nav-label">Menu</span>
          </span>
        </div>
      </div>
    </div>
  );
};
