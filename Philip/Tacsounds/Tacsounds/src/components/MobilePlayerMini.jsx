import React, { useRef } from "react";
import controlPlay from "../assets/icons/play.svg";
import controlPause from "../assets/icons/pause.svg";

/* Lille helper til vandret swipe */
function useSwipe(onLeft, onRight, threshold = 28) {
  const start = useRef({ x: 0, y: 0 });
  const onPointerDown = (e) => {
    start.current = {
      x: e.clientX ?? e.touches?.[0]?.clientX,
      y: e.clientY ?? e.touches?.[0]?.clientY,
    };
  };
  const onPointerUp = (e) => {
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX;
    const y = e.clientY ?? e.changedTouches?.[0]?.clientY;
    const dx = x - start.current.x;
    const dy = y - start.current.y;
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) onLeft?.();
    else onRight?.();
  };
  return {
    onPointerDown,
    onPointerUp,
    onTouchStart: onPointerDown,
    onTouchEnd: onPointerUp,
  };
}

export default function MobilePlayerMini({
  current,
  isPlaying,
  togglePlay,
  next,
  prev,
  progressPct,
  growVariant,
}) {
  const swipe = useSwipe(next, prev, 24);

  return (
    <div className="mPlayer mPlayer--mini" {...swipe}>
      {/* top progress som border */}
      <div className="mPlayer__top">
        <div
          className="mPlayer__topFill"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="mMini__body">
        <button
          className="mMini__info"
          onClick={growVariant}
          aria-label="Open player"
        >
          {current.cover?.src ? (
            <img className="mMini__cover" src={current.cover.src} alt="" />
          ) : (
            <div className="mMini__cover" />
          )}
          <div className="mMini__text">
            <div className="mMini__title">{current.title}</div>
            <div className="mMini__artist">{current.artist}</div>
          </div>
        </button>

        <button
          className="mMini__play"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <img src={isPlaying ? controlPause : controlPlay} alt="" />
        </button>
      </div>
    </div>
  );
}
