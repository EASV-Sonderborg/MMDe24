import React, { useRef } from "react";
import expand from "../assets/icons/expand.svg";
import controlPlay from "../assets/icons/play.svg";
import controlPause from "../assets/icons/pause.svg";

/* Lille helper til vandret swipe */
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

export default function MobilePlayerMini({
  current,
  isPlaying,
  togglePlay,
  next, prev,
  progressPct,
  growVariant,
  volume, isMuted, toggleMute, onVolumeChange, volumeIcon,
}) {
  const swipe = useSwipe(next, prev, 24);

  return (
    <div className="mPlayer mPlayer--mini" {...swipe}>
      {/* top progress som border */}
      <div className="mPlayer__top">
        <div className="mPlayer__topFill" style={{ width: `${progressPct}%` }} />
      </div>

      <button className="mMini__play" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
        <img src={isPlaying ? controlPause : controlPlay} alt="" />
      </button>

      <button className="mMini__info" onClick={growVariant} aria-label="Åbn player">
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

      <div className="mMini__right">
        <button className="mMini__expand" onClick={growVariant} aria-label="Expand">
          <img src={expand} alt="" />
        </button>

        <div className="mMini__vol">
          <button className="mMini__mute" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
            <img src={volumeIcon(volume, isMuted)} alt="" />
          </button>
          {/* Vertikal slider som popper op over ikonet */}
          <input
            className="mMini__range"
            type="range" min="0" max="1" step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
