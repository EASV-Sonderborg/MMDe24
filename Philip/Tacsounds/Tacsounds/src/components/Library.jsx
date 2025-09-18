import React, { useMemo, useRef, useState, useEffect } from "react";
import "./library.css";

import infoIcon from "../assets/icons/info.svg";
import playIcon from "../assets/icons/play.svg";
import pauseIcon from "../assets/icons/pause.svg";
import sortIcon from "../assets/icons/sort.svg";

const FALLBACK_COVER = "/assets/covers/tacStandard.png"; // public path

export default function Library({
  controller,
  initialQuery = "",
  initialArtist = "",
  focusTrackId = null,
}) {
  const [query, setQuery] = useState(initialQuery || "");
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [showTech, setShowTech] = useState(false);
  const [sortKey, setSortKey] = useState("releaseDate");
  const [sortDir, setSortDir] = useState("desc");
  const [detailsOf, setDetailsOf] = useState(null);

  useEffect(() => {
    if (initialQuery && !query) setQuery(initialQuery);
  }, [initialQuery]);

  const rowRefs = useRef(new Map());
  useEffect(() => {
    if (!focusTrackId) return;
    const el = rowRefs.current.get(focusTrackId);
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focusTrackId]);

  const allGenres = useMemo(() => {
    const s = new Set();
    (controller.tracks || []).forEach((t) => {
      const gs = Array.isArray(t.genre)
        ? t.genre
        : String(t.genre || "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);
      gs.forEach((g) => s.add(g));
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [controller.tracks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (controller.tracks || []).filter((t) => {
      if (selectedGenres.size > 0) {
        const gs = Array.isArray(t.genre)
          ? t.genre
          : String(t.genre || "").split(",").map((x) => x.trim());
        if (!gs.some((g) => selectedGenres.has(g))) return false;
      }
      if (!q) return true;
      const hay = `${t.title || ""} ${t.artist || ""} ${t.album || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [controller.tracks, query, selectedGenres]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      switch (sortKey) {
        case "title":
        case "artist":
        case "album":
          return String(a[sortKey] || "").localeCompare(String(b[sortKey] || "")) * dir;
        case "genre": {
          const ag = Array.isArray(a.genre) ? a.genre.join(", ") : a.genre || "";
          const bg = Array.isArray(b.genre) ? b.genre.join(", ") : b.genre || "";
          return ag.localeCompare(bg) * dir;
        }
        case "length": {
          const toSec = (s) => {
            const [m, sec] = String(s || "0:00").split(":").map(Number);
            return (m || 0) * 60 + (sec || 0);
          };
          return (toSec(a.length) - toSec(b.length)) * dir;
        }
        case "bpm":
          return ((a.bpm || 0) - (b.bpm || 0)) * dir;
        case "scale":
          return String(a.scale || "").localeCompare(String(b.scale || "")) * dir;
        case "releaseDate":
        default:
          return (
            (new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()) * dir
          );
      }
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const toggleGenre = (g) => {
    const copy = new Set(selectedGenres);
    copy.has(g) ? copy.delete(g) : copy.add(g);
    setSelectedGenres(copy);
  };
  const clearGenres = () => setSelectedGenres(new Set());

  const onSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "releaseDate" ? "desc" : "asc");
    }
  };

  const isCurrent = (track) => controller.tracks.indexOf(track) === controller.index;
  const isPlayingHere = (track) => isCurrent(track) && controller.isPlaying;

  const scaleText = (t) => {
    if (t.scale) return t.scale;               // e.g. "A Minor"
    if (t.key && typeof t.key === "object") {  // e.g. { key:"A", mode:"Minor" }
      const k = t.key.key || "";
      const m = t.key.mode || "";
      const txt = `${k} ${m}`.trim();
      return txt || "—";
    }
    return t.key || "—";
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
              className={`chip ${selectedGenres.size === 0 ? "isActive" : ""}`}
              onClick={clearGenres}
            >
              Alle
            </button>
            {allGenres.map((g) => (
              <button
                key={g}
                className={`chip ${selectedGenres.has(g) ? "isActive" : ""}`}
                onClick={() => toggleGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>

          <label className="toggleTech">
            <input
              type="checkbox"
              checked={showTech}
              onChange={(e) => setShowTech(e.target.checked)}
            />
            <span>Vis BPM / Scale</span>
          </label>
        </div>
      </div>

      <div className="tableWrap hideOnMobile">
        <table className="trackTable">
          <thead>
            <tr>
              <th aria-label="Cover" />
              <th onClick={() => onSort("title")}>
                Titel
                {sortKey === "title" && <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th onClick={() => onSort("artist")}>
                Kunstner
                {sortKey === "artist" && <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th onClick={() => onSort("releaseDate")}>
                Udgivelse
                {sortKey === "releaseDate" && <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th onClick={() => onSort("album")}>
                Album
                {sortKey === "album" && <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th onClick={() => onSort("genre")}>
                Genre
                {sortKey === "genre" && <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th onClick={() => onSort("length")}>
                Længde
                {sortKey === "length" && <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>}
              </th>
              {showTech && (
                <>
                  <th onClick={() => onSort("bpm")}>
                    BPM
                    {sortKey === "bpm" && <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th onClick={() => onSort("scale")}>
                    Scale
                    {sortKey === "scale" && <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </th>
                </>
              )}
              <th aria-label="Info" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((t, i) => {
              const playing = isPlayingHere(t);
              const coverSrc = t.cover?.src || FALLBACK_COVER;
              return (
                <tr key={t.id || i} ref={(el) => rowRefs.current.set(t.id || i, el)} className={playing ? "isPlaying" : ""}>
                  <td>
                    <button
                      className="coverBtn"
                      onClick={() => controller.playById(t.id)}
                      aria-label={playing ? "Pause" : "Afspil"}
                    >
                      <img className="coverImg" src={coverSrc} alt="" />
                      <span className="coverOverlay">
                        <img src={playing ? pauseIcon : playIcon} alt="" />
                      </span>
                    </button>
                  </td>
                  <td className="cellTitle">{t.title}</td>
                  <td className="cellArtist">{t.artist}</td>
                  <td>{fmtDate(t.releaseDate)}</td>
                  <td>{t.album || "—"}</td>
                  <td>{Array.isArray(t.genre) ? t.genre.join(", ") : t.genre || "—"}</td>
                  <td>{t.length || "—"}</td>
                  {showTech && (
                    <>
                      <td>{t.bpm || "—"}</td>
                      <td>{scaleText(t)}</td>
                    </>
                  )}
                  <td className="cellInfo">
                    <button
                      className="infoBtn"
                      onClick={() => setDetailsOf({ track: t })}
                      aria-label="Mere info"
                      title="Mere info"
                    >
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
            <button className="modalClose" onClick={() => setDetailsOf(null)} aria-label="Luk">×</button>
            <div className="modalGrid">
              <img className="modalCover" src={detailsOf.track.cover?.src || FALLBACK_COVER} alt="" />
              <div className="modalMeta">
                <h2>{detailsOf.track.title}</h2>
                <div className="modalArtist">{detailsOf.track.artist}</div>
                <div className="modalList">
                  <div><span>Album:</span> {detailsOf.track.album || "—"}</div>
                  <div><span>Genre:</span> {Array.isArray(detailsOf.track.genre) ? detailsOf.track.genre.join(", ") : detailsOf.track.genre || "—"}</div>
                  <div><span>Udgivet:</span> {fmtDate(detailsOf.track.releaseDate)}</div>
                  <div><span>Længde:</span> {detailsOf.track.length || "—"}</div>
                  <div><span>BPM:</span> {detailsOf.track.bpm || "—"}</div>
                  <div><span>Scale:</span> {scaleText(detailsOf.track)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch { return iso; }
}
