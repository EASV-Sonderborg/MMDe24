import useAudioController, { VARIANTS } from "./useAudioController";
import PlayerMini from "./PlayerMini";
import PlayerStandard from "./PlayerStandard";
import PlayerFull from "./PlayerFull";

import volumeMute from "../assets/icons/volumeMute.svg";
import volumeLow from "../assets/icons/volumeLow.svg";
import volumeMid from "../assets/icons/volumeMid.svg";
import volumeHigh from "../assets/icons/volumeHigh.svg";

export default function AudioPlayerShell({ controller }) {
  const ctrl = controller ?? useAudioController(); // <- brug delt controller hvis givet

  const volumeIcon = (v, muted) => {
    if (muted || v === 0) return volumeMute;
    if (v <= 0.33) return volumeLow;
    if (v <= 0.66) return volumeMid;
    return volumeHigh;
  };
  

  const shared = {
    current: ctrl.current,
    isPlaying: ctrl.isPlaying,
    togglePlay: ctrl.togglePlay,
    prev: ctrl.prev, next: ctrl.next,
    volume: ctrl.volume, isMuted: ctrl.isMuted,
    volumeIcon, toggleMute: ctrl.toggleMute, onVolumeChange: ctrl.onVolumeChange,
    progressPct: ctrl.progressPct, progress: ctrl.progress, duration: ctrl.duration, fmt: ctrl.fmt,
    seekToRatio: ctrl.seekToRatio,
    growVariant: ctrl.growVariant, shrinkVariant: ctrl.shrinkVariant,
  };

  if (ctrl.variant === VARIANTS.mini) return <PlayerMini {...shared} />;
  if (ctrl.variant === VARIANTS.full) return <PlayerFull {...shared} />;
  return <PlayerStandard {...shared} />;
}
