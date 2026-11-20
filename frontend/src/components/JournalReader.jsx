import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import PaperCrumple from "./PaperCrumple";
import { renderPaperImage } from "../utils/paperImage";

function JournalReader({ entry, onClose, onEdit, onDelete }) {
  const [src, setSrc] = useState(null);
  const [holding, setHolding] = useState(false);
  const [overBin, setOverBin] = useState(false);
  const [tossing, setTossing] = useState(false);
  const binRef = useRef(null);
  const holdingRef = useRef(false);
  const draggingRef = useRef(false);

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
    const onKey = (e) => {
      if (e.key === "Escape" && !tossing) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tossing, onClose]);

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
        <button
          type="button"
          className="reader-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <p className="reader-hint">
          {holding
            ? "Drag it onto the bin and let go to throw it away."
            : "Press and hold the paper to crumple it. Let go and it smooths out."}
        </p>

        <div
          className="reader-stage"
          onPointerDown={() => {
            draggingRef.current = holdingRef.current;
          }}
          onPointerMove={(e) => {
            if (draggingRef.current) setOverBin(isOverBin(e));
          }}
          onPointerUp={(e) => {
            if (draggingRef.current && isOverBin(e)) toss();
            draggingRef.current = false;
            setOverBin(false);
          }}
          onPointerCancel={() => {
            draggingRef.current = false;
            setOverBin(false);
          }}
        >
          <div className={`reader-paper ${tossing ? "tossing" : ""}`}>
            {src ? (
              <PaperCrumple
                src={src}
                alt={`Journal entry: ${entry.title}`}
                width={340}
                height={440}
                sceneHeight={540}
                releaseBehavior="restore"
                crumpleAmount={0.9}
                paperColor="#fbf7e8"
                shadowOpacity={0.18}
                onStateChange={handlePaperState}
              />
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

          {/* The paper is an image, so give screen readers the real text */}
          <div className="sr-only">
            <h3>{entry.title}</h3>
            <p>{entry.entry}</p>
          </div>
        </div>

        <div className="reader-actions">
          <button
            type="button"
            className="reader-btn"
            onClick={onEdit}
            disabled={tossing}
          >
            <Pencil size={14} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default JournalReader;
