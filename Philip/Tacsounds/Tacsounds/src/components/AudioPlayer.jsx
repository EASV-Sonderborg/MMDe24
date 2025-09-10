// src/components/AudioPlayer.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import tracksData from "../data/tracks.json";

// mm:ss
const fmt = (secs = 0) => {
  if (!Number.isFinite(secs)) return "0:00";
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Ensart felter/typer let
const normalize = (items) =>
  (items || []).map((t, i) => ({
    id: t.id || `trk-${i}`,
    title: t.title || "Unknown Title",
    artist: t.artist || "Unknown Artist",
    album: t.album || "Unknown Album",
    genres: Array.isArray(t.genres) ? t.genres : [],
    releaseDate: t.releaseDate ?? null,
    duration: t.duration ?? null,
    bpm: t.bpm ?? null,
    scale: t.scale ?? { key: null, mode: null },
    audio: t.audio ?? { src: "", format: null },
    cover: t.cover ?? { src: "", format: null },
  }));

export default function AudioPlayer() {
  const tracks = useMemo(() => normalize(tracksData), []);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(new Audio());

  const current = tracks[index];
  const duration = audioRef.current?.duration ?? current?.duration ?? 0;
  const progressPct = duration ? Math.min(100, (progress / duration) * 100) : 0;

  // Load/lyt når track skifter
  useEffect(() => {
    if (!current) return;
    const audio = audioRef.current;
    audio.src = current.audio.src;
    audio.load();
    setProgress(0);
    audio.volume = volume;

    const onLoaded = () => {
      if (!current.duration && Number.isFinite(audio.duration)) {
        current.duration = Math.round(audio.duration); // runtime cache
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

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Volume
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Handlers
  const togglePlay = () => setIsPlaying(p => !p);
  const prev = () => setIndex(i => (i - 1 + tracks.length) % tracks.length);
  const next = () => setIndex(i => (i + 1) % tracks.length);

  // ratio: 0..1
  const seekToRatio = (ratio) => {
    const audio = audioRef.current;
    const d = audio.duration || 0;
    const t = Math.max(0, Math.min(ratio * d, d));
    audio.currentTime = t;
    setProgress(t);
  };

  if (!current) return null;

  return (
    <div className="audioPlayer">
      <div className="audioPlayer__Container">
        {/* Venstre: cover + meta */}
        <div className="audioCoverData">
          {current.cover?.src ? (
            <img className="cover" src={current.cover.src} alt=""/>
          ) : (
            <div className="cover"/>
          )}
          <div className="trackInfo">
            <div className="title">{current.title}</div>
            <div className="artist">{current.artist}</div>
          </div>
        </div>

        {/* Midt: transport + progress */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            <button onClick={prev} aria-label="Forrige">⏮</button>
            <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Afspil"} style={{ fontSize: 18 }}>
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button onClick={next} aria-label="Næste">⏭</button>
          </div>

          <div
            className="progress"
            style={{ height: 6 , background: "#eee", borderRadius: 999, position: "relative", cursor: "pointer" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              seekToRatio(Math.max(0, Math.min(ratio, 1)));
            }}
          >
            <div className="progressBar" style={{
              position: "absolute", top: 0, bottom: 0, left: 0,
              width: `${progressPct}%`, background: "#0F1557", borderRadius: 999
            }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, opacity: 0.7 }}>
            <span>{fmt(progress)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* Højre: volume */}
        <div className="volume" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Lydstyrke"
            style={{ width: 120 }}
          />
        </div>
      </div>
    </div>
  );
}
