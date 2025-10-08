import React, { useRef, useState } from "react";
import controlPlay from "../assets/icons/play.svg";
import controlPause from "../assets/icons/pause.svg";

/* Drag-aware swipe that moves the mini row with your finger */
function useDragSwipe(onLeft, onRight, threshold = 24) {
  const start = useRef({ x: 0, y: 0, active: false, fired: false });
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const onPointerDown = (e) => {
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    start.current = { x, y, active: true, fired: false };
    setDragging(true);
    setDragX(0);
  };
  const onPointerMove = (e) => {
    if (!start.current.active) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? start.current.x;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? start.current.y;
    const dx = x - start.current.x;
    const dy = y - start.current.y;
    if (Math.abs(dx) < Math.abs(dy)) return;
    setDragX(dx);
    if (!start.current.fired && Math.abs(dx) >= threshold) {
      start.current.fired = true;
      if (dx < 0) onLeft?.(); else onRight?.();
      // Snap immediately to new position
      start.current.active = false;
      setDragging(false);
      setDragX(0);
    }
  };
  const onPointerUp = (e) => {
    if (!start.current.active) return;
    start.current.active = false;
    setDragging(false);
    setDragX(0);
  };
  return {
    dragX,
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onTouchStart: onPointerDown,
      onTouchMove: onPointerMove,
      onTouchEnd: onPointerUp,
    },
  };
}

export default function MobilePlayerMini({ current,
  isPlaying,
  togglePlay,
  next,
  prev,
  progressPct,
  growVariant, seekToRatio }) {
  const drag = useDragSwipe(next, prev, 44);
  const topRef = useRef(null);
  const [topDragging, setTopDragging] = useState(false);
  const topRatioFromX = (clientX) => {
    const rect = topRef.current?.getBoundingClientRect();
    if (!rect || !rect.width) return 0;
    const r = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(1, r));
  };
  const onTopPointerDown = (e) => {
    if (!seekToRatio) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    if (x == null) return;
    e.preventDefault();
    topRef.current?.setPointerCapture?.(e.pointerId);
    setTopDragging(true);
    seekToRatio(topRatioFromX(x));
  };
  const onTopPointerMove = (e) => {
    if (!topDragging || !seekToRatio) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    if (x == null) return;
    seekToRatio(topRatioFromX(x));
  };
  const onTopPointerUp = (e) => {
    if (!topDragging || !seekToRatio) return;
    setTopDragging(false);
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX;
    if (x != null) seekToRatio(topRatioFromX(x));
  };

  return (
    <div className="mPlayer mPlayer--mini">
      {/* top progress som border */}
      <div ref={topRef} className={`mPlayer__top ${topDragging ? "isDragging" : ""}`} onPointerDown={onTopPointerDown} onPointerMove={onTopPointerMove} onPointerUp={onTopPointerUp} onTouchStart={onTopPointerDown} onTouchMove={onTopPointerMove} onTouchEnd={onTopPointerUp}>
        <div
          className="mPlayer__topFill"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="mMini__body">
        <button
          className={`mMini__info ${drag.dragging ? "isDragging" : ""}`}
          style={{ "--drag-x": `${drag.dragX || 0}px` }}
          {...drag.handlers}
          onClick={() => {
            if (drag.dragging || Math.abs(drag.dragX) > 2) return;
            growVariant();
          }}
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






