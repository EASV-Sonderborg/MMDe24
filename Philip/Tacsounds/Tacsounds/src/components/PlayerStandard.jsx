import { useCallback, useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import TrackActionsMenu from "./TrackActionsMenu.jsx";
import controlNext from "../assets/icons/next.svg";
import controlPrev from "../assets/icons/prev.svg";
import controlPlay from "../assets/icons/play.svg";
import controlPause from "../assets/icons/pause.svg";
import iconExpand from "../assets/icons/expand.svg";
import iconMinimize from "../assets/icons/minimize.svg";
import queueIcon from "../assets/icons/queue.svg";
import heartOutline from "../assets/icons/heart-outline.svg";
import heartFilled from "../assets/icons/heart-filled.svg";
import loopIcon from "../assets/icons/loop.svg";
import loopOne from "../assets/icons/loop-one.svg";
import shuffleIcon from "../assets/icons/shuffle.svg";

export default function PlayerStandard({
  current,
  isPlaying,
  togglePlay,
  prev,
  next,
  volume,
  isMuted,
  volumeIcon,
  toggleMute,
  onVolumeChange,
  progressPct,
  progress,
  duration,
  fmt,
  seekToRatio,
  growVariant,
  shrinkVariant,
  onOpenQueue = () => {},
  trackActions = [],
  isLiked = false,
  onToggleLike,
  onTitleClick,
  onArtistClick,
  variant = "standard",
  loopMode = "off",
  onCycleLoop = () => {},
  shuffleEnabled = false,
  onToggleShuffle = () => {},
  prevTrack = null,
  nextTrack = null,
}) {
  const menuOpenRef = useRef(null);
  const registerMenuOpenAt = useCallback((opener) => {
    menuOpenRef.current = opener;
  }, []);

  const openMenuAt = useCallback((event) => {
    event.preventDefault();
    menuOpenRef.current?.({ x: event.clientX, y: event.clientY });
  }, []);

  const variantClass = variant === "full" ? "audioPlayer--full" : "";

  const [swipeDir, setSwipeDir] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const swipeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (swipeTimerRef.current) clearTimeout(swipeTimerRef.current);
    };
  }, []);

  const onHeroPointerDown = useCallback(
    (event) => {
      if (variant !== "full") return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      const startX = event.clientX;
      const startY = event.clientY;
      let moved = false;
      let raf = null;
      setDragging(true);
      const onMove = (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) < Math.abs(dy)) return;
        moved = true;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          setDragX(dx);
        });
      };
      const onUp = (e) => {
        event.currentTarget.releasePointerCapture?.(event.pointerId);
        if (raf) cancelAnimationFrame(raf);
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const threshold = 32;
        if (moved && Math.abs(dx) >= threshold && Math.abs(dx) >= Math.abs(dy)) {
          const dir = dx < 0 ? "left" : "right";
          setSwipeDir(dir);
          if (swipeTimerRef.current) clearTimeout(swipeTimerRef.current);
          swipeTimerRef.current = setTimeout(() => {
            if (dir === "left") next?.();
            else prev?.();
            setSwipeDir(null);
            swipeTimerRef.current = null;
          }, 160);
        }
        setDragging(false);
        setDragX(0);
      };
      event.currentTarget.addEventListener("pointermove", onMove);
      event.currentTarget.addEventListener("pointerup", onUp, { once: true });
      event.currentTarget.addEventListener("pointercancel", onUp, { once: true });
    },
    [next, prev, variant],
  );

  return (
    <div className={`audioPlayer ${variantClass}`.trim()}>
      <div className="audioPlayer__Container">
        {variant === "full" ? (
          <div
            className={`audioCoverData audioCoverData--hero ${
              swipeDir ? `isSwipe-${swipeDir}` : ""
            } ${dragging ? "isDragging" : ""}`.trim()}
            onContextMenu={openMenuAt}
            onPointerDown={onHeroPointerDown}
            style={{ "--drag-x": `${dragX}px` }}
          >
            {prevTrack ? (
              <div className="audioHeroTrack audioHeroTrack--prev" aria-hidden>
                <div className="coverFrame">
                  {prevTrack.cover?.src ? (
                    <img className="cover" src={prevTrack.cover.src} alt="" />
                  ) : (
                    <div className="cover cover--placeholder" />
                  )}
                </div>
                <div className="audioHeroMeta">
                  <div className="audioHeroTitle">{prevTrack.title}</div>
                  <div className="audioHeroArtist">{prevTrack.artist}</div>
                </div>
              </div>
            ) : null}
            <div className="audioHeroTrack audioHeroTrack--current">
              <div className="coverFrame">
                {current.cover?.src ? (
                  <img className="cover" src={current.cover.src} alt="" />
                ) : (
                  <div className="cover cover--placeholder" />
                )}
              </div>
              <div className="trackInfo">
                <div className="trackInfo__titleRow">
                  <button
                    type="button"
                    className="title playerLink"
                    onClick={onTitleClick}
                  >
                    {current.title}
                  </button>
                  <button
                    type="button"
                    className="trackInfo__like"
                    onClick={onToggleLike}
                    aria-label={isLiked ? "Unlike" : "Like"}
                  >
                    <img src={isLiked ? heartFilled : heartOutline} alt="" />
                  </button>
                </div>
                <button
                  type="button"
                  className="artist playerLink"
                  onClick={onArtistClick}
                >
                  {current.artist}
                </button>
              </div>
            </div>
            {nextTrack ? (
              <div className="audioHeroTrack audioHeroTrack--next" aria-hidden>
                <div className="coverFrame">
                  {nextTrack.cover?.src ? (
                    <img className="cover" src={nextTrack.cover.src} alt="" />
                  ) : (
                    <div className="cover cover--placeholder" />
                  )}
                </div>
                <div className="audioHeroMeta">
                  <div className="audioHeroTitle">{nextTrack.title}</div>
                  <div className="audioHeroArtist">{nextTrack.artist}</div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="audioCoverData" onContextMenu={openMenuAt}>
            <div className="coverFrame">
              {current.cover?.src ? (
                <img className="cover" src={current.cover.src} alt="" />
              ) : (
                <div className="cover cover--placeholder" />
              )}
            </div>
            <div className="trackInfo">
              <div className="trackInfo__titleRow">
                <button
                  type="button"
                  className="title playerLink"
                  onClick={onTitleClick}
                >
                  {current.title}
                </button>
                <button
                  type="button"
                  className="trackInfo__like"
                  onClick={onToggleLike}
                  aria-label={isLiked ? "Unlike" : "Like"}
                >
                  <img src={isLiked ? heartFilled : heartOutline} alt="" />
                </button>
              </div>
              <button
                type="button"
                className="artist playerLink"
                onClick={onArtistClick}
              >
                {current.artist}
              </button>
            </div>
          </div>
        )}

        <div className="audioControlProgress__container">
          <div className="audioControl__container">
            {variant === "full" ? (
              <div className="audioControl__side audioControl__side--left">
                <button
                  className={`button buttonLoop ${
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
            ) : (
              <div className="audioControl__side audioControl__side--left">
                <button
                  className={`button buttonLoop ${
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
            )}

            <div className="audioControl__transport">
              <button
                className="button buttonSkip"
                onClick={prev}
                aria-label="Previous"
              >
                <img src={controlPrev} alt="Previous" />
              </button>
              <button
                className="button buttonPlay"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <img
                  src={isPlaying ? controlPause : controlPlay}
                  alt={isPlaying ? "Pause" : "Play"}
                />
              </button>
              <button
                className="button buttonSkip"
                onClick={next}
                aria-label="Next"
              >
                <img src={controlNext} alt="Next" />
              </button>
            </div>

            {variant === "full" ? (
              <div className="audioControl__side audioControl__side--right">
                <button
                  className={`button buttonShuffle ${
                    shuffleEnabled ? "isActive" : "isOff"
                  }`.trim()}
                  onClick={onToggleShuffle}
                  aria-label={shuffleEnabled ? "Shuffle on" : "Shuffle off"}
                  title={shuffleEnabled ? "Shuffle on" : "Shuffle off"}
                >
                  <img src={shuffleIcon} alt="" />
                </button>
              </div>
            ) : (
              <div className="audioControl__side audioControl__side--right">
                <button
                  className={`button buttonShuffle ${
                    shuffleEnabled ? "isActive" : "isOff"
                  }`.trim()}
                  onClick={onToggleShuffle}
                  aria-label={shuffleEnabled ? "Shuffle on" : "Shuffle off"}
                  title={shuffleEnabled ? "Shuffle on" : "Shuffle off"}
                >
                  <img src={shuffleIcon} alt="" />
                </button>
              </div>
            )}
          </div>

          {variant === "full" ? (
            <div className="audioControl__aux">
              <div className="audioControl__auxLeft">
                <VolumeControl
                  volume={volume}
                  isMuted={isMuted}
                  icon={volumeIcon(volume, isMuted)}
                  onToggleMute={toggleMute}
                  onChange={onVolumeChange}
                />
              </div>
              <div className="audioControl__auxRight">
                <button
                  className="button buttonQueue"
                  onClick={onOpenQueue}
                  aria-label="Open queue"
                >
                  <img src={queueIcon} alt="Queue" />
                </button>
                <TrackActionsMenu
                  track={current}
                  actions={trackActions}
                  triggerClassName="playerActions__more"
                  size="sm"
                  align="right"
                  registerOpenAt={registerMenuOpenAt}
                />
              </div>
            </div>
          ) : null}

          <div className="audioProgressRow">
            <ProgressBar percent={progressPct} onSeek={seekToRatio} />
          </div>
          <div className="timeRow">
            <span>{fmt(progress)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        <div className="RightControls">
          <div className="playerActions">
            {variant !== "full" ? (
              <button
                className="button buttonQueue"
                onClick={onOpenQueue}
                aria-label="Open queue"
              >
                <img src={queueIcon} alt="Queue" />
              </button>
            ) : null}
            <button
              className="button buttonLike"
              onClick={onToggleLike}
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <img src={isLiked ? heartFilled : heartOutline} alt="" />
            </button>
            {variant !== "full" ? (
              <TrackActionsMenu
                track={current}
                actions={trackActions}
                triggerClassName="playerActions__more"
                size="sm"
                align="right"
                registerOpenAt={registerMenuOpenAt}
              />
            ) : null}
            <div className="windowButtons">
              <button
                className="button sizeBtn"
                onClick={shrinkVariant}
                aria-label="Minimize"
              >
                <img src={iconMinimize} alt="Minimize" />
              </button>
              <button
                className="button sizeBtn"
                onClick={growVariant}
                aria-label="Expand"
              >
                <img src={iconExpand} alt="Expand" />
              </button>
            </div>
          </div>

          {variant !== "full" ? (
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              icon={volumeIcon(volume, isMuted)}
              onToggleMute={toggleMute}
              onChange={onVolumeChange}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}


