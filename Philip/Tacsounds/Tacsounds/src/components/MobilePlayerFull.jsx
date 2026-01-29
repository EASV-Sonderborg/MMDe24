import React, { useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import TrackActionsMenu from "./TrackActionsMenu.jsx";
import controlNext from "../assets/icons/next.svg";
import controlPrev from "../assets/icons/prev.svg";
import controlPlay from "../assets/icons/play.svg";
import controlPause from "../assets/icons/pause.svg";
import queueIcon from "../assets/icons/queue.svg";
import chevronIcon from "../assets/icons/chevron.svg";
import heartOutline from "../assets/icons/heart-outline.svg";
import heartFilled from "../assets/icons/heart-filled.svg";
import loopIcon from "../assets/icons/loop.svg";
import loopOne from "../assets/icons/loop-one.svg";
import shuffleIcon from "../assets/icons/shuffle.svg";

// Drag-aware swipe with live transform
function useDragSwipe(onSwipe, threshold = 28, swipeDuration = 220) {
  const start = useRef({ x: 0, y: 0, active: false, fired: false });
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const rafRef = useRef(null);
  const lastDxRef = useRef(0);
  const lastDyRef = useRef(0);
  const settleTimerRef = useRef(null);

  const onPointerDown = (event) => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    const x = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
    const y = event.clientY ?? event.touches?.[0]?.clientY ?? 0;
    start.current = { x, y, active: true, fired: false };
    setDragging(true);
    setDragX(0);
    lastDxRef.current = 0;
    lastDyRef.current = 0;
  };
  const onPointerMove = (event) => {
    if (!start.current.active) return;
    const x = event.clientX ?? event.touches?.[0]?.clientX ?? start.current.x;
    const y = event.clientY ?? event.touches?.[0]?.clientY ?? start.current.y;
    const dx = x - start.current.x;
    const dy = y - start.current.y;
    if (Math.abs(dx) < Math.abs(dy)) return; // ignore vertical scroll
    lastDxRef.current = dx;
    lastDyRef.current = dy;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setDragX(lastDxRef.current);
    });
  };
  const onPointerUp = () => {
    if (!start.current.active) return;
    start.current.active = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const dx = lastDxRef.current;
    const dy = lastDyRef.current;
    if (Math.abs(dx) >= threshold && Math.abs(dx) >= Math.abs(dy)) {
      onSwipe?.(dx < 0 ? "left" : "right");
      settleTimerRef.current = setTimeout(() => {
        setDragX(0);
        settleTimerRef.current = null;
      }, swipeDuration);
      setDragging(false);
      return;
    }
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

function useVerticalSwipe(onUp, onDown, threshold = 60) {
  const start = useRef({ x: 0, y: 0, active: false, fired: false });
  const onPointerDown = (event) => {
    const x = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
    const y = event.clientY ?? event.touches?.[0]?.clientY ?? 0;
    start.current = { x, y, active: true, fired: false };
  };
  const onPointerMove = (event) => {
    if (!start.current.active || start.current.fired) return;
    const x = event.clientX ?? event.touches?.[0]?.clientX ?? start.current.x;
    const y = event.clientY ?? event.touches?.[0]?.clientY ?? start.current.y;
    const dx = x - start.current.x;
    const dy = y - start.current.y;
    if (Math.abs(dy) < Math.abs(dx)) return;
    if (dy <= -threshold) {
      start.current.fired = true;
      onUp?.();
    } else if (dy >= threshold) {
      start.current.fired = true;
      onDown?.();
    }
  };
  const onPointerUp = () => {
    start.current.active = false;
  };
  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onTouchStart: onPointerDown,
    onTouchMove: onPointerMove,
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
  isLiked = false,
  onToggleLike,
  onTitleClick,
  onArtistClick,
  loopMode = "off",
  onCycleLoop = () => {},
  shuffleEnabled = false,
  onToggleShuffle = () => {},
}) {
  const [swipeDir, setSwipeDir] = useState(null);
  const swipeTimerRef = useRef(null);
  const drag = useDragSwipe(
    (dir) => {
      setSwipeDir(dir);
      if (swipeTimerRef.current) clearTimeout(swipeTimerRef.current);
      swipeTimerRef.current = setTimeout(() => {
        if (dir === "left") next?.();
        else prev?.();
        setSwipeDir(null);
        swipeTimerRef.current = null;
      }, 220);
    },
    28,
    220,
  );
  const verticalSwipe = useVerticalSwipe(null, () => shrinkVariant?.(), 70);
  const backdropSwipe = useVerticalSwipe(null, () => shrinkVariant?.(), 70);

  useEffect(() => {
    return () => {
      if (swipeTimerRef.current) clearTimeout(swipeTimerRef.current);
    };
  }, []);

  return (
    <>
      <div
        className="mPlayer__backdrop"
        onClick={shrinkVariant}
        {...backdropSwipe}
      />
      <div className="mPlayer mPlayer--full">
        <button className="mFull__chev" onClick={shrinkVariant} aria-label="Minimize">
          <img src={chevronIcon} alt="" />
        </button>

        <div
          className="mFull__content"
          {...verticalSwipe}
        >
          <div
            className={`mFull__hero ${drag.dragging ? "isDragging" : ""} ${swipeDir ? `isSwipe-${swipeDir}` : ""}`}
            style={{ "--drag-x": `${drag.dragX || 0}px` }}
            {...drag.handlers}
          >
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
              <div className="mFull__titleRow">
                <button
                  type="button"
                  className="playerLink mFull__title"
                  onClick={(event) => {
                    event.stopPropagation();
                    onTitleClick?.();
                  }}
                >
                  {current.title}
                </button>
                <button
                  type="button"
                  className="mFull__likeInline"
                  onClick={onToggleLike}
                  aria-label={isLiked ? "Unlike" : "Like"}
                >
                  <img src={isLiked ? heartFilled : heartOutline} alt="" />
                </button>
              </div>
              <button
                type="button"
                className="playerLink mFull__artist"
                onClick={(event) => {
                  event.stopPropagation();
                  onArtistClick?.();
                }}
              >
                {current.artist}
              </button>
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

          <div className="mFull__controls mFull__controls--transport">
            <div className="mFull__side mFull__side--left">
              <button
                type="button"
                className={`mFull__loop ${
                  loopMode === "off" ? "isOff" : "isActive"
                } ${loopMode === "one" ? "isRepeat" : ""}`.trim()}
                onClick={onCycleLoop}
                aria-label={
                  loopMode === "off"
                    ? "Loop off"
                    : loopMode === "one"
                    ? "Repeat one"
                    : "Loop all"
                }
                title={
                  loopMode === "off"
                    ? "Loop off"
                    : loopMode === "one"
                    ? "Repeat one"
                    : "Loop all"
                }
              >
                <img src={loopMode === "one" ? loopOne : loopIcon} alt="" />
              </button>
            </div>

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

            <div className="mFull__side mFull__side--right">
              <button
                type="button"
                className={`mFull__shuffle ${
                  shuffleEnabled ? "isActive" : "isOff"
                }`.trim()}
                onClick={onToggleShuffle}
                aria-label={shuffleEnabled ? "Shuffle on" : "Shuffle off"}
                title={shuffleEnabled ? "Shuffle on" : "Shuffle off"}
              >
                <img src={shuffleIcon} alt="" />
              </button>
            </div>
          </div>

          <div className="mFull__controls mFull__controls--aux">
            <div className="mFull__side mFull__side--left">
              <button
                type="button"
                className="mFull__queue"
                onClick={onOpenQueue}
                aria-label="Open queue"
              >
                <img src={queueIcon} alt="Queue" />
              </button>
            </div>
            <div className="mFull__side mFull__side--right">
              <TrackActionsMenu
                track={current}
                actions={trackActions}
                triggerClassName="mFull__more"
                size="sm"
                align="center"
              />
            </div>
          </div>

          <div className="mFull__progressRow">
            <ProgressBar percent={progressPct} onSeek={seekToRatio} className="mFull__progress" />
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










