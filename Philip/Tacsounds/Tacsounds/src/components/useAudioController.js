import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import tracksData from "../data/tracks.json";
import volumeMute from "../assets/icons/volumeMute.svg";
import volumeLow from "../assets/icons/volumeLow.svg";
import volumeMid from "../assets/icons/volumeMid.svg";
import volumeHigh from "../assets/icons/volumeHigh.svg";

export const VARIANTS = { mini: "mini", standard: "standard", full: "full" };

function trueish(val) {
  if (val === undefined || val === null) return false;
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val > 0;
  const s = String(val).trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes" || s === "y";
}

const fmt = (secs = 0) => {
  if (!Number.isFinite(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const norm = (t, i) => {
  const rawGenres = t.genres ?? t.genre ?? [];
  const genres = Array.isArray(rawGenres)
    ? rawGenres.filter(Boolean).map((g) => String(g).trim()).filter(Boolean)
    : String(rawGenres)
        .split(/[,|]/)
        .map((g) => g.trim())
        .filter(Boolean);
  return {
    id: t.id || `trk-${i}`,
    title: t.title || "Unknown Title",
    artist: t.artist || "Unknown Artist",
    album: t.album || "",
    genres,
    releaseDate: t.releaseDate ?? null,
    featured: trueish(t?.featured ?? t?.meta?.featured),
    duration: t.duration ?? null,
    bpm: t.bpm ?? null,
    scale: t.scale ?? { key: null, mode: null },
    audio: t.audio ?? { src: "", format: null },
    cover: t.cover ?? { src: "", format: null },
  };
};

export default function useAudioController() {
  const baseTracks = useMemo(() => (tracksData || []).map(norm), []);

  const trackMap = useMemo(() => {
    const map = new Map();
    baseTracks.forEach((track) => {
      map.set(track.id, track);
    });
    return map;
  }, [baseTracks]);

  const [queue, setQueue] = useState(() => baseTracks.map((track) => track.id));
  const [queueIndex, setQueueIndex] = useState(0);

  const setQueueSafe = useCallback(
    (updater) => {
      setQueue((prevQueue) => {
        const result =
          typeof updater === "function" ? updater(prevQueue) : updater;
        const raw = Array.isArray(result) ? result : (result?.queue ?? result);
        const deduped = (raw || []).filter(
          (id, idx, arr) => trackMap.has(id) && arr.indexOf(id) === idx,
        );
        const fallback = baseTracks.map((track) => track.id);
        const finalQueue = deduped.length ? deduped : fallback;
        const desiredIndex =
          typeof result?.index === "number" ? result.index : undefined;

        if (desiredIndex !== undefined) {
          setQueueIndex(() =>
            Math.min(Math.max(desiredIndex, 0), finalQueue.length - 1),
          );
        } else {
          setQueueIndex((idx) => Math.min(idx, finalQueue.length - 1));
        }

        return finalQueue;
      });
    },
    [baseTracks, trackMap],
  );

  useEffect(() => {
    setQueueSafe((prevQueue) => {
      const baseIds = baseTracks.map((track) => track.id);
      const filtered = prevQueue.filter((id) => baseIds.includes(id));
      const missing = baseIds.filter((id) => !filtered.includes(id));
      return [...filtered, ...missing];
    });
  }, [baseTracks, setQueueSafe]);

  const tracks = useMemo(
    () => queue.map((id) => trackMap.get(id)).filter(Boolean),
    [queue, trackMap],
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const [variant, setVariant] = useState(
    () => localStorage.getItem("playerVariant") || VARIANTS.standard,
  );

  useEffect(() => {
    localStorage.setItem("playerVariant", variant);
  }, [variant]);

  const audioRef = useRef(new Audio());
  const current = tracks[queueIndex] ?? tracks[0] ?? null;
  const duration = audioRef.current?.duration ?? current?.duration ?? 0;
  const progressPct = duration ? Math.min(100, (progress / duration) * 100) : 0;

  // Ensure the currently playing track is always first in the queue
  useEffect(() => {
    setQueueSafe((prevQueue) => {
      const arr = Array.isArray(prevQueue) ? prevQueue : prevQueue?.queue;
      if (!arr || arr.length === 0) return prevQueue;
      if (queueIndex <= 0 || queueIndex >= arr.length) return prevQueue;
      const rotated = [...arr.slice(queueIndex), ...arr.slice(0, queueIndex)];
      return { queue: rotated, index: 0 };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueIndex]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueIndex]);const volumeIcon = useCallback((v, muted) => {
    if (muted || v === 0) return volumeMute;
    if (v <= 0.33) return volumeLow;
    if (v <= 0.66) return volumeMid;
    return volumeHigh;
  }, []);

  useEffect(() => {
    if (!current) return;
    const audio = audioRef.current;
    audio.src = current.audio.src;
    audio.load();
    setProgress(0);
    audio.volume = isMuted ? 0 : volume;

    const onLoaded = () => {
      if (!current.duration && Number.isFinite(audio.duration)) {
        current.duration = Math.round(audio.duration);
      }
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    };

    const onTime = () => setProgress(audio.currentTime || 0);
    const onEnd = () => next();

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, current?.audio?.src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying((prev) => !prev);

  const prev = useCallback(() => {
    setQueueIndex((idx) => {
      if (queue.length === 0) return 0;
      return (idx - 1 + queue.length) % queue.length;
    });
  }, [queue.length]);

  const next = useCallback(() => {
    setQueueIndex((idx) => {
      if (queue.length === 0) return 0;
      return (idx + 1) % queue.length;
    });
  }, [queue.length]);

  const setIndex = useCallback(
    (idx) => {
      if (!Number.isFinite(idx)) return;
      setQueueIndex(() => {
        if (queue.length === 0) return 0;
        return Math.max(0, Math.min(Math.floor(idx), queue.length - 1));
      });
    },
    [queue.length],
  );

  const seekToRatio = (ratio) => {
    const audio = audioRef.current;
    const d = audio.duration || 0;
    const t = Math.max(0, Math.min(ratio * d, d));
    audio.currentTime = t;
    setProgress(t);
  };

  const toggleMute = () => {
    if (!isMuted) {
      setPrevVolume(volume > 0 ? volume : 0.7);
      setIsMuted(true);
      setVolume(0);
    } else {
      setIsMuted(false);
      if (volume === 0) setVolume(prevVolume || 0.7);
    }
  };

  const onVolumeChange = (nextValue) => {
    const v = Math.max(0, Math.min(1, nextValue));
    setVolume(v);
    if (v === 0 && !isMuted) setIsMuted(true);
    else if (v > 0 && isMuted) setIsMuted(false);
  };

  const order = [VARIANTS.mini, VARIANTS.standard, VARIANTS.full];
  const cycleVariant = () =>
    setVariant((v) => order[(order.indexOf(v) + 1) % order.length]);
  const growVariant = () =>
    setVariant((v) => order[Math.min(order.indexOf(v) + 1, order.length - 1)]);
  const shrinkVariant = () =>
    setVariant((v) => order[Math.max(order.indexOf(v) - 1, 0)]);

  useEffect(() => {
    const onKey = (event) => {
      const tag = (event.target.tagName || "").toLowerCase();
      if (
        ["input", "textarea", "select"].includes(tag) ||
        event.target.isContentEditable
      )
        return;
      if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
      }
      if (event.key.toLowerCase() === "m") toggleMute();
      if (event.key.toLowerCase() === "f") cycleVariant();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const playById = useCallback(
    (id) => {
      const idx = queue.indexOf(id);
      if (idx === -1) return;
      if (idx === queueIndex) {
        setIsPlaying((prev) => !prev);
      } else {
        setQueueIndex(idx);
        setIsPlaying(true);
      }
    },
    [queue, queueIndex],
  );

  const playAtIndex = useCallback(
    (idx) => {
      if (idx < 0 || idx >= queue.length) return;
      if (idx === queueIndex) {
        setIsPlaying((prev) => !prev);
      } else {
        setQueueIndex(idx);
        setIsPlaying(true);
      }
    },
    [queue.length, queueIndex],
  );

  const addToQueue = useCallback(
    (id) => {
      if (!trackMap.has(id)) return;
      setQueueSafe((prevQueue) => {
        const filtered = prevQueue.filter((item) => item !== id);
        return [...filtered, id];
      });
    },
    [setQueueSafe, trackMap],
  );

  const playNext = useCallback(
    (id) => {
      if (!trackMap.has(id)) return;
      setQueueSafe((prevQueue) => {
        const filtered = prevQueue.filter((item) => item !== id);
        const insertIndex = Math.min(queueIndex + 1, filtered.length);
        const nextQueue = [
          ...filtered.slice(0, insertIndex),
          id,
          ...filtered.slice(insertIndex),
        ];
  return { queue: nextQueue, index: queueIndex };
      });
    },
    [queueIndex, setQueueSafe, trackMap],
  );

  const removeFromQueue = useCallback(
    (id) => {
      setQueueSafe((prevQueue) => {
        if (prevQueue.length <= 1) return prevQueue;
        const idx = prevQueue.indexOf(id);
        if (idx === -1) return prevQueue;
        const nextQueue = prevQueue.filter((item) => item !== id);
        let nextIndex = queueIndex;
        if (idx === queueIndex) {
          nextIndex = Math.min(queueIndex, nextQueue.length - 1);
        } else if (idx < queueIndex) {
          nextIndex = Math.max(0, queueIndex - 1);
        }
  return { queue: nextQueue, index: nextIndex };
      });
    },
    [queueIndex, setQueueSafe],
  );

  const moveInQueue = useCallback(
    (id, direction) => {
      setQueueSafe((prevQueue) => {
        const idx = prevQueue.indexOf(id);
        if (idx === -1) return prevQueue;
        const target = direction === "up" ? idx - 1 : idx + 1;
        if (target < 0 || target >= prevQueue.length) return prevQueue;
        const nextQueue = [...prevQueue];
        [nextQueue[idx], nextQueue[target]] = [
          nextQueue[target],
          nextQueue[idx],
        ];
        let nextIndex = queueIndex;
        if (queueIndex === idx) nextIndex = target;
        else if (queueIndex === target) nextIndex = idx;
        // If a track is moved to the top (index 0) while playing, switch playback to it
        if (isPlaying && target === 0) {
          nextIndex = 0;
        }
  return { queue: nextQueue, index: nextIndex };
      });
    },
    [queueIndex, setQueueSafe, isPlaying],
  );
  return {
    // Queue-ordered list used by the player
    tracks,
    // Catalog in original/static order for UI components (e.g., carousel, library)
    catalog: baseTracks,
    queue,
    queueIndex,
    queueTracks: tracks,
    current,
    index: queueIndex,
    isPlaying,
    progress,
    duration,
    progressPct,
    volume,
    isMuted,
    variant,
    VARIANTS,
    audioRef,
    setIndex,
    togglePlay,
    prev,
    next,
    seekToRatio,
    toggleMute,
    onVolumeChange,
    setVariant,
    growVariant,
    shrinkVariant,
    cycleVariant,
    fmt,
    volumeIcon,
    playById,
    playAtIndex,
    addToQueue,
    playNext,
    removeFromQueue,
    moveInQueue,
  };
}








