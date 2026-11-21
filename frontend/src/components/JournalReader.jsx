import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pencil, Trash2, X } from "lucide-react";
import PaperCrumple from "./PaperCrumple";
import { renderPaperPages } from "../utils/paperImage";

function JournalReader({ entry, onClose, onEdit, onDelete }) {
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(0);
  const [holding, setHolding] = useState(false);
  const [overBin, setOverBin] = useState(false);
  const [tossing, setTossing] = useState(false);
  const binRef = useRef(null);
  const holdingRef = useRef(false);
  const draggingRef = useRef(false);
  const dirRef = useRef(1); // +1 forward, -1 back

  const total = pages.length;
  const canFlip = !holding && !tossing;

  useEffect(() => {
    let cancelled = false;
    renderPaperPages(entry).then((urls) => {
      if (cancelled) return;
      setPages(urls);
      setPage(0);
    });
    return () => { cancelled = true; };
  }, [entry]);

  const go = useCallback(
    (delta) => {
      if (!canFlip) return;
      dirRef.current = delta;
      setPage((p) => Math.min(total - 1, Math.max(0, p + delta)));
    },
    [canFlip, total],
  );

  // Lock page scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Escape closes, arrows turn pages
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !tossing) onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tossing, onClose, go]);

  const isOverBin = (e) => {
    const r = binRef.current?.getBoundingClientRect();
    if (!r) return false;
    const pad = 14;
    return (
      e.clientX >= r.left - pad &&
      e.clientX <= r.right + pad &&
      e.clientY >= r.top - pad &&
      e.clientY <= r.bottom + pad
    );
  };

  const toss = () => {
    if (tossing) return;
    setTossing(true);
    setTimeout(async () => {
      try {
        await onDelete();
        onClose();
      } catch {
        setTossing(false);
      }
    }, 650);
  };

  const handlePaperState = (s) => {
    const isHolding = s === "holding";
    holdingRef.current = isHolding;
    setHolding(isHolding);
    if (!isHolding) setOverBin(false);
  };

  return (
    <div className="reader-overlay" onClick={tossing ? undefined : onClose}>
      <div className="reader-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="reader-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <p className="reader-hint">
          {holding
            ? "Drag it onto the bin and let go to throw it away."
            : total > 1
              ? "Hold to crumple. Use the arrows to turn pages."
              : "Press and hold the paper to crumple it. Let go and it smooths out."}
        </p>

        <div
          className="reader-stage"
          onPointerDown={() => { draggingRef.current = holdingRef.current; }}
          onPointerMove={(e) => { if (draggingRef.current) setOverBin(isOverBin(e)); }}
          onPointerUp={(e) => {
            if (draggingRef.current && isOverBin(e)) toss();
            draggingRef.current = false;
            setOverBin(false);
          }}
          onPointerCancel={() => { draggingRef.current = false; setOverBin(false); }}
        >
          <div className={`reader-paper ${tossing ? "tossing" : ""}`}>
            {pages[page] ? (
              <motion.div
                key={page}
                initial={{ opacity: 0, x: dirRef.current * 60, rotateY: dirRef.current * -28 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                style={{ transformPerspective: 900 }}
              >
                <PaperCrumple
                  src={pages[page]}
                  alt={`Journal entry: ${entry.title}, page ${page + 1} of ${total}`}
                  width={340}
                  height={440}
                  sceneHeight={540}
                  releaseBehavior="restore"
                  crumpleAmount={0.9}
                  paperColor="#fbf7e8"
                  shadowOpacity={0.18}
                  onStateChange={handlePaperState}
                />
              </motion.div>
            ) : (
              <p className="reader-loading">Preparing paper…</p>
            )}
          </div>

          <button
            ref={binRef}
            type="button"
            className={`reader-bin ${holding ? "armed" : ""} ${overBin ? "over" : ""} ${tossing ? "bump" : ""}`}
            onClick={toss}
            disabled={tossing}
            aria-label="Throw this entry in the bin"
            title="Throw it away"
          >
            <Trash2 size={20} />
          </button>

          <div className="sr-only">
            <h3>{entry.title}</h3>
            <p>{entry.entry}</p>
          </div>
        </div>

        <div className="reader-actions">
          {total > 1 && (
            <div className="reader-pager">
              <button type="button" className="reader-btn" onClick={() => go(-1)}
                disabled={!canFlip || page === 0} aria-label="Previous page">
                <ChevronLeft size={14} />
              </button>
              <span className="reader-page-count">Page {page + 1} of {total}</span>
              <button type="button" className="reader-btn" onClick={() => go(1)}
                disabled={!canFlip || page === total - 1} aria-label="Next page">
                <ChevronRight size={14} />
              </button>
            </div>
          )}
          <button type="button" className="reader-btn" onClick={onEdit} disabled={tossing}>
            <Pencil size={14} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default JournalReader;