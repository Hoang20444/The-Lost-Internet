import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '../../state/gameStore';
import type { ClueCategory } from '../../types/clues';

interface CategoryConfig {
  id: ClueCategory;
  label: string;
}

const CATEGORIES: CategoryConfig[] = [
  { id: 'RECOVERED', label: 'ARCHIVE LOGS' },
  { id: 'OBSERVATION', label: 'OBSERVATIONS' },
  { id: 'SIGNAL', label: 'SIGNALS' },
  { id: 'PROTOCOL', label: 'PROTOCOLS' },
];

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

  const currentIndex = discoveredClues.findIndex((c) => c.id === selectedClueId);
  const totalCount = discoveredClues.length;
  const canPrev = currentIndex > 0;
  const canNext = currentIndex >= 0 && currentIndex < totalCount - 1;

  const handlePrevPage = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedClueId(discoveredClues[currentIndex - 1].id);
    }
  }, [currentIndex, discoveredClues, setSelectedClueId]);

  const handleNextPage = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < totalCount - 1) {
      setSelectedClueId(discoveredClues[currentIndex + 1].id);
    }
  }, [currentIndex, totalCount, discoveredClues, setSelectedClueId]);

  // Keyboard navigation for page flipping (ArrowLeft / ArrowRight)
  useEffect(() => {
    if (activeModal !== 'journal') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, handlePrevPage, handleNextPage]);

  if (activeModal !== 'journal') return null;

  const selectedClue =
    discoveredClues.find((c) => c.id === selectedClueId) ||
    (discoveredClues.length > 0 ? discoveredClues[0] : null);

  const getInvestigationNote = (id: string): string => {
    switch (id) {
      case 'archive-04':
        return 'The server bay record confirms the outer web collapsed at exactly 04:04. Emergency isolation engaged Chamber 404 immediately after. The stopped wall chronometer points to this exact moment. Synchronizing the clockwork to 04:04 may trigger the chamber\'s pneumatic security override pulse.';
      case 'clock-0404':
        return 'The analog wall chronometer was frozen at 04:04, exactly matching the blackout timestamp from Archive-04. Calibrating the hands creates a security override pulse. This frequency pulse corresponds to the password "NET-404" accepted by the retro terminal.';
      case 'unknown-signal':
        return 'The vintage CRT terminal is still receiving faint residual carrier packets from October 2004. An isolated shell prompt awaits operator commands. Submitting passcode "NET-404" will disengage the chamber\'s pneumatic airlock lockdown.';
      case 'door-lockdown':
        return 'Heavy reinforced blast airlock sealing the chamber from the exterior. Solenoid bolts are locked in place. Disengaging the door requires submitting passcode "NET-404" at the terminal or synchronizing the chronometer to 04:04.';
      case 'window-skyline':
        return 'Looking out through the rain confirms total silence across the skyline. No carrier beacons or broadcast signals are active. The outer internet has gone completely dark. Chamber 404 is one of the few surviving offline archives.';
      default:
        return 'Observation logged in Chamber 404. Continue investigating surrounding equipment to correlate further leads.';
    }
  };

  return (
    <div
      className="journal-backdrop"
      onClick={() => setActiveModal(null)}
      role="dialog"
      aria-modal="true"
      aria-label="Investigator's Journal"
    >
      <div className="journal-screen-frame" onClick={(e) => e.stopPropagation()}>
        {/* Top Header Row: JOURNAL title, crisp horizontal line, and X close */}
        <header className="journal-top-bar">
          <h1 className="journal-title-text">JOURNAL</h1>
          <div className="journal-top-line" />
          <button
            className="journal-close-btn"
            onClick={() => setActiveModal(null)}
            aria-label="Close Journal"
            title="Close (ESC / TAB)"
          >
            X
          </button>
        </header>

        {/* Center Main Work Area */}
        <div className="journal-center-stage">
          {/* Left Navigation Menu */}
          <nav className="journal-left-nav" aria-label="Journal categories">
            {CATEGORIES.map((cat) => {
              const cluesInCat = discoveredClues.filter((c) => c.category === cat.id);
              const isCategoryActive = selectedClue?.category === cat.id;

              return (
                <div key={cat.id} className="journal-cat-block">
                  <button
                    className={`journal-cat-title ${isCategoryActive ? 'active' : ''}`}
                    onClick={() => {
                      if (cluesInCat.length > 0) {
                        setSelectedClueId(cluesInCat[0].id);
                      }
                    }}
                  >
                    <span>{cat.label}</span>
                  </button>

                  {cluesInCat.length > 0 && (
                    <div className="journal-cat-items">
                      {cluesInCat.map((clue) => {
                        const isSelected = selectedClue?.id === clue.id;
                        return (
                          <button
                            key={clue.id}
                            className={`journal-item-link ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedClueId(clue.id)}
                          >
                            {clue.title}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Center Book Area with Pagination Arrows */}
          <div className="journal-book-container">
            {/* Left Page Turn Arrow */}
            <button
              className="journal-nav-arrow arrow-prev"
              onClick={handlePrevPage}
              disabled={!canPrev}
              aria-label="Previous Entry"
              title="Previous Page (Left Arrow)"
            >
              &#9664;
            </button>

            {/* Realistic Open Journal Notebook */}
            <div className="journal-physical-book">
              {/* Leather Cover Trim Backing */}
              <div className="journal-leather-backing">
                <div className="journal-spread">
                  {/* LEFT PAGE */}
                  <article className="journal-page journal-page-left">
                    {selectedClue ? (
                      <div className="journal-page-inner">
                        <div className="journal-ink-stamp">
                          <span className="ink-stamp-case">{selectedClue.caseFile || 'CASE 404'}</span>
                          <span className="ink-stamp-src">LOC: {selectedClue.sourceId.toUpperCase()}</span>
                        </div>

                        <h2 className="journal-handwritten-title">{selectedClue.title}</h2>
                        <div className="journal-handwritten-subtitle">{selectedClue.summary}</div>

                        <div className="journal-handwritten-rule" />

                        <div className="journal-handwritten-body">
                          {selectedClue.fullText}
                        </div>

                        <div className="journal-page-bottom-stamp">
                          <span>RECORDED: {selectedClue.discoveredAt}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="journal-page-inner empty-page">
                        <div className="journal-ink-stamp">
                          <span>CHAMBER 404 // ARCHIVE</span>
                          <span>OCTOBER 11, 2004</span>
                        </div>
                        <h2 className="journal-handwritten-title">Investigator's Log</h2>
                        <div className="journal-handwritten-rule" />
                        <div className="journal-handwritten-body">
                          Entered Chamber 404 following the network collapse.
                          <br /><br />
                          The facility has entered cold isolation. Main power is severed, and atmospheric rain is drumming against the glass.
                        </div>
                      </div>
                    )}
                  </article>

                  {/* CENTER SPIRAL BINDER RINGS */}
                  <div className="journal-spiral-spine" aria-hidden="true">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="journal-ring-pair">
                        <div className="ring-hole ring-hole-l" />
                        <div className="ring-metal-loop" />
                        <div className="ring-hole ring-hole-r" />
                      </div>
                    ))}
                  </div>

                  {/* RIGHT PAGE */}
                  <article className="journal-page journal-page-right">
                    {selectedClue ? (
                      <div className="journal-page-inner">
                        <div className="journal-ink-stamp">
                          <span>DEDUCTIONS & OBSERVATIONS</span>
                        </div>

                        <div className="journal-handwritten-deduction">
                          <p className="journal-handwritten-body">
                            {getInvestigationNote(selectedClue.id)}
                          </p>
                        </div>

                        <div className="journal-marginalia-box">
                          <span className="marginalia-star">&#10038;</span>
                          <span className="marginalia-text">
                            Correlate this data with the CRT workstation prompt and security airlock bolts.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="journal-page-inner empty-page">
                        <div className="journal-ink-stamp">
                          <span>FIELD OBSERVATIONS</span>
                        </div>
                        <div className="journal-handwritten-body">
                          No records recovered yet.
                          <br /><br />
                          Explore the chamber, check the tape rack, calibrate the wall chronometer, and inspect the retro terminal.
                          <br /><br />
                          Press <strong style={{ color: '#854d0e' }}>[E]</strong> near objects in the chamber to log discoveries.
                        </div>
                      </div>
                    )}
                  </article>
                </div>
              </div>
            </div>

            {/* Right Page Turn Arrow */}
            <button
              className="journal-nav-arrow arrow-next"
              onClick={handleNextPage}
              disabled={!canNext}
              aria-label="Next Entry"
              title="Next Page (Right Arrow)"
            >
              &#9654;
            </button>
          </div>
        </div>

        {/* Bottom Bar: Thin horizontal line across and centered page counter */}
        <footer className="journal-bottom-bar">
          <div className="journal-bottom-line" />
          <div className="journal-page-indicator">
            {totalCount > 0 ? `${currentIndex + 1} / ${totalCount}` : '0 / 0'}
          </div>
        </footer>
      </div>
    </div>
  );
};
