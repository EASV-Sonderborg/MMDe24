import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./library.css";

import playIcon from "../assets/icons/play.svg";
import pauseIcon from "../assets/icons/pause.svg";
import TrackActionsMenu from "./TrackActionsMenu.jsx";
import TrackDetailsModal from "./TrackDetailsModal.jsx";

const FALLBACK_COVER = "/assets/covers/tacStandard.png";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width:${breakpoint}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    const mql = window.matchMedia(`(max-width:${breakpoint}px)`);
    const handler = (event) => setIsMobile(event.matches);
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, [breakpoint]);

  return isMobile;
}

export default function Library({
  controller,
  initialQuery = "",
  focusTrackId = null,
}) {
  const tracks = controller?.tracks ?? [];
  const { playById, playNext, addToQueue, isPlaying } = controller || {};

  const [query, setQuery] = useState(initialQuery);
  const [activeGenre, setActiveGenre] = useState("");
  const [sortKey, setSortKey] = useState("releaseDate");
  const [sortDir, setSortDir] = useState("desc");
  const [durations, setDurations] = useState({});
  const [detailsOf, setDetailsOf] = useState(null);
  const [showGenres, setShowGenres] = useState(false);

  const isMobile = useIsMobile(820);

  useEffect(() => {
    setQuery(initialQuery || "");
  }, [initialQuery]);

  useEffect(() => {
    let cancelled = false;
    const pending = tracks.filter(
      (track) => !track.length && !track.duration && track.audio?.src,
    );
    if (pending.length === 0) return () => {};

    pending.forEach((track) => {
      const audio = new Audio();
      audio.preload = "metadata";
      audio.src = track.audio?.src || "";

      const cleanup = () => {
        audio.removeEventListener("loadedmetadata", onLoaded);
        audio.removeEventListener("error", onError);
      };

      const onLoaded = () => {
        if (cancelled) return;
        const sec = Number.isFinite(audio.duration) ? audio.duration : 0;
        setDurations((prev) => ({
          ...prev,
          [track.id]: fmtTimeFromSeconds(sec),
        }));
        cleanup();
      };

      const onError = () => cleanup();

      audio.addEventListener("loadedmetadata", onLoaded);
      audio.addEventListener("error", onError);
      audio.load();
    });

    return () => {
      cancelled = true;
    };
  }, [tracks]);

  const normalizeGenres = useCallback((track) => {
    if (!track) return [];
    if (Array.isArray(track.genres))
      return track.genres.filter(Boolean).map((g) => String(g).trim());
    if (Array.isArray(track.genre))
      return track.genre.filter(Boolean).map((g) => String(g).trim());
    if (typeof track.genres === "string")
      return track.genres
        .split(/[,|]/)
        .map((genre) => genre.trim())
        .filter(Boolean);
    if (typeof track.genre === "string")
      return track.genre
        .split(/[,|]/)
        .map((genre) => genre.trim())
        .filter(Boolean);
    return [];
  }, []);

  const allGenres = useMemo(() => {
    const set = new Set();
    tracks.forEach((track) =>
      normalizeGenres(track).forEach((genre) => set.add(genre)),
    );
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [tracks, normalizeGenres]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return tracks.filter((track) => {
      const textHit =
        !term ||
        track.title?.toLowerCase().includes(term) ||
        track.artist?.toLowerCase().includes(term) ||
        track.album?.toLowerCase().includes(term);
      const genreHit =
        !activeGenre || normalizeGenres(track).includes(activeGenre);
      return textHit && genreHit;
    });
  }, [tracks, query, activeGenre, normalizeGenres]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      switch (sortKey) {
        case "title":
        case "artist":
        case "album":
          return (
            String(a[sortKey] || "").localeCompare(String(b[sortKey] || "")) *
            dir
          );
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
  }, [filtered, sortKey, sortDir, normalizeGenres]);

  const rowRefs = useRef(new Map());
  useEffect(() => {
    if (!focusTrackId) return;
    const el = rowRefs.current.get(focusTrackId);
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focusTrackId, sorted]);

  const isCurrent = useCallback(
    () => controller?.tracks?.[controller.index],
    [controller],
  );

  const isPlayingHere = useCallback(
    (track) => isCurrent()?.id === track.id && isPlaying,
    [isCurrent, isPlaying],
  );

  const onSort = (key) => {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "releaseDate" ? "desc" : "asc");
    }
  };

  const buildActions = useCallback(
    (track) => {
      if (!track) return [];
      return [
        {
          label: "View info",
          onSelect: () => setDetailsOf(track),
        },
        {
          label: "Play",
          onSelect: () => playById?.(track.id),
        },
        {
          label: "Play next",
          onSelect: () => playNext?.(track.id),
        },
        {
          label: "View album",
          onSelect: () => {
            if (!track.album) return;
            setQuery(track.album);
            setActiveGenre("");
          },
          disabled: !track.album,
        },
        {
          label: "View artist",
          onSelect: () => {
            if (!track.artist) return;
            setQuery(track.artist);
            setActiveGenre("");
          },
          disabled: !track.artist,
        },
        {
          label: "Add to queue",
          onSelect: () => addToQueue?.(track.id),
        },
      ].filter(Boolean);
    },
    [addToQueue, playById, playNext],
  );

  const durationLabelFor = useCallback(
    (track) => track.length || track.duration || durations[track.id] || "--",
    [durations],
  );

  return (
    <section className="library">
      <div className="library__content">
        <div className="library__header">
          <h1>Library</h1>

          <div className="filtersRow">
            <div className="searchBox">
              <input
                type="text"
                placeholder="Search by Title, Artist or Album"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search library"
              />
            </div>

            <div className="genreControls">
              <button
                type="button"
                className="chip genreToggle"
                aria-expanded={showGenres}
                aria-controls="genreChips"
                onClick={() => setShowGenres((v) => !v)}
              >
                {showGenres ? "Hide genres" : "Genres"}
              </button>
              {activeGenre ? (
                <button
                  type="button"
                  className="chip isActive"
                  title="Clear genre filter"
                  onClick={() => setActiveGenre("")}
                >
                  {activeGenre} ×
                </button>
              ) : null}
            </div>

            {showGenres ? (
              <div className="genreChips" id="genreChips">
                <button
                  className={`chip ${!activeGenre ? "isActive" : ""}`}
                  onClick={() => setActiveGenre("")}
                >
                  All
                </button>
                {allGenres.map((genre) => (
                  <button
                    key={genre}
                    className={`chip ${activeGenre === genre ? "isActive" : ""}`}
                    onClick={() => setActiveGenre(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {isMobile ? (
          <div className="library__mobileList">
            {sorted.map((track) => {
              const playing = isPlayingHere(track);
              return (
                <div
                  key={track.id}
                  ref={(el) => rowRefs.current.set(track.id, el)}
                  className={`libCard ${playing ? "isPlaying" : ""}`}
                >
                  <button
                    type="button"
                    className="libCard__coverBtn"
                    onClick={() => playById?.(track.id)}
                    aria-label={playing ? "Pause" : "Play"}
                  >
                    {track.cover?.src ? (
                      <img
                        className="libCard__cover"
                        src={track.cover.src}
                        alt=""
                      />
                    ) : (
                      <div className="libCard__cover libCard__cover--placeholder" />
                    )}
                    <span className="libCard__overlay">
                      <img src={playing ? pauseIcon : playIcon} alt="" />
                    </span>
                  </button>

                  <div className="libCard__meta">
                    <div className="libCard__title">{track.title}</div>
                    <div className="libCard__artist">{track.artist}</div>
                    <div className="libCard__genres">
                      {normalizeGenres(track).join(", ")}
                    </div>
                  </div>

                  <TrackActionsMenu
                    track={track}
                    actions={buildActions(track)}
                    triggerClassName="libCard__more"
                    size="sm"
                    align="right"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="tableWrap">
            <table className="trackTable">
              <thead>
                <tr>
                  <th aria-label="Cover" />
                  <th onClick={() => onSort("title")}>
                    Title {sortKey === "title" && <SortArrow dir={sortDir} />}
                  </th>
                  <th onClick={() => onSort("artist")}>
                    Artist {sortKey === "artist" && <SortArrow dir={sortDir} />}
                  </th>
                  <th onClick={() => onSort("album")}>
                    Album {sortKey === "album" && <SortArrow dir={sortDir} />}
                  </th>
                  <th onClick={() => onSort("genre")}>
                    Genre {sortKey === "genre" && <SortArrow dir={sortDir} />}
                  </th>
                  <th onClick={() => onSort("releaseDate")}>
                    Released{" "}
                    {sortKey === "releaseDate" && <SortArrow dir={sortDir} />}
                  </th>
                  <th>Length</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>

              <tbody>
                {sorted.map((track) => {
                  const playing = isPlayingHere(track);
                  const coverSrc = track.cover?.src || FALLBACK_COVER;
                  const lengthStr = durationLabelFor(track);
                  return (
                    <tr
                      key={track.id}
                      ref={(el) => rowRefs.current.set(track.id, el)}
                      className={playing ? "isPlaying" : ""}
                    >
                      <td>
                        <button
                          className="coverBtn"
                          onClick={() => playById?.(track.id)}
                          aria-label={playing ? "Pause" : "Play"}
                          title={playing ? "Pause" : "Play"}
                        >
                          <img className="coverImg" src={coverSrc} alt="" />
                          <span className="coverOverlay">
                            <img src={playing ? pauseIcon : playIcon} alt="" />
                          </span>
                        </button>
                      </td>

                      <td className="cellTitle">{track.title}</td>
                      <td className="cellArtist">{track.artist}</td>
                      <td>{track.album || "--"}</td>
                      <td>{normalizeGenres(track).join(", ") || "--"}</td>
                      <td>{fmtDate(track.releaseDate)}</td>
                      <td>{lengthStr}</td>

                      <td className="cellInfo">
                        <TrackActionsMenu
                          track={track}
                          actions={buildActions(track)}
                          triggerClassName="cellInfo__trigger"
                          size="sm"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TrackDetailsModal
        track={detailsOf}
        onClose={() => setDetailsOf(null)}
        durationLabel={detailsOf ? durationLabelFor(detailsOf) : undefined}
        normalizeGenres={normalizeGenres}
        fmtDate={fmtDate}
      />
    </section>
  );
}

function SortArrow({ dir }) {
  return <span className="sortBadge">{dir === "asc" ? "↑" : "↓"}</span>;
}

function fmtDate(iso) {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "--";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function fmtTimeFromSeconds(totalSec) {
  const s = Math.max(0, Math.round(totalSec || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}
