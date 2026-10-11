import React from 'react';
import { useGameStore } from '../../state/gameStore';
import { X, Clock as ClockIcon, RotateCw, CheckCircle2 } from 'lucide-react';

export const ClockModal: React.FC = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const setActiveModal = useGameStore((state) => state.setActiveModal);
  const clockTime = useGameStore((state) => state.clockTime);
  const clockSolved = useGameStore((state) => state.clockSolved);
  const adjustClock = useGameStore((state) => state.adjustClock);
  const setClockTime = useGameStore((state) => state.setClockTime);

  if (activeModal !== 'clock') return null;

  const formattedHours = String(clockTime.hours).padStart(2, '0');
  const formattedMinutes = String(clockTime.minutes).padStart(2, '0');

  // Compute angles for preview
  const hourAngle = ((clockTime.hours % 12) + clockTime.minutes / 60) * (360 / 12);
  const minuteAngle = (clockTime.minutes / 60) * 360;

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="glass-modal-card clock-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <ClockIcon size={18} className="text-purple" />
            <span>WALL CHRONOMETER MECHANISM</span>
          </div>
          <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={16} />
          </button>
        </div>

        {/* Clock Interactive Display */}
        <div className="clock-modal-body">
          {/* Visual analog clock representation */}
          <div className="analog-preview-wrapper">
            <div className={`analog-clock-circle ${clockSolved ? 'solved' : ''}`}>
              {/* Dial ticks */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`clock-tick ${i % 3 === 0 ? 'major' : ''}`}
                  style={{ transform: `rotate(${i * 30}deg)` }}
                />
              ))}

              {/* Hour hand */}
              <div
                className="clock-hand hour-hand"
                style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
              />

              {/* Minute hand */}
              <div
                className="clock-hand minute-hand"
                style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }}
              />

              {/* Center cap */}
              <div className="clock-center-cap" />
            </div>
          </div>

          {/* Digital Time Readout */}
          <div className="clock-digital-display">
            <span className="digital-time">
              {formattedHours}:{formattedMinutes}
            </span>
            <span className="digital-label">SYSTEM TIME</span>
          </div>

          {/* Puzzle status banner */}
          {clockSolved ? (
            <div className="clock-status-banner success">
              <CheckCircle2 size={16} />
              <span>TIMESTAMPS SYNCHRONIZED (04:04) — PASSCODE: NET-404</span>
            </div>
          ) : (
            <div className="clock-status-banner hint">
              <RotateCw size={14} className="spin-slow" />
              <span>Target: 04:04 (The hour the last network packet dropped)</span>
            </div>
          )}

          {/* Adjustment Buttons */}
          <div className="clock-controls-grid">
            <div className="control-group">
              <span className="control-group-title">Hours</span>
              <div className="button-pair">
                <button
                  className="control-btn"
                  onClick={() => adjustClock(1, 0)}
                  title="Advance 1 Hour"
                >
                  +1 Hr
                </button>
                <button
                  className="control-btn"
                  onClick={() => adjustClock(-1, 0)}
                  title="Rewind 1 Hour"
                >
                  -1 Hr
                </button>
              </div>
            </div>

            <div className="control-group">
              <span className="control-group-title">Minutes</span>
              <div className="button-pair">
                <button
                  className="control-btn"
                  onClick={() => adjustClock(0, 5)}
                  title="Advance 5 Minutes"
                >
                  +5 Min
                </button>
                <button
                  className="control-btn"
                  onClick={() => adjustClock(0, -5)}
                  title="Rewind 5 Minutes"
                >
                  -5 Min
                </button>
              </div>
              <div className="button-pair" style={{ marginTop: '0.4rem' }}>
                <button
                  className="control-btn subtle"
                  onClick={() => adjustClock(0, 1)}
                  title="Advance 1 Minute"
                >
                  +1 Min
                </button>
                <button
                  className="control-btn subtle"
                  onClick={() => adjustClock(0, -1)}
                  title="Rewind 1 Minute"
                >
                  -1 Min
                </button>
              </div>
            </div>
          </div>

          {/* Quick preset for convenience */}
          <div className="clock-footer-actions">
            <button
              className="preset-btn"
              onClick={() => setClockTime(4, 4)}
            >
              Align with Archive Timestamp (04:04)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
