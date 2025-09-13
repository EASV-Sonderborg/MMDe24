import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import controlNext from "../assets/icons/next.svg";
import controlPrev from "../assets/icons/prev.svg";
import controlPlay from "../assets/icons/play.svg";
import controlPause from "../assets/icons/pause.svg";
import iconExpand from "../assets/icons/expand.svg";

export default function PlayerMini({
  current, isPlaying, togglePlay,
  volume, isMuted, volumeIcon, toggleMute, onVolumeChange,
  progressPct, seekToRatio,
  growVariant,
}) {
  return (
    <div className="audioPlayer audioPlayer--mini">
      <div className="audioPlayer__Container">
        {/* venstre: play + volume (vertikal på hover) */}
        <div className="miniControls">
          <button className="button buttonPlay" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
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
        <div className="audioCoverData">
          {current.cover?.src ? (
            <img className="cover" src={current.cover.src} alt="" />
          ) : <div className="cover" /> }
          <div className="trackInfo">
            <div className="title">{current.title}</div>
            <div className="artist">{current.artist}</div>
          </div>
        </div>

        {/* spacer */}
        <div />

        {/* højre: expand */}
        <div className="windowButtons">
          <button className="button sizeBtn" onClick={growVariant} aria-label="Gør større" title="Gør større">
            <img src={iconExpand} alt="" />
          </button>
        </div>

        {/* bund-progress som border */}
        <div className="audioControlProgress__container">
          <ProgressBar percent={progressPct} onSeek={seekToRatio} className="progress--miniBorder" />
        </div>
      </div>
    </div>
  );
}
