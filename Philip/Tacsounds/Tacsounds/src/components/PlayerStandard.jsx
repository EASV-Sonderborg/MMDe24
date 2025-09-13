import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import controlNext from "../assets/icons/next.svg";
import controlPrev from "../assets/icons/prev.svg";
import controlPlay from "../assets/icons/play.svg";
import controlPause from "../assets/icons/pause.svg";
import iconExpand from "../assets/icons/expand.svg";
import iconMinimize from "../assets/icons/minimize.svg";

export default function PlayerStandard({
  current, isPlaying, togglePlay, prev, next,
  volume, isMuted, volumeIcon, toggleMute, onVolumeChange,
  progressPct, progress, duration, fmt, seekToRatio,
  growVariant, shrinkVariant
}) {
  return (
    <div className="audioPlayer">
      <div className="audioPlayer__Container">
        <div className="audioCoverData">
          {current.cover?.src ? <img className="cover" src={current.cover.src} alt="" /> : <div className="cover" />}
          <div className="trackInfo">
            <div className="title">{current.title}</div>
            <div className="artist">{current.artist}</div>
          </div>
        </div>

        <div className="audioControlProgress__container">
          <div className="audioControl__container">
            <button className="button buttonSkip" onClick={prev}><img src={controlPrev} /></button>
            <button className="button buttonPlay" onClick={togglePlay}><img src={isPlaying ? controlPause : controlPlay} /></button>
            <button className="button buttonSkip" onClick={next}><img src={controlNext} /></button>
          </div>

          <ProgressBar percent={progressPct} onSeek={seekToRatio} />
          <div className="timeRow"><span>{fmt(progress)}</span><span>{fmt(duration)}</span></div>
        </div>

        <div className="RightControls">
          <div className="windowButtons">
            <button className="button sizeBtn" onClick={shrinkVariant} aria-label="Gør mindre"><img src={iconMinimize} /></button>
            <button className="button sizeBtn" onClick={growVariant} aria-label="Gør større"><img src={iconExpand} /></button>
          </div>
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            icon={volumeIcon(volume, isMuted)}
            onToggleMute={toggleMute}
            onChange={onVolumeChange}
          />
        </div>
      </div>
    </div>
  );
}
