// src/components/Library.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./library.css";

import infoIcon from "../assets/icons/info.svg";
import playIcon from "../assets/icons/play.svg";
import pauseIcon from "../assets/icons/pause.svg";

const FALLBACK_COVER = "/assets/covers/tacStandard.png"; // ligger i /public/assets

export default function Library({
  controller,          // kræves (kommer fra useAudioController i Home)
  initialQuery = "",
  focusTrackId = null, // valgfrit: scroll til en bestemt række
}) {
  // Den liste vi viser i biblioteket (brug controllerens queue som sandhed)
  const tracks = controller?.tracks ?? [];

  // ---------- søg / filtre / sort ----------
  const [query, setQuery] = useState(initialQuery);
  const [activeGenre, setActiveGenre] = useState(""); // tom = alle
  const [sortKey, setSortKey] = useState("releaseDate");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => { setQuery(initialQuery || ""); }, [initialQuery]);

  // ---------- for-indlæs længder (duration) ----------
  // Map: { trackId -> "m:ss" }
  const [durations, setDurations] = useState({});
  useEffect(() => {
    let cancelled = false;

    // kun dem der mangler length og duration
    const pending = tracks.filter(
      t => !t.length && !t.duration && t.src
    );

    if (pending.length === 0) return;

    pending.forEach(t => {
      const audio = new Audio();
      audio.preload = "metadata";
      audio.src = t.src;

      const onLoaded = () => {
        if (cancelled) return;
        const sec = Number.isFinite(audio.duration) ? audio.duration : 0;
        setDurations(prev => ({
          ...prev,
          [t.id]: fmtTimeFromSeconds(sec),
        }));
        cleanup();
      };
      const onError = () => cleanup();

      const cleanup = () => {
        audio.removeEventListener("loadedmetadata", onLoaded);
        audio.removeEventListener("error", onError);
      };

      audio.addEventListener("loadedmetadata", onLoaded);
      audio.addEventListener("error", onError);
      // kick metadata indlæsning
      audio.load();
    });

    return () => { cancelled = true; };
  }, [tracks]);

  // ---------- helpers ----------
  const normalizeGenres = (track) => {
    // du har ændret til string – men vi håndterer begge dele for fremtiden
    if (Array.isArray(track.genre)) return track.genre.filter(Boolean);
    if (typeof track.genre === "string" && track.genre.trim()) return [track.genre.trim()];
    return [];
  };

  const allGenres = useMemo(() => {
    const s = new Set();
    tracks.forEach(t => normalizeGenres(t).forEach(g => s.add(g)));
    return [...s].sort((a,b)=>a.localeCompare(b));
  }, [tracks]);

  const filtered = useMemo(() => {
    const term = (query || "").trim().toLowerCase();
    return tracks.filter(t => {
      const textHit =
        !term ||
        t.title?.toLowerCase().includes(term) ||
        t.artist?.toLowerCase().includes(term) ||
        t.album?.toLowerCase().includes(term);
      const g = normalizeGenres(t);
      const genreHit = !activeGenre || g.includes(activeGenre);
      return textHit && genreHit;
    });
  }, [tracks, query, activeGenre]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      switch (sortKey) {
        case "title":
        case "artist":
        case "album": {
          return String(a[sortKey] || "").localeCompare(String(b[sortKey] || "")) * dir;
        }
        case "genre": {
          const aa = normalizeGenres(a).join(", ");
          const bb = normalizeGenres(b).join(", ");
          return aa.localeCompare(bb) * dir;
        }
        case "releaseDate":
        default: {
          const ta = new Date(a.releaseDate).getTime() || 0;
          const tb = new Date(b.releaseDate).getTime() || 0;
          return (ta - tb) * dir;
        }
      }
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // ---------- scroll til bestemt række ----------
  const rowRefs = useRef(new Map());
  useEffect(() => {
    if (!focusTrackId) return;
    const el = rowRefs.current.get(focusTrackId);
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focusTrackId, sorted]);

  // ---------- modal ----------
  const [detailsOf, setDetailsOf] = useState(null);

  // ---------- play/pause helpers ----------
  const isCurrent = (track) => controller.index >= 0 && controller.tracks[controller.index]?.id === track.id;
  const isPlayingHere = (track) => isCurrent(track) && controller.isPlaying;

  const onSort = (key) => {
    if (key === sortKey) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "releaseDate" ? "desc" : "asc");
    }
  };

  return (
    <section className="library">
      <div className="library__header">
        <h1>Bibliotek</h1>

        <div className="filtersRow">
          <div className="searchBox">
            <input
              type="text"
              placeholder="Søg efter titel, kunstner eller album…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Søg i bibliotek"
            />
          </div>

          <div className="genreChips">
            <button
              className={`chip ${!activeGenre ? "isActive" : ""}`}
              onClick={() => setActiveGenre("")}
            >
              Alle
            </button>
            {allGenres.map(g => (
              <button
                key={g}
                className={`chip ${activeGenre === g ? "isActive" : ""}`}
                onClick={() => setActiveGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tableWrap">
        <table className="trackTable">
          <thead>
            <tr>
              <th aria-label="Cover" />
              <th onClick={() => onSort("title")}>Titel {sortKey === "title" && <SortArrow dir={sortDir} />}</th>
              <th onClick={() => onSort("artist")}>Kunstner {sortKey === "artist" && <SortArrow dir={sortDir} />}</th>
              <th onClick={() => onSort("album")}>Album {sortKey === "album" && <SortArrow dir={sortDir} />}</th>
              <th onClick={() => onSort("genre")}>Genre {sortKey === "genre" && <SortArrow dir={sortDir} />}</th>
              <th onClick={() => onSort("releaseDate")}>Udgivet {sortKey === "releaseDate" && <SortArrow dir={sortDir} />}</th>
              <th>Længde</th>
              <th aria-label="Info" />
            </tr>
          </thead>

          <tbody>
            {sorted.map(t => {
              const playing = isPlayingHere(t);
              const coverSrc = t.cover?.src || FALLBACK_COVER;
              const lengthStr = t.length || t.duration || durations[t.id] || "—";
              return (
                <tr
                  key={t.id}
                  ref={el => rowRefs.current.set(t.id, el)}
                  className={playing ? "isPlaying" : ""}
                >
                  <td>
                    <button
                      className="coverBtn"
                      onClick={() => controller.playById(t.id)}
                      aria-label={playing ? "Pause" : "Afspil"}
                      title={playing ? "Pause" : "Afspil"}
                    >
                      <img className="coverImg" src={coverSrc} alt="" />
                      <span className="coverOverlay">
                        <img src={playing ? pauseIcon : playIcon} alt="" />
                      </span>
                    </button>
                  </td>

                  <td className="cellTitle">{t.title}</td>
                  <td className="cellArtist">{t.artist}</td>
                  <td>{t.album || "—"}</td>
                  <td>{normalizeGenres(t).join(", ") || "—"}</td>
                  <td>{fmtDate(t.releaseDate)}</td>
                  <td>{lengthStr}</td>

                  <td className="cellInfo">
                    <button className="infoBtn" onClick={() => setDetailsOf(t)}>
                      <img src={infoIcon} alt="" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {detailsOf && (
        <div className="modalBackdrop" onClick={() => setDetailsOf(null)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <button
              className="modalClose"
              onClick={() => setDetailsOf(null)}
              aria-label="Luk"
            >
              ×
            </button>

            <div className="modalGrid">
              <img
                className="modalCover"
                src={detailsOf.cover?.src || FALLBACK_COVER}
                alt=""
              />
              <div className="modalMeta">
                <h2>{detailsOf.title}</h2>
                <div className="modalArtist">{detailsOf.artist}</div>

                <div className="modalList">
                  <div><span>Album:</span> {detailsOf.album || "—"}</div>
                  <div><span>Genre:</span> {normalizeGenres(detailsOf).join(", ") || "—"}</div>
                  <div><span>Udgivet:</span> {fmtDate(detailsOf.releaseDate)}</div>
                  <div>
                    <span>Længde:</span>{" "}
                    {detailsOf.length || detailsOf.duration || durations[detailsOf.id] || "—"}
                  </div>
                  <div><span>BPM:</span> {detailsOf.bpm || "—"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- små UI helpers ---------- */
function SortArrow({ dir }) {
  return <span className="sortBadge">{dir === "asc" ? "↑" : "↓"}</span>;
}

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function fmtTimeFromSeconds(totalSec) {
  const s = Math.max(0, Math.round(totalSec || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}
