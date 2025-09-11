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

/* ---------- helpers ---------- */
const fmt = (secs = 0) => {
  if (!Number.isFinite(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

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

const VARIANTS = { mini: "mini", standard: "standard", full: "full" };

export default function AudioPlayer() {
  const tracks = useMemo(() => normalize(tracksData), []);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.7);

  // størrelses-variant (gemmes i localStorage)
  const [variant, setVariant] = useState(
    () => localStorage.getItem("playerVariant") || VARIANTS.standard
  );
  useEffect(() => {
    localStorage.setItem("playerVariant", variant);
  }, [variant]);

  const variantOrder = [VARIANTS.mini, VARIANTS.standard, VARIANTS.full];

const growVariant = () =>
  setVariant((v) => variantOrder[Math.min(variantOrder.indexOf(v) + 1, variantOrder.length - 1)]);

const shrinkVariant = () =>
  setVariant((v) => variantOrder[Math.max(variantOrder.indexOf(v) - 1, 0)]);

/* F-cyklus: mini -> standard -> full -> mini */
const cycleVariantForward = () =>
  setVariant((v) => variantOrder[(variantOrder.indexOf(v) + 1) % variantOrder.length]);

  const audioRef = useRef(new Audio());
  const current = tracks[index];

  const duration = audioRef.current?.duration ?? current?.duration ?? 0;
  const progressPct = duration ? Math.min(100, (progress / duration) * 100) : 0;

  /* ---------- audio lifecycle ---------- */
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

  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  /* ---------- controls ---------- */
  const togglePlay = () => setIsPlaying((p) => !p);
  const prev = () => setIndex((i) => (i - 1 + tracks.length) % tracks.length);
  const next = () => setIndex((i) => (i + 1) % tracks.length);

  const seekToRatio = (ratio) => {
    const audio = audioRef.current;
    const d = audio.duration || 0;
    const t = Math.max(0, Math.min(ratio * d, d));
    audio.currentTime = t;
    setProgress(t);
  };

  const onProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seekToRatio(Math.max(0, Math.min(ratio, 1)));
  };

  const volumeIcon = (v, muted) => {
    if (muted || v === 0) return volumeMute;
    if (v <= 0.33) return volumeLow;
    if (v <= 0.66) return volumeMid;
    return volumeHigh;
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

  // tastatur: Space = play/pause, M = mute, F = full toggle
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (["input","textarea","select"].includes(tag) || e.target.isContentEditable) return;

      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      if (e.key.toLowerCase() === "m") toggleMute();
      if (e.key.toLowerCase() === "f") cycleVariantForward(); // <-- ny adfærd
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  if (!current) return null;

  // modifier-klasse til størrelsen
  const variantClass =
    variant === VARIANTS.mini
      ? "audioPlayer--mini"
      : variant === VARIANTS.full
      ? "audioPlayer--full"
      : "";

  return (
    <>
      {/* overlay baggrund i FULL */}
      {variant === VARIANTS.full && <div className="audioPlayer__overlayBackdrop" />}

      <div className={`audioPlayer ${variantClass}`}>
        {/* progress-linje i toppen (kun synlig i mini via CSS) */}
        <div className="audioPlayer__topProgress">
          <div
            className="audioPlayer__topProgressFill"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="audioPlayer__Container">
          {variant === VARIANTS.mini && (
  <div className="miniControls">
    <button
      className="button buttonPlay"
      onClick={togglePlay}
      aria-label={isPlaying ? "Pause" : "Play"}
      title={isPlaying ? "Pause" : "Play"}
    >
      <img src={isPlaying ? controlPause : controlPlay} alt="" />
    </button>
            {variant !== VARIANTS.full && (
                <button
                  className="button sizeBtn"
                  onClick={growVariant}
                  aria-label="Expand"
                  title="Expand"
                >
                  <img src={expand} alt="" />
                </button>
              )}
    <div className="volumeMini">
      <div
        className="muteToggle"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        title={isMuted ? "Unmute" : "Mute"}
      >
        <img src={volumeIcon(volume, isMuted)} className="volumeIcon" alt="" />
      </div>

      {/* Vertikal slider, vises på hover/focus */}
      <input
        className="range rangeVertical"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={isMuted ? 0 : volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        aria-label="Volume"
        style={{ "--progress": `${(isMuted ? 0 : volume) * 100}%` }}
      />
    </div>
  </div>
)}
          {/* Venstre: cover + meta */}
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

          {/* Midt: transport + progress */}
          <div className="audioControlProgress__container">
            <div className="audioControl__container">
              <button className="button buttonSkip" onClick={prev} aria-label="Previous Song">
                <img src={controlPrev} alt="Prev" />
              </button>
              <button
                className="button buttonPlay"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <img src={isPlaying ? controlPause : controlPlay} alt={isPlaying ? "Pause" : "Play"} />
              </button>
              <button className="button buttonSkip" onClick={next} aria-label="Next Song">
                <img src={controlNext} alt="Next" />
              </button>
            </div>

            <div className="progress" onClick={onProgressClick}>
              <div className="progressBar" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="timeRow">
              <span>{fmt(progress)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

          {/* Højre: volume + knapper til størrelser */}
          <div className="audioVolumeWindow__container">
            <div className="windowButtons">
              {/* vis MINIMIZE hvis vi ikke allerede er i mini */}
              {variant !== VARIANTS.mini && (
                <button
                  className="button sizeBtn"
                  onClick={shrinkVariant}
                  aria-label="Minimize"
                  title="Minimize"
                >
                  <img src={minimize} alt="" />
                </button>
              )}

              {/* vis EXPAND hvis vi ikke allerede er i full */}
              {variant !== VARIANTS.full && (
                <button
                  className="button sizeBtn"
                  onClick={growVariant}
                  aria-label="Expand"
                  title="Expand"
                >
                  <img src={expand} alt="" />
                </button>
              )}
            </div>
            <div className="volume">
              <div
                className="muteToggle"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                title={isMuted ? "Unmute" : "Mute"}
              >
                <img src={volumeIcon(volume, isMuted)} className="volumeIcon" alt={isMuted ? "Muted" : "Volume"} />
              </div>

              <input
                className="range"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                aria-label="Volume"
                style={{ "--progress": `${(isMuted ? 0 : volume) * 100}%` }}
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
