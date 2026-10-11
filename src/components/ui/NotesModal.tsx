import React from 'react';
import { useGameStore } from '../../state/gameStore';
import { X, Server, Database } from 'lucide-react';

export const NotesModal: React.FC = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const setActiveModal = useGameStore((state) => state.setActiveModal);

  if (activeModal !== 'notes') return null;

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="glass-modal-card narrative-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Server size={18} className="text-purple" />
            <span>ARCHIVAL SERVER RACK — MAGNETIC TAPE LOGS</span>
          </div>
          <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={16} />
          </button>
        </div>

        <div className="narrative-body">
          <div className="archive-entry">
            <div className="archive-badge">
              <Database size={14} />
              <span>TAPE REEL #0404 — SYSTEM LOG EXCERPT</span>
            </div>
            <p className="narrative-text">
              "When the main web gateway collapsed, Node 404 severed its external uplink to prevent data corruption. All protocols were synchronized to <strong>04:04</strong>."
            </p>
            <ul className="archive-bullet-list">
              <li><strong>Node Status:</strong> Cold storage backup active.</li>
              <li><strong>Door Override:</strong> Linked to master clock calibration (04:04) or passcode <code>NET-404</code>.</li>
              <li><strong>Terminal Host:</strong> ARCHIVE-TERMINAL-09 on the wooden desk.</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-action-btn" onClick={() => setActiveModal(null)}>
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};
