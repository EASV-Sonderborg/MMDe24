import { useCallback, useRef } from "react";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import TrackActionsMenu from "./TrackActionsMenu.jsx";
import controlNext from "../assets/icons/next.svg";
import controlPrev from "../assets/icons/prev.svg";
import controlPlay from "../assets/icons/play.svg";
import controlPause from "../assets/icons/pause.svg";
import iconExpand from "../assets/icons/expand.svg";
import heartOutline from "../assets/icons/heart-outline.svg";
import heartFilled from "../assets/icons/heart-filled.svg";

export default function PlayerMini({
  current,
  isPlaying,
  togglePlay,
  volume,
  isMuted,
  volumeIcon,
  toggleMute,
  onVolumeChange,
  progressPct,
  seekToRatio,
  growVariant,
  trackActions = [],
  isLiked = false,
  onToggleLike,
  onTitleClick,
  onArtistClick,
}) {
  const menuOpenRef = useRef(null);
  const registerMenuOpenAt = useCallback((opener) => {
    menuOpenRef.current = opener;
  }, []);

  const openMenuAt = useCallback((event) => {
    event.preventDefault();
    menuOpenRef.current?.({ x: event.clientX, y: event.clientY });
  }, []);

  return (
    <div className="audioPlayer audioPlayer--mini">
      <div className="audioPlayer__Container">
        {/* venstre: play + volume (vertikal pÃ¥ hover) */}
        <div className="miniControls">
          <button
            className="button buttonPlay"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <img src={isPlaying ? controlPause : controlPlay} alt="" />
          </button>
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            icon={volumeIcon(volume, isMuted)}
            onToggleMute={toggleMute}
            onChange={onVolumeChange}
            vertical
          />
        </div>

        {/* midt: cover + tekst */}
        <div className="audioCoverData" onContextMenu={openMenuAt}>
          <div className="coverFrame">
            {current.cover?.src ? (
              <img className="cover" src={current.cover.src} alt="" />
            ) : (
              <div className="cover cover--placeholder" />
            )}
          </div>
          <div className="trackInfo">
            <button
              type="button"
              className="title playerLink"
              onClick={onTitleClick}
            >
              {current.title}
            </button>
            <button
              type="button"
              className="artist playerLink"
              onClick={onArtistClick}
            >
              {current.artist}
            </button>
          </div>
        </div>

        {/* spacer */}
        <div />

        {/* hÃ¸jre: like + expand */}
        <div className="windowButtons">
          <button
            className="button buttonLike"
            onClick={onToggleLike}
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <img src={isLiked ? heartFilled : heartOutline} alt="" />
          </button>
          <button
            className="button sizeBtn"
            onClick={growVariant}
            aria-label="GÃ¸r stÃ¸rre"
            title="GÃ¸r stÃ¸rre"
          >
            <img src={iconExpand} alt="" />
          </button>
          <TrackActionsMenu
            track={current}
            actions={trackActions}
            triggerClassName="playerActions__more playerActions__more--mini"
            size="sm"
            align="right"
            registerOpenAt={registerMenuOpenAt}
          />
        </div>

        {/* bund-progress som border */}
        <div className="audioControlProgress__container">
          <ProgressBar
            percent={progressPct}
            onSeek={seekToRatio}
            className="progress--miniBorder"
          />
        </div>
      </div>
    </div>
  );
}
