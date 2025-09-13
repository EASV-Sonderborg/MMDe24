import { useEffect, useMemo, useRef, useState } from "react";
import "./carousel.css";

/** spacing / scaling */
const GAP_NEAR = 36;
const GAP_STEP = 32;
const GAP_MAX  = 100;
const SCALE_STEP = 0.4;
const MAX_SHRINK = 0.6;
const SWIPE_THRESHOLD = 40;

export default function FeaturedCarousel({
  // tracks to show
  tracks = [],
  // carousel "view" index (does NOT control audio)
  viewIndex = 0,
  setViewIndex,
  // audio state (what is actually playing)
  playingIndex = -1,
  isPlaying = false,
  // called when user clicks play/pause overlay on the centered card
  onPlayToggleAtIndex, // (i) => void
  className = "",
}) {
  const count = tracks.length;
  const stageRef = useRef(null);
  const [dragPx, setDragPx] = useState(0);

  /** Move carousel left/right (view only) */
  const goPrev = () => setViewIndex(i => (typeof i === "number" ? (i - 1 + count) % count : 0));
  const goNext = () => setViewIndex(i => (typeof i === "number" ? (i + 1) % count : 0));
  const goTo   = (i) => setViewIndex(i);

  /** Keyboard left/right for carousel only */
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

  /** Drag to scroll (pointer + touch) */
  const dragRef = useRef({ active: false, startX: 0, lastX: 0 });
  const onDown = (e) => {
    const x = (e.clientX ?? e.touches?.[0]?.clientX) || 0;
    dragRef.current = { active: true, startX: x, lastX: x };
    setDragPx(0);
    document.body.style.userSelect = "none";
  };
  const onMove = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    const x = (e.clientX ?? e.touches?.[0]?.clientX) || 0;
    d.lastX = x;
    // visuel forskydning i px mens man trækker
    setDragPx(x - d.startX);
    // undgå sidescroll på touch
    if (e.cancelable) e.preventDefault();
  };
   const onUp = () => {
     const d = dragRef.current;
     if (!d.active) return;
     const dx = d.lastX - d.startX;
     if (dx >  SWIPE_THRESHOLD) goPrev();
     else if (dx < -SWIPE_THRESHOLD) goNext();
     dragRef.current.active = false;
+    setDragPx(0);               // nulstil det visuelle offset efter snap
     document.body.style.userSelect = "";
   };

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    el.addEventListener("pointerdown", onDown, { passive: false });
    el.addEventListener("pointermove", onMove, { passive: false });
    el.addEventListener("pointerup", onUp, { passive: true });
    el.addEventListener("pointerleave", onUp, { passive: true });

    el.addEventListener("touchstart", onDown, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onUp, { passive: true });
    el.addEventListener("touchcancel", onUp, { passive: true });

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onUp);

      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onUp);
      el.removeEventListener("touchcancel", onUp);
    };
  }, []);

  /** Calculate positions for cards */
  const cards = useMemo(() => {
    return tracks.map((t, i) => {
      const dist   = circularDistance(i, viewIndex, count);
      const offset = sideOffset(i, viewIndex, count);
      const scale  = 1 - Math.min(dist * SCALE_STEP, MAX_SHRINK);
      const gap    = Math.min(GAP_NEAR + dist * GAP_STEP, GAP_MAX);
      const x      = offset * gap;
      const z      = 80 - dist * 10;
      const opacity= 1 - Math.min(dist * 0.05, 0.55);
      return { ...t, dist, offset, scale, x, z, opacity, i };
    });
  }, [tracks, viewIndex, count]);

  return (
    <div className={`featured ${className}`}>
      <div className="featured__frame">
        <div className="featured__nav">
          <button className="featured__arrow" onClick={goPrev} aria-label="Forrige">‹</button>
          <button className="featured__arrow" onClick={goNext} aria-label="Næste">›</button>
        </div>

        <div ref={stageRef} className="featured__stage" aria-live="polite">
          {cards.map((c) => {
            const isCenter = c.i === viewIndex;
            const isThisPlaying = isCenter && isPlaying && playingIndex === viewIndex;

            const onCoverClick = (e) => {
              e.stopPropagation();
              if (Math.abs(dragPx) > 3) return;           // ingen utilsigtet klik efter drag
              if (isCenter) onPlayToggleAtIndex?.(c.i);
              else goTo(c.i);
            };

            return (
    <div
      key={c.id || c.i}
      className={`featured__card ${isCenter ? "isCenter" : ""}`}
      style={{
        transform: `translateX(-50%) translateX(${c.x}%) translateX(${dragPx}px) scale(${c.scale})`,
        zIndex: c.z,
        opacity: c.opacity,
      }}
      aria-label={`${c.title} – ${c.artist}`}
    >
      {/* KUN denne clickArea styrer play/pause eller goto */}
      <button type="button" className="featured__clickArea" onClick={onCoverClick}>
        <div className="featured__coverWrap">
          <img
            className="featured__cover"
            src={c.cover?.src || ""}
            alt=""
            draggable={false}
          />
          {/* Overlay flyttet IND i coverWrap, så :hover kun reagerer på coveret */}
          <div
            className={`featured__overlay ${isThisPlaying ? "isVisible" : ""}`}
            aria-hidden="true"
          >
            {isThisPlaying ? (
              <svg viewBox="0 0 24 24" width="64" height="64">
                <path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="100" height="100">
                <path fill="currentColor" d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
      </button>

      {/* Meta-links nederst – klik her påvirker IKKE afspilning eller carousel */}
      <div className="featured__meta">
        <a className="featured__title"  href={`/track/${c.id || c.i}`} onClick={(e)=>e.stopPropagation()}>{c.title}</a>
        <a className="featured__artist" href={`/artist/${encodeURIComponent(c.artist||"")}`} onClick={(e)=>e.stopPropagation()}>{c.artist}</a>
      </div>
    </div>
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
