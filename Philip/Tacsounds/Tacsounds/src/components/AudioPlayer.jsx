// src/components/AudioPlayer.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import tracksData from "../data/tracks.json";

import controlNext from "../assets/icons/next.svg";
import controlPrev from "../assets/icons/prev.svg";
import controlPlay from "../assets/icons/play.svg";
import controlPause from "../assets/icons/pause.svg";
import volumeMute from "../assets/icons/volumeMute.svg";
import volumeLow from "../assets/icons/volumeLow.svg";
import volumeMid from "../assets/icons/volumeMid.svg";
import volumeHigh from "../assets/icons/volumeHigh.svg";
import expand from "../assets/icons/expand.svg";
import minimize from "../assets/icons/minimize.svg";


const VARIANTS = { MINI: "mini", Standard: "standard", FULL: "full" };

useEffect(() => {
  localStorage.setItem("playerVariant", variant);
}, [variant]);

const [variant, setVariant] = useState(
  () => localStorage.getItem("playerVariant") || VARIANTS.STANDARD
);

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
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);

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
    audioRef.current.volume = isMuted  ?  0 : volume;
  }, [volume, isMuted]);



  function toggleMute() {
    if (!isMuted) {
      setPrevVolume(volume > 0 ? volume : 0.7); // Gem tidligere volumen, hvis det ikke er 0
      setIsMuted(true);
      setVolume(0);
    } else {
      setIsMuted(false);
      if (volume === 0) 
        setVolume(prevVolume  || 0.7); // Gendan tidligere volumen
      }
  }

  function volumeIcon(v, muted) {
    if (muted || v === 0) return volumeMute;
    if (v < 0.3) return volumeLow;
    if (v < 0.7) return volumeMid;
    return volumeHigh;
  }

  function onVolumeChange(next) {
    const v = Math.max(0, Math.min(1, next));
    setVolume(v);
    if (v === 0 && !isMuted) {
      setIsMuted(true);              // trukket helt ned -> mute
    } else if (v > 0 && isMuted) {
      setIsMuted(false);             // trukket op igen -> unmute
    }
  }

useEffect(() => {
  const onKey = (e) => e.key.toLowerCase() === "m" && toggleMute();
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, []);

useEffect(() => {
  const onKey = (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (["input","textarea","select"].includes(tag) || e.target.isContentEditable) return;

    if (e.code === "Space") { e.preventDefault(); togglePlay(); }
    if (e.key.toLowerCase() === "m") toggleMute();
    if (e.key.toLowerCase() === "f") setVariant(v => v === VARIANTS.FULL ? VARIANTS.STANDARD : VARIANTS.FULL);
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, []);

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
        <div className="audioControlProgress__container">
          <div className="audioControl__container">
            <button className="button buttonSkip" onClick={prev} aria-label="Previous Song"><img src={controlPrev} /></button>
            <button className="button buttonPlay" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} style={{ fontSize: 18 }}>
              <img src={isPlaying ? controlPause : controlPlay} alt={isPlaying ? "Pause" : "Play"} />
            </button>
            <button className="button buttonSkip" onClick={next} aria-label="Next Song"><img src={controlNext} /></button>
          </div>

          <div
            className="progress"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              seekToRatio(Math.max(0, Math.min(ratio, 1)));
            }}
          >
            <div
              className="progressBar"
              style={{ width: `${progressPct}%` }}   // <-- DET VIGTIGE
            />
          </div>
          <div className="timeRow">
            <span>{fmt(progress)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div> 
           
        {/* Højre: volume */}
        <div className="volume" style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
          <button className="muteToggle" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} title={isMuted ? "Unmute" : "Mute"} style={{ background: "none", border: "none", cursor: "pointer" }}
            >
            <img src={volumeIcon(volume, isMuted)} className="volumeIcon" alt={isMuted ? "Muted" : "Volume"} />
          </button>
          <input
            className="range" type="range" min="0" max="1" step="0.05"
            value={isMuted ? 0 : volume}      // visuel position følger mute
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            aria-label="Volume"
            style={{ "--progress": `${(isMuted ? 0 : volume) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
