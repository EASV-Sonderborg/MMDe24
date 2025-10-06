import React, { useEffect, useRef, useState } from "react";
import TrackActionsMenu from "./TrackActionsMenu.jsx";
import controlNext from "../assets/icons/next.svg";
import controlPrev from "../assets/icons/prev.svg";
import controlPlay from "../assets/icons/play.svg";
import controlPause from "../assets/icons/pause.svg";
import queueIcon from "../assets/icons/queue.svg";

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
  shrinkVariant,
  onOpenQueue,
  trackActions = [],
}) {
  const [swipeDir, setSwipeDir] = useState(null);
  const swipe = useSwipe(
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
          v
        </button>

        <div
          className={`mFull__content ${swipeDir ? `isSwipe-${swipeDir}` : ""}`}
          {...swipe}
        >
          {current.cover?.src ? (
            <img className="mFull__cover" src={current.cover.src} alt="" />
          ) : (
            <div className="mFull__cover" />
          )}

          <div className="mFull__title">{current.title}</div>
          <div className="mFull__artist">{current.artist}</div>

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
              <button className="mBtn mBtn--skip" onClick={prev} aria-label="Previous">
                <img src={controlPrev} alt="Previous" />
              </button>
              <button
                className="mBtn mBtn--play"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <img src={isPlaying ? controlPause : controlPlay} alt={isPlaying ? "Pause" : "Play"} />
              </button>
              <button className="mBtn mBtn--skip" onClick={next} aria-label="Next">
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