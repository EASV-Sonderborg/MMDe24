import React, { useMemo, useState } from "react";
import useAudioController from "../components/useAudioController";
import AudioPlayerShell from "../components/AudioPlayerShell";
import "./library.css";

// Ikoner (juster stier hvis dine filer ligger andetsteds)
import infoIcon from "../assets/icons/info.svg";
import playIcon from "../assets/icons/play.svg";
import pauseIcon from "../assets/icons/pause.svg";
import sortIcon from "../assets/icons/sort.svg";
import closeIcon from "../assets/icons/close.svg";

export default function Library() {
  const ctrl = useAudioController();

  // UI state
  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState(new Set()); // multi-select
  const [showTech, setShowTech] = useState(false); // viser BPM/Scale
  const [sortKey, setSortKey] = useState("releaseDate");
  const [sortDir, setSortDir] = useState("desc"); // "asc" | "desc"
  const [detailsOf, setDetailsOf] = useState(null); // track for modal

  // Unikt sæt af genrer (tagnavne). Din JSON har "genre" som string; understøtter også array/komma-sep
  const allGenres = useMemo(() => {
    const s = new Set();
    (ctrl.tracks || []).forEach((t) => {
      const gs = Array.isArray(t.genre)
        ? t.genre
        : String(t.genre || "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);
      gs.forEach((g) => s.add(g));
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [ctrl.tracks]);

  // Filtrering + søgning
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (ctrl.tracks || []).filter((t) => {
      // genre filter
      if (selectedGenres.size > 0) {
        const gs = Array.isArray(t.genre)
          ? t.genre
          : String(t.genre || "")
              .split(",")
              .map((x) => x.trim());
        const match = gs.some((g) => selectedGenres.has(g));
        if (!match) return false;
      }
      // search
      if (!q) return true;
      const hay =
        `${t.title || ""} ${t.artist || ""} ${t.album || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [ctrl.tracks, query, selectedGenres]);

  // Sortering
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "title":
        case "artist":
        case "album":
          return a[sortKey].localeCompare(b[sortKey]) * dir;
        case "genre": {
          const ag = Array.isArray(a.genre) ? a.genre.join(", ") : a.genre || "";
          const bg = Array.isArray(b.genre) ? b.genre.join(", ") : b.genre || "";
          return ag.localeCompare(bg) * dir;
        }
        case "length": {
          // length i "m:ss" → sekunder
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
          // ISO dato → nyere først (desc default)
          return (
            (new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()) *
            dir
          );
      }
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const toggleGenre = (g) => {
    const copy = new Set(selectedGenres);
    if (copy.has(g)) copy.delete(g);
    else copy.add(g);
    setSelectedGenres(copy);
  };

  const clearGenres = () => setSelectedGenres(new Set());

  const onSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "releaseDate" ? "desc" : "asc");
    }
  };

  const isCurrent = (i) => ctrl.index === i;
  const isPlayingHere = (i) => isCurrent(i) && ctrl.isPlaying;

  const onPlayClick = (trackIndex) => {
    if (ctrl.index === trackIndex) {
      ctrl.togglePlay();
    } else {
      ctrl.setIndex(trackIndex);
      if (!ctrl.isPlaying) ctrl.togglePlay();
    }
  };

  return (
    <div className="pageGrid">
      {/* Topbar/nav kan du indsætte her hvis du ønsker */}
      <main className="siteMain">
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

          {/* Desktop tabel */}
          <div className="tableWrap hideOnMobile">
            <table className="trackTable">
              <thead>
                <tr>
                  <th aria-label="Cover" />
                  <th onClick={() => onSort("releaseDate")}>
                    Udgivelse
                    <img className="thIcon" src={sortIcon} alt="" />
                    {sortKey === "releaseDate" && (
                      <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th onClick={() => onSort("title")}>
                    Titel
                    <img className="thIcon" src={sortIcon} alt="" />
                    {sortKey === "title" && (
                      <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th onClick={() => onSort("artist")}>
                    Kunstner
                    <img className="thIcon" src={sortIcon} alt="" />
                    {sortKey === "artist" && (
                      <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th onClick={() => onSort("album")}>
                    Album
                    <img className="thIcon" src={sortIcon} alt="" />
                    {sortKey === "album" && (
                      <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th onClick={() => onSort("genre")}>
                    Genre
                    <img className="thIcon" src={sortIcon} alt="" />
                    {sortKey === "genre" && (
                      <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th onClick={() => onSort("length")}>
                    Længde
                    <img className="thIcon" src={sortIcon} alt="" />
                    {sortKey === "length" && (
                      <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>

                  {showTech && (
                    <>
                      <th onClick={() => onSort("bpm")}>
                        BPM
                        <img className="thIcon" src={sortIcon} alt="" />
                        {sortKey === "bpm" && (
                          <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>
                        )}
                      </th>
                      <th onClick={() => onSort("scale")}>
                        Scale
                        <img className="thIcon" src={sortIcon} alt="" />
                        {sortKey === "scale" && (
                          <span className="sortBadge">{sortDir === "asc" ? "↑" : "↓"}</span>
                        )}
                      </th>
                    </>
                  )}

                  <th aria-label="Info" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((t, i) => {
                  const idx = ctrl.tracks.indexOf(t); // globalt index til controller
                  const playing = isPlayingHere(idx);

                  return (
                    <tr key={t.id || i} className={playing ? "isPlaying" : ""}>
                      <td>
                        <button
                          className="coverBtn"
                          onClick={() => onPlayClick(idx)}
                          aria-label={playing ? "Pause" : "Afspil"}
                        >
                          <img className="coverImg" src={t.cover?.src} alt="" />
                          <span className="coverOverlay">
                            <img src={playing ? pauseIcon : playIcon} alt="" />
                          </span>
                        </button>
                      </td>
                      <td>{fmtDate(t.releaseDate)}</td>
                      <td className="cellTitle">{t.title}</td>
                      <td className="cellArtist">{t.artist}</td>
                      <td>{t.album}</td>
                      <td>{Array.isArray(t.genre) ? t.genre.join(", ") : t.genre}</td>
                      <td>{t.length}</td>
                      {showTech && (
                        <>
                          <td>{t.bpm || "—"}</td>
                          <td>{t.scale || "—"}</td>
                        </>
                      )}
                      <td className="cellInfo">
                        <button
                          className="infoBtn"
                          onClick={() => setDetailsOf({ track: t, index: idx })}
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

          {/* Mobil-liste */}
          <div className="mobileList showOnMobile">
            {sorted.map((t, i) => {
              const idx = ctrl.tracks.indexOf(t);
              const playing = isPlayingHere(idx);
              return (
                <div key={t.id || i} className={`mobileCard ${playing ? "isPlaying" : ""}`}>
                  <button className="coverBtn" onClick={() => onPlayClick(idx)}>
                    <img className="coverImg" src={t.cover?.src} alt="" />
                    <span className="coverOverlay">
                      <img src={playing ? pauseIcon : playIcon} alt="" />
                    </span>
                  </button>
                  <div className="meta">
                    <div className="title">{t.title}</div>
                    <div className="artist">{t.artist}</div>
                    <div className="subRow">
                      <span className="genre">{Array.isArray(t.genre) ? t.genre.join(", ") : t.genre}</span>
                      <span className="length">{t.length}</span>
                      <button
                        className="infoBtn"
                        onClick={() => setDetailsOf({ track: t, index: idx })}
                        aria-label="Mere info"
                        title="Mere info"
                      >
                        <img src={infoIcon} alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Player i bunden */}
      <footer className="siteFooter">
        <AudioPlayerShell controller={ctrl} />
      </footer>

      {/* Modal til ekstra info */}
      {detailsOf && (
        <DetailsModal
          track={detailsOf.track}
          onClose={() => setDetailsOf(null)}
          icons={{ closeIcon }}
        />
      )}
    </div>
  );
}

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

/** Simple modal (indbygget her for at holde filantallet nede) */
function DetailsModal({ track, onClose, icons }) {
  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modalCard" onClick={(e) => e.stopPropagation()}>
        <button className="modalClose" onClick={onClose} aria-label="Luk">
          <img src={icons.closeIcon} alt="" />
        </button>

        <div className="modalGrid">
          <img className="modalCover" src={track.cover?.src} alt="" />
          <div className="modalMeta">
            <h2>{track.title}</h2>
            <div className="modalArtist">{track.artist}</div>
            <div className="modalList">
              <div><span>Album:</span> {track.album || "—"}</div>
              <div><span>Genre:</span> {Array.isArray(track.genre) ? track.genre.join(", ") : track.genre}</div>
              <div><span>Udgivet:</span> {fmtDate(track.releaseDate)}</div>
              <div><span>Længde:</span> {track.length || "—"}</div>
              <div><span>BPM:</span> {track.bpm || "—"}</div>
              <div><span>Scale:</span> {track.scale || "—"}</div>
            </div>
          </div>
        </div>

        {track.description && (
          <p className="modalDesc">{track.description}</p>
        )}
      </div>
    </div>
  );
}
