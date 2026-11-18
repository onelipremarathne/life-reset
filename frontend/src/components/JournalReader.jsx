import { useEffect, useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import PaperCrumple from './PaperCrumple';
import { renderPaperImage } from '../utils/paperImage';

function JournalReader({ entry, onClose, onEdit, onDelete }) {
  const [src, setSrc] = useState(null);
  const [crumpled, setCrumpled] = useState(false);
  const [tossing, setTossing] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    renderPaperImage(entry).then((url) => { if (!cancelled) setSrc(url); });
    return () => { cancelled = true; };
  }, [entry]);

  // Lock page scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Escape closes (but while crumpled, Escape just smooths the paper out)
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !crumpled && !tossing) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [crumpled, tossing, onClose]);

  const smoothOut = () => { setResetKey((k) => k + 1); setCrumpled(false); };

  const toss = () => {
    if (!crumpled || tossing) return;
    setTossing(true);
    setTimeout(() => { onDelete(); onClose(); }, 650);
  };

  return (
    <div className="reader-overlay" onClick={tossing ? undefined : onClose}>
      <div className={`reader-panel ${tossing ? 'tossing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="reader-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <p className="reader-hint">
          {crumpled ? 'Crumpled. Toss it in the bin, or smooth it out.' : 'Press and hold the paper to crumple it.'}
        </p>

        <div className="reader-stage">
          {src ? (
            <PaperCrumple
              src={src}
              alt={`Journal entry: ${entry.title}`}
              width={340}
              height={440}
              sceneHeight={480}
              releaseBehavior="stay"
              crumpleAmount={0.9}
              dragRadius={120}
              paperColor="#fbf7e8"
              shadowOpacity={0.18}
              resetKey={resetKey}
              onStateChange={(s) => setCrumpled(s === 'crumpled')}
            />
          ) : (
            <p className="reader-loading">Preparing paper…</p>
          )}
          {/* The paper is an image, so give screen readers the real text */}
          <div className="sr-only">
            <h3>{entry.title}</h3>
            <p>{entry.entry}</p>
          </div>
        </div>

        <button
          type="button"
          className={`reader-bin ${crumpled ? 'ready' : ''}`}
          onClick={toss}
          disabled={!crumpled || tossing}
          aria-label="Throw this entry in the bin"
          title={crumpled ? 'Throw it away' : 'Crumple the paper first'}
        >
          <Trash2 size={22} />
        </button>

        <div className="reader-actions">
          <button type="button" className="reader-btn" onClick={onEdit} disabled={tossing}>
            <Pencil size={14} /> Edit
          </button>
          {crumpled && (
            <button type="button" className="reader-btn" onClick={smoothOut} disabled={tossing}>
              Smooth out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default JournalReader;