import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../state/gameStore';
import { X, Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';

export const TerminalModal: React.FC = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const setActiveModal = useGameStore((state) => state.setActiveModal);
  const terminalLogs = useGameStore((state) => state.terminalLogs);
  const executeTerminalCommand = useGameStore((state) => state.executeTerminalCommand);

  const [inputVal, setInputVal] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeModal === 'terminal') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [activeModal]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  if (activeModal !== 'terminal') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeTerminalCommand(inputVal);
    setInputVal('');
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="terminal-window" onClick={(e) => e.stopPropagation()}>
        {/* Terminal Title Bar */}
        <div className="terminal-header">
          <div className="terminal-header-title">
            <TerminalIcon size={16} className="text-cyan" />
            <span>LOST-NET OS v1.0.4 — ARCHIVAL NODE 404</span>
          </div>
          <button
            className="terminal-close-btn"
            onClick={() => setActiveModal(null)}
            title="Close Terminal (ESC)"
          >
            <X size={16} />
          </button>
        </div>

        {/* CRT Scanline and curvature effect */}
        <div className="terminal-screen-container">
          <div className="crt-scanlines" />
          <div className="crt-glow-overlay" />

          {/* Terminal Output Logs */}
          <div ref={logContainerRef} className="terminal-body">
            {terminalLogs.map((line, index) => (
              <div
                key={index}
                className={`terminal-line ${line.startsWith('guest@') ? 'prompt-line' : ''} ${line.startsWith('>>') ? 'highlight-line' : ''}`}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Interactive Prompt Command Line */}
          <form onSubmit={handleSubmit} className="terminal-input-bar">
            <span className="terminal-prompt-badge">guest@lost-net:~$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type 'help', 'status', 'logs', or 'unlock NET-404'..."
              autoFocus
              spellCheck={false}
            />
            <button type="submit" className="terminal-submit-btn">
              <CornerDownLeft size={16} />
            </button>
          </form>
        </div>

        {/* Quick action buttons for easy touch/mouse navigation */}
        <div className="terminal-quick-actions">
          <span className="quick-action-label">Quick Commands:</span>
          {['help', 'status', 'logs', 'cat lore.txt', 'clock', 'lamp', 'unlock NET-404'].map((cmd) => (
            <button
              key={cmd}
              className="quick-btn"
              onClick={() => {
                executeTerminalCommand(cmd);
                inputRef.current?.focus();
              }}
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
