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
}) {
  return (
    <div className="audioPlayer">
      <div className="audioPlayer__Container">
        <div className="audioCoverData">
          {current.cover?.src ? (
            <img className="cover" src={current.cover.src} alt="" />
          ) : (
            <div className="cover" />
          )}
          <div className="trackInfo">
            <div className="title">{current.title}</div>
            <div className="artist">{current.artist}</div>
          </div>
        </div>

        <div className="audioControlProgress__container">
          <div className="audioControl__container">
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

          <ProgressBar percent={progressPct} onSeek={seekToRatio} />
          <div className="timeRow">
            <span>{fmt(progress)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        <div className="RightControls">
          <div className="playerActions">
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
            />
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
