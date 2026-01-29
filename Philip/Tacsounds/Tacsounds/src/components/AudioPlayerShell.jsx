import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import PlayerMini from "./PlayerMini.jsx";
import PlayerStandard from "./PlayerStandard.jsx";
import PlayerFull from "./PlayerFull.jsx";
import MobilePlayerMini from "./MobilePlayerMini.jsx";
import MobilePlayerFull from "./MobilePlayerFull.jsx";
import QueueModal from "./QueueModal2.jsx";
import TrackDetailsModal from "./TrackDetailsModal.jsx";

import "./audioplayer.css";
import "./mobile-player.css";
import heartOutline from "../assets/icons/heart-outline.svg";
import heartFilled from "../assets/icons/heart-filled.svg";

const PLAYLIST_STORAGE_KEY = "tacsounds.playlists";
const LIKED_PLAYLIST_ID = "liked-songs";
const LIKED_PLAYLIST_NAME = "Liked Songs";

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

export default function AudioPlayerShell({ controller, onNavigateToLibrary }) {
  if (!controller) {
    console.error("[AudioPlayerShell] Mangler 'controller' prop.");
    return null;
  }

  const isMobile = useIsMobile(768);

  const [desktopVariant, setDesktopVariant] = useState("standard");
  const [mobileVariant, setMobileVariant] = useState("mini");
  const [isQueueOpen, setQueueOpen] = useState(false);
  const [detailsTrack, setDetailsTrack] = useState(null);
  const [playlists, setPlaylists] = useState(() =>
    ensureLikedPlaylist(readStoredPlaylists(PLAYLIST_STORAGE_KEY)),
  );
  const lastSavedRef = useRef("");
  const [playlistModalTrack, setPlaylistModalTrack] = useState(null);
  const [playlistModalDraft, setPlaylistModalDraft] = useState("");
  

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
    queueTracks,
    index,
    loopMode,
    cycleLoopMode,
    shuffleEnabled,
    toggleShuffle,
  } = controller ?? {};

  if (!current) return null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const safe = ensureLikedPlaylist(playlists);
      const serialized = JSON.stringify(safe);
      if (serialized === lastSavedRef.current) return;
      localStorage.setItem(PLAYLIST_STORAGE_KEY, serialized);
      lastSavedRef.current = serialized;
      window.dispatchEvent(new Event("playlists-updated"));
    } catch {}
  }, [playlists]);

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    const onUpdate = () => {
      const stored = readStoredPlaylists(PLAYLIST_STORAGE_KEY);
      const safe = ensureLikedPlaylist(stored);
      const serialized = JSON.stringify(safe);
      if (serialized === lastSavedRef.current) return;
      lastSavedRef.current = serialized;
      setPlaylists(safe);
    };
    window.addEventListener("playlists-updated", onUpdate);
    return () => window.removeEventListener("playlists-updated", onUpdate);
  }, []);

  // Media Session API: lock screen metadata + controls (safe: uses defined `current`)
  useEffect(() => {
    const ms = navigator?.mediaSession;
    if (!ms || !current) return;
    try {
      const artwork = current.cover?.src
        ? [
            { src: current.cover.src, sizes: '96x96', type: 'image/png' },
            { src: current.cover.src, sizes: '192x192', type: 'image/png' },
            { src: current.cover.src, sizes: '512x512', type: 'image/png' },
          ]
        : [];
      ms.metadata = new window.MediaMetadata({
        title: current.title || '',
        artist: current.artist || '',
        album: current.album || '',
        artwork,
      });
      ms.setActionHandler?.('play', () => controller?.togglePlay?.());
      ms.setActionHandler?.('pause', () => controller?.togglePlay?.());
      ms.setActionHandler?.('previoustrack', () => controller?.prev?.());
      ms.setActionHandler?.('nexttrack', () => controller?.next?.());
      ms.setActionHandler?.('seekbackward', null);
      ms.setActionHandler?.('seekforward', null);
      ms.setActionHandler?.('seekto', (details) => {
        if (details?.seekTime != null && controller?.audioRef?.current) {
          const el = controller.audioRef.current;
          el.currentTime = Math.max(0, Math.min(details.seekTime, el.duration || 0));
        }
      });
      const el = controller?.audioRef?.current;
      const updatePos = () => {
        try {
          ms.setPositionState?.({ duration: el?.duration || 0, playbackRate: 1, position: el?.currentTime || 0 });
        } catch {}
      };
      el?.addEventListener?.('timeupdate', updatePos);
      updatePos();
      return () => el?.removeEventListener?.('timeupdate', updatePos);
    } catch {}
  }, [controller, current]);

  const trackActions = useMemo(() => {
    if (!current) return [];
    return [
      {
        label: "View info",
        onSelect: () => {
          if (isMobile) setMobileVariant("mini");
          setQueueOpen(false);
          setDetailsTrack(current);
        },
      },
      playById && {
        label: isPlaying ? "Pause" : "Play",
        onSelect: () => playById(current.id),
      },
      playNext && {
        label: "Play next",
        onSelect: () => playNext(current.id),
      },
      {
        id: "like",
        label: (
          <span className="trackMenu__itemLabel">
            Like
            <img
              src={isLiked(playlists, current.id) ? heartFilled : heartOutline}
              alt=""
            />
          </span>
        ),
        onSelect: () => toggleLikeTrack(setPlaylists, current.id),
      },
      {
        label: "Add to playlist",
        onSelect: () => setPlaylistModalTrack(current),
      },
      addToQueue && {
        label: "Add to queue",
        onSelect: () => addToQueue(current.id),
      },
    ].filter(Boolean);
  }, [
    current,
    isPlaying,
    playById,
    playNext,
    addToQueue,
    isMobile,
    playlists,
    heartFilled,
    heartOutline,
  ]);

  const isCurrentLiked = useMemo(
    () => isLiked(playlists, current?.id),
    [playlists, current?.id],
  );

  const toggleCurrentLike = useCallback(
    () => toggleLikeTrack(setPlaylists, current?.id),
    [current?.id],
  );

  const handleTitleClick = useCallback(() => {
    if (!current?.id) return;
    onNavigateToLibrary?.({ focusTrackId: current.id, query: "" });
  }, [current?.id, onNavigateToLibrary]);

  const handleArtistClick = useCallback(() => {
    if (!current?.artist) return;
    onNavigateToLibrary?.({ query: current.artist, focusTrackId: null });
  }, [current?.artist, onNavigateToLibrary]);

  const playlistItems = useMemo(() => {
    const trackMap = new Map(
      (controller?.catalog || controller?.tracks || []).map((track) => [
        track.id,
        track,
      ]),
    );
    return ensureLikedPlaylist(playlists).map((playlist) => {
      const tracksIn = (playlist.trackIds || [])
        .map((id) => trackMap.get(id))
        .filter(Boolean);
      return {
        ...playlist,
        tracks: tracksIn,
        trackCount: tracksIn.length,
      };
    });
  }, [controller, playlists]);

  const handleCreatePlaylist = (name) => {
    const trimmed = String(name || "").trim();
    if (!trimmed) return null;
    const id = `pl-${slugify(trimmed)}-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const newPlaylist = { id, name: trimmed, trackIds: [], createdAt };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    return newPlaylist;
  };

  const addTrackToPlaylist = (playlistId, trackId) => {
    if (!trackId) return;
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;
        const nextIds = Array.from(
          new Set([...(playlist.trackIds || []), trackId]),
        );
        return { ...playlist, trackIds: nextIds };
      }),
    );
  };

  const prevTrack = useMemo(
    () => (queueTracks && typeof index === "number" && index > 0 ? queueTracks[index - 1] : null),
    [queueTracks, index],
  );
  const nextTrackMeta = useMemo(
    () =>
      queueTracks && typeof index === "number" && index < (queueTracks?.length || 0) - 1
        ? queueTracks[index + 1]
        : null,
    [queueTracks, index],
  );

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
          seekToRatio={seekToRatio}
          growVariant={() => setMobileVariant("full")}
          prevTrack={prevTrack}
          nextTrack={nextTrackMeta}
          onTitleClick={handleTitleClick}
          onArtistClick={handleArtistClick}
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
          seekToRatio={seekToRatio}
          shrinkVariant={() => setMobileVariant("mini")}
          onOpenQueue={() => {
            if (isMobile) setMobileVariant("mini");
            setDetailsTrack(null);
            setQueueOpen(true);
          }}
          prevTrack={prevTrack}
          nextTrack={nextTrackMeta}
          trackActions={trackActions}
          isLiked={isCurrentLiked}
          onToggleLike={toggleCurrentLike}
          onTitleClick={handleTitleClick}
          onArtistClick={handleArtistClick}
          loopMode={loopMode}
          onCycleLoop={cycleLoopMode}
          shuffleEnabled={shuffleEnabled}
          onToggleShuffle={toggleShuffle}
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
          isLiked={isCurrentLiked}
          onToggleLike={toggleCurrentLike}
          onTitleClick={handleTitleClick}
          onArtistClick={handleArtistClick}
          loopMode={loopMode}
          onCycleLoop={cycleLoopMode}
          shuffleEnabled={shuffleEnabled}
          onToggleShuffle={toggleShuffle}
          prevTrack={prevTrack}
          nextTrack={nextTrackMeta}
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
          trackActions={trackActions}
          isLiked={isCurrentLiked}
          onToggleLike={toggleCurrentLike}
          onTitleClick={handleTitleClick}
          onArtistClick={handleArtistClick}
          loopMode={loopMode}
          onCycleLoop={cycleLoopMode}
          shuffleEnabled={shuffleEnabled}
          onToggleShuffle={toggleShuffle}
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
          isLiked={isCurrentLiked}
          onToggleLike={toggleCurrentLike}
        onTitleClick={handleTitleClick}
        onArtistClick={handleArtistClick}
        loopMode={loopMode}
        onCycleLoop={cycleLoopMode}
        shuffleEnabled={shuffleEnabled}
        onToggleShuffle={toggleShuffle}
        prevTrack={prevTrack}
        nextTrack={nextTrackMeta}
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
    loopMode,
    cycleLoopMode,
    shuffleEnabled,
    toggleShuffle,
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
    isCurrentLiked,
    toggleCurrentLike,
  ]);

  const detailsDurationLabel = useMemo(() => {
    if (!detailsTrack) return undefined;
    if (detailsTrack.length) return detailsTrack.length;
    if (detailsTrack.duration != null && fmt) return fmt(detailsTrack.duration);
    return undefined;
  }, [detailsTrack, fmt]);

  return (
    <>
      {!isMobile && desktopVariant === "full" ? (
        <div
          className="audioPlayer__overlayBackdrop audioPlayer__overlayBackdrop--desktop"
          onClick={() => setDesktopVariant("standard")}
        />
      ) : null}
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
      {playlistModalTrack ? (
        <div className="modalBackdrop" role="dialog" aria-modal="true">
          <div className="modalCard playlistModal">
            <button
              type="button"
              className="modalClose"
              onClick={() => {
                setPlaylistModalTrack(null);
                setPlaylistModalDraft("");
              }}
              aria-label="Close"
            >
              x
            </button>
            <div className="playlistModal__header">
              <h2>Add to playlist</h2>
              <p>{playlistModalTrack.title}</p>
            </div>
            <div className="playlistModal__body">
              <div className="playlistModal__create">
                <input
                  type="text"
                  placeholder="New playlist name"
                  value={playlistModalDraft}
                  onChange={(event) =>
                    setPlaylistModalDraft(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      const created = handleCreatePlaylist(
                        playlistModalDraft,
                      );
                      if (created) {
                        addTrackToPlaylist(
                          created.id,
                          playlistModalTrack.id,
                        );
                        setPlaylistModalTrack(null);
                        setPlaylistModalDraft("");
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="chip isActive"
                  onClick={() => {
                    const created = handleCreatePlaylist(playlistModalDraft);
                    if (created) {
                      addTrackToPlaylist(created.id, playlistModalTrack.id);
                      setPlaylistModalTrack(null);
                      setPlaylistModalDraft("");
                    }
                  }}
                >
                  Create & Add
                </button>
              </div>
              <div className="playlistModal__list">
                {playlistItems.length ? (
                  playlistItems.map((playlist) => (
                    <button
                      key={playlist.id}
                      type="button"
                      className="playlistPick"
                      onClick={() => {
                        addTrackToPlaylist(playlist.id, playlistModalTrack.id);
                        setPlaylistModalTrack(null);
                        setPlaylistModalDraft("");
                      }}
                    >
                      <span>{playlist.name}</span>
                      <span className="playlistPick__meta">
                        {playlist.trackCount} tracks
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="playlistEmpty">No playlists yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function readStoredPlaylists(key) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        id: item.id,
        name: item.name,
        trackIds: Array.isArray(item.trackIds)
          ? item.trackIds.map((id) => String(id))
          : [],
        createdAt: item.createdAt || new Date().toISOString(),
      }))
      .filter((item) => item.id && item.name);
  } catch {
    return [];
  }
}

function ensureLikedPlaylist(playlists) {
  const list = Array.isArray(playlists)
    ? playlists.map((playlist) => ({
        ...playlist,
        trackIds: Array.isArray(playlist.trackIds)
          ? playlist.trackIds.map((id) => String(id))
          : [],
      }))
    : [];
  const idx = list.findIndex((playlist) => playlist.id === LIKED_PLAYLIST_ID);
  if (idx >= 0) {
    const liked = list[idx];
    list[idx] = {
      ...liked,
      name: LIKED_PLAYLIST_NAME,
      createdAt: liked.createdAt || new Date().toISOString(),
    };
    return list;
  }
  return [
    {
      id: LIKED_PLAYLIST_ID,
      name: LIKED_PLAYLIST_NAME,
      trackIds: [],
      createdAt: new Date().toISOString(),
    },
    ...list,
  ];
}

function isLiked(playlists, trackId) {
  const safeId = String(trackId || "");
  if (!safeId) return false;
  const liked = playlists.find((playlist) => playlist.id === LIKED_PLAYLIST_ID);
  return !!liked?.trackIds?.includes(safeId);
}

function toggleLikeTrack(setPlaylists, trackId) {
  const safeId = String(trackId || "");
  if (!safeId) return;
  setPlaylists((prev) =>
    ensureLikedPlaylist(prev).map((playlist) => {
      if (playlist.id !== LIKED_PLAYLIST_ID) return playlist;
      const trackIds = (playlist.trackIds || []).map((id) => String(id));
      const hasTrack = trackIds.includes(safeId);
      const nextIds = hasTrack
        ? trackIds.filter((id) => id !== safeId)
        : [...trackIds, safeId];
      return { ...playlist, trackIds: nextIds };
    }),
  );
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}





