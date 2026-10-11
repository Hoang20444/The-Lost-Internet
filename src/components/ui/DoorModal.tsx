import React, { useState } from 'react';
import { useGameStore } from '../../state/gameStore';
import { X, Lock, Unlock, KeyRound, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const DoorModal: React.FC = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const setActiveModal = useGameStore((state) => state.setActiveModal);
  const doorLocked = useGameStore((state) => state.doorLocked);
  const unlockDoor = useGameStore((state) => state.unlockDoor);
  const lockDoor = useGameStore((state) => state.lockDoor);
  const clockSolved = useGameStore((state) => state.clockSolved);

  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (activeModal !== 'door') return null;

  const handleKeypadPress = (val: string) => {
    if (inputCode.length < 8) {
      setInputCode((prev) => prev + val);
      setErrorMessage('');
    }
  };

  const handleBackspace = () => {
    setInputCode((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = inputCode.trim().toUpperCase();

    if (clean === 'NET-404' || clean === '404' || (clockSolved && clean.includes('404'))) {
      unlockDoor();
      setSuccessMessage('CLEARANCE VERIFIED — AIRLOCK DISENGAGED');
      setErrorMessage('');
    } else {
      setErrorMessage('ACCESS DENIED — Invalid Passcode. Check terminal logs or clock.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="glass-modal-card door-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <KeyRound size={18} className="text-cyan" />
            <span>CHAMBER 404 — BLAST DOOR INTERFACE</span>
          </div>
          <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={16} />
          </button>
        </div>

        {/* Status Banner */}
        <div className={`door-status-indicator ${doorLocked ? 'locked' : 'unlocked'}`}>
          {doorLocked ? (
            <>
              <Lock size={24} className="status-icon pulse-red" />
              <div className="status-text">
                <span className="status-title">STATUS: LOCKED</span>
                <span className="status-desc">Security lockdown active. Passcode required.</span>
              </div>
            </>
          ) : (
            <>
              <Unlock size={24} className="status-icon pulse-green" />
              <div className="status-text">
                <span className="status-title">STATUS: UNLOCKED</span>
                <span className="status-desc">Pneumatic bolts retracted. Path to exterior is clear.</span>
              </div>
            </>
          )}
        </div>

        {/* Keypad entry section */}
        {doorLocked ? (
          <div className="door-keypad-section">
            <div className="keypad-screen">
              <span className="keypad-code-display">{inputCode || '______'}</span>
            </div>

            {errorMessage && (
              <div className="door-feedback error">
                <AlertTriangle size={14} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Keypad Buttons */}
            <div className="keypad-grid">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'NET', '0', '404'].map((btn) => (
                <button
                  key={btn}
                  className="keypad-btn"
                  onClick={() => handleKeypadPress(btn)}
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="keypad-actions">
              <button className="keypad-action-btn clear" onClick={() => setInputCode('')}>
                Clear
              </button>
              <button className="keypad-action-btn back" onClick={handleBackspace}>
                Del
              </button>
              <button className="keypad-action-btn submit" onClick={() => handleSubmit()}>
                Authorize
              </button>
            </div>

            {/* Shortcut helper if clock solved */}
            {clockSolved && (
              <button
                className="shortcut-unlock-btn"
                onClick={() => {
                  setInputCode('NET-404');
                  unlockDoor();
                  setSuccessMessage('CLOCK SYNC OVERRIDE APPLIED — DOOR UNLOCKED');
                }}
              >
                Apply Synchronized Clock Override (NET-404)
              </button>
            )}
          </div>
        ) : (
          <div className="door-unlocked-content">
            <div className="door-feedback success">
              <CheckCircle2 size={16} />
              <span>{successMessage || 'Blast door is open. The night air rushes in.'}</span>
            </div>
            <p className="door-story-paragraph">
              Beyond the heavy steel threshold lies the quiet rainy city of 2004. You have successfully preserved and accessed the archives of the lost internet.
            </p>
            <button className="keypad-action-btn clear" onClick={lockDoor}>
              Re-engage Emergency Lockdown (Lock Door)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
