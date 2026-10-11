import React from 'react';
import { useGameStore } from '../../state/gameStore';
import {
  X,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  Sun,
  RotateCcw,
  Compass,
  Keyboard,
  Info
} from 'lucide-react';

export const PauseModal: React.FC = () => {
  const isPaused = useGameStore((state) => state.isPaused);
  const setPaused = useGameStore((state) => state.setPaused);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const bloomParticles = useGameStore((state) => state.bloomParticles);
  const toggleParticles = useGameStore((state) => state.toggleParticles);
  const shadowsEnabled = useGameStore((state) => state.shadowsEnabled);
  const toggleShadows = useGameStore((state) => state.toggleShadows);
  const resetPlayerPosition = useGameStore((state) => state.resetPlayerPosition);

  if (!isPaused) return null;

  return (
    <div className="modal-backdrop" onClick={() => setPaused(false)}>
      <div className="glass-modal-card pause-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <Compass size={18} className="text-cyan" />
            <span>PAUSED — THE LOST INTERNET</span>
          </div>
          <button className="modal-close-btn" onClick={() => setPaused(false)}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="pause-body">
          {/* Controls Quick Guide */}
          <div className="settings-section">
            <div className="section-title">
              <Keyboard size={15} />
              <span>CONTROL GUIDE</span>
            </div>
            <div className="controls-grid">
              <div className="control-card">
                <span className="key-combo">W A S D / Arrows</span>
                <span className="key-desc">Move explorer smoothly</span>
              </div>
              <div className="control-card">
                <span className="key-combo">E Key / Click</span>
                <span className="key-desc">Interact with nearby object</span>
              </div>
              <div className="control-card">
                <span className="key-combo">ESC Key</span>
                <span className="key-desc">Toggle Pause / Close Screen</span>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="settings-section">
            <div className="section-title">
              <Info size={15} />
              <span>SYSTEM SETTINGS</span>
            </div>
            <div className="settings-options-list">
              {/* Sound Toggle */}
              <div className="setting-row">
                <div className="setting-info">
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  <span>Sound & Audio Synthesis</span>
                </div>
                <button
                  className={`toggle-btn ${soundEnabled ? 'active' : ''}`}
                  onClick={toggleSound}
                >
                  {soundEnabled ? 'ON' : 'MUTED'}
                </button>
              </div>

              {/* Particles Toggle */}
              <div className="setting-row">
                <div className="setting-info">
                  <Sparkles size={16} />
                  <span>Atmospheric Dust Particles</span>
                </div>
                <button
                  className={`toggle-btn ${bloomParticles ? 'active' : ''}`}
                  onClick={toggleParticles}
                >
                  {bloomParticles ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Shadows Toggle */}
              <div className="setting-row">
                <div className="setting-info">
                  <Sun size={16} />
                  <span>Real-time Dynamic Shadows</span>
                </div>
                <button
                  className={`toggle-btn ${shadowsEnabled ? 'active' : ''}`}
                  onClick={toggleShadows}
                >
                  {shadowsEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Reset Player Position */}
              <div className="setting-row">
                <div className="setting-info">
                  <RotateCcw size={16} />
                  <span>Reset Player Position</span>
                </div>
                <button
                  className="action-btn-sm"
                  onClick={() => {
                    resetPlayerPosition();
                    setPaused(false);
                  }}
                >
                  Reset to Center
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="primary-resume-btn" onClick={() => setPaused(false)}>
            <Play size={16} />
            <span>Resume Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};
