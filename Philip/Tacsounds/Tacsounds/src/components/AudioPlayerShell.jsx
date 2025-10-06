import React, { useEffect, useMemo, useState } from "react";

import PlayerMini from "./PlayerMini.jsx";
import PlayerStandard from "./PlayerStandard.jsx";
import PlayerFull from "./PlayerFull.jsx";
import MobilePlayerMini from "./MobilePlayerMini.jsx";
import MobilePlayerFull from "./MobilePlayerFull.jsx";
import QueueModal from "./QueueModal.jsx";
import TrackDetailsModal from "./TrackDetailsModal.jsx";

import "./audioplayer.css";
import "./mobile-player.css";

function useIsMobile(breakpoint = 768) {
  const mql = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.matchMedia(`(max-width:${breakpoint}px)`);
  }, [breakpoint]);

  const [isMobile, setIsMobile] = useState(() => (mql ? mql.matches : false));

  useEffect(() => {
    if (!mql) return;
    const handler = (event) => setIsMobile(event.matches);
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener?.(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener?.(handler);
    };
  }, [mql]);

  return isMobile;
}

const normalizeGenres = (track) => {
  if (!track) return [];
  if (Array.isArray(track.genres)) {
    return track.genres.filter(Boolean).map((genre) => String(genre).trim());
  }
  if (Array.isArray(track.genre)) {
    return track.genre.filter(Boolean).map((genre) => String(genre).trim());
  }
  if (typeof track.genres === "string") {
    return track.genres
      .split(/[,|]/)
      .map((genre) => genre.trim())
      .filter(Boolean);
  }
  if (typeof track.genre === "string") {
    return track.genre
      .split(/[,|]/)
      .map((genre) => genre.trim())
      .filter(Boolean);
  }
  return [];
};

const fmtDate = (iso) => {
  if (!iso) return "--";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function AudioPlayerShell({ controller }) {
  if (!controller) {
    console.error("[AudioPlayerShell] Mangler 'controller' prop.");
    return null;
  }

  const isMobile = useIsMobile(768);

  const [desktopVariant, setDesktopVariant] = useState("standard");
  const [mobileVariant, setMobileVariant] = useState("mini");
  const [isQueueOpen, setQueueOpen] = useState(false);
  const [detailsTrack, setDetailsTrack] = useState(null);

  const {
    current,
    isPlaying,
    togglePlay,
    next,
    prev,
    progressPct,
    progress,
    duration,
    fmt,
    seekToRatio,
    volume,
    isMuted,
    toggleMute,
    onVolumeChange,
    volumeIcon,
    playById,
    addToQueue,
    playNext,
  } = controller ?? {};

  if (!current) return null;

  const trackActions = useMemo(() => {
    if (!current) return [];
    return [
      {
        label: "View info",
        onSelect: () => setDetailsTrack(current),
      },
      playById && {
        label: isPlaying ? "Pause" : "Play",
        onSelect: () => playById(current.id),
      },
      playNext && {
        label: "Play next",
        onSelect: () => playNext(current.id),
      },
      addToQueue && {
        label: "Add to queue",
        onSelect: () => addToQueue(current.id),
      },
    ].filter(Boolean);
  }, [current, isPlaying, playById, playNext, addToQueue]);

  const playerNode = useMemo(() => {
    if (isMobile) {
      if (mobileVariant === "mini") {
        return (
          <MobilePlayerMini
            current={current}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            next={next}
            prev={prev}
            progressPct={progressPct}
            growVariant={() => setMobileVariant("full")}
          />
        );
      }

      return (
        <MobilePlayerFull
          current={current}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          next={next}
          prev={prev}
          progressPct={progressPct}
          progress={progress}
          duration={duration}
          fmt={fmt}
          shrinkVariant={() => setMobileVariant("mini")}
          onOpenQueue={() => setQueueOpen(true)}
          trackActions={trackActions}
        />
      );
    }

    if (desktopVariant === "full") {
      return (
        <PlayerFull
          current={current}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          next={next}
          prev={prev}
          progressPct={progressPct}
          progress={progress}
          duration={duration}
          fmt={fmt}
          seekToRatio={seekToRatio}
          shrinkVariant={() => setDesktopVariant("standard")}
          growVariant={() => setDesktopVariant("full")}
          volume={volume}
          isMuted={isMuted}
          toggleMute={toggleMute}
          onVolumeChange={onVolumeChange}
          volumeIcon={volumeIcon}
          onOpenQueue={() => setQueueOpen(true)}
          trackActions={trackActions}
        />
      );
    }

    if (desktopVariant === "mini") {
      return (
        <PlayerMini
          current={current}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          progressPct={progressPct}
          seekToRatio={seekToRatio}
          growVariant={() => setDesktopVariant("standard")}
          volume={volume}
          isMuted={isMuted}
          volumeIcon={volumeIcon}
          toggleMute={toggleMute}
          onVolumeChange={onVolumeChange}
        />
      );
    }

    return (
      <PlayerStandard
        current={current}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        next={next}
        prev={prev}
        progressPct={progressPct}
        progress={progress}
        duration={duration}
        fmt={fmt}
        seekToRatio={seekToRatio}
        shrinkVariant={() => setDesktopVariant("mini")}
        growVariant={() => setDesktopVariant("full")}
        volume={volume}
        isMuted={isMuted}
        toggleMute={toggleMute}
        onVolumeChange={onVolumeChange}
        volumeIcon={volumeIcon}
        onOpenQueue={() => setQueueOpen(true)}
        trackActions={trackActions}
      />
    );
  }, [
    addToQueue,
    current,
    desktopVariant,
    duration,
    fmt,
    isMobile,
    isMuted,
    isPlaying,
    mobileVariant,
    next,
    onVolumeChange,
    prev,
    progress,
    progressPct,
    seekToRatio,
    toggleMute,
    togglePlay,
    trackActions,
    volume,
    volumeIcon,
  ]);

  const detailsDurationLabel = useMemo(() => {
    if (!detailsTrack) return undefined;
    if (detailsTrack.length) return detailsTrack.length;
    if (detailsTrack.duration != null && fmt) return fmt(detailsTrack.duration);
    return undefined;
  }, [detailsTrack, fmt]);

  return (
    <>
      {playerNode}
      <QueueModal
        isOpen={isQueueOpen}
        onClose={() => setQueueOpen(false)}
        controller={controller}
      />
      <TrackDetailsModal
        track={detailsTrack}
        onClose={() => setDetailsTrack(null)}
        durationLabel={detailsDurationLabel}
        normalizeGenres={normalizeGenres}
        fmtDate={fmtDate}
      />
    </>
  );
}
