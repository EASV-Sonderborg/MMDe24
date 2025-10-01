// src/components/AudioPlayerShell.jsx
import useAudioController, { VARIANTS } from "./useAudioController";

// Desktop players
import PlayerMini from "./PlayerMini";
import PlayerStandard from "./PlayerStandard";
import PlayerFull from "./PlayerFull";

// Mobile players (skal findes – ellers kommentér de to linjer + mobil-grenen)
import MobilePlayerFull from "./MobilePlayerFull";
import MobilePlayerMini from "./MobilePlayerMini";

// Ikoner til volumeindikator
import volumeMute from "../assets/icons/volumeMute.svg";
import volumeLow from "../assets/icons/volumeLow.svg";
import volumeMid from "../assets/icons/volumeMid.svg";
import volumeHigh from "../assets/icons/volumeHigh.svg";

// Lille helper – brugt til at afgøre mobil/desktop
function isMobile() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

// Optional props:
// - controller: del en allerede oprettet controller (ellers laves en internt)
// - forceVariant: 'mini' | 'standard' | 'full' (overstyr controllerens variant)
// - forceMobile: boolean (overstyr auto-detektion af mobil/desktop)
export default function AudioPlayerShell({
  controller,
  forceVariant,
  forceMobile,
}) {
  // Brug delt controller hvis givet, ellers opret lokalt
  const ctrl = controller ?? useAudioController();

  // Ikon ud fra volume
  const volumeIcon = (v, muted) => {
    if (muted || v === 0) return volumeMute;
    if (v <= 0.33) return volumeLow;
    if (v <= 0.66) return volumeMid;
    return volumeHigh;
  };

  // Fælles props til alle player-komponenter
  const shared = {
    // track + afspilning
    current: ctrl.current,
    isPlaying: ctrl.isPlaying,
    togglePlay: ctrl.togglePlay,
    prev: ctrl.prev,
    next: ctrl.next,

    // tid / seek
    progressPct: ctrl.progressPct,
    progress: ctrl.progress,
    duration: ctrl.duration,
    fmt: ctrl.fmt,
    seekToRatio: ctrl.seekToRatio,

    // volume
    volume: ctrl.volume,
    isMuted: ctrl.isMuted,
    toggleMute: ctrl.toggleMute,
    onVolumeChange: ctrl.onVolumeChange,
    volumeIcon,

    // varianter (bruges af knapper/keyboard)
    growVariant: ctrl.growVariant,
    shrinkVariant: ctrl.shrinkVariant,
  };

  // Hvilken variant skal vises?
  const variant = forceVariant ?? ctrl.variant;

  // Mobil/desktop?
  const mobile = typeof forceMobile === "boolean" ? forceMobile : isMobile();

  // Mobil: kun mini/full
  if (mobile) {
    if (variant === VARIANTS.full) return <MobilePlayerFull {...shared} />;
    // både 'mini' og 'standard' vises som mobil-mini
    return <MobilePlayerMini {...shared} />;
  }

  // Desktop
  if (variant === VARIANTS.mini) return <PlayerMini {...shared} />;
  if (variant === VARIANTS.full) return <PlayerFull {...shared} />;
  return <PlayerStandard {...shared} />;
}
