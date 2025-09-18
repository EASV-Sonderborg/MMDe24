// /src/components/useAudioController.js
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import tracksData from "../data/tracks.json";

export const VARIANTS = { mini: "mini", standard: "standard", full: "full" };

// Robust “true-ish”
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

const norm = (t, i) => ({
  id: t.id || `trk-${i}`,
  title: t.title || "Unknown Title",
  artist: t.artist || "Unknown Artist",
  album: t.album || "",
  genres: Array.isArray(t.genres) ? t.genres : [],
  releaseDate: t.releaseDate ?? null,
  featured: trueish(t?.featured ?? t?.meta?.featured), // <-- FIX
  duration: t.duration ?? null,
  bpm: t.bpm ?? null,
  scale: t.scale ?? { key: null, mode: null },
  audio: t.audio ?? { src: "", format: null },
  cover: t.cover ?? { src: "", format: null },
});

export default function useAudioController() {
  // En memoiseret, normaliseret liste – ingen setTracks/json her
  const tracks = useMemo(
    () => (tracksData || []).map(norm),
    []
  );

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.7);

  const [variant, setVariant] = useState(
    () => localStorage.getItem("playerVariant") || VARIANTS.standard
  );
  useEffect(() => localStorage.setItem("playerVariant", variant), [variant]);

  const audioRef = useRef(new Audio());
  const current = tracks[index];
  const duration = audioRef.current?.duration ?? current?.duration ?? 0;
  const progressPct = duration ? Math.min(100, (progress / duration) * 100) : 0;

  // load/attach events når track skifter
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
      if (isPlaying) audio.play().catch(() => setIsPlaying(false));
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
  }, [index, current?.audio?.src]);

  // play/pause når isPlaying ændres
  useEffect(() => {
    const a = audioRef.current;
    if (isPlaying) a.play().catch(() => setIsPlaying(false));
    else a.pause();
  }, [isPlaying]);

  // volume/mute
  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying((p) => !p);
  const prev = () => setIndex((i) => (i - 1 + tracks.length) % tracks.length);
  const next = () => setIndex((i) => (i + 1) % tracks.length);

  const seekToRatio = (ratio) => {
    const a = audioRef.current;
    const d = a.duration || 0;
    const t = Math.max(0, Math.min(ratio * d, d));
    a.currentTime = t;
    setProgress(t);
  };

  function toggleMute() {
    if (!isMuted) {
      setPrevVolume(volume > 0 ? volume : 0.7);
      setIsMuted(true);
      setVolume(0);
    } else {
      setIsMuted(false);
      if (volume === 0) setVolume(prevVolume || 0.7);
    }
  }
  function onVolumeChange(next) {
    const v = Math.max(0, Math.min(1, next));
    setVolume(v);
    if (v === 0 && !isMuted) setIsMuted(true);
    else if (v > 0 && isMuted) setIsMuted(false);
  }

  // keyboard: Space / M / F
  const order = [VARIANTS.mini, VARIANTS.standard, VARIANTS.full];
  const cycleVariant = () =>
    setVariant((v) => order[(order.indexOf(v) + 1) % order.length]);
  const growVariant = () =>
    setVariant((v) => order[Math.min(order.indexOf(v) + 1, order.length - 1)]);
  const shrinkVariant = () =>
    setVariant((v) => order[Math.max(order.indexOf(v) - 1, 0)]);

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag) || e.target.isContentEditable) return;
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      if (e.key.toLowerCase() === "m") toggleMute();
      if (e.key.toLowerCase() === "f") cycleVariant();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Hjælpere til at starte bestemt sang
  const playById = useCallback((id) => {
    const idx = tracks.findIndex((t) => t.id === id);
    if (idx === -1) return;
    if (idx === index) setIsPlaying((p) => !p);
    else { setIndex(idx); setIsPlaying(true); }
  }, [tracks, index]);

  const playAtIndex = useCallback((idx) => {
    if (idx < 0 || idx >= tracks.length) return;
    if (idx === index) setIsPlaying((p) => !p);
    else { setIndex(idx); setIsPlaying(true); }
  }, [tracks.length, index]);

  return {
    // data
    tracks, current, index,
    isPlaying, progress, duration, progressPct,
    volume, isMuted,
    variant, VARIANTS,

    // refs
    audioRef,

    // actions
    setIndex, togglePlay, prev, next,
    seekToRatio,
    toggleMute, onVolumeChange,
    setVariant, growVariant, shrinkVariant, cycleVariant,
    fmt,

    // helpers
    playById, playAtIndex,
  };
}
