import React from 'react';
import { useGameStore } from '../../state/gameStore';
import { X, CloudRain } from 'lucide-react';

export const WindowModal: React.FC = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const setActiveModal = useGameStore((state) => state.setActiveModal);

  if (activeModal !== 'window') return null;

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="glass-modal-card narrative-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <CloudRain size={18} className="text-cyan" />
            <span>RAIN-SLICKED WINDOW — EXTERIOR VIEW</span>
          </div>
          <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={16} />
          </button>
        </div>

        <div className="narrative-body">
          <p className="narrative-quote">
            "Rain streams down the reinforced glass. Through the low mist, the silhouettes of silent server buildings stand against the indigo sky."
          </p>
          <p className="narrative-text">
            Out there, the old internet once hummed with twenty million pages, neon webrings, and personal homepages. Now, only isolated archival chambers like this one retain the original transmissions.
          </p>
          <div className="narrative-meta">
            <span>Atmosphere: Rain / Fog</span>
            <span>Temperature: 14°C</span>
            <span>Status: Exterior Unreachable without Airlock Key</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-action-btn" onClick={() => setActiveModal(null)}>
            Step Back
          </button>
        </div>
      </div>
    </div>
  );
};
