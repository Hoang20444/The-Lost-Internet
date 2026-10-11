import React, { useEffect } from 'react';
import { useGameStore } from '../../state/gameStore';
import {
  X,
  Archive,
  FileText,
  Clock,
  Radio,
  ShieldAlert,
  Eye,
  Database,
  Hash,
  Compass,
} from 'lucide-react';
import type { ClueCategory } from '../../types/clues';

export const JournalModal: React.FC = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const setActiveModal = useGameStore((state) => state.setActiveModal);
  const discoveredClues = useGameStore((state) => state.discoveredClues);
  const selectedClueId = useGameStore((state) => state.selectedClueId);
  const setSelectedClueId = useGameStore((state) => state.setSelectedClueId);

  // Auto-select first clue if none selected
  useEffect(() => {
    if (discoveredClues.length > 0 && !selectedClueId) {
      setSelectedClueId(discoveredClues[0].id);
    }
  }, [discoveredClues, selectedClueId, setSelectedClueId]);

  if (activeModal !== 'journal') return null;

  const selectedClue =
    discoveredClues.find((c) => c.id === selectedClueId) ||
    (discoveredClues.length > 0 ? discoveredClues[0] : null);

  const getCategoryIcon = (category: ClueCategory) => {
    switch (category) {
      case 'RECOVERED':
        return <Database size={13} className="text-purple" />;
      case 'OBSERVATION':
        return <Eye size={13} className="text-cyan" />;
      case 'SIGNAL':
        return <Radio size={13} className="text-amber" />;
      case 'PROTOCOL':
        return <ShieldAlert size={13} className="text-rose" />;
      default:
        return <FileText size={13} className="text-slate" />;
    }
  };

  const getCategoryClass = (category: ClueCategory) => {
    switch (category) {
      case 'RECOVERED':
        return 'cat-recovered';
      case 'OBSERVATION':
        return 'cat-observation';
      case 'SIGNAL':
        return 'cat-signal';
      case 'PROTOCOL':
        return 'cat-protocol';
      default:
        return 'cat-general';
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div
        className="glass-modal-card journal-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Memory Archive"
      >
        {/* Modal Top Header */}
        <div className="modal-header journal-header">
          <div className="modal-header-title">
            <Archive size={18} className="text-cyan" />
            <span className="journal-title-text">NODE 404 // MEMORY ARCHIVE</span>
            <span className="journal-count-chip">
              {discoveredClues.length} {discoveredClues.length === 1 ? 'RECORD' : 'RECORDS'}
            </span>
          </div>

          <div className="journal-header-actions">
            <span className="journal-shortcut-hint">
              <kbd className="hud-kbd">TAB</kbd> / <kbd className="hud-kbd">ESC</kbd> to close
            </span>
            <button
              className="modal-close-btn"
              onClick={() => setActiveModal(null)}
              aria-label="Close archive"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Split Content */}
        <div className="journal-split-body">
          {/* Left Column: Clue Records Index */}
          <div className="journal-sidebar">
            <div className="journal-sidebar-header">
              <Hash size={13} className="text-cyan" />
              <span>CASE INDEX</span>
            </div>

            {discoveredClues.length === 0 ? (
              <div className="journal-empty-sidebar">
                <Compass size={24} className="text-slate opacity-40 mb-2" />
                <p>No records recovered yet.</p>
                <small>Explore the chamber to catalog leads.</small>
              </div>
            ) : (
              <div className="journal-clue-list">
                {discoveredClues.map((clue) => {
                  const isSelected = selectedClue?.id === clue.id;
                  return (
                    <button
                      key={clue.id}
                      className={`journal-clue-tab ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedClueId(clue.id)}
                    >
                      <div className="clue-tab-top">
                        <span className={`clue-category-badge ${getCategoryClass(clue.category)}`}>
                          {getCategoryIcon(clue.category)}
                          <span>{clue.category}</span>
                        </span>
                        <span className="clue-tab-id">{clue.caseFile || 'CASE 404'}</span>
                      </div>
                      <div className="clue-tab-title">{clue.title}</div>
                      <div className="clue-tab-summary">{clue.summary}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Clue Dossier Details */}
          <div className="journal-detail-pane">
            {selectedClue ? (
              <div className="clue-dossier">
                {/* Dossier Meta Strip */}
                <div className="dossier-meta-header">
                  <div className="dossier-pill-row">
                    <span className={`dossier-category-pill ${getCategoryClass(selectedClue.category)}`}>
                      {getCategoryIcon(selectedClue.category)}
                      <span>{selectedClue.category} RECORD</span>
                    </span>
                    <span className="dossier-casefile-pill">
                      {selectedClue.caseFile || 'CLASSIFIED // NODE 404'}
                    </span>
                  </div>

                  <h2 className="dossier-heading">{selectedClue.title}</h2>
                  <div className="dossier-subheading">{selectedClue.summary}</div>

                  <div className="dossier-stamp-row">
                    <div className="dossier-stamp">
                      <span className="stamp-label">SOURCE:</span>
                      <span className="stamp-value">{selectedClue.sourceId.toUpperCase()}</span>
                    </div>
                    <div className="dossier-stamp">
                      <span className="stamp-label">RECOVERED:</span>
                      <span className="stamp-value">{selectedClue.discoveredAt}</span>
                    </div>
                  </div>
                </div>

                {/* Dossier Document Content */}
                <div className="dossier-body">
                  <div className="dossier-text-card">
                    <p className="dossier-narrative-p">{selectedClue.fullText}</p>
                  </div>

                  {/* Contextual Mystery Cross-Reference */}
                  <div className="dossier-cross-ref">
                    <div className="cross-ref-title">
                      <Clock size={13} className="text-cyan" />
                      <span>INVESTIGATION CROSS-REFERENCE</span>
                    </div>
                    <div className="cross-ref-desc">
                      {selectedClue.id === 'archive-04' &&
                        'Cross-reference: Align the Wall Chronometer hands to the blackout incident timestamp (04:04) to unlock security circuitry.'}
                      {selectedClue.id === 'clock-0404' &&
                        'Cross-reference: The 04:04 calibration pulse generates the passcode override "NET-404" accepted by the Retro Terminal and Chamber Blast Door.'}
                      {selectedClue.id === 'unknown-signal' &&
                        'Cross-reference: Enter terminal command "help" or "logs" to inspect offline network remnants. Passcode "NET-404" grants clearance.'}
                      {selectedClue.id === 'door-lockdown' &&
                        'Cross-reference: Requires code "NET-404" or clock synchronization to retract pneumatic bolts and step into the exterior.'}
                      {selectedClue.id === 'window-skyline' &&
                        'Cross-reference: Confirms global blackout condition. Only localized offline nodes remain functional.'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="journal-empty-dossier">
                <Archive size={42} className="text-cyan opacity-30 mb-3" />
                <h3 className="empty-dossier-title">NO RECORDS CATALOGED</h3>
                <p className="empty-dossier-p">
                  The Memory Archive is currently empty. Explore the chamber, inspect the server tape
                  rack, examine the analog wall clock, and interact with the terminal to uncover
                  leads.
                </p>
                <div className="empty-dossier-hint">
                  <span>Press <kbd className="hud-kbd">E</kbd> near objects in the chamber to investigate</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer journal-footer">
          <div className="journal-footer-meta">
            <span className="meta-pulse-dot" />
            <span>LOCAL PERSISTENCE ACTIVE — PROGRESS STORED</span>
          </div>
          <button className="modal-action-btn" onClick={() => setActiveModal(null)}>
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};
