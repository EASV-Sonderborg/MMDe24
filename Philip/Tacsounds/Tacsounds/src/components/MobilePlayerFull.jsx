import React, { useEffect, useRef, useState } from "react";import ProgressBar from "./ProgressBar";
import TrackActionsMenu from "./TrackActionsMenu.jsx";
import controlNext from "../assets/icons/next.svg";
import controlPrev from "../assets/icons/prev.svg";
import controlPlay from "../assets/icons/play.svg";
import controlPause from "../assets/icons/pause.svg";
import queueIcon from "../assets/icons/queue.svg";

// Drag-aware swipe with live transform
function useDragSwipe(onLeft, onRight, threshold = 28) {
  const start = useRef({ x: 0, y: 0, active: false, fired: false });
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (event) => {
    const x = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
    const y = event.clientY ?? event.touches?.[0]?.clientY ?? 0;
    start.current = { x, y, active: true, fired: false };
    setDragging(true);
    setDragX(0);
  };
  const onPointerMove = (event) => {
    if (!start.current.active) return;
    const x = event.clientX ?? event.touches?.[0]?.clientX ?? start.current.x;
    const y = event.clientY ?? event.touches?.[0]?.clientY ?? start.current.y;
    const dx = x - start.current.x;
    const dy = y - start.current.y;
    if (Math.abs(dx) < Math.abs(dy)) return; // ignore vertical scroll
    setDragX(dx);
    if (!start.current.fired && Math.abs(dx) >= threshold) {
      start.current.fired = true;
      if (dx < 0) onLeft?.();
      else onRight?.();
    }
  };
  const onPointerUp = () => {
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

function useSwipe(onLeft, onRight, threshold = 28) {
  const start = useRef({ x: 0, y: 0 });
  const onPointerDown = (event) => {
    start.current = {
      x: event.clientX ?? event.touches?.[0]?.clientX,
      y: event.clientY ?? event.touches?.[0]?.clientY,
    };
  };
  const onPointerUp = (event) => {
    const x = event.clientX ?? event.changedTouches?.[0]?.clientX;
    const y = event.clientY ?? event.changedTouches?.[0]?.clientY;
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

export default function MobilePlayerFull({
  current,
  isPlaying,
  togglePlay,
  next,
  prev,
  progressPct,
  progress,
  duration,
  fmt,
  seekToRatio, shrinkVariant,
  onOpenQueue,
  prevTrack,
  nextTrack,
  trackActions = [],
}) {
  const [swipeDir, setSwipeDir] = useState(null);
  const drag = useDragSwipe(
    () => {
      setSwipeDir("left");
      next?.();
    },
    () => {
      setSwipeDir("right");
      prev?.();
    },
    28
  );

  useEffect(() => {
    if (!swipeDir) return;
    const timer = setTimeout(() => setSwipeDir(null), 260);
    return () => clearTimeout(timer);
  }, [swipeDir]);

  return (
    <>
      <div className="mPlayer__backdrop" onClick={shrinkVariant} />
      <div className="mPlayer mPlayer--full">
        <button className="mFull__chev" onClick={shrinkVariant} aria-label="Minimize">
          ⬇
        </button>

        <div
          className={`mFull__content ${drag.dragging ? "isDragging" : ""} ${swipeDir ? `isSwipe-${swipeDir}` : ""}`}
        >
          <div className="mFull__hero" style={{ "--drag-x": `${drag.dragX || 0}px` }} {...drag.handlers}>
            {prevTrack && (
              <div className="mFull__heroTrack mFull__heroTrack--prev" aria-hidden>
                {prevTrack.cover?.src ? (
                  <img className="mFull__cover" src={prevTrack.cover.src} alt="" />
                ) : (
                  <div className="mFull__cover" />
                )}
                <div className="mFull__title">{prevTrack.title}</div>
                <div className="mFull__artist">{prevTrack.artist}</div>
              </div>
            )}

            <div className="mFull__heroTrack mFull__heroTrack--current">
              {current.cover?.src ? (
                <img className="mFull__cover" src={current.cover.src} alt="" />
              ) : (
                <div className="mFull__cover" />
              )}
              <div className="mFull__title">{current.title}</div>
              <div className="mFull__artist">{current.artist}</div>
            </div>

            {nextTrack && (
              <div className="mFull__heroTrack mFull__heroTrack--next" aria-hidden>
                {nextTrack.cover?.src ? (
                  <img className="mFull__cover" src={nextTrack.cover.src} alt="" />
                ) : (
                  <div className="mFull__cover" />
                )}
                <div className="mFull__title">{nextTrack.title}</div>
                <div className="mFull__artist">{nextTrack.artist}</div>
              </div>
            )}
          </div>

          <div className="mFull__controls">
            <button
              type="button"
              className="mFull__queue"
              onClick={onOpenQueue}
              aria-label="Open queue"
            >
              <img src={queueIcon} alt="Queue" />
            </button>

            <div className="mFull__transport">
              <button className="mBtn mBtn--skip" onClick={() => { prev?.(); }} aria-label="Previous">
                <img src={controlPrev} alt="Previous" />
              </button>
              <button
                className="mBtn mBtn--play"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <img src={isPlaying ? controlPause : controlPlay} alt={isPlaying ? "Pause" : "Play"} />
              </button>
              <button className="mBtn mBtn--skip" onClick={() => { next?.(); }} aria-label="Next">
                <img src={controlNext} alt="Next" />
              </button>
            </div>

            <TrackActionsMenu
              track={current}
              actions={trackActions}
              triggerClassName="mFull__more"
              size="sm"
              align="center"
            />
          </div>

          <ProgressBar percent={progressPct} onSeek={seekToRatio} className="mFull__progress" />
          <div className="mFull__time">
            <span>{fmt(progress)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>
    </>
  );
}






