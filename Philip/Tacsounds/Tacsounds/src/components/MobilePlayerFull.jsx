import React, { useRef } from "react";
import controlNext from "../assets/icons/next.svg";
import controlPrev from "../assets/icons/prev.svg";
import controlPlay from "../assets/icons/play.svg";
import controlPause from "../assets/icons/pause.svg";

function useSwipe(onLeft, onRight, threshold = 28) {
  const start = useRef({ x: 0, y: 0 });
  const onPointerDown = (e) => {
    start.current = { x: e.clientX ?? e.touches?.[0]?.clientX, y: e.clientY ?? e.touches?.[0]?.clientY };
  };
  const onPointerUp = (e) => {
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX;
    const y = e.clientY ?? e.changedTouches?.[0]?.clientY;
    const dx = x - start.current.x;
    const dy = y - start.current.y;
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) onLeft?.(); else onRight?.();
  };
  return {
    onPointerDown,
    onPointerUp,
    onTouchStart: onPointerDown, onTouchEnd: onPointerUp,
  };
}

export default function MobilePlayerFull({
  current,
  isPlaying,
  togglePlay,
  next, prev,
  progressPct, progress, duration, fmt,
  shrinkVariant,
}) {
  const swipe = useSwipe(next, prev, 28);

  return (
    <>
      <div className="mPlayer__backdrop" onClick={shrinkVariant} />
      <div className="mPlayer mPlayer--full">
        {/* chevron */}
        <button className="mFull__chev" onClick={shrinkVariant} aria-label="Minimize">⌄</button>

        <div className="mFull__content" {...swipe}>
          {current.cover?.src ? (
            <img className="mFull__cover" src={current.cover.src} alt="" />
          ) : (
            <div className="mFull__cover" />
          )}

          <div className="mFull__title">{current.title}</div>
          <div className="mFull__artist">{current.artist}</div>

          <div className="mFull__transport">
            <button className="mBtn mBtn--skip" onClick={prev} aria-label="Prev"><img src={controlPrev} alt="" /></button>
            <button className="mBtn mBtn--play" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
              <img src={isPlaying ? controlPause : controlPlay} alt="" />
            </button>
            <button className="mBtn mBtn--skip" onClick={next} aria-label="Next"><img src={controlNext} alt="" /></button>
          </div>

          <div className="mFull__progress">
            <div className="mFull__progressFill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="mFull__time">
            <span>{fmt(progress)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
