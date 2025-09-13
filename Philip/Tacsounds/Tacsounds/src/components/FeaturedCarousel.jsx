import { useEffect, useMemo, useRef, useState } from "react";
import "./carousel.css";

const SWIPE_THRESHOLD = 40;
// spacing controls
const GAP_NEAR = 36;     // base gap for neighbour (in % of card width)
const GAP_STEP = 18;     // extra gap per distance step
const GAP_MAX  = 78;     // cap so far cards don’t fly away
const SCALE_STEP = 0.12; // how much side cards shrink per step
const MAX_SHRINK = 0.36;

export default function FeaturedCarousel({ tracks = [], index = 0, setIndex, onPlayIndex, className = "" }) {
  const wrapperRef = useRef(null);
  const [drag, setDrag] = useState({ active: false, startX: 0, lastX: 0 });
  const count = tracks.length;

  const goPrev = () => setIndex(i => (typeof i === "number" ? (i - 1 + count) % count : 0));
  const goNext = () => setIndex(i => (typeof i === "number" ? (i + 1) % count : 0));
  const goTo   = (i) => setIndex(i);

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count]);

  const onDown = (e) => {
    e.preventDefault();
    const x = e.clientX ?? (e.touches?.[0]?.clientX || 0);
    setDrag({ active: true, startX: x, lastX: x });
    document.body.style.userSelect = "none";
  };
  const onMove = (e) => {
    if (!drag.active) return;
    const x = e.clientX ?? (e.touches?.[0]?.clientX || 0);
    setDrag((d) => ({ ...d, lastX: x }));
  };
  const onUp = () => {
    if (!drag.active) return;
    const dx = drag.lastX - drag.startX;
    if (dx >  SWIPE_THRESHOLD) goPrev();
    else if (dx < -SWIPE_THRESHOLD) goNext();
    setDrag({ active: false, startX: 0, lastX: 0 });
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    const w = wrapperRef.current;
    if (!w) return;
    w.addEventListener("pointerdown", onDown, { passive: false });
    w.addEventListener("pointermove", onMove,   { passive: false });
    w.addEventListener("pointerup",   onUp,     { passive: true  });
    w.addEventListener("pointerleave",onUp,     { passive: true  });

    w.addEventListener("touchstart", onDown, { passive: false });
    w.addEventListener("touchmove",  onMove, { passive: false });
    w.addEventListener("touchend",   onUp,   { passive: true  });
    w.addEventListener("touchcancel",onUp,   { passive: true  });

    return () => {
      w.removeEventListener("pointerdown", onDown);
      w.removeEventListener("pointermove", onMove);
      w.removeEventListener("pointerup",   onUp);
      w.removeEventListener("pointerleave",onUp);

      w.removeEventListener("touchstart", onDown);
      w.removeEventListener("touchmove",  onMove);
      w.removeEventListener("touchend",   onUp);
      w.removeEventListener("touchcancel",onUp);
    };
  }, [drag.active]);

  const cards = useMemo(() => {
    return tracks.map((t, i) => {
      const dist   = circularDistance(i, index, count);
      const offset = sideOffset(i, index, count); // -1 left, +1 right
      const scale  = 1 - Math.min(dist * SCALE_STEP, MAX_SHRINK);
      const gap    = Math.min(GAP_NEAR + dist * GAP_STEP, GAP_MAX);
      const x      = offset * gap;                // bigger spread
      const z      = 80 - dist * 10;
      const opacity= 1 - Math.min(dist * 0.16, 0.55);
      return { ...t, dist, offset, scale, x, z, opacity, i };
    });
  }, [tracks, index, count]);

  return (
    <div className={`featured ${className}`}>
      {/* NEW: frame that centers arrows + stage together */}
      <div className="featured__frame">
        <div className="featured__nav">
          <button className="featured__arrow" onClick={goPrev} aria-label="Forrige">‹</button>
          <button className="featured__arrow" onClick={goNext} aria-label="Næste">›</button>
        </div>

        <div ref={wrapperRef} className="featured__stage" aria-live="polite">
          {cards.map((c) => {
            const isCenter = c.i === index;
            return (
              <button
                key={c.id || c.i}
                className={`featured__card ${isCenter ? "isCenter" : ""}`}
                style={{
                  transform: `translateX(-50%) translateX(${c.x}%) scale(${c.scale})`,
                  zIndex: c.z,
                  opacity: c.opacity
                }}
                onClick={() => (isCenter ? onPlayIndex?.(c.i) : goTo(c.i))}
              >
                {/* NEW: white background card behind the cover */}
                <div className="featured__coverWrap">
                  <img
                    className="featured__cover"
                    src={c.cover?.src || ""}
                    alt=""
                    draggable={false}
                  />
                </div>

                <div className="featured__overlay" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="44" height="44">
                    <path fill="currentColor" d="M8 5v14l11-7z" />
                  </svg>
                </div>

                <div className="featured__meta">
                  <div className="featured__title">{c.title}</div>
                  <div className="featured__artist">{c.artist}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function circularDistance(a, b, n){
  const d = Math.abs(a - b);
  return Math.min(d, n - d);
}
function sideOffset(a, b, n){
  const diff = (a - b + n) % n;
  return diff === 0 ? 0 : diff <= Math.floor(n/2) ? 1 : -1;
}
